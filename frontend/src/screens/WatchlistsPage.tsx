import { useState } from "react";
import { Button, Container } from "react-bootstrap";

const WatchlistsPage: React.FC = () => {
  const [following, setFollowing] = useState(false);
  return (
    <Container fluid>
      {following ? (
        <Button
          onClick={() => {
            setFollowing(false);
          }}
        >
          View All
        </Button>
      ) : (
        <Button
          onClick={() => {
            setFollowing(true);
          }}
        >
          View Following
        </Button>
      )}
      {following ? (
        <p>Displaying only followed watchlists</p>
      ) : (
        <p>Displaying all watchlists</p>
      )}
    </Container>
  );
};

export default WatchlistsPage;
