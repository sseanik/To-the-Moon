#######################
#   Screener Module   #
#######################
import time
from flask import Blueprint, request
from json import dumps
from database import create_DB_connection
from token_util import get_id_from_token
from helpers import TimeSeries, AlphaVantageAPI
from datetime import datetime
from stock import retrieve_stock_price_at_date
from iexfinance.stocks import Stock
import pandas as pd

from flask import Blueprint

SCREENER_ROUTES = Blueprint('screener', __name__)


###################################
# Please leave all functions here #
###################################

def screener_save(screener_name, user_id, parameters):
    conn = create_DB_connection()
    cur = conn.cursor()
    sql_query = "INSERT INTO screeners (screener_name, user_id, parameters) VALUES (%s, %s, %s)"
    try:
        cur.execute(sql_query, (screener_name, user_id, str(parameters)))
        rtrn = {
            'status' : 200,
            'message' : 'Parameters saved under the name \'' + screener_name + '\'.'
        }
    except:
        rtrn = {
            'status' : 200,
            'error' : 'Something went wrong while inserting.'
        }
    conn.commit()
    conn.close()
    return rtrn


def screener_load(parameters):
    
    pass

def screener_edit():
    pass

def screener_delete():
    pass

################################
# Please leave all routes here #
################################

