#######################
#   Screener Module   #
#######################
import time
import psycopg2
from psycopg2.extras import RealDictCursor
from database import create_DB_connection
from token_util import get_id_from_token
from better_profanity import profanity
from json import dumps
from flask import Blueprint, request
import psycopg2.extras
from iexfinance.stocks import Stock


from flask import Blueprint

SCREENER_ROUTES = Blueprint('screener', __name__)


###################################
# Please leave all functions here #
###################################

def screen_stocks(parameters):
    if not isinstance(parameters, dict):
        rtrn = {
            'status' : 400,
            'error' : 'Parameters must be a dictionary.'
        }

    conn = create_DB_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    overviews_query = "SELECT stock_ticker FROM securities_overviews WHERE "
    values = []
    for key, item in parameters['securities_overviews'].items():
        new_param = ""
        if isinstance(item, str):
            new_param = "{key}=%s".format(key=key)
            values.append(item)
        else:
            min = item[0]
            max = item[1]
            if (min != None and max != None):
                new_param = "{key} > %s AND {key} < %s".format(key=key)
                values.append(min)
                values.append(max)
            elif (min == None):
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
        data = {
            "status" : 400, 
            "error" : "There are not stocks which fit those parameters."
            }
    else:
        stocks = []
        for s in rtrn:
            stocks.append(s['stock_ticker'])
        batch = Stock(stocks)
        batch = batch.get_quote()
        data = {
            "status" : 200,
            "message" : "Screen successfull.",
            "data" : []
        }
        for s in stocks:
            new_stock = {
                'stock ticker' : s,
                'price' : batch.latestPrice[s],
                'price change' : batch.change[s],
                'price change percentage' : batch.changePercent[s],
                'volume' : batch.volume[s],
                'market capitalization' : batch.marketCap[s],
                'PE ratio' : batch.peRatio[s]
            }
            data['data'].append(new_stock)

    conn.close()
    return data


################################
# Please leave all routes here #
################################
SCREENER_ROUTES.route('\screener', methods=['GET'])
def screen_stocks_wrapper():
    data = request.get_json()
    parameters = data['parameters']
    return dumps(screen_stocks(parameters))





test = {
    'securities_overviews' : {
        'eps' : (4, None),
        'beta' : (1, 3),
        'payout_ratio' : (None, 0.3)

    }
}

print(screen_stocks(test))



