########################
#   Portfolio Module   #
########################


from flask import Blueprint, request
from json import dumps
from database import createDBConnection
from AlphaVantageWrapper.AlphaVantageAPI import TimeSeries, AlphaVantageAPI
from datetime import datetime

PORTFOLIO_ROUTES = Blueprint('portfolio', __name__)


###################################
# Please leave all functions here #
###################################


# Create portfolio object in the database
def createPortfolio(userID, portfolioName):
    # Check name is within the max length
    if len(portfolioName) >= 30:
        return {'status': 400, 'message': 'The portfolio\'s name must be less than 30 characters. Try a new name.'}

    conn = createDBConnection()
    cur = conn.cursor()
    # check that (portfolioName, userID) is unique
    sqlQuery = "select * from portfolios where portfolioname=%s and userid=%s"
    cur.execute(sqlQuery, (portfolioName, userID))
    queryResults = cur.fetchall()
    if not queryResults:
        # If the user has no portfolios called portfolioName, create a portfolio with that name.
        sqlQuery = "insert into Portfolios (portfolioname, userid) VALUES (%s, %s)"
        cur.execute(sqlQuery, (portfolioName, userID))
        conn.commit()
        response = {
            'status': 200,
            'message': 'Portfolio called \'' + portfolioName + '\' has been created.'
        }
    else:
        response = {
            'status': 400,
            'message': 'There is already a portfolio called \'' + portfolioName + '\'. Try a new name.'
        }
    # Close connection and return response
    conn.close()
    return response


# Edit portfolio (e.g. change name of portfolio) in database
# Note: does not check whether oldPortfolioName actually exists. If it does exist, it changes its name to newPortfolioName. Otherwise does noting.
def editPortfolio(userID, oldPortfolioName, newPortfolioName):
    # Check new name is within the max length
    if len(newPortfolioName) >= 30:
        return {'status': 400, 'message': 'The portfolio\'s name must be less than 30 characters. Try a new name.'}

    conn = createDBConnection()
    cur = conn.cursor()
    # check that (newPortfolioName, userID) is unique in portfolio table
    sqlQuery = "select * from portfolios where portfolioname=%s and userid=%s"
    cur.execute(sqlQuery, (newPortfolioName, userID))
    query_results = cur.fetchall()
    if not query_results:
        # update portfolio table
        sqlQuery = "update portfolios set portfolioname=%s where portfolioname=%s and userid=%s"
        cur.execute(sqlQuery, (newPortfolioName, oldPortfolioName, userID))
        # update holdings table
        sqlQuery = "update holdings set portfolioname=%s where portfolioname=%s and userid=%s"
        cur.execute(sqlQuery, (newPortfolioName, oldPortfolioName, userID))
        response ={ 
            'status': 200,
            'message' : '\'' + oldPortfolioName + "\' has been changed to \'" + newPortfolioName + "\'."
        }
    else:
        response = {
            'status' : 400,
            'message' : 'There is already a portfolio called' + newPortfolioName + '. Try anther name.'
        }
    # Commit changes, close connection and return response to user
    conn.commit()
    conn.close()
    return response


# Delete portfolio object from the database
# Note: this function does not check whether userID or portfolio exists. It just deletes them if they exist
def deletePortfolio(userID, portfolioName):
    conn = createDBConnection()
    cur = conn.cursor()
    # Delete from portfolio table
    sqlQuery = "delete from portfolios where portfolioname=%s and userid=%s"
    cur.execute(sqlQuery, (portfolioName, userID))
    # Delete from holdings table
    sqlQuery = "delete from holdings where portfolioname=%s and userid=%s"
    cur.execute(sqlQuery, (portfolioName, userID))
    # Commit changes, close connection and return response to user
    conn.commit()
    conn.close()
    return {'status' : 200, 'message' : "Portfolio called \'" + portfolioName + "\' has been deleted."}


############# Investment helper functions #################
def totalStockChange(currentPrice, purchasePrice):
    # Write this after price fetching functions are written
    return (currentPrice - purchasePrice)*100 / purchasePrice


# Add investments to portfolio object in database 
# Note: this assumes portfolioName and all the other inputs are of the correct size and data type
def addInvestment(userID, portfolioName, purchasePrice, numShares, purchaseDate, stockTicker):
    conn = createDBConnection()
    cur = conn.cursor()
    sqlQuery = "insert into Holdings (userID, portfolioName, purchasePrice, numShares, purchaseDate, totalChange, stockTicker) VALUES (%s, %s, %s, %s, %s, %s, %s)"
    # Fetch current price 
    quickData = TimeSeries().get_quick_quote(stockTicker)
    currentPrice = float(quickData['Global Quote']['05. price'])
    totalChange = totalStockChange(currentPrice, float(purchasePrice))
    # Execute query and close connections
    cur.execute(sqlQuery, (userID, portfolioName, purchasePrice, numShares, purchaseDate, totalChange, stockTicker))
    conn.commit()
    conn.close()
    return {'status' : 200, 'message' : "Your investment in " + stockTicker + " has been added to the portfolio called \'" + portfolioName + "\'."}


# Delete investments from portfolio object in database
def deleteInvestment(investmentID):
    conn = createDBConnection()
    cur = conn.cursor()
    # Delete from holdings table
    sqlQuery = "delete from holdings where investmentID=%s"
    cur.execute(sqlQuery, (investmentID, ))
    conn.commit()
    conn.close()
    return {'status' : 200, 'message' : "Investment removed"}


# View an individual investment's total performance
# Note: this assumes investmentID is correct.
def viewInvestment(investmentID):
    conn = createDBConnection()
    cur = conn.cursor()
    # Delete from holdings table
    sqlQuery = "select totalChange from holdings where investmentID=%s"
    cur.execute(sqlQuery, (investmentID, ))
    queryResults = cur.fetchall()
    totalChange = str(queryResults[0][0])
    conn.close()
    return {'status' : 200, 'message' : totalChange}


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
            'TotalChange' : row[6],
            'StockTicker' : row[7]
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
def getPortfolios(userID):
    conn = createDBConnection()
    cur = conn.cursor()
    sqlQuery = "select portfolioName from portfolios where userID=%s"
    cur.execute(sqlQuery, (userID, ))
    queryResults = cur.fetchall()
    data = []
    for tupl in queryResults:
        data.append(tupl[0])
    conn.close()
    return {'status' : 200, 'data' : data}

def getInvestments(userID, portfolioName):
    conn = createDBConnection()
    cur = conn.cursor()
    sqlQuery = "select * from holdings where userID=%s and portfolioName=%s"
    cur.execute(sqlQuery, (userID, portfolioName))
    queryResults = cur.fetchall()
    data = []
    for row in queryResults:
        newInvestment = {
            'investmentID' : row[0],
            'PurchasePrice' : str(row[3]), 
            'NumShares' : row[4], 
            'PurchaseDate' : row[5].strftime("%Y-%m-%d"), 
            'TotalChange' : float(row[6]),
            'StockTicker' : row[7]
        }
        data.append(newInvestment)

    conn.close()
    return {'status' : 200, 'data' : data}

################################
# Please leave all routes here #
################################
@PORTFOLIO_ROUTES.route('/portfolio/createPortfolio', methods=['POST'])
def createUsersPortolio():
    data = request.get_json()
    userID = data['userID']
    portfolioName = request.args.get('portfolioName')
    response = createPortfolio(userID, portfolioName)
    return dumps(response)


@PORTFOLIO_ROUTES.route('/portfolio/editPortfolio', methods=['PUT'])
def editUsersPortolio():
    data = request.get_json()
    userID = data['userID']
    oldPortfolioName = request.args.get('oldPortfolioName')
    newPortfolioName = request.args.get('newPortfolioName')
    response = editPortfolio(userID, oldPortfolioName, newPortfolioName)
    return dumps(response)


@PORTFOLIO_ROUTES.route('/portfolio/deletePortfolio', methods=['DELETE'])
def deleteUsersPortolio():
    data = request.get_json()
    userID = data['userID']
    portfolioName = request.args.get('portfolioName')
    response = deletePortfolio(userID, portfolioName)
    return dumps(response)


@PORTFOLIO_ROUTES.route('/portfolio/addInvestment', methods=['POST'])
def addInvestmentToPortolio():
    data = request.get_json()
    userID = data['userID']
    portfolioName = request.args.get('portfolioName')
    purchasePrice = data['purchasePrice']
    numShares = data['numShares']
    purchaseDate = data['purchaseDate']
    stockTicker = data['stockTicker']
    response = addInvestment(userID, portfolioName, purchasePrice, numShares, purchaseDate, stockTicker)
    return dumps(response)


@PORTFOLIO_ROUTES.route('/portfolio/deleteInvestment', methods=['DELETE'])
def deleteInvestmentFromPortolio():
    data = request.get_json()
    investmentID = data['investmentID']
    return dumps(deleteInvestment(investmentID))


@PORTFOLIO_ROUTES.route('/portfolio/viewInvestment', methods=['GET'])
def viewInvestmentsInPortolio():
    data = request.get_json()
    investmentID = data['investmentID']
    return dumps(viewInvestment(investmentID))


@PORTFOLIO_ROUTES.route('/portfolio/getPortfolios', methods=['GET'])
def returnUsersPortfolios():
    data = request.get_json()
    userID = data['userID']
    return dumps(getPortfolios(userID))


@PORTFOLIO_ROUTES.route('/portfolio/getInvestments', methods=['GET'])
def returnPortfoliosInvestments():
    data = request.get_json()
    userID = data['userID']
    portfolioName = request.args.get('portfolioName')
    return dumps(getInvestments(userID, portfolioName))





############ Tests #############
#createPortfolio('4', 'Austin\'s portfolio')
#createPortfolio('4', 'Austi')
#editPortfolio('4', 'Austin\'s portfolio', 'Bob\'s portfolio')
#deletePortfolio('4', 'Bob\'s portfolio')
#deletePortfolio('4', 'Austi')
#addInvestment('4', 'Austin\'s portfolio', '100.5', '50', '2021-03-15', 'IBM')
#viewInvestment("2380756e-863c-11eb-af93-0a4e2d6dea13")

