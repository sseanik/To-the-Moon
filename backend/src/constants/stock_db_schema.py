from collections import OrderedDict

summary_bs_components = OrderedDict({
    'total_curr_assets': ['cash_and_short_term_investments', 'current_net_receivables', 'inventory', 'other_current_assets'],
    'total_ncurr_assets': ['property_plant_equipment', 'goodwill', 'intangible_assets', 'long_term_investments', 'other_non_current_assets'],
    'total_assets': ['cash_and_short_term_investments', 'current_net_receivables', 'inventory', 'other_current_assets', 'property_plant_equipment', 'goodwill', 'intangible_assets', 'long_term_investments', 'other_non_current_assets'],

    'total_curr_liabilities': ['current_accounts_payable', 'short_term_debt', 'other_current_liabilities'],
    'total_ncurr_liabilities': ['long_term_debt', 'other_non_current_liabilities'],
    'total_liabilities': ['current_accounts_payable', 'short_term_debt', 'other_current_liabilities', 'long_term_debt', 'other_non_current_liabilities'],

    'total_equity': ['retained_earnings', 'total_shareholder_equity']
})
summary_bs_columns = ['total_assets', 'total_curr_assets', 'total_ncurr_assets', 'total_liabilities', 'total_curr_liabilities', 'total_ncurr_liabilities', 'total_equity']

revised_bs_order = ['fiscal_date_ending'] + summary_bs_columns
