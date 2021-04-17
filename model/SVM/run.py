import sys
import os
import yaml
import json
from math import sqrt
import datetime
from datetime import date
import numpy as np
import pandas as pd
import pickle
from flask import Flask, request
from sklearn.model_selection import train_test_split
from sklearn.svm import SVR, SVC

from train import model_train_and_prediction
app = Flask(__name__)


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

# with open(config["model"]["save_model_name"], "rb") as stream:
#     svm = pickle.load(stream)

def make_forecast(model, x_input):
    x_input = x_input.reshape((x_input.shape[0], 1))
    y_pred = model.predict(x_input)
    return y_pred

def preprocessing(filename):
    company_data, company_metadata = JSONLoader.load_json(filename)

    company_df = pd.DataFrame.from_dict(company_data, orient='index').astype('float')
    company_df = company_df.reindex(index=company_df.index[::-1])
    company_df.index = pd.to_datetime(company_df.index)
    company_df = company_df.asfreq(freq="B")
    company_df = company_df[['5. adjusted close']]

    print(company_df)
    # Create target column
    company_df['prediction'] = company_df[['5. adjusted close']].shift(-config['training']['forecast_out'])
    x_forecast = company_df.drop(['prediction'], 1)
    x_forecast = x_forecast[-config['training']['forecast_out']:]
    x_forecast = x_forecast.fillna(method='ffill')
    x_forecast = x_forecast.fillna(0)

    company_df = company_df[:-config['training']['forecast_out']]


    # Fill NaN values with previous values. If no previous values, fill with 0.
    company_df = company_df.fillna(method='ffill')
    company_df = company_df.fillna(0)

    datasets_to_train = config['train_data']['columns_to_use']
    target = config['train_data']['target']

    X = np.array(company_df.drop(['prediction'], 1))
    y = np.array(company_df['prediction'])
    x_forecast = np.array(x_forecast)
    return X, y, x_forecast



@app.route("/status")
def index():
    return {"status": "ready"}

@app.route("/model/api/get_prediction", methods=["POST"])
def get_prediction():
    request_data = request.get_json()
    initial_data = np.array(request_data['data'])
    symbol = request_data['symbol']
    print(symbol)

    if len(initial_data.shape) > 1:
        result = {"error": f"Data received is {len(initial_data.shape[0])}-dimensional but data sequence must be 1-dimensional"}
        return result
    if not initial_data.dtype in [np.dtype('int'), np.dtype('float')]:
        result = {"error": f"Data received is of type {initial_data.dtype} but data sequence must be of type int or float"}
        return result
    data_length = initial_data.shape[0]

    try:
        # X, y, x_forecast = preprocessing(f"training_json/{symbol}_daily_adjusted.json")
        # x_train, x_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
        # svm = SVR(kernel=config['model']['kernel'], C=config['model']['C'], degree=config['model']['degree'])
        # svm.fit(x_train, y_train)
        # #data = make_forecast(svm, initial_data)
        # data = svm.predict(x_forecast)
        # print(data)
        data = model_train_and_prediction(symbol)
    except Exception as e:
        data = []
        print(e)
    
    return json.dumps({'data' : data})




if __name__ == "__main__":
    if "ENVIRONMENT" in os.environ:
        print("ENVIRONMENT")
        if os.environ["ENVIRONMENT"] == "production":
            app.run(port=80, host="0.0.0.0")
        elif os.environ["ENVIRONMENT"] == "local":
            app.run(port=5000, host="0.0.0.0")
    else:
        print("No ENV")
        app.run(port=3001, host="127.0.0.1")
