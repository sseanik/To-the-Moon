# To The Moon 🚀 🌕

## Background

“To The Moon” (TTM) is a web application for stock portfolio management which features machine learning predictive models, social features, news and automated trading. The platform provides users with an intuitive, all-in-one investment application. 

### Aim

“To develop a web application which leverages machine learning methods, social forums, and intuitive UI features, to aid our users in researching, managing, and initiating new investment portfolios.”

### Objectives

* **User profiles**: The system will allow sellers to create user profiles to store personalised content and preferences generated from the use of the system. Users can register for a profile and login to the system with one to use the full selection of the system’s features. 
* **Portfolio management**: The system will allow the creation of portfolios to let users aggregate their investments into a list and monitor their performance. Users can create portfolios and add, edit, delete and view investments. 
* **Visualisation of share information**: The system will display visualisations of share price data that is both interactive and rich.
* **Stock information**: The system will display information related to a stock such as company statistics, company financials and share price/value data. 
* **Investment news and current affairs**: The system will provide financial-related news items for general consumption and for use in analysing a specific company or investment. 
* **Opportunities to find new potential investments**: The system will provide opportunities for users to explore investments that may not be currently held in the user’s portfolio by providing recommendations for new potential investments.  Investment predictions and online trading: The system will allow users to submit stock price data and receive predictions on the future stock price for a selected company. Users will be able to select models to use during prediction and request predictions with provided parameters.
* **Social interaction**: The system will allow users to interact with each other to facilitate meaningful discussion and build knowledge on investing within the community.
Customisable dashboard: The system will provide users with a highly customisable dashboard to track the content that they most care about. The dashboard should support viewing of personal investments, stock graphs and financial news.


## [Live Demo](https://career-fairs-connect.netlify.app/landing)

* The Frontend was built on the React framework. We used React’s Typescript flavour to enforce better code structure and minimise type errors by enforcing explicit data types at compile time.
* Our team also used React-Bootstrap to construct ready-made UI elements for its responsive performance, and Highcharts for visualising stock data due to its native support for graphing time-series financial data. 
* For handling routing within our Single Page Application, we used React Router, which can easily handle nested views and the progressive resolution of views. To predictably handle frontend state within our application, our team used React Redux to centralise state management.

## [Backend Demo](https://tothemoon-api.herokuapp.com/)

* The project implements a Python-based backend and We opted for the Flask application framework due to its accessibility and greater flexibility compared to Django, a more rigid and resource-heavy framework. 
* We opted to use the RestX framework to implement these schemas as it offers a comprehensive selection of data types and integrates well with Swagger, which can automatically generate documentation from the schemas read. 
* The server endpoints and prediction and trading systems are also run as separate microservices to better support upscaling of the application for higher request volumes. 
* Login and authentication functionality was implemented with RFC 7519 JSON web tokens (JWT) as a lightweight alternative to session based (OAuth) authentication. Both offer similar levels of security but JWT is easier to set up and implement for the volume of users intended for testing. 
* The data layer was implemented with a PostgreSQL database. PostgreSQL uses an object relational model which can suitably express the relationship between stocks, portfolios and user interactions and user profiles better than document models. 
* To implement prediction-based features, AI models were built with libraries appropriate to prototype a variety of model types, including ‘scikit-learn’ for traditional machine learning models (SVM regressor), ‘statstools’ for statistical models (ARIMA and derivatives) and ‘Tensorflow’ for deep learning models. 
* The trading simulation and strategy component was implemented with Backtrader using a broker account provided by Alpaca Markets. 

### [Local Setup Guide can be found here](https://github.com/sseanik/To-the-Moon/blob/main/LOCAL_SETUP.md)

## Screenshots

![Trending](https://github.com/sseanik/To-the-Moon/blob/main/screenshots/Trending.png)
![Share Graph](https://github.com/sseanik/To-the-Moon/blob/main/screenshots/SharePrice.png)
![Notes](https://github.com/sseanik/To-the-Moon/blob/main/screenshots/Notes.png)
![Portfolio](https://github.com/sseanik/To-the-Moon/blob/main/screenshots/Portfolio.png)
![News](https://github.com/sseanik/To-the-Moon/blob/main/screenshots/News.png)
![Favourites](https://github.com/sseanik/To-the-Moon/blob/main/screenshots/Favourites.png)
![Screeners](https://github.com/sseanik/To-the-Moon/blob/main/screenshots/Screeners.png)
![Forum](https://github.com/sseanik/To-the-Moon/blob/main/screenshots/Forum.png)

### Email Screenshots

![Welcome Email](https://github.com/sseanik/To-the-Moon/blob/main/screenshots/Email.png)
![Email Update](https://github.com/sseanik/To-the-Moon/blob/main/screenshots/EmailUpdate.png)

## Credit

This application was collaborated in a CS3900 course with myself, [Austin](https://github.com/AJLandry1000000000), [Karim](https://github.com/karim-saad), [Sarah](https://github.com/serahtan) and [Junji](https://github.com/pul-s4r). Our tech stack primarily consists of React for the frontend, Flask for the backend and PostgreSQL for the database. I primarily contributed towards the backend and data layers of this application, focusing on swagger documentation, database management and news related endpoints.
