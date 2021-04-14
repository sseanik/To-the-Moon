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
      if (res.status === 200) {
        dispatch(noteActions.getUserNotesSuccess(res));
      } else {
        dispatch(noteActions.getUserNotesFailure(res.error));
      }
    } catch (error) {
      dispatch(noteActions.getUserNotesFailure(error.message));
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
      if (res.status === 200) {
        dispatch(noteActions.getRelevantNotesSuccess(res));
      } else {
        dispatch(noteActions.getRelevantNotesFailure(res.error));
      }
    } catch (error) {
      dispatch(noteActions.getRelevantNotesFailure(error.message));
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
      if (res.status === 200) {
        dispatch(noteActions.createNoteSuccess(res));
      } else {
        dispatch(noteActions.createNoteFailure(res.error));
      }
    } catch (error) {
      dispatch(noteActions.createNoteFailure(error.message));
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
      if (res.status === 200) {
        dispatch(noteActions.editNoteSuccess(res));
      } else {
        dispatch(noteActions.editNoteFailure(res.error));
      }
    } catch (error) {
      dispatch(noteActions.editNoteFailure(error.message));
    }
  },
  deleteNote: (payload) => async (dispatch) => {
    dispatch(noteActions.deleteNotePending(payload));
    try {
      const { title } = payload;
      const res = await NoteAPI.deleteNote(title);
      if (res.status === 200) {
        dispatch(noteActions.deleteNoteSuccess(res));
      } else {
        dispatch(noteActions.deleteNoteFailure(res.error));
      }
    } catch (error) {
      dispatch(noteActions.deleteNoteFailure(error.message));
    }
  },
};

export default noteActions;
