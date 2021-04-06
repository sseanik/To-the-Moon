import { connect } from "react-redux";
import SlidingPane from "react-sliding-pane";
import noteActions from "../redux/actions/noteActions";
import "react-sliding-pane/dist/react-sliding-pane.css";
import { NoteListBody } from ".";

interface StateProps {
  show: boolean;
}

interface DispatchProps {
  toggleNoteList: () => void;
}

const NoteList: React.FC<StateProps & DispatchProps> = (props) => {
  const { show, toggleNoteList } = props;

  return (
    <SlidingPane
      className="pane-overlay"
      isOpen={show}
      title="Personal Notes"
      onRequestClose={toggleNoteList}
      from="right"
    >
      <NoteListBody />
    </SlidingPane>
  );
};

const mapStateToProps = (state: any) => ({
  show: state.noteReducer.allNotes.show,
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    toggleNoteList: () => dispatch(noteActions.toggleNoteList()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NoteList);
