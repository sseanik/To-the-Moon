####################
#   Stock Module   #
####################


from flask import Blueprint, request

from json import dumps
import pandas as pd
import os
from collections import OrderedDict

from psycopg2.extras import DictCursor
import psycopg2.extensions

from database import createDBConnection
from helpers import JSONLoader, AlphaVantageInfo

STOCK_ROUTES = Blueprint('stock', __name__)

DEC2FLOAT = psycopg2.extensions.new_type(
    psycopg2.extensions.DECIMAL.values,
    'DEC2FLOAT',
    lambda value, curs: float(value) if value is not None else None)
psycopg2.extensions.register_type(DEC2FLOAT)

###################################
# Please leave all functions here #
###################################
def get_stock_value(symbol):
    """
    Load data for stock symbol.
    In future this will be from a DB or the API, for now this loads from file
    so use the data's JSON filename instead
    """
    stockdata, stockmetadata = JSONLoader.load_json(symbol)
    result = pd.DataFrame.from_dict(stockdata, orient='index').astype('float')
    result = result.reindex(index=result.index[::-1])
    result.index = pd.to_datetime(result.index)
    return result, stockmetadata

def get_fundamentals(symbol):
    conn = createDBConnection()
    cur = conn.cursor(cursor_factory=DictCursor)

    selectQuery = f"SELECT * FROM securitiesoverviews \
        WHERE stockticker='{symbol}'"
    cur.execute(selectQuery)
    query_result = cur.fetchone()
    result = OrderedDict(query_result) if query_result else None

    conn.close()
    return result

def get_income_statement(symbol, num_entries=3):
    conn = createDBConnection()
    cur = conn.cursor(cursor_factory=DictCursor)

    selectQuery = f"SELECT * FROM incomestatements \
        WHERE stockticker='{symbol}' \
        ORDER BY fiscaldateending DESC LIMIT {num_entries}"
    cur.execute(selectQuery)
    query_results = cur.fetchall()
    result = [OrderedDict(record) for record in query_results]

    conn.close()
    return result

# revised_bs_order = ['stockticker', 'fiscaldateending', 'total_assets', 'total_curr_assets', 'cashandshortterminvestments', 'currentnetreceivables', 'inventory', 'othercurrentassets', 'total_ncurr_assets', 'propertyplantequipment', 'goodwill', 'intangibleassets', 'longterminvestments', 'othernoncurrentassets', 'total_liabilities', 'total_curr_liabilities', 'currentaccountspayable', 'shorttermdebt', 'othercurrentliabilities', 'total_ncurr_liabilities', 'longtermdebt', 'othernoncurrentliabilities', 'total_equity', 'retainedearnings', 'totalshareholderequity']
revised_bs_order = ['fiscaldateending', 'total_assets', 'total_curr_assets', 'total_ncurr_assets', 'total_liabilities', 'total_curr_liabilities', 'total_ncurr_liabilities', 'total_equity']
# bs_category_names = ['Stock Ticker', 'Fiscal Date Ending', 'Total Assets', 'Total Current Assets', 'Cash and Short Term Investments', 'Net Receivables', 'Inventory', 'Other', 'Total Non-Current Assets', 'Property Plant and Equipment', 'Goodwill', 'Intangible Assets', 'Long Term Investments', 'Other', 'Total Liabilities', 'Total Current Liabilities', 'Current Accounts Payable', 'Short Term Debt', 'Other', 'Total Non-Current Liabilities', 'Long Term Debt', 'Other', 'Total Equity', 'Retained Earnings', 'Total Shareholder Equity']

def get_balance_sheet(symbol, num_entries=1):
    conn = createDBConnection()
    cur = conn.cursor(cursor_factory=DictCursor)

    selectQuery = f"SELECT * FROM balancesheets \
        WHERE stockticker='{symbol}' \
        ORDER BY fiscaldateending DESC LIMIT {num_entries}"
    cur.execute(selectQuery)
    query_results = cur.fetchall()
    # result = [dict(record) for record in query_results]
    result = []
    for entry in query_results:
        record = OrderedDict(entry)

        record['total_curr_assets'] = sum([float(record[x]) for x in ['cashandshortterminvestments', 'currentnetreceivables', 'inventory', 'othercurrentassets']])
        record['total_ncurr_assets'] = sum([float(record[x]) for x in ['propertyplantequipment', 'goodwill', 'intangibleassets', 'longterminvestments', 'othernoncurrentassets']]) # last one is a typo
        record['total_assets'] = record['total_curr_assets'] + record['total_ncurr_assets']

        record['total_curr_liabilities'] = sum([float(record[x]) for x in  ['currentaccountspayable', 'shorttermdebt', 'othercurrentliabilities']])
        record['total_ncurr_liabilities'] = sum([float(record[x]) for x in ['longtermdebt', 'othernoncurrentliabilities']])
        record['total_liabilities'] = record['total_curr_liabilities'] + record['total_ncurr_liabilities']

        record['total_equity'] = sum([float(record[x]) for x in ['retainedearnings', 'totalshareholderequity']])

        record = OrderedDict((k, record[k]) for k in revised_bs_order)
        result.append(record)
    conn.close()

    return result

def get_cash_flow(symbol, num_entries=3):
    conn = createDBConnection()
    cur = conn.cursor(cursor_factory=DictCursor)

    selectQuery = f"SELECT * FROM cashflowstatements \
        WHERE stockticker='{symbol}' \
        ORDER BY fiscaldateending DESC LIMIT {num_entries}"
    cur.execute(selectQuery)
    query_results = cur.fetchall()
    result = [OrderedDict(record) for record in query_results]

    conn.close()
    return result

def convert_to_opairs(df, label='4. close'):
    series = df[label].reset_index()
    series['index'] = (pd.to_datetime(series['index']) \
        - pd.Timestamp("1970-01-01")) // pd.Timedelta(milliseconds=1)
    return series.values.tolist()

def calculate_summary(df):
    result = {}
    if type(df) == pd.core.frame.DataFrame and df.shape[0] > 0:
        result['previous_close'] = df.iloc[-2]['4. close'] \
            if df.shape[0] >= 2 else 0
        result['open'] = df.iloc[-1]['1. open']
        result['day_min'] = df.iloc[-1]['3. low']
        result['day_max'] = df.iloc[-1]['2. high']
        result['year_min'] = df.last("365D")['4. close'].min()
        result['year_max'] = df.last("365D")['4. close'].max()
        result['volume'] = df.iloc[-1]['6. volume']
        result['average_volume'] = df.last("365D")['6. volume'].mean()
    else:
        for field in ['previous_close', 'open', 'day_min', 'day_max',  'year_min', 'year_max', 'volume', 'average_volume']:
            result[field] = 0

    return result



################################
# Please leave all routes here #
################################
@STOCK_ROUTES.route('/stock', methods=['GET'])
def get_stock_data():
    symbol = request.args.get('symbol')
    data = {'name': "", 'data': ""}


    funds = get_fundamentals(symbol)

    if funds:
        sample_df = {}
        sample_metadata = {}
        summary = {}

        filename = "demo/" + symbol + ".json" if symbol else ""
        if os.path.isfile(filename):
            sample_df, sample_metadata = get_stock_value(filename)
            summary = calculate_summary(sample_df)

        intr_filename = "demo/" + symbol + "_intraday.json" if symbol else ""
        intraday = {}
        if os.path.isfile(intr_filename):
            intraday, _ = get_stock_value(intr_filename)

        sample_data_close = convert_to_opairs(sample_df, label="4. close")
        sample_data_high = convert_to_opairs(sample_df, label="2. high")
        sample_data_low = convert_to_opairs(sample_df, label="3. low")

        intr_data_close = convert_to_opairs(intraday, label="4. close")
        stock_name = funds['stockname']

        data = dumps({
            'name': stock_name,
            'data': {
                '4. close': sample_data_close,
                '2. high': sample_data_high,
                '3. low': sample_data_low
            },
            'data_intraday': {
                '4. close': intr_data_close,
            },
            'summary': summary,
            'fundamentals': funds
        })
    else:
        data = dumps({
            'name': "",
            'data': {},
            'error': "Symbol not found"
        })
    return data

def get_financials_data(symbol, func):
    income_statement = func(symbol)
    if symbol and income_statement:
        data = dumps({
            'name': symbol,
            'data': income_statement
        })
    else:
        data = dumps({
            'name': str(symbol),
            'data': None,
            'error': "Income statement not found"
        })
    return data

@STOCK_ROUTES.route('/stock/income_statement', methods=['GET'])
def get_income_statement_data():
    symbol = request.args.get('symbol')
    return get_financials_data(symbol, get_income_statement)

@STOCK_ROUTES.route('/stock/balance_sheet', methods=['GET'])
def get_balance_sheet_data():
    symbol = request.args.get('symbol')
    return get_financials_data(symbol, get_balance_sheet)

@STOCK_ROUTES.route('/stock/cash_flow_statement', methods=['GET'])
def get_cash_flow_data():
    symbol = request.args.get('symbol')
    return get_financials_data(symbol, get_cash_flow)
