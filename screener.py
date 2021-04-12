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

    if len(screener_name) > 30:
        rtrn = {
            'status' : 400,
            'error' : 'Screener name cannot be more than 30 characters. Try a new name.'
        }
        return rtrn

    conn = create_DB_connection()
    cur = conn.cursor()
    sql_query = "INSERT INTO screeners (screener_name, user_id, parameters) VALUES (%s, %s, %s)"
    try:
        cur.execute(sql_query, (screener_name, user_id, str(parameters)))
        rtrn = {
            'status' : 200,
            'message' : 'Parameters saved under the name \'' + screener_name + '\'.'
        }
    except psycopg2.errors.UniqueViolation:
        rtrn = {
            'status' : 400,
            'error' : 'There is already a screener called \'' + screener_name + '\'. Try another name.'
        }
    except:
        rtrn = {
            'status' : 400,
            'error' : 'Something went wrong while inserting.'
        }
    conn.commit()
    conn.close()
    return rtrn


def screener_load_all(user_id):
    conn = create_DB_connection()
    cur = conn.cursor()
    sql_query = "SELECT screener_name, parameters FROM screeners where user_id=%s"
    try:
        cur.execute(sql_query, (user_id, ))
        response = cur.fetchall()
        if not response:
            rtrn = {
                'status' : 400,
                'error' : 'User with user_id \'' + str(user_id) + '\' does not have any screeners.'
            }
        else:
            data =[]
            for row in response:
                new_screener = {
                    'name' : row[0],
                    'params' : eval(row[1])
                }
                data.append(new_screener)
            
            rtrn = {
                'status' : 200,
                'message' : 'Screener load successful.',
                'data' : data
            }
    except:
        rtrn = {
            'status' : 400,
            'error' : 'Something went wrong while fetching parameters.'
        }
    conn.close()
    return rtrn


def screener_delete(screener_name, user_id):
    conn = create_DB_connection()
    cur = conn.cursor()
    sql_query = "DELETE FROM screeners WHERE screener_name=%s AND user_id=%s"
    cur.execute(sql_query, (screener_name, user_id))
    conn.commit()
    conn.close()
    return {'status' : 200, 'message' : "Screen called \'" + screener_name + "\' have been removed."}


# Not being used?
def screener_edit_parameters(screener_name, user_id, parameters):
    conn = create_DB_connection()
    cur = conn.cursor()
    sql_query = "UPDATE screeners SET parameters=%s WHERE screener_name=%s AND user_id=%s"
    try:
        cur.execute(sql_query, (str(parameters), screener_name, user_id))
        rtrn = {
            'status' : 200, 
            'message' :  'Screen called \'' + screener_name + '\' has been updated.'
        }
    except:
        rtrn = {
            'status' : 400,
            'error' : 'Something went wrong when updating screeners.'
        }
    conn.commit()
    conn.close()
    return rtrn


################################
# Please leave all routes here #
################################

@SCREENER_ROUTES.route('/screener', methods=['POST'])
def screener_save_wrapper():
    token = request.headers.get('Authorization')
    user_id = get_id_from_token(token)
    screener_name = request.args.get('name')
    data = request.get_json()
    result = screener_save(screener_name, user_id, data['parameters'])
    return dumps(result)


@SCREENER_ROUTES.route('/screener', methods=['GET'])
def screener_load_wrapper():
    token = request.headers.get('Authorization')
    user_id = get_id_from_token(token)
    result = screener_load_all(user_id)
    return dumps(result)


@SCREENER_ROUTES.route('/screener', methods=['DELETE'])
def screener_delete_wrapper():
    token = request.headers.get('Authorization')
    user_id = get_id_from_token(token)
    screener_name = request.args.get('name')
    result = screener_delete(screener_name, user_id)
    return dumps(result)











test1 = {
    'securities_overviews' : {
        'eps' : (4, None),
        'beta' : (1, 3),
        'payout_ratio' : (None, 0.3)

    }
}
#print(screener_save("new test screener", "02708412-912d-11eb-a6dc-0a4e2d6dea13", test1))
#print(screener_save("test screener", "02708412-912d-11eb-a6dc-0a4e2d6dea13", test1))
#print(screener_load("test screener", "02708412-912d-11eb-a6dc-0a4e2d6dea13"))
#print(screener_delete("new test screener", "02708412-912d-11eb-a6dc-0a4e2d6dea13"))
test2 = {
    'securities_overviews' : {
        'eps' : (4, 8),
        'beta' : (1, None),
        'payout_ratio' : (None, 0.3)
    }    
}
#print(screener_save("another test screener", "02708412-912d-11eb-a6dc-0a4e2d6dea13", test2))
#print(screener_edit_parameters("test screener", "02708412-912d-11eb-a6dc-0a4e2d6dea13", test2))
#print(screener_load_all("02708412-912d-11eb-a6dc-0a4e2d6dea13"))

