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
# TODO: Model dictionary
model = tf.keras.models.load_model(model_filename)

inf_modes = {
    "walk_forward": {"name": "Walk-forward validation", "length": 60},
    "multistep_series": {"name": "Series", "length": 120}
}

def featurise_multistep_series(inf_mode, initial_data, n_steps=60):
    result = []
    for i in range(n_steps, inf_modes[inf_mode]["length"]):
        result.append(initial_data[i-n_steps:i])
    result = np.array(result)
    result = np.reshape(result, (result.shape[0], result.shape[1], 1))
    return result

def featurise_single_series(x_input, n_entries=1, n_steps=60, n_features=1):
    return x_input.reshape((n_entries, n_steps, n_features))

def make_forecast(model, x_input):
    y_pred = model.predict(x_input, verbose=0)
    return y_pred

def get_walkforward_prediction(model, initial_data, n_steps=60, max_intervals=120):
    predictions = []
    n_features = initial_data.shape[1] if len(initial_data.shape) >= 2 else 1
    y_data = initial_data[-n_steps:].reshape((1, n_steps, n_features))
    for i in range(max_intervals):
        y_data = featurise_single_series(y_data, n_entries=1, n_steps=y_data.shape[1])
        y_pred = make_forecast(model)
        y_pred = y_pred[0]
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
    inf_mode = request_data['inference_mode']
    initial_data = np.array(request_data['data'])

    # TODO: For now this endpoint should only support 1-dimensional inputs and form the n-step inputs/outputs internally
    if inf_mode not in inf_modes:
        result = {"error": f"Inference mode: {inf_mode} not supported"}
        return result
    if len(initial_data.shape) > 1:
        result = {"error": f"Data received is {len(initial_data.shape[0])}-dimensional but data sequence must be 1-dimensional"}
        return result
    if not initial_data.dtype in [np.dtype('int'), np.dtype('float')]:
        result = {"error": f"Data received is of type {initial_data.dtype} but data sequence must be of type int or float"}
        return result
    data_length = initial_data.shape[0]

    result = {}
    if inf_mode in inf_modes and data_length >= inf_modes[inf_mode]["length"]:
        req_len = inf_modes[inf_mode]["length"]
        initial_data = initial_data[-req_len:] if data_length > req_len else initial_data
        feed_data = []
        predictions = []
        if inf_mode == "walk_forward":
            feed_data = initial_data
            predictions = get_walkforward_prediction(model, feed_data)
        elif inf_mode == "multistep_series":
            feed_data = featurise_multistep_series(inf_mode, initial_data)
            predictions = make_forecast(model, feed_data)
            predictions = predictions.reshape((predictions.shape[0]))

        predictions = predictions.tolist()
        result = {"data": predictions}
    elif inf_mode in inf_modes and data_length < inf_modes[inf_mode]["length"]:
        result = {"error": f"Data length is {data_length} but required data length for mode \"{inf_modes[inf_mode]['name']}\" is {inf_modes[inf_mode]['length']}"}
    else:
        result = {"error": f"Inference mode \"{inf_mode}\" not supported"}
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
        app.run(port=5001, host="127.0.0.1")
