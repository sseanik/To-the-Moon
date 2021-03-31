ALTER TABLE IncomeStatements
    RENAME COLUMN StockTicker TO stock_ticker;

ALTER TABLE IncomeStatements
    RENAME COLUMN FiscalDateEnding TO fiscal_date_ending;

ALTER TABLE IncomeStatements
    RENAME COLUMN TotalRevenue TO total_revenue;

ALTER TABLE IncomeStatements
    RENAME COLUMN CostOfRevenue TO cost_of_revenue;

ALTER TABLE IncomeStatements
    RENAME COLUMN GrossProfit TO gross_profit;

ALTER TABLE IncomeStatements
    RENAME COLUMN OperatingExpenses TO operating_expenses;

ALTER TABLE IncomeStatements
    RENAME COLUMN OperatingIncome TO operating_income;

ALTER TABLE IncomeStatements
    RENAME COLUMN IncomeBeforeTax TO income_before_tax;

ALTER TABLE IncomeStatements
    RENAME COLUMN InterestIncome TO interest_income;

ALTER TABLE IncomeStatements
    RENAME COLUMN NetInterestIncome TO net_interest_income;

ALTER TABLE IncomeStatements
    RENAME COLUMN EBIT TO ebit;

ALTER TABLE IncomeStatements
    RENAME COLUMN EBITDA TO ebitda;

ALTER TABLE IncomeStatements
    RENAME COLUMN NetIncome TO net_income;
