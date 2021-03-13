###################
#   User Module   #
###################

import os
import re
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

    # validate email format
    if not re.search(r"(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)", email):
        return {
            'status': 'error',
            'message': 'That is not a valid email format'
        }

    # limit length of username
    if len(username) > 30:
        return {
            'status': 'error',
            'message': 'Username cannot exceed 30 characters'
        }

    # limit length of first name
    if len(first_name) > 30:
        return {
            'status': 'error',
            'message': 'First name cannot exceed 30 characters'
        }

    # limit length of last name
    if len(last_name) > 30:
        return {
            'status': 'error',
            'message': 'Last name cannot exceed 30 characters'
        }

    # restrict length of password
    if len(password) < 8 or len(password) > 16:
        return {
            'status': 'error',
            'message': 'Password must be between 8 and 16 characters'
        }

    # check if user with current email already exists
    user_query = f"select id from users where email='{email}'"
    cur.execute(user_query)
    if cur.fetchone():
        return {
            'status': 'error',
            'message': 'There is already a user registered with this email'
        }

    # encode password
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    # insert user into database
    insert_query = "insert into Users (username, first_name, last_name, email, password) values (%s, %s, %s, %s, %s)"
    cur.execute(insert_query, (username, first_name, last_name, email, hashed_password))

    # extract user id
    cur.execute(user_query)
    user_id = cur.fetchone()[0]

    # close database connection
    conn.commit()
    cur.close()
    conn.close()

    # successful return
    return {
        'status': 'success',
        'userID': user_id,
        'token': jwt.encode({"id": user_id}, JWT_SECRET, algorithm='HS256'),
        'message': 'Successfully registered!'
    }


def login_user(email, password):
    # open database connection
    conn = createDBConnection()
    cur = conn.cursor()

    # check if user with current email already exists
    user_query = f"select id, password from users where email='{email}'"
    cur.execute(user_query)
    user_info = cur.fetchone()

    # check if there is an existing user with this email
    if not user_info:
        return {
            'status': 'error',
            'message': 'There is no user registered with this email'
        }

    user_id, hashed_password = user_info

    # check if the password is correct
    if not bcrypt.checkpw(password.encode('utf-8'), bytes(hashed_password)):
        return {
            'status': 'error',
            'message': 'Incorrect password'
        }
        
    # close database connection
    conn.commit()
    cur.close()
    conn.close()

    # successful return
    return {
        'status': 'success',
        'userID': user_id,
        'token': jwt.encode({"id": user_id}, JWT_SECRET, algorithm='HS256'),
        'message': 'Successfully logged in!'
    }




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
