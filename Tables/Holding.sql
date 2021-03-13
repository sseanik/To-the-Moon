CREATE TABLE IF NOT EXISTS Holdings (
    InvestmentID INT PRIMARY KEY,
    PurchasePrice MONEY, 
    NumShares INT, 
    PurchaseDate DATE, 
    DayChange decimal(5,2),
    ChangeSinceInvestment decimal(5,2),
    SecurityID INT,
    PortfolioID INT
);