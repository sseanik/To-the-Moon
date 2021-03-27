CREATE TABLE IF NOT EXISTS IncomeStatements (
    stock_ticker VARCHAR(10) PRIMARY KEY,
    fiscal_date_ending DATE PRIMARY KEY,
    total_revenue INTEGER(20),
    cost_of_revenue INTEGER(20),
    gross_profit INTEGER(20),
    operating_expenses INTEGER(20),
    operating_income INTEGER(20),
    income_before_tax INTEGER(20),
    interest_income INTEGER(20),
    net_interest_income INTEGER(20),
    ebit INTEGER(20),
    ebitda INTEGER(20),
    net_income INTEGER(20),
    -- PRIMARY KEY (stock_ticker, fiscal_date_ending)
);
