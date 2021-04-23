# To The Moon 🚀 🌕

## User Documentation/Manual

### Setup

Backend and Frontend compile scripts exist in the root directory of our code. The Prediction Model and Backtesting Services can be run **either** using Docker or Flask.

#### Backend & Frontend
1. Ensure you have python3 version >= 3.7.4 and pip3. Download the appropriate version, if needed, here: https://www.python.org/downloads/ and https://pip.pypa.io/en/stable/installing/ 
2. Ensure you have nvm installed. Download it here: https://github.com/nvm-sh/nvm#installing-and-updating 
3. Run `nvm install v14.15.4` to install node.
4. Run `nvm use` to ensure you are using the correct version of node.
5. Run `npm install -g install npm@7.5.2` to install npm.
6. Run `npm install` to install dependencies.
7. Run `npm install -g serve` to install serve.
8. In the root directory, run `npm run build` to build both frontend and backend.

#### Prediction Model & Backtesting Services - with Docker
1. Ensure you have docker installed. Download it here: https://docs.docker.com/get-docker/ 
2. Download the docker images for Prediction https://unsw-my.sharepoint.com/:u:/g/personal/z5112826_ad_unsw_edu_au/EczkCySKX_tLpcQTAO3o2YkBXn8ovaOdzwiJLRbMO_dAxA?e=7lj7Pl and Backtrading https://unsw-my.sharepoint.com/:u:/g/personal/z5112826_ad_unsw_edu_au/EaSEggHd90JKuGKusyYq80gBoAZIz2HiAzJLmSJJR0qikQ?e=Rk70g2 .
3. Run `docker load < caps_prediction.tar.gz` and `docker load < backtrading.tar.gz` to load the images. Make sure you are using the relative path to the images.

#### Prediction Model & Backtesting Services - as Web Server
1. Ensure you have python3 version >= 3.7.4 and pip3. Download the appropriate version, if needed, here: https://www.python.org/downloads/ and https://pip.pypa.io/en/stable/installing/ 
2. `cd` to the service’s build directory (this is `<repository-path>/model/lstm` for the prediction server and `<repository-path>/trader` for the backtesting server). 
3. Follow instructions here https://virtualenv.pypa.io/en/latest/installation.html to install virtualenv.
4. Run `virtualenv venv` to create a Python virtual environment. Once created, activate with `source venv/bin/activate` (Linux/Mac) or `.\venv\Scripts\activate` (Windows). 
5. Install the prerequisite libraries with `pip3 install -r requirements.txt`. 
6. Repeat for both services, prediction and backtesting. 

### Running the Application

#### Backend & Frontend
1. In the root directory, run `npm run start` to concurrently run the frontend and backend.
2. Visit http://localhost:3000 to start using To The Moon.

#### Prediction Model & Backtesting Services - with Docker
1. Run `docker run -p 3001:5000 -it caps_prediction` to start the prediction model.
2. Run `docker run -p 3002:5000 -it backtrading` to start the backtrader.

#### Prediction Model & Backtesting Services - as Web Server
1. If not already in the `model/lstm` directory, `cd` to that directory and activate the virtual environment.  
2. Run `FLASK_APP=run.py FLASK_ENV=production FLASK_RUN_PORT=3001 flask run` (Linux, Windows Git Bash) to start the prediction model. If on Windows (Powershell), instead run: 
- `$env:FLASK_APP="run.py"`
- `$env:FLASK_ENV="production"`
- `$env:FLASK_RUN_PORT="3001"`
- `flask run`
- Note: Replace `$env:FLASK_APP=”run.py”` with `set FLASK_APP=”run.py”` and so on for the remaining variables if running in CMD. 
3. If not already in the `trader` directory, `cd` to that directory and activate the virtual environment.  
4. In the trader directory run `FLASK_APP=run.py FLASK_ENV=production FLASK_RUN_PORT=3002 flask run` (Linux, Windows Git Bash) to start the prediction model. If on Windows (Powershell), instead run: 
- `$env:FLASK_APP="run.py"`
- `$env:FLASK_ENV="production"`
- `$env:FLASK_RUN_PORT="3002"`
- `flask run`
- Note: Replace `$env:FLASK_APP=”run.py”` with `set FLASK_APP=”run.py”` and so on for the remaining variables if running in CMD. 