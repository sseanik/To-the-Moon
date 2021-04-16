export interface ScreenerQuery {
  securities_overviews: {
    region: Array<string>;
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
  return `?${Object.entries(paramsObj['securities_overviews']).map(([field, value], idx) => (
    typeof value === "string" || typeof value === "number"
      ? `${field}=${String(value)}`
    : Array.isArray(value)
      ? value.map((e: any) => (`${field}=${typeof e === "number" ? e : ""}`)).join("&")
    : value === null || value === undefined
      ? `${field}=`
    : `${field}=${String(value)}`
  )).join("&")}`;
};

const paramsObjToHeadings: {[key: string]: any} = {
  region: "Region",
  market_cap: "Market Cap",
  yearly_low: "Yearly Low",
  yearly_high: "Yearly High",
  sector: "Sector",
  industry: "Industry",
  eps: "EPS",
  beta: "Beta",
  payout_ratio: "Payout Ratio",
}

export const paramsObjToString = (paramsObj: ScreenerQuery) => {
  return paramsObj.hasOwnProperty('securities_overviews') ? `${Object.entries(paramsObj['securities_overviews']).map(([field, value], idx) => {
      const fieldname = paramsObjToHeadings.hasOwnProperty(field)
        ? paramsObjToHeadings[field] : field;
      return typeof value === "string" || typeof value === "number"
        ? `${fieldname}: ${String(value)}`
      : Array.isArray(value) && value.length > 0 && value[0] !== ""
        && (field === "region" || field === "sector" || field === "industry")
        ? `${fieldname}: ${String(value)}`
      : Array.isArray(value) && value.length == 2
        ? `${fieldname}: ` + (
          value[0] && value[1] ? `${String(value[0])} to ${String(value[1])}`
          : value[0] && !value[1] ? `min ${String(value[0])}`
          : !value[0] && value[1] ? `max ${String(value[1])}`
          : `N/A`
        )
      : value === null || value === undefined
        ? ``
      : ``;
  }).filter(entry => entry !== null && entry !== "").join(", ")}` : "";
};
