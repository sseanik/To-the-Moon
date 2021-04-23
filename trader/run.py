import alpaca_backtrader_api as alpaca
import backtrader as bt
import pytz
import pandas as pd
from local_settings import alpaca_paper
from strategies.RSIStack import RSIStack
from strategies.SMACrossOver1 import SMACrossOver1
from strategies.SMACrossOver2 import SMACrossOver2
import datetime
import os
from json import dumps

import math
from flask import Flask, request, Response
from flask_cors import CORS
from flask_restx import Api, fields, Namespace, Resource, abort
from flask_restx.inputs import date_from_iso8601

app = Flask(__name__)
CORS(app)
api = Api(
    app,
    title="To the Moon Paper Trading",
    version="1.0",
    description="A description",
)
PAPER_TRADE_NS = Namespace("get_backtest", "Paper Trading Queries and Results")
api.add_namespace(PAPER_TRADE_NS)

allowed_strats = {"RSIStack": RSIStack, "SMACrossOver1": SMACrossOver1, "SMACrossOver2": SMACrossOver2}

class DictItem(fields.Raw):
    def output(self, key, obj, *args, **kwargs):
        try:
            dct = getattr(obj, self.attribute)
        except AttributeError:
            return {}
        return dct or {}

def paper_trade_params_model(namespace):
    return namespace.model(
        "paper_trades_params",
        {
            "tickers": fields.String(required=True, example="SPY"),
            "timeframes": DictItem(),
            "timeframe_units": fields.String(required=True, example="days"),
            "initial_cash": fields.Float(required=True, example=100000.0),
            "commission": fields.Float(required=True, example=0.0001),
            "timezone": fields.String(required=True, example="US/Eastern"),
            "strategy": fields.String(required=True, example="LSIStack"),
            "fromdate": fields.Date(required=True),
            "todate": fields.Date(required=True),
        },
    )

ALPACA_KEY_ID = alpaca_paper['api_key']
ALPACA_SECRET_KEY = alpaca_paper['api_secret']
ALPACA_PAPER = alpaca_paper['paper_mode']

store = alpaca.AlpacaStore(
    key_id=ALPACA_KEY_ID,
    secret_key=ALPACA_SECRET_KEY,
    paper=ALPACA_PAPER
)

DataFactory = store.getdata

# cerebro.plot(style='candlestick', barup='green', bardown='red')

@app.route("/status")
def index():
    return Response(dumps({"message": "Server up"}), status=200)

# @app.route("/get_backtest", methods=["POST"])
@PAPER_TRADE_NS.route("", methods=["POST"])
class Retrieve_Prediction(Resource):
    @PAPER_TRADE_NS.doc(description="Run financial strategy backtest. ")
    @PAPER_TRADE_NS.expect(paper_trade_params_model(PAPER_TRADE_NS), validate=False)
    @PAPER_TRADE_NS.response(200, "Successfully fetched backtest result")
    @PAPER_TRADE_NS.response(404, "Paper Trading API Not Available")
    def post(self):
        try:
            request_data = request.get_json()
            tickers = request_data['tickers']
            timeframes = request_data['timeframes']
            tf_units = request_data['timeframe_units']
            initial_portfolio_value = request_data['initial_cash']
            timezone = None
            try:
                timezone = pytz.timezone(request_data['timezone'])
            except Exception as e:
                timezone = pytz.timezone('US/Eastern')
            commission = request_data['commission']
            # Todo: add strategy as parameter
            strategy = request_data['strategy']

            # If using default dates, automatically calculate range
            # Default is today to one years prior
            default_dt_from = pd.Timestamp.today() - pd.offsets.DateOffset(years=1)
            default_dt_to = pd.Timestamp.today()
            fromdate = pd.Timestamp(request_data['fromdate']) if request_data['fromdate'] else default_dt_from
            todate = pd.Timestamp(request_data['todate']) if request_data['todate'] else default_dt_to

            # Select strategy and populate run arguments
            # The datastructures selected should allow adding additional strategies and timeframes
            run_strategy = allowed_strats[strategy] if strategy in allowed_strats \
                else RSIStack
            run_strategy_args = {}
            if strategy == "RSIStack":
                run_strategy_args = {"timeframes": timeframes}
            if tf_units == "Days":
                timeframe_units = bt.TimeFrame.Days
            else:
                timeframe_units = bt.TimeFrame.Days

            # Run
            cerebro = bt.Cerebro()
            cerebro.addstrategy(run_strategy, **run_strategy_args)
            cerebro.broker.setcash(initial_portfolio_value)
            cerebro.broker.setcommission(commission=commission)

            if not ALPACA_PAPER:
                print(f"LIVE TRADING")
                broker = store.getbroker()
                cerebro.setbroker(broker)

            for ticker in tickers:
                for timeframe, periods in timeframes.items():
                    print(f'Adding ticker {ticker} using {timeframe} timeframe at {periods} days.')

                    d = DataFactory(
                        dataname=ticker,
                        timeframe=timeframe_units,
                        compression=periods,
                        fromdate=fromdate,
                        todate=todate,
                        historical=True)

                    cerebro.adddata(d)

            print("Running ...")
            results_array = cerebro.run()
            results = results_array[0]

            indicator = results.get_indicator()
            # import pdb; pdb.set_trace()
            indicator = [0 if math.isnan(x) else x for x in indicator]
            timestamps = results.get_timestamps()
            indicator_graph = [list(x) for x in zip(timestamps, indicator)]
            orders = results.get_formatted_trades()
            orders_length = len(orders)
            final_value = cerebro.broker.getvalue() - initial_portfolio_value
            final_value_pct = (final_value) / initial_portfolio_value * 100

            result = {"indicator": [], "orders": orders, "n_orders": orders_length, "change_value": final_value, "change_value_percentage": final_value_pct}
        except Exception as e:
            abort(500, "")

        return Response(dumps(result), status=200)

if __name__ == "__main__":
    if "ENVIRONMENT" in os.environ:
        if os.environ["ENVIRONMENT"] == "production":
            app.run(port=80, host="0.0.0.0")
        elif os.environ["ENVIRONMENT"] == "local":
            app.run(port=5000, host="0.0.0.0")
    else:
        app.run(port=5001, host="127.0.0.1")
