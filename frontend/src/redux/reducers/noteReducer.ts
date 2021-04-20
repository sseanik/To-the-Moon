import { Action } from "redux";
import noteConstants from "../constants/noteConstants";

const noteReducer = (state = initialState, action: NoteAction) => {
  switch (action.type) {
    // Toggle
    case noteConstants.TOGGLE_NOTELIST:
      return {
        ...state,
        allNotes: {
          ...state.allNotes,
          show: !state.allNotes.show,
        },
      };
    // User notes
    case noteConstants.GET_USER_NOTES_PENDING:
      return {
        ...state,
        allNotes: {
          ...state.allNotes,
          loading: true,
          error: null,
        },
        editNote: {
          ...state.editNote,
          error: null,
        },
        deleteNote: {
          ...state.editNote,
          error: null,
        },
      };
    case noteConstants.GET_USER_NOTES_SUCCESS:
      return {
        ...state,
        touched: {
          ...state.touched,
          allNotes: false,
        },
        allNotes: {
          ...state.allNotes,
          loading: false,
          data: action.payload.data,
        },
      };
    case noteConstants.GET_USER_NOTES_FAILURE:
      return {
        ...state,
        allNotes: {
          ...state.allNotes,
          loading: false,
          error: action.payload,
        },
      };
    // Relevant notes
    case noteConstants.GET_RELEVANT_NOTES_PENDING:
      return {
        ...state,
        relevantNotes: {
          ...state.relevantNotes,
          loading: true,
          error: null,
        },
      };
    case noteConstants.GET_RELEVANT_NOTES_SUCCESS:
      return {
        ...state,
        touched: {
          ...state.touched,
          relevantNotes: false,
        },
        relevantNotes: {
          ...state.relevantNotes,
          loading: false,
          data: action.payload.data,
        },
      };
    case noteConstants.GET_RELEVANT_NOTES_FAILURE:
      return {
        ...state,
        relevantNotes: {
          ...state.relevantNotes,
          loading: false,
          error: action.payload,
        },
      };
    // Create
    case noteConstants.CREATE_NOTE_PENDING:
      return {
        ...state,
        createNote: {
          ...state.createNote,
          loading: true,
          message: null,
          error: null,
        },
      };
    case noteConstants.CREATE_NOTE_SUCCESS:
      return {
        ...state,
        touched: {
          ...state.touched,
          relevantNotes: true,
          allNotes: true,
        },
        createNote: {
          ...state.createNote,
          message: action.payload.message,
          loading: false,
        },
      };
    case noteConstants.CREATE_NOTE_FAILURE:
      return {
        ...state,
        createNote: {
          ...state.createNote,
          loading: false,
          error: action.payload,
        },
      };
    // Edit
    case noteConstants.EDIT_NOTE_PENDING:
      return {
        ...state,
        editNote: {
          ...state.editNote,
          note: action.payload.old_title,
          loading: true,
          error: null,
        },
      };
    case noteConstants.EDIT_NOTE_SUCCESS:
      return {
        ...state,
        touched: {
          ...state.touched,
          relevantNotes: true,
          allNotes: true,
        },
        editNote: {
          ...state.editNote,
          note: null,
          loading: false,
        },
      };
    case noteConstants.EDIT_NOTE_FAILURE:
      return {
        ...state,
        editNote: {
          ...state.editNote,
          note: null,
          loading: false,
          error: action.payload,
        },
      };
    // Delete
    case noteConstants.DELETE_NOTE_PENDING:
      return {
        ...state,
        deleteNote: {
          ...state.deleteNote,
          note: action.payload.title,
          loading: true,
          error: null,
        },
      };
    case noteConstants.DELETE_NOTE_SUCCESS:
      return {
        ...state,
        touched: {
          ...state.touched,
          relevantNotes: true,
          allNotes: true,
        },
        deleteNote: {
          ...state.deleteNote,
          note: null,
          loading: false,
        },
      };
    case noteConstants.DELETE_NOTE_FAILURE:
      return {
        ...state,
        deleteNote: {
          ...state.deleteNote,
          note: null,
          loading: false,
          error: action.payload,
        },
      };
    default:
      return state;
  }
};

interface NoteAction extends Action {
  payload: {
    message?: string;
    old_title?: string;
    title?: string;
    data?: Note[];
  };
}

interface Note {
  title: string;
  content: string;
  stock_symbols: string[];
  portfolio_names: string[];
  external_references: string[];
  internal_references: string[];
}

const initialState = {
  allNotes: {
    show: false,
    loading: false,
    data: [],
    error: null,
  },
  relevantNotes: {
    loading: false,
    data: [],
    error: null,
  },
  createNote: {
    loading: false,
    message: "",
    error: null,
  },
  editNote: {
    note: null,
    loading: false,
    error: null,
  },
  deleteNote: {
    note: null,
    loading: false,
    error: null,
  },
  touched: {
    allNotes: true,
    relevantNotes: true,
  },
};

export default noteReducer;
