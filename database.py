import psycopg2
from dotenv import load_dotenv
from helpers import TimeSeries, AlphaVantageAPI
import os
import json

load_dotenv()

ENDPOINT = os.getenv("DBENDPOINT")
PORT = os.getenv("DBPORT")
REGION = os.getenv("DBREGION")
DBNAME = os.getenv("DBNAME")
USER = os.getenv("DBUSER")
PASS = os.getenv("DBPASS")

def createDBConnection():
    try:
        conn = psycopg2.connect(host=ENDPOINT, port=PORT, database=DBNAME, user=USER, password=PASS)
        #cur = conn.cursor()
        #selectQuery = "SELECT 5;"
        #cur.execute(selectQuery)
        #query_results = cur.fetchall()
        #print(query_results)
        return conn

    except Exception as e:
        print("Database connection failed due to {}".format(e))


def createPortfolioTable():
    conn = createDBConnection()
    cur = conn.cursor()
    cur.execute(open("Tables/Portfolios.sql", "r").read())
    conn.commit()
    conn.close()

def createHoldingsTable():
    conn = createDBConnection()
    cur = conn.cursor()
    cur.execute(open("Tables/Holdings.sql", "r").read())
    conn.commit()
    conn.close()

def createUserTable():
    conn = createDBConnection()
    cur = conn.cursor()
    cur.execute(open("tables/User.sql", "r").read())
    conn.commit()
    conn.close()

def createSecuritiesOverviewTable():
    conn = createDBConnection()
    cur = conn.cursor()
    cur.execute(open("Tables/SecuritiesOverviews.sql", "r").read())
    conn.commit()
    conn.close()

def fillSecuritiesOverviewTable(symbol):
    conn = createDBConnection()
    cur = conn.cursor()
    Overview = TimeSeries().get_company_overview(symbol)
    insertQuery = '''INSERT INTO SecuritiesOverviews (
        stock_ticker,
        stock_name,
        stock_description,
        exchange,
        currency,
        yearly_high,
        yearly_low,
        market_cap,
        beta,
        pe_ratio,
        eps,
        dividend_yield
    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    ON CONFLICT (stock_ticker) DO NOTHING
    '''
    cur.execute(insertQuery, (
        Overview['Symbol'],
        Overview['Name'],
        Overview['Description'],
        Overview['Exchange'],
        Overview['Currency'],
        Overview['52WeekHigh'], 
        Overview['52WeekLow'],
        Overview['MarketCapitalization'],
        Overview['Beta'],
        Overview['PERatio'],
        Overview['EPS'],
        Overview['DividendYield']
    ))
    conn.commit()
    conn.close()


def createIncomeStatementsTable():
    conn = createDBConnection()
    cur = conn.cursor()
    cur.execute(open("Tables/IncomeStatements.sql", "r").read())
    conn.commit()
    conn.close()

def fillIncomeStatements(symbol):
    conn = createDBConnection()
    cur = conn.cursor()
    Statement = TimeSeries().get_income_statement(symbol)
    for annualReport in Statement['annualReports']:
        insertQuery = '''INSERT INTO IncomeStatements (
            stock_ticker,
            fiscal_date_ending,
            total_revenue,
            cost_of_revenue,
            gross_profit,
            operating_expenses,
            operating_income,
            income_before_tax,
            interest_income,
            net_interest_income,
            ebit,
            ebitda,
            net_income
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (stock_ticker, fiscal_date_ending) DO NOTHING
        '''
        cur.execute(insertQuery, (
            symbol,
            annualReport['fiscalDateEnding'],
            annualReport['totalRevenue'],
            annualReport['costOfRevenue'],
            annualReport['grossProfit'],
            annualReport['operatingExpenses'],
            annualReport['operatingIncome'],
            annualReport['incomeBeforeTax'],
            annualReport['interestIncome'],
            annualReport['netInterestIncome'],
            annualReport['ebit'],
            annualReport['ebitda'],
            annualReport['netIncome']
        ))
    conn.commit()
    conn.close()

def createBalanceSheetsTable():
    conn = createDBConnection()
    cur = conn.cursor()
    cur.execute(open("Tables/BalanceSheets.sql", "r").read())
    conn.commit()
    conn.close()

def fillBalanceSheets(symbol):
    conn = createDBConnection()
    cur = conn.cursor()
    Statement = TimeSeries().get_balance_sheet(symbol)
    for annualReport in Statement['annualReports']:
        insertQuery = '''INSERT INTO BalanceSheets (
            stock_ticker,
            fiscal_date_ending,
            cash_and_short_term_investments,
            current_net_receivables,
            inventory,
            other_current_assets,
            property_plant_equipment,
            goodwill,
            intangible_assets,
            long_term_investments,
            other_non_current_assets,
            current_accounts_payable,
            short_term_debt,
            other_current_liabilities,
            long_term_debt,
            other_non_current_liabilities,
            retained_earnings,
            total_shareholder_equity,
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (stock_ticker, fiscal_date_ending) DO NOTHING
        '''
        cur.execute(insertQuery, (
            symbol,
            annualReport['fiscalDateEnding'],
            annualReport['cashAndShortTermInvestments'],
            annualReport['currentNetReceivables'],
            annualReport['inventory'],
            annualReport['otherCurrentAssets'],
            annualReport['propertyPlantEquipment'],
            annualReport['goodwill'],
            annualReport['intangibleAssets'],
            annualReport['longTermInvestments'],
            annualReport['otherNonCurrrentAssets'],
            annualReport['currentAccountsPayable'],
            annualReport['shortTermDebt'],
            annualReport['otherCurrentLiabilities'],
            annualReport['longTermDebt'],
            annualReport['otherNonCurrentLiabilities'],
            annualReport['retainedEarnings'],
            annualReport['totalShareholderEquity']
        ))
    conn.commit()
    conn.close()

def createCashflowStatementsTable():
    conn = createDBConnection()
    cur = conn.cursor()
    cur.execute(open("Tables/CashflowStatements.sql", "r").read())
    conn.commit()
    conn.close()

def fillCashflowStatements(symbol):
    conn = createDBConnection()
    cur = conn.cursor()
    Statement = TimeSeries().get_cash_flow(symbol)
    for annualReport in Statement['annualReports']:
        insertQuery = '''INSERT INTO CashflowStatements (
            stock_ticker,
            fiscal_date_ending,
            operating_cash_flow,
            payments_for_operating_activities,
            change_in_operating_liabilities,
            change_in_operating_assets,
            depreciation_depletion_and_amortization,
            change_in_inventory,
            cashflow_from_investment,
            cashflow_from_financing,
            dividend_payout,
            proceeds_from_repurchase_of_equity,
            change_in_cash_and_cash_equivalents,
            net_income,
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (stock_ticker, fiscal_date_ending) DO NOTHING
        '''
        cur.execute(insertQuery, (
            symbol,
            annualReport['fiscalDateEnding'],
            annualReport['operatingCashflow'],
            annualReport['paymentsForOperatingActivities'],
            annualReport['changeInOperatingLiabilities'],
            annualReport['changeInOperatingAssets'],
            annualReport['depreciationDepletionAndAmortization'],
            annualReport['changeInInventory'],
            annualReport['cashflowFromInvestment'],
            annualReport['cashflowFromFinancing'],
            annualReport['dividendPayout'],
            annualReport['proceedsFromRepurchaseOfEquity'],
            annualReport['changeInCashAndCashEquivalents'],
            annualReport['netIncome']
        ))
    conn.commit()
    conn.close()


def fillOverviewAndFinancialTables(symbol):
    fillSecuritiesOverviewTable(symbol)
    fillIncomeStatements(symbol)
    fillBalanceSheets(symbol)
    fillCashflowStatements(symbol)


if __name__ == "__main__":
    pass
    #createDBConnection()
    #createPortfolioTable()
    #createHoldingsTable()
    #createSecuritiesOverviewTable()
    #fillSecuritiesOverviewTable('IBM')
    #createIncomeStatementsTable()
    #fillIncomeStatements('IBM')
    #createBalanceSheetsTable()
    #fillBalanceSheets('IBM')
    #createCashflowStatementsTable()
    #fillCashflowStatements('IBM')

    # Basic materials
    fillOverviewAndFinancialTables('BHP')

    # Technology sector
    #fillOverviewAndFinancialTables('ORCL')
    #fillOverviewAndFinancialTables('IBM')
