import { Button, Image } from "react-bootstrap";
import logo from "../resources/notepad.png";
import noteActions from "../redux/actions/noteActions";
import { connect } from "react-redux";

interface DispatchProps {
  toggleNoteList: () => void;
}

const NoteListToggle: React.FC<DispatchProps> = (props) => {
  const { toggleNoteList } = props;

  return (
    <Button
      variant="light"
      type="button"
      className="mx-2"
      onClick={toggleNoteList}
    >
      <Image src={logo} />
    </Button>
  );
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    toggleNoteList: () => dispatch(noteActions.toggleNoteList()),
  };
};

export default connect(null, mapDispatchToProps)(NoteListToggle);
