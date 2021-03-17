CREATE TABLE IF NOT EXISTS SecuritiesOverviews (
    StockTicker VARCHAR(10) PRIMARY KEY,
    StockName TEXT,
    StockDescription TEXT,
    Exchange TEXT,
    Currency TEXT, 
    YearlyHigh DECIMAL(20,4),
    YearlyLow DECIMAL(20,4),
    MarketCap TEXT,
    BETA DECIMAL(15,4), 
    PERatio DECIMAL(15,4),
    EPS DECIMAL(15,4),
    DividendYield DECIMAL(15,4)
);