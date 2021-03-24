########################
#   Portfolio Module   #
########################


from flask import Blueprint, request
from json import dumps
from database import createDBConnection
from token_util import get_id_from_token
from helpers import TimeSeries, AlphaVantageAPI
from datetime import datetime

PORTFOLIO_ROUTES = Blueprint('portfolio', __name__)


###################################
# Please leave all functions here #
###################################


# Create portfolio object in the database
def create_portfolio(user_id, portfolio_name):
    # Check name is within the max length
    if len(portfolio_name) >= 30:
        return {'status': 400, 'message': 'Portfolio name must be less than 30 characters.'}

    conn = createDBConnection()
    cur = conn.cursor()
    # check that (portfolio_name, user_id) is unique
    sql_query = "select * from portfolios where portfolioname=%s and userid=%s"
    cur.execute(sql_query, (portfolio_name, user_id))
    query_results = cur.fetchall()
    if not query_results:
        # If the user has no portfolios called portfolio_name, create a portfolio with that name.
        sql_query = "insert into Portfolios (portfolioname, userid) VALUES (%s, %s)"
        cur.execute(sql_query, (portfolio_name, user_id))
        conn.commit()
        response = {
            'status': 200,
            'message': 'Portfolio called \'' + portfolio_name + '\' has been created.'
        }
    else:
        response = {
            'status': 400,
            'message': 'Already a portfolio named \'' + portfolio_name + '\'.'
        }
    # Close connection and return response
    conn.close()
    return response


# Edit portfolio (e.g. change name of portfolio) in database
# Note: does not check whether old_portfolio_name actually exists. If it does exist, it changes its name to newPortfolioName. Otherwise does noting.
def edit_portfolio(user_id, old_portfolio_name, new_portfolio_name):
    # Check new name is within the max length
    if len(new_portfolio_name) >= 30:
        return {'status': 400, 'message': 'Portfolio name must be less than 30 characters.'}

    conn = createDBConnection()
    cur = conn.cursor()
    # check that (new_portfolio_name, user_id) is unique in portfolio table
    sql_query = "select * from portfolios where portfolioname=%s and userid=%s"
    cur.execute(sql_query, (new_portfolio_name, user_id))
    query_results = cur.fetchall()
    if not query_results:
        # update portfolio table
        sql_query = "update portfolios set portfolioname=%s where portfolioname=%s and userid=%s"
        cur.execute(sql_query, (new_portfolio_name, old_portfolio_name, user_id))
        # update holdings table
        sql_query = "update holdings set portfolioname=%s where portfolioname=%s and userid=%s"
        cur.execute(sql_query, (new_portfolio_name, old_portfolio_name, user_id))
        response ={ 
            'status': 200,
            'message' : '\'' + old_portfolio_name + "\' has been changed to \'" + new_portfolio_name + "\'."
        }
    else:
        response = {
            'status' : 400,
            'message' : 'Already a portfolio named' + new_portfolio_name + '.'
        }
    # Commit changes, close connection and return response to user
    conn.commit()
    conn.close()
    return response


# Delete portfolio object from the database
# Note: this function does not check whether userID or portfolio exists. It just deletes them if they exist
def delete_portfolio(user_id, portfolio_name):
    conn = createDBConnection()
    cur = conn.cursor()
    # Delete from portfolio table
    sql_query = "delete from portfolios where portfolioname=%s and userid=%s"
    cur.execute(sql_query, (portfolio_name, user_id))
    # Delete from holdings table
    sql_query = "delete from holdings where portfolioname=%s and userid=%s"
    cur.execute(sql_query, (portfolio_name, user_id))
    # Commit changes, close connection and return response to user
    conn.commit()
    conn.close()
    return {'status' : 200, 'message' : "Portfolio named \'" + portfolio_name + "\' has been deleted."}


############# Investment helper functions #################
def total_stock_change(stock_ticker, purchase_price):
    # Get investment current price
    quick_data = TimeSeries().get_quick_quote(stock_ticker)
    current_price = float(quick_data['Global Quote']['05. price'])
    return (current_price - purchase_price)*100 / purchase_price


# Add investments to portfolio object in database 
# Note: this assumes portfolioName and all the other inputs are of the correct size and data type
def add_investment(user_id, portfolio_name, num_shares, timestamp, stock_ticker):
    # Validate date
    purchase_date = datetime.fromtimestamp(timestamp)
    if purchase_date > datetime.now():
        return {
            'status': 400,
            'error': 'Invalid purchase date, date must be in the past/present'
        }
    conn = createDBConnection()
    cur = conn.cursor()
    purchase_price = # TODO: price at purchase_date
    # Execute query and close connections
    sql_query = "insert into Holdings (userID, portfolioName, purchasePrice, numShares, purchaseDate, stockTicker) VALUES (%s, %s, %s, %s, %s, %s, %s)"
    cur.execute(sql_query, (user_id, portfolio_name, purchase_price, num_shares, purchase_date.strftime('%Y-%m-%d %H:%M:%S'), stock_ticker))
    conn.commit()
    conn.close()
    return {'status' : 200, 'message' : "Investment in " + stock_ticker + " has been added to portfolio named \'" + portfolio_name + "\'."}


# Delete investments from portfolio object in database
def delete_investment(investment_id):
    conn = createDBConnection()
    cur = conn.cursor()
    # Delete from holdings table
    sql_query = "delete from holdings where investmentID=%s"
    cur.execute(sql_query, (investment_id, ))
    conn.commit()
    conn.close()
    return {'status' : 200, 'message' : "Investment removed successfully."}


# Get an individual investment's total performance
# Note: this assumes investment_id is correct.
def get_investment_tc(investment_id):
    conn = createDBConnection()
    cur = conn.cursor()
    # Get investment purchase price
    sql_query = "select purchasePrice, stockTicker from Holdings where investmentID=%s"
    cur.execute(sql_query, (investment_id, ))
    query_results = cur.fetchall()
    purchase_price = float(query_results[0][0])
    stock_ticker = query_results[0][1]
    # Compute total change
    total_change = total_stock_change(stock_ticker, purchase_price)
    conn.close()
    return {'status' : 200, 'data' : {'id', investment_id, 'total_change': total_change}}

# Get the 'trendiness' of each invested stock symbol
def get_trending_investments(num):
    conn = createDBConnection()
    cur = conn.cursor()
    sql_query = "select StockTicker, count(distinct UserID) as userCount from holdings group by StockTicker order by userCount desc limit %s"
    cur.execute(sql_query, (num, ))
    query_results = cur.fetchall()
    data = []
    for tupl in query_results:
        data.append({
            'stock': tupl[0],
            'count': tupl[1]
        })
    conn.close()
    return {'status': 200, 'data': data}


############ Additional functions ##############
'''
def checkData(data, portfolioName):
    for portfolio in data:
        if portfolio['portfolioName'] == portfolioName:
            return portfolio
    return {}


def getUserPortfolios(userID):
    conn = createDBConnection()
    cur = conn.cursor()
    sqlQuery = "select * from holdings where userID=%s"
    cur.execute(sqlQuery, (userID, ))
    queryResults = cur.fetchall()
    data = []
    for row in queryResults:
        portfolioName = row[2]
        newInvestment = {
            'investmentID' : row[0],
            'PurchasePrice' : row[3], 
            'NumShares' : row[4], 
            'PurchaseDate' : row[5], 
            'StockTicker' : row[6]
        }
        presentData = checkData(data, portfolioName)
        if presentData:
            presentData['holdings'].append(newInvestment)
        else:
            newPortfolio = {
                'portfolioName' : portfolioName,
                'holdings' : [newInvestment]
            }
            data.append(newPortfolio)

    conn.close()
    return data
'''
def get_portfolios(user_id):
    conn = createDBConnection()
    cur = conn.cursor()
    sql_query = "select portfolioName from portfolios where userID=%s"
    cur.execute(sql_query, (user_id, ))
    query_results = cur.fetchall()
    data = []
    for tupl in query_results:
        data.append(tupl[0])
    conn.close()
    return {'status' : 200, 'data' : data}

def get_investments(user_id, portfolio_name):
    conn = createDBConnection()
    cur = conn.cursor()
    sql_query = "select * from holdings where userID=%s and portfolioName=%s"
    cur.execute(sql_query, (user_id, portfolio_name))
    query_results = cur.fetchall()
    data = []
    for row in query_results:
        new_investment = {
            'id': row[0],
            'PurchasePrice': str(row[3]), 
            'NumShares': row[4], 
            'PurchaseDate': row[5].strftime("%Y-%m-%d"), 
            'TotalChange': total_stock_change(row[6], float(row[3]))
            'StockTicker': row[6]
        }
        data.append(new_investment)

    conn.close()
    return {'status' : 200, 'data' : data}


################################
# Please leave all routes here #
################################

# Get the list of portfolios owned by a user
@PORTFOLIO_ROUTES.route('/user/portfolio', methods=['GET'])
def get_user_portfolios_wrapper():
    token = request.headers.get('Authorization')
    user_id = get_id_from_token(token)
    return dumps(get_portfolios(user_id))


# Get the list of investments of a portfolio owned by a user
@PORTFOLIO_ROUTES.route('/user/investment', methods=['GET'])
def get_user_portfolio_investments_wrapper():
    token = request.headers.get('Authorization')
    user_id = get_id_from_token(token)
    portfolio_name = request.args.get('portfolio')
    return dumps(get_investments(user_id, portfolio_name))


# Create a new portfolio
@PORTFOLIO_ROUTES.route('/portfolio', methods=['POST'])
def create_user_portfolio_wrapper():
    token = request.headers.get('Authorization')
    user_id = get_id_from_token(token)
    portfolio_name = request.args.get('name')
    response = create_portfolio(user_id, portfolio_name)
    return dumps(response)


# Modify an existing portfolio
@PORTFOLIO_ROUTES.route('/portfolio', methods=['PUT'])
def edit_user_portfolio_wrapper():
    token = request.headers.get('Authorization')
    user_id = get_id_from_token(token)
    old_portfolio_name = request.args.get('name')
    data = request.get_json()
    new_portfolio_name = data['name']
    response = edit_portfolio(user_id, old_portfolio_name, new_portfolio_name)
    return dumps(response)


# Delete an existing portfolio
@PORTFOLIO_ROUTES.route('/portfolio', methods=['DELETE'])
def delete_user_portfolio_wrapper():
    token = request.headers.get('Authorization')
    user_id = get_id_from_token(token)
    portfolio_name = request.args.get('name')
    response = delete_portfolio(user_id, portfolio_name)
    return dumps(response)


# Get total change of an existing investment
@PORTFOLIO_ROUTES.route('/investment/total-change', methods=['GET'])
def get_investment_total_change_wrapper():
    investment_id = request.args.get('id')
    return dumps(get_investment_tc(investment_id))


# Get trending investments
@PORTFOLIO_ROUTES.route('/investment/trending', methods=['GET'])
def get_investment_trending_wrapper():
    num = request.args.get('n')
    response = get_trending_investments(num)
    return dumps(response)

# Create a new investment
# Expects payload:
'''
    numShares: number
    stockTicker: string
    purchaseDate: number (in UNIX timestamp format, i.e. seconds since 1970)
'''
@PORTFOLIO_ROUTES.route('/investment', methods=['POST'])
def add_investment_user_portfolio_wrapper():
    token = request.headers.get('Authorization')
    user_id = get_id_from_token(token)
    data = request.get_json()
    portfolio_name = request.args.get('portfolio')
    num_shares = data['numShares']
    stock_ticker = data['stockTicker']
    purchase_date = data['purchaseDate']
    response = add_investment(user_id, portfolio_name, num_shares, purchase_date, stock_ticker)
    return dumps(response)


# Delete an existing investment
@PORTFOLIO_ROUTES.route('/investment', methods=['DELETE'])
def delete_investment_user_portfolio_wrapper():
    investment_id = request.args.get('id')
    return dumps(delete_investment(investment_id))




############ Tests #############
# create_portfolio('4', 'Austin\'s portfolio')
# create_portfolio('4', 'Austi')
# edit_portfolio('4', 'Austin\'s portfolio', 'Bob\'s portfolio')
# delete_portfolio('4', 'Bob\'s portfolio')
# delete_portfolio('4', 'Austi')
# add_investment('7', 'Sally\'s portfolio', '100.5', '50', '2021-03-15', 'BHP')
# get_investment("2380756e-863c-11eb-af93-0a4e2d6dea13")
# get_trending_investments('10')