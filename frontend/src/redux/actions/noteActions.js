import NoteAPI from "../../api/note";
import noteConstants from "../constants/noteConstants";

const noteActions = {
  getUserNotesPending: () => ({
    type: noteConstants.GET_USER_NOTES_PENDING,
  }),
  getUserNotesSuccess: (response) => ({
    type: noteConstants.GET_USER_NOTES_SUCCESS,
    payload: response,
  }),
  getUserNotesFailure: (error) => ({
    type: noteConstants.GET_USER_NOTES_FAILURE,
    payload: error,
  }),
  getRelevantNotesPending: () => ({
    type: noteConstants.GET_RELEVANT_NOTES_PENDING,
  }),
  getRelevantNotesSuccess: (response) => ({
    type: noteConstants.GET_RELEVANT_NOTES_SUCCESS,
    payload: response,
  }),
  getRelevantNotesFailure: (error) => ({
    type: noteConstants.GET_RELEVANT_NOTES_FAILURE,
    payload: error,
  }),
  createNotePending: () => ({
    type: noteConstants.CREATE_NOTE_PENDING,
  }),
  createNoteSuccess: (response) => ({
    type: noteConstants.CREATE_NOTE_SUCCESS,
    payload: response,
  }),
  createNoteFailure: (error) => ({
    type: noteConstants.CREATE_NOTE_FAILURE,
    payload: error,
  }),
  editNotePending: (payload) => ({
    type: noteConstants.EDIT_NOTE_PENDING,
    payload,
  }),
  editNoteSuccess: () => ({
    type: noteConstants.EDIT_NOTE_SUCCESS,
  }),
  editNoteFailure: (error) => ({
    type: noteConstants.EDIT_NOTE_FAILURE,
    payload: error,
  }),
  deleteNotePending: (payload) => ({
    type: noteConstants.DELETE_NOTE_PENDING,
    payload,
  }),
  deleteNoteSuccess: () => ({
    type: noteConstants.DELETE_NOTE_SUCCESS,
  }),
  deleteNoteFailure: (error) => ({
    type: noteConstants.DELETE_NOTE_FAILURE,
    payload: error,
  }),
  toggleNoteList: () => ({
    type: noteConstants.TOGGLE_NOTELIST,
  }),
  getUserNotes: () => async (dispatch) => {
    dispatch(noteActions.getUserNotesPending());
    try {
      const res = await NoteAPI.getUserNotes();
      dispatch(noteActions.getUserNotesSuccess(res));
    } catch (error) {
      dispatch(noteActions.getUserNotesFailure(error.error));
    }
  },
  getRelevantNotes: (payload) => async (dispatch) => {
    dispatch(noteActions.getRelevantNotesPending());
    try {
      const { stock_symbols, portfolio_names } = payload;
      const res = await NoteAPI.getRelevantNotes(
        stock_symbols,
        portfolio_names
      );
      dispatch(noteActions.getRelevantNotesSuccess(res));
    } catch (error) {
      dispatch(noteActions.getRelevantNotesFailure(error.error));
    }
  },
  createNote: (payload) => async (dispatch) => {
    dispatch(noteActions.createNotePending());
    try {
      const {
        title,
        content,
        stock_symbols,
        portfolio_names,
        external_references,
        internal_references,
      } = payload;
      const res = await NoteAPI.createNote(
        title,
        content,
        stock_symbols,
        portfolio_names,
        external_references,
        internal_references
      );
      dispatch(noteActions.createNoteSuccess(res));
    } catch (error) {
      dispatch(noteActions.createNoteFailure(error.error));
    }
  },
  editNote: (payload) => async (dispatch) => {
    dispatch(noteActions.editNotePending(payload));
    try {
      const {
        old_title,
        new_title,
        content,
        stock_symbols,
        portfolio_names,
        external_references,
        internal_references,
      } = payload;
      const res = await NoteAPI.editNote(
        old_title,
        new_title,
        content,
        stock_symbols,
        portfolio_names,
        external_references,
        internal_references
      );
      dispatch(noteActions.editNoteSuccess(res));
    } catch (error) {
      dispatch(noteActions.editNoteFailure(error.error));
    }
  },
  deleteNote: (payload) => async (dispatch) => {
    dispatch(noteActions.deleteNotePending(payload));
    try {
      const { title } = payload;
      const res = await NoteAPI.deleteNote(title);
      dispatch(noteActions.deleteNoteSuccess(res));
    } catch (error) {
      dispatch(noteActions.deleteNoteFailure(error.error));
    }
  },
};

export default noteActions;
