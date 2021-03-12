####################
#   Stock Module   #
####################


from flask import Blueprint, request

from json import dumps
import pandas as pd
import os

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
    stockdata, stockmetadata = JSONLoader.load_json(symbol)
    result = pd.DataFrame.from_dict(stockdata, orient='index').astype('float')
    result = result.reindex(index=result.index[::-1])
    result.index = pd.to_datetime(result.index)
    return result, stockmetadata

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
        result['open'] = df.iloc[-1]['1. open'] # get this from the summary/quote endpoint
        # result['bid'] = 0 # Not available
        # result['ask'] = 0 # Not available
        result['day_min'] = df.iloc[-1]['3. low']
        result['day_max'] = df.iloc[-1]['2. high']
        result['year_min'] = df.last("365D")['4. close'].min()
        result['year_max'] = df.last("365D")['4. close'].max()
        result['volume'] = df.iloc[-1]['6. volume']
        result['average_volume'] = df.last("365D")['6. volume'].mean()
    else:
        result['previous_close'] = 0
        result['open'] = 0 # get this from the summary/quote endpoint
        # result['bid'] = 0 # Not available
        # result['ask'] = 0 # Not available
        result['day_min'] = 0
        result['day_max'] = 0
        result['year_min'] = 0
        result['year_max'] = 0
        result['volume'] = 0
        result['average_volume'] = 0

    return result



################################
# Please leave all routes here #
################################
@STOCK_ROUTES.route('/stock', methods=['GET'])
def get_stock_data():
    # an echo route just for testing
    symbol = request.args.get('symbol')
    data = {'name': "", 'data': ""}
    filename = "demo/" + symbol + ".json" if symbol else ""
    if symbol and os.path.isfile(filename):
        sample_df, sample_metadata = get_stock_value(filename)
        summary = calculate_summary(sample_df)
        # sample_df = sample_df.reindex(index=sample_df.index[::-1])
        sample_data_close = convert_to_opairs(sample_df, label="4. close")
        sample_data_high = convert_to_opairs(sample_df, label="2. high")
        sample_data_low = convert_to_opairs(sample_df, label="3. low")
        stock_name = sample_metadata['2. Symbol']

        data = dumps({
            'name': stock_name,
            'data': {
                '4. close': sample_data_close,
                '2. high': sample_data_high,
                '3. low': sample_data_low
            },
            'summary': summary
        })
    else:
        data = dumps({
            'name': "",
            'data': {},
            'error': "Symbol not found"
        })
    return data
