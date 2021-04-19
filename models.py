from flask_restx import fields
from flask_restx.inputs import date_from_iso8601

# ---------------------------------------------------------------------------- #
#                                    MODELS                                    #
# ---------------------------------------------------------------------------- #


def login_model(namespace):
    return namespace.model(
        "login",
        {
            "email": fields.String(required=True, example="duck@pond.com"),
            "password": fields.String(required=True, example="hunter12"),
        },
    )


def register_model(namespace):
    return namespace.model(
        "register",
        {
            "first_name": fields.String(required=True, example="Sir"),
            "last_name": fields.String(required=True, example="Gooseington"),
            "email": fields.String(required=True, example="goose@pond.com"),
            "username": fields.String(required=True, example="goose"),
            "password": fields.String(required=True, example="hunter12"),
        },
    )


def comment_model(namespace):
    return namespace.model(
        "comment",
        {
            "stockTicker": fields.String(required=True, example="TSLA"),
            "timestamp": fields.Integer(required=True, example=1618142069157),
            "content": fields.String(required=True, example="This is a comment"),
        },
    )


def comment_delete_model(namespace):
    return namespace.model(
        "comment_delete",
        {
            "comment_id": fields.String(
                required=True, example="9a685142-9929-11eb-957d-0a4e2d6dea13"
            ),
        },
    )


def comment_edit_model(namespace):
    return namespace.model(
        "comment_edit",
        {
            "comment_id": fields.String(
                required=True, example="9a685142-9929-11eb-957d-0a4e2d6dea13"
            ),
            "time_stamp": fields.Integer(required=True, example=1618142069157),
            "content": fields.String(required=True, example="This is a comment"),
        },
    )


def comment_vote_model(namespace):
    return namespace.model(
        "comment_vote",
        {
            "comment_id": fields.String(
                required=True, example="a1ba864a-9929-11eb-be3a-0a4e2d6dea13"
            ),
        },
    )


def reply_model(namespace):
    return namespace.model(
        "reply",
        {
            "stockTicker": fields.String(required=True, example="TSLA"),
            "timestamp": fields.Integer(required=True, example=1618142069157),
            "content": fields.String(required=True, example="This is a reply"),
            "parentID": fields.String(
                required=True, example="9a685142-9929-11eb-957d-0a4e2d6dea13"
            ),
        },
    )


def reply_delete_model(namespace):
    return namespace.model(
        "reply_delete",
        {
            "comment_id": fields.String(
                required=True, example="ad939422-9abc-11eb-938b-0a4e2d6dea13"
            ),
            "parent_id": fields.String(
                required=True, example="9a685142-9929-11eb-957d-0a4e2d6dea13"
            ),
        },
    )


def reply_edit_model(namespace):
    return namespace.model(
        "reply_edit",
        {
            "comment_id": fields.String(
                required=True, example="ad939422-9abc-11eb-938b-0a4e2d6dea13"
            ),
            "time_stamp": fields.Integer(required=True, example=1618142069157),
            "content": fields.String(required=True, example="This is a reply"),
            "parent_id": fields.String(
                required=True, example="9a685142-9929-11eb-957d-0a4e2d6dea13"
            ),
        },
    )


def reply_vote_model(namespace):
    return namespace.model(
        "reply_vote",
        {
            "reply_id": fields.String(
                required=True, example="ad939422-9abc-11eb-938b-0a4e2d6dea13"
            ),
        },
    )


def notes_model(namespace):
    return namespace.model(
        "notes",
        {
            "title": fields.String(required=True, example="Note Title"),
            "content": fields.String(required=True, example="Note Content"),
            "stock_symbols": fields.String(required=True, example="TSLA"),
            "portfolio_names": fields.String(required=True, example="Portfolio A"),
            "external_references": fields.String(required=True, example=""),
            "internal_references": fields.String(required=True, example=""),
        },
    )


def notes_edit_model(namespace):
    return namespace.model(
        "notes_edit",
        {
            "new_title": fields.String(required=True, example="Note Title"),
            "content": fields.String(required=True, example="Note Content"),
            "stock_symbols": fields.String(required=True, example="TSLA"),
            "portfolio_names": fields.String(required=True, example="Portfolio A"),
            "external_references": fields.String(required=True, example=""),
            "internal_references": fields.String(required=True, example=""),
        },
    )


def investment_model(namespace):
    return namespace.model(
        "investment",
        {
            "num_shares": fields.Integer(required=True, example=5),
            "stock_ticker": fields.String(required=True, example="TSLA"),
            "purchase_date": fields.String(required=True, example="TODO"),
        },
    )


def portfolio_model(namespace):
    return namespace.model(
        "portfolio",
        {
            "name": fields.String(required=True, example="PortfolioA"),
        },
    )


# ---------------------------------------------------------------------------- #
#                                    PARSERS                                   #
# ---------------------------------------------------------------------------- #


def token_parser(namespace):
    return namespace.parser().add_argument(
        "Authorization", help="User Authorization Token", location="headers"
    )


def portfolio_parser(namespace):
    return namespace.parser().add_argument(
        "name", help="Portfolio name", location="args"
    )


def investment_parser(namespace):
    return namespace.parser().add_argument(
        "portfolio", help="Portfolio name", location="args"
    )


def delete_investment_parser(namespace):
    return namespace.parser().add_argument("id", help="Portfolio ID", location="args")


def trending_parser(namespace):
    return namespace.parser().add_argument("n", help="Portfolio ID", location="args")


def forum_parser(namespace):
    return namespace.parser().add_argument(
        "stockTicker", help="Stock Security Symbol", location="args"
    )


def news_parser(namespace):
    return namespace.parser().add_argument(
        "symbol", help="Stock Security Symbol", location="args"
    )


def news_count_parser(namespace):
    return namespace.parser().add_argument(
        "count", help="Number of News Articles", location="args"
    )


def news_stocks_parser(namespace):
    return namespace.parser().add_argument(
        "stocks",
        help="List of Stock Symbols",
        type=list,
        action="append",
        location="args",
    )


def notes_edit_parser(namespace):
    return namespace.parser().add_argument("note", help="Note name", location="args")


def notes_delete_parser(namespace):
    return namespace.parser().add_argument("title", help="Note Title", location="args")


def notes_relevant_parser(namespace):
    return (
        namespace.parser()
        .add_argument(
            "stock",
            help="List of Stock Symbols",
            type=list,
            action="append",
            location="args",
        )
        .add_argument(
            "portfolio",
            help="List of Portfolio Names",
            type=list,
            action="append",
            location="args",
        )
    )

def stock_get_data_parser(namespace):
    return namespace.parser().add_argument("symbol", help="Stock Symbol", location="args")

def stock_get_prediction_parser(namespace):
    return (
        namespace.parser()
            .add_argument("symbol", help="Stock Symbol", location="args")
            .add_argument("prediction_type", help="Prediction Model", location="args")
    )

def stock_get_paper_trade_parser(namespace):
    return (
        namespace.parser()
            .add_argument("symbol", help="Stock Symbol", type=str, location="args")
            .add_argument("initial_cash", help="Starting Portfolio Value", type=[int, float], location="args")
            .add_argument("commission", help="Trading Commission", type=str, location="args")
            .add_argument("strategy", help="Strategy to Use", type=str, location="args")
            .add_argument("fromdate", help="Date to Start Test From", type=date_from_iso8601, location="args")
            .add_argument("todate", help="Date to End Test", type=date_from_iso8601, location="args")
    )
