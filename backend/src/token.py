####################
#   Token Module   #
####################


import os
import jwt
from dotenv import load_dotenv


load_dotenv()
JWT_SECRET = os.getenv("JWT_SECRET")


def generateToken(user_id):
  return jwt.encode({"id": user_id}, JWT_SECRET, algorithm='HS256')


def getIDfromToken(token):
  return jwt.decode(token, JWT_SECRET, algorithms=['HS256'])


print(os.getenv("PATH"))
encoded_jwt = generateToken('hello.com')
print(encoded_jwt)
print(getIDfromToken)