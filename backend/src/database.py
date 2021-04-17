import psycopg2
from dotenv import load_dotenv
import time
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


def create_watchlist_tables():
    conn = create_DB_connection()
    cur = conn.cursor()
    cur.execute(open("Tables/subscriptions.sql", "r").read())
    conn.commit()
    cur.execute(open("Tables/watchlists.sql", "r").read())
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

def create_dashboard_tables():
    conn = create_DB_connection()
    cur = conn.cursor()
    cur.execute(open("Tables/dashboards.sql", "r").read())
    conn.commit()
    cur.execute(open("Tables/dashboard_blocks.sql", "r").read())
    conn.commit()
    cur.execute(open("Tables/dashboard_references.sql", "r").read())
    conn.commit()
    conn.close()

def create_screeners_table():
    conn = create_DB_connection()
    cur = conn.cursor()
    cur.execute(open("Tables/screeners.sql", "r").read())
    conn.commit()
    conn.close()

def create_vote_plpgsql_functions():
    conn = create_DB_connection()
    cur = conn.cursor()
    cur.execute(open("Tables/Functions/upvote_comment.sql", "r").read())
    conn.commit()
    cur.execute(open("Tables/Functions/downvote_comment.sql", "r").read())
    conn.commit()
    cur.execute(open("Tables/Functions/upvote_reply.sql", "r").read())
    conn.commit()
    cur.execute(open("Tables/Functions/downvote_reply.sql", "r").read())
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
        dividend_yield,
        sector, 
        industry,
        book_value,
        EBITDA,
        payout_ratio,
        revenue_TTM,
        gross_profit_TTM
    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    ON CONFLICT (stock_ticker) DO NOTHING
    '''
    # Convert "None" values to None so cur.execute converts it to NULL.
    for key, value in Overview.items():
        if (value == "None"):
            Overview[key] = None

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
        Overview['DividendYield'],
        Overview['Sector'],
        Overview['Industry'],
        Overview['BookValue'],
        Overview['EBITDA'],
        Overview['PayoutRatio'],
        Overview['RevenueTTM'],
        Overview['GrossProfitTTM']
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
    for annual_report in Statement['annualReports']:
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
        # Convert "None" values to None so cur.execute converts it to NULL.
        for key, value in annual_report.items():
            if (value == "None"):
                annual_report[key] = None

        cur.execute(insertQuery, (
            symbol,
            annual_report['fiscalDateEnding'],
            annual_report['totalRevenue'],
            annual_report['costOfRevenue'],
            annual_report['grossProfit'],
            annual_report['operatingExpenses'],
            annual_report['operatingIncome'],
            annual_report['incomeBeforeTax'],
            annual_report['interestIncome'],
            annual_report['netInterestIncome'],
            annual_report['ebit'],
            annual_report['ebitda'],
            annual_report['netIncome']
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
    for annual_report in Statement['annualReports']:
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
        for key, value in annual_report.items():
            if (value == "None"):
                annual_report[key] = None

        cur.execute(insertQuery, (
            symbol,
            annual_report['fiscalDateEnding'],
            annual_report['cashAndShortTermInvestments'],
            annual_report['currentNetReceivables'],
            annual_report['inventory'],
            annual_report['otherCurrentAssets'],
            annual_report['propertyPlantEquipment'],
            annual_report['goodwill'],
            annual_report['intangibleAssets'],
            annual_report['longTermInvestments'],
            annual_report['otherNonCurrrentAssets'],
            annual_report['currentAccountsPayable'],
            annual_report['shortTermDebt'],
            annual_report['otherCurrentLiabilities'],
            annual_report['longTermDebt'],
            annual_report['otherNonCurrentLiabilities'],
            annual_report['retainedEarnings'],
            annual_report['totalShareholderEquity']
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
    for annual_report in Statement['annualReports']:
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
        for key, value in annual_report.items():
            if (value == "None"):
                annual_report[key] = None

        cur.execute(insertQuery, (
            symbol,
            annual_report['fiscalDateEnding'],
            annual_report['operatingCashflow'],
            annual_report['paymentsForOperatingActivities'],
            annual_report['changeInOperatingLiabilities'],
            annual_report['changeInOperatingAssets'],
            annual_report['depreciationDepletionAndAmortization'],
            annual_report['changeInInventory'],
            annual_report['cashflowFromInvestment'],
            annual_report['cashflowFromFinancing'],
            annual_report['dividendPayout'],
            annual_report['proceedsFromRepurchaseOfEquity'],
            annual_report['changeInCashAndCashEquivalents'],
            annual_report['netIncome']
        ))
    conn.commit()
    conn.close()


def fill_overview_and_financial_tables(symbol):
    fill_securities_overview_table(symbol)
    fill_income_statements(symbol)
    fill_balance_sheets(symbol)
    fill_cashflow_statements(symbol)

def fill_all_companies():
    companies = [
        'BHP',
        'LIN',
        'JPM',
        'MA',
        'WMT',
        'KO',
        'NEE',
        'DUK',
        'XOM',
        'CVX',
        'ORCL',
        'IBM',
        'NKE',
        'TM',
        'AMT',
        'PLD',
        'JNJ',
        'UNH',
        'T',
        'VZ',
        'BA',
        'CAT'
    ]
    for company in companies:
        fill_overview_and_financial_tables(company)
        print("Inserted ", company)
        time.sleep(60)


if __name__ == "__main__":
    # create_user_table()
    # create_portfolios_table()
    # create_holdings_table()
    # create_securities_overviewTable()
    # create_income_statementsTable()
    # create_balance_sheets_table()
    # create_cashflow_statements_table()
    # create_comment_tables()
    # create_notes_table()
    create_dashboard_tables()
    # create_screeners_table()
    # create_watchlist_tables()

    
    # fill_all_companies()
