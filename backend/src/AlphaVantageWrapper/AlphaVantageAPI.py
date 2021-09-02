import sys
import json
import csv
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
    api_key = "7BTAD2U79MPR388H"

    @classmethod
    def _construct_url(cls, *args, **kwargs):
        param_string = ""
        for k in kwargs:
            param_string += "&{}={}".format(k, kwargs[k])
        return (
            cls.base_url
            + "function={}".format(args[0])
            + param_string
            + "&apikey={}".format(cls.api_key)
        )

    @staticmethod
    def _get_query(url, proxies={}, headers={}):
        response = requests.get(url, proxies=proxies, headers=proxies)
        return response.json()

    @staticmethod
    def save_json(company_name, data, label="generic"):
        with open(
            f'./{company_name}_{label}_{date.today().strftime("%Y%m%d")}.json', "w"
        ) as outfile:
            json.dump(data, outfile)

    @staticmethod
    def load_json(filename):
        with open(filename, "r") as infile:
            data = json.load(infile)
            return data

    pass


class TimeSeries:
    """
    Wrapper for time series endpoints
    """

    @staticmethod
    def _construct_intraday(symbol, interval, **kwargs):
        return AlphaVantageAPI._construct_url(
            "TIME_SERIES_INTRADAY", symbol=symbol, interval=interval, **kwargs
        )

    @staticmethod
    def _construct_daily_adjusted(symbol, **kwargs):
        return AlphaVantageAPI._construct_url(
            "TIME_SERIES_DAILY_ADJUSTED", symbol=symbol, **kwargs
        )

    @staticmethod
    def _construct_company_overview(symbol, **kwargs):
        return AlphaVantageAPI._construct_url("OVERVIEW", symbol=symbol, **kwargs)

    @staticmethod
    def _construct_income_statement(symbol, **kwargs):
        return AlphaVantageAPI._construct_url(
            "INCOME_STATEMENT", symbol=symbol, **kwargs
        )

    @staticmethod
    def _construct_balance_sheet(symbol, **kwargs):
        return AlphaVantageAPI._construct_url("BALANCE_SHEET", symbol=symbol, **kwargs)

    @staticmethod
    def _construct_cash_flow(symbol, **kwargs):
        return AlphaVantageAPI._construct_url("CASH_FLOW", symbol=symbol, **kwargs)

    @staticmethod
    def _construct_global_quote(symbol, **kwargs):
        return AlphaVantageAPI._construct_url("GlOBAL_QUOTE", symbol=symbol, **kwargs)

    def get_intraday(self, symbol, interval, **kwargs):
        url = TimeSeries._construct_intraday(symbol, interval, **kwargs)
        return AlphaVantageAPI._get_query(url)

    def get_daily_adjusted(self, symbol, **kwargs):
        url = TimeSeries._construct_daily_adjusted(symbol, **kwargs)
        return AlphaVantageAPI._get_query(url)

    def get_company_overview(self, symbol, **kwargs):
        url = TimeSeries._construct_company_overview(symbol, **kwargs)
        return AlphaVantageAPI._get_query(url)

    def get_income_statement(self, symbol, **kwargs):
        url = TimeSeries._construct_income_statement(symbol, **kwargs)
        return AlphaVantageAPI._get_query(url)

    def get_balance_sheet(self, symbol, **kwargs):
        url = TimeSeries._construct_balance_sheet(symbol, **kwargs)
        return AlphaVantageAPI._get_query(url)

    def get_cash_flow(self, symbol, **kwargs):
        url = TimeSeries._construct_cash_flow(symbol, **kwargs)
        return AlphaVantageAPI._get_query(url)

    def get_quick_quote(self, symbol, **kwargs):
        url = TimeSeries._construct_global_quote(symbol, **kwargs)
        return AlphaVantageAPI._get_query(url)

    pass


if __name__ == "__main__":
    # Test the wrapper
    ts = TimeSeries()
    # gme = ts.get_intraday("GME", "5min", outputsize="full")
    # AlphaVantageAPI.save_json("GME", gme, label="intraday")

    # ibm = ts.get_intraday("IBM", "5min", outputsize="full")
    # AlphaVantageAPI.save_json("IBM", ibm, label="intraday")

    # aeo = ts.get_intraday("AEO", "5min", outputsize="full")
    # AlphaVantageAPI.save_json("AEO", aeo, label="intraday")
    url = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=IBM&apikey=1PRBO66RYM7SV7B9&outputsize=full&datatype=csv"
    ibm = requests.get(url, proxies={}, headers={})
    ibm = ibm.content.decode("utf-8")
    cr = csv.reader(ibm.splitlines(), delimiter=",")
    # print(list(cr))
    # AlphaVantageAPI.save_json("IBM", ibm, label="daily_adjusted")
    with open(
        f'./IBM_daily_adjusted_full{date.today().strftime("%Y%m%d")}.csv', "w"
    ) as outfile:
        writer = csv.writer(outfile)
        for row in cr:
            writer.writerow(row)
"""
    ibm = ts.get_quick_quote("IBM")
    AlphaVantageAPI.save_json("IBM", ibm, label="quick_quote")

    ibm = ts.get_company_overview("IBM")
    AlphaVantageAPI.save_json("IBM", ibm, label="overview")

    ibm = ts.get_income_statement("IBM")
    AlphaVantageAPI.save_json("IBM", ibm, label="income_statement")

    ibm = ts.get_balance_sheet("IBM")
    AlphaVantageAPI.save_json("IBM", ibm, label="balance_sheet")

    ibm = ts.get_cash_flow("IBM")
    AlphaVantageAPI.save_json("IBM", ibm, label="cash_flow")
"""
