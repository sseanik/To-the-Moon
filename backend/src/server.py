#####################
#   Server Module   #
#####################


import sys
from json import dumps
from definitions import local_storage_dir
from flask import Flask, Response
from flask_cors import CORS
from flask_restx import Api, Namespace, Resource, abort
from forum import FORUM_NS
from news import NEWS_NS
from notes import NOTES_NS
from portfolio import PORTFOLIO_NS
from screener import SCREENER_NS
from stock import STOCK_NS
from user import USER_NS
from watchlist import WATCHLIST_NS

APP = Flask(__name__)
CORS(APP)
API = Api(
    APP,
    title="To the Moon Backend",
    version="1.0",
    description="A description",
)
API.add_namespace(FORUM_NS)
API.add_namespace(NEWS_NS)
API.add_namespace(NOTES_NS)
API.add_namespace(PORTFOLIO_NS)
API.add_namespace(SCREENER_NS)
API.add_namespace(STOCK_NS)
API.add_namespace(USER_NS)
API.add_namespace(WATCHLIST_NS)


###################################
# Please leave all functions here #
###################################


def default_handler(err):
    """
    Default Handler
    """
    response = err.get_response()
    print("response", err, err.get_response())
    response.data = dumps(
        {
            "code": err.code,
            "name": "System Error",
            "message": err.get_description(),
        }
    )
    response.content_type = "application/json"
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


APP.config["TRAP_HTTP_EXCEPTIONS"] = True
APP.config["TEMPLATES_AUTO_RELOAD"] = True
APP.register_error_handler(Exception, default_handler)

DUMMY = Namespace("dummy", "Testing Endpoint")
API.add_namespace(DUMMY)


@DUMMY.route("/<string:data>")
class Echo(Resource):
    def get(self, data):
        if data:
            print("Param supplied: {}".format(data))
        else:
            print("Param undefined")
        return dumps({"data": data, "storage": local_storage_dir})


@DUMMY.route("abort")
class ErrorAbort(Resource):
    def get(self):
        abort(500, "This is an Error Message")


@DUMMY.route("response")
class ErrorResponse(Resource):
    def get(self):
        return Response(dumps({"error": "This is an Error Message"}), status=500)


if __name__ == "__main__":
    # backend server will run on port 5000 unless otherwise specified
    APP.run(debug=True, port=(int(sys.argv[1]) if len(sys.argv) == 2 else 5000))
