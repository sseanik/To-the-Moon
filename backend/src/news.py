# ---------------------------------------------------------------------------- #
#                                  News Module                                 #
# ---------------------------------------------------------------------------- #

from datetime import datetime, timedelta
from json import dumps
import os
import requests
from flask import request, Response
from flask_restx import Namespace, Resource, abort
from dotenv import load_dotenv
from models import news_count_parser, news_parser, news_stocks_parser

# ---------------------------------------------------------------------------- #
#                              Global Declarations                             #
# ---------------------------------------------------------------------------- #

load_dotenv()
NEWS_API_TOKEN = os.getenv("NEWS_TOKEN")
NEWS_NS = Namespace("news", "Relevant News Articles related to each Stock")
DEFAULT_NUM_ARTICLES = 10

# ---------------------------------------------------------------------------- #
#                               Helper Functions                               #
# ---------------------------------------------------------------------------- #


def get_stock_news(stock_symbol, article_count):
    """Given a stock symbol, return a list of news articles related to that stock

    Args:
        stock_symbol (string): Stock ticker e.g. TSLA
        article_count (int): Number of articles to fetch

    Returns:
        dictionary: An article list of news dictionaries with their text and image attributes
    """

    # News API
    url = "https://finnhub.io/api/v1/company-news"

    # Only gather stocks ranging from a week old
    todays_date = datetime.today().strftime("%Y-%m-%d")
    week_ago_date = (datetime.today() - timedelta(days=7)).strftime("%Y-%m-%d")

    # Query the news API
    querystring = {
        "symbol": stock_symbol,
        "from": week_ago_date,
        "to": todays_date,
        "token": NEWS_API_TOKEN,
    }
    response = requests.request("GET", url, params=querystring)

    # If the API returned a 200, successfully fetched articles
    if response.status_code == 200:
        return {"articles": response.json()[:article_count]}
    # Otherwise the News API is down or the service is rate limiting
    else:
        abort(500, "Unable to fetch news")


def get_portfolio_news(stock_symbols, num_articles):
    """Given a list of stock symbols, return a list of num_articles amount of related news articles

    Args:
        stock_symbol (string): Stock ticker e.g. TSLA
        article_count (int): Number of articles to fetch

    Returns:
        dictionary: An article list of news dictionaries with their text and image attributes
    """

    # Ignore duplicate Stock tickers
    unique_stocks = set(stock_symbols)

    # Either have 1 news article related to each stock, or minimum num_articles in total
    article_count = (
        1
        if round(num_articles / len(unique_stocks)) == 0
        else round(num_articles / len(unique_stocks))
    )
    news_articles = []

    # Fetch the news for each stock
    for symbol in unique_stocks:
        news_articles += get_stock_news(symbol, article_count)["articles"]

    # If the desired amount was received, successfully fetched
    if len(news_articles) == article_count * len(unique_stocks):
        return {"articles": news_articles}
    else:
        abort(500, "Unable to fetch news")


def get_general_news(num_articles):
    """Given a number of articles, return a list of general finance news articles

    Args:
        article_count (int): Number of articles to fetch

    Returns:
        dictionary: An article list of news dictionaries with their text and image attributes
    """
    url = "https://finnhub.io/api/v1/news"
    querystring = {"category": "general", "token": NEWS_API_TOKEN}
    response = requests.request("GET", url, params=querystring)
    if response.status_code == 200:
        return {"articles": response.json()[: int(num_articles)]}
    else:
        abort(500, "Unable to fetch news")


# ---------------------------------------------------------------------------- #
#                                    Routes                                    #
# ---------------------------------------------------------------------------- #


@NEWS_NS.route("")
class News(Resource):
    @NEWS_NS.doc(description="Fetch news article related to a Stock Symbol.")
    @NEWS_NS.expect(news_parser(NEWS_NS), validate=True)
    @NEWS_NS.response(200, "Successfully fetched news")
    @NEWS_NS.response(500, "News API Not Available")
    def get(self):
        stock_symbol = request.args.get("symbol")
        result = get_stock_news(stock_symbol, DEFAULT_NUM_ARTICLES)
        return Response(dumps(result), status=200)


@NEWS_NS.route("/portfolio")
class Portfolio(Resource):
    @NEWS_NS.doc(
        description="Fetch all news articles related to each stock in a portfolio."
    )
    @NEWS_NS.expect(news_stocks_parser(NEWS_NS), validate=True)
    @NEWS_NS.response(200, "Successfully fetched news")
    @NEWS_NS.response(500, "News API Not Available")
    def get(self):
        data = request.args.getlist("stocks")
        result = get_portfolio_news(data, DEFAULT_NUM_ARTICLES)
        return Response(dumps(result), status=200)


@NEWS_NS.route("/general")
class General(Resource):
    @NEWS_NS.doc(description="Fetch general finance news articles.")
    @NEWS_NS.expect(news_count_parser(NEWS_NS), validate=True)
    @NEWS_NS.response(200, "Successfully fetched news")
    @NEWS_NS.response(500, "News API Not Available")
    def get(self):
        num_articles = request.args.get("count")
        result = get_general_news(num_articles)
        return Response(dumps(result), status=200)
