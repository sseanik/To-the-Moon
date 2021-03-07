#####################
#   Server Module   #
#####################

import sys
from json import dumps

from flask import Flask, request
from flask_cors import CORS

APP = Flask(__name__)
CORS(APP)

def default_handler(err):
    '''
    Default Handler
    '''
    response = err.get_response()
    print('response', err, err.get_response())
    response.data = dumps({
        "code": err.code,
        "name": "System Error",
        "message": err.get_description(),
    })
    response.content_type = 'application/json'
    return response

####################################
# Please leave all blueprints here #
####################################

APP.config['TRAP_HTTP_EXCEPTIONS'] = True
APP.config['TEMPLATES_AUTO_RELOAD'] = True
APP.register_error_handler(Exception, default_handler)

@APP.route('/echo', methods=['GET'])
def echo():
    # an echo route just for testing
    data = request.args.get('data')
    return dumps({
        'data': data
    })


if __name__ == 'main':
    # backend server will run on port 5000 unless otherwise specified
    APP.run(debug=True, port=(int(sys.argv[1]) if len(sys.argv) == 2 else 5000))
