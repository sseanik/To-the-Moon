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

    if timestamp < yesterday or timestamp > tomorrow:
        return False
    return True

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

def edit_comment(user_id, comment_id, timestamp, content, parent_id=None):
    """Edit the contents of a comment.

    args:
        user_id (uuid): The UUID of the User posting the comment
        comment_id (uuid): The UUID of the comment row to be deleted.
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

    # Attempt to insert values into the DB, handling invalid Data cases in the insert
    
    try:
        if not parent_id:
            sqlQuery = '''
                WITH edited_comment as (
                    UPDATE forum_comment SET time_stamp=%s, content=%s, is_edited=TRUE
                    WHERE comment_id=%s AND author_id=%s
                    RETURNING *
                ) SELECT e.comment_id, e.stock_ticker, u.username, e.time_stamp, e.content, e.is_edited, e.is_deleted, array_to_json(e.upvote_user_ids) AS upvote_user_ids, array_to_json(e.downvote_user_ids) AS downvote_user_ids
                FROM edited_comment e
                JOIN users u on e.author_id = u.id;
            '''
        else:
            sqlQuery = '''
                WITH edited_comment as (
                    UPDATE forum_reply SET time_stamp=%s, content=%s, is_edited=TRUE
                    WHERE reply_id=%s AND author_id=%s
                    RETURNING *
                ) SELECT e.comment_id, e.stock_ticker, u.username, e.time_stamp, e.content, e.is_edited, e.is_deleted, array_to_json(e.upvote_user_ids) AS upvote_user_ids, array_to_json(e.downvote_user_ids) AS downvote_user_ids
                FROM edited_comment e
                JOIN users u on e.author_id = u.id;
            '''
        values = (timestamp, content, comment_id, user_id)
        cur.execute(sqlQuery, values)
        db_reply = cur.fetchall()
        # If no rows have been updated, author_id != user_id so the user cannot edit this comment.
        if not db_reply:
            response = {
                'status' : 200,
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
                'message' : "Comment updated",
                'comment' : updated_comment
            }
    except:
        response = {
            'status' : 400,
            'message' : 'Something went wrong when editing'
        }
    
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


@FORUM_ROUTES.route('/forum/editReply', methods=['PUT'])
def edit_users_reply():
    token = request.headers.get('Authorization')
    user_id = get_id_from_token(token)
    data = request.get_json()
    result = edit_comment(user_id['id'], data['comment_id'], data['time_stamp'], data['content'], data['parent_id'])
    return dumps(result)

@FORUM_ROUTES.route('/forum/editComment', methods=['PUT'])
def edit_users_comment():
    token = request.headers.get('Authorization')
    user_id = get_id_from_token(token)
    data = request.get_json()
    result = edit_comment(user_id['id'], data['comment_id'], data['time_stamp'], data['content'])
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

    #print(post_comment("0ee69cfc-83ce-11eb-8620-0a4e2d6dea13", "IBM",
    #     1616906592000, "$$$$"))
    
    #print(post_comment("a81f2b16-89e9-11eb-a341-0a4e2d6dea13", "IBM", time.time() * 1000, "THIS WILL BE EDITED", "6e90bd54-8f81-11eb-a4ac-0a4e2d6dea13"))

    #print(edit_comment("0ee69cfc-83ce-11eb-8620-0a4e2d6dea13", "6e90bd54-8f81-11eb-a4ac-0a4e2d6dea13",  time.time() * 1000, "Test edit"))
    #print(edit_comment("a81f2b16-89e9-11eb-a341-0a4e2d6dea13", "6ed3656c-8f8d-11eb-a71a-0a4e2d6dea13",  
        #time.time() * 1000, "edited again content", 'something'))

    #print(post_comment("1b6fe090-8654-11eb-a555-0a4e2d6dea13", "IBM", time.time() * 1000, "TEST 2"))
    #print(edit_comment("1b6fe090-8654-11eb-a555-0a4e2d6dea13", "28de170e-8f9d-11eb-b657-0a4e2d6dea13", time.time() * 1000, "EDITED 2"))
    #print(post_comment("a81f2b16-89e9-11eb-a341-0a4e2d6dea13", "IBM", time.time() * 1000, "CHILD COMMENT TEST 2", "28de170e-8f9d-11eb-b657-0a4e2d6dea13"))
    #print(edit_comment("1b6fe090-8654-11eb-a555-0a4e2d6dea13", "1b03ad9c-8f9d-11eb-8f6f-0a4e2d6dea13", time.time() * 1000, "EDITED CHILD COMMENT 2"))
    print(edit_comment("0ee69cfc-83ce-11eb-8620-0a4e2d6dea13", "ed8b9202-9042-11eb-86b3-0a4e2d6dea13", time.time() * 1000, "EDIT PARENT COMMENT"))
    #print(edit_comment("1b6fe090-8654-11eb-a555-0a4e2d6dea13", "ed8b9202-9042-11eb-86b3-0a4e2d6dea13", time.time() * 1000, "EDIT PARENT COMMENT"))


