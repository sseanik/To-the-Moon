import { useState } from "react";
import { Col, Alert, Button } from "react-bootstrap";
import { connect } from "react-redux";
import ClipLoader from "react-spinners/ClipLoader";
import PortfolioInfo from "./PortfolioInfo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import dashboardActions from "../redux/actions/dashboardActions";
import { StockNewsCarousel, StockGraph } from ".";

interface Props {
  blockId: string;
}

interface StateProps {
  meta: MetaState;
  loading: LoadingState;
  error: ErrorState;
  deleting: boolean;
}

interface DispatchProps {
  deleteBlock: (payload: DeleteBlockParams) => void;
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

interface DeleteBlockParams {
  blockId: string;
}

const deleteButtonStyle = {
  transition: "0.3s",
  position: "absolute",
  left: "2%",
  margin: "auto",
  zIndex: 10,
} as React.CSSProperties;

const Block: React.FC<Props & StateProps & DispatchProps> = (props) => {
  const { blockId, meta, loading, error, deleting, deleteBlock } = props;
  const [showDelete, setShowDelete] = useState(false);

  const blockType =
    blockId && meta.hasOwnProperty(blockId) ? meta[blockId].type : "";
  const blockMeta =
    blockId && meta.hasOwnProperty(blockId) ? meta[blockId].meta : null;
  const blockLoading =
    blockId && loading.hasOwnProperty(blockId) ? loading[blockId] : false;
  const blockError =
    blockId && error.hasOwnProperty(blockId) ? error[blockId] : "";

  const deleteComponent = (
    <Button
      style={
        showDelete
          ? { ...deleteButtonStyle, opacity: 1, top: "2%" }
          : { ...deleteButtonStyle, opacity: 0, top: "-2%" }
      }
      disabled={deleting}
      variant="danger"
      onClick={() => deleteBlock({ blockId })}
    >
      <FontAwesomeIcon icon={faTrash} />
      <span className="ml-3">{deleting ? "Removing..." : "Remove"}</span>
    </Button>
  );

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
          <PortfolioInfo
            viewOnly={true}
            detailed={blockMeta ? blockMeta.detailed : null}
            name={blockMeta ? blockMeta.portfolio_name : null}
          />
        );
      case "news":
        return (
          <StockNewsCarousel
            stock={blockMeta ? blockMeta.stock_ticker : null}
          />
        );
      case "stock":
        return <StockGraph stock={blockMeta ? blockMeta.stock_ticker : null} />;
      default:
        return <></>;
    }
  };

  return (
    <Col
      className="border rounded mx-2 p-3 justify-content-center align-items-center bg-dark"
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      {blockId ? deleteComponent : null}
      {blockError ? <Alert variant="danger">{blockError}</Alert> : null}
      {blockLoading ? loadingSpinnerComponent : blockComponent(blockType)}
    </Col>
  );
};

const mapStateToProps = (state: any) => ({
  meta: state.dashboardReducer.meta,
  loading: state.dashboardReducer.getBlocksMeta.loading,
  error: state.dashboardReducer.getBlocksMeta.error,
  deleting: state.dashboardReducer.deleteBlock.loading,
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    deleteBlock: (payload: DeleteBlockParams) => {
      dispatch(dashboardActions.deleteBlock(payload));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Block);
