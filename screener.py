#######################
#   Screener Module   #
#######################
import time
from flask import Blueprint, request
from json import dumps, loads
from database import create_DB_connection
from token_util import get_id_from_token
from helpers import TimeSeries, AlphaVantageAPI
from datetime import datetime
import psycopg2
from stock import retrieve_stock_price_at_date
import pandas as pd
from psycopg2.extras import RealDictCursor
from better_profanity import profanity
import psycopg2.extras
from iexfinance.stocks import Stock


from flask_restx import Namespace, Resource


SCREENER_NS = Namespace("screener", "Authentication and Authorisation of Users")


###################################
# Please leave all functions here #
###################################


def screener_save(screener_name, user_id, parameters):

    if len(screener_name) > 30:
        abort(400, "Screener name cannot be more than 30 characters. Try a new name.")

    conn = create_DB_connection()
    cur = conn.cursor()
    sql_query = (
        "INSERT INTO screeners (screener_name, user_id, parameters) VALUES (%s, %s, %s)"
    )
    try:
        cur.execute(sql_query, (screener_name, user_id, str(parameters)))
        rtrn = {
            "message": "Parameters saved under the name '" + screener_name + "'.",
        }
    except psycopg2.errors.UniqueViolation:
        abort(
            400,
            "There is already a screener called '"
            + screener_name
            + "'. Try another name.",
        )

    except:
        abort(400, "Something went wrong while inserting.")

    conn.commit()
    conn.close()
    return rtrn


def screener_load_all(user_id):
    conn = create_DB_connection()
    cur = conn.cursor()
    sql_query = "SELECT screener_name, parameters FROM screeners where user_id=%s"
    try:
        cur.execute(sql_query, (user_id,))
        response = cur.fetchall()
        if not response:
            abort(
                400,
                "User with user_id '" + str(user_id) + "' does not have any screeners.",
            )
        else:
            data = []
            for row in response:
                new_screener = {"name": row[0], "params": eval(row[1])}
                data.append(new_screener)

            rtrn = {"message": "Screener load successful.", "data": data}
    except:
        abort(400, "Something went wrong while fetching parameters.")
    conn.close()
    return rtrn


def screener_delete(screener_name, user_id):
    conn = create_DB_connection()
    cur = conn.cursor()
    sql_query = "DELETE FROM screeners WHERE screener_name=%s AND user_id=%s"
    cur.execute(sql_query, (screener_name, user_id))
    conn.commit()
    conn.close()
    return {
        "message": "Screen called '" + screener_name + "' have been removed.",
    }


# Not being used?
def screener_edit_parameters(screener_name, user_id, parameters):
    conn = create_DB_connection()
    cur = conn.cursor()
    sql_query = (
        "UPDATE screeners SET parameters=%s WHERE screener_name=%s AND user_id=%s"
    )
    try:
        cur.execute(sql_query, (str(parameters), screener_name, user_id))
        rtrn = {
            "message": "Screen called '" + screener_name + "' has been updated.",
        }
    except:
        abort(400, "Something went wrong when updating screeners.")

    conn.commit()
    conn.close()
    return rtrn


def screen_stocks(parameters):
    if not isinstance(parameters, dict):
        abort(400, "Parameters must be a dictionary.")

    conn = create_DB_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    overviews_query = "SELECT stock_ticker FROM securities_overviews WHERE "
    values = []
    for key, item in parameters["securities_overviews"].items():
        new_param = ""
        if isinstance(item, str):
            new_param = "{key}=%s".format(key=key)
            values.append(item)
        else:
            min = item[0]
            max = item[1]
            if min != None and max != None:
                new_param = "{key} > %s AND {key} < %s".format(key=key)
                values.append(min)
                values.append(max)
            elif min == None:
                new_param = "{key} < %s".format(key=key)
                values.append(max)
            else:
                new_param = "{key} > %s".format(key=key)
                values.append(min)
        overviews_query += new_param
        overviews_query += " AND "
    overviews_query = overviews_query[:-5]
    values = tuple(values)
    cur.execute(overviews_query, values)

    rtrn = cur.fetchall()
    if not rtrn:
        abort(400, "There are no stocks which fit those parameters.")
    else:
        stocks = []
        for s in rtrn:
            stocks.append(s["stock_ticker"])
        batch = Stock(stocks)
        batch = batch.get_quote()
        data = {"message": "Screen successfull.", "data": []}
        for s in stocks:
            new_stock = {
                "stock ticker": s,
                "price": batch.latestPrice[s],
                "price change": batch.change[s],
                "price change percentage": batch.changePercent[s],
                "volume": batch.volume[s],
                "market capitalization": batch.marketCap[s],
                "PE ratio": batch.peRatio[s],
            }
            data["data"].append(new_stock)

    conn.close()
    return data


################################
# Please leave all routes here #
################################


@SCREENER_NS.route("")
class Screener(Resource):
    def get(self):
        data = request.get_json()
        parameters = data["parameters"]
        result = screen_stocks(parameters)
        return Response(dumps(result), status=200)

    def post(self):
        token = request.headers.get("Authorization")
        user_id = get_id_from_token(token)
        screener_name = request.args.get("name")
        data = request.get_json()
        result = screener_save(screener_name, user_id, data["parameters"])
        return Response(dumps(result), status=201)

    def delete(self):
        token = request.headers.get("Authorization")
        user_id = get_id_from_token(token)
        screener_name = request.args.get("name")
        result = screener_delete(screener_name, user_id)
        return Response(dumps(result), status=200)


@SCREENER_NS.route("/load")
class Load(Resource):
    def get(self):
        token = request.headers.get("Authorization")
        user_id = get_id_from_token(token)
        result = screener_load_all(user_id)
        return Response(dumps(result), status=200)


test1 = {
    "securities_overviews": {
        "eps": (4, None),
        "beta": (1, 3),
        "payout_ratio": (None, 0.3),
    }
}
# print(screener_save("new test screener", "02708412-912d-11eb-a6dc-0a4e2d6dea13", test1))
# print(screener_save("test screener", "02708412-912d-11eb-a6dc-0a4e2d6dea13", test1))
# print(screener_load("test screener", "02708412-912d-11eb-a6dc-0a4e2d6dea13"))
# print(screener_delete("new test screener", "02708412-912d-11eb-a6dc-0a4e2d6dea13"))
test2 = {
    "securities_overviews": {
        "eps": (4, 8),
        "beta": (1, None),
        "payout_ratio": (None, 0.3),
    }
}
# print(screener_save("another test screener", "02708412-912d-11eb-a6dc-0a4e2d6dea13", test2))
# print(screener_edit_parameters("test screener", "02708412-912d-11eb-a6dc-0a4e2d6dea13", test2))
# print(screener_load_all("02708412-912d-11eb-a6dc-0a4e2d6dea13"))

# print(screen_stocks(test))
