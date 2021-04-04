interface IObjectKeys {
  [key: string]: AttributeValues;
}

interface AttributeValues {
  name: string;
}

interface IObjectKeysE {
  [key: string]: AttributeValuesE;
}

interface AttributeValuesE {
  name: string;
  format: string;
  indent: number;
}

export const summaryFormatter: IObjectKeys = {
  previous_close: {name: "Previous Close"},
  open: {name: "Open"},
  day_min: {name: "Daily Low"},
  day_max: {name: "Daily High"},
  year_min: {name: "Yearly Low"},
  year_max: {name: "Yearly High"},
  volume: {name: "Volume"},
  average_volume: {name: "Average Volume"},
};

export const fundamentalsFormatter: IObjectKeys = {
  stock_name: {name: "Company Name"},
  exchange: {name: "Exchange"},
  currency: {name: "Currency"},
  yearly_low: {name: "Year Low"},
  yearly_high: {name: "Year High"},
  market_cap: {name: "Market Capitalisation"},
  beta: {name: "Beta"},
  pe_ratio: {name: "PE Ratio"},
  eps: {name: "EPS"},
  dividend_yield: {name: "Dividend Yield"},
};

export const incomeStatementFormatter: IObjectKeys = {
  stock_ticker: {name: "Company Symbol"},
  fiscal_date_ending: {name: "Year Ending"},
  total_revenue: {name: "Total Revenue"},
  cost_of_revenue: {name: "Cost of Revenue"},
  gross_profit: {name: "Gross Profit"},
  operating_expenses: {name: "Operating Expenses"},
  operating_income: {name: "Operating Income"},
  income_before_tax: {name: "Income Before Tax"},
  interest_income: {name: "Interest Income"},
  net_interest_income: {name: "Net Interest Income"},
  ebit: {name: "EBIT"},
  ebitda: {name: "EBITDA"},
  net_income: {name: "Net Income"},
};

export const balanceSheetFormatter: IObjectKeysE = {
  fiscal_date_ending: {name: "Year Ending", format: "bold", indent: 0},
  total_assets: {name: "Total Assets", format: "bold", indent: 0},
  total_curr_assets: {name: "Total Current Assets", format: "normal", indent: 1},
  total_ncurr_assets: {name: "Total Non-Current Assets", format: "normal", indent: 1},
  total_liabilities: {name: "Total Liabilities", format: "bold", indent: 0},
  total_curr_liabilities: {name: "Total Current Liabilities", format: "normal", indent: 1},
  total_ncurr_liabilities: {name: "Total Non-Current Liabilities", format: "normal", indent: 1},
  total_equity: {name: "Total Equity", format: "normal", indent: 0},
};

export const cashFlowStatementFormatter: IObjectKeys = {
  stock_ticker: {name: "Company Symbol"},
  fiscal_date_ending: {name: "Year Ending"},
  payments_for_operating_activities: {name: "Payments for Operating Activities"},
  operating_cash_flow: {name: "Operating Cash Flow"},
  change_in_operating_liabilities: {name: "Change in Operating Liabilities"},
  change_in_operating_assets: {name: "Change in Operating Assets"},
  depreciation_depletion_and_amortization: {name: "Depreciation Depletion and Amortisation"},
  change_in_inventory: {name: "Change in Inventory"},
  cashflow_from_investment: {name: "Cash Flow from Investment"},
  cashflow_from_financing: {name: "Cash Flow from Financing"},
  dividend_payout: {name: "Dividend Payout"},
  proceeds_from_repurchase_of_equity: {name: "Proceeds From Repurchase Of Equity"},
  change_in_cash_and_cash_equivalents: {name: "Change in Cash"},
  net_income: {name: "Net Income"},
};
