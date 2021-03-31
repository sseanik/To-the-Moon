CREATE TABLE IF NOT EXISTS cashflow_statements (
    stock_ticker VARCHAR(10) REFERENCES securities_overviews(stock_ticker),
    fiscal_date_ending DATE,
    operating_cash_flow BIGINT,
    payments_for_operating_activities BIGINT,
    change_in_operating_liabilities BIGINT,
    change_in_operating_assets BIGINT,
    depreciation_depletion_and_amortization BIGINT,
    change_in_inventory BIGINT,
    cashflow_from_investment BIGINT,
    cashflow_from_financing BIGINT,
    dividend_payout BIGINT,
    proceeds_from_repurchase_of_equity BIGINT,
    change_in_cash_and_cash_equivalents BIGINT,
    net_income BIGINT,
    PRIMARY KEY (stock_ticker, fiscal_date_ending)
);
