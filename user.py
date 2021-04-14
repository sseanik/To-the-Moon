# ---------------------------------------------------------------------------- #
#                                  User Module                                 #
# ---------------------------------------------------------------------------- #

from json import dumps
import re
from flask import request, Response
from database import create_DB_connection
from token_util import generate_token, get_id_from_token
from flask_restx import Namespace, Resource, abort, fields
import bcrypt
from models import login_model, register_model, token_parser

# ---------------------------------------------------------------------------- #
#                              GLOBAL DECLARATIONS                             #
# ---------------------------------------------------------------------------- #

USER_NS = Namespace("user", "Authentication and Authorisation of Users")

# ---------------------------------------------------------------------------- #
#                               Helper Functions                               #
# ---------------------------------------------------------------------------- #


def register_user(first_name, last_name, email, username, password):
    # open database connection
    conn = create_DB_connection()
    cur = conn.cursor()

    # validate email format
    if not re.search(r"(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)", email):
        abort(400, "Not a valid email format")

    # minimum length of username
    if len(username) < 3:
        abort(400, "Username must be at least 3 characters")

    # maximum length of username
    if len(username) > 30:
        abort(400, "Username cannot exceed 30 characters")

    # limit length of first name
    if len(first_name) > 30:
        abort(400, "First name cannot exceed 30 characters")

    # limit length of last name
    if len(last_name) > 30:
        abort(400, "Last name cannot exceed 30 characters")

    # restrict length of password
    if len(password) < 8 or len(password) > 16:
        abort(400, "Password must be between 8 and 16 characters")

    # check if user with current email already exists
    user_query = f"select id from users where email='{email}'"
    cur.execute(user_query)
    if cur.fetchone():
        abort(400, "Already a user registered with given email")

    # encode password
    hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

    # insert user into database
    insert_query = (
        "insert into Users (username, first_name, last_name, email, password) "
        "values (%s, %s, %s, %s, %s)"
    )
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
        "username": username,
        "token": generate_token(user_id),
        "message": "Successfully registered!",
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
        abort(404, "No user registered with given email")

    user_id, hashed_password, username = user_info

    # check if the password is correct
    if not bcrypt.checkpw(password.encode("utf-8"), bytes(hashed_password)):
        abort(404, "Incorrect password")

    # close database connection
    conn.commit()
    cur.close()
    conn.close()

    # successful return
    return {
        "username": username,
        "token": generate_token(user_id),
        "message": "Successfully logged in!",
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
        abort(404, "Token error, no user registered under user ID")

    username = user_info[0]

    # close database connection
    conn.commit()
    cur.close()
    conn.close()

    # successful return
    return {
        "username": username,
        "message": "Successfully retrieved username!",
    }


# ---------------------------------------------------------------------------- #
#                                    Routes                                    #
# ---------------------------------------------------------------------------- #


@USER_NS.route("/register")
class Register(Resource):
    @USER_NS.expect(register_model(USER_NS), validate=True)
    @USER_NS.doc(
        description="Given new user details, verify them and if valid, allow user to register."
    )
    @USER_NS.response(201, "Successfully registered")
    @USER_NS.response(400, "Invalid user details provided")
    def post(self):
        data = request.get_json()
        result = register_user(
            data["first_name"],
            data["last_name"],
            data["email"],
            data["username"],
            data["password"],
        )

        return Response(dumps(result), status=201)


@USER_NS.route("/login")
class Login(Resource):
    @USER_NS.doc(
        description="Given a user's credentials, verify them and if valid, allow user to login."
    )
    @USER_NS.expect(login_model(USER_NS), validate=True)
    @USER_NS.response(201, "Successfully logged in")
    @USER_NS.response(404, "User with provided credentials not found")
    def post(self):
        data = request.get_json()
        result = login_user(data["email"], data["password"])
        return Response(dumps(result), status=200)


@USER_NS.route("")
class User(Resource):
    @USER_NS.doc(description="Given a user token, return a user's username.")
    @USER_NS.expect(token_parser(USER_NS), validate=True)
    @USER_NS.response(200, "Successfully found user")
    @USER_NS.response(404, "User with provided Token not found")
    def get(self):
        token = request.headers.get("Authorization")
        user_id = get_id_from_token(token)
        result = get_username(user_id)
        return Response(dumps(result), status=201)