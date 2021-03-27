CREATE TABLE IF NOT EXISTS SecuritiesOverviews (
    stock_ticker VARCHAR(10) PRIMARY KEY,
    stock_name TEXT,
    stock_description TEXT,
    exchange TEXT,
    currency TEXT,
    yearly_high DECIMAL(20,4),
    yearly_low DECIMAL(20,4),
    market_cap DECIMAL(20,4),
    beta DECIMAL(15,4),
    pe_ratio DECIMAL(15,4),
    eps DECIMAL(15,4),
    dividend_yield DECIMAL(15,4)
);
