import { useParams } from "react-router";

interface RouteMatchParams {
  watchlistID: string;
}

const WatchlistPage: React.FC = () => {
  const { watchlistID } = useParams<RouteMatchParams>();
  return <h1>{watchlistID}</h1>;
};

export default WatchlistPage;
