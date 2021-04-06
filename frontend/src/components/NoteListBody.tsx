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

interface StateProps {
  loading: boolean;
  notes: Array<NoteEntry>;
  error: string;
  editError: string;
  deleteError: string;
}

interface DispatchProps {
  getNotes: () => void;
}

const NoteListBody: React.FC<StateProps & DispatchProps> = (props) => {
  const { loading, notes, error, editError, deleteError, getNotes } = props;

  useEffect(() => {
    getNotes();
  }, [getNotes]);

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
  loading: state.noteReducer.allNotes.loading,
  notes: state.noteReducer.allNotes.data,
  error: state.noteReducer.allNotes.error,
  editError: state.noteReducer.editNote.error,
  deleteError: state.noteReducer.deleteNote.error,
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    getNotes: () => dispatch(noteActions.getUserNotes()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NoteListBody);
