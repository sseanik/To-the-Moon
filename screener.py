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

def screener_save(screener_title, user_id, parameters):
    conn = create_DB_connection()
    cur = conn.cursor()
    sql_query = "INSERT INTO screeners "


    conn.commit()
    conn.close()

def screener_load(parameters):
    pass

################################
# Please leave all routes here #
################################

