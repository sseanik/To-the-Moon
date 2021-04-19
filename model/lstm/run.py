# # # WORK IN PROGRESS # # #

import sys
import os
import yaml
import json
from math import sqrt
import datetime
from datetime import date
import pickle
import os
from json import dumps

import numpy as np
import pandas as pd

import tensorflow as tf
from keras.models import Sequential
from keras.layers import Dense
from keras.layers import LSTM
from keras.layers import Dropout

from sklearn.preprocessing import MinMaxScaler

from flask import Flask, request, Response
from flask_cors import CORS
from flask_restx import Api, fields, Namespace, Resource, abort
from flask_restx.inputs import date_from_iso8601

app = Flask(__name__)
CORS(app)
api = Api(
    app,
    title="To the Moon Stock Price Prediction",
    version="1.0",
    description="Predicts stock prices given an initial input and returns prediction results",
)
PREDICTION_DAILY_NS = Namespace("model", "Prediction Queries and Results")
api.add_namespace(PREDICTION_DAILY_NS)

def prediction_daily_params_model(namespace):
    return namespace.model(
        "prediction_daily_params",
        {
            "inference_mode": fields.String(required=True),
            "data": fields.List(fields.Float, required=True),
            "orig_data_min": fields.Float(required=False),
            "orig_data_max": fields.Float(required=False),
        },
    )

with open("./model.yaml", "r") as stream:
    config = yaml.safe_load(stream)

models = {}
models_info = config["models"]
for k in models_info.keys():
     filename = models_info[k]["save_filename"]
     models[k] = tf.keras.models.load_model(filename)

inf_modes = config["prediction_modes"]

model_cnn_normaliser = MinMaxScaler(feature_range=(0,1))
normaliser_initial = np.zeros((60, 1))
normaliser_initial[0,0] = 35.1228303438
normaliser_initial[59,0] = 159.577350449
model_cnn_normaliser.fit(normaliser_initial)

def featurise_multistep_series(inf_mode, initial_data, n_steps=60):
    """Transforms a (n_steps) shape array into a (n_steps, n_series, 1) shape array.
        Args:
            inf_mode (str): Inference mode (used to determine length as per data in inf_modes).
            initial_data (numpy.ndarray): Initial data sequence ([d_0, d_1, d_2, ..., d_60]).
            n_steps (int): number of steps in one set of data.
        Return:
            result (numpy.ndarray): Transformed data sequence.
            e.g. ([[[d_0], [d_1], [d_2]], [[d_3], [d_4], [d_5]], [ ..., [d_60]]])
    """
    result = []
    for i in range(n_steps, inf_modes[inf_mode]["length"]):
        result.append(initial_data[i-n_steps:i])
    result = np.array(result)
    result = np.reshape(result, (result.shape[0], result.shape[1], 1))
    return result

def featurise_single_series(x_input, n_entries=1, n_steps=60, n_features=1):
    """Transforms a (length) shape array into a (length, 1, 1) shape array.
    Args:
        x_input (numpy.ndarray): Initial data sequence ([d_0, d_1, d_2, ..., d_60]).
        n_entries (int): number of data points to produce.
        n_steps (int): number of steps in one point of data.
        n_features (int): number of features to generate (1).
    Return:
        result (numpy.ndarray): Transformed data sequence.
        e.g. ([[[d_0], [d_1], [d_2], ..., [d_60]]])
    """
    return x_input.reshape((n_entries, n_steps, n_features))

def featurise_cnn(x_input, n_entries=1, n_steps=60, n_seq=2, n_features=1):
    """Transforms a (length) shape array into a (length, n_sequences, n_steps_per_subsequence, n_features) shape array.
    Args:
        x_input (numpy.ndarray): Initial data sequence ([d_0, d_1, d_2, ..., d_60]).
        n_entries (int): number of data points to produce.
        n_steps (int): number of steps in one point of data.
        n_seq (int): number of subsequences per point of data (divide n_steps by n_seq to get number of steps per subsequence)
        n_features (int): number of features to generate (1).
    Return:
        result (numpy.ndarray): Transformed data sequence.
        e.g. ([[[d_0], [d_1], [d_2], ..., [d_30]], [[d_31], ..., [d_60]]])
    """
    n_steps_cnn = int(n_steps/n_seq)
    return x_input.reshape((n_entries, n_seq, n_steps_cnn, n_features))

def make_forecast(model, x_input):
    """Runs prediction on model given the x_input data sequence.
    Args:
        model (tf.keras.Sequential): Model to make prediction with.
        x_input (numpy.ndarray): Transformed data sequence appropriate for model type.

    Return:
        result (numpy.ndarray): Prediction sequence.
        e.g. ([[[p_0], [p_1], [p_2], ..., [p_60]]])
    """
    y_pred = model.predict(x_input, verbose=0)
    return y_pred

def get_walkforward_prediction(model, initial_data, n_steps=60, max_intervals=120):
    """Given an (n_steps) shape array, transform/featurise the last n_steps points, run the prediction, then pop the first point in the array and append the prediction. Continue until the number of desired predictions in made.
    Args:
        model (tf.keras.Sequential): Model to make prediction with.
        initial_data (numpy.ndarray): Initial data sequence ([d_0, d_1, d_2, ..., d_60]).
        n_steps (int): number of steps in one set of data.
        max_intervals (int): number of predictions to make.
    Return:
        result (numpy.ndarray): Prediction sequence.
    """
    predictions = []
    n_features = initial_data.shape[1] if len(initial_data.shape) >= 2 else 1
    y_data = featurise_single_series(initial_data[-n_steps:], n_entries=1, n_steps=n_steps, n_features=1)
    for i in range(max_intervals):
        y_data = featurise_single_series(y_data, n_entries=1, n_steps=y_data.shape[1])
        y_pred = make_forecast(model, y_data)
        y_pred = y_pred[0]
        predictions.append(y_pred)
        y_data = np.hstack(( y_data[:,1:,:], y_pred.reshape((1, 1, 1)) ))

    predictions = np.array(predictions)
    predictions_c = np.concatenate(predictions)
    predictions_c *= initial_data[-1:]/predictions_c[0]
    return predictions_c

def get_walkforward_cnn(model, initial_data, n_steps=60, n_seq=2, max_intervals=120):
    """As per get_walkforward_prediction but apply the transform for data to be read by convolutional type networks.
    Args:
        model (tf.keras.Sequential): Model to make prediction with.
        initial_data (numpy.ndarray): Initial data sequence ([d_0, d_1, d_2, ..., d_60]).
        n_steps (int): number of steps in one set of data.
        n_seq (int): number of subsequences in one point of data.
        max_intervals (int): number of predictions to make.
    Return:
        result (numpy.ndarray): Prediction sequence.
    """
    initial_data = model_cnn_normaliser.transform(initial_data.reshape(-1, 1))
    predictions = []
    x_data_i = featurise_single_series(initial_data[-n_steps:], n_entries=1, n_steps=n_steps, n_features=1)
    for i in range(max_intervals):
        x_data = featurise_cnn(np.copy(x_data_i), n_entries=1, n_steps=n_steps, n_seq=n_seq, n_features=1)
        y_pred = model.predict(x_data)
        predictions.append(y_pred)
        x_data_i = np.hstack(( x_data_i[:,1:,:], y_pred.reshape((1, 1, 1)) ))
    predictions = np.array(predictions)
    predictions_c = np.concatenate(predictions)
    predictions_c = model_cnn_normaliser.inverse_transform(predictions_c).reshape(-1)
    return predictions_c

def get_multistep_vanilla(model, inf_mode, initial_data):
    """As per get_walkforward_prediction but apply a direct/minimal transform to the data (where the shape is known in advance).
    Args:
        model (tf.keras.Sequential): Model to make prediction with.
        inf_mode (str): Inference mode (used to determine length as per data in inf_modes).
        initial_data (numpy.ndarray): Initial data sequence ([d_0, d_1, d_2, ..., d_60]).
    Return:
        result (numpy.ndarray): Prediction sequence.
    """
    feed_data = featurise_multistep_series(inf_mode, initial_data)
    predictions = make_forecast(model, feed_data)
    predictions = predictions.reshape((predictions.shape[0]))
    return predictions

@app.route("/status")
def index():
    return {"status": "ready"}

# @app.route("/model/api/get_prediction", methods=["POST"])
@PREDICTION_DAILY_NS.route("/api/get_prediction", methods=["POST"])
class Retrieve_Prediction(Resource):
    @PREDICTION_DAILY_NS.doc(description="Run stock price prediction algorithm. ")
    @PREDICTION_DAILY_NS.expect(prediction_daily_params_model(PREDICTION_DAILY_NS), validate=True)
    @PREDICTION_DAILY_NS.response(200, "Successfully fetched prediction")
    @PREDICTION_DAILY_NS.response(404, "Prediction API Not Available")
    def post(self):
        result = {}
        try:
            request_data = request.get_json()
            inf_mode = request_data['inference_mode']
            initial_data = np.array(request_data['data'])
            # Rescale data
            normaliser_initial[0,0] = request_data['orig_data_min']
            normaliser_initial[59,0] = request_data['orig_data_max']
            model_cnn_normaliser.fit(normaliser_initial)

            # This endpoint accepts 1-dimensional inputs and forms the n-step inputs/outputs internally
            if inf_mode not in inf_modes:
                abort(500, f"Inference mode: {inf_mode} not supported")
            if len(initial_data.shape) > 1:
                abort(500, f"Data received is {len(initial_data.shape[0])}-dimensional but data sequence must be 1-dimensional")
            if not initial_data.dtype in [np.dtype('int'), np.dtype('float')]:
                abort(500, f"Data received is of type {initial_data.dtype} but data sequence must be of type int or float")
            data_length = initial_data.shape[0]

            result = {}
            # Select between inference modes and run prediction
            if inf_mode in inf_modes and data_length >= inf_modes[inf_mode]["length"]:
                req_len = inf_modes[inf_mode]["length"]
                initial_data = initial_data[-req_len:] if data_length > req_len else initial_data
                predictions = []
                if inf_mode == "walk_forward":
                    predictions = get_walkforward_prediction(models["lstm_vanilla"], initial_data)
                elif inf_mode == "multistep_series":
                    predictions = get_multistep_vanilla(models["lstm_vanilla"], inf_mode, initial_data)
                elif inf_mode == "cnn":
                    predictions = get_walkforward_cnn(models["lstm_cnn"], initial_data)

                predictions = predictions.tolist()
                result = {"data": predictions}
            elif inf_mode in inf_modes and data_length < inf_modes[inf_mode]["length"]:
                abort(500, f"Data length is {data_length} but required data length for mode \"{inf_modes[inf_mode]['name']}\" is {inf_modes[inf_mode]['length']}")
            else:
                abort(500, f"Inference mode \"{inf_mode}\" not supported")
        except Exception as e:
            abort(500, e)

        return Response(dumps(result), status=200)

if __name__ == "__main__":
    if "ENVIRONMENT" in os.environ:
        if os.environ["ENVIRONMENT"] == "production":
            app.run(port=80, host="0.0.0.0")
        elif os.environ["ENVIRONMENT"] == "local":
            app.run(port=5000, host="0.0.0.0")
    else:
        app.run(port=5001, host="127.0.0.1")
