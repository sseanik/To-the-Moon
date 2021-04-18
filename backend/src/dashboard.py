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

TYPE_TABLE_MAPPING = {
    "portfolio": "portfolio_block",
    "news": "news_block",
    "stock": "stock_block"
}

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
    return res, 201


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


def get_dashboard_blocks(dashboard_id):
    conn = create_DB_connection()
    cur = conn.cursor()
    sql_query = """
        SELECT block_id FROM dashboard_references
        WHERE dashboard_id=%s
    """
    try:
        cur.execute(sql_query, (dashboard_id, ))
        query_results = cur.fetchall()
    except:
        res = {
            'error': 'Error occurred while retrieving from store'
        }
        return res, 500
    finally:
        conn.close()
    data = []
    for result in query_results:
        data.append(result[0])
    res = {
        'data': data
    }
    return res, 200


def create_dashboard_block(dashboard_id, block_type, meta):
    conn = create_DB_connection()
    cur = conn.cursor()

    # Get the columns of the block table corresponding to the block type
    table = TYPE_TABLE_MAPPING[block_type]
    sql_query = """
        SELECT column_name FROM information_schema.columns
        WHERE table_name=%s
    """
    try:
        cur.execute(sql_query, (table, ))
        query_results = cur.fetchall()
    except:
        res = {
            'error': 'Error occurred while retrieving from store'
        }
        conn.close()
        return res, 500

    cols = []
    for result in query_results:
        if result[0] != "id":
            cols.append(result[0])

    # Create a new block in the corresponding block table
    sql_query = """
        INSERT INTO {} ({}) VALUES ({})
        RETURNING id
    """.format(table, "".join(str(e) + ", " for e in cols)[:-2], "".join("%s, " for e in cols)[:-2])
    values = ()
    for col in cols:
        values += (block_type, ) if col == "type" else (meta[col], )

    try:
        cur.execute(sql_query, values)
        conn.commit()
        query_results = cur.fetchall()
        if not query_results:
            raise Exception
    except:
        res = {
            'error': 'Error occurred while inserting into store'
        }
        return res, 500
    finally:
        conn.close()
    block_id = query_results[0][0]

    conn = create_DB_connection()
    cur = conn.cursor()
    # Create a reference to the created block to the dashboard
    sql_query = """
        INSERT INTO dashboard_references (dashboard_id, block_id) VALUES (%s, %s)
        RETURNING id
    """
    try:
        cur.execute(sql_query, (dashboard_id, block_id))
        conn.commit()
        query_results = cur.fetchall()
        if not query_results:
            raise Exception
    except Exception as e:
        print(e)
        res = {
            'error': 'Error occurred while inserting into store'
        }
        return res, 500
    finally:
        conn.close()
    res = {
        'message' : 'Dashboard block created',
        'data': {
            'id': block_id
        }
    }
    return res, 201


def get_block(block_id):
    conn = create_DB_connection()
    cur = conn.cursor()
    sql_query = """
        SELECT * FROM dashboard_blocks
        WHERE id=%s
    """
    try:
        cur.execute(sql_query, (block_id, ))
        query_results = cur.fetchall()
        if not query_results:
            res = {
                'error': 'No block identified by the given id'
            }
            return res, 404
    except:
        res = {
            'error': 'Error occurred while retrieving from store'
        }
        return res, 500
    finally:
        conn.close()
    print(query_results)
    # data = []
    # for result in query_results:
    #     data.append(result[0])
    res = {
        'data': query_results
    }
    return res, 200


################################
# Please leave all routes here #
################################


@DASHBOARD_ROUTES.route('/dashboard', methods=['GET', 'POST'])
def general_dashboard_wrapper():
    token = request.headers.get('Authorization')
    user_id = get_id_from_token(token)
    # Get user's dashboards
    if request.method == 'GET':
        payload, status = get_user_dashboards(user_id)
    # Create user's dashboard (used for init purposes)
    elif request.method == 'POST':
        payload, status = create_user_dashboard(user_id)
    return Response(dumps(payload), status=status)

@DASHBOARD_ROUTES.route('/dashboard/<dashboard_id>', methods=['GET', 'POST', 'DELETE'])
def user_dashboard_wrapper(dashboard_id):
    token = request.headers.get('Authorization')
    user_id = get_id_from_token(token)
    # Get dashboard's blocks
    if request.method == 'GET':
        payload, status = get_dashboard_blocks(dashboard_id)
    # Create new block in a dashboard
    elif request.method == 'POST':
        data = request.get_json()
        payload, status = create_dashboard_block(dashboard_id, data["type"], data["meta"])
    # Delete a dashboard and its blocks
    elif request.method == 'DELETE':
        payload, status = delete_user_dashboard(dashboard_id)
    return Response(dumps(payload), status=status)

@DASHBOARD_ROUTES.route('/dashboard/block/<block_id>', methods=['GET', 'PUT', 'DELETE'])
def blocks_dashboard_wrapper(block_id):
    token = request.headers.get('Authorization')
    user_id = get_id_from_token(token)
    # Get a block
    if request.method == 'GET':
        payload, status = get_block(block_id)
#     # Edit an existing block
#     elif request.method == 'PUT':
#         # payload, status = edit_block(block_id)
#     # Delete a block
#     elif request.method == 'DELETE':
#         # payload, status = delete_block(block_id)
    return Response(dumps(payload), status=status)