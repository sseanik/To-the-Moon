import { Col, Alert } from "react-bootstrap";
import { connect } from "react-redux";
import ClipLoader from "react-spinners/ClipLoader";
import PortfolioInfo from "./PortfolioInfo";

interface Props {
  id: string | null;
}

interface StateProps {
  meta: MetaState;
  loading: LoadingState;
  error: ErrorState;
}

interface MetaState {
  [key: string]: Meta;
}

interface Meta {
  type: string;
  meta: { [key: string]: any };
}

interface LoadingState {
  [key: string]: boolean;
}

interface ErrorState {
  [key: string]: string;
}

const Block: React.FC<Props & StateProps> = (props) => {
  const { id, meta, loading, error } = props;

  const blockType = id && meta.hasOwnProperty(id) ? meta[id].type : "";
  const blockMeta = id && meta.hasOwnProperty(id) ? meta[id].meta : null;
  const blockLoading = id && loading.hasOwnProperty(id) ? loading[id] : false;
  const blockError = id && error.hasOwnProperty(id) ? error[id] : "";

  const loadingSpinnerComponent = (
    <div>
      <ClipLoader color={"green"} loading={blockLoading}></ClipLoader>
      <h5>Building block...</h5>
    </div>
  );

  const blockComponent = (type: string) => {
    switch (type) {
      case "portfolio":
        return (
          <PortfolioInfo name={blockMeta ? blockMeta.portfolio_name : null} />
        );
      default:
        return <></>;
    }
  };

  return (
    <Col className="border rounded mx-1 p-4 bg-light justify-content-center align-items-center">
      {blockError ? <Alert variant="danger">{blockError}</Alert> : null}
      {blockLoading ? loadingSpinnerComponent : null}
      {blockComponent(blockType)}
    </Col>
  );
};

const mapStateToProps = (state: any) => ({
  meta: state.dashboardReducer.meta,
  loading: state.dashboardReducer.getBlocksMeta.loading,
  error: state.dashboardReducer.getBlocksMeta.error,
});

export default connect(mapStateToProps)(Block);
