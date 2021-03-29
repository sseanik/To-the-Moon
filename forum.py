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
import psycopg2.extras


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
                WITH deleted_comment as (
                    UPDATE forum_comment SET content=%s, is_deleted=TRUE
                    WHERE comment_id=%s and author_id=%s
                    RETURNING * 
                ) SELECT d.comment_id, d.stock_ticker, u.username, d.time_stamp, d.content, d.is_edited, d.is_deleted, array_to_json(d.upvote_user_ids) AS upvote_user_ids, array_to_json(d.downvote_user_ids) AS downvote_user_ids
                FROM deleted_comment d
                JOIN users u on d.author_id = u.id;
            """.replace("\n", "")
            values = ("", comment_id, user_id)
            cur.execute(insert_query, values)   
            db_reply = cur.fetchall()
            # If no rows have been updated, author_id != user_id so the user cannot edit this comment.
            if not db_reply:
                response = {
                    'status' : 400,
                    'message' : "User does not have permission to edit this comment."
                }
            else:
            # If rows have been updated, return the newly updated row.
                updated_comment = dict(db_reply[0])
                updated_comment['upvotes'] = len(updated_comment['upvote_user_ids'])
                updated_comment['downvotes'] = len(updated_comment['downvote_user_ids'])
                updated_comment['vote difference'] = updated_comment['upvotes'] - updated_comment['downvotes']
                updated_comment.pop("upvote_user_ids")
                updated_comment.pop("downvote_user_ids")
                response = {
                    'status' : 200,
                    'message' : "Comment deleted.",
                    'comment' : updated_comment
                }
        # Otherwise, using the provided parent id, it is a child comment (reply)
        else:
            insert_query = """
                DELETE FROM forum_reply WHERE reply_id=%s and author_id=%s
            """.replace("\n", "")
            values = (comment_id, user_id)
            cur.execute(insert_query, values) 
            db_reply = cur.fetchall()
            # If no rows have been updated, author_id != user_id so the user cannot edit this comment.
            if not db_reply:
                response = {
                    'status' : 400,
                    'message' : "User does not have permission to delete this comment."
                }
            else:
                response = {
                "status" : 200, 
                "message" : "Child comment deleted."
                }
    except:
        response = {
            "status" : 400, 
            "message" : "Something when wrong when trying to delete."
        }

    conn.commit()
    cur.close()
    conn.close()
    return response


def get_stock_comments(user_id, stock_ticker):
    # Open database connection
    conn = createDBConnection()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    # Select Query returning parent comments and their children
    select_query = """
        SELECT 
        c.comment_id, 
        c.stock_ticker, 
        u.username, 
        c.time_stamp, 
        c.content, 
        array_to_json(c.upvote_user_ids) AS upvote_user_ids, 
        array_to_json(c.downvote_user_ids) AS downvote_user_ids,
        c.is_edited, 
        c.is_deleted, 
        COALESCE(JSON_AGG((r)), '[]' :: JSON) AS replies 
        FROM 
        forum_comment c 
        JOIN users u ON (c.author_id = u.id) 
        LEFT JOIN(
            SELECT 
            f.reply_id, 
            f.stock_ticker, 
            u.username, 
            f.time_stamp, 
            f.content, 
            f.upvote_user_ids, 
            f.downvote_user_ids, 
            f.is_edited, 
            f.comment_id 
            FROM 
            forum_reply f 
            LEFT JOIN users u ON (f.author_id = u.id) 
            GROUP BY 
            f.reply_id, 
            u.username
        ) AS r ON (c.comment_id = r.comment_id) 
        WHERE 
        c.stock_ticker = 'IBM' 
        GROUP BY 
        c.comment_id, 
        u.username
    """.replace("\n", "")

    try:
        cur.execute(select_query, (stock_ticker,))
        query_results = cur.fetchall()
        status = 200
        message = "Submitted successfully"
    except:
        query_results = []
        status = 400
        message = "Invalid data was provided to the Database"

    cur.close()
    conn.close()

    for i in range(len(query_results)):
        # Convert from RealDictCursor to Dictionary
        query_results[i] = dict(query_results[i])

        # Add upvoted and downvoted fields to comments
        query_results[i]['is_upvoted'] = False
        query_results[i]['is_downvoted'] = False

        # If the user id is present in the votes, update fields
        if user_id in query_results[i]['upvote_user_ids']:
            query_results[i]['is_upvoted'] = True
        elif user_id in query_results[i]['downvote_user_ids']:
            query_results[i]['is_upvoted'] = True

        # Add upvote and downvote count fields
        query_results[i]['upvotes'] = len(query_results[i]['upvote_user_ids'])
        query_results[i]['downvotes'] = len(
            query_results[i]['downvote_user_ids'])
        query_results[i]['vote_difference'] = query_results[i]['upvotes'] - \
            query_results[i]['downvotes']

        # Remove user_ids exposed in upvotes and downvotes
        del query_results[i]['upvote_user_ids']
        del query_results[i]['downvote_user_ids']

        # Fix the case of [None], into []
        if query_results[i]['replies'] == [None]:
            query_results[i]['replies'] = []
            continue

        for j in range(len(query_results[i]['replies'])):
            # Add upvote and downvote fields to replies
            query_results[i]['replies'][j]['is_upvoted'] = False
            query_results[i]['replies'][j]['is_downvoted'] = False

            # If the user is present in the reply votes, update fields
            if user_id in query_results[i]['replies'][j]['upvote_user_ids']:
                query_results[i]['replies'][j]['is_upvoted'] = True
            elif user_id in query_results[i]['replies'][j]['downvote_user_ids']:
                query_results[i]['replies'][j]['is_downvoted'] = True

            # Add number of upvotes and downvote fields
            query_results[i]['replies'][j]['upvotes'] = len(
                query_results[i]['replies'][j]['upvote_user_ids'])
            query_results[i]['replies'][j]['downvotes'] = len(
                query_results[i]['replies'][j]['downvote_user_ids'])
            query_results[i]['replies'][j]['vote_difference'] = query_results[i]['replies'][j]['upvotes'] - \
                query_results[i]['replies'][j]['downvotes']

            # Remove upvote and downvote user ids
            del query_results[i]['replies'][j]['upvote_user_ids']
            del query_results[i]['replies'][j]['downvote_user_ids']

    # TODO: Sort Weighting

    return {
        'status': status,
        'message': message,
        'comments': query_results
    }

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





@FORUM_ROUTES.route('/forum', methods=['GET'])
def get_comments():
    token = request.headers.get('Authorization')
    user_id = get_id_from_token(token)
    data = request.get_json()
    result = get_stock_comments(user_id, data['stockTicker'])
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
    #print(delete_comment("0ee69cfc-83ce-11eb-8620-0a4e2d6dea13", "6e90bd54-8f81-11eb-a4ac-0a4e2d6dea13"))
    #print(delete_comment("a81f2b16-89e9-11eb-a341-0a4e2d6dea13", "0cd048e2-8f9e-11eb-9394-0a4e2d6dea13", "28de170e-8f9d-11eb-b657-0a4e2d6dea13"))

    #print(post_comment("0ee69cfc-83ce-11eb-8620-0a4e2d6dea13", "IBM", 1617010730000, "TEST CONTENT"))
    print(delete_comment("0ee69cfc-83ce-11eb-8620-0a4e2d6dea13", "ed8b9202-9042-11eb-86b3-0a4e2d6dea13"))
    #print(delete_comment("1b6fe090-8654-11eb-a555-0a4e2d6dea13", "ed8b9202-9042-11eb-86b3-0a4e2d6dea13"))



