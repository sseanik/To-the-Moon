###################
#   User Module   #
###################

import os
import bcrypt
import jwt
from json import dumps
from flask import Blueprint, request
from database import USER, createDBConnection
from dotenv import load_dotenv


#######################
# GLOBAL DECLARATIONS #
#######################


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
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)

    # check if user with current email already exists
    user_query = f"select id from users where email='{email}'"
    cur.execute(user_query, (email))
    user_id = cur.fetchone()[0]
    if user_id:
        return {
            'status': 'error',
            'message': 'There is already a user registered with this email'
        }

    # insert user into database
    insert_query = f"insert into Users ({username}, {first_name}, {last_name}, {email}, {[hashed_password]}"
    cur.execute(insert_query, (username, first_name, last_name, email, [hashed_password]))

    # close database connection
    conn.commit()
    cur.close()
    conn.close()

    return {
        'status': 'success',
        'userID': user_id,
        'token': jwt.encode({"id": user_id}, JWT_SECRET, algorithm='HS256')
    }


def login_user(email, password):
    # open database connection
    conn = createDBConnection()
    cur = conn.cursor()

    # check if user with current email already exists
    user_query = f"select id, password from users where email='{email}'"
    cur.execute(user_query, (email))
    user_id, hashed_password = cur.fetchone()
    print(user_id, password)

    # check if there is an existing user with this email
    if not user_id:
        return {
            'status': 'error',
            'message': 'There is no user registered with this email'
        }

    # check if the password is correct
    if not bcrypt.checkpw(password, hashed_password):
        return {
            'status': 'error',
            'message': 'Incorrect password'
        }

    return {
        'status': 'success',
        'userID': user_id,
        'token': jwt.encode({"id": user_id}, JWT_SECRET, algorithm='HS256')
    }

    # close database connection
    conn.commit()
    cur.close()
    conn.close()



################################
# Please leave all routes here #
################################


@USER_ROUTES.route('/register', methods=['POST'])
def register_user_wrapper():
    data = request.get_json()
    result = register_user(data['first_name'], data['last_name'], data['email'], data['username'], data['password'])
    return dumps(result)


@USER_ROUTES.route('/login', methods=['POST'])
def login_user_wrapper():
    data = request.get_json()
    result = login_user(data['email'], data['password'])
    return dumps(result)
