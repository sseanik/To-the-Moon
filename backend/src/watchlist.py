########################
#   Watchlist Module   #
########################

import psycopg2
from flask import Blueprint, request
from json import dumps
from database import create_DB_connection
from token_util import get_id_from_token
from iexfinance.stocks import Stock
import simplejson
from decimal import Decimal


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

    conn.commit()
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
        cur.execute(sql_query, (watchlist_id, user_id))
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

    conn.commit()
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

    conn.commit()
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
            'data' : list(map(lambda x: x[0], response))
        }
    except:
        rtrn = {
            'status' : 400,
            'error' : 'Something went wrong while deleting.'
        }

    conn.close()
    return rtrn


def delete_watchlist(user_id, watchlist_id):
    conn = create_DB_connection()
    cur = conn.cursor()
    sql_query = "DELETE FROM subscriptions s, watchlists w WHERE user_id=%s AND watchlist_id=%s"
    cur.execute(sql_query, (user_id, watchlist_id))
    conn.commit()
    conn.close()
    return {'status' : 200, 'message' : "Watchlist removed"}



# TEST this
def get_all_watchlists():
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
            'message' : 'There are no watchlists available.',
            'data' : []
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
                'watchlist_id' : watchlist_id,
                'watchlist_name' : watchlist_name,
                'author_username' : username,
                'description' : description,
                'stocks' : []
            }
            for i in range(len(companies)):
                company = companies[i]
                proportion = proportions[i]
                new_stock = {
                    'stock_ticker' : company,
                    'proportion' : Decimal(proportion),
                    'price' : batch.latestPrice[company],
                    'price_change_percentage' : batch.changePercent[company],
                    'volume' : batch.volume[company],
                    'market_capitalization' : batch.marketCap[company],
                    'PE_ratio' : batch.peRatio[company]
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


def get_watchlist(watchlist_id):
    conn = create_DB_connection()
    cur = conn.cursor()
    sql_query="""
        SELECT w.watchlist_id, u.username, w.watchlist_name, w.watchlist_description, w.stock_tickers, w.proportions
        FROM watchlists w, users u
        WHERE u.id = w.user_id AND w.watchlist_id = %s
    """
    cur.execute(sql_query, (watchlist_id, ))
    response = cur.fetchall()[0]
    if not response:
        rtrn = {
            'status' : 200,
            'message' : 'There are no watchlists with ID \'' + str(watchlist_id) + '\'.'
        }
    else:
        stocks = []
        companies = response[4]
        proportions = response[5]
        for s in companies:
            if s not in stocks:
                stocks.append(s)
        batch = Stock(stocks)
        batch = batch.get_quote()
        watchlist = {
                'watchlist_id' : response[0],
                'author_username' : response[1],
                'watchlist_name' : response[2],
                'description' : response[3],
                'stocks' : []
            }
        for i in range(len(companies)):
            company = companies[i]
            proportion = proportions[i]
            new_stock = {
                'stock_ticker' : company,
                'proportion' : proportion,
                'price' : batch.latestPrice[company],
                'price_change_percentage' : batch.changePercent[company],
                'volume' : batch.volume[company],
                'market_capitalization' : batch.marketCap[company],
                'PE_ratio' : batch.peRatio[company]
            }
            watchlist['stocks'].append(new_stock)
        rtrn = {
            'status' : 200,
            'message' : 'Successfully fetched the watchlists.',
            'data' : watchlist
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
    data = request.get_json()
    result = publish_watchlist(user_id, data['portfolio_name'], data['description'])
    return dumps(result)


# subscribe
@WATCHLIST_ROUTES.route('/watchlist/subscribe', methods=['POST'])
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
    result = unsubscribe(user_id, data['watchlist_id'])
    return dumps(result)


# get all watchlists
@WATCHLIST_ROUTES.route('/watchlist/get_all', methods=['GET'])
def get_all_watchlists_wrapper():
    result = get_all_watchlists()
    return simplejson.dumps(result)


# get a single watchlist
@WATCHLIST_ROUTES.route('/watchlist/get_watchlist', methods=['GET'])
def get_watchlist_wrapper():
    watchlist_id = request.args.get('watchlist_id')
    result = get_watchlist(watchlist_id)
    return simplejson.dumps(result)


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
