###################
#   Dashboard Module   #
###################

from database import create_DB_connection
from json import dumps
import psycopg2
from flask import Blueprint, request, Response
from token_util import get_id_from_token

#######################
# GLOBAL DECLARATIONS #
#######################

DASHBOARD_ROUTES = Blueprint('dashboard', __name__)

###################################
# Please leave all functions here #
###################################

def get_user_dashboards(user_id):
    conn = create_DB_connection()
    cur = conn.cursor()
    sql_query = "SELECT id FROM dashboards WHERE user_id=%s"
    try:
        cur.execute(sql_query, (user_id, ))
        query_results = cur.fetchall()
    except:
        res = {
            'error': 'Error occurred while retrieving from store'
        }
        return res, 500
    finally:
        conn.close()
    if not query_results:
        res = {
            'error': 'User does not have existing dashboards'
        }
        return res, 404
        
    data = []
    for result in query_results:
        data.append(result[0])
    res = {
        'data': data
    }
    return res, 200


# Limit to 1 per user now, but leave room for extendability
def create_user_dashboard(user_id):
    conn = create_DB_connection()
    cur = conn.cursor()
    sql_query = "INSERT INTO dashboards (user_id) VALUES (%s)"
    try:
        cur.execute(sql_query, (user_id, ))
        conn.commit()
    except psycopg2.errors.UniqueViolation: 
        res = {
            'error': 'Dashboard already exists for user'
        }
        return res, 409
    except:
        res = {
            'error': 'Error occurred while inserting into store'
        }
        return res, 500
    finally:
        conn.close()
    res = {
        'message' : 'Dashboard created'
    }
    return res, 200


def delete_user_dashboard(dashboard_id):
    conn = create_DB_connection()
    cur = conn.cursor()
    sql_query = """
        DELETE FROM dashboards
        WHERE id=%s
        RETURNING id
    """
    try:
        cur.execute(sql_query, (dashboard_id, ))
        conn.commit()
        query_result = cur.fetchall()
        if not query_result:
            res = {
                'error': 'No dashboard exists with the given id'
            }
            return res, 404
    except:
        res = {
            'error': 'Error occurred while deleting from store'
        }
        return res, 500
    finally:
        conn.close()
    res = {
        'message' : 'Dashboard deleted'
    }
    return res, 200


def get_dashboard_blocks():
    pass


def create_dashboard_block():
    pass


def edit_dashboard_block():
    pass


def delete_dashboard_block():
    pass




################################
# Please leave all routes here #
################################


@DASHBOARD_ROUTES.route('/dashboard', methods=['GET', 'POST', 'DELETE'])
def user_dashboard_wrapper():
    token = request.headers.get('Authorization')
    user_id = get_id_from_token(token)
    # Get user's dashboards
    if request.method == 'GET':
        payload, status = get_user_dashboards(user_id)
    # Create user's dashboard (used for init purposes)
    elif request.method == 'POST':
        payload, status = create_user_dashboard(user_id)
    # Delete user's dashboard
    elif request.method == 'DELETE':
        dashboard_id = request.args.get('id')
        payload, status = delete_user_dashboard(dashboard_id)
    return Response(dumps(payload), status=status)

@DASHBOARD_ROUTES.route('/dashboard/<id>', methods=['GET', 'POST', 'PUT', 'DELETE'])
def dashboard_blocks_wrapper(id):
    token = request.headers.get('Authorization')
    user_id = get_id_from_token(token)
    # Get dashboard blocks
    if request.method == 'GET':
        # payload, status = get_dashboard_blocks(user_id)
    # Create new block
    elif request.method == 'POST':
        # payload, status = create_dashboard_block(user_id)
    # Edit an existing block
    elif request.method == 'PUT':
        # payload, status = edit_dashboard_block(user_id)
    # Delete a block
    elif request.method == 'DELETE':
        # payload, status = delete_dashboard_block(dashboard_id)
    return Response(dumps(payload), status=status)