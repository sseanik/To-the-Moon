ALTER TABLE CashflowStatements
    RENAME COLUMN StockTicker TO stock_ticker;

ALTER TABLE CashflowStatements
    RENAME COLUMN fiscalDateEnding TO fiscal_date_ending;

ALTER TABLE CashflowStatements
    RENAME COLUMN operatingCashflow TO operating_cash_flow;

ALTER TABLE CashflowStatements
    RENAME COLUMN paymentsForOperatingActivities TO payments_for_operating_activities;

ALTER TABLE CashflowStatements
    RENAME COLUMN changeInOperatingLiabilities TO change_in_operating_liabilities;

ALTER TABLE CashflowStatements
    RENAME COLUMN changeInOperatingAssets TO change_in_operating_assets;

ALTER TABLE CashflowStatements
    RENAME COLUMN depreciationDepletionAndAmortization TO depreciation_depletion_and_amortization;

ALTER TABLE CashflowStatements
    RENAME COLUMN changeInInventory TO change_in_inventory;

ALTER TABLE CashflowStatements
    RENAME COLUMN cashflowFromInvestment TO cashflow_from_investment;

ALTER TABLE CashflowStatements
    RENAME COLUMN cashflowFromFinancing TO cashflow_from_financing;

ALTER TABLE CashflowStatements
    RENAME COLUMN dividendPayout TO dividend_payout;

ALTER TABLE CashflowStatements
    RENAME COLUMN proceedsFromRepurchaseOfEquity TO proceeds_from_repurchase_of_equity; 

ALTER TABLE CashflowStatements
    RENAME COLUMN changeInCashAndCashEquivalents TO change_in_cash_and_cash_equivalents;

ALTER TABLE CashflowStatements
    RENAME COLUMN netIncome TO net_income;
