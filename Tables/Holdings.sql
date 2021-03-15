CREATE TABLE IF NOT EXISTS Holdings (
    InvestmentID UUID NOT NULL DEFAULT uuid_generate_v1() PRIMARY KEY,
    UserID TEXT,
    PortfolioName VARCHAR(30),
    PurchasePrice MONEY, 
    NumShares INT, 
    PurchaseDate DATE, 
    DayChange DECIMAL(10,2),
    TotalChange DECIMAL(10,2),
    StockTicker VARCHAR(10)
);