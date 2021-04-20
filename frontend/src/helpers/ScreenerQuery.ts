export interface ScreenerQuery {
  securities_overviews: {
    exchange: Array<string>;
    market_cap: Array<number | null | undefined>;
    yearly_low: number | null;
    yearly_high: number | null;
    sector: Array<string>;
    industry: Array<string>;
    eps: Array<number | null | undefined>;
    beta: Array<number | null | undefined>;
    payout_ratio: Array<number | null | undefined>;
  };
}

export const paramsObjToScreenerParams = (paramsObj: ScreenerQuery) => {
  return `?${Object.entries(paramsObj["securities_overviews"])
    .map(([field, value], idx) =>
      typeof value === "string" || typeof value === "number"
        ? `${field}=${String(value)}`
        : Array.isArray(value) &&
          (field === "exchange" || field === "sector" || field === "industry")
        ? value
            .map((e: any) => `${field}=${typeof e === "string" ? e : ""}`)
            .join("&")
        : Array.isArray(value)
        ? value
            .map((e: any) => `${field}=${typeof e === "number" ? e : ""}`)
            .join("&")
        : value === null || value === undefined
        ? `${field}=`
        : `${field}=${String(value)}`
    )
    .join("&")}`;
};

const paramsObjToHeadings: { [key: string]: any } = {
  exchange: "Exchange",
  market_cap: "Market Cap",
  yearly_low: "Yearly Low",
  yearly_high: "Yearly High",
  sector: "Sector",
  industry: "Industry",
  eps: "EPS",
  beta: "Beta",
  payout_ratio: "Payout Ratio",
};

export const paramsObjToString = (paramsObj: ScreenerQuery) => {
  return paramsObj.hasOwnProperty("securities_overviews")
    ? `${Object.entries(paramsObj["securities_overviews"])
        .map(([field, value], idx) => {
          const fieldname = paramsObjToHeadings.hasOwnProperty(field)
            ? paramsObjToHeadings[field]
            : field;
          return typeof value === "string" || typeof value === "number"
            ? `${fieldname}: ${String(value)}`
            : Array.isArray(value) &&
              value.length > 0 &&
              value[0] !== "" &&
              (field === "exchange" ||
                field === "sector" ||
                field === "industry")
            ? `${fieldname}: ${String(value)}`
            : Array.isArray(value) && value.length === 2
            ? `${fieldname}: ` +
              (value[0] && value[1]
                ? `${String(value[0])} to ${String(value[1])}`
                : value[0] && !value[1]
                ? `min ${String(value[0])}`
                : !value[0] && value[1]
                ? `max ${String(value[1])}`
                : `N/A`)
            : value === null || value === undefined
            ? ``
            : ``;
        })
        .filter((entry) => entry !== null && entry !== "")
        .join(", ")}`
    : "";
};

interface industryChoiceOptions {
  [key: string]: Array<string>;
}

export const exchangeChoices = ["NASDAQ", "NYSE"];
export const sectorChoices = [
  "Basic Materials",
  "Financial Services",
  "Consumer Defensive",
  "Utilities",
  "Energy",
  "Technology",
  "Consumer Cyclical",
  "Real Estate",
  "Healthcare",
  "Communication Services",
  "Industrials",
];

export const industryChoices: industryChoiceOptions = {
  Technology: [
    "Information Technology Services",
    "Software—Infrastructure",
    "Computer Hardware",
    "Electronic Components",
    "Scientific & Technical Instruments",
    "Semiconductors",
    "Software—Application",
    "Communication Equipment",
    "Consumer Electronics",
    "Electronics & Computer Distribution",
    "Semiconductor Equipment & Materials",
    "Solar",
  ],
  "Consumer Cyclical": [
    "Auto & Truck Dealerships",
    "Auto Manufacturers",
    "Auto Parts",
    "Recreational Vehicles",
    "Furnishings",
    "Fixtures & Appliances",
    "Residential Construction",
    "Textile Manufacturing",
    "Apparel Manufacturing",
    "Footwear & Accessories",
    "Packaging & Containers",
    "Personal Services",
    "Restaurants",
    "Apparel Retail",
    "Department Stores",
    "Home Improvement Retail",
    "Luxury Goods",
    "Internet Retail",
    "Specialty Retail",
    "Gambling",
    "Leisure",
    "Lodging",
    "Resorts & Casinos",
    "Travel Services",
  ],
  "Basic Materials": [
    "Agricultural Inputs",
    "Building Materials",
    "Chemicals",
    "Specialty Chemicals",
    "Lumber & Wood Production",
    "Paper & Paper Products",
    "Aluminum",
    "Copper",
    "Other Industrial Metals & Mining",
    "Gold",
    "Silver",
    "Other Precious Metals & Mining",
    "Coking Coal",
    "Steel",
  ],
  "Financial Services": [
    "Asset Management",
    "Banks—Diversified",
    "Banks—Regional",
    "Mortgage Finance",
    "Capital Markets",
    "Financial Data & Stock Exchanges",
    "Insurance—Life",
    "Insurance—Property & Casualty",
    "Insurance—Reinsurance",
    "Insurance—Specialty",
    "Insurance Brokers",
    "Insurance—Diversified",
    "Shell Companies",
    "Financial Conglomerates",
    "Credit Services",
  ],
  "Consumer Defensive": [
    "Beverages—Brewers",
    "Beverages—Wineries & Distilleries",
    "Beverages—Non-Alcoholic",
    "Confectioners",
    "Farm Products",
    "Household & Personal Products",
    "Packaged Foods",
    "Education & Training Services",
    "Discount Stores",
    "Food Distribution",
    "Grocery Stores",
    "Tobacco",
  ],
  Utilities: [
    "Utilities—Independent Power Producers",
    "Utilities—Renewable",
    "Utilities—Regulated Water",
    "Utilities—Regulated Electric",
    "Utilities—Regulated Gas",
    "Utilities—Diversified",
  ],
  Energy: [
    "Oil & Gas Drilling",
    "Oil & Gas E&P",
    "Oil & Gas Integrated",
    "Oil & Gas Midstream",
    "Oil & Gas Refining & Marketing",
    "Oil & Gas Equipment & Services",
    "Thermal Coal",
    "Uranium",
  ],
  "Real Estate": [
    "Real Estate—Development",
    "Real Estate Services",
    "Real Estate—Diversified",
    "REIT—Healthcare Facilities",
    "REIT—Hotel & Motel",
    "REIT—Industrial",
    "REIT—Office",
    "REIT—Residential",
    "REIT—Retail",
    "REIT—Mortgage",
    "REIT—Specialty",
    "REIT—Diversified",
  ],
  Healthcare: [
    "Biotechnology",
    "Drug Manufacturers—General",
    "Drug Manufacturers—Specialty & Generic",
    "Healthcare Plans",
    "Medical Care Facilities",
    "Pharmaceutical Retailers",
    "Health Information Services",
    "Medical Devices",
    "Medical Instruments & Supplies",
    "Diagnostics & Research",
    "Medical Distribution",
  ],
  "Communication Services": [
    "Telecom Services",
    "Advertising Agencies",
    "Publishing",
    "Broadcasting",
    "Entertainment",
    "Internet Content & Information",
    "Electronic Gaming & Multimedia",
  ],
  Industrials: [
    "Aerospace & Defense",
    "Specialty Business Services",
    "Consulting Services",
    "Rental & Leasing Services",
    "Security & Protection Services",
    "Staffing & Employment Services",
    "Conglomerates",
    "Engineering & Construction",
    "Infrastructure Operations",
    "Building Products & Equipment",
    "Farm & Heavy Construction Machinery",
    "Industrial Distribution",
    "Business Equipment & Supplies",
    "Specialty Industrial Machinery",
    "Metal Fabrication",
    "Pollution & Treatment Controls",
    "Tools & Accessories",
    "Electrical Equipment & Parts",
    "Airports & Air Services",
    "Airlines",
    "Railroads",
    "Marine Shipping",
    "Trucking",
    "Integrated Freight & Logistics",
    "Waste Management",
  ],
};
