import sys
import json
import requests
from datetime import date

class AlphaVantageInfo:
    """
    Base url for AlphaVantage endpoints and API key.
    Docs: https://www.alphavantage.co/documentation/
    TODO: Store and load API key from ENV file
    """
    base_url = "https://www.alphavantage.co/query?"
    api_key = "1PRBO66RYM7SV7B9"


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
