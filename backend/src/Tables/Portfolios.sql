CREATE TABLE IF NOT EXISTS Portfolios (
    portfolio_name VARCHAR(30),
    user_id TEXT,
    PRIMARY KEY(portfolio_name, user_id)
);
