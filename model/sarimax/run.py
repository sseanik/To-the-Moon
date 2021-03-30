import sys
import os
import yaml
import json
from math import sqrt
import datetime
from datetime import date

import numpy as np
import pandas as pd
import statsmodels.api as sm

from flask import Flask, request

app = Flask(__name__)

with open("./model.yaml", "r") as stream:
    config = yaml.safe_load(stream)

results = sm.load(config["model"]["save_results_name"])

@app.route("/status")
def index():
    return {"status": "ready"}

@app.route("/model/api/get_prediction", methods=["GET"])
def get_prediction():
    start_dt = request.args.get("start_date")
    end_dt = request.args.get("end_date")
    print(f"{start_dt}, {end_dt}")

    start_dt_o = datetime.datetime.strptime(start_dt, "%Y-%m-%d") \
        if start_dt else None
    end_dt_o = datetime.datetime.strptime(end_dt, "%Y-%m-%d") \
        if end_dt else None
    if not (start_dt and end_dt) or not (start_dt_o and end_dt_o):
        start_dt = date.today().strftime("%Y-%m-%d")
        end_dt = (date.today()
            + datetime.timedelta(days=60)).strftime("%Y-%m-%d")

    print(start_dt, end_dt)
    fore = results.get_prediction(start=pd.to_datetime(start_dt), end=pd.to_datetime(end_dt), dynamic=False)
    try:
        data = fore.predicted_mean.to_list()
    except Exception as e:
        data = []
        print(e)
    return {"data": data}

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
