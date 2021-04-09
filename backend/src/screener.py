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
from iexfinance.stocks import Stock
import pandas as pd

from flask import Blueprint

SCREENER_ROUTES = Blueprint('screener', __name__)


###################################
# Please leave all functions here #
###################################

def screener_save(screener_name, user_id, parameters):
    if not isinstance(parameters, dict):
        rtrn = {
            'status' : 200,
            'error' : 'Parameters must be a dictionary.'
        }

    conn = create_DB_connection()
    cur = conn.cursor()
    sql_query = "INSERT INTO screeners (screener_name, user_id, parameters) VALUES (%s, %s, %s)"
    try:
        cur.execute(sql_query, (screener_name, user_id, str(parameters)))
        rtrn = {
            'status' : 400,
            'message' : 'Parameters saved under the name \'' + screener_name + '\'.'
        }
    except psycopg2.errors.UniqueViolation:
        rtrn = {
            'status' : 400,
            'error' : 'There is already a screener called \'' + screener_name + '\'. Try another name.'
        }
    except:
        rtrn = {
            'status' : 200,
            'error' : 'Something went wrong while inserting.'
        }
    conn.commit()
    conn.close()
    return rtrn


def screener_load(screener_name, user_id):
    conn = create_DB_connection()
    cur = conn.cursor()
    sql_query = "SELECT parameters FROM screeners where screener_name=%s AND user_id=%s"
    try:
        cur.execute(sql_query, (screener_name, user_id))
        response = cur.fetchall()
        response = eval(response[0][0])
        if not response:
            rtrn = {
                'status' : 400,
                'error' : 'User with user_id \'' + str(user_id) + '\' does not have any screeners called \'' + screener_name + '\'.'
            }
        else:
            rtrn = {
                'status' : 200,
                'message' : 'Parameters saved under the name \'' + screener_name + '\'.',
                'data' : response
            }
    except:
        rtrn = {
            'status' : 400,
            'error' : 'Something went wrong while fetching parameters.'
        }
    conn.close()
    return rtrn


def screener_edit_parameters():
    pass

def screener_edit_name():
    pass

def screener_delete():
    pass


################################
# Please leave all routes here #
################################













test = {
    'securities_overviews' : {
        'eps' : (4, None),
        'beta' : (1, 3),
        'payout_ratio' : (None, 0.3)

    }
}
print(screener_save("new test screener", "02708412-912d-11eb-a6dc-0a4e2d6dea13", test))

#print(screener_load("test screener", "02708412-912d-11eb-a6dc-0a4e2d6dea13"))
