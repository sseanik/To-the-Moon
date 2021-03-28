import sys
import os
import yaml
import json
import requests

import numpy as np
import pandas as pd


with open("IBM_daily_adjusted.json", 'r') as infile:
    company_data, company_metadata = json.load(infile)

port = 3000

company_df = pd.DataFrame.from_dict(company_data, orient='index').astype('float')
company_df = company_df.reindex(index=company_df.index[::-1])
company_df.index = pd.to_datetime(company_df.index)
company_df = company_df.asfreq(freq="B")

y_sample = company_df['5. adjusted close'][-60:].values

for i in np.where(np.isnan(y_sample))[0]:
  y_sample[i] = y_sample[i-1] if not np.isnan(y_sample[i-1]) else 0

print("Shape: ", y_sample.shape)
# print("Data: ", json.dumps(y_sample.tolist()))

data = {"inference_mode": "walk_forward", "data": y_sample.tolist()}
headers = { "Content-Type": "application/json", }
# endpoint = "http://127.0.0.1:5000/model/api/get_prediction"
endpoint = f"http://127.0.0.1:{port}/model/api/get_prediction"

print("Data: ", json.dumps(data))

r = requests.post(url=endpoint, data=json.dumps(data), headers=headers)

print(f"{r.text}")
print(f"{r.status_code}")

# # Chain prediction mode
# X_test = []
# for i in range(60, 76):
#     X_test.append(inputs[i-60:i, 0])
# X_test = np.array(X_test)
# X_test = np.reshape(X_test, (X_test.shape[0], X_test.shape[1], 1))
