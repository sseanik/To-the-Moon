import { useEffect } from "react";
import { connect } from "react-redux";
import noteActions from "../redux/actions/noteActions";
import ClipLoader from "react-spinners/ClipLoader";
import { Container, Row, Alert } from "react-bootstrap";
import { Note, CreateNotePopover } from ".";

export interface NoteEntry {
  title: string;
  content: string;
  stock_symbols: Array<string>;
  portfolio_names: Array<string>;
  external_references: Array<string>;
  internal_references: Array<string>;
}

interface RelevantNotesParams {
  stock_symbols: Array<string>;
  portfolio_names: Array<string>;
}

interface Props {
  stock?: Array<string>;
  portfolio?: Array<string>;
}

interface StateProps {
  loading: boolean;
  notes: Array<NoteEntry>;
  error: string;
  touched: boolean;
  editError: string;
  deleteError: string;
}

interface DispatchProps {
  getRelevantNotes: (payload: RelevantNotesParams) => void;
}

const NoteRelevant: React.FC<Props & StateProps & DispatchProps> = (props) => {
  const {
    stock = [],
    portfolio = [],
    loading,
    notes,
    touched,
    error,
    editError,
    deleteError,
    getRelevantNotes,
  } = props;

  useEffect(() => {
    if (touched) {
      getRelevantNotes({ stock_symbols: stock, portfolio_names: portfolio });
    }
  }, [getRelevantNotes, touched]);

  const errorComponent = (error: string) => (
    <Alert variant="danger">{error}</Alert>
  );

  const notesBody =
    notes.length > 0 ? (
      notes
        .sort((a, b) => {
          return a.title < b.title ? -1 : 1;
        })
        .map((note, idx) => <Note key={idx} {...note} />)
    ) : (
      <Row className="justify-content-center my-2">
        There are no notes here... Click 'New Note' to create one!
      </Row>
    );

  return (
    <Container>
      {error ? errorComponent(error) : null}
      {editError ? errorComponent(editError) : null}
      {deleteError ? errorComponent(deleteError) : null}
      {loading ? (
        <Row className="justify-content-center my-2">
          <ClipLoader color={"green"} loading={loading}>
            <span className="sr-only">Loading...</span>
          </ClipLoader>
        </Row>
      ) : (
        notesBody
      )}
      <Row className="justify-content-center mt-2">
        <CreateNotePopover />
      </Row>
    </Container>
  );
};

const mapStateToProps = (state: any) => ({
  loading: state.noteReducer.relevantNotes.loading,
  notes: state.noteReducer.relevantNotes.data,
  error: state.noteReducer.relevantNotes.error,
  touched: state.noteReducer.touched.relevantNotes,
  editError: state.noteReducer.editNote.error,
  deleteError: state.noteReducer.deleteNote.error,
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    getRelevantNotes: (payload: RelevantNotesParams) =>
      dispatch(noteActions.getRelevantNotes(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NoteRelevant);
