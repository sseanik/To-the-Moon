# ---------------------------------------------------------------------------- #
#                               Watchlist Module                               #
# ---------------------------------------------------------------------------- #

from json import dumps
from decimal import Decimal
import psycopg2
import simplejson

from flask import request, Response
from flask_restx import Namespace, Resource, abort
from iexfinance.stocks import Stock

from database import create_DB_connection
from token_util import get_id_from_token

# ---------------------------------------------------------------------------- #
#                              GLOBAL DECLARATIONS                             #
# ---------------------------------------------------------------------------- #

WATCHLIST_NS = Namespace(
    "watchlist", "Watchlist content published and followed by users"
)


# ---------------------------------------------------------------------------- #
#                               Helper Functions                               #
# ---------------------------------------------------------------------------- #


def publish_watchlist(user_id, portfolio_name, description):
    """Transforms a portfolio into a watchlist. Watchlists have the same name as the original portfolio.
    Watchlists only store the stock tickers from the original portfolios, and its proportion of the
    portfolio's invested capital.

    Args:
        user_id (uuid): Identifies the user
        portfolio_name (string): [description]
        description (string): [description]

    Returns:
        dictionary: On success this function returns a message that the watchlist was created.
    """    

    conn = create_DB_connection()
    cur = conn.cursor()
    investments_query = """
        SELECT stock_ticker, purchase_price 
        FROM holdings 
        WHERE portfolio_name=%s AND user_id=%s;
    """
    cur.execute(investments_query, (portfolio_name, user_id))
    response = cur.fetchall()
    aggregate = {}
    for ticker, price in response:
        if ticker not in aggregate.keys():
            aggregate[ticker] = price
        else:
            aggregate[ticker] += price
    total_capital = sum(aggregate.values())
    stocks = []
    proportions = []
    for key, value in aggregate.items():
        stocks.append(key)
        proportions.append((value * 100) / total_capital)

    watchlist_query = """
        INSERT INTO watchlists (user_id, watchlist_name, watchlist_description, stock_tickers, proportions)
        VALUES (%s, %s, %s, %s::VARCHAR(10)[], %s::DECIMAL(8,4)[])
        RETURNING *
    """
    try:
        cur.execute(
            watchlist_query, (user_id, portfolio_name, description, stocks, proportions)
        )
        conn.commit()
        result = {
            "message": "Watchlist called '" + portfolio_name + "' has been created.",
        }
    except:
        abort(400, "Something went wrong while inserting.")

    conn.commit()
    conn.close()
    return result


def subscribe(user_id, watchlist_id):
    """Implements backend functionality for following a watchlist. 

    Args:
        user_id (uuid): user identifier.
        watchlist_id (uuid): user identifier.

    Returns:
        dictionary: On success this function returns a message that the user has been subscribed.
    """    
    conn = create_DB_connection()
    cur = conn.cursor()
    sql_query = """
        INSERT INTO subscriptions (watchlist_id, user_id) VALUES (%s, %s)
    """
    try:
        cur.execute(sql_query, (watchlist_id, user_id))
        result = {"message": "User has been successfully subscribed."}
    except psycopg2.errors.UniqueViolation:
        abort(400, "The user is already subscribed to this watchlist.")
    except:
        abort(400, "Something went wrong while subscribing.")

    conn.commit()
    conn.close()
    return result


def unsubscribe(user_id, watchlist_id):
    """Implements backend functionality for unfollowing a watchlists.

    Args:
        user_id (uuid): user identifier.
        watchlist_id (uuid): user identifier.

    Returns:
        dictionary: On success this function returns a message that the user has been unsubscribed.
    """    
    conn = create_DB_connection()
    cur = conn.cursor()
    sql_query = """
        DELETE FROM subscriptions where user_id = %s and watchlist_id = %s
    """
    try:
        cur.execute(sql_query, (user_id, watchlist_id))
        conn.commit()
        result = {"message": "Successfully unsubscribed."}
    except:
        abort(400, "Something went wrong while unsubscribing.")

    conn.commit()
    conn.close()
    return result


def get_user_subscriptions(user_id):
    """Fetches a users followed watchlists.

    Args:
        user_id (uuid): user identifier.

    Returns:
        dictionary: contains a confirmation message and a list of watchlist_id's that the user is following.
    """    
    conn = create_DB_connection()
    cur = conn.cursor()
    sql_query = """
        SELECT watchlist_id FROM subscriptions where user_id = %s
    """
    try:
        cur.execute(sql_query, (user_id,))
        response = cur.fetchall()
        result = {
            "message": "Subscription fetching successful.",
            "data": list(map(lambda x: x[0], response)),
        }
    except:
        abort(400, "Something went wrong while deleting.")

    conn.close()
    return result


def delete_watchlist(user_id, watchlist_id):
    """Removes a watchlist from the database so it is no longer a watchlist

    Args:
        user_id (uuid): user identifier.
        watchlist_id (uuid): user identifier.

    Returns:
        dictionary: On success this function returns a message that the watchlist has been removed.
    """    
    conn = create_DB_connection()
    cur = conn.cursor()
    sql_query = """DELETE FROM subscriptions WHERE user_id=%s AND watchlist_id=%s;
    DELETE FROM watchlists WHERE user_id=%s AND watchlist_id=%s"""
    cur.execute(sql_query, (user_id, watchlist_id, user_id, watchlist_id))
    conn.commit()
    conn.close()
    return {"message": "Watchlist removed"}


def get_all_watchlists():
    """Fetches all the watchlists available.

    Returns:
        list of dictionaries: each list item holds a watchlist dictionary. Watchlist dictionaries contain information on
        the watchlist, and a list of stock dictionaries. Stock dictionaries hold info about that stock position and the
        stocks company.
    """    
    conn = create_DB_connection()
    cur = conn.cursor()
    sql_query = """
        SELECT w.watchlist_id, u.username, w.watchlist_name, w.watchlist_description, w.stock_tickers, w.proportions
        FROM watchlists w, users u
        WHERE u.id = w.user_id
    """
    cur.execute(sql_query)
    response = cur.fetchall()
    if not response:
        result = {
            "message": "There are no watchlists available.",
            "data": [],
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
        for (
            watchlist_id,
            username,
            watchlist_name,
            description,
            companies,
            proportions,
        ) in response:
            new_watchlist = {
                "watchlist_id": watchlist_id,
                "watchlist_name": watchlist_name,
                "author_username": username,
                "description": description,
                "stocks": [],
            }
            for i in range(len(companies)):
                company = companies[i]
                proportion = proportions[i]
                new_stock = {
                    "stock_ticker": company,
                    "proportion": Decimal(proportion),
                    "price": batch.latestPrice[company],
                    "price_change_percentage": batch.changePercent[company],
                    "volume": batch.latestVolume[company],
                    "market_capitalization": batch.marketCap[company],
                    "PE_ratio": batch.peRatio[company],
                }
                new_watchlist["stocks"].append(new_stock)
            data.append(new_watchlist)
        result = {
            "message": "Successfully fetched all watchlists.",
            "data": data,
        }

    conn.close()
    return result


def get_watchlist(watchlist_id):
    """Fetches a specific watchlist.

    Args:
        watchlist_id (uuid): user identifier.

    Returns:
        dictionary: returns a watchlist dictionary holding information about the watchlist. Also holds a list of stock dictionaries.
        Each of these stock dictionaries holds information about that stock position and the stocks company. 
    """    
    conn = create_DB_connection()
    cur = conn.cursor()
    sql_query = """
        SELECT w.watchlist_id, u.username, w.watchlist_name, w.watchlist_description, w.stock_tickers, w.proportions
        FROM watchlists w, users u
        WHERE u.id = w.user_id AND w.watchlist_id = %s
    """
    cur.execute(sql_query, (watchlist_id,))
    response = cur.fetchall()[0]
    if not response:
        abort(400, "There are no watchlists with ID '" + str(watchlist_id) + "'.")
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
            "watchlist_id": response[0],
            "author_username": response[1],
            "watchlist_name": response[2],
            "description": response[3],
            "stocks": [],
        }
        for i, _ in enumerate(companies):
            company = companies[i]
            proportion = proportions[i]
            new_stock = {
                "stock_ticker": company,
                "proportion": proportion,
                "price": batch.latestPrice[company],
                "price_change_percentage": batch.changePercent[company],
                "volume": batch.latestVolume[company],
                "market_capitalization": batch.marketCap[company],
                "PE_ratio": batch.peRatio[company],
            }
            watchlist["stocks"].append(new_stock)
        result = {
            "message": "Successfully fetched the watchlists.",
            "data": watchlist,
        }

    conn.close()
    return result


# ---------------------------------------------------------------------------- #
#                                    Routes                                    #
# ---------------------------------------------------------------------------- #


@WATCHLIST_NS.route("")
class Watchlist(Resource):
    def post(self):
        token = request.headers.get("Authorization")
        user_id = get_id_from_token(token)
        data = request.get_json()
        result = publish_watchlist(user_id, data["portfolio_name"], data["description"])
        return Response(dumps(result), status=201)

    def delete(self):
        token = request.headers.get("Authorization")
        user_id = get_id_from_token(token)
        data = request.get_json()
        result = delete_watchlist(user_id, data["watchlist_id"])
        return Response(dumps(result), status=200)

    # Retrieve a single watchlist
    def get(self):
        watchlist_id = request.args.get("watchlist_id")
        result = get_watchlist(watchlist_id)
        return Response(simplejson.dumps(result), status=200)


@WATCHLIST_NS.route("/subscribe")
class Subscribe(Resource):
    def post(self):
        token = request.headers.get("Authorization")
        user_id = get_id_from_token(token)
        data = request.get_json()
        result = subscribe(user_id, data["watchlist_id"])
        return Response(dumps(result), status=201)

    def delete(self):
        token = request.headers.get("Authorization")
        user_id = get_id_from_token(token)
        data = request.get_json()
        result = unsubscribe(user_id, data["watchlist_id"])
        return Response(dumps(result), status=200)


@WATCHLIST_NS.route("/get_all")
class AllWatchlists(Resource):
    def get(self):
        result = get_all_watchlists()
        return Response(simplejson.dumps(result), status=200)


@WATCHLIST_NS.route("/userslist", methods=["GET"])
class Userlists(Resource):
    def get(self):
        token = request.headers.get("Authorization")
        user_id = get_id_from_token(token)
        result = get_user_subscriptions(user_id)
        return Response(dumps(result), status=200)
