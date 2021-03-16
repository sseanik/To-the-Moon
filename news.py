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

###################################
# Please leave all functions here #
###################################

# # 21 Requests an hour, Max 5 a page
# def newscatcherStocks(stock):
#     url = "https://newscatcher.p.rapidapi.com/v1/stocks"
#     querystring = {"ticker":stock,"lang":"en","media":"True","sort_by":"relevancy"}
#     headers = {
#         'x-rapidapi-key': "e8c9372167mshaf8fba383452116p18aad9jsn626f2b72def6",
#         'x-rapidapi-host': "newscatcher.p.rapidapi.com"
#         }
#     response = requests.request("GET", url, headers=headers, params=querystring)
#     print(response.json()['articles'][4])

# # 21 Requests an hour
# def newscatcherSearchFree(stock):
#     url = "https://newscatcher.p.rapidapi.com/v1/search_free"

#     querystring = {"q":stock,"lang":"en","media":"True"}

#     headers = {
#         'x-rapidapi-key': "e8c9372167mshaf8fba383452116p18aad9jsn626f2b72def6",
#         'x-rapidapi-host': "newscatcher.p.rapidapi.com"
#         }

#     response = requests.request("GET", url, headers=headers, params=querystring)
#     print(response.json()['articles'][4])

# 60 Requests per minute, 1 year historical news
def getStockNews(stockSymbol):
    url = "https://finnhub.io/api/v1/company-news"
    todaysDate = datetime.today().strftime('%Y-%m-%d')
    weekAgoDate = (datetime.today() - timedelta(days = 7)).strftime('%Y-%m-%d')
    querystring = {"symbol": stockSymbol, "from": weekAgoDate, "to": todaysDate, "token": NEWS_API_TOKEN}

    response = requests.request("GET", url, params=querystring)
    if response.status_code == 200:
        return {
            'status': 'success',
            'articles': response.json()[:10]
        }
    else:
        return {
            'status': 'failure',
            'articles': []
        }

def getPortfolioNews(portfolioName):
    pass

################################
# Please leave all routes here #
################################

@NEWS_ROUTES.route('/news', methods=['GET'])
def getSingularStockNews():
    stockSymbol = request.args.get('symbol')
    return dumps(getStockNews(stockSymbol))

@NEWS_ROUTES.route('/portfolio/news', methods=['GET'])
def getPortfolioStockNews():
    portfolioName = request.args.get('portfolio')
    return dumps(getPortfolioNews(portfolioName))