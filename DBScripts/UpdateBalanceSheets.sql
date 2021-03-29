ALTER TABLE BalanceSheets
    RENAME COLUMN StockTicker TO stock_ticker;

ALTER TABLE BalanceSheets
    RENAME COLUMN fiscalDateEnding TO fiscal_date_ending;

ALTER TABLE BalanceSheets
    RENAME COLUMN cashAndShortTermInvestments TO cash_and_short_term_investments;

ALTER TABLE BalanceSheets
    RENAME COLUMN currentNetReceivables TO current_net_receivables;

ALTER TABLE BalanceSheets
    RENAME COLUMN inventory TO inventory;

ALTER TABLE BalanceSheets
    RENAME COLUMN otherCurrentAssets TO other_current_assets;

ALTER TABLE BalanceSheets
    RENAME COLUMN propertyPlantEquipment TO property_plant_equipment;

ALTER TABLE BalanceSheets
    RENAME COLUMN goodwill TO goodwill;

ALTER TABLE BalanceSheets
    RENAME COLUMN intangibleAssets TO intangible_assets;

ALTER TABLE BalanceSheets
    RENAME COLUMN longTermInvestments TO long_term_investments;

ALTER TABLE BalanceSheets
    RENAME COLUMN otherNonCurrrentAssets TO other_non_current_assets;

ALTER TABLE BalanceSheets
    RENAME COLUMN currentAccountsPayable TO current_accounts_payable;

ALTER TABLE BalanceSheets
    RENAME COLUMN shortTermDebt TO short_term_debt;

ALTER TABLE BalanceSheets
    RENAME COLUMN otherCurrentLiabilities TO other_current_liabilities;

ALTER TABLE BalanceSheets
    RENAME COLUMN longTermDebt TO long_term_debt;

ALTER TABLE BalanceSheets
    RENAME COLUMN otherNonCurrentLiabilities TO other_non_current_liabilities;

ALTER TABLE BalanceSheets
    RENAME COLUMN retainedEarnings TO retained_earnings;

ALTER TABLE BalanceSheets
    RENAME COLUMN totalShareholderEquity TO total_shareholder_equity;
