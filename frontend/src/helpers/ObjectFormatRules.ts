interface IObjectKeys {
  [key: string]: AttributeValues;
}

interface AttributeValues {
  name: string;
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
  stockname: {name: "Company Name"},
  exchange: {name: "Exchange"},
  currency: {name: "Currency"},
  yearlylow: {name: "Year Low"},
  yearlyhigh: {name: "Year High"},
  marketcap: {name: "Market Capitalisation"},
  beta: {name: "Beta"},
  peratio: {name: "PE Ratio"},
  eps: {name: "EPS"},
  dividendyield: {name: "Dividend Yield"},
};

export const incomeStatementFormatter: IObjectKeys = {
  stockticker: {name: "Company Symbol"},
  fiscaldateending: {name: "Year Ending"},
  totalrevenue: {name: "Total Revenue"},
  costofrevenue: {name: "Cost of Revenue"},
  grossprofit: {name: "Gross Profit"},
  operatingexpenses: {name: "Operating Expenses"},
  operatingincome: {name: "Operating Income"},
  incomebeforetax: {name: "Income Before Tax"},
  interestincome: {name: "Interest Income"},
  netinterestincome: {name: "Net Interest Income"},
  ebit: {name: "EBIT"},
  ebitda: {name: "EBITDA"},
  netincome: {name: "Net Income"},
};

export const balanceSheetFormatter: IObjectKeys = {
  fiscaldateending: {name: "Year Ending"},
  total_assets: {name: "Total Assets"},
  total_curr_assets: {name: "Total Current Assets"},
  total_ncurr_assets: {name: "Total Non-Current Assets"},
  total_liabilities: {name: "Total Liabilities"},
  total_curr_liabilities: {name: "Total Current Liabilities"},
  total_ncurr_liabilities: {name: "Total Non-Current Liabilities"},
  total_equity: {name: "Total Equity"},
};

export const cashFlowStatementFormatter: IObjectKeys = {
  stockticker: {name: "Company Symbol"},
  fiscaldateending: {name: "Year Ending"},
  paymentsforoperatingactivities: {name: "Payments for Operating Activities"},
  operatingcashflow: {name: "Operating Cash Flow"},
  changeinoperatingliabilities: {name: "Change in Operating Liabilities"},
  changeinoperatingassets: {name: "Change in Operating Assets"},
  depreciationdepletionandamortization: {name: "Depreciation Depletion and Amortisation"},
  changeininventory: {name: "Change in Inventory"},
  cashflowfrominvestment: {name: "Cash Flow from Investment"},
  cashflowfromfinancing: {name: "Cash Flow from Financing"},
  dividendpayout: {name: "Dividend Payout"},
  proceedsfromrepurchaseofequity: {name: "Proceeds From Repurchase Of Equity"},
  changeincashandcashequivalents: {name: "Change in Cash"},
  netincome: {name: "Net Income"},
};
