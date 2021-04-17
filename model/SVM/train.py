import time
import numpy as np
import pandas as pd
import pickle
import yaml
import json
from sklearn.svm import SVR, SVC
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split, GridSearchCV, RandomizedSearchCV

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
    svr_rbf = SVR(kernel='rbf', C=2000, degree=1)
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


if __name__ == "__main__":

    start_time = time.time()

    IBM_X, IBM_y = preprocessing("training_json/IBM_daily_adjusted.json")
    NEE_X, NEE_y = preprocessing("training_json/NEE_daily_adjusted.json")
    T_X, T_y = preprocessing("training_json/T_daily_adjusted.json")
    BA_X, BA_y = preprocessing("training_json/BA_daily_adjusted.json")

    X = np.concatenate((IBM_X, NEE_X, T_X, BA_X), axis=0)
    y = np.concatenate((IBM_y, NEE_y, T_y, BA_y), axis=0)

    x_train, x_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

    # random_confidence_check(x_train, y_train)
    # optimal_regularization(x_train, y_train)

    svm = SVR(kernel=config['model']['kernel'], C=config['model']['C'], degree=config['model']['degree'])
    svm.fit(x_train, y_train)

    with open(config["model"]["save_model_name"], "wb") as stream:
        pickle.dump(svm, stream)


    execution_time = (time.time() - start_time)
    print('Execution time in seconds: ' + str(execution_time))