# ---------------------------------------------------------------------------- #
#                                 Forum Module                                 #
# ---------------------------------------------------------------------------- #

import time
from json import dumps
import psycopg2
from psycopg2.extras import RealDictCursor
from database import create_DB_connection
from token_util import get_id_from_token
from better_profanity import profanity
from flask import request, Response
from flask_restx import Namespace, Resource, abort
from models import (
    token_parser,
    forum_parser,
    comment_model,
    comment_delete_model,
    comment_edit_model,
    comment_vote_model,
    reply_model,
    reply_delete_model,
    reply_edit_model,
    reply_vote_model,
)

# ---------------------------------------------------------------------------- #
#                              Global Declarations                             #
# ---------------------------------------------------------------------------- #

FORUM_NS = Namespace("forum", "User discussion on Stock Pages")

# ---------------------------------------------------------------------------- #
#                               Helper Functions                               #
# ---------------------------------------------------------------------------- #


def validate_timestamp(timestamp):
    # Validate the timestamp by checking if post time is within 1 day's timeframe
    now_milliseconds = time.time() * 1000
    day_milliseconds = 86400000
    yesterday = now_milliseconds - day_milliseconds
    tomorrow = now_milliseconds + day_milliseconds
    return False if (timestamp < yesterday or timestamp > tomorrow) else True


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
    # Check that the content is not too large
    if len(content) >= 5000:
        abort(
            400,
            (
                "Comment content cannot be larger than 5000 characters. ",
                "Please reduce comment size.",
            ),
        )

    # If the timestamp is not between yesterday or tomorrow
    if not validate_timestamp(timestamp):
        abort(400, "Timestamp provided is invalid")

    # Censor rude words
    content = profanity.censor(content)

    # Open database connection
    conn = create_DB_connection()
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
        """.replace(
            "\n", ""
        )
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
        """.replace(
            "\n", ""
        )
        values = (parent_id, stock_ticker, user_id, timestamp, content)

    # Attempt to insert values into the DB, handling invalid Data cases in the insert
    try:
        cur.execute(insert_query, values)
        inserted_comment = dict(cur.fetchall()[0])
        inserted_comment["upvotes"] = 0
        inserted_comment["downvotes"] = 0
        inserted_comment["vote_difference"] = 0
        if not parent_id:
            inserted_comment["replies"] = []
    except:
        conn.close()
        abort(400, "Invalid data was provided to the Database")

    conn.commit()
    cur.close()
    conn.close()

    return {"message": "Submitted successfully", "comment": inserted_comment}


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
    # Check that the content is not too large
    if len(content) >= 5000:
        abort(
            400,
            (
                "Comment content cannot be larger than 5000 characters. ",
                "Please reduce comment size.",
            ),
        )

    # If the timestamp is not between yesterday or tomorrow
    if not validate_timestamp(timestamp):
        abort(400, "Timestamp provided is invalid")
    # Censor rude words
    content = profanity.censor(content)

    # Open database connection
    conn = create_DB_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    # Attempt to insert values into the DB, handling invalid Data cases in the insert

    try:
        if not parent_id:
            sql_query = """
                WITH edited_comment as (
                    UPDATE forum_comment SET time_stamp=%s, content=%s, is_edited=TRUE
                    WHERE comment_id=%s AND author_id=%s
                    RETURNING *
                ) SELECT e.comment_id, e.stock_ticker, u.username, e.time_stamp, e.content, e.is_edited, e.is_deleted, array_to_json(e.upvote_user_ids) AS upvote_user_ids, array_to_json(e.downvote_user_ids) AS downvote_user_ids
                FROM edited_comment e
                JOIN users u on e.author_id = u.id;
            """
        else:
            sql_query = """
                WITH edited_comment as (
                    UPDATE forum_reply SET time_stamp=%s, content=%s, is_edited=TRUE
                    WHERE reply_id=%s AND author_id=%s
                    RETURNING *
                ) SELECT e.reply_id, e.comment_id, e.stock_ticker, u.username, e.time_stamp, e.content, e.is_edited, array_to_json(e.upvote_user_ids) AS upvote_user_ids, array_to_json(e.downvote_user_ids) AS downvote_user_ids
                FROM edited_comment e
                JOIN users u on e.author_id = u.id;
            """
        values = (timestamp, content, comment_id, user_id)
        cur.execute(sql_query, values)
        db_reply = cur.fetchall()
        # If no rows have been updated, author_id != user_id so the user cannot edit this comment.
        if not db_reply:
            abort(400, "User does not have permission to edit this comment.")
        else:
            # If rows have been updated, return the newly updated row.
            updated_comment = dict(db_reply[0])
            updated_comment["upvotes"] = len(updated_comment["upvote_user_ids"])
            updated_comment["downvotes"] = len(updated_comment["downvote_user_ids"])
            updated_comment["vote difference"] = (
                updated_comment["upvotes"] - updated_comment["downvotes"]
            )
            updated_comment.pop("upvote_user_ids")
            updated_comment.pop("downvote_user_ids")
            response = {
                "message": "Comment updated",
                "comment": updated_comment,
            }
    except:
        abort(400, "Something went wrong when editing.")

    conn.commit()
    cur.close()
    conn.close()
    return response


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
    conn = create_DB_connection()
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
            """.replace(
                "\n", ""
            )
            values = ("", comment_id, user_id)
            cur.execute(insert_query, values)
            db_reply = cur.fetchall()
            # If no rows have been updated, so the user cannot edit this comment.
            if not db_reply:
                abort(400, "User does not have permission to edit this comment.")
            else:
                # If rows have been updated, return the newly updated row.
                updated_comment = dict(db_reply[0])
                updated_comment["upvotes"] = len(updated_comment["upvote_user_ids"])
                updated_comment["downvotes"] = len(updated_comment["downvote_user_ids"])
                updated_comment["vote difference"] = (
                    updated_comment["upvotes"] - updated_comment["downvotes"]
                )
                updated_comment.pop("upvote_user_ids")
                updated_comment.pop("downvote_user_ids")
                response = {
                    "message": "Comment deleted.",
                    "comment": updated_comment,
                }
        # Otherwise, using the provided parent id, it is a child comment (reply)
        else:
            insert_query = """
                DELETE FROM forum_reply WHERE reply_id=%s and author_id=%s
                RETURNING TRUE
            """.replace(
                "\n", ""
            )
            values = (comment_id, user_id)
            cur.execute(insert_query, values)
            db_reply = cur.fetchall()
            # If no rows have been updated, the user cannot edit this comment.
            if not db_reply:
                abort(400, "User does not have permission to delete this comment.")
            else:
                response = {"message": "Child comment deleted."}
    except:
        abort(400, "Something when wrong when trying to delete.")

    conn.commit()
    cur.close()
    conn.close()
    return response


def get_stock_comments(user_id, stock_ticker):
    # Open database connection
    conn = create_DB_connection()
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
        c.stock_ticker = %s
        GROUP BY
        c.comment_id,
        u.username
    """.replace(
        "\n", ""
    )

    try:
        cur.execute(select_query, (stock_ticker,))
        query_results = cur.fetchall()
    except:
        conn.close()
        abort(400, "Invalid data was provided to the Database")

    cur.close()
    conn.close()

    for i, _ in enumerate(query_results):
        # Convert from RealDictCursor to Dictionary
        query_results[i] = dict(query_results[i])

        # Add upvoted and downvoted fields to comments
        query_results[i]["is_upvoted"] = False
        query_results[i]["is_downvoted"] = False

        # If the user id is present in the votes, update fields
        if user_id in query_results[i]["upvote_user_ids"]:
            query_results[i]["is_upvoted"] = True
        elif user_id in query_results[i]["downvote_user_ids"]:
            query_results[i]["is_upvoted"] = True

        # Add upvote and downvote count fields
        query_results[i]["upvotes"] = len(query_results[i]["upvote_user_ids"])
        query_results[i]["downvotes"] = len(query_results[i]["downvote_user_ids"])
        query_results[i]["vote_difference"] = (
            query_results[i]["upvotes"] - query_results[i]["downvotes"]
        )

        # Remove user_ids exposed in upvotes and downvotes
        del query_results[i]["upvote_user_ids"]
        del query_results[i]["downvote_user_ids"]

        # Fix the case of [None], into []
        if query_results[i]["replies"] == [None]:
            query_results[i]["replies"] = []
            continue

        for j in range(len(query_results[i]["replies"])):
            # Add upvote and downvote fields to replies
            query_results[i]["replies"][j]["is_upvoted"] = False
            query_results[i]["replies"][j]["is_downvoted"] = False

            # If the user is present in the reply votes, update fields
            if user_id in query_results[i]["replies"][j]["upvote_user_ids"]:
                query_results[i]["replies"][j]["is_upvoted"] = True
            elif user_id in query_results[i]["replies"][j]["downvote_user_ids"]:
                query_results[i]["replies"][j]["is_downvoted"] = True

            # Add number of upvotes and downvote fields
            query_results[i]["replies"][j]["upvotes"] = len(
                query_results[i]["replies"][j]["upvote_user_ids"]
            )
            query_results[i]["replies"][j]["downvotes"] = len(
                query_results[i]["replies"][j]["downvote_user_ids"]
            )
            query_results[i]["replies"][j]["vote_difference"] = (
                query_results[i]["replies"][j]["upvotes"]
                - query_results[i]["replies"][j]["downvotes"]
            )

            # Remove upvote and downvote user ids
            del query_results[i]["replies"][j]["upvote_user_ids"]
            del query_results[i]["replies"][j]["downvote_user_ids"]

    # TODO: Sort Weighting

    return {"message": "Comments Successfully Fetched", "comments": query_results}


def vote_on_comment(user_id, comment_id, upvote=True):
    # Open database connection
    conn = create_DB_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    # Pick the execution query based off upvote boolean
    if upvote:
        execute_query = "SELECT * FROM upvote_comment(%s, %s)"
    else:
        execute_query = "SELECT * FROM downvote_comment(%s, %s)"

    try:
        cur.execute(execute_query, (user_id, comment_id))
        # Function returns the edited row
        voted_comment = dict(cur.fetchall()[0])
        # Calculate the new amount of upvotes and downvotes
        voted_comment["upvotes"] = len(voted_comment["upvote_user_ids"])
        voted_comment["downvotes"] = len(voted_comment["downvote_user_ids"])
        voted_comment["vote_difference"] = (
            voted_comment["upvotes"] - voted_comment["downvotes"]
        )
        # Remove columns that contain exposed user ids
        del voted_comment["upvote_user_ids"]
        del voted_comment["downvote_user_ids"]
    # If the user attempts to vote on a deleted comment
    except psycopg2.errors.InternalError:
        conn.close()
        abort(400, "Cannot vote on a deleted comment")
    # If the data provided is invalid
    except:
        conn.close()
        abort(400, "Invalid data provided to the database")

    conn.commit()
    cur.close()
    conn.close()

    return {"message": "Submitted successfully", "comment": voted_comment}


def vote_on_reply(user_id, reply_id, upvote=True):
    # Open database connection
    conn = create_DB_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    # Pick the execution query based off upvote boolean
    if upvote:
        execute_query = "SELECT * FROM upvote_reply(%s, %s)"
    else:
        execute_query = "SELECT * FROM downvote_reply(%s, %s)"

    try:
        cur.execute(execute_query, (user_id, reply_id))
        # Function returns the edited row
        voted_comment = dict(cur.fetchall()[0])
        # Calculate the new amount of upvotes and downvotes
        voted_comment["upvotes"] = len(voted_comment["upvote_user_ids"])
        voted_comment["downvotes"] = len(voted_comment["downvote_user_ids"])
        voted_comment["vote_difference"] = (
            voted_comment["upvotes"] - voted_comment["downvotes"]
        )
        # Remove columns that contain exposed user ids
        del voted_comment["upvote_user_ids"]
        del voted_comment["downvote_user_ids"]
    # If the data provided is invalid
    except:
        conn.close()
        abort(400, "Invalid data provided to the database")

    conn.commit()
    cur.close()
    conn.close()

    return {"message": "Submitted successfully", "comment": voted_comment}


# ---------------------------------------------------------------------------- #
#                                    Routes                                    #
# ---------------------------------------------------------------------------- #


@FORUM_NS.route("")
class Forum(Resource):
    @FORUM_NS.doc(
        description="Fetch all the comments and child comments for a given Stock Page."
    )
    @FORUM_NS.expect(token_parser(FORUM_NS), forum_parser(FORUM_NS), validate=True)
    @FORUM_NS.response(200, "Successfully found Stock comments")
    @FORUM_NS.response(400, "Invalid Data was provided")
    def get(self):
        token = request.headers.get("Authorization")
        user_id = get_id_from_token(token)
        stock_ticker = request.args.get("stockTicker")
        result = get_stock_comments(user_id, stock_ticker)
        return Response(dumps(result), status=200)


@FORUM_NS.route("/comment")
class Comment(Resource):
    @FORUM_NS.doc(
        description="Post a new comment to a Stock page given the content provided."
    )
    @FORUM_NS.expect(token_parser(FORUM_NS), comment_model(FORUM_NS), validate=True)
    @FORUM_NS.response(200, "Successfully posted comment")
    @FORUM_NS.response(400, "Invalid data was provided")
    def post(self):
        token = request.headers.get("Authorization")
        user_id = get_id_from_token(token)
        data = request.get_json()
        result = post_comment(
            user_id, data["stockTicker"], data["timestamp"], data["content"]
        )
        return Response(dumps(result), status=201)

    @FORUM_NS.doc(
        description="Make a Parent Comment disabled and prevented against voting."
    )
    @FORUM_NS.expect(
        token_parser(FORUM_NS), comment_delete_model(FORUM_NS), validate=True
    )
    @FORUM_NS.response(200, "Child comment successfully deleted")
    @FORUM_NS.response(400, "Invalid data was provided")
    def delete(self):
        token = request.headers.get("Authorization")
        user_id = get_id_from_token(token)
        data = request.get_json()
        result = delete_comment(user_id, data["comment_id"])
        return Response(dumps(result), status=200)

    @FORUM_NS.doc(description="Edit the Comment given the provided content.")
    @FORUM_NS.expect(
        token_parser(FORUM_NS), comment_edit_model(FORUM_NS), validate=True
    )
    @FORUM_NS.response(200, "Comment successfully updated")
    @FORUM_NS.response(400, "Invalid data was provided")
    def put(self):
        token = request.headers.get("Authorization")
        user_id = get_id_from_token(token)
        data = request.get_json()
        result = edit_comment(
            user_id, data["comment_id"], data["time_stamp"], data["content"]
        )
        return Response(dumps(result), status=200)


@FORUM_NS.route("/reply")
class Reply(Resource):
    @FORUM_NS.doc(description="Create a reply with the provided Parent ID and content.")
    @FORUM_NS.expect(token_parser(FORUM_NS), reply_model(FORUM_NS), validate=True)
    @FORUM_NS.response(200, "Successfully submitted reply")
    @FORUM_NS.response(400, "Invalid data was provided")
    def post(self):
        token = request.headers.get("Authorization")
        user_id = get_id_from_token(token)
        data = request.get_json()
        result = post_comment(
            user_id,
            data["stockTicker"],
            int(data["timestamp"]),
            data["content"],
            data["parentID"],
        )
        return Response(dumps(result), status=201)

    @FORUM_NS.doc(description="Delete a reply given the parent and reply IDs.")
    @FORUM_NS.expect(
        token_parser(FORUM_NS), reply_delete_model(FORUM_NS), validate=True
    )
    @FORUM_NS.response(200, "Successfully delete reply")
    @FORUM_NS.response(400, "Invalid data was provided")
    def delete(self):
        token = request.headers.get("Authorization")
        user_id = get_id_from_token(token)
        data = request.get_json()
        result = delete_comment(user_id, data["comment_id"], data["parent_id"])
        return Response(dumps(result), status=200)

    @FORUM_NS.doc(description="Edit a Reply with new content at the new time.")
    @FORUM_NS.expect(token_parser(FORUM_NS), reply_edit_model(FORUM_NS), validate=True)
    @FORUM_NS.response(200, "Successfully edited reply")
    @FORUM_NS.response(400, "Invalid data was provided")
    def put(self):
        token = request.headers.get("Authorization")
        user_id = get_id_from_token(token)
        data = request.get_json()
        result = edit_comment(
            user_id,
            data["comment_id"],
            data["time_stamp"],
            data["content"],
            data["parent_id"],
        )
        return Response(dumps(result), status=200)


@FORUM_NS.route("/comment/upvote")
class UpvoteComment(Resource):
    @FORUM_NS.doc(description="Upvote the Comment given the Comment ID.")
    @FORUM_NS.expect(
        token_parser(FORUM_NS), comment_vote_model(FORUM_NS), validate=True
    )
    @FORUM_NS.response(200, "Successfully upvoted comment")
    @FORUM_NS.response(400, "No comment with the Comment ID was found")
    def put(self):
        token = request.headers.get("Authorization")
        user_id = get_id_from_token(token)
        data = request.get_json()
        result = vote_on_comment(user_id, data["comment_id"])
        return Response(dumps(result), status=200)


@FORUM_NS.route("/comment/downvote")
class DownvoteComment(Resource):
    @FORUM_NS.doc(description="Downvote the Comment given the Comment ID.")
    @FORUM_NS.expect(
        token_parser(FORUM_NS), comment_vote_model(FORUM_NS), validate=True
    )
    @FORUM_NS.response(200, "Successfully downvoted comment")
    @FORUM_NS.response(404, "No comment with the Comment ID was found")
    def put(self):
        token = request.headers.get("Authorization")
        user_id = get_id_from_token(token)
        data = request.get_json()
        result = vote_on_comment(user_id, data["comment_id"], upvote=False)
        return Response(dumps(result), status=200)


@FORUM_NS.route("/reply/upvote")
class UpvoteReply(Resource):
    @FORUM_NS.doc(description="Upvote the Reply given the Reply ID.")
    @FORUM_NS.expect(token_parser(FORUM_NS), reply_vote_model(FORUM_NS), validate=True)
    @FORUM_NS.response(200, "Successfully upvoted reply")
    @FORUM_NS.response(404, "No reply with the Reply ID was found")
    def put(self):
        token = request.headers.get("Authorization")
        user_id = get_id_from_token(token)
        data = request.get_json()
        result = vote_on_reply(user_id, data["reply_id"])
        return Response(dumps(result), status=200)


@FORUM_NS.route("/reply/downvote")
class DownvoteReply(Resource):
    @FORUM_NS.doc(description="Downvote the Reply given the Reply ID.")
    @FORUM_NS.expect(token_parser(FORUM_NS), reply_vote_model(FORUM_NS), validate=True)
    @FORUM_NS.response(200, "Successfully downvoted reply")
    @FORUM_NS.response(404, "No reply with the Reply ID was found")
    def put(self):
        token = request.headers.get("Authorization")
        user_id = get_id_from_token(token)
        data = request.get_json()
        result = vote_on_reply(user_id, data["reply_id"], upvote=False)
        return Response(dumps(result), status=200)
