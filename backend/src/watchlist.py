########################
#   Watchlist Module   #
########################

import time
from flask import Blueprint, request
from json import dumps
from database import create_DB_connection
from token_util import get_id_from_token
from helpers import TimeSeries, AlphaVantageAPI
from datetime import datetime
from stock import retrieve_stock_price_at_date
from iexfinance.stocks import Stock
from portfolio import get_investments
import pandas as pd

from flask import Blueprint

WATCHLIST_ROUTES = Blueprint('watchlist', __name__)


###################################
# Please leave all functions here #
###################################

def publish_watchlist(user_id, portfolio_name, description):
    conn = create_DB_connection()
    cur = conn.cursor()
    investments_query = """
        SELECT h.stock_ticker, h.purchase_price 
        FROM holdings h, portfolios p 
        WHERE p.user_id = h.user_id AND p.portfolio_name=%s
    """
    cur.execute(investments_query, (portfolio_name, ))
    response = cur.fetchall()
    aggrigate = {}
    for ticker, price in response:
        if ticker not in aggrigate.keys():
            aggrigate[ticker] = price
        else:
            aggrigate[ticker] += price
    total_capital = sum(aggrigate.values())
    stocks = []
    proportions = []
    for key, value in aggrigate.items():
        stocks.append(key)
        proportions.append((value*100) / total_capital)

    watchlist_query = """
        INSERT INTO watchlists (user_id, watchlist_name, watchlist_description, stock_tickers, proportions)
        VALUES (%s, %s, %s, %s::VARCHAR(10)[], %s::DECIMAL(8,4)[])
        RETURNING *
    """
    try:
        cur.execute(watchlist_query, (user_id, portfolio_name, description, stocks, proportions))    
        conn.commit()
        rtrn = {
            'status' : 200,
            'message' : 'Watchlist called \'' + portfolio_name + '\' has been created.'
        }
    except:
        rtrn = {
            'status' : 400,
            'error' : 'Something went wrong while inserting.'
        }
    conn.close()
    return rtrn

# TEST this
def subcribe(user_id, watchlist_id):
    conn = create_DB_connection()
    cur = conn.cursor()
    sql_query = """
        INSERT INTO subscriptions (watchlist_id, user_id) VALUES (%s, %s)
    """
    try:
        cur.execute(sql_query, (user_id, watchlist_id))
        rtrn = {
            'status' : 200,
            'message' : 'User has been successfully subscribed.'
        }
    except psycopg2.errors.UniqueViolation:
        rtrn = {
            'status' : 400,
            'error' : 'The user is already subscribed to this watchlist.'
        }
    except:
        rtrn = {
            'status' : 400,
            'error' : 'Something went wrong while subscribing.'
        }
    conn.close()
    return rtrn

# TEST this
def unsubscribe(user_id, watchlist_id):
    conn = create_DB_connection()
    cur = conn.cursor()
    sql_query = """
        DELETE FROM subscriptions where user_id = %s and watchlist_id = %s
    """
    try:
        cur.execute(sql_query, (user_id, watchlist_id))
        conn.commit()
        rtrn = {
            'status' : 200,
            'message' : 'Successfully unsubscribed.'
        }
    except:
        rtrn = {
            'status' : 400,
            'error' : 'Something went wrong while unsubscribing.'
        }

    conn.close()
    return rtrn

# TEST this
def get_user_subscriptions(user_id):
    conn = create_DB_connection()
    cur = conn.cursor()
    sql_query = """
        SELECT watchlist_id FROM subscriptions where user_id = %s
    """
    try:
        cur.execute(sql_query, (user_id, ))
        response = cur.fetchall()
        rtrn = {
            'status' : 200,
            'message' : 'Subscription fetching successful.',
            'data' : response
        }
    except:
        rtrn = {
            'status' : 400,
            'error' : 'Something went wrong while deleting.'
        }

    conn.close()


def delete_watchlist(user_id, watchlist_id):
    conn = create_DB_connection()
    cur = conn.cursor()
    sql_query = "DELETE FROM subscriptions s, watchlists w WHERE user_id=%s AND watchlist_id=%s"
    cur.execute(sql_query, (user_id, title))
    conn.commit()
    conn.close()
    return {'status' : 200, 'message' : "Note removed"}



# TEST this
def get_all_watchlists():
    """
    returns a list containing dictionaries of each watchlist
    {
        watchlist_id:
        watchlist_name:
        watchlist_description:
        stocks: [{
                stock_ticker: 
                price:
                price change percentage:
                market_capitalisation:
                PE ratio:
                volume:
                portfolio proportion:
            }, ...]
            

    }
    """
    conn = create_DB_connection()
    cur = conn.cursor()
    sql_query="""
        SELECT w.watchlist_id, u.username, w.watchlist_name, w.watchlist_description, w.stock_tickers, w.proportions
        FROM watchlists w, users u
        WHERE u.id = w.user_id
    """
    cur.execute(sql_query)
    response = cur.fetchall()
    if not response:
        rtrn = {
            'status' : 200,
            'message' : 'There are no watchlists available.'
        }
    else:
        stocks = []
        for line in response:
            for s in line[4]:
                if s not in stocks:
                    stocks.append(s)
        batch = Stock(stocks)
        batch = batch.get_quote()
        data = []
        for watchlist_id, username, watchlist_name, description, companies, proportions in response:
            new_watchlist = {
                'watchlist id' : watchlist_id,
                'watchlist name' : username,
                'description' : description,
                'stocks' : []
            }
            for i in range(len(companies)):
                company = companies[i]
                proportion = proportions[i]
                new_stock = {
                    'stock ticker' : company,
                    'proportion' : proportion,
                    'price' : batch.latestPrice[company],
                    'price change percentage' : batch.changePercent[company],
                    'volume' : batch.volume[company],
                    'market capitalization' : batch.marketCap[company],
                    'PE ratio' : batch.peRatio[company]
                }
                new_watchlist['stocks'].append(new_stock)
            data.append(new_watchlist)
        rtrn = {
            'status' : 200,
            'message' : 'Successfully fetched all watchlists.',
            'data' : data
        }
    conn.close()
    return rtrn


################################
# Please leave all routes here #
################################
@WATCHLIST_ROUTES.route('/watchlist', methods=['POST'])
def publish_watchlist_wrapper():
    token = request.headers.get('Authorization')
    user_id = get_id_from_token(token)
    portfolio_name = request.args.get('name')
    data = request.get_json()
    result = publish_watchlist(user_id, portfolio_name, data['description'])
    return dumps(result)


# subscribe
@WATCHLIST_ROUTES.route('/watchlist/subscribe', methods=['PUT'])
def subcribe_wrapper():
    token = request.headers.get('Authorization')
    user_id = get_id_from_token(token)
    data = request.get_json()
    result = subcribe(user_id, data['watchlist_id'])
    return dumps(result)


# unsubscribe
@WATCHLIST_ROUTES.route('/watchlist/subscribe', methods=['DELETE'])
def unsubscribe_wrapper():
    token = request.headers.get('Authorization')
    user_id = get_id_from_token(token)
    data = request.get_json()
    result = unsubcribe(user_id, data['watchlist_id'])
    return dumps(result)


# get all watchlists
@WATCHLIST_ROUTES.route('/watchlist', methods=['GET'])
def get_all_notes_wrapper():
    result = get_all_notes()
    return dumps(result)
    

# get users watchlists
@WATCHLIST_ROUTES.route('/watchlist/userslist', methods=['GET'])
def get_user_subscriptions_wrapper():
    token = request.headers.get('Authorization')
    user_id = get_id_from_token(token)
    result = get_user_subscriptions(user_id)
    return dumps(result)

# delete
@WATCHLIST_ROUTES.route('/watchlist', methods=['DELETE'])
def delete_watchlist_wrapper():
    token = request.headers.get('Authorization')
    user_id = get_id_from_token(token)
    data = request.get_json()
    result = delete_watchlist(user_id, data['watchlist_id'])
    return dumps(result)




#print(publish_watchlist("02708412-912d-11eb-a6dc-0a4e2d6dea13", "Portfolio Performance test", "random description"))
#print(publish_watchlist("02708412-912d-11eb-a6dc-0a4e2d6dea13", "Portfolio Performance test1", "random description"))
res = get_all_watchlists()
for line in res['data']:
    print(line)


