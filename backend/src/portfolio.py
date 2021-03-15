########################
#   Portfolio Module   #
########################


from flask import Blueprint, request
from json import dumps
from database import createDBConnection

PORTFOLIO_ROUTES = Blueprint('portfolio', __name__)


###################################
# Please leave all functions here #
###################################


# Create portfolio object in the database
def createPortfolio(userID, portfolioName):
    # Check name is within the max length
    if len(portfolioName) >= 30:
        return 'The portfolio name is too long.'
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
        response = 'Portfolio called \'' + portfolioName + '\' has been created.'
    else:
        response = 'That name is already in use.'
    # Close connection and return response
    conn.close()
    return response


# Edit portfolio (e.g. change name of portfolio) in database
def editPortfolio(userID, oldPortfolioName, newPortfolioName):
    # Check new name is within the max length
    if len(newPortfolioName) >= 30:
        return 'The portfolio name is too long'
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
        response = oldPortfolioName + " has been changed to " + newPortfolioName + "."
    else:
        response = 'There is already a portfolio called' + newPortfolioName + '. Try anther name.'
    # Commit changes, close connection and return response to user
    conn.commit()
    conn.close()
    return response


# Delete portfolio object from the database
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
    return "Portfolio called \'" + portfolioName + "\' has been deleted."


# Investment helper functions
def dayChange():
    # Write this after price fetching functions are written 
    pass

def totalChange():
    # Write this after price fetching functions are written
    pass


# Add investments to portfolio object in database 
# TEST THIS
def addInvestment(userID, portfolioName, purchasePrice, numShare, purchaseDate, stockTicker):
    conn = createDBConnection()
    cur = conn.cursor()
    sqlQuery = "insert into Holdings (userID, portfolioName, purchasePrice, numShares, purchaseDate, dayChange, totalChange, stockTicker) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
    dayChange = dayChange()
    totalChange = totalChange()
    cur.execute(sqlQuery, (userID, portfolioName, purchasePrice, numShare, purchaseDate, dayChange, totalChange, stockTicker))
    conn.commit()
    conn.close()
    return "Your investment in " + stockTicker + " has been added to the portfolio called " + portfolioName + "."


# Delete investments from portfolio object in database
# TEST THIS
def deleteInvestment(investmentID):
    conn = createDBConnection()
    cur = conn.cursor()
    # Delete from holdings table
    sqlQuery = "delete from holdings where investmentID=%s"
    cur.execute(sqlQuery, (investmentID))
    conn.commit()
    conn.close()
    return "Investment removed"


# View an individual investment's total performance
# TEST THIS
def viewInvestment(investmentID):
    conn = createDBConnection()
    cur = conn.cursor()
    # Delete from holdings table
    sqlQuery = "select totalChange from holdings where investmentID=%s"
    cur.execute(sqlQuery, (investmentID))
    queryResults = cur.fetchall()
    conn.close()
    return queryResults




############ Tests #############
#createPortfolio('4', 'Austin\'s portfolio')
#createPortfolio('4', 'Austi')
#editPortfolio('4', 'Austin\'s portfolio', 'Bob\'s portfolio')
#deletePortfolio('4', 'Bob\'s portfolio')
#deletePortfolio('4', 'Austi')



################################
# Please leave all routes here #
################################
@PORTFOLIO_ROUTES.route('/portfolio/createPortfolio', methods=['GET'])
def createUsersPortolio():
    # Adjust this line to get userID from frontend JSON and not URL    
    userID = request.args.get('userID')
    
    portfolioName = request.args.get('portfolioName')
    response = createPortfolio(userID, portfolioName)
    return dumps({'backend response': response})


@PORTFOLIO_ROUTES.route('/portfolio/editPortfolio', methods=['GET'])
def editUsersPortolio():
    # Adjust this line to get userID from frontend JSON and not URL
    userID = request.args.get('userID')

    oldPortfolioName = request.args.get('oldPortfolioName')
    newPortfolioName = request.args.get('newPortfolioName')
    response = editPortfolio(userID, oldPortfolioName, newPortfolioName)
    return dumps({'backend response': response})


@PORTFOLIO_ROUTES.route('/portfolio/deletePortfolio', methods=['GET'])
def deleteUsersPortolio():
    # Adjust this line to get userID from frontend JSON and not URL
    userID = request.args.get('userID')

    portfolioName = request.args.get('portfolioName')
    response = deletePortfolio(userID, portfolioName)
    return dumps({'backend response': response})


@PORTFOLIO_ROUTES.route('/portfolio/addInvestment', methods=['GET'])
def addInvestmentToPortolio():
    # Finish this when database is completed
    # This needs to be tested
    return dumps()

@PORTFOLIO_ROUTES.route('/portfolio/deleteInvestment', methods=['GET'])
def deleteInvestmentFromPortolio():
    # Finish this when database is completed
    # This needs to be tested
    return dumps()

@PORTFOLIO_ROUTES.route('/portfolio/viewInvestment', methods=['GET'])
def viewInvestmentsInPortolio():
    # Finish this when database is completed
    # This needs to be tested
    return dumps()
