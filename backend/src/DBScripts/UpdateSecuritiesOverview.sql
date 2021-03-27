ALTER TABLE SecuritiesOverviews
    RENAME COLUMN StockTicker TO stock_ticker;

ALTER TABLE SecuritiesOverviews
    RENAME COLUMN StockName TO stock_name;

ALTER TABLE SecuritiesOverviews
    RENAME COLUMN StockDescription TO stock_description;

ALTER TABLE SecuritiesOverviews
    RENAME COLUMN Exchange TO exchange;

ALTER TABLE SecuritiesOverviews
    RENAME COLUMN Currency TO currency;

ALTER TABLE SecuritiesOverviews
    RENAME COLUMN YearlyHigh TO yearly_high;

ALTER TABLE SecuritiesOverviews
    RENAME COLUMN YearlyLow TO yearly_low;

ALTER TABLE SecuritiesOverviews
    RENAME COLUMN MarketCap TO market_cap;

ALTER TABLE SecuritiesOverviews
    RENAME COLUMN BETA TO beta;

ALTER TABLE SecuritiesOverviews
    RENAME COLUMN PERatio TO pe_ratio;

ALTER TABLE SecuritiesOverviews
    RENAME COLUMN EPS TO eps;

ALTER TABLE SecuritiesOverviews
    RENAME COLUMN DividendYield TO dividend_yield;
