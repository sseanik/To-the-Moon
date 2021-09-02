# ---------------------------------------------------------------------------- #
#                                 Server Module                                #
# ---------------------------------------------------------------------------- #

import os
import sys
from json import dumps
from threading import Thread

from flask import Flask, Response
from flask_cors import CORS
from flask_restx import Api, Namespace, Resource, abort
from flask_mail import Mail

from definitions import local_storage_dir
from forum import FORUM_NS
from news import NEWS_NS
from notes import NOTES_NS
from notification import NOTIFICATION_NS, send_news_email
from portfolio import PORTFOLIO_NS
from screener import SCREENER_NS
from stock import STOCK_NS
from user import USER_NS
from watchlist import WATCHLIST_NS
from dashboard import DASHBOARD_NS
from prediction import PREDICTION_DAILY_NS


# Create a custom Flask class to allow for an initial thread to fire after running
class MyFlaskApp(Flask):
    def run(self, host=None, port=None, debug=None, load_dotenv=True, **options):
        # Only run the thread when the Flask App is running
        if os.getenv("WERKZEUG_RUN_MAIN") == "true":
            # Create the Portfolio/News notification thread
            with self.app_context():
                Thread(
                    target=send_news_email,
                    args=[self],
                ).start()
        super(MyFlaskApp, self).run(
            host=host, port=port, debug=debug, load_dotenv=load_dotenv, **options
        )


APP = MyFlaskApp(__name__)
CORS(APP)
# Create Flask Rest Swagger overall details
API = Api(
    APP,
    title="To the Moon API 🌕",
    version="1.0",
    description="The API interface for the stock portfolio management platform - To The Moon.",
)

API.add_namespace(USER_NS)
API.add_namespace(STOCK_NS)
API.add_namespace(PORTFOLIO_NS)
API.add_namespace(NEWS_NS)
API.add_namespace(FORUM_NS)
API.add_namespace(DASHBOARD_NS)
API.add_namespace(NOTES_NS)
API.add_namespace(SCREENER_NS)
API.add_namespace(WATCHLIST_NS)
API.add_namespace(NOTIFICATION_NS)
API.add_namespace(PREDICTION_DAILY_NS)

# Configure Mail settings from a configured Gmail account
MAIL_SETTINGS = {
    "MAIL_SERVER": "smtp.gmail.com",
    "MAIL_PORT": 465,
    "MAIL_USE_TLS": False,
    "MAIL_USE_SSL": True,
    "MAIL_USERNAME": "tothemoon.comp3900@gmail.com",
    "MAIL_PASSWORD": "tothemoon123",
}
APP.config.update(MAIL_SETTINGS)
MAIL = Mail(APP)
APP.MAIL = MAIL

# ---------------------------------------------------------------------------- #
#                             Flask Error Handling                             #
# ---------------------------------------------------------------------------- #


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


APP.config["TRAP_HTTP_EXCEPTIONS"] = True
APP.config["TEMPLATES_AUTO_RELOAD"] = True
APP.register_error_handler(Exception, default_handler)


# ---------------------------------------------------------------------------- #
#                                  Dummy Route                                 #
# ---------------------------------------------------------------------------- #

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


@DUMMY.route("/abort")
class ErrorAbort(Resource):
    def get(self):
        abort(500, "This is an Error Message")


@DUMMY.route("/response")
class ErrorResponse(Resource):
    def get(self):
        return Response(dumps({"message": "This is an Error Message"}), status=500)


if __name__ == "__main__":
    # backend server will run on port 5000 unless otherwise specified
    APP.run(debug=True, port=(int(sys.argv[1]) if len(sys.argv) == 2 else 5000))
