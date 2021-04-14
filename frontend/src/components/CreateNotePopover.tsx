import { OverlayTrigger, Popover, Button, Alert } from "react-bootstrap";
import { connect } from "react-redux";
import ClipLoader from "react-spinners/ClipLoader";
import noteActions from "../redux/actions/noteActions";
import { CreateEditNoteForm } from ".";
import { NoteFormValues } from "./CreateEditNoteForm";

const overlayStyle = {
  width: "40vw",
  maxWidth: "400px",
  maxHeight: "400px",
};

interface CreateNoteParams {
  title: string;
  content: string;
  stock_symbols: Array<string>;
  portfolio_names: Array<string>;
  external_references: Array<string>;
  internal_references: Array<string>;
}

const createNoteButtonStyle = {
  position: "fixed",
  bottom: "5%",
  right: "3%",
  margin: "auto",
  borderRadius: "20px",
  boxShadow: "5px 10px 18px #888888",
} as React.CSSProperties;

interface StateProps {
  loading: boolean;
  message: string;
  error: string;
}

interface DispatchProps {
  createNote: (payload: CreateNoteParams) => void;
}

const CreateNotePopover: React.FC<StateProps & DispatchProps> = (props) => {
  const { loading, message, error, createNote } = props;

  const handleCreate = (values: NoteFormValues) => {
    const {
      title,
      content,
      stockSymbols,
      portfolioNames,
      externalReferences,
      internalReferences,
    } = values;
    createNote({
      title,
      content,
      stock_symbols: stockSymbols.split(","),
      portfolio_names: portfolioNames.split(","),
      external_references: externalReferences.split(","),
      internal_references: internalReferences.split(","),
    });
  };

  const initialValues: NoteFormValues = {
    title: "",
    content: "",
    stockSymbols: "",
    portfolioNames: "",
    externalReferences: "",
    internalReferences: "",
  };

  const errorComponent = <Alert variant="danger">{error}</Alert>;
  const messageComponent = <Alert variant="success">{message}</Alert>;

  const loadingSpinnerComponent = (
    <ClipLoader color={"green"} loading={loading}>
      <span className="sr-only">Loading...</span>
    </ClipLoader>
  );

  const createNoteOverlay = (
    <Popover
      style={overlayStyle}
      className="create-note-popover"
      id="create-note-popover"
    >
      <Popover.Title as="h3">Create a new note</Popover.Title>
      <Popover.Content>
        {error ? errorComponent : null}
        {message ? messageComponent : null}
        {loading ? (
          loadingSpinnerComponent
        ) : (
          <CreateEditNoteForm
            loading={loading}
            initialValues={initialValues}
            handleSubmit={handleCreate}
          />
        )}
      </Popover.Content>
    </Popover>
  );

  return (
    <OverlayTrigger trigger="click" placement="top" overlay={createNoteOverlay}>
      <Button variant="info" size="lg" style={createNoteButtonStyle}>
        New Note
      </Button>
    </OverlayTrigger>
  );
};

const mapStateToProps = (state: any) => ({
  loading: state.noteReducer.createNote.loading,
  message: state.noteReducer.createNote.message,
  error: state.noteReducer.createNote.error,
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    createNote: (payload: CreateNoteParams) =>
      dispatch(noteActions.createNote(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateNotePopover);
