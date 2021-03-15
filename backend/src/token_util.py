####################
#   Token Module   #
####################


import os
import jwt
# comment this line out for local solution
from dotenv import load_dotenv

# comment this line out for local solution
load_dotenv()


def generateToken(user_id):
  return jwt.encode({"id": user_id}, os.getenv("JWT_SECRET"), algorithm='HS256')


def getIDfromToken(token):
  return jwt.decode(token, os.getenv("JWT_SECRET"), algorithms=['HS256'])


encoded_jwt = generateToken('hello')
print(encoded_jwt)
print(getIDfromToken(encoded_jwt))