CREATE TABLE IF NOT EXISTS IncomeStatements (
    StockTicker VARCHAR(10),
    FiscalDateEnding TEXT, 
    TotalRevenue TEXT,
    CostOfRevenue TEXT,
    GrossProfit TEXT,
    OperatingExpenses TEXT, 
    OperatingIncome TEXT,
    IncomeBeforeTax TEXT,
    InterestIncome TEXT,
    NetInterestIncome TEXT,
    EBIT TEXT,
    EBITDA TEXT,
    NetIncome TEXT,
    PRIMARY KEY (StockTicker, fiscalDateEnding)
);