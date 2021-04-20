####################
#   Stock Module   #
####################


from json import dumps
import sys
import os
from collections import OrderedDict
from datetime import datetime

from flask import request, Response
from flask_restx import Namespace, Resource, abort

import numpy as np
import pandas as pd

import pytz
import requests

from psycopg2.extras import DictCursor
import psycopg2.extensions
from alpha_vantage.timeseries import TimeSeries

from database import create_DB_connection
from helpers import JSONLoader, AlphaVantageInfo, get_local_storage_filepath
from constants.stock_db_schema import (
    summary_bs_components,
    summary_bs_columns,
    revised_bs_order,
)
from models import stock_get_data_parser, stock_get_prediction_parser, stock_get_paper_trade_parser

# from definitions import local_storage_dir

MODELSRVURL = os.getenv("MODELSRVURL")
MODELSRVPORT = os.getenv("MODELSRVPORT")
BACKTRSRVURL = os.getenv("BACKTRSRVURL")
BACKTRSRVPORT = os.getenv("BACKTRSRVPORT")

STOCK_NS = Namespace("stock", "Stock securities")


DEC2FLOAT = psycopg2.extensions.new_type(
    psycopg2.extensions.DECIMAL.values,
    "DEC2FLOAT",
    lambda value, curs: float(value) if value is not None else None,
)
psycopg2.extensions.register_type(DEC2FLOAT)

local_tz = pytz.timezone("Australia/Sydney")

###################################
# Please leave all functions here #
###################################


def update_stock_required(symbol, data_type="daily_adjusted"):
    filename = (
        get_local_storage_filepath(symbol + "_" + data_type + ".json") if symbol else ""
    )
    if not os.path.isfile(filename):
        return True
    else:
        _, stockmetadata = JSONLoader.load_json(filename)
        dt_format = "%Y-%m-%d %H:%M:%S" if data_type == "intraday" else "%Y-%m-%d"
        tz_key = "6. Time Zone" if data_type == "intraday" else "5. Time Zone"
        reference_tz = pytz.timezone(
            stockmetadata[tz_key] if tz_key in stockmetadata else "US/Eastern"
        )
        date_ref = datetime.strptime(stockmetadata["3. Last Refreshed"], dt_format)
        date_ref_aware = reference_tz.localize(date_ref)

        date_today = datetime.today()
        date_today_aware = local_tz.localize(date_today).astimezone(reference_tz)

        date_constraint = (
            date_today_aware.hour >= 4 and date_today_aware.hour < 20
        ) or (date_ref_aware.hour < 20)
        dow_constraint = (
            date_today_aware.weekday() >= 0 and date_today_aware.weekday() <= 4
        )

        # If not inside trading hours move to close of last trading day
        if not (date_constraint and dow_constraint):
            date_today_aware.replace(hour=20, minute=0, second=0)
            if date_today_aware.weekday() > 4:
                date_today_aware.replace(day=date_today_aware.weekday() - 4)

        date_comp = (
            (date_today_aware - date_ref_aware).total_seconds() > 900
            if data_type == "intraday"
            else (date_today_aware - date_ref_aware).days >= 1
        )

        print(
            f"Day difference: {date_today_aware} - {date_ref_aware} = {(date_today_aware-date_ref_aware).days}"
        )
        print(
            f"ID  difference: {date_today_aware} - {date_ref_aware} = {(date_today_aware-date_ref_aware).total_seconds()}"
        )

        # TODO: select based on exchange trading hours
        # TODO: keep last refreshed date

        return date_comp


def retrieve_stock_data(symbol, data_type="daily_adjusted"):
    try:
        ts = TimeSeries(key=AlphaVantageInfo.api_key)
        new_data, new_metadata = (
            ts.get_intraday(symbol, outputsize="full")
            if data_type == "intraday"
            else ts.get_daily_adjusted(symbol, outputsize="full")
        )
        JSONLoader.save_json(symbol, [new_data, new_metadata], label=data_type)
    except ValueError as e:
        print(f"Error encountered: {e}", file=sys.stderr)


def retrieve_stock_price_at_date(symbol, purchase_date):
    ts = TimeSeries(key=AlphaVantageInfo.api_key, output_format="csv")
    rounded_datetime = purchase_date.strftime("%Y-%m-%d %H:%M:00")
    rounded_date = purchase_date.strftime("%Y-%m-%d")
    delta = datetime.today() - purchase_date
    year = delta.days / 360 + 1
    month = delta.days % 360 / 30 + 1

    # Extended intraday if available
    data, _ = ts.get_intraday_extended(
        symbol, "1min", f"year{int(year)}month{int(month)}"
    )
    # Process csv
    df = pd.DataFrame(data)
    header_row = 0
    df.columns = df.iloc[header_row]
    df = df.drop(header_row)
    if rounded_datetime in df.time.values:
        return df.loc[df["time"] == rounded_datetime]["close"].iloc[0]

    # Daily data fallback
    ts = TimeSeries(key=AlphaVantageInfo.api_key)
    data, _ = ts.get_daily_adjusted(symbol, outputsize="full")
    if rounded_date in data:
        return data[rounded_date]["4. close"]

    # If all else fails - get the latest data point
    first_key = list(data.keys())[0]
    return data[first_key]["4. close"]


def get_stock_value(filename, data_type="daily_adjusted"):
    """
    Load data for stock symbol.
    In future this will be from a DB or the API, for now this loads from file
    so use the data's JSON filename instead
    """
    stockdata, stockmetadata = JSONLoader.load_json(filename)

    result = pd.DataFrame.from_dict(stockdata, orient="index").astype("float")
    result = result.reindex(index=result.index[::-1])
    result.index = pd.to_datetime(result.index)
    return result, stockmetadata


revised_fs_fields = [
    "stock_name",
    "exchange",
    "currency",
    "yearly_low",
    "yearly_high",
    "market_cap",
    "beta",
    "pe_ratio",
    "eps",
    "dividend_yield",
]


def get_fundamentals(symbol):
    conn = create_DB_connection()
    cur = conn.cursor(cursor_factory=DictCursor)

    select_query = "SELECT * FROM securities_overviews \
        WHERE stock_ticker=%s"
    cur.execute(select_query, (symbol,))
    query_result = cur.fetchone()
    result = OrderedDict(query_result) if query_result else None
    result = OrderedDict((k, result[k]) for k in revised_fs_fields)

    conn.close()
    return result


def get_income_statement(symbol, num_entries=1):
    conn = create_DB_connection()
    cur = conn.cursor(cursor_factory=DictCursor)

    select_query = "SELECT * FROM income_statements \
        WHERE stock_ticker=%s \
        ORDER BY fiscal_date_ending DESC LIMIT %s"
    cur.execute(
        select_query,
        (
            symbol,
            num_entries,
        ),
    )
    query_results = cur.fetchall()
    result = [OrderedDict(record) for record in query_results]
    for record in result:
        record["fiscal_date_ending"] = str(record["fiscal_date_ending"].isoformat())

    conn.close()
    return result


def get_balance_sheet(symbol, num_entries=1):
    conn = create_DB_connection()
    cur = conn.cursor(cursor_factory=DictCursor)

    select_query = "SELECT * FROM balance_sheets \
        WHERE stock_ticker=%s \
        ORDER BY fiscal_date_ending DESC LIMIT %s"
    cur.execute(
        select_query,
        (
            symbol,
            num_entries,
        ),
    )
    query_results = cur.fetchall()
    # result = [dict(record) for record in query_results]
    result = []
    for entry in query_results:
        record = OrderedDict(entry)

        for column in summary_bs_columns:
            record[column] = sum(
                [float(record[x]) for x in summary_bs_components[column]]
            )

        record = OrderedDict((k, record[k]) for k in revised_bs_order)
        record["fiscal_date_ending"] = str(record["fiscal_date_ending"].isoformat())
        result.append(record)
    conn.close()

    return result


def get_cash_flow(symbol, num_entries=1):
    conn = create_DB_connection()
    cur = conn.cursor(cursor_factory=DictCursor)

    select_query = "SELECT * FROM cashflow_statements \
        WHERE stock_ticker=%s \
        ORDER BY fiscal_date_ending DESC LIMIT %s"
    cur.execute(
        select_query,
        (
            symbol,
            num_entries,
        ),
    )
    query_results = cur.fetchall()
    result = [OrderedDict(record) for record in query_results]
    for record in result:
        record["fiscal_date_ending"] = str(record["fiscal_date_ending"].isoformat())

    conn.close()
    return result


def convert_to_opairs(df, label="4. close"):
    series = df[label].reset_index()
    series["index"] = (
        pd.to_datetime(series["index"]) - pd.Timestamp("1970-01-01")
    ) // pd.Timedelta(milliseconds=1)
    return series.values.tolist()


def calculate_summary(df):
    result = {}
    if type(df) == pd.core.frame.DataFrame and df.shape[0] > 0:
        result["previous_close"] = df.iloc[-2]["4. close"] if df.shape[0] >= 2 else 0
        result["open"] = df.iloc[-1]["1. open"]
        result["day_min"] = df.iloc[-1]["3. low"]
        result["day_max"] = df.iloc[-1]["2. high"]
        result["year_min"] = df.last("365D")["4. close"].min()
        result["year_max"] = df.last("365D")["4. close"].max()
        result["volume"] = df.iloc[-1]["6. volume"]
        result["average_volume"] = round(df.last("365D")["6. volume"].mean(), 0)
    else:
        for field in [
            "previous_close",
            "open",
            "day_min",
            "day_max",
            "year_min",
            "year_max",
            "volume",
            "average_volume",
        ]:
            result[field] = 0

    return result


def get_financials_data(symbol, func):
    income_statement = func(symbol)
    if symbol and income_statement:
        data = {"name": symbol, "data": income_statement}
    else:
        abort(400, "Financials data not found")
    return data


################################
# Please leave all routes here #
################################
@STOCK_NS.route("")
class Stock(Resource):
    # def get_stock_data():
    @STOCK_NS.doc(description="Fetch company stock price data based on Stock Symbol provided. ")
    @STOCK_NS.expect(stock_get_data_parser(STOCK_NS), validate=True)
    @STOCK_NS.response(200, "Successfully fetched stock information")
    @STOCK_NS.response(404, "Stock API Not Available")
    def get(self):
        symbol = request.args.get("symbol")
        data = {"name": "", "data": ""}

        funds = get_fundamentals(symbol)

        if funds:
            sample_df = {}
            sample_metadata = {}
            summary = {}
            # TODO: Check that file exists
            if update_stock_required(symbol, data_type="daily_adjusted"):
                retrieve_stock_data(symbol, data_type="daily_adjusted")
            filename = (
                get_local_storage_filepath(symbol + "_daily_adjusted" + ".json")
                if symbol
                else ""
            )
            if os.path.isfile(filename):
                sample_df, sample_metadata = get_stock_value(filename)
                summary = calculate_summary(sample_df)

            if update_stock_required(symbol, data_type="intraday"):
                retrieve_stock_data(symbol, data_type="intraday")
            intr_filename = (
                get_local_storage_filepath(symbol + "_intraday" + ".json")
                if symbol
                else ""
            )
            intraday = {}
            if os.path.isfile(intr_filename):
                intraday, _ = get_stock_value(intr_filename)

            sample_data_close = convert_to_opairs(sample_df, label="4. close")
            sample_data_high = convert_to_opairs(sample_df, label="2. high")
            sample_data_low = convert_to_opairs(sample_df, label="3. low")

            intr_data_close = convert_to_opairs(intraday, label="4. close")
            stock_name = funds["stock_name"]

            data = {
                "name": stock_name,
                "data": {
                    "data": {
                        "4. close": sample_data_close,
                        "2. high": sample_data_high,
                        "3. low": sample_data_low,
                    },
                    "data_intraday": {
                        "4. close": intr_data_close,
                    },
                    "summary": summary,
                    "fundamentals": funds,
                },
            }
        else:
            abort(404, "Symbol not found")

        return Response(dumps(data), status=200)


@STOCK_NS.route("/get_prediction_daily")
class Daily_Prediction(Resource):
    # def get_prediction_daily():
    @STOCK_NS.doc(description="Fetch stock price prediction data based on Stock Symbol and Model Name (Prediction Type) provided. ")
    @STOCK_NS.expect(stock_get_prediction_parser(STOCK_NS), validate=True)
    @STOCK_NS.response(200, "Successfully fetched stock information")
    @STOCK_NS.response(404, "Stock API Not Available")
    def get(self):
        symbol = request.args.get("symbol")
        prediction_type = request.args.get("prediction_type")
        dispatch_data = {}

        sample_df = {}
        sample_metadata = {}
        summary = {}

        filename = (
            get_local_storage_filepath(symbol + "_daily_adjusted" + ".json")
            if symbol
            else ""
        )

        if os.path.isfile(filename):
            sample_df, sample_metadata = get_stock_value(filename)
        data_needed = 120 if prediction_type == "multistep_series" else 60

        if prediction_type is None or prediction_type not in [
            "walk_forward",
            "multistep_series",
            "cnn",
        ]:
            dispatch_data = {
                "error": f"Prediction type: {prediction_type} not supported"
            }
        elif data_needed > sample_df["4. close"].shape[0]:
            dispatch_data = {
                "error": f"Not enough data available: sample has {sample_df['4. close'].shape[0]} but predictor needs {data_needed}"
            }
        else:
            close_data = sample_df["4. close"][-data_needed:].values
            for i in np.where(np.isnan(close_data))[0]:
                close_data[i] = (
                    close_data[i - 1] if not np.isnan(close_data[i - 1]) else 0
                )

            data = {"inference_mode": prediction_type, "data": close_data.tolist()}
            headers = {
                "Content-Type": "application/json",
            }
            endpoint = f"http://127.0.0.1:{MODELSRVPORT}/model/api/get_prediction"

            try:
                r = requests.post(url=endpoint, data=dumps(data), headers=headers)

                # TODO: cleanup processing, this is really ugly.
                # Ideally auto-limit sequence sizes
                prediction_result = []
                if r.status_code == requests.codes.ok:
                    prediction_result = r.json()
                prediction_data = np.array(prediction_result["data"])
                if prediction_data.shape[0] > 60:
                    prediction_data = prediction_data[:60]

                prediction_start = sample_df["4. close"][-1:].index
                prediction_end = prediction_start + pd.tseries.offsets.BDay(60)

                prediction_range = (
                    pd.date_range(
                        start=prediction_start.array[0],
                        end=prediction_end.array[0],
                        freq="B",
                    )
                    - pd.Timestamp("1970-01-01")
                ) // pd.Timedelta(milliseconds=1)
                if prediction_range.shape[0] > 60:
                    prediction_range = prediction_range[:60]

                prediction_data_s = [
                    [int(timestamp), value]
                    for timestamp, value in zip(
                        prediction_range.tolist(), prediction_data
                    )
                ]

                dispatch_data = {
                    "name": "Prediction (daily)",
                    "data": prediction_data_s,
                }
            except Exception as e:
                abort(500, "")

        return Response(dumps({"data": dispatch_data}), status=200)


@STOCK_NS.route("/income_statement")
class Income_Statement(Resource):
    # def get_income_statement_data():
    @STOCK_NS.doc(description="Fetch company income statement data based on Stock Symbol provided. ")
    @STOCK_NS.expect(stock_get_data_parser(STOCK_NS), validate=True)
    @STOCK_NS.response(200, "Successfully fetched stock information")
    @STOCK_NS.response(404, "Stock API Not Available")
    def get(self):
        symbol = request.args.get("symbol")
        result = get_financials_data(symbol, get_income_statement)
        return Response(dumps(result), status=200)


@STOCK_NS.route("/balance_sheet")
class Balance_Sheet(Resource):
    # def get_balance_sheet_data():
    @STOCK_NS.doc(description="Fetch company balance sheet data based on Stock Symbol provided. ")
    @STOCK_NS.expect(stock_get_data_parser(STOCK_NS), validate=True)
    @STOCK_NS.response(200, "Successfully fetched stock information")
    @STOCK_NS.response(404, "Stock API Not Available")
    def get(self):
        symbol = request.args.get("symbol")
        result = get_financials_data(symbol, get_balance_sheet)
        return Response(dumps(result), status=200)


@STOCK_NS.route("/cash_flow_statement")
class Cash_Flow_Statement(Resource):
    # def get_cash_flow_data():
    @STOCK_NS.doc(description="Fetch company cash flow statement data based on Stock Symbol provided. ")
    @STOCK_NS.expect(stock_get_data_parser(STOCK_NS), validate=True)
    @STOCK_NS.response(200, "Successfully fetched stock information")
    @STOCK_NS.response(404, "Stock API Not Available")
    def get(self):
        symbol = request.args.get("symbol")
        result = get_financials_data(symbol, get_cash_flow)
        return Response(dumps(result), status=200)

@STOCK_NS.route('/get_backtest', methods=['GET'])
class Paper_Trade_Results(Resource):
    @STOCK_NS.doc(description="Run a trading strategy for the selected company and parameters. ")
    @STOCK_NS.expect(stock_get_paper_trade_parser(STOCK_NS), validate=False)
    @STOCK_NS.response(200, "Successfully fetched paper trade")
    @STOCK_NS.response(404, "Paper Trade API Not Available")
    def get(self):
        symbol = request.args.get('symbol')
        initial_cash = request.args.get('initial_cash')
        commission = request.args.get('commission')
        strategy = request.args.get('strategy')
        fromdate = request.args.get('fromdate')
        todate = request.args.get('todate')
        # import pdb; pdb.set_trace()
        status = 200
        dispatch_data = {}
        data = {
            'tickers': [symbol],
            'timeframes': { '1D': 1, },
            'timeframe_units': "Days",
            'initial_cash': float(initial_cash),
            'commission': float(commission),
            'timezone': "US/Eastern",
            'strategy': strategy,
            'fromdate': fromdate,
            'todate': todate,
        }

        headers = { "Content-Type": "application/json", }
        url = BACKTRSRVURL
        port = BACKTRSRVPORT
        endpoint = f"http://{url}:{port}/get_backtest"

        # import pdb; pdb.set_trace()
        try:
            r = requests.post(url=endpoint, data=dumps(data), headers=headers)
            dispatch_data = r.json()
        except Exception as e:
            abort(500, "")

        return Response(dumps({'data': dispatch_data}), status=200)
