CREATE TABLE IF NOT EXISTS portfolios (
    portfolio_name VARCHAR(30),
    user_id UUID,
    PRIMARY KEY(portfolio_name, user_id)
);
