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

from train import preprocessing

app = Flask(__name__)


with open("./model.yaml", "r") as stream:
    config = yaml.safe_load(stream)

with open(config["model"]["save_model_name"], "rb") as stream:
    svm = pickle.load(stream)

def make_forecast(model, x_input):
    x_input = x_input.reshape((x_input.shape[0], 1))
    y_pred = model.predict(x_input)
    return y_pred

@app.route("/status")
def index():
    return {"status": "ready"}

@app.route("/model/api/get_prediction", methods=["POST"])
def get_prediction():
    request_data = request.get_json()
    initial_data = np.array(request_data['data'])
    print(initial_data)

    if len(initial_data.shape) > 1:
        result = {"error": f"Data received is {len(initial_data.shape[0])}-dimensional but data sequence must be 1-dimensional"}
        return result
    if not initial_data.dtype in [np.dtype('int'), np.dtype('float')]:
        result = {"error": f"Data received is of type {initial_data.dtype} but data sequence must be of type int or float"}
        return result
    data_length = initial_data.shape[0]

    try:
        data = make_forecast(svm, initial_data)
        data = data.tolist()
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
