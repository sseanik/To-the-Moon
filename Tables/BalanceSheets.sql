CREATE TABLE IF NOT EXISTS BalanceSheets (
    StockTicker VARCHAR(10),
    FiscalDateEnding TEXT,
    cashAndShortTermInvestments TEXT,
    currentNetReceivables TEXT,
    inventory TEXT,
    otherCurrentAssets TEXT,
    propertyPlantEquipment TEXT,
    goodwill TEXT,
    intangibleAssets TEXT,
    longTermInvestments TEXT,
    otherNonCurrrentAssets TEXT,
    currentAccountsPayable TEXT, 
    shortTermDebt TEXT,
    otherCurrentLiabilities TEXT,
    longTermDebt TEXT,
    otherNonCurrentLiabilities TEXT,
    retainedEarnings TEXT,
    totalShareholderEquity TEXT,
    PRIMARY KEY (StockTicker, fiscalDateEnding)
);