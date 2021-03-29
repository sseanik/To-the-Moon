CREATE TABLE IF NOT EXISTS portfolios (
    portfolio_name VARCHAR(30),
    user_id uuid,
    PRIMARY KEY(portfolio_name, user_id)
);
