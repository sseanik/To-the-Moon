CREATE TABLE IF NOT EXISTS Notes (
    userid UUID FOREIGN KEY,
    title VARCHAR(300) NOT NULL,
    content VARCHAR(5000),
    stock_symbols TEXT ARRAY,
    portfolio_names TEXT ARRAY,
    external_references TEXT ARRAY,
    internal_references TEXT ARRAY,
    PRIMARY KEY (userid, title)
);

/*
For each stock page, use this to collect all notes associated
* SELECT * FROM NOTES WHERE userid = id AND stock_symbol = ANY(stock_symbols);

* Title cannot be empty
* Everything else can be empty
* stock_symbols ~ e.g. ['TSLA', 'AAPL', 'GOOG']
* portfolio_names ~ e.g. ['Austins Portfolio', 'Seans Portfolio']
* external_references ~ e.g. ['https://stackoverflow.com/questions/39643454/postgres-check-if-array-field-contains-value']
* internal_references ~ e.g. ['{"category": "company", "datetime": 1616460843, "headline": "Volkswagen In The Midst Of Transformation, Reinvention, Crisis, And Opportunity", "id": 64801070, "image": "https://static.seekingalpha.com/cdn/s3/uploads/getty_images/1282330900/medium_image_1282330900.jpg", "related": "TSLA", "source": "seekingalpha.com", "summary": "The latest Annual Media Conference and VW's Power Day gave me a boost in confidence in the company's future prospects.", "url": "https://finnhub.io/api/news?id=1ba42f8d71a825cc8193b2c0b0e03493fe7ed0c9a82cdb7c28c0078690f2c3f4"}']

*/

