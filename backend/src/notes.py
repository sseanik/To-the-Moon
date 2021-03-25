####################
#   Forum Module   #
####################


from flask import Blueprint, request
import psycopg2
from json import dumps
from database import createDBConnection
from token_util import getIDfromToken
from helpers import TimeSeries, AlphaVantageAPI
from datetime import datetime

NOTE_ROUTES = Blueprint('notes', __name__)


###################################
# Please leave all functions here #
###################################

# TEST THIS
def addNote(userID, title, content, stock_symbols, portfolio_names, external_references, internal_references):
    if len(title) >= 300:
        return {'status': 400, 'message': 'The note title cannot be more than 300 characters. Try a new title.'}

    if len(content) >= 5000:
        return {'status': 400, 'message': 'The note contnets cannot be more than 5000 characters. Please reduct content or create a new note.'}

    conn = createDBConnection()
    cur = conn.cursor()
    sqlQuery = """
    insert into Notes (userID, title, content, stock_symbols, portfolio_names, external_references, internal_references) 
    values (%s, %s, %s, %s::TEXT[], %s::TEXT[], %s::TEXT[], %s::TEXT[])
    """
    try:
        cur.execute(sqlQuery, (userID, title, content, stock_symbols, portfolio_names, external_references, internal_references))
        conn.commit()
        response = {
            'status' : 200, 
            'message' : "Note called \'" + title + "\' has been created."
        }
    except psycopg2.errors.UniqueViolation:
        response = {
            'status' : 400,
            'message' : 'There is already a note called \'' + title + '\'. Try anther title name.'
        }
    except:
        response = {
            'status' : 400,
            'message' : 'Something went wrong when inserting'
        }
    conn.close()
    return response


# TEST THIS
def editNote(userID, old_title, new_title, content, stock_symbols, portfolio_names, external_references, internal_references):
    if len(new_title) >= 300:
        return {'status': 400, 'message': 'The note title cannot be more than 300 characters. Try a new title.'}

    if len(content) >= 5000:
        return {'status': 400, 'message': 'The note contnets cannot be more than 5000 characters. Please reduct content or create a new note.'}

    conn = createDBConnection()
    cur = conn.cursor()
    sqlQuery = """
    update notes set title=%s, content=%s, stock_symbols=%s::TEXT[], portfolio_names=%s::TEXT[], external_references=%s::TEXT[], internal_references=%s::TEXT[]
    where userID=%s and title=%s
    """
    try:
        cur.execute(sqlQuery, (new_title, content, stock_symbols, portfolio_names, external_references, internal_references, userID, old_title))
        conn.commit()
        response = {
            'status' : 200, 
            'message' :  'Note called \'' + old_title + "\' has been changed to \'" + new_title + "\'."
        }
    except psycopg2.errors.UniqueViolation:
        response = {
            'status' : 400,
            'message' : 'There is already a note called \'' + new_title + '\'. Try anther title name.'
        }
    except:
        response = {
            'status' : 400,
            'message' : 'Something went wrong when updating'
        }
    conn.close()
    return response


# TEST THIS
def deleteNote(userID, title):
    conn = createDBConnection()
    cur = conn.cursor()
    sqlQuery = "delete from notes where userID=%s and title=%s"
    cur.execute(sqlQuery, (userID, title))
    conn.commit()
    conn.close()
    return {'status' : 200, 'message' : "Note removed"}


def getNote(userID, title):
    conn = createDBConnection()
    cur = conn.cursor()
    sqlQuery = "select * from notes where userID=%s and title=%s"
    cur.execute(sqlQuery, (userID, title))
    queryResults = cur.fetchall()[0]
    note = {
        'title' : queryResults[1],
        'content' : queryResults[2],
        'stock_symbols' : queryResults[3],
        'portfolio_names' : queryResults[4],
        'external_references' : queryResults[5],
        'internal_references' : queryResults[6],
    }
    conn.close()
    return {'status' : 200, 'data' : note}


def getRelevantNotes(userID, stock_symbols, portfolio_names):
    conn = createDBConnection()
    cur = conn.cursor()
    sqlQuery = "select * from notes where userID=%s and (%s::TEXT[] && stock_symbols or %s::TEXT[] && portfolio_names)"
    cur.execute(sqlQuery, (userID, stock_symbols, portfolio_names))
    queryResults = cur.fetchall()
    notes = []
    for note in queryResults:
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


def getAllNotes(userID):
    conn = createDBConnection()
    cur = conn.cursor()
    sqlQuery = "select * from notes where userID=%s"
    cur.execute(sqlQuery, (userID, ))
    queryResults = cur.fetchall()
    notes = []
    for note in queryResults:
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

# TEST THIS
@NOTE_ROUTES.route('notes/addNote', methods=['POST'])
def createUsersNote():
    token = request.headers.get('Authorization')
    userID = getIDfromToken(token)
    title = request.args.get('title')
    content = request.args.get('content')
    stock_symbols = request.args.get('stock_symbols')
    portfolio_names = request.args.get('portfolio_names')
    external_references = request.args.get('external_references')
    internal_references = request.args.get('internal_references')
    response = addNote(userID['id'], title, content, stock_symbols, portfolio_names, external_references, internal_references)
    return dumps(response)


# TEST THIS
@NOTE_ROUTES.route('notes/editNote', methods=['PUT'])
def editUsersNote():
    token = request.headers.get('Authorization')
    userID = getIDfromToken(token)
    old_title = request.args.get('new_title')
    new_title = request.args.get('new_title')
    content = request.args.get('content')
    stock_symbols = request.args.get('stock_symbols')
    portfolio_names = request.args.get('portfolio_names')
    external_references = request.args.get('external_references')
    internal_references = request.args.get('internal_references')
    response = editNote(userID['id'], old_title, new_title, content, stock_symbols, portfolio_names, external_references, internal_references)
    return dumps(response)


# TEST THIS
@NOTE_ROUTES.route('/notes/deleteNote', methods=['DELETE'])
def deleteUsersNote():
    token = request.headers.get('Authorization')
    userID = getIDfromToken(token)
    title = request.args.get('title')
    response = deleteNote(userID['id'], title)
    return dumps(response)


# TEST THIS
@NOTE_ROUTES.route('/notes/getNotes', methods=['GET'])
def getUsersNotes():
    token = request.headers.get('Authorization')
    userID = getIDfromToken(token)
    response = getAllNotes(userID['id'])
    return dumps(response)


# Add route for get relevant notes
@NOTE_ROUTES.route('/notes/getRelevantNotes', methods=['GET'])
def getUsersNotes():
    token = request.headers.get('Authorization')
    userID = getIDfromToken(token)
    stock_symbols = request.args.get('stock_symbols')
    portfolio_names = request.args.get('portfolio_names')
    response = getRelevantNotes(userID['id'], stock_symbols, portfolio_names)
    return dumps(response)


################################
# TESTING
################################
'''
insert into Notes (userID, title, content, stock_symbols, portfolio_names, external_references, internal_references) 
values ('0ee69cfc-83ce-11eb-8620-0a4e2d6dea13', 'Austin''s note', 'Random content', ARRAY['IBM', 'TSLA']::TEXT[], ARRAY['Austin''s portfolio']::TEXT[], ARRAY['https://www.google.com/']::TEXT[], ARRAY[]::TEXT[]);
'''
#print(addNote('0ee69cfc-83ce-11eb-8620-0a4e2d6dea19', 'Austin\'s new note', 'Random content', ['IBM', 'TSLA'], ['Austin\'s portfolio'], ['https://www.google.com/'], []))
#print(editNote('0ee69cfc-83ce-11eb-8620-0a4e2d6dea19', 'Austin\'s new note', 'Testing edit function', 'Random content', ['IBM', 'TSLA'], ['Austin\'s portfolio'], ['https://www.google.com/'], []))
#print(editNote('0ee69cfc-83ce-11eb-8620-0a4e2d6dea19', 'Austin\'s notez', 'Austin\'s test note', 'Random content', ['IBM', 'TSLA'], ['Austin\'s portfolio'], ['https://www.google.com/'], []))
#print(deleteNote('0ee69cfc-83ce-11eb-8620-0a4e2d6dea13', 'Austin\'s note'))

#print(getNote('0ee69cfc-83ce-11eb-8620-0a4e2d6dea19', 'Austin\'s test note'))
#print(getAllNotes('0ee69cfc-83ce-11eb-8620-0a4e2d6dea19'))
print(getRelevantNotes('0ee69cfc-83ce-11eb-8620-0a4e2d6dea19', ['IBM'], []))
