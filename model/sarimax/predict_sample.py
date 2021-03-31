import sys
import os
import yaml
import json
import requests

import numpy as np
import pandas as pd

# data = {"start_date": "2021-03-22", "end_date": "2021-06-22"}
data = {}
endpoint = "http://127.0.0.1:3000/model/api/get_prediction"

r = requests.get(url=endpoint, params=data)

print(f"{r.text}")
print(f"{r.status_code}")
