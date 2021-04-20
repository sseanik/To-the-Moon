import sys
import os
import yaml
import json
import requests

import numpy as np
import pandas as pd


tickers = ['SPY']
timeframes = {
    '1D':1,
}
tf_units = "Days"
initial_cash = 100000
commission = 0.0
timezone = "US/Eastern"
strategy = "RSIStack"

# fromdate = "2021-01-17"
# todate = "2021-04-07"

fromdate = "2020-05-01"
todate = "2021-04-07"

data = {
    "tickers": tickers,
    "timeframes": timeframes,
    "timeframe_units": tf_units,
    "initial_cash": initial_cash,
    "commission": commission,
    "timezone": timezone,
    "strategy": strategy,
    "fromdate": fromdate,
    "todate": todate
}

headers = { "Content-Type": "application/json", }
address = "127.0.0.1"
port = 5002
endpoint = f"http://{address}:{port}/get_backtest"

r = requests.post(url=endpoint, data=json.dumps(data), headers=headers)

print(f"{r.text}")
print(f"{r.status_code}")
