#####################
#   Server Module   #
#####################


from definitions import local_storage_dir
import os
import sys
from json import dumps

from flask import Flask, request
from flask_cors import CORS
from flask_restx import Api

from forum import FORUM_NS
# from news import NEWS_ROUTES
# from portfolio import PORTFOLIO_ROUTES
# from screener import SCREENER_ROUTES
# from stock import STOCK_ROUTES
from user import USER_NS
# from watchlist import WATCHLIST_ROUTES
# from notes import NOTE_ROUTES

APP = Flask(__name__)
CORS(APP)
API = Api(APP,
          title='My Title',
          version='1.0',
          description='A description',
          )
API.add_namespace(USER_NS)
API.add_namespace(FORUM_NS)

###################################
# Please leave all functions here #
###################################


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

# APP.register_blueprint(FORUM_ROUTES)
# APP.register_blueprint(NEWS_ROUTES)
# APP.register_blueprint(PORTFOLIO_ROUTES)
# APP.register_blueprint(SCREENER_ROUTES)
# APP.register_blueprint(STOCK_ROUTES)
# APP.register_blueprint(USER_ROUTES)
# APP.register_blueprint(WATCHLIST_ROUTES)
# APP.register_blueprint(NOTE_ROUTES)


#############################
# Flask App setup and start #
#############################


APP.config['TRAP_HTTP_EXCEPTIONS'] = True
APP.config['TEMPLATES_AUTO_RELOAD'] = True
APP.register_error_handler(Exception, default_handler)


@APP.route('/echo', methods=['GET'])
def echo():
    # an echo route just for testing
    data = request.args.get('data')
    if data:
        print("Param supplied: {}".format(data))
    else:
        print("Param undefined")
    return dumps({
        'data': data,
        'storage': local_storage_dir
    })


if __name__ == '__main__':
    # backend server will run on port 5000 unless otherwise specified
    APP.run(debug=True, port=(
        int(sys.argv[1]) if len(sys.argv) == 2 else 5000))
