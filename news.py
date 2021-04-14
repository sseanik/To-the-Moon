###################
#   News Module   #
###################

from datetime import datetime, timedelta
from json import dumps
import os
import requests
from flask import request
from flask_restx import Namespace, Resource, abort
from dotenv import load_dotenv

#######################
# GLOBAL DECLARATIONS #
#######################

load_dotenv()
NEWS_API_TOKEN = os.getenv("NEWS_TOKEN")
NEWS_NS = Namespace("news", "Relevant News Articles related to each Stock")
DEFAULT_NUM_ARTICLES = 10

###################################
# Please leave all functions here #
###################################

# Given a stock symbol, return a list of news articles related to that stock
def get_stock_news(stock_symbol, article_count):
    url = "https://finnhub.io/api/v1/company-news"
    # Only gather stocks ranging from a week old
    todays_date = datetime.today().strftime("%Y-%m-%d")
    week_ago_date = (datetime.today() - timedelta(days=7)).strftime("%Y-%m-%d")
    querystring = {
        "symbol": stock_symbol,
        "from": week_ago_date,
        "to": todays_date,
        "token": NEWS_API_TOKEN,
    }
    response = requests.request("GET", url, params=querystring)
    if response.status_code == 200:
        return {"status": 200, "articles": response.json()[:article_count]}
    else:
        return {"status": 404, "articles": [], "error": "Unable to fetch news"}


# Given a list of stock symbols, return a list of num_articles amount of related news articles


def get_portfolio_news(stock_symbols, num_articles):
    unique_stocks = set(stock_symbols)
    # Either have 1 news article related to each stock, or minimum num_articles in total
    article_count = (
        1
        if round(num_articles / len(unique_stocks)) == 0
        else round(num_articles / len(unique_stocks))
    )
    news_articles = []
    for symbol in unique_stocks:
        news_articles += get_stock_news(symbol, article_count)["articles"]
    if len(news_articles) == article_count * len(unique_stocks):
        return {"status": 200, "articles": news_articles}
    else:
        return {
            "status": 400,
            "articles": news_articles,
            "error": "Unable to fetch news",
        }


# Given a number of articles, return a list of general finance news articles


def get_general_news(num_articles):
    url = "https://finnhub.io/api/v1/news"
    querystring = {"category": "general", "token": NEWS_API_TOKEN}
    response = requests.request("GET", url, params=querystring)
    if response.status_code == 200:
        return {"status": 200, "articles": response.json()[: int(num_articles)]}
    else:
        return {"status": 404, "articles": [], "error": "Unable to fetch news"}


################################
# Please leave all routes here #
################################


@NEWS_NS.route("/")
class News(Resource):
    # def getSingularStockNews():
    def get(self):
        stock_symbol = request.args.get("symbol")
        result = get_stock_news(stock_symbol, DEFAULT_NUM_ARTICLES)
        if result["status"] != 200:
            abort(result["status"], result["error"])
        return dumps(result)


@NEWS_NS.route("/portfolio")
class Portfolio(Resource):
    # def getPortfolioStockNews():
    def get(self):
        data = request.get_json()
        result = get_portfolio_news(data["stocks"], DEFAULT_NUM_ARTICLES)
        if result["status"] != 200:
            abort(result["status"], result["error"])
        return dumps(result)


@NEWS_NS.route("/general", methods=["GET"])
class General(Resource):
    # def getGeneralStockNews():
    def get(self):
        num_articles = request.args.get("count")
        result = get_general_news(num_articles)
        if result["status"] != 200:
            abort(result["status"], result["error"])
        return dumps(result)
