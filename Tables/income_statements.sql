CREATE TABLE IF NOT EXISTS income_statements (
    stock_ticker VARCHAR(10) REFERENCES securities_overviews(stock_ticker),
    fiscal_date_ending DATE,
    total_revenue BIGINT,
    cost_of_revenue BIGINT,
    gross_profit BIGINT,
    operating_expenses BIGINT,
    operating_income BIGINT,
    income_before_tax BIGINT,
    interest_income BIGINT,
    net_interest_income BIGINT,
    ebit BIGINT,
    ebitda BIGINT,
    net_income BIGINT,
    PRIMARY KEY (stock_ticker, fiscal_date_ending)
);
