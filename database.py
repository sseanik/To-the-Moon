# ---------------------------------------------------------------------------- #
#                                Database Module                               #
# ---------------------------------------------------------------------------- #

import os
import time
import psycopg2
from helpers import TimeSeries
import urllib.parse as urlparse

# ---------------------------------------------------------------------------- #
#                             Environment Variables                            #
# ---------------------------------------------------------------------------- #


url = urlparse.urlparse(os.environ["DATABASE_URL"])
dbname = url.path[1:]
user = url.username
password = url.password
host = url.hostname
port = url.port


def create_DB_connection():
    """Create a Database connection, connecting the the RDS database.
    This function is used primarily over the app and closing the connection
    is handled by the invoked functions.

    Returns:
        connection: Connection to the database
    """
    try:
        conn = psycopg2.connect(
            dbname=dbname, user=user, password=password, host=host, port=port
        )
        return conn

    except Exception as e:
        print("Database connection failed due to {}".format(e))


# Each table utilises the Table schema and creates the Database table


def installExtension():
    conn = create_DB_connection()
    cur = conn.cursor()
    cur.execute('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
    conn.commit()
    conn.close()


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
    cur.execute(open("Tables/users.sql", "r").read())
    conn.commit()
    conn.close()


def create_securities_overview_table():
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
    cur.execute(open("Tables/watchlists.sql", "r").read())
    conn.commit()
    cur.execute(open("Tables/subscriptions.sql", "r").read())
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


def create_screeners_table():
    conn = create_DB_connection()
    cur = conn.cursor()
    cur.execute(open("Tables/screeners.sql", "r").read())
    conn.commit()


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


def fill_securities_overview_table(symbol):
    conn = create_DB_connection()
    cur = conn.cursor()
    overview = TimeSeries().get_company_overview(symbol)
    insert_query = """INSERT INTO securities_overviews (
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
    """

    # Convert "None" values to None so cur.execute converts it to NULL.
    for key, value in overview.items():
        if value == "None":
            overview[key] = None

    cur.execute(
        insert_query,
        (
            overview["Symbol"],
            overview["Name"],
            overview["Description"],
            overview["Exchange"],
            overview["Currency"],
            overview["52WeekHigh"],
            overview["52WeekLow"],
            overview["MarketCapitalization"],
            overview["Beta"],
            overview["PERatio"],
            overview["EPS"],
            overview["DividendYield"],
            overview["Sector"],
            overview["Industry"],
            overview["BookValue"],
            overview["EBITDA"],
            overview["PayoutRatio"],
            overview["RevenueTTM"],
            overview["GrossProfitTTM"],
        ),
    )

    conn.commit()
    conn.close()


def create_income_statements_table():
    conn = create_DB_connection()
    cur = conn.cursor()
    cur.execute(open("Tables/income_statements.sql", "r").read())
    conn.commit()
    conn.close()


def fill_income_statements(symbol):
    conn = create_DB_connection()
    cur = conn.cursor()
    statement = TimeSeries().get_income_statement(symbol)
    for annual_report in statement["annualReports"]:
        insert_query = """INSERT INTO income_statements (
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
        """
        # Convert "None" values to None so cur.execute converts it to NULL.
        for key, value in annual_report.items():
            if value == "None":
                annual_report[key] = None

        cur.execute(
            insert_query,
            (
                symbol,
                annual_report["fiscalDateEnding"],
                annual_report["totalRevenue"],
                annual_report["costOfRevenue"],
                annual_report["grossProfit"],
                annual_report["operatingExpenses"],
                annual_report["operatingIncome"],
                annual_report["incomeBeforeTax"],
                annual_report["interestIncome"],
                annual_report["netInterestIncome"],
                annual_report["ebit"],
                annual_report["ebitda"],
                annual_report["netIncome"],
            ),
        )
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
    statement = TimeSeries().get_balance_sheet(symbol)
    for annual_report in statement["annualReports"]:
        insert_query = """INSERT INTO balance_sheets (
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
        """
        # Convert "None" values to None so cur.execute converts it to NULL.
        for key, value in annual_report.items():
            if value == "None":
                annual_report[key] = None

        cur.execute(
            insert_query,
            (
                symbol,
                annual_report["fiscalDateEnding"],
                annual_report["cashAndShortTermInvestments"],
                annual_report["currentNetReceivables"],
                annual_report["inventory"],
                annual_report["otherCurrentAssets"],
                annual_report["propertyPlantEquipment"],
                annual_report["goodwill"],
                annual_report["intangibleAssets"],
                annual_report["longTermInvestments"],
                annual_report["otherNonCurrentAssets"],
                annual_report["currentAccountsPayable"],
                annual_report["shortTermDebt"],
                annual_report["otherCurrentLiabilities"],
                annual_report["longTermDebt"],
                annual_report["otherNonCurrentLiabilities"],
                annual_report["retainedEarnings"],
                annual_report["totalShareholderEquity"],
            ),
        )
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
    statement = TimeSeries().get_cash_flow(symbol)
    for annual_report in statement["annualReports"]:
        insert_query = """INSERT INTO cashflow_statements (
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
        """
        # Convert "None" values to None so cur.execute converts it to NULL.
        for key, value in annual_report.items():
            if value == "None":
                annual_report[key] = None

        cur.execute(
            insert_query,
            (
                symbol,
                annual_report["fiscalDateEnding"],
                annual_report["operatingCashflow"],
                annual_report["paymentsForOperatingActivities"],
                annual_report["changeInOperatingLiabilities"],
                annual_report["changeInOperatingAssets"],
                annual_report["depreciationDepletionAndAmortization"],
                annual_report["changeInInventory"],
                annual_report["cashflowFromInvestment"],
                annual_report["cashflowFromFinancing"],
                annual_report["dividendPayout"],
                annual_report["proceedsFromRepurchaseOfEquity"],
                annual_report["changeInCashAndCashEquivalents"],
                annual_report["netIncome"],
            ),
        )
    conn.commit()
    conn.close()


def fill_overview_and_financial_tables(symbol):
    fill_securities_overview_table(symbol)
    fill_income_statements(symbol)
    fill_balance_sheets(symbol)
    fill_cashflow_statements(symbol)


def fill_all_companies():
    companies = [
        "BHP",
        "LIN",
        "JPM",
        "MA",
        "WMT",
        "KO",
        "NEE",
        "DUK",
        "XOM",
        "CVX",
        "ORCL",
        "IBM",
        "NKE",
        "TM",
        "AMT",
        "PLD",
        "JNJ",
        "UNH",
        "T",
        "VZ",
        "BA",
        "CAT",
    ]
    for company in companies:
        fill_overview_and_financial_tables(company)
        print("Inserted ", company)
        time.sleep(60)


if __name__ == "__main__":
    installExtension()
    create_portfolios_table()
    create_holdings_table()
    create_user_table()
    create_securities_overview_table()
    create_notes_table()
    create_watchlist_tables()
    create_comment_tables()
    create_screeners_table()
    create_vote_plpgsql_functions()
    create_dashboard_tables()
    create_income_statements_table()
    create_balance_sheets_table()
    create_cashflow_statements_table()

    # Basic materials sector
    # Consumer defence sector
    # Utilities sector
    # Energy sector
    # Technology sector
    # Consumer cyclical sector
    # Real estate sector
    # Healthcare sector
    # Communication services sector
    # Industrials sector
    fill_all_companies()

    # fill_securities_overview_table(symbol)
    # fill_income_statements(symbol)
    # fill_balance_sheets(symbol)
    # fill_cashflow_statements(symbol)
    # fill_overview_and_financial_tables(symbol)