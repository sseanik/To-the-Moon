# ---------------------------------------------------------------------------- #
#                                 Dashboard Module                             #
# ---------------------------------------------------------------------------- #

from json import dumps
import psycopg2
from flask import request, Response
from flask_restx import Namespace, Resource, abort
from database import create_DB_connection
from token_util import get_id_from_token
from models import token_parser, create_dashboard_block_model

# ---------------------------------------------------------------------------- #
#                              Global Declarations                             #
# ---------------------------------------------------------------------------- #

DASHBOARD_NS = Namespace(
    "dashboard", "Dashboard feature to track user selected content"
)


# ---------------------------------------------------------------------------- #
#                               Helper Functions                               #
# ---------------------------------------------------------------------------- #

TYPE_TABLE_MAPPING = {
    "portfolio": "portfolio_block",
    "news": "news_block",
    "stock": "stock_block",
}


def get_user_dashboards(user_id):
    conn = create_DB_connection()
    cur = conn.cursor()
    sql_query = "SELECT id FROM dashboards WHERE user_id=%s"
    try:
        cur.execute(sql_query, (user_id,))
        query_results = cur.fetchall()
    except:
        abort(500, "Error occurred while retrieving from store")
    finally:
        conn.close()

    data = []
    for result in query_results:
        data.append(result[0])
    response = {"data": data}
    return response


# Limit to 1 per user now, but leave room for extendability
def create_user_dashboard(user_id):
    conn = create_DB_connection()
    cur = conn.cursor()
    sql_query = """
        INSERT INTO dashboards (user_id) VALUES (%s)
        RETURNING id
    """
    try:
        cur.execute(sql_query, (user_id,))
        conn.commit()
        query_results = cur.fetchall()
        if not query_results:
            raise Exception
    except psycopg2.errors.UniqueViolation:
        abort(409, "Dashboard already exists for user")
    except:
        abort(500, "Error occurred while inserting into store")
    finally:
        conn.close()
    response = {"message": "Dashboard created", "data": {"id": query_results[0][0]}}
    return response


def delete_user_dashboard(dashboard_id):
    conn = create_DB_connection()
    cur = conn.cursor()
    sql_query = """
        DELETE FROM dashboards
        WHERE id=%s
        RETURNING id
    """
    try:
        cur.execute(sql_query, (dashboard_id,))
        conn.commit()
        query_result = cur.fetchall()
        if not query_result:
            abort(404, "No dashboard exists with the given id")
    except:
        abort(500, "Error occurred while deleting from store")
    finally:
        conn.close()
    response = {"message": "Dashboard deleted", "data": {"id": query_result[0][0]}}
    return response


def get_dashboard_blocks(dashboard_id):
    conn = create_DB_connection()
    cur = conn.cursor()
    sql_query = """
        SELECT block_id FROM dashboard_references
        WHERE dashboard_id=%s
    """
    try:
        cur.execute(sql_query, (dashboard_id,))
        query_results = cur.fetchall()
    except:
        abort(500, "Error occurred while retrieving from store")
    finally:
        conn.close()
    data = []
    for result in query_results:
        data.append(result[0])
    response = {"data": data}
    return response


def create_dashboard_block(dashboard_id, user_id, block_type, meta):
    conn = create_DB_connection()
    cur = conn.cursor()

    # Get the columns of the block table corresponding to the block type
    table = TYPE_TABLE_MAPPING[block_type]
    sql_query = """
        SELECT column_name FROM information_schema.columns
        WHERE table_name=%s
    """
    try:
        cur.execute(sql_query, (table,))
        query_results = cur.fetchall()
    except:
        conn.close()
        abort(500, "Error occurred while retrieving from store")

    cols = []
    for result in query_results:
        if result[0] != "id":
            cols.append(result[0])

    # Create a new block in the corresponding block table
    sql_query = """
        INSERT INTO {} ({}) VALUES ({})
        RETURNING id
    """.format(
        table,
        "".join(str(e) + ", " for e in cols)[:-2],
        "".join("%s, " for e in cols)[:-2],
    )
    values = ()
    for col in cols:
        if col == "type":
            values += (block_type,)
        elif col == "user_id":
            values += (user_id,)
        else:
            values += (meta[col],)

    try:
        cur.execute(sql_query, values)
        conn.commit()
        query_results = cur.fetchall()
        if not query_results:
            raise Exception
    except:
        conn.close()
        abort(500, "Error occurred while inserting into store")
    block_id = query_results[0][0]

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
    except:
        abort(500, "Error occurred while inserting into store")
    finally:
        conn.close()
    response = {"message": "Dashboard block created", "data": {"id": block_id}}
    return response


def get_block(block_id):
    conn = create_DB_connection()
    cur = conn.cursor()

    # Get the type of the block
    sql_query = """
        SELECT type FROM dashboard_blocks
        WHERE id=%s
    """
    try:
        cur.execute(sql_query, (block_id,))
        query_results = cur.fetchall()
        if not query_results:
            abort(404, "No block identified by the given id")
    except:
        conn.close()
        abort(500, "Error occurred while retrieving from store")
    block_type = query_results[0][0]
    table = TYPE_TABLE_MAPPING[block_type]

    # Get the meta columns of the block table corresponding to the block type
    sql_query = """
        SELECT column_name FROM information_schema.columns
        WHERE table_name=%s
    """
    try:
        cur.execute(sql_query, (table,))
        query_results = cur.fetchall()
    except:
        conn.close()
        abort(500, "Error occurred while retrieving from store")

    cols = []
    for result in query_results:
        if result[0] != "id" and result[0] != "type" and result[0] != "user_id":
            cols.append(result[0])

    # Get the metadata
    sql_query = """
        SELECT {} from {}
        WHERE id=%s
    """.format(
        "".join(str(e) + ", " for e in cols)[:-2], table
    )
    try:
        cur.execute(sql_query, (block_id,))
        query_results = cur.fetchall()
        if not query_results:
            abort(404, "No block identified by the given id in its meta store")
    except:
        abort(500, "Error occurred while retrieving from store")
    finally:
        conn.close()

    meta = {}
    for i in range(len(cols)):
        meta[cols[i]] = query_results[0][i]

    data = {"id": block_id, "type": block_type, "meta": meta}
    response = {"data": data}
    return response


def delete_block(block_id):
    conn = create_DB_connection()
    cur = conn.cursor()

    # Delete from blocks table
    sql_query = """
        DELETE FROM dashboard_blocks
        WHERE id=%s
        RETURNING id
    """
    try:
        cur.execute(sql_query, (block_id,))
        conn.commit()
        query_result = cur.fetchall()
        if not query_result:
            abort(404, "No block exists with the given id")
    except:
        conn.close()
        abort(500, "Error occurred while deleting from store")
    deleted_block_id = query_result[0][0]

    # Delete from references table
    sql_query = """
        DELETE FROM dashboard_references
        WHERE block_id=%s
        RETURNING id
    """
    try:
        cur.execute(sql_query, (block_id,))
        conn.commit()
        query_result = cur.fetchall()
        if not query_result:
            abort(404, "No block reference exists with the given id")
    except:
        abort(500, "Error occurred while deleting from store")
    finally:
        conn.close()

    response = {"message": "Block deleted", "data": {"id": deleted_block_id}}
    return response


# ---------------------------------------------------------------------------- #
#                                    Routes                                    #
# ---------------------------------------------------------------------------- #


@DASHBOARD_NS.route("")
class Dashboard(Resource):
    @DASHBOARD_NS.doc(description="Get a user's dashboards")
    @DASHBOARD_NS.expect(token_parser(DASHBOARD_NS), validate=True)
    @DASHBOARD_NS.response(200, "Successfully retrieved dashboards")
    @DASHBOARD_NS.response(400, "Invalid data was provided")
    def get(self):
        token = request.headers.get("Authorization")
        user_id = get_id_from_token(token)
        response = get_user_dashboards(user_id)
        return Response(dumps(response), status=200)

    @DASHBOARD_NS.doc(description="Create a new dashboard")
    @DASHBOARD_NS.expect(token_parser(DASHBOARD_NS), validate=True)
    @DASHBOARD_NS.response(201, "Successfully created dashboard")
    @DASHBOARD_NS.response(400, "Invalid data was provided")
    @DASHBOARD_NS.response(
        409, "Conflict with existing resource, user already has a dashboard"
    )
    def post(self):
        token = request.headers.get("Authorization")
        user_id = get_id_from_token(token)
        response = create_user_dashboard(user_id)
        return Response(dumps(response), status=201)


@DASHBOARD_NS.route("/<id>")
class UserDashboard(Resource):
    @DASHBOARD_NS.doc(description="Get a dashboard's blocks")
    @DASHBOARD_NS.response(200, "Successfully retrieved blocks")
    @DASHBOARD_NS.response(400, "Invalid data was provided")
    def get(self, id):
        response = get_dashboard_blocks(id)
        return Response(dumps(response), status=200)

    # Create a new dashboard block - either of type portfolio, news or stock
    # Params:
    #   - portfolio:
    #      - portfolio_name: string
    #      - detailed: boolean
    #   - news:
    #      - stock_ticker: string
    #   - stock:
    #      - stock_ticker: string
    @DASHBOARD_NS.doc(
        description="Create a new dashboard block. Currently supported types are portfolio, news and stock."
    )
    @DASHBOARD_NS.expect(
        token_parser(DASHBOARD_NS),
        create_dashboard_block_model(DASHBOARD_NS),
        validate=True,
    )
    @DASHBOARD_NS.response(201, "Successfully created dashboard block")
    @DASHBOARD_NS.response(400, "Invalid data was provided")
    def post(self, id):
        token = request.headers.get("Authorization")
        user_id = get_id_from_token(token)
        data = request.get_json()
        response = create_dashboard_block(id, user_id, data["type"], data["meta"])
        return Response(dumps(response), status=201)

    @DASHBOARD_NS.doc(description="Remove a dashboard")
    @DASHBOARD_NS.response(200, "Successfully deleted dashboard")
    @DASHBOARD_NS.response(400, "Invalid data was provided")
    def delete(self, id):
        response = delete_user_dashboard(id)
        return Response(dumps(response), status=200)


@DASHBOARD_NS.route("/block/<id>")
class UserDashboardBlocks(Resource):
    @DASHBOARD_NS.doc(description="Get a dashboard block's metadata")
    @DASHBOARD_NS.response(200, "Successfully retrieved block metadata")
    @DASHBOARD_NS.response(400, "Invalid data was provided")
    def get(self, id):
        response = get_block(id)
        return Response(dumps(response), status=200)

    @DASHBOARD_NS.doc(description="Remove a dashboard block")
    @DASHBOARD_NS.response(200, "Successfully deleted dashboard block")
    @DASHBOARD_NS.response(400, "Invalid data was provided")
    def delete(self, id):
        response = delete_block(id)
        return Response(dumps(response), status=200)
