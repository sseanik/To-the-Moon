###################
#   User Module   #
###################

import os
import bcrypt
import jwt
from json import dumps
from flask import Blueprint, request
from database import createDBConnection
from dotenv import load_dotenv

load_dotenv()
JWT_SECRET = os.getenv("JWT_SECRET")
USER_ROUTES = Blueprint('user', __name__)


###################################
# Please leave all functions here #
###################################

def register_user(first_name, last_name, email, username, password):
    # open database connection
    conn = createDBConnection()
    cur = conn.cursor()

    # encode password
    print(f'Unencoded password: {password}')
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
    print(f'Encoded password: {hashed_password}')


    # check if user with current email already exists
    user_query = f"select id from users where email='{email}'"
    cur.execute(user_query, (email))
    if (len(cur.fetchall()) != 0):
        return {
            'status': 'failure',
            'error': 'There is already a user registered with this email'
        }

    # insert user into database
    insert_query = "insert into Users (username, first_name, last_name, email, password) values (%s, %s, %s, %s, %s)"
    cur.execute(insert_query, (username, first_name, last_name, email, [hashed_password]))


    # get that user's id
    cur.execute(user_query, (email))
    user_id = cur.fetchone()[0]

    # close database connection
    conn.commit()
    cur.close()
    conn.close()

    return {
        'userID': user_id,
        'token': jwt.encode({"id": user_id}, JWT_SECRET, algorithm='HS256')
    }


################################
# Please leave all routes here #
################################

@USER_ROUTES.route('/register', methods=['POST'])
def register_user_wrapper():
    data = request.get_json()
    result = register_user(data['first_name'], data['last_name'], data['email'], data['username'], data['password'])
    return dumps(result)
