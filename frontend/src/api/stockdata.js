
const url = 'http://127.0.0.1:5000/stock';

const StockData = {
  fetch: (symbol, ignoreError = false) => fetch(url + `?symbol=${symbol}`)
    .then((res) => (res.ok && !ignoreError ? res.json() : console.log(res)))
    .catch((err) => console.warn(`API_ERROR: ${err}`)),
};

export default StockData;
