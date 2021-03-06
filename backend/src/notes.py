# ---------------------------------------------------------------------------- #
#                                 Notes Module                                 #
# ---------------------------------------------------------------------------- #


from json import dumps
from flask import request, Response
from flask_restx import Namespace, Resource, abort
import psycopg2
from database import create_DB_connection
from token_util import get_id_from_token
from models import (
    token_parser,
    notes_relevant_parser,
    notes_model,
    notes_edit_model,
    notes_edit_parser,
    notes_delete_parser,
)

# ---------------------------------------------------------------------------- #
#                              Global Declarations                             #
# ---------------------------------------------------------------------------- #

NOTES_NS = Namespace(
    "notes", "Note taking feature that a User can access from any page"
)


# ---------------------------------------------------------------------------- #
#                               Helper Functions                               #
# ---------------------------------------------------------------------------- #


def add_note(
    user_id,
    title,
    content,
    stock_symbols,
    portfolio_names,
    external_references,
    internal_references,
):
    """Creates a note in the database. 

    Args:
        user_id (uuid): user identifier.
        title (string): title for the note.
        content (string): content of the note.
        stock_symbols (array of stings): list of stocks that the note is tagged too.
        portfolio_names (array of stings): list of portfolios that the note is tagged too.
        external_references (array of stings): list of URLs for the external references.
        internal_references (array of stings): list of URLs for the internal references (our news articles).

    Returns:
        dictionary: on success the dictionary returns a confirmation message that the note has been created.
    """    
    if len(title) >= 300 or len(title) == 0:
        abort(
            400,
            (
                "The note title must be at least 1 character ",
                "and no more than 300 characters. Try a new title.",
            ),
        )

    if len(content) >= 5000 or len(content) == 0:
        abort(
            400,
            (
                "The note contents must be more than 1 character ",
                "and less than 5000 characters. Please adjust content.",
            ),
        )

    conn = create_DB_connection()
    cur = conn.cursor()
    sql_query = """
    INSERT INTO notes (user_id, title, content, stock_symbols, portfolio_names, external_references, internal_references) 
    VALUES (%s, %s, %s, %s::TEXT[], %s::TEXT[], %s::TEXT[], %s::TEXT[])
    """
    try:
        cur.execute(
            sql_query,
            (
                user_id,
                title,
                content,
                stock_symbols,
                portfolio_names,
                external_references,
                internal_references,
            ),
        )
        conn.commit()
        response = {
            "message": "Note called '" + title + "' has been created.",
        }
    except psycopg2.errors.UniqueViolation:
        conn.close()
        abort(
            400,
            "There is already a note called '" + title + "'. Try another title name.",
        )

    except:
        conn.close()
        abort(400, "Something went wrong when inserting")

    conn.close()
    return response


def edit_note(
    user_id,
    old_title,
    new_title,
    content,
    stock_symbols,
    portfolio_names,
    external_references,
    internal_references,
):
    """Allows the user to edit all the fields in the given note.

    Args:
        user_id ([type]): user identifier
        old_title ([type]): the old title name. 
        new_title ([type]): the new title name.
        content (string): new content.
        stock_symbols (array of stings): list of stocks that the note is tagged too.
        portfolio_names (array of stings): list of portfolios that the note is tagged too.
        external_references (array of stings): list of URLs for the external references.
        internal_references (array of stings): list of URLs for the internal references (our news articles).

    Returns:
        dictionary: on success the dictionary returns a confirmation message that the note has been edited.
    """    
    if len(new_title) >= 300 or len(new_title) == 0:
        abort(
            400,
            (
                "The note title must be at least 1 character and ",
                "no more than 300 characters. Try a new title.",
            ),
        )

    if len(content) >= 5000 or len(content) == 0:
        abort(
            400,
            (
                "The note contents must be more than 1 character and ",
                "less than 5000 characters. Please adjust content.",
            ),
        )

    conn = create_DB_connection()
    cur = conn.cursor()
    sql_query = """
        UPDATE notes SET title=%s, content=%s, stock_symbols=%s::TEXT[], portfolio_names=%s::TEXT[], external_references=%s::TEXT[], internal_references=%s::TEXT[]
        WHERE user_id=%s AND title=%s
    """
    try:
        cur.execute(
            sql_query,
            (
                new_title,
                content,
                stock_symbols,
                portfolio_names,
                external_references,
                internal_references,
                user_id,
                old_title,
            ),
        )
        conn.commit()
        response = {
            "message": "Note called '"
            + old_title
            + "' has been changed to '"
            + new_title
            + "'.",
        }
    except psycopg2.errors.UniqueViolation:
        conn.close()
        abort(
            400,
            "There is already a note called '"
            + new_title
            + "'. Try another title name.",
        )

    except:
        conn.close()
        abort(400, "Something went wrong when updating")

    conn.close()
    return response


def delete_note(user_id, title):
    """Deletes the given note.

    Args:
        user_id (uuid): user identifier.
        title (string): title of the note.

    Returns:
        dictionary: on success the dictionary returns a confirmation message that the note has been deleted.
    """    
    conn = create_DB_connection()
    cur = conn.cursor()
    sql_query = "DELETE FROM notes WHERE user_id=%s AND title=%s"
    cur.execute(sql_query, (user_id, title))
    conn.commit()
    conn.close()
    return {"message": "Note removed"}


def get_note(user_id, title):
    """Fetches the note with the given title.

    Args:
        user_id (uuid): user identifier.
        title (string): title of the note.

    Returns:
        dictionary: on success it returns a dictionary of the note.
    """    
    conn = create_DB_connection()
    cur = conn.cursor()
    sql_query = "SELECT * FROM notes WHERE user_id=%s AND title=%s"
    cur.execute(sql_query, (user_id, title))
    query_results = cur.fetchall()[0]
    note = {
        "title": query_results[1],
        "content": query_results[2],
        "stock_symbols": query_results[3],
        "portfolio_names": query_results[4],
        "external_references": query_results[5],
        "internal_references": query_results[6],
    }
    conn.close()
    return {"data": note}


def get_relevant_notes(user_id, stock_symbols, portfolio_names):
    """Fetches the notes attached to a list of stock symbols and portfolios.

    Args:
        user_id (uuid): user identifier.
        stock_symbols (list of strings): list of stock symbols that notes could be tagged to.
        portfolio_names (list of strings): list of portfolios that notes could be tagged to.

    Returns:
        list of dictionaries: each dictionary in this list is a note that is related to these stocks or portfolios.
    """    
    conn = create_DB_connection()
    cur = conn.cursor()
    sql_query = """
        SELECT * FROM notes WHERE user_id=%s AND 
        (%s::TEXT[] && stock_symbols OR %s::TEXT[] && portfolio_names)
    """
    cur.execute(sql_query, (user_id, stock_symbols, portfolio_names))
    query_results = cur.fetchall()
    notes = []
    for note in query_results:
        new_data = {
            "title": note[1],
            "content": note[2],
            "stock_symbols": note[3],
            "portfolio_names": note[4],
            "external_references": note[5],
            "internal_references": note[6],
        }
        notes.append(new_data)
    conn.close()
    return {"data": notes}


def get_all_notes(user_id):
    """Fetches all the notes that a given user has.

    Args:
        user_id (uuid): user identifier.

    Returns:
        list of dictionaries: each dictionary in this list is a note that belongs to this user.
    """    
    conn = create_DB_connection()
    cur = conn.cursor()
    sql_query = "SELECT * FROM notes WHERE user_id=%s"
    cur.execute(sql_query, (user_id,))
    query_results = cur.fetchall()
    notes = []
    for note in query_results:
        new_data = {
            "title": note[1],
            "content": note[2],
            "stock_symbols": note[3],
            "portfolio_names": note[4],
            "external_references": note[5],
            "internal_references": note[6],
        }
        notes.append(new_data)
    conn.close()
    return {"data": notes}


# ---------------------------------------------------------------------------- #
#                                    Routes                                    #
# ---------------------------------------------------------------------------- #


@NOTES_NS.route("")
class Notes(Resource):
    @NOTES_NS.doc(description="Create a note")
    @NOTES_NS.expect(token_parser(NOTES_NS), notes_model(NOTES_NS), validate=True)
    @NOTES_NS.response(201, "Successfully created note")
    @NOTES_NS.response(404, "Invalid data was provided")
    def post(self):
        token = request.headers.get("Authorization")
        user_id = get_id_from_token(token)
        data = request.get_json()
        title = data["title"]
        content = data["content"]
        stock_symbols = data["stock_symbols"]
        portfolio_names = data["portfolio_names"]
        external_references = data["external_references"]
        internal_references = data["internal_references"]
        response = add_note(
            user_id,
            title,
            content,
            stock_symbols,
            portfolio_names,
            external_references,
            internal_references,
        )
        return Response(dumps(response), status=201)

    @NOTES_NS.doc(description="Edit an existing note")
    @NOTES_NS.expect(
        token_parser(NOTES_NS),
        notes_edit_model(NOTES_NS),
        notes_edit_parser(NOTES_NS),
        validate=True,
    )
    @NOTES_NS.response(200, "Successfully edited note")
    @NOTES_NS.response(400, "Invalid data was provided")
    def put(self):
        token = request.headers.get("Authorization")
        user_id = get_id_from_token(token)
        old_title = request.args.get("note")
        data = request.get_json()
        new_title = data["new_title"]
        content = data["content"]
        stock_symbols = data["stock_symbols"]
        portfolio_names = data["portfolio_names"]
        external_references = data["external_references"]
        internal_references = data["internal_references"]
        response = edit_note(
            user_id,
            old_title,
            new_title,
            content,
            stock_symbols,
            portfolio_names,
            external_references,
            internal_references,
        )
        return Response(dumps(response), status=200)

    @NOTES_NS.doc(description="Delete an existing note")
    @NOTES_NS.expect(
        token_parser(NOTES_NS), notes_delete_parser(NOTES_NS), validate=True
    )
    @NOTES_NS.response(200, "Successfully deleted note")
    def delete(self):
        token = request.headers.get("Authorization")
        user_id = get_id_from_token(token)
        title = request.args.get("title")
        response = delete_note(user_id, title)
        return Response(dumps(response), status=200)

    @NOTES_NS.doc(description="Fetch all notes by a user")
    @NOTES_NS.expect(token_parser(NOTES_NS), validate=True)
    @NOTES_NS.response(200, "Successfully fetched notes")
    def get(self):
        token = request.headers.get("Authorization")
        user_id = get_id_from_token(token)
        response = get_all_notes(user_id)
        return Response(dumps(response), status=200)


@NOTES_NS.route("/relevant")
class RelevantNotes(Resource):
    @NOTES_NS.doc(description="Fetch all relevant notes")
    @NOTES_NS.expect(
        token_parser(NOTES_NS), notes_relevant_parser(NOTES_NS), validate=True
    )
    @NOTES_NS.response(200, "Successfully fetched notes")
    def get(self):
        token = request.headers.get("Authorization")
        user_id = get_id_from_token(token)
        stock_symbols = request.args.getlist("stock")
        portfolio_names = request.args.getlist("portfolio")
        response = get_relevant_notes(user_id, stock_symbols, portfolio_names)
        return Response(dumps(response), status=200)
