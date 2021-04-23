# ---------------------------------------------------------------------------- #
#                               Portfolio Module                               #
# ---------------------------------------------------------------------------- #

from json import dumps
from datetime import datetime
from flask import request, Response
from flask_restx import Namespace, Resource, abort
from database import create_DB_connection
from token_util import get_id_from_token
from helpers import TimeSeries
from stock import retrieve_stock_price_at_date
from iexfinance.stocks import Stock
from models import (
    token_parser,
    portfolio_parser,
    investment_parser,
    investment_model,
    delete_investment_parser,
    trending_parser,
    portfolio_model,
)


# ---------------------------------------------------------------------------- #
#                              Global Declarations                             #
# ---------------------------------------------------------------------------- #

PORTFOLIO_NS = Namespace(
    "portfolio", "Stock Portfolio creation, publication and deletion"
)

# ---------------------------------------------------------------------------- #
#                               Helper Functions                               #
# ---------------------------------------------------------------------------- #


# Create portfolio object in the database
def create_portfolio(user_id, portfolio_name):
    # Check name is within the max length
    if len(portfolio_name) >= 30:
        abort(400, "Portfolio name must be less than 30 characters.")

    conn = create_DB_connection()
    cur = conn.cursor()
    # check that (portfolio_name, user_id) is unique
    sql_query = "SELECT * FROM Portfolios WHERE portfolio_name=%s AND user_id=%s"
    cur.execute(sql_query, (portfolio_name, user_id))
    query_results = cur.fetchall()
    if not query_results:
        # If the user has no portfolios called portfolio_name, create a portfolio with that name.
        sql_query = "INSERT INTO Portfolios (portfolio_name, user_id) VALUES (%s, %s)"
        cur.execute(sql_query, (portfolio_name, user_id))
        conn.commit()
        response = {
            "message": "Portfolio called '" + portfolio_name + "' has been created.",
        }
    else:
        abort(400, "Already a portfolio named '" + portfolio_name + "'.")

    # Close connection and return response
    conn.close()
    return response


# Edit portfolio (e.g. change name of portfolio) in database
# Note: does not check whether old_portfolio_name actually exists.
# If it does exist, it changes its name to newportfolio_name. Otherwise does noting.
def edit_portfolio(user_id, old_portfolio_name, new_portfolio_name):
    new_portfolio_name = new_portfolio_name.strip()
    # Check new name is within the max length
    if len(new_portfolio_name) >= 30:
        abort(400, "Portfolio name must be less than 30 characters.")

    conn = create_DB_connection()
    cur = conn.cursor()
    # check that (new_portfolio_name, user_id) is unique in portfolio table
    sql_query = "SELECT * FROM Portfolios WHERE portfolio_name=%s AND user_id=%s"
    cur.execute(sql_query, (new_portfolio_name, user_id))
    query_results = cur.fetchall()
    if not query_results:
        # update portfolio table
        sql_query = "UPDATE Portfolios SET portfolio_name=%s WHERE portfolio_name=%s AND user_id=%s"
        cur.execute(sql_query, (new_portfolio_name, old_portfolio_name, user_id))
        # update holdings table
        sql_query = "UPDATE Holdings SET portfolio_name=%s WHERE portfolio_name=%s AND user_id=%s"
        cur.execute(sql_query, (new_portfolio_name, old_portfolio_name, user_id))
        # update notes table
        sql_query = "UPDATE Notes SET portfolio_names=ARRAY_REPLACE(portfolio_names, %s, %s) WHERE user_id=%s"
        cur.execute(sql_query, (old_portfolio_name, new_portfolio_name, user_id))
        # update portfolio_block table
        sql_query = "UPDATE portfolio_block SET portfolio_name=%s WHERE portfolio_name=%s AND user_id=%s"
        cur.execute(sql_query, (new_portfolio_name, old_portfolio_name, user_id))
        response = {
            "message": "'"
            + old_portfolio_name
            + "' has been changed to '"
            + new_portfolio_name
            + "'.",
        }
    else:
        abort(400, "Already a portfolio named" + new_portfolio_name + ".")
    # Commit changes, close connection and return response to user
    conn.commit()
    conn.close()
    return response


# Delete portfolio object from the database
# Note: this function does not check whether user_id or portfolio exists.
# It just deletes them if they exist
def delete_portfolio(user_id, portfolio_name):
    conn = create_DB_connection()
    cur = conn.cursor()
    # Delete from portfolio table
    sql_query = "DELETE FROM Portfolios WHERE portfolio_name=%s AND user_id=%s"
    cur.execute(sql_query, (portfolio_name, user_id))
    # Delete from holdings table
    sql_query = "DELETE FROM Holdings WHERE portfolio_name=%s AND user_id=%s"
    cur.execute(sql_query, (portfolio_name, user_id))
    # Commit changes, close connection and return response to user
    conn.commit()
    conn.close()
    return {
        "message": "Portfolio named '" + portfolio_name + "' has been deleted.",
    }


############# Investment helper functions #################
def total_stock_change(stock_ticker, purchase_price):
    # Get investment current price
    batch = Stock(stock_ticker)
    batch = batch.get_quote()
    current_price = batch.latestPrice[stock_ticker]
    return (current_price - purchase_price) * 100 / purchase_price


# Add investments to portfolio object in database
# Note: this assumes portfolio_name and all the other inputs are of the correct size and data type
def add_investment(user_id, portfolio_name, num_shares, timestamp, stock_ticker):
    # Validate date
    purchase_date = datetime.fromtimestamp(timestamp)
    if purchase_date > datetime.now():
        abort(400, "Invalid purchase date, date must be in the past/present")

    conn = create_DB_connection()
    cur = conn.cursor()
    purchase_price = retrieve_stock_price_at_date(stock_ticker, purchase_date)
    # Execute query and close connections
    sql_query = """
        INSERT INTO Holdings
        (user_id, portfolio_name, purchase_price, num_shares, purchase_date, stock_ticker)
        VALUES (%s, %s, %s, %s, %s, %s)
    """
    cur.execute(
        sql_query,
        (
            user_id,
            portfolio_name,
            purchase_price,
            num_shares,
            purchase_date.strftime("%Y-%m-%d %H:%M:%S"),
            stock_ticker,
        ),
    )
    conn.commit()
    conn.close()
    return {
        "message": "Investment in "
        + stock_ticker
        + " has been added to portfolio named '"
        + portfolio_name
        + "'.",
    }


# Delete investments from portfolio object in database
def delete_investment(investment_id):
    conn = create_DB_connection()
    cur = conn.cursor()
    # Delete from holdings table
    sql_query = "delete from Holdings where investment_id=%s"
    cur.execute(sql_query, (investment_id,))
    conn.commit()
    conn.close()
    return {"message": "Investment removed successfully."}


# Get an individual investment's total performance
# Note: this assumes investment_id is correct.
def get_investment_tc(investment_id):
    conn = create_DB_connection()
    cur = conn.cursor()
    # Get investment purchase price
    sql_query = (
        "SELECT purchase_price, stock_ticker FROM Holdings WHERE investment_id=%s"
    )
    cur.execute(sql_query, (investment_id,))
    query_results = cur.fetchall()
    purchase_price = float(query_results[0][0])
    stock_ticker = query_results[0][1]
    # Compute total change
    total_change = total_stock_change(stock_ticker, purchase_price)
    conn.close()
    return {"data": {"id": investment_id, "total_change": total_change}}


# Get the 'trendiness' of each invested stock symbol


def get_trending_investments(num):
    conn = create_DB_connection()
    cur = conn.cursor()
    sql_query = (
        "SELECT stock_ticker, count(distinct user_id) AS user_count FROM Holdings "
        "GROUP BY stock_ticker ORDER BY user_count DESC limit %s"
    )
    cur.execute(sql_query, (num,))
    query_results = cur.fetchall()
    data = []
    for tupl in query_results:
        data.append({"stock": tupl[0], "count": tupl[1]})
    conn.close()
    return {"data": data}


############ Additional functions ##############
def get_portfolios(user_id):
    conn = create_DB_connection()
    cur = conn.cursor()
    sql_query = "SELECT portfolio_name FROM Portfolios WHERE user_id=%s"
    cur.execute(sql_query, (user_id,))
    query_results = cur.fetchall()
    data = []
    for tupl in query_results:
        data.append(tupl[0])
    conn.close()
    return {"data": data}


def get_investments(user_id, portfolio_name):
    conn = create_DB_connection()
    cur = conn.cursor()
    sql_query = "SELECT * FROM Holdings WHERE user_id=%s AND portfolio_name=%s"
    cur.execute(sql_query, (user_id, portfolio_name))
    query_results = cur.fetchall()
    data = []
    for row in query_results:
        new_investment = {
            "investment_id": row[0],
            "purchase_price": str(row[3]),
            "num_shares": row[4],
            "purchase_date": row[5].strftime("%Y-%m-%d"),
            "total_change": total_stock_change(row[6], float(row[3])),
            "stock_ticker": row[6],
        }
        data.append(new_investment)

    conn.close()
    return {"data": data}


def get_portfolio_performance(user_id, portfolio_name):
    conn = create_DB_connection()
    cur = conn.cursor()
    sql_query = "SELECT * FROM Holdings WHERE user_id=%s AND portfolio_name=%s"
    try:
        cur.execute(sql_query, (user_id, portfolio_name))
    except:
        abort(
            400,
            "Something went wrong while searching Holdings table for user_id = '"
            + str(user_id)
            + "' and portfolio_name = '"
            + str(portfolio_name)
            + "'.",
        )

    query_results = cur.fetchall()
    if not query_results:
        return {
            "message": "There are no investments in a portfolio called '"
            + portfolio_name
            + "'.",
            "data": {"investments": [], "portfolio_change": "N/A"},
        }

    conn.close()

    # Fill the data dictionary with investments and collect the stock tickers for a batch API call
    data = {"investments": []}
    stocks = []
    for row in query_results:
        stock_ticker = row[6]
        if stock_ticker not in stocks:
            stocks.append(stock_ticker)

        new_investment = {
            "investment_id": row[0],
            "purchase_price": str(row[3]),
            "num_shares": row[4],
            "purchase_date": row[5].strftime("%Y-%m-%d"),
            "stock_ticker": stock_ticker,
        }
        data["investments"].append(new_investment)

    # Fetch stock prices
    batch = Stock(stocks)
    batch = batch.get_quote()
    total_value_change = 0
    total_invested_capital = 0
    for investment in data["investments"]:
        value_change = batch.latestPrice[investment["stock_ticker"]] - float(
            investment["purchase_price"]
        )
        investment["total_change"] = (value_change * 100) / float(
            investment["purchase_price"]
        )
        total_value_change += value_change
        total_invested_capital += float(investment["purchase_price"])

    data["portfolio_change"] = (total_value_change * 100) / total_invested_capital
    response = {
        "message": "Successfully calculated the performance of portfolio '"
        + portfolio_name
        + "', as well as its individual investments.",
        "data": data,
    }
    return response


# ---------------------------------------------------------------------------- #
#                                    Routes                                    #
# ---------------------------------------------------------------------------- #


@PORTFOLIO_NS.route("")
class Portfolio(Resource):
    @PORTFOLIO_NS.doc(description="Get the list of portfolios owned by a user")
    @PORTFOLIO_NS.expect(token_parser(PORTFOLIO_NS), validate=True)
    @PORTFOLIO_NS.response(200, "Successfully fetched Portfolio")
    def get(self):
        token = request.headers.get("Authorization")
        user_id = get_id_from_token(token)
        result = get_portfolios(user_id)
        return Response(dumps(result), status=200)

    @PORTFOLIO_NS.doc(description="Create a new portfolio")
    @PORTFOLIO_NS.expect(
        token_parser(PORTFOLIO_NS), portfolio_parser(PORTFOLIO_NS), validate=True
    )
    @PORTFOLIO_NS.response(200, "Successfully created Portfolio")
    @PORTFOLIO_NS.response(400, "Invalid Data was provided")
    def post(self):
        token = request.headers.get("Authorization")
        user_id = get_id_from_token(token)
        portfolio_name = request.args.get("name")
        response = create_portfolio(user_id, portfolio_name)
        return Response(dumps(response), status=201)

    @PORTFOLIO_NS.doc(description="Modify an existing portfolio")
    @PORTFOLIO_NS.expect(
        token_parser(PORTFOLIO_NS),
        portfolio_parser(PORTFOLIO_NS),
        portfolio_model(PORTFOLIO_NS),
        validate=True,
    )
    @PORTFOLIO_NS.response(200, "Successfully edited Portfolio")
    @PORTFOLIO_NS.response(400, "Invalid Data was provided")
    def put(self):
        token = request.headers.get("Authorization")
        user_id = get_id_from_token(token)
        old_portfolio_name = request.args.get("name")
        data = request.get_json()
        new_portfolio_name = data["name"]
        response = edit_portfolio(user_id, old_portfolio_name, new_portfolio_name)
        return Response(dumps(response), status=200)

    @PORTFOLIO_NS.doc(description="Delete an existing portfolio")
    @PORTFOLIO_NS.expect(
        token_parser(PORTFOLIO_NS), portfolio_parser(PORTFOLIO_NS), validate=True
    )
    @PORTFOLIO_NS.response(200, "Successfully deleted portfolio")
    def delete(self):
        token = request.headers.get("Authorization")
        user_id = get_id_from_token(token)
        portfolio_name = request.args.get("name")
        response = delete_portfolio(user_id, portfolio_name)
        return Response(dumps(response), status=200)


@PORTFOLIO_NS.route("/investment")
class Investment(Resource):
    @PORTFOLIO_NS.doc(
        description="Get the list of investments of a portfolio owned by a user"
    )
    @PORTFOLIO_NS.expect(
        token_parser(PORTFOLIO_NS), investment_parser(PORTFOLIO_NS), validate=True
    )
    @PORTFOLIO_NS.response(200, "Successfully fetched investments")
    def get(self):
        token = request.headers.get("Authorization")
        user_id = get_id_from_token(token)
        portfolio_name = request.args.get("portfolio")
        result = get_investments(user_id, portfolio_name)
        return Response(dumps(result), status=200)

    # Create a new investment
    # Expects payload:
    # """
    #     num_shares: number
    #     stock_ticker: string
    #     purchase_date: number (in UNIX timestamp format, i.e. seconds since 1970)
    # """
    @PORTFOLIO_NS.doc(description="Create a new investment")
    @PORTFOLIO_NS.expect(
        token_parser(PORTFOLIO_NS),
        investment_parser(PORTFOLIO_NS),
        investment_model(PORTFOLIO_NS),
        validate=True,
    )
    @PORTFOLIO_NS.response(200, "Successfully added Investment")
    @PORTFOLIO_NS.response(400, "Invalid Data was provided")
    def post(self):
        token = request.headers.get("Authorization")
        user_id = get_id_from_token(token)
        data = request.get_json()
        portfolio_name = request.args.get("portfolio")
        num_shares = data["num_shares"]
        stock_ticker = data["stock_ticker"]
        purchase_date = int(data["purchase_date"])
        response = add_investment(
            user_id, portfolio_name, num_shares, purchase_date, stock_ticker
        )
        return Response(dumps(response), status=201)

    @PORTFOLIO_NS.doc(description="Delete an existing investment")
    @PORTFOLIO_NS.expect(
        delete_investment_parser(PORTFOLIO_NS),
        validate=True,
    )
    @PORTFOLIO_NS.response(200, "Successfully removed Investment")
    def delete(self):
        investment_id = request.args.get("id")
        result = delete_investment(investment_id)
        return Response(dumps(result), status=200)


@PORTFOLIO_NS.route("/investment/total-change")
class TotalChange(Resource):
    @PORTFOLIO_NS.doc(description="Get total change of an existing investment")
    @PORTFOLIO_NS.expect(delete_investment_parser(PORTFOLIO_NS), validate=True)
    @PORTFOLIO_NS.response(200, "Successfully retrieved total change for an investment")
    def get(self):
        investment_id = request.args.get("id")
        result = get_investment_tc(investment_id)
        return Response(dumps(result), status=200)


@PORTFOLIO_NS.route("/investment/trending")
class Trending(Resource):
    @PORTFOLIO_NS.doc(description="Get trending investments")
    @PORTFOLIO_NS.expect(trending_parser(PORTFOLIO_NS), validate=True)
    @PORTFOLIO_NS.response(200, "Successfully retrieved trending investments")
    def get(self):
        num = request.args.get("n")
        response = get_trending_investments(num)
        return Response(dumps(response), status=200)


@PORTFOLIO_NS.route("/performance")
class Performance(Resource):
    @PORTFOLIO_NS.doc(
        description="Get the performance of a portfolio and its individual investments."
    )
    @PORTFOLIO_NS.expect(
        token_parser(PORTFOLIO_NS), portfolio_parser(PORTFOLIO_NS), validate=True
    )
    @PORTFOLIO_NS.response(200, "Successfully calculated portfolio performance")
    @PORTFOLIO_NS.response(400, "Invalid Data was Provided")
    def get(self):
        token = request.headers.get("Authorization")
        user_id = get_id_from_token(token)
        portfolio_name = request.args.get("name")
        response = get_portfolio_performance(user_id, portfolio_name)
        return Response(dumps(response), status=200)
