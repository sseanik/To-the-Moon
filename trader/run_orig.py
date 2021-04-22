import alpaca_backtrader_api as alpaca
import backtrader as bt
import pytz
import pandas as pd
from local_settings import alpaca_paper
from strategies.RSIStack import RSIStack
from strategies.SMACrossOver2 import SMACrossOver2
import datetime

ALPACA_KEY_ID = alpaca_paper['api_key']
ALPACA_SECRET_KEY = alpaca_paper['api_secret']
ALPACA_PAPER = alpaca_paper['paper_mode']

fromdate = pd.Timestamp(2020,5,1)
todate = pd.Timestamp(2020,8,17)
timezone = pytz.timezone('US/Eastern')
initial_cash = 100000
commission = 0.0

run_strategy = RSIStack

# tickers = ['LIN', 'SPY', 'TSLA']
tickers = ['TSLA']
# tickers = ['SPY']
timeframes = {
    '1D':1,
    # '3D':3,
    # '5D':5,
}
timeframe_units = bt.TimeFrame.Days

# TODO: Add strategy selector
cerebro = bt.Cerebro()
cerebro.addstrategy(run_strategy, timeframes=timeframes)
cerebro.broker.setcash(initial_cash)
cerebro.broker.setcommission(commission=commission)

store = alpaca.AlpacaStore(
    key_id=ALPACA_KEY_ID,
    secret_key=ALPACA_SECRET_KEY,
    paper=ALPACA_PAPER
)

if not ALPACA_PAPER:
    print(f"LIVE TRADING")
    broker = store.getbroker()
    cerebro.setbroker(broker)

DataFactory = store.getdata
history_datas = []

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

rsi = results.get_indicator()
timestamps = results.get_timestamps()
orders = results.get_formatted_trades()


print("Final Portfolio Value: %.2f" % cerebro.broker.getvalue())
# import pdb; pdb.set_trace()
cerebro.plot(style='candlestick', barup='green', bardown='red')

print("Finishing up")
