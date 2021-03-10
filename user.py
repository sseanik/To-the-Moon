###################
#   User Module   #
###################


import bcrypt
import jwt
from json import dumps
from flask import Blueprint, request
from database import createDBConnection

USER_ROUTES = Blueprint('user', __name__)


###################################
# Please leave all functions here #
###################################

def register_user(first_name, last_name, email, username, password):
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password, salt)

    insert_query = 'insert into User(first_name, last_name, email, username, password) values (%s, %s, %s, %s, %s)'
    conn = createDBConnection()
    cur = conn.cursor()
    cur.execute(insert_query, (first_name, last_name, email, username, hashed_password))
    conn.commit()
    conn.close()

    token = jwt.encode(username, 'secret', algorithm='HS256')
    return {
        'userID': 1,
        'token': token
    }


################################
# Please leave all routes here #
################################

@USER_ROUTES.route('/register', methods=['POST'])
def register_user_wrapper():
    data = request.get_json()
    result = register_user(data['first_name'], data['last_name'], data['email'], data['username'], data['password'])
    return dumps(result)
