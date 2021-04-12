import { Tab, Tabs } from "react-bootstrap";

const WatchlistsPage: React.FC = () => {
  return (
    <Tabs defaultActiveKey="following" className="justify-content-center">
      <Tab eventKey="following" title="Followed Watchlists">
        Following Watchlists
      </Tab>
      <Tab eventKey="my" title="My Watchlists">
        My Watchlists
      </Tab>
      <Tab eventKey="all" title="All Watchlists">
        All Watchlists
      </Tab>
    </Tabs>
  );
};

export default WatchlistsPage;
