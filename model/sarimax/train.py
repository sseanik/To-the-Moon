import sys
import os
import yaml
import json
import pickle
from math import sqrt

import pandas as pd
import numpy as np
from alpha_vantage.timeseries import TimeSeries

# import matplotlib.pyplot as plt
import statsmodels.api as sm
from sklearn.metrics import mean_squared_error

with open("./model.yaml", "r") as stream:
    config = yaml.safe_load(stream)

class JSONLoader:
    @staticmethod
    def save_json(company_name, data, label=""):
        filename = f'./demo/{company_name}_{label}.json' if label \
            else f'./demo/{company_name}.json'
        with open(filename, 'w') as outfile:
            json.dump(data, outfile)

    @staticmethod
    def load_json(filename):
        with open(filename, 'r') as infile:
            data, metadata = json.load(infile)
            return data, metadata

    pass
# Alternatively: download from alphavantage and save
company_data, company_metadata = JSONLoader.load_json(config['data']['filename'])

company_df = pd.DataFrame.from_dict(company_data, orient='index').astype('float')
company_df = company_df.reindex(index=company_df.index[::-1])
company_df.index = pd.to_datetime(company_df.index)
company_df = company_df.asfreq(freq="B")

train_cutoff = int(config['training']['train_test_split'] * config['data']['sequence_length'])

y_train = company_df[config['data']['column_to_use']][:train_cutoff]

params = config['model']['params']
sarimax_order = (params['p'], params['d'], params['q'])
sarimax_order_seasonal = (params['p_seas'], params['d_seas'], params['q_seas'], params['num_divs'])

mod = sm.tsa.statespace.SARIMAX(
        y_train,
        order=sarimax_order,
        seasonal_order=sarimax_order_seasonal,
        enforce_stationarity=params['enforce_stationarity'],
        enforce_invertibility=params['enforce_invertibility']
    )

results = mod.fit()

with open(config["model"]["save_model_name"], "wb") as stream:
    pickle.dump(mod, stream)
results.save(config["model"]["save_results_name"])
