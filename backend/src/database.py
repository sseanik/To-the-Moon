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


def create_DB_connection():
    try:
        conn = psycopg2.connect(host=ENDPOINT, port=PORT,
                                database=DBNAME, user=USER, password=PASS)
        return conn

    except Exception as e:
        print("Database connection failed due to {}".format(e))


def create_portfolios_table():
    conn = create_DB_connection()
    cur = conn.cursor()
    cur.execute(open("Tables/portfolios.sql", "r").read())
    conn.commit()
    conn.close()


def create_holdings_table():
    conn = create_DB_connection()
    cur = conn.cursor()
    cur.execute(open("Tables/holdings.sql", "r").read())
    conn.commit()
    conn.close()


def create_user_table():
    conn = create_DB_connection()
    cur = conn.cursor()
    cur.execute(open("tables/users.sql", "r").read())
    conn.commit()
    conn.close()


def create_securities_overviewTable():
    conn = create_DB_connection()
    cur = conn.cursor()
    cur.execute(open("Tables/securities_overviews.sql", "r").read())
    conn.commit()
    conn.close()

def create_notes_table():
    conn = create_DB_connection()
    cur = conn.cursor()
    cur.execute(open("Tables/notes.sql", "r").read())
    conn.commit()
    conn.close()

def create_comment_tables():
    conn = create_DB_connection()
    cur = conn.cursor()
    cur.execute(open("Tables/forum_comment.sql", "r").read())
    conn.commit()
    cur.execute(open("Tables/forum_reply.sql", "r").read())
    conn.commit()
    conn.close()


def fill_securities_overview_table(symbol):
    conn = create_DB_connection()
    cur = conn.cursor()
    Overview = TimeSeries().get_company_overview(symbol)
    insertQuery = '''INSERT INTO securities_overviews (
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


def create_income_statementsTable():
    conn = create_DB_connection()
    cur = conn.cursor()
    cur.execute(open("Tables/income_statements.sql", "r").read())
    conn.commit()
    conn.close()


def fill_income_statements(symbol):
    conn = create_DB_connection()
    cur = conn.cursor()
    Statement = TimeSeries().get_income_statement(symbol)
    for annualReport in Statement['annualReports']:
        insertQuery = '''INSERT INTO income_statements (
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


def create_balance_sheets_table():
    conn = create_DB_connection()
    cur = conn.cursor()
    cur.execute(open("Tables/balance_sheets.sql", "r").read())
    conn.commit()
    conn.close()


def fill_balance_sheets(symbol):
    conn = create_DB_connection()
    cur = conn.cursor()
    Statement = TimeSeries().get_balance_sheet(symbol)
    for annualReport in Statement['annualReports']:
        insertQuery = '''INSERT INTO balance_sheets (
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
            total_shareholder_equity
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (stock_ticker, fiscal_date_ending) DO NOTHING
        '''
        # Convert "None" values to None so cur.execute converts it to NULL.
        for key, value in annualReport.items():
            if (value == "None"):
                annualReport[key] = None

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
            annualReport['otherNonCurrentAssets'],
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


def create_cashflow_statements_table():
    conn = create_DB_connection()
    cur = conn.cursor()
    cur.execute(open("Tables/cashflow_statements.sql", "r").read())
    conn.commit()
    conn.close()


def fill_cashflow_statements(symbol):
    conn = create_DB_connection()
    cur = conn.cursor()
    Statement = TimeSeries().get_cash_flow(symbol)
    for annualReport in Statement['annualReports']:
        insertQuery = '''INSERT INTO cashflow_statements (
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
            net_income
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (stock_ticker, fiscal_date_ending) DO NOTHING
        '''
        # Convert "None" values to None so cur.execute converts it to NULL.
        for key, value in annualReport.items():
            if (value == "None"):
                annualReport[key] = None

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


def fill_overview_and_financial_tables(symbol):
    fillSecuritiesOverviewTable(symbol)
    fillIncomeStatements(symbol)
    fillBalanceSheets(symbol)
    fillCashflowStatements(symbol)


if __name__ == "__main__":
    create_user_table()
    #create_portfolios_table()
    #create_holdings_table()
    #create_securities_overviewTable()
    #create_income_statementsTable()
    #create_balance_sheets_table()
    #create_cashflow_statements_table()
    #create_comment_tables()
    #create_notes_table()

    # Basic materials
    # fill_securities_overview_table('BHP')

    # Technology sector
    #fill_securities_overview_table('ORCL')
    #fill_securities_overview_table('IBM')