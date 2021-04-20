import json
import numpy as np
import matplotlib.pyplot as plt
import pandas as pd

from keras.models import Sequential
from keras.layers import Dense
from keras.layers import LSTM
from keras.layers import Dropout

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

def data_to_supervised_multistep(data, n_steps_in=60, n_steps_out=1):
    X_train = []
    y_train = []
    for i in range(n_steps_in, train_cutoff):
        X_train.append(data[i-n_steps_in:i, 0])
        y_train.append(data[i, 0])
    X_train, y_train = np.array(X_train), np.array(y_train)

company_data, company_metadata = JSONLoader.load_json("sample_data/IBM_daily_adjusted.json")

company_df = pd.DataFrame.from_dict(company_data, orient='index').astype('float')
company_df = company_df.reindex(index=company_df.index[::-1])
company_df.index = pd.to_datetime(company_df.index)
company_df = company_df.asfreq(freq="B")

datasets_to_train = config['data']['columns_to_use']

# Todo: create one dataset per column used
train_cutoff = int(config['training']['train_test_split'] * config['data']['sequence_length'])
training_set = company_df[datasets_to_train[0]].values[:train_cutoff]
test_set = company_df[datasets_to_train[0]].values[train_cutoff:]

X_train, y_train = data_to_supervised_multistep(training_set)
X_test, y_test = data_to_supervised_multistep(test_set)

n_features = config['training']['n_features']
# # Note: use if training a CNN or Conv-LSTM
# n_seq = config['training']['n_seq']
# n_steps_cnn = config['training']['n_steps_cnn']

# # Regular LSTM - [samples, timesteps, features]
X_train = X_train.reshape((X_train.shape[0], X_train.shape[1], n_features))
# # CNN LSTM - [samples, subsequences, timesteps, features]
# X_train = X_train.reshape((X_train.shape[0], n_seq, n_steps_cnn, n_features))
# # Conv LSTM - [samples, timesteps, rows, columns, features]
# X_train = X_train.reshape((X_train.shape[0], n_seq, 1, n_steps_cnn, n_features))

# TODO: generate via model
model = Sequential()

model.add(LSTM(units = 50, return_sequences = True, input_shape = (X_train.shape[1], 1)))
model.add(Dropout(0.2))
model.add(LSTM(units = 50, return_sequences = True))
model.add(Dropout(0.2))
model.add(LSTM(units = 50, return_sequences = True))
model.add(Dropout(0.2))
model.add(LSTM(units = 50))
model.add(Dropout(0.2))
model.add(Dense(units = 1))

model.compile(optimizer = config['model']['optimizer'], loss = config['model']['loss'])

# # Model Parameters
epochs, batch_size = config['training']['epochs'], config['training']['batch_size']
n_timesteps, n_features, n_outputs = X_train.shape[1], X_train.shape[2], 1
model.fit(X_train, y_train, epochs = 100, batch_size = 32)

filename = config['model']['model_save_filename']
model.save(filename)
