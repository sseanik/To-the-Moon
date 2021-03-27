CREATE TABLE IF NOT EXISTS CashflowStatements (
    stock_ticker VARCHAR(10) PRIMARY KEY,
    fiscal_date_ending PRIMARY KEY,
    operating_cash_flow INTEGER(20),
    payments_for_operating_activities INTEGER(20),
    change_in_operating_liabilities INTEGER(20),
    change_in_operating_assets INTEGER(20),
    depreciation_depletion_and_amortization INTEGER(20),
    change_in_inventory INTEGER(20),
    cashflow_from_investment INTEGER(20),
    cashflow_from_financing INTEGER(20),
    dividend_payout INTEGER(20),
    proceeds_from_repurchase_of_equity INTEGER(20),
    change_in_cash_and_cash_equivalents INTEGER(20),
    net_income INTEGER(20),
    -- PRIMARY KEY (stock_ticker, fiscal_date_ending)
);
