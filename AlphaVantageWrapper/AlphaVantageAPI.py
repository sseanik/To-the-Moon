import sys
import json
import requests
from datetime import date

class AlphaVantageAPI:
    """
    Wrapper to construct AlphaVantage URLs, send HTTP queries and receive HTTP
        responses, and perform IO with results.
    Also contains base url for AlphaVantage endpoints and API key.
    Docs: https://www.alphavantage.co/documentation/
    TODO: Store and load API key from ENV file
    """
    base_url = "https://www.alphavantage.co/query?"
    api_key = "1PRBO66RYM7SV7B9"

    @classmethod
    def _construct_url(cls, *args, **kwargs):
        param_string = ''
        for k in kwargs:
            param_string += '&{}={}'.format(k, kwargs[k])
        return cls.base_url + 'function={}'.format(args[0]) \
            + param_string + '&apikey={}'.format(cls.api_key)

    @staticmethod
    def _get_query(url, proxies={}, headers={}):
        response = requests.get(url, proxies=proxies, headers=proxies)
        return response.json()


class JSONLoader:
    @staticmethod
    def save_json(company_name, data, label=""):
        # with open(f'./{company_name}_{label}_{date.today().strftime("%Y%m%d")}.json', 'w') as outfile:
        filename = f'./{company_name}_{label}.json' if label \
            else f'./{company_name}.json'
        with open(filename, 'w') as outfile:
            json.dump(data, outfile)

    @staticmethod
    def load_json(filename):
        with open(filename, 'r') as infile:
            data, metadata = json.load(infile)
            return data, metadata

    pass

class TimeSeries:
    """
    Wrapper for time series endpoints
    """
    @staticmethod
    def _construct_intraday(symbol, interval, **kwargs):
        return AlphaVantageAPI._construct_url("TIME_SERIES_INTRADAY", \
            symbol=symbol, interval=interval, **kwargs)

    @staticmethod
    def _construct_daily_adjusted(symbol, **kwargs):
        return _construct_url("TIME_SERIES_DAILY_ADJUSTED", \
            symbol=symbol, **kwargs)

    def get_intraday(self, symbol, interval, **kwargs):
        url = TimeSeries._construct_intraday(symbol, interval, **kwargs)
        return AlphaVantageAPI._get_query(url)

    def get_daily_adjusted(symbol, **kwargs):
        url = TimeSeries._construct_daily_adjusted(symbol, **kwargs)
        return AlphaVantageAPI._get_query(url)

    pass


if __name__ == "__main__":
    # Test the wrapper
    ts = TimeSeries()
    gme = ts.get_intraday("GME", "5min", outputsize="full")

    AlphaVantageAPI.save_json("GME", gme, label="intraday")
