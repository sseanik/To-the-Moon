import { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { connect } from "react-redux";
import { Block, AddBlockComponent } from "../components";
import dashboardActions from "../redux/actions/dashboardActions";

interface StateProps {
  blocks: Array<string>;
}

interface DispatchProps {
  getBlockMeta: (payload: GetBlockMetaParams) => void;
}

interface GetBlockMetaParams {
  blockId: string;
}

const rowStyle = {
  height: "40vh",
};

const BlocksContainer: React.FC<StateProps & DispatchProps> = (props) => {
  const { blocks, getBlockMeta } = props;

  useEffect(() => {
    blocks.forEach((blockId) => getBlockMeta({ blockId }));
  }, [blocks, getBlockMeta]);

  const blockComponent = (idx: number) =>
    idx > blocks.length ? (
      <Block blockId={""} />
    ) : blocks[idx] ? (
      <Block blockId={blocks[idx]} />
    ) : (
      <AddBlockComponent />
    );

  return (
    <Container fluid>
      <Row className="my-1" style={rowStyle}>
        {blockComponent(0)}
        {blockComponent(1)}
      </Row>
      <Row className="my-1" style={rowStyle}>
        {blockComponent(2)}
        {blockComponent(3)}
      </Row>
    </Container>
  );
};

const mapStateToProps = (state: any) => ({
  blocks: state.dashboardReducer.blocks,
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    getBlockMeta: (payload: GetBlockMetaParams) =>
      dispatch(dashboardActions.getBlockMeta(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BlocksContainer);
