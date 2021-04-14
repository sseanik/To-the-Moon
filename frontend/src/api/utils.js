import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function handleError(res) {
  res.json().then((result) => {
    toast.error(result.error);
  });
}

const Utils = {
  getToken: () => window.localStorage.getItem("Token"),
  getJSON: (path, options, ignoreError = false) =>
    fetch(path, options)
      .then((res) => (res.ok && !ignoreError ? res.json() : handleError(res)))
      .catch((err) => {
        console.warn(`API_ERROR: ${err}`);
        throw err;
      }),
};

export default Utils;
