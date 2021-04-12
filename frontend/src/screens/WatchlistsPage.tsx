import { Row, Tab, Tabs } from "react-bootstrap";
import WatchlistInfo from "../components/WatchlistInfo";

const WatchlistsPage: React.FC = () => {
  return (
    <Tabs defaultActiveKey="following" className="justify-content-center">
      <Tab eventKey="following" title="Followed Watchlists">
        <Row className="my-2 justify-content-center">
          <WatchlistInfo
            watchlistName="Karim Following"
            watchlistID="testFollowing"
          />
        </Row>
      </Tab>
      <Tab eventKey="my" title="My Watchlists">
        <Row className="my-2 justify-content-center">
          <WatchlistInfo watchlistName="My Karim" watchlistID="testMy" />
        </Row>
      </Tab>
      <Tab eventKey="all" title="All Watchlists">
        <Row className="my-2 justify-content-center">
          <WatchlistInfo watchlistName="Karim All" watchlistID="testAll" />
        </Row>
      </Tab>
    </Tabs>
  );
};

export default WatchlistsPage;
