import time
import numpy as np
import pandas as pd
import pickle
import yaml
import json
from sklearn.svm import SVR, SVC
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split, GridSearchCV, RandomizedSearchCV
import os

with open("./model.yaml", "r") as stream:
    config = yaml.safe_load(stream)
    


project_base_dir = os.path.abspath("../../")
local_storage_dir = os.path.join(project_base_dir, 'storage')    


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

    @staticmethod
    def load_json_storage(filename):
        filepath = os.path.join(local_storage_dir, filename)
        with open(filepath, 'r') as infile:
            data, metadata = json.load(infile)
            return data, metadata

def preprocessing(filename):
    company_data, company_metadata = JSONLoader.load_json(filename)

    company_df = pd.DataFrame.from_dict(company_data, orient='index').astype('float')
    company_df = company_df.reindex(index=company_df.index[::-1])
    company_df.index = pd.to_datetime(company_df.index)
    company_df = company_df.asfreq(freq="B")
    company_df = company_df[['5. adjusted close']]

    # Create target column
    company_df['prediction'] = company_df[['5. adjusted close']].shift(-config['training']['forecast_out'])
    company_df = company_df[:-60]

    # Fill NaN values with previous values. If no previous values, fill with 0.
    company_df = company_df.fillna(method='ffill')
    company_df = company_df.fillna(0)

    datasets_to_train = config['train_data']['columns_to_use']
    target = config['train_data']['target']

    X = np.array(company_df.drop(['prediction'], 1))
    y = np.array(company_df['prediction'])

    return X, y


def random_confidence_check(x_train, y_train):
    svr_rbf = SVR(kernel=config['model']['kernel'], C=config['model']['C'], degree=config['model']['degree'])
    svr_rbf.fit(x_train, y_train)
    VZ_X, VZ_y = preprocessing("training_json/VZ_daily_adjusted.json")
    VZ_confidence = svr_rbf.score(VZ_X, VZ_y)
    print("VZ confidence: ", VZ_confidence)
    ORCL_X, ORCL_y = preprocessing("training_json/ORCL_daily_adjusted.json")
    ORCL_confidence = svr_rbf.score(ORCL_X, ORCL_y)
    print("ORCL confidence: ", ORCL_confidence)
    TM_X, TM_y = preprocessing("training_json/TM_daily_adjusted.json")
    TM_confidence = svr_rbf.score(TM_X, TM_y)
    print("TM confidence: ", TM_confidence)
    UNH_X, UNH_y = preprocessing("training_json/UNH_daily_adjusted.json")
    UNH_confidence = svr_rbf.score(TM_X, TM_y)
    print("UNH confidence: ", UNH_confidence)


def optimal_regularization(x_train, y_train):
    NEE_X, NEE_y = preprocessing("training_json/NEE_daily_adjusted.json")
    T_X, T_y = preprocessing("training_json/T_daily_adjusted.json")
    ORCL_X, ORCL_y = preprocessing("training_json/ORCL_daily_adjusted.json")
    VZ_X, VZ_y = preprocessing("training_json/VZ_daily_adjusted.json")
    max_ave = float('-inf')
    optimal_c = 500
    for c in range(1200, 1500, 25):
        svr_rbf = SVR(kernel='rbf', C=c, degree=1)
        svr_rbf.fit(x_train, y_train)
        NEE_confidence = svr_rbf.score(NEE_X, NEE_y)
        T_confidence = svr_rbf.score(T_X, T_y)
        ORCL_confidence = svr_rbf.score(ORCL_X, ORCL_y)
        VZ_confidence = svr_rbf.score(VZ_X, VZ_y)
        confidence = [
            NEE_confidence, 
            T_confidence, 
            ORCL_confidence,
            VZ_confidence
            ]
        ave = sum(confidence) / len(confidence)
        if (ave > max_ave):
            max_ave = ave
            optimal_c = c
    print(optimal_c, max_ave)
    return optimal_c


def grid_search(x_train, y_train):
    param_grid = {
        'C' : [2000, 2500, 3000],
        'kernel' : ['rbf'],
        'degree' : [1]
    }
    grid = GridSearchCV(SVR(), param_grid)
    #grid = RandomizedSearchCV(SVR(), param_grid)
    grid.fit(x_train, y_train)
    return grid.best_params_


def model_train_and_prediction(symbol):
    # company_data, company_metadata = JSONLoader.load_json(f"training_json/{symbol}_daily_adjusted.json")
    company_data, company_metadata = JSONLoader.load_json_storage(f"{symbol}_daily_adjusted.json")


    company_df = pd.DataFrame.from_dict(company_data, orient='index').astype('float')
    company_df = company_df.reindex(index=company_df.index[::-1])
    company_df.index = pd.to_datetime(company_df.index)
    company_df = company_df.asfreq(freq="B")
    company_df = company_df[['5. adjusted close']]
    company_df = company_df.fillna(method='ffill')
    company_df = company_df.fillna(0)
    # print(company_df)

    forecast_out = config['training']['forecast_out']
    company_df['prediction'] = company_df[['5. adjusted close']].shift(-config['training']['forecast_out'])
    # print(company_df.tail())

    X = np.array(company_df.drop(['prediction'], 1))
    X = X[:-forecast_out]

    y = np.array(company_df['prediction'])
    y = y[:-forecast_out]

    # split data
    x_train, x_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

    # train model
    svr_rbf = SVR(kernel=config['model']['kernel'], C=config['model']['C'], degree=config['model']['degree'], gamma=config['model']['gamma']) 
    #svr_rbf = SVR(kernel='poly', C=1000, degree=2)

    svr_rbf.fit(x_train, y_train)

    svm_confidence = svr_rbf.score(x_test, y_test)
    print("svm confidence: ", svm_confidence)

    x_forecast = np.array(company_df.drop(['prediction'], 1))[-forecast_out:]
    # print(x_forecast)

    svm_prediction = svr_rbf.predict(x_forecast)
    svm_prediction = list(svm_prediction)
    # print(svm_prediction)
    print(svm_prediction)
    return svm_prediction


if __name__ == "__main__":

    start_time = time.time()
    symbol = 'ORCL'

    model_train_and_prediction(symbol)

    execution_time = (time.time() - start_time)
    print('Execution time in seconds: ' + str(execution_time))
    exit()




    symbol = 'ORCL'
    IBM_X, IBM_y = preprocessing(f"training_json/{symbol}_daily_adjusted.json")
    # NEE_X, NEE_y = preprocessing("training_json/NEE_daily_adjusted.json")
    # T_X, T_y = preprocessing("training_json/T_daily_adjusted.json")
    # BA_X, BA_y = preprocessing("training_json/BA_daily_adjusted.json")

    # X = np.concatenate((IBM_X, NEE_X, T_X, BA_X), axis=0)
    # y = np.concatenate((IBM_y, NEE_y, T_y, BA_y), axis=0)
    X = IBM_X
    y = IBM_y

    x_train, x_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

    #random_confidence_check(x_train, y_train)
    # optimal_regularization(x_train, y_train)

    svm = SVR(kernel=config['model']['kernel'], C=config['model']['C'], degree=config['model']['degree'])
    svm.fit(x_train, y_train)

    # TESTING
    ORCL_X, ORCL_y = preprocessing(f"training_json/{symbol}_daily_adjusted.json")
    ORCL_X = ORCL_X[-60:]
    ORCL_y = ORCL_y[-60:]
    ORCL_pred = svm.predict(ORCL_X)
    for i in range(len(ORCL_X)):
        print("data: ", ORCL_X[i][0], " actual: ", ORCL_y[i], " prediction: ", ORCL_pred[i])

    # with open(config["model"]["save_model_name"], "wb") as stream:
    #     pickle.dump(svm, stream)


    execution_time = (time.time() - start_time)
    print('Execution time in seconds: ' + str(execution_time))