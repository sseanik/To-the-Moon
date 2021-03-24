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

    conn.commit()
    conn.close()
    return response

# TEST THIS
def editNote(userID, title, content, stock_symbols, portfolio_names, external_references, internal_references):
    pass

# TEST THIS
def deleteNote(userID, title):
    pass

def getNote(userID, title):
    pass

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
    response = addNote(userID, title, content, stock_symbols, portfolio_names, external_references, internal_references)
    return dumps(response)


################################
# TESTING
################################
'''
insert into Notes (userID, title, content, stock_symbols, portfolio_names, external_references, internal_references) 
values ('0ee69cfc-83ce-11eb-8620-0a4e2d6dea13', 'Austin''s note', 'Random content', ARRAY['IBM', 'TSLA']::TEXT[], ARRAY['Austin''s portfolio']::TEXT[], ARRAY['https://www.google.com/']::TEXT[], ARRAY[]::TEXT[]);
'''
print(addNote('0ee69cfc-83ce-11eb-8620-0a4e2d6dea19', 'Austin\'s new note', 'Random content', ['IBM', 'TSLA'], ['Austin\'s portfolio'], ['https://www.google.com/'], []))