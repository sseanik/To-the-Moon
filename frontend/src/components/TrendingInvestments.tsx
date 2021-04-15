import { useEffect } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import trendActions from "../redux/actions/trendActions";
import { connect } from "react-redux";
import { Row, Alert, Card, Container } from "react-bootstrap";

interface TrendingStocksParams {
  n: number;
}

interface TrendingStockEntry {
  stock: string;
  count: number;
}

interface StateProps {
  loading: boolean;
  error: string;
  data: Array<TrendingStockEntry>;
}

interface DispatchProps {
  getTrendingStocks: (payload: TrendingStocksParams) => void;
}

const TrendingInvestments: React.FC<StateProps & DispatchProps> = (props) => {
  const { loading, error, data, getTrendingStocks } = props;

  useEffect(() => {
    getTrendingStocks({ n: 5 });
  }, [getTrendingStocks]);

  const loadingSpinnerComponent = (
    <div>
      <ClipLoader color={"green"} loading={loading} />
      <h5>Loading...</h5>
    </div>
  );

  const alertComponent = <Alert variant="danger">{error}</Alert>;

  const trendingStockComponent = (
    trending: TrendingStockEntry,
    idx: number
  ) => (
    <Card key={idx} className="trending-investment">
      <Card.Body>
        <Card.Title>{trending.stock}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{`#${
          idx + 1
        } Most Popular with Investors`}</Card.Subtitle>
        <Card.Text>
          {trending.count === 1
            ? `${trending.count} user is investing in or watching ${trending.stock} shares`
            : `${trending.count} users are investing in or watching ${trending.stock} shares`}
        </Card.Text>
        <Card.Link
          href={`/stock/${trending.stock}`}
        >{`Explore ${trending.stock} statistics`}</Card.Link>
      </Card.Body>
    </Card>
  );

  return (
    <Row className="justify-content-around">
      <Container>
        {loading ? loadingSpinnerComponent : null}
        {error ? alertComponent : null}
      </Container>
      {data.map((trendingStock, idx) =>
        trendingStockComponent(trendingStock, idx)
      )}
    </Row>
  );
};

const mapStateToProps = (state: any) => ({
  loading: state.trendReducer.loading,
  error: state.trendReducer.error,
  data: state.trendReducer.data,
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    getTrendingStocks: (payload: TrendingStocksParams) =>
      dispatch(trendActions.getTrendingInvestments(payload)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TrendingInvestments);
