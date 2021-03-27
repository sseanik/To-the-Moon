####################
#   Forum Module   #
####################
import time
import psycopg2

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
        dict: Status Code, accompanying message and filtered content text
    """

    # If the timestamp is not between yesterday or tomorrow
    if not validate_timestamp(timestamp):
        return {
            'status': 400,
            'message': 'Timestamp provided is invalid',
            'content': ""
        }

    # Censor rude words
    content = profanity.censor(content)

    # Open database connection
    conn = createDBConnection()
    cur = conn.cursor()

    # If no parent_id is provided, comment is a parent comment (comment)
    if not parent_id:
        insert_query = "INSERT INTO ForumComment (stock_ticker, author_id, time_stamp, content) VALUES (%s, %s, %s, %s)"
        values = (stock_ticker, user_id, timestamp, content)
    # Otherwise, using the provided parent id, it is a child comment (reply)
    else:
        insert_query = "INSERT INTO ForumReply (comment_id, stock_ticker, author_id, time_stamp, content) VALUES (%s, %s, %s, %s, %s)"
        values = (parent_id, stock_ticker, user_id, timestamp, content)

    # Attempt to insert values into the DB, handling invalid Data cases in the insert
    try:
        cur.execute(insert_query, values)
        status = 200
        message = "Submitted successfully"
    except:
        status = 400
        message = "Invalid data was provided to the Database"
        content = ""

    conn.commit()
    cur.close()
    conn.close()

    return {
        'status': status,
        'message': message,
        'content': content
    }


def get_stock_comments(stock_ticker):
    # Open database connection
    conn = createDBConnection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    select_query = """
        SELECT c.*, JSON_AGG(r) AS replies
        FROM forumcomment c
        LEFT JOIN forumreply r
        ON (c.comment_id = r.comment_id)
        WHERE c.stock_ticker = 'IBM'
        GROUP BY c.comment_id
    """.replace("\n", "")

    cur.execute(select_query, (stock_ticker,))
    query_results = cur.fetchall()
    cur.close()
    conn.close()

    print(query_results)


################################
# Please leave all routes here #
################################
@FORUM_ROUTES.route('/forum/comment', methods=['POST'])
def submit_comment():
    """
    Submitting a Parent Comment Example:
    {
        "stock_ticker": "AAPL",
        "timestamp": 1616810169114 (milliseconds since epoch UTC)
        "content": "This is my parent comment"
    }
    """
    token = request.headers.get('Authorization')
    user_id = get_id_from_token(token)
    data = request.get_json()
    result = post_comment(
        user_id, data['stock_ticker'], data['timestamp'], data['content'])
    return dumps(result)


@FORUM_ROUTES.route('/forum', methods=['GET'])
def get_comments():
    data = request.get_json()
    result = get_stock_comments(data['stock_ticker'])
    return dumps(result)


@FORUM_ROUTES.route('/forum/upvote', methods=['POST'])
def upvote_comment():
    pass


@FORUM_ROUTES.route('/forum/downvote', methods=['POST'])
def downvote_comment():
    pass


if __name__ == "__main__":
    get_stock_comments("IBM")
    # Testing Posting Parent Comment
    # print(post_comment("0ee69cfc-83ce-11eb-8620-0a4e2d6dea13",
    #       "IBM", 1616810169114, "Parent Comment 1"))

    # print(post_comment("0ee69cfc-83ce-11eb-8620-0a4e2d6dea13", "IBM", 1616810169114,
    #       "Child 1 A", "562c5a86-8ea8-11eb-bf93-0a4e2d6dea13"))

    # print(post_comment("0ee69cfc-83ce-11eb-8620-0a4e2d6dea13", "IBM", 1616810169114,
    #       "Child 1 b", "562c5a86-8ea8-11eb-bf93-0a4e2d6dea13"))

    # print(post_comment("0ee69cfc-83ce-11eb-8620-0a4e2d6dea13", "IBM", 1616810169114,
    #       "Child 1 C", "562c5a86-8ea8-11eb-bf93-0a4e2d6dea13"))

    # print(post_comment("0ee69cfc-83ce-11eb-8620-0a4e2d6dea13", "IBM", 1616810169114,
    #       "Child 2 A", "5c91ce86-8eb4-11eb-b157-0a4e2d6dea13"))
    # # # Testing Posting Child Comment
    # # print(post_comment("0ee69cfc-83ce-11eb-8620-0a4e2d6dea13", "IBM", 1616810169114,
    # #       "Fuck IBM. Move along, don't buy", "562c5a86-8ea8-11eb-bf93-0a4e2d6dea13"))
