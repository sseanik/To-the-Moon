import { NoteEntry } from "./NoteListBody";
import { Card, Button } from "react-bootstrap";
import { connect } from "react-redux";
import noteActions from "../redux/actions/noteActions";
import { useState } from "react";
import { NoteFormValues } from "./CreateEditNoteForm";
import { CreateEditNoteForm } from ".";

const noteSubheadingStyle = {
  fontWeight: "bold",
} as React.CSSProperties;

interface DeleteNoteParams {
  title: string;
}

interface EditNoteParams {
  old_title: string;
  new_title: string;
  content: string;
  stock_symbols: Array<string>;
  portfolio_names: Array<string>;
  external_references: Array<string>;
  internal_references: Array<string>;
}

interface StateProps {
  deletingNote: string;
  deleteLoading: boolean;
  editingNote: string;
  editLoading: boolean;
}

interface DispatchProps {
  deleteNote: (payload: DeleteNoteParams) => void;
  editNote: (payload: EditNoteParams) => void;
}

const Note: React.FC<NoteEntry & StateProps & DispatchProps> = (props) => {
  const {
    title,
    content,
    stock_symbols,
    portfolio_names,
    external_references,
    internal_references,
    deletingNote,
    deleteLoading,
    editingNote,
    editLoading,
    deleteNote,
    editNote,
  } = props;

  const noteTitle = title;
  const [editing, setEditing] = useState(false);
  const initialValues: NoteFormValues = {
    title,
    content,
    stockSymbols: stock_symbols.join(","),
    portfolioNames: portfolio_names.join(","),
    externalReferences: external_references.join(","),
    internalReferences: internal_references.join(","),
  };

  const currentNoteDeleting = deleteLoading && deletingNote === title;
  const currentNoteEditing = editLoading && editingNote === title;

  const handleNoteDelete = () => {
    deleteNote({ title });
  };

  const handleNoteEditToggle = () => {
    setEditing(!editing);
  };

  const handleEdit = (values: NoteFormValues) => {
    const {
      title,
      content,
      stockSymbols,
      portfolioNames,
      externalReferences,
      internalReferences,
    } = values;
    editNote({
      old_title: noteTitle,
      new_title: title,
      content,
      stock_symbols: stockSymbols.split(","),
      portfolio_names: portfolioNames.split(","),
      external_references: externalReferences.split(","),
      internal_references: internalReferences.split(","),
    });
  };

  const noteBodyDisplay = (
    <Card className="mx-1 my-2">
      <Card.Header as="h5">{title}</Card.Header>
      <Card.Body>
        <Card.Text>{content}</Card.Text>
        <Card.Text>
          <span style={noteSubheadingStyle}>Linked stocks:</span>
          <br />
          {stock_symbols.join(", ")}
        </Card.Text>
        <Card.Text>
          <span style={noteSubheadingStyle}>Linked portfolios:</span>
          <br />
          {portfolio_names.join(", ")}
        </Card.Text>
        <Card.Text>
          <span style={noteSubheadingStyle}>External references:</span>
          <br />
          {external_references.join(", ")}
        </Card.Text>
        <Card.Text>
          <span style={noteSubheadingStyle}>Internal references:</span>
          <br />
          {internal_references.join(", ")}
        </Card.Text>
        <Button
          disabled={currentNoteDeleting || currentNoteEditing}
          variant="primary"
          className="mx-1"
          onClick={handleNoteEditToggle}
        >
          {currentNoteEditing ? "Editing" : "Edit"}
        </Button>
        <Button
          disabled={currentNoteDeleting || currentNoteEditing}
          variant="danger"
          className="mx-1"
          onClick={handleNoteDelete}
        >
          {currentNoteDeleting ? "Deleting..." : "Delete"}
        </Button>
      </Card.Body>
    </Card>
  );

  const noteBodyEditing = (
    <Card className="mx-1 my-2">
      <Card.Header as="h5">
        <Button
          disabled={currentNoteEditing}
          variant="danger"
          className="mr-3"
          onClick={handleNoteEditToggle}
        >
          Close
        </Button>
        {`Editing ${noteTitle}...`}
      </Card.Header>
      <Card.Body>
        <CreateEditNoteForm
          loading={currentNoteEditing}
          initialValues={initialValues}
          handleSubmit={handleEdit}
        />
      </Card.Body>
    </Card>
  );

  return editing ? noteBodyEditing : noteBodyDisplay;
};

const mapStateToProps = (state: any) => ({
  deletingNote: state.noteReducer.deleteNote.note,
  deleteLoading: state.noteReducer.deleteNote.loading,
  editingNote: state.noteReducer.editNote.note,
  editLoading: state.noteReducer.editNote.loading,
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    deleteNote: (payload: DeleteNoteParams) =>
      dispatch(noteActions.deleteNote(payload)),
    editNote: (payload: EditNoteParams) =>
      dispatch(noteActions.editNote(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Note);
