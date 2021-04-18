#######################
#   Screener Module   #
#######################
import time
from flask import Blueprint, request, Response
from json import dumps, loads
from database import create_DB_connection
from token_util import get_id_from_token
from datetime import datetime
import psycopg2
from stock import retrieve_stock_price_at_date
import pandas as pd
from psycopg2.extras import RealDictCursor
from better_profanity import profanity
import psycopg2.extras
from iexfinance.stocks import Stock


from werkzeug.datastructures import ImmutableMultiDict
from flask_restx import Namespace, Resource, abort
from models import screeners_post_delete_data_parser, screeners_get_apply_screener_parser

SCREENER_NS = Namespace("screener", "Search parameters for companies and stock offerings")


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

    overviews_query = "SELECT stock_ticker FROM securities_overviews "
    param_list = []
    values = []
    for key, item in parameters["securities_overviews"].items():
        new_param = ""
        if isinstance(item, str) or isinstance(item, (int, float)):
            new_param = "{key}=%s".format(key=key)
            values.append(item)
        elif isinstance(item, list) and key in ["exchange", "sector", "industry"]:
            if len(item) >= 1 and item[0]:
                new_param = "{key} IN %s".format(key=key)
                values.append(tuple(item))
        elif isinstance(item, list) and key not in ["exchange", "sector", "industry"]:
            min = item[0]
            max = item[1]
            if min != None and max != None:
                new_param = "{key} > %s AND {key} < %s".format(key=key)
                values.append(min)
                values.append(max)
            elif min == None and max != None:
                new_param = "{key} < %s".format(key=key)
                values.append(max)
            elif min != None and max == None:
                new_param = "{key} > %s".format(key=key)
                values.append(min)
            else:
                new_param = ""
        # overviews_query += new_param
        if new_param:
            param_list.append(new_param)
            # overviews_query += " AND "

    if len(param_list) > 0:
        overviews_query += "WHERE "
    overviews_query += " AND ".join(param_list)
    # overviews_query = overviews_query[:-5]
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

def make_params_object(args):
    result = {}

    if type(args) == ImmutableMultiDict:
        exchange = args.getlist("exchange")
        market_cap = args.getlist("market_cap")
        market_cap[0] = float(market_cap[0]) if market_cap[0] else None
        market_cap[1] = float(market_cap[1]) if market_cap[1] else None
        yearly_low = float(args.get("yearly_low")) if args.get("yearly_low") else None
        yearly_high = float(args.get("yearly_high")) if args.get("yearly_high") else None
        eps = args.getlist("eps")[0:2]
        beta = args.getlist("beta")[0:2]
        payout_ratio = args.getlist("payout_ratio")[0:2]

        eps[0] = float(eps[0]) if eps[0] else None
        eps[1] = float(eps[1]) if eps[1] else None
        beta[0] = float(beta[0]) if beta[0] else None
        beta[1] = float(beta[1]) if beta[1] else None
        payout_ratio[0] = float(payout_ratio[0]) if payout_ratio[0] else None
        payout_ratio[1] = float(payout_ratio[1]) if payout_ratio[1] else None

        sector = args.getlist("sector")
        industry = args.getlist("Industry")
        result = {
            "securities_overviews": {
                "exchange": exchange,
                "market_cap": market_cap,
                "yearly_low": yearly_low,
                "yearly_high": yearly_high,
                "eps": eps,
                "beta": beta,
                "payout_ratio": payout_ratio,
                "sector": sector,
                "industry": industry,
            }
        }
    else:
        result = {"securities_overviews": {}}
    return result

################################
# Please leave all routes here #
################################


@SCREENER_NS.route("")
class ScreenerApply(Resource):
    @SCREENER_NS.doc(description="Apply screener parameters to query database and return list of matching companies. ")
    @SCREENER_NS.response(200, "Successfully fetched screener information")
    @SCREENER_NS.response(400, "Screener apply failed")
    @SCREENER_NS.response(404, "Screener API Not Available")
    @SCREENER_NS.expect(screeners_get_apply_screener_parser(SCREENER_NS), validate=True)
    def get(self):
        screener_args = request.args
        parameters = make_params_object(screener_args)
        result = screen_stocks(parameters)
        return Response(dumps(result), status=200)

@SCREENER_NS.route("/save")
class ScreenerSave(Resource):
    @SCREENER_NS.doc(description="Save screener parameters by name and user. ")
    @SCREENER_NS.response(200, "Successfully saved screener")
    @SCREENER_NS.response(404, "Screener save failed")
    @SCREENER_NS.expect(screeners_post_delete_data_parser(SCREENER_NS), validate=True)
    def post(self):
        token = request.headers.get("Authorization")
        user_id = get_id_from_token(token)
        screener_name = request.args.get("name")
        data = request.get_json()
        result = screener_save(screener_name, user_id, data)
        return Response(dumps(result), status=201)


@SCREENER_NS.route("/delete")
class ScreenerSave(Resource):
    @SCREENER_NS.doc(description="Delete screeners by name. ")
    @SCREENER_NS.response(200, "Successfully deleted screener")
    @SCREENER_NS.response(404, "Screener delete failed")
    @SCREENER_NS.expect(screeners_post_delete_data_parser(SCREENER_NS), validate=True)
    def delete(self):
        token = request.headers.get("Authorization")
        user_id = get_id_from_token(token)
        screener_name = request.args.get("name")
        result = screener_delete(screener_name, user_id)
        return Response(dumps(result), status=200)


@SCREENER_NS.route("/load")
class Load(Resource):
    @SCREENER_NS.doc(description="Load screeners by user. ")
    @SCREENER_NS.response(200, "Successfully fetched list of screeners")
    @SCREENER_NS.response(404, "Screener load failed")
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
