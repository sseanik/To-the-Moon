###################
#   News Module   #
###################

from database import createDBConnection
import requests
from datetime import datetime, timedelta
from json import dumps
from flask import Blueprint, request
from dotenv import load_dotenv
import os

#######################
# GLOBAL DECLARATIONS #
#######################

load_dotenv()
NEWS_API_TOKEN = os.getenv("NEWS_TOKEN")
NEWS_ROUTES = Blueprint('news', __name__)
DEFAULT_NUM_ARTICLES = 10

###################################
# Please leave all functions here #
###################################

# Given a stock symbol, return a list of news articles related to that stock
def getStockNews(stockSymbol, articleCount):
    url = "https://finnhub.io/api/v1/company-news"
    # Only gather stocks ranging from a week old
    todaysDate = datetime.today().strftime('%Y-%m-%d')
    weekAgoDate = (datetime.today() - timedelta(days = 7)).strftime('%Y-%m-%d')
    querystring = {"symbol": stockSymbol, "from": weekAgoDate, "to": todaysDate, "token": NEWS_API_TOKEN}

    response = requests.request("GET", url, params=querystring)
    if response.status_code == 200:
        return {
            'status': response.status_code,
            'articles': response.json()[:articleCount]
        }
    else:
        return {
            'status': response.status_code,
            'articles': []
        }

# Given a list of stock symbol, return a list of news articles related to that stock
def getPortfolioNews(stockSymbols, numArticles):
    uniqueStocks = set(stockSymbols)
    # Either have 1 news article related to each stock, or rougly around 10 in total
    articleCount = 1 if round(numArticles / len(uniqueStocks)) == 0 else round(numArticles / len(uniqueStocks))
    newsArticles = []
    for symbol in uniqueStocks:
        newsArticles += getStockNews(symbol, articleCount)['articles']
    if len(newsArticles) == articleCount * len(uniqueStocks):
        return {
            'status': 200,
            'articles': newsArticles
        }
    else:
        return {
            'status': 500,
            'articles': newsArticles
        }

# Return a list of general finance news articles
def getGeneralNews(numArticles):

    url = "https://finnhub.io/api/v1/news"
    querystring = {"category": "technology", "token": NEWS_API_TOKEN}

    response = requests.request("GET", url, params=querystring)

    if response.status_code == 200:
        return {
            'status': response.status_code,
            'articles': response.json()[:int(numArticles)]
        }
    else:
        return {
            'status': response.status_code,
            'articles': []
        }

################################
# Please leave all routes here #
################################

@NEWS_ROUTES.route('/news', methods=['GET'])
def getSingularStockNews():
    stockSymbol = request.args.get('symbol')
    return dumps(getStockNews(stockSymbol, DEFAULT_NUM_ARTICLES))

@NEWS_ROUTES.route('/news/portfolio', methods=['GET'])
def getPortfolioStockNews():
    data = request.get_json()
    return dumps(getPortfolioNews(data['stocks'], DEFAULT_NUM_ARTICLES))

@NEWS_ROUTES.route('/news/general', methods=['GET'])
def getGeneralStockNews():
    numArticles = request.args.get('count')
    return dumps(getGeneralNews(numArticles))