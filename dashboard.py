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
    sql_query = "SELECT id, content FROM dashboards WHERE user_id=%s"
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
            'error': 'User does not have existing dashboard'
        }
        return res, 404
        
    data = []
    for result in query_results:
        dashboard = {
            'id': result[0],
            'content': result[1]
        }
        data.append(dashboard)
    res = {
        'data': data
    }
    return res, 200


# Limit to 1 per user, but leave room for extensibility
def create_user_dashboard(user_id):
    conn = create_DB_connection()
    cur = conn.cursor()
    sql_query = "INSERT INTO dashboards (user_id, content) VALUES (%s, %s)"
    try:
        initial_content = {
            'content': []
        }
        json = dumps(initial_content, separators=(',', ':'))
        cur.execute(sql_query, (user_id, json))
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


def edit_user_dashboard(dashboard_id, content):
    conn = create_DB_connection()
    cur = conn.cursor()
    sql_query = """
        UPDATE dashboards SET content=%s
        WHERE id=%s
        RETURNING id, content
    """
    try:
        cur.execute(sql_query, (content, dashboard_id))
        conn.commit()
        query_result = cur.fetchall()
        if not query_result:
            res = {
                'error': 'No dashboard exists with the given id'
            }
            return res, 404
    except:
        res = {
            'error': 'Error occurred while upserting into store'
        }
        return res, 500
    finally:
        conn.close()
    res = {
        'message' : 'Dashboard edited'
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

################################
# Please leave all routes here #
################################


@DASHBOARD_ROUTES.route('/dashboard', methods=['GET', 'POST', 'PUT', 'DELETE'])
def dashboard_wrapper():
    token = request.headers.get('Authorization')
    user_id = get_id_from_token(token)
    # Get user's dashboards
    if request.method == 'GET':
        payload, status = get_user_dashboards(user_id)
    # Create user's dashboard (used for init purposes)
    elif request.method == 'POST':
        payload, status = create_user_dashboard(user_id)
    # Upsert into user's dashboard
    elif request.method == 'PUT':
        dashboard_id = request.args.get('id')
        data = request.get_json()
        content = data['dashboard']
        payload, status = edit_user_dashboard(dashboard_id, content)
    # Delete user's dashboard
    elif request.method == 'DELETE':
        dashboard_id = request.args.get('id')
        payload, status = delete_user_dashboard(dashboard_id)
    return Response(dumps(payload), status=status)

