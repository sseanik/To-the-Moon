####################
#   Stock Module   #
####################


from flask import Blueprint, request

from json import dumps
import numpy as np
import pandas as pd
import sys
import os
from collections import OrderedDict
from datetime import datetime
import pytz
import requests

from psycopg2.extras import DictCursor
import psycopg2.extensions
from alpha_vantage.timeseries import TimeSeries

from database import create_DB_connection
from helpers import JSONLoader, AlphaVantageInfo

STOCK_ROUTES = Blueprint('stock', __name__)

DEC2FLOAT = psycopg2.extensions.new_type(
    psycopg2.extensions.DECIMAL.values,
    'DEC2FLOAT',
    lambda value, curs: float(value) if value is not None else None)
psycopg2.extensions.register_type(DEC2FLOAT)

local_tz = pytz.timezone("Australia/Sydney")

###################################
# Please leave all functions here #
###################################
def update_stock_required(symbol, data_type="daily_adjusted"):
    filename = "demo/" + symbol + "_" + data_type + ".json" if symbol else ""

    if not os.path.isfile(filename):
        return True
    else:
        _, stockmetadata = JSONLoader.load_json(filename)
        dt_format = "%Y-%m-%d %H:%M:%S" if data_type=="intraday" else "%Y-%m-%d"
        tz_key = "6. Time Zone" if data_type=="intraday" else "5. Time Zone"
        reference_tz = pytz.timezone(stockmetadata[tz_key] if tz_key in stockmetadata else "US/Eastern")
        date_ref = datetime.strptime(stockmetadata['3. Last Refreshed'], dt_format)
        date_ref_aware = reference_tz.localize(date_ref)

        date_today = datetime.today()
        date_today_aware = local_tz.localize(date_today).astimezone(reference_tz)
        date_comp = (date_today-date_ref).total_seconds() > 900 if data_type=="intraday" else (date_today_aware-date_ref_aware).days >= 1

        # TODO: select based on exchange trading hours
        # TODO: allow updating on weekends if last fetched on prior weekday
        date_constraint = (date_today_aware.hour >= 4 and date_today_aware.hour < 20) or (date_ref_aware.hour < 20)
        dow_constraint = date_today_aware.weekday() >= 0 and date_today_aware.weekday() <= 4

        return date_comp and date_constraint and dow_constraint

def retrieve_stock_data(symbol, data_type="daily_adjusted"):
    try:
        ts = TimeSeries(key=AlphaVantageInfo.api_key)
        new_data, new_metadata = ts.get_intraday(symbol, outputsize='full') if data_type=="intraday" else ts.get_daily_adjusted(symbol, outputsize='full')
        JSONLoader.save_json(symbol, [new_data, new_metadata], label=data_type)
    except ValueError as e:
        print(f"Error encountered: {e}", file=sys.stderr)

def retrieve_stock_price_at_date(symbol, purchase_date):
    ts = TimeSeries(key=AlphaVantageInfo.api_key, output_format='csv')
    rounded_datetime = purchase_date.strftime('%Y-%m-%d %H:%M:00')
    rounded_date = purchase_date.strftime('%Y-%m-%d')
    delta = datetime.today() - purchase_date
    year = delta.days / 360 + 1
    month = delta.days % 360 / 30 + 1

    # Extended intraday if available
    data, _ = ts.get_intraday_extended(symbol, '1min', f'year{int(year)}month{int(month)}')
    # Process csv
    df = pd.DataFrame(data)
    header_row=0
    df.columns = df.iloc[header_row]
    df = df.drop(header_row)
    if rounded_datetime in df.time.values:
        return df.loc[df['time'] == rounded_datetime]['close'].iloc[0]

    # Daily data fallback
    ts = TimeSeries(key=AlphaVantageInfo.api_key)
    data, _ = ts.get_daily_adjusted(symbol, outputsize='full')
    if rounded_date in data:
        return data[rounded_date]['4. close']

    # If all else fails - get the latest data point
    first_key = list(data.keys())[0]
    return data[first_key]['4. close']

def get_stock_value(filename, data_type="daily_adjusted"):
    """
    Load data for stock symbol.
    In future this will be from a DB or the API, for now this loads from file
    so use the data's JSON filename instead
    """
    stockdata, stockmetadata = JSONLoader.load_json(filename)

    result = pd.DataFrame.from_dict(stockdata, orient='index').astype('float')
    result = result.reindex(index=result.index[::-1])
    result.index = pd.to_datetime(result.index)
    return result, stockmetadata

revised_fs_fields = ['stock_name', 'exchange', 'currency', 'yearly_low', 'yearly_high', 'market_cap', 'beta', 'pe_ratio', 'eps', 'dividend_yield']

def get_fundamentals(symbol):
    conn = create_DB_connection()
    cur = conn.cursor(cursor_factory=DictCursor)

    selectQuery = f"SELECT * FROM securities_overviews \
        WHERE stock_ticker='{symbol}'"
    cur.execute(selectQuery)
    query_result = cur.fetchone()
    result = OrderedDict(query_result) if query_result else None
    result = OrderedDict((k, result[k]) for k in revised_fs_fields)

    conn.close()
    return result

def get_income_statement(symbol, num_entries=1):
    conn = create_DB_connection()
    cur = conn.cursor(cursor_factory=DictCursor)

    selectQuery = f"SELECT * FROM income_statements \
        WHERE stock_ticker='{symbol}' \
        ORDER BY fiscal_date_ending DESC LIMIT {num_entries}"
    cur.execute(selectQuery)
    query_results = cur.fetchall()
    result = [OrderedDict(record) for record in query_results]
    for record in result:
        record['fiscal_date_ending'] = str(record['fiscal_date_ending'].isoformat())

    conn.close()
    return result

revised_bs_order = ['fiscal_date_ending', 'total_assets', 'total_curr_assets', 'total_ncurr_assets', 'total_liabilities', 'total_curr_liabilities', 'total_ncurr_liabilities', 'total_equity']

def get_balance_sheet(symbol, num_entries=1):
    conn = create_DB_connection()
    cur = conn.cursor(cursor_factory=DictCursor)

    selectQuery = f"SELECT * FROM balance_sheets \
        WHERE stock_ticker='{symbol}' \
        ORDER BY fiscal_date_ending DESC LIMIT {num_entries}"
    cur.execute(selectQuery)
    query_results = cur.fetchall()
    # result = [dict(record) for record in query_results]
    result = []
    for entry in query_results:
        record = OrderedDict(entry)

        record['total_curr_assets'] = sum([float(record[x]) for x in ['cash_and_short_term_investments', 'current_net_receivables', 'inventory', 'other_current_assets']])
        record['total_ncurr_assets'] = sum([float(record[x]) for x in ['property_plant_equipment', 'goodwill', 'intangible_assets', 'long_term_investments', 'other_non_current_assets']]) # last one is a typo
        record['total_assets'] = record['total_curr_assets'] + record['total_ncurr_assets']

        record['total_curr_liabilities'] = sum([float(record[x]) for x in  ['current_accounts_payable', 'short_term_debt', 'other_current_liabilities']])
        record['total_ncurr_liabilities'] = sum([float(record[x]) for x in ['long_term_debt', 'other_non_current_liabilities']])
        record['total_liabilities'] = record['total_curr_liabilities'] + record['total_ncurr_liabilities']

        record['total_equity'] = sum([float(record[x]) for x in ['retained_earnings', 'total_shareholder_equity']])

        record = OrderedDict((k, record[k]) for k in revised_bs_order)
        record['fiscal_date_ending'] = str(record['fiscal_date_ending'].isoformat())
        result.append(record)
    conn.close()

    return result

def get_cash_flow(symbol, num_entries=1):
    conn = create_DB_connection()
    cur = conn.cursor(cursor_factory=DictCursor)

    selectQuery = f"SELECT * FROM cashflow_statements \
        WHERE stockticker='{symbol}' \
        ORDER BY fiscaldateending DESC LIMIT {num_entries}"
    cur.execute(selectQuery)
    query_results = cur.fetchall()
    result = [OrderedDict(record) for record in query_results]
    for record in result:
        record['fiscal_date_ending'] = str(record['fiscal_date_ending'].isoformat())

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
        result['average_volume'] = round(df.last("365D")['6. volume'].mean(), 0)
    else:
        for field in ['previous_close', 'open', 'day_min', 'day_max',  'year_min', 'year_max', 'volume', 'average_volume']:
            result[field] = 0

    return result

def get_financials_data(symbol, func):
    income_statement = func(symbol)
    if symbol and income_statement:
        data = dumps({
            'status': 200,
            'name': symbol,
            'data': income_statement
        })
    else:
        data = dumps({
            'status:': 404,
            'name': symbol,
            'data': {},
            'error': "Financials data not found"
        })
    return data


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

        if update_stock_required(symbol, data_type="daily_adjusted"):
            retrieve_stock_data(symbol, data_type="daily_adjusted")
        filename = "demo/" + symbol + "_daily_adjusted.json" if symbol else ""
        if os.path.isfile(filename):
            sample_df, sample_metadata = get_stock_value(filename)
            summary = calculate_summary(sample_df)

        if update_stock_required(symbol, data_type="intraday"):
            retrieve_stock_data(symbol, data_type="intraday")
        intr_filename = "demo/" + symbol + "_intraday.json" if symbol else ""
        intraday = {}
        if os.path.isfile(intr_filename):
            intraday, _ = get_stock_value(intr_filename)

        sample_data_close = convert_to_opairs(sample_df, label="4. close")
        sample_data_high = convert_to_opairs(sample_df, label="2. high")
        sample_data_low = convert_to_opairs(sample_df, label="3. low")

        intr_data_close = convert_to_opairs(intraday, label="4. close")
        stock_name = funds['stock_name']

        data = dumps({
            'status': 200,
            'name': stock_name,
            'data': {
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
            }
        })
    else:
        data = dumps({
            'status': 404,
            'name': "",
            'data': {},
            'error': "Symbol not found"
        })
    return data

@STOCK_ROUTES.route('/stock/get_prediction_daily', methods=['GET'])
def get_prediction_daily():
    symbol = request.args.get('symbol')

    sample_df = {}
    sample_metadata = {}
    summary = {}

    filename = "demo/" + symbol + "_daily_adjusted.json" if symbol else ""
    if os.path.isfile(filename):
        sample_df, sample_metadata = get_stock_value(filename)
    # TODO: generate values differently based on inference type
    close_data = sample_df["4. close"][-60:].values
    for i in np.where(np.isnan(close_data))[0]:
        close_data[i] = close_data[i-1] if not np.isnan(close_data[i-1]) else 0

    data = {"inference_mode": "walk_forward", "data": close_data.tolist()}
    headers = { "Content-Type": "application/json", }
    endpoint = f"http://127.0.0.1:{3001}/model/api/get_prediction"

    status = 0
    dispatch_data = {}
    try:
        r = requests.post(url=endpoint, data=dumps(data), headers=headers)

        # TODO: cleanup processing, this is really ugly.
        # Ideally auto-limit sequence sizes
        prediction_result = []
        if r.status_code == requests.codes.ok:
            prediction_result = r.json()
        prediction_data = np.array(prediction_result['data'])
        if prediction_data.shape[0] > 60:
            prediction_data = prediction_data[:60]

        prediction_start = sample_df["4. close"][-1:].index
        # print("Start: ", prediction_start, type(prediction_start))
        prediction_end = prediction_start + pd.tseries.offsets.BDay(60)
        # print("End: ", prediction_end, type(prediction_end))

        prediction_range = (pd.date_range(start=prediction_start.array[0], end=prediction_end.array[0], freq="B") - pd.Timestamp("1970-01-01")) // pd.Timedelta(milliseconds=1)
        if prediction_range.shape[0] > 60:
            prediction_range = prediction_range[:60]

        prediction_data_s = [[int(timestamp), value] for timestamp, value in zip(prediction_range.tolist(), prediction_data)]

        status = 200
        dispatch_data = {
            'name': "Prediction (daily)",
            'data': prediction_data_s
        }
    except Exception as e:
        status = 500
        dispatch_data = {}

    return dumps({
        'status': status,
        'data': dispatch_data
    })

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
