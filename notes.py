####################
#   Notes Module   #
####################


from flask import Blueprint, request
import psycopg2
from json import dumps
from database import create_DB_connection
from token_util import get_id_from_token
from helpers import TimeSeries, AlphaVantageAPI
from datetime import datetime

NOTE_ROUTES = Blueprint('notes', __name__)


###################################
# Please leave all functions here #
###################################

def add_note(user_id, title, content, stock_symbols, portfolio_names, external_references, internal_references):
    if len(title) >= 300 or len(title) == 0:
        return {'status': 400, 'error': 'The note title must be at least 1 character and no more than 300 characters. Try a new title.'}

    if len(content) >= 5000 or len(content) == 0:
        return {'status': 400, 'error': 'The note contents must be more than 1 character and less than 5000 characters. Please adjust content.'}

    conn = create_DB_connection()
    cur = conn.cursor()
    sql_query = """
    INSERT INTO notes (user_id, title, content, stock_symbols, portfolio_names, external_references, internal_references) 
    VALUES (%s, %s, %s, %s::TEXT[], %s::TEXT[], %s::TEXT[], %s::TEXT[])
    """
    try:
        cur.execute(sql_query, (user_id, title, content, stock_symbols, portfolio_names, external_references, internal_references))
        conn.commit()
        response = {
            'status' : 200, 
            'message' : "Note called \'" + title + "\' has been created."
        }
    except psycopg2.errors.UniqueViolation:
        response = {
            'status' : 400,
            'error' : 'There is already a note called \'' + title + '\'. Try another title name.'
        }
    except:
        response = {
            'status' : 400,
            'error' : 'Something went wrong when inserting'
        } 
    conn.close()
    return response


def edit_note(user_id, old_title, new_title, content, stock_symbols, portfolio_names, external_references, internal_references):
    if len(new_title) >= 300 or len(new_title) == 0:
        return {'status': 400, 'error': 'The note title must be at least 1 character and no more than 300 characters. Try a new title.'}

    if len(content) >= 5000 or len(content) == 0:
        return {'status': 400, 'error': 'The note contents must be more than 1 character and less than 5000 characters. Please adjust content.'}

    conn = create_DB_connection()
    cur = conn.cursor()
    sql_query = """
        UPDATE notes SET title=%s, content=%s, stock_symbols=%s::TEXT[], portfolio_names=%s::TEXT[], external_references=%s::TEXT[], internal_references=%s::TEXT[]
        WHERE user_id=%s AND title=%s
    """
    try:
        cur.execute(sql_query, (new_title, content, stock_symbols, portfolio_names, external_references, internal_references, user_id, old_title))
        conn.commit()
        response = {
            'status' : 200, 
            'message' :  'Note called \'' + old_title + "\' has been changed to \'" + new_title + "\'."
        }
    except psycopg2.errors.UniqueViolation:
        response = {
            'status' : 400,
            'error' : 'There is already a note called \'' + new_title + '\'. Try another title name.'
        }
    except:
        response = {
            'status' : 400,
            'error' : 'Something went wrong when updating'
        }
    conn.close()
    return response


def delete_note(user_id, title):
    conn = create_DB_connection()
    cur = conn.cursor()
    sql_query = "DELETE FROM notes WHERE user_id=%s AND title=%s"
    cur.execute(sql_query, (user_id, title))
    conn.commit()
    conn.close()
    return {'status' : 200, 'message' : "Note removed"}


def get_note(user_id, title):
    conn = create_DB_connection()
    cur = conn.cursor()
    sql_query = "SELECT * FROM notes WHERE user_id=%s AND title=%s"
    cur.execute(sql_query, (user_id, title))
    query_results = cur.fetchall()[0]
    note = {
        'title' : query_results[1],
        'content' : query_results[2],
        'stock_symbols' : query_results[3],
        'portfolio_names' : query_results[4],
        'external_references' : query_results[5],
        'internal_references' : query_results[6],
    }
    conn.close()
    return {'status' : 200, 'data' : note}


def get_relevant_notes(user_id, stock_symbols, portfolio_names):
    conn = create_DB_connection()
    cur = conn.cursor()
    sql_query = "SELECT * FROM notes WHERE user_id=%s AND (%s::TEXT[] && stock_symbols OR %s::TEXT[] && portfolio_names)"
    cur.execute(sql_query, (user_id, stock_symbols, portfolio_names))
    query_results = cur.fetchall()
    notes = []
    for note in query_results:
        new_data = {
            'title' : note[1],
            'content' : note[2],
            'stock_symbols' : note[3],
            'portfolio_names' : note[4],
            'external_references' : note[5],
            'internal_references' : note[6],
        }
        notes.append(new_data)
    conn.close()
    return {'status' : 200, 'data' : notes}


def get_all_notes(user_id):
    conn = create_DB_connection()
    cur = conn.cursor()
    sql_query = "SELECT * FROM notes WHERE user_id=%s"
    cur.execute(sql_query, (user_id, ))
    query_results = cur.fetchall()
    notes = []
    for note in query_results:
        new_data = {
            'title' : note[1],
            'content' : note[2],
            'stock_symbols' : note[3],
            'portfolio_names' : note[4],
            'external_references' : note[5],
            'internal_references' : note[6],
        }
        notes.append(new_data)
    conn.close()
    return {'status' : 200, 'data' : notes}


################################
# Please leave all routes here #
################################

@NOTE_ROUTES.route('/notes', methods=['POST'])
def create_users_note_wrapper():
    token = request.headers.get('Authorization')
    user_id = get_id_from_token(token)
    data = request.get_json()
    title = data['title']
    content = data['content']
    stock_symbols = data['stock_symbols']
    portfolio_names = data['portfolio_names']
    external_references = data['external_references']
    internal_references = data['internal_references']
    response = add_note(user_id, title, content, stock_symbols, portfolio_names, external_references, internal_references)
    return dumps(response)


@NOTE_ROUTES.route('/notes', methods=['PUT'])
def edit_users_note_wrapper():
    token = request.headers.get('Authorization')
    user_id = get_id_from_token(token)
    old_title = request.args.get('old_title')
    data = request.get_json()
    new_title = data['new_title']
    content = data['content']
    stock_symbols = data['stock_symbols']
    portfolio_names = data['portfolio_names']
    external_references = data['external_references']
    internal_references = data['internal_references']
    response = edit_note(user_id, old_title, new_title, content, stock_symbols, portfolio_names, external_references, internal_references)
    return dumps(response)


@NOTE_ROUTES.route('/notes', methods=['DELETE'])
def delete_users_note_wrapper():
    token = request.headers.get('Authorization')
    user_id = get_id_from_token(token)
    title = request.args.get('title')
    response = delete_note(user_id, title)
    return dumps(response)


@NOTE_ROUTES.route('/notes', methods=['GET'])
def get_users_notes_wrapper():
    token = request.headers.get('Authorization')
    user_id = get_id_from_token(token)
    response = get_all_notes(user_id)
    return dumps(response)


# Add route for get relevant notes
@NOTE_ROUTES.route('/notes/relevant', methods=['GET'])
def get_users_relevant_notes_wrapper():
    token = request.headers.get('Authorization')
    user_id = get_id_from_token(token)
    data = request.get_json()
    stock_symbols = data['stock_symbols']
    portfolio_names = data['portfolio_names']
    response = get_relevant_notes(user_id, stock_symbols, portfolio_names)
    return dumps(response)


################################
# TESTING
################################
'''
insert into Notes (user_id, title, content, stock_symbols, portfolio_names, external_references, internal_references) 
values ('0ee69cfc-83ce-11eb-8620-0a4e2d6dea13', 'Austin''s note', 'Random content', ARRAY['IBM', 'TSLA']::TEXT[], ARRAY['Austin''s portfolio']::TEXT[], ARRAY['https://www.google.com/']::TEXT[], ARRAY[]::TEXT[]);
'''
#print(add_note('0ee69cfc-83ce-11eb-8620-0a4e2d6dea19', 'Austin\'s new note', 'Random content', ['IBM', 'TSLA'], ['Austin\'s portfolio'], ['https://www.google.com/'], []))
#print(edit_note('0ee69cfc-83ce-11eb-8620-0a4e2d6dea19', 'Austin\'s new note', 'Testing edit function', 'Random content', ['IBM', 'TSLA'], ['Austin\'s portfolio'], ['https://www.google.com/'], []))
#print(edit_note('0ee69cfc-83ce-11eb-8620-0a4e2d6dea19', 'Austin\'s notez', 'Austin\'s test note', 'Random content', ['IBM', 'TSLA'], ['Austin\'s portfolio'], ['https://www.google.com/'], []))
#print(delete_note('0ee69cfc-83ce-11eb-8620-0a4e2d6dea19', 'Testing edit function'))

#print(get_note('0ee69cfc-83ce-11eb-8620-0a4e2d6dea19', 'Austin\'s test note'))
#print(get_all_notes('0ee69cfc-83ce-11eb-8620-0a4e2d6dea19'))
#print(get_relevant_notes('0ee69cfc-83ce-11eb-8620-0a4e2d6dea19', ['IBM'], []))
