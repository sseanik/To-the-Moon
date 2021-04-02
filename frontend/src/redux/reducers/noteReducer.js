import noteConstants from "../constants/noteConstants";

const initialState = {
  allNotes: {
    show: false,
    loading: false,
    data: [],
    error: null,
  },
  stockNotes: {
    loading: false,
    data: [],
    error: null,
  },
  createNote: {
    loading: false,
    error: null,
  },
  editNote: {
    loading: false,
    error: null,
  },
  deleteNote: {
    loading: false,
    error: null,
  },
};

const noteReducer = (state = initialState, action) => {
  switch (action.type) {
    // Toggle
    case noteConstants.TOGGLE_NOTELIST:
      return {
        ...state,
        allNotes: {
          ...state.allNotes,
          show: !state.allNotes.show,
        }
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
      };
    case noteConstants.GET_USER_NOTES_SUCCESS:
      return {
        ...state,
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
        stockNotes: {
          ...state.stockNotes,
          loading: true,
          error: null,
        },
      };
    case noteConstants.GET_RELEVANT_NOTES_SUCCESS:
      return {
        ...state,
        stockNotes: {
          ...state.stockNotes,
          loading: false,
          data: action.payload.data,
        },
      };
    case noteConstants.GET_RELEVANT_NOTES_FAILURE:
      return {
        ...state,
        stockNotes: {
          ...state.stockNotes,
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
          error: null,
        },
      };
    case noteConstants.CREATE_NOTE_SUCCESS:
      return {
        ...state,
        createNote: {
          ...state.createNote,
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
          loading: true,
          error: null,
        },
      };
    case noteConstants.EDIT_NOTE_SUCCESS:
      return {
        ...state,
        editNote: {
          ...state.editNote,
          loading: false,
        },
      };
    case noteConstants.EDIT_NOTE_FAILURE:
      return {
        ...state,
        editNote: {
          ...state.editNote,
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
          loading: true,
          error: null,
        },
      };
    case noteConstants.DELETE_NOTE_SUCCESS:
      return {
        ...state,
        deleteNote: {
          ...state.deleteNote,
          loading: false,
        },
      };
    case noteConstants.DELETE_NOTE_FAILURE:
      return {
        ...state,
        deleteNote: {
          ...state.deleteNote,
          loading: false,
          error: action.payload,
        },
      };
    default:
      return state;
  }
};

export default noteReducer;