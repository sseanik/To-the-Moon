CREATE TABLE IF NOT EXISTS CashflowStatements (
    StockTicker VARCHAR(10),
    FiscalDateEnding TEXT, 
    operatingCashflow TEXT,
    paymentsForOperatingActivities TEXT,
    changeInOperatingLiabilities TEXT,
    changeInOperatingAssets TEXT,
    depreciationDepletionAndAmortization TEXT, 
    changeInInventory TEXT,
    cashflowFromInvestment TEXT,
    cashflowFromFinancing TEXT,
    dividendPayout TEXT,
    proceedsFromRepurchaseOfEquity TEXT,
    changeInCashAndCashEquivalents TEXT,
    netIncome TEXT,
    PRIMARY KEY (StockTicker, fiscalDateEnding)
);