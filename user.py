###################
#   User Module   #
###################

import os
import re
import bcrypt
from json import dumps
from flask import Blueprint, request
from database import create_DB_connection
from token_util import generate_token, get_id_from_token


#######################
# GLOBAL DECLARATIONS #
#######################


USER_ROUTES = Blueprint('user', __name__)


###################################
# Please leave all functions here #
###################################


def register_user(first_name, last_name, email, username, password):
    # open database connection
    conn = create_DB_connection()
    cur = conn.cursor()

    # validate email format
    if not re.search(r"(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)", email):
        return {
            'status': 400,
            'error': 'Not a valid email format'
        }

    
    # minimum length of username
    if len(username) < 3:
        return {
            'status': 400,
            'error': 'Username must be at least 3 characters'
        }

    # maximum length of username
    if len(username) > 30:
        return {
            'status': 400,
            'error': 'Username cannot exceed 30 characters'
        }

    # limit length of first name
    if len(first_name) > 30:
        return {
            'status': 400,
            'error': 'First name cannot exceed 30 characters'
        }

    # limit length of last name
    if len(last_name) > 30:
        return {
            'status': 400,
            'error': 'Last name cannot exceed 30 characters'
        }

    # restrict length of password
    if len(password) < 8 or len(password) > 16:
        return {
            'status': 400,
            'error': 'Password must be between 8 and 16 characters'
        }

    # check if user with current email already exists
    user_query = f"select id from users where email='{email}'"
    cur.execute(user_query)
    if cur.fetchone():
        return {
            'status': 400,
            'error': 'Already a user registered with given email'
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
        'status': 200,
        'username': username,
        'token': generate_token(user_id),
        'message': 'Successfully registered!'
    }


def login_user(email, password):
    # open database connection
    conn = create_DB_connection()
    cur = conn.cursor()

    # check if user with current email already exists
    user_query = f"select id, password, username from users where email='{email}'"
    cur.execute(user_query)
    user_info = cur.fetchone()

    # check if there is an existing user with this email
    if not user_info:
        return {
            'status': 404,
            'error': 'No user registered with given email'
        }

    user_id, hashed_password, username = user_info

    # check if the password is correct
    if not bcrypt.checkpw(password.encode('utf-8'), bytes(hashed_password)):
        return {
            'status': 404,
            'error': 'Incorrect password'
        }
        
    # close database connection
    conn.commit()
    cur.close()
    conn.close()

    # successful return
    return {
        'status': 200,
        'username': username,
        'token': generate_token(user_id),
        'message': 'Successfully logged in!'
    }


def get_username(user_id):
    # open database connection
    conn = create_DB_connection()
    cur = conn.cursor()

    # check if user with current id exists
    user_query = f"select username from users where id='{user_id}'"
    cur.execute(user_query)
    user_info = cur.fetchone()

    # check if there is an existing user with this email
    if not user_info:
        return {
            'status': 404,
            'error': 'Token error, no user registered under user ID'
        }

    username = user_info[0]
        
    # close database connection
    conn.commit()
    cur.close()
    conn.close()

    # successful return
    return {
        'status': 200,
        'username': username,
        'message': 'Successfully retrieved username!'
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


# Given a user token, return a user's username
@USER_ROUTES.route('/user', methods=['GET'])
def get_user_wrapper():
    token = request.headers.get('Authorization')
    user_id = get_id_from_token(token)
    result = get_username(user_id)
    return dumps(result)