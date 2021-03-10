####################
#   Stock Module   #
####################


from flask import Blueprint

from json import dumps
import pandas as pd

from backend.src.AlphaVantageWrapper.AlphaVantageAPI import JSONLoader

STOCK_ROUTES = Blueprint('stock', __name__)

###################################
# Please leave all functions here #
###################################
def get_stock_value(symbol):
    """
    Load data for stock symbol.
    In future this will be from a DB or the API, for now this loads from file
    so use the data's JSON filename instead
    """
    stockdata = JSONLoader.load_json(symbol)
    return pd.DataFrame.from_dict(stockdata, orient='index').astype('float')

def convert_to_opairs(df, label='4. close'):
    series = df[label].reset_index()
    series['index'] = (pd.to_datetime(series['index']) \
        - pd.Timestamp("1970-01-01")) // pd.Timedelta(milliseconds=1)
    return series.values.tolist()

sample_df = get_stock_value("./demo/AMZN_daily_adjusted_20210305.json")
sample_df = sample_df.reindex(index=sample_df.index[::-1])
sample_data_close = convert_to_opairs(sample_df, label="4. close")
sample_data_high = convert_to_opairs(sample_df, label="2. high")
sample_data_low = convert_to_opairs(sample_df, label="3. low")
stock_name = "AMZN"


################################
# Please leave all routes here #
################################
@STOCK_ROUTES.route('/stock', methods=['GET'])
def get_stock_data():
    # an echo route just for testing
    return dumps({
        'name': stock_name,
        'data': {
            '4. close': sample_data_close,
            '2. high': sample_data_high,
            '3. low': sample_data_low
        }
    })
