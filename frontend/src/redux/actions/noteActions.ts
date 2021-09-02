import { Dispatch } from "redux";
import NoteAPI from "../../api/note";
import noteConstants from "../constants/noteConstants";

const noteActions = {
  getUserNotesPending: () => ({
    type: noteConstants.GET_USER_NOTES_PENDING,
  }),
  getUserNotesSuccess: (response: GetNotesResponse) => ({
    type: noteConstants.GET_USER_NOTES_SUCCESS,
    payload: response,
  }),
  getUserNotesFailure: (error: string) => ({
    type: noteConstants.GET_USER_NOTES_FAILURE,
    payload: error,
  }),
  getRelevantNotesPending: () => ({
    type: noteConstants.GET_RELEVANT_NOTES_PENDING,
  }),
  getRelevantNotesSuccess: (response: GetNotesResponse) => ({
    type: noteConstants.GET_RELEVANT_NOTES_SUCCESS,
    payload: response,
  }),
  getRelevantNotesFailure: (error: string) => ({
    type: noteConstants.GET_RELEVANT_NOTES_FAILURE,
    payload: error,
  }),
  createNotePending: () => ({
    type: noteConstants.CREATE_NOTE_PENDING,
  }),
  createNoteSuccess: (response: CreateNoteResponse) => ({
    type: noteConstants.CREATE_NOTE_SUCCESS,
    payload: response,
  }),
  createNoteFailure: (error: string) => ({
    type: noteConstants.CREATE_NOTE_FAILURE,
    payload: error,
  }),
  editNotePending: (payload: EditNotePayload) => ({
    type: noteConstants.EDIT_NOTE_PENDING,
    payload,
  }),
  editNoteSuccess: () => ({
    type: noteConstants.EDIT_NOTE_SUCCESS,
  }),
  editNoteFailure: (error: string) => ({
    type: noteConstants.EDIT_NOTE_FAILURE,
    payload: error,
  }),
  deleteNotePending: (payload: DeleteNotePayload) => ({
    type: noteConstants.DELETE_NOTE_PENDING,
    payload,
  }),
  deleteNoteSuccess: () => ({
    type: noteConstants.DELETE_NOTE_SUCCESS,
  }),
  deleteNoteFailure: (error: string) => ({
    type: noteConstants.DELETE_NOTE_FAILURE,
    payload: error,
  }),
  toggleNoteList: () => ({
    type: noteConstants.TOGGLE_NOTELIST,
  }),
  getUserNotes: (): any => async (dispatch: Dispatch) => {
    dispatch(noteActions.getUserNotesPending());
    try {
      const res = await NoteAPI.getUserNotes();
      dispatch(noteActions.getUserNotesSuccess(res));
    } catch (error: any) {
      dispatch(noteActions.getUserNotesFailure(error.message));
    }
  },
  getRelevantNotes: (payload: RelevantNewsPayload): any => async (
    dispatch: Dispatch
  ) => {
    dispatch(noteActions.getRelevantNotesPending());
    try {
      const { stock_symbols, portfolio_names } = payload;
      const res = await NoteAPI.getRelevantNotes(
        stock_symbols,
        portfolio_names
      );
      dispatch(noteActions.getRelevantNotesSuccess(res));
    } catch (error: any) {
      dispatch(noteActions.getRelevantNotesFailure(error.message));
    }
  },
  createNote: (payload: CreateNotePayload) => async (dispatch: Dispatch) => {
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
    } catch (error: any) {
      dispatch(noteActions.createNoteFailure(error.message));
    }
  },
  editNote: (payload: EditNotePayload) => async (dispatch: Dispatch) => {
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
      await NoteAPI.editNote(
        old_title,
        new_title,
        content,
        stock_symbols,
        portfolio_names,
        external_references,
        internal_references
      );
      dispatch(noteActions.editNoteSuccess());
    } catch (error: any) {
      dispatch(noteActions.editNoteFailure(error.message));
    }
  },
  deleteNote: (payload: DeleteNotePayload) => async (dispatch: Dispatch) => {
    dispatch(noteActions.deleteNotePending(payload));
    try {
      const { title } = payload;
      await NoteAPI.deleteNote(title);
      dispatch(noteActions.deleteNoteSuccess());
    } catch (error: any) {
      dispatch(noteActions.deleteNoteFailure(error.message));
    }
  },
};

interface RelevantNewsPayload {
  stock_symbols: string[];
  portfolio_names: string[];
}

interface CreateNotePayload {
  title: string;
  content: string;
  stock_symbols: string[];
  portfolio_names: string[];
  external_references: string[];
  internal_references: string[];
}

interface EditNotePayload {
  old_title: string;
  new_title: string;
  content: string;
  stock_symbols: string[];
  portfolio_names: string[];
  external_references: string[];
  internal_references: string[];
}

interface DeleteNotePayload {
  title: string;
}

interface CreateNoteResponse {
  message: string;
}

interface GetNotesResponse {
  data: NoteInfo[];
}

interface NoteInfo {
  title: string;
  content: string;
  stock_symbols: string[];
  portfolio_names: string[];
  external_references: string[];
  internal_references: string[];
}

export default noteActions;
