#####################
#   Server Module   #
#####################

import sys

from flask import Flask
from flask_cors import CORS

APP = Flask(__name__)
CORS(APP)

####################################
# Please Leave all blueprints here #
####################################

if __name__ == 'main':
    APP.run(debug=True, port=(int(sys.argv[1]) if len(sys.argv) == 2 else 7117))
