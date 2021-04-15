import { useEffect } from "react";
import { connect } from "react-redux";
import { CreatePortfolioForm } from "../components";
import ClipLoader from "react-spinners/ClipLoader";
import { Container, Row } from "react-bootstrap";
import PortfolioInfo from "../components/PortfolioInfo";
import portfolioActions from "../redux/actions/portfolioActions";

interface StateProps {
  loading: boolean;
  portfolios: Array<string>;
}

interface DispatchProps {
  getPortfolios: () => void;
}

const PortfoliosPage: React.FC<StateProps & DispatchProps> = (props) => {
  const { loading, portfolios, getPortfolios } = props;

  useEffect(() => {
    getPortfolios();
  }, [getPortfolios]);

  return (
    <Container fluid>
      <Row className="justify-content-center my-3">
        <h1>Manage Portfolios</h1>
      </Row>
      <Row className="justify-content-center my-3">
        <CreatePortfolioForm />
      </Row>
      <Row className="my-2 justify-content-center">
        {loading ? (
          <ClipLoader color={"green"} loading={loading} />
        ) : (
          portfolios.map((portfolioName, id) => (
            <PortfolioInfo key={id} name={portfolioName} />
          ))
        )}
      </Row>
    </Container>
  );
};

const mapStateToProps = (state: any) => ({
  loading: state.portfolioReducer.getPortfolios.loading,
  portfolios: state.portfolioReducer.getPortfolios.portfolios,
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    getPortfolios: () => dispatch(portfolioActions.getPortfolios()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PortfoliosPage);
