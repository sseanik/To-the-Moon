CREATE TABLE IF NOT EXISTS Portfolios (
    PortfolioName VARCHAR(30),
    UserID TEXT,
    PRIMARY KEY(PortfolioName, UserID)
);