export const statusBadgeModifier = (
  data: Array<any>,
  isLoading: boolean,
  error: object | null
) => {
  const result =
    data !== null && Object.keys(data).length > 0 && !isLoading
      ? "success"
      : isLoading
      ? "primary"
      : data === null || Object.keys(data).length === 0
      ? "secondary"
      : error
      ? "danger"
      : "danger";
  return result;
};

export const statusBadgeText = (
  data: Array<any>,
  isLoading: boolean,
  error: object | null
) => {
  const result =
    data !== null && Object.keys(data).length > 0 && !isLoading
      ? "Fetched"
      : isLoading
      ? "Pending"
      : Object.keys(data).length === 0 || data === null
      ? "Not requested"
      : error !== null
      ? "Error"
      : "Error";
  return result;
};
