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
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    # check if user with current email already exists
    user_query = f"select id from users where email='{email}'"
    cur.execute(user_query)
    if cur.fetchone():
        return {
            'status': 'error',
            'message': '<p>There is already a user registered with this email</p>'
        }

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

    return {
        'status': 'success',
        'userID': user_id,
        'token': jwt.encode({"id": user_id}, JWT_SECRET, algorithm='HS256'),
        'message': '<p>Successfully registered!</p>'
    }


def login_user(email, password):
    # open database connection
    conn = createDBConnection()
    cur = conn.cursor()

    # check if user with current email already exists
    user_query = f"select id, password from users where email='{email}'"
    cur.execute(user_query, (email))
    user_info = cur.fetchone()

    # check if there is an existing user with this email
    if not user_info:
        return {
            'status': 'error',
            'message': '<p>There is no user registered with this email</p>'
        }

    user_id, hashed_password = user_info

    # check if the password is correct
    if not bcrypt.checkpw(password.encode('utf-8'), bytes(hashed_password)):
        return {
            'status': 'error',
            'message': '<p>Incorrect password</p>'
        }

    return {
        'status': 'success',
        'userID': user_id,
        'token': jwt.encode({"id": user_id}, JWT_SECRET, algorithm='HS256'),
        'message': '<p>Successfully logged in!</p>'
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
