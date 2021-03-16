CREATE TABLE IF NOT EXISTS Portfolio (
    PortfolioName VARCHAR(30),
    UserID INT,
    PRIMARY KEY(PortfolioName, UserID)
);