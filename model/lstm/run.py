# # # WORK IN PROGRESS # # #

import sys
import os
import yaml
import json
from math import sqrt
import datetime
from datetime import date

import numpy as np
import pandas as pd

import tensorflow as tf
from keras.models import Sequential
from keras.layers import Dense
from keras.layers import LSTM
from keras.layers import Dropout

from flask import Flask, request

app = Flask(__name__)

with open("./model.yaml", "r") as stream:
    config = yaml.safe_load(stream)

model_filename = config["model"]["save_filename"]
model = tf.keras.models.load_model(model_filename)

def make_forecast(model, x_input, n_entries=1, n_steps=60, n_features=1):
    # print("Prediction shape: ", x_input.shape)
    x_input = x_input.reshape((n_entries, n_steps, n_features))
    # print("Prediction shape: ", x_input.shape)
    y_pred = model.predict(x_input, verbose=0)[0]
    return y_pred

def get_walkforward_prediction(model, initial_data, n_steps=60, max_intervals=120):
    predictions = []
    n_features = initial_data.shape[1] if len(initial_data.shape) >= 2 else 1
    y_data = initial_data[-n_steps:].reshape((1, n_steps, n_features))
    for i in range(max_intervals):
        y_pred = make_forecast(model, y_data, n_entries=1, n_steps=y_data.shape[1])
        predictions.append(y_pred)
        y_data = np.hstack(( y_data[:,1:,:], y_pred.reshape((1, 1, 1)) ))

    predictions = np.array(predictions)
    predictions_c = np.concatenate(predictions)
    return predictions_c

@app.route("/status")
def index():
    return {"status": "ready"}

@app.route("/model/api/get_prediction", methods=["POST"])
def get_prediction():
    request_data = request.get_json()
    # TODO: Options - walk_forward 1-step | 60-step inputs | 60 1-step outputs | 1 prediction n-step
    # TODO: data validation
    inference_mode = request_data['inference_mode']
    initial_data = np.array(request_data['data'])

    result = {}
    if inference_mode == "walk_forward":
        predictions = get_walkforward_prediction(model, initial_data)
        predictions = predictions.tolist()
        result = {"data": predictions}
    else:
        result = {"error": f"Inference mode: {inference_mode} not supported yet"}
    return result

if __name__ == "__main__":
    if "ENVIRONMENT" in os.environ:
        print("ENVIRONMENT")
        if os.environ["ENVIRONMENT"] == "production":
            app.run(port=80, host="0.0.0.0")
        elif os.environ["ENVIRONMENT"] == "local":
            app.run(port=5000, host="0.0.0.0")
    else:
        print("No ENV")
        app.run(port=5000, host="127.0.0.1")
