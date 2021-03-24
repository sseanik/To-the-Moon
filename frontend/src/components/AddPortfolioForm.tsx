import { useState } from "react";

interface Props {
  handlePortfolioAdded: () => void;
}

const AddPortfolioForm: React.FC<Props> = (props) => {
  const [isLoading, setLoading] = useState(false);

  return <p>hi</p>;
};

export default AddPortfolioForm;
