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
