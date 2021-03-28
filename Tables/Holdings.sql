CREATE TABLE IF NOT EXISTS Holdings (
    InvestmentID TEXT NOT NULL DEFAULT uuid_generate_v1() PRIMARY KEY,
    UserID TEXT,
    PortfolioName VARCHAR(30),
    PurchasePrice MONEY, 
    NumShares INT, 
    PurchaseDate DATE, 
    StockTicker VARCHAR(10)
);