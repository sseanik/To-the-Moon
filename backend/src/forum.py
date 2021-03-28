####################
#   Forum Module   #
####################
import time
import psycopg2
from psycopg2.extras import RealDictCursor
from database import createDBConnection
from token_util import get_id_from_token
from better_profanity import profanity
from json import dumps
from flask import Blueprint, request


FORUM_ROUTES = Blueprint('forum', __name__)


def validate_timestamp(timestamp):
    # Validate the timestamp by checking if post time is within 1 day's timeframe
    now_milliseconds = time.time() * 1000
    day_milliseconds = 86400000
    yesterday = now_milliseconds - day_milliseconds
    tomorrow = now_milliseconds + day_milliseconds
    return False if (timestamp < yesterday or timestamp > tomorrow) else True

###################################
# Please leave all functions here #
###################################


def post_comment(user_id, stock_ticker, timestamp, content, parent_id=None):
    """Posting either a parent or child comment in the provided stock's forum

    Args:
        user_id (uuid): The UUID of the User posting the comment
        stock_ticker (string): The Stock symbol
        timestamp (big int): Timestamp in Milliseconds since epoch UTC
        content (string): The Comment's text content
        parent_id (uuid, optional): The UUID of the Parent Comment's User. Defaults to None.

    Returns:
        dict: Status Code, accompanying message, comment object
    """

    # If the timestamp is not between yesterday or tomorrow
    if not validate_timestamp(timestamp):
        return {
            'status': 400,
            'message': 'Timestamp provided is invalid',
            'comment': {}
        }

    # Censor rude words
    content = profanity.censor(content)

    # Open database connection
    conn = createDBConnection()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    # If no parent_id is provided, comment is a parent comment (comment)
    if not parent_id:
        insert_query = """
            WITH inserted_comment as (
            INSERT INTO forum_comment (stock_ticker, author_id, time_stamp, content) 
            VALUES (%s, %s, %s, %s) 
            RETURNING *
            ) SELECT i.comment_id, i.stock_ticker, u.username, i.time_stamp, i.content, i.is_edited, i.is_deleted
            FROM inserted_comment i
            JOIN users u on i.author_id = u.id;
        """.replace("\n", "")
        values = (stock_ticker, user_id, timestamp, content)
    # Otherwise, using the provided parent id, it is a child comment (reply)
    else:
        insert_query = """
            WITH inserted_reply as (
            INSERT INTO forum_reply (comment_id, stock_ticker, author_id, time_stamp, content) 
            VALUES (%s, %s, %s, %s, %s) 
            RETURNING *
            ) SELECT i.reply_id, i.stock_ticker, u.username, i.time_stamp, i.content, i.is_edited, i.comment_id
            FROM inserted_reply i
            JOIN users u on i.author_id = u.id;
        """.replace("\n", "")
        values = (parent_id, stock_ticker, user_id, timestamp, content)

    # Attempt to insert values into the DB, handling invalid Data cases in the insert
    try:
        cur.execute(insert_query, values)
        status = 200
        message = "Submitted successfully"
        inserted_comment = dict(cur.fetchall()[0])
        inserted_comment['upvotes'] = 0
        inserted_comment['downvotes'] = 0
        inserted_comment['vote_difference'] = 0
    except:
        status = 400
        message = "Invalid data was provided to the Database"
        inserted_comment = {}

    conn.commit()
    cur.close()
    conn.close()

    return {
        'status': status,
        'message': message,
        'comment': inserted_comment
    }


def delete_comment(user_id, comment_id, parent_id=None):
    """Delete comment from the forum
    Args:
        user_id (uuid): The UUID of the User posting the comment.
        comment_id (uuid): The UUID of the comment row to be deleted.
        parent_id (uuid, optional): The UUID of the Parent Comment's User. Defaults to None.

    Returns:
        if we are deleting a parent object:
            dict: Status Code, accompanying message, comment object
        if we are deleting a child object:
            dict: Status Code, accompanying message
    """
    conn = createDBConnection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    try:
        # If no parent_id is provided, comment is a parent comment (comment)
        if not parent_id:
            insert_query = """
                UPDATE forum_comment SET content=%s, is_deleted=TRUE
                WHERE comment_id=%s and author_id=%s
                RETURNING *
            """.replace("\n", "")
            values = ("", comment_id, user_id)
            cur.execute(insert_query, values)   
            updated_comment = dict(cur.fetchall()[0])
            response = {
                "status" : 200, 
                "message" : "Comment deleted.",
                "comment" : updated_comment
                }
        # Otherwise, using the provided parent id, it is a child comment (reply)
        else:
            insert_query = """
                DELETE FROM forum_reply WHERE reply_id=%s and author_id=%s
            """.replace("\n", "")
            values = (comment_id, user_id)
            cur.execute(insert_query, values) 
            response = {"status" : 200, "message" : "Comment deleted."}
    except:
        response = {"status" : 400, "message" : "Something when wrong when trying to delete."}

    conn.commit()
    cur.close()
    conn.close()
    return response


################################
# Please leave all routes here #
################################
@FORUM_ROUTES.route('/forum/comment', methods=['POST'])
def submit_comment():
    token = request.headers.get('Authorization')
    user_id = get_id_from_token(token)
    data = request.get_json()
    result = post_comment(
        user_id, data['stockTicker'], data['timestamp'], data['content'])
    return dumps(result)


@FORUM_ROUTES.route('/forum/reply', methods=['POST'])
def submit_reply():
    token = request.headers.get('Authorization')
    user_id = get_id_from_token(token)
    data = request.get_json()
    result = post_comment(
        user_id, data['stockTicker'], int(data['timestamp']), data['content'], data['parentID'])
    return dumps(result)


@FORUM_ROUTES.route('/forum/deleteComment', methods=['DELETE'])
def delete_user_comment():
    token = request.headers.get('Authorization')
    user_id = get_id_from_token(token)
    data = request.get_json()
    result = delete_comment(user_id, data['comment_id'])
    return dumps(result)

@FORUM_ROUTES.route('/forum/deleteReply', methods=['DELETE'])
def delete_user_reply():
    token = request.headers.get('Authorization')
    user_id = get_id_from_token(token)
    data = request.get_json()
    result = delete_comment(user_id, data['comment_id'], data['parent_id'])
    return dumps(result)

if __name__ == "__main__":
    #     # Testing Posting Parent Comment
    #     print(post_comment("0ee69cfc-83ce-11eb-8620-0a4e2d6dea13", "IBM", 1616810169114,
    #           "Parent 4"))
    #     print(post_comment("0ee69cfc-83ce-11eb-8620-0a4e2d6dea13", "IBM", 1616810169114,
    #           "Parent 5"))
    #print(post_comment("4fbee696-89f3-11eb-8558-0a4e2d6dea13", "IBM",
    #      1616810169114, "Parent 6", "505489ae-8f65-11eb-9d86-0a4e2d6dea13"))

    # print(post_comment("0ee69cfc-83ce-11eb-8620-0a4e2d6dea13", "IBM", 1616810169114,
    #                    "Child 1 D", "275af66c-8ec7-11eb-b34c-0a4e2d6dea13"))

    #print(delete_comment("0ee69cfc-83ce-11eb-8620-0a4e2d6dea13", "6e90bd54-8f81-11eb-a4ac-0a4e2d6dea13"))
    #print(delete_comment("a81f2b16-89e9-11eb-a341-0a4e2d6dea13", "6ed3656c-8f8d-11eb-a71a-0a4e2d6dea13", "something"))
    #print(delete_comment("1b6fe090-8654-11eb-a555-0a4e2d6dea13", "28de170e-8f9d-11eb-b657-0a4e2d6dea13"))
    print(delete_comment("0ee69cfc-83ce-11eb-8620-0a4e2d6dea13", "6e90bd54-8f81-11eb-a4ac-0a4e2d6dea13"))