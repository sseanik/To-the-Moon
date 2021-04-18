####################
#   Token Module   #
####################


import os
import jwt
from flask_restx import abort

# comment this line out for local solution
from dotenv import load_dotenv

# comment this line out for local solution
load_dotenv()


def generate_token(user_id):
    return jwt.encode({"id": user_id}, os.getenv("JWT_SECRET"), algorithm="HS256")


def get_id_from_token(token):
    try:
        decoded_token = jwt.decode(token, os.getenv("JWT_SECRET"), algorithms=["HS256"])
        return decoded_token["id"]
    except:
        abort(400, "Failed to decode token")
        # raise Exception("Failed to decode token")


# print(encoded_jwt)
# print(get_id_from_token(encoded_jwt))
