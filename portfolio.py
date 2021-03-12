########################
#   Portfolio Module   #
########################


from flask import Blueprint
from database import createDBConnection

PORTFOLIO_ROUTES = Blueprint('portfolio', __name__)


###################################
# Please leave all functions here #
###################################



# Create portfolio object in the database
def createPortfolio(UserID, portfolioName):
    if len(portfolioName) >= 30:
        return 'Name must be less than 30 characters'

    conn = createDBConnection()
    cur = conn.cursor()
    insertQuery = f"select * from portfolio where portfolioname='{portfolioName}' and userid={UserID}"
    cur.execute(insertQuery)
    query_results = cur.fetchall()
    if not query_results:
        # If portfolio name is unique, insert it.
        insertQuery = "INSERT INTO Portfolio (portfolioname, userid) VALUES (%s, %s)"
        cur.execute(insertQuery, (portfolioName, UserID))
        conn.commit()
        conn.close()
    else:
        conn.close()
        return 'That name is already used.'



# Edit portfolio (e.g. change name of portfolio) in database
def editPortfolio(UserID, oldPortfolioName, newPortfolioName):
    conn = createDBConnection()
    cur = conn.cursor()
    # update portfolio table
    insertQuery = f"update portfolio set portfolioname='{newPortfolioName}' where portfolioname='{oldPortfolioName}' and userid={UserID}"
    cur.execute(insertQuery)
    # update holdings table
    insertQuery = f"update holdings set portfolioname='{newPortfolioName}' where portfolioname='{oldPortfolioName}' and userid={UserID}"
    cur.execute(insertQuery)
    conn.commit()
    conn.close()


# Delete portfolio object from the database
def deletePortfolio(UserID, portfolioName):
    conn = createDBConnection()
    cur = conn.cursor()
    # update portfolio table
    insertQuery = f"delete from portfolio where portfolioname='{portfolioName}' and userid={UserID}"
    cur.execute(insertQuery)
    # update holdings table
    insertQuery = f"delete from holdings where portfolioname='{portfolioName}' and userid={UserID}"
    cur.execute(insertQuery)
    conn.commit()
    conn.close()

# Add investments to portfolio object in database
def addInvestment():
    pass

# Delete investments from portfolio object in database
def deleteInvestment():
    pass

# View individual investment performance
def viewInvestment():
    pass

# Tests
#createPortfolio(4, 'Austin')
#createPortfolio(4, 'Austi')
#editPortfolio(4, 'Austin', 'Austi')
#deletePortfolio(4, 'Austi')

################################
# Please leave all routes here #
################################
