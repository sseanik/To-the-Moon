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
    return series.values.tolist()

sample_df = get_stock_value("./demo/AMZN_daily_adjusted_20210305.json")
sample_df = sample_df.reindex(index=sample_df.index[::-1])
sample_data = convert_to_opairs(sample_df)
stock_name = "AMZN"


################################
# Please leave all routes here #
################################
@STOCK_ROUTES.route('/stock', methods=['GET'])
def get_stock_data():
    # an echo route just for testing
    return dumps({
        'name': stock_name,
        'data': sample_data
    })
