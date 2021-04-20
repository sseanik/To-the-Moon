import dashboardConstants from "../constants/dashboardConstants";

const initialState = {
  getDashboards: {
    loading: false,
    error: null,
  },
  createDashboard: {
    loading: false,
    error: null,
  },
  deleteDashboard: {
    loading: false,
    error: null,
  },
  getBlocks: {
    loading: false,
    error: null,
  },
  getBlocksMeta: {
    loading: {},
    error: {},
  },
  createBlock: {
    loading: false,
    error: null,
  },
  deleteBlock: {
    loading: false,
    error: null,
  },
  dashboardId: "",
  blocks: [],
  meta: {},
};

const dashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case dashboardConstants.GET_DASHBOARDS_PENDING:
      return {
        ...state,
        getDashboards: {
          ...state.getDashboards,
          loading: true,
          error: null,
        },
      };
    case dashboardConstants.GET_DASHBOARDS_SUCCESS:
      const dashboardId = action.payload[0];
      return {
        ...state,
        dashboardId,
        blocks: [],
        meta: {},
        getDashboards: {
          ...state.getDashboards,
          loading: false,
        },
      };
    case dashboardConstants.GET_DASHBOARDS_FAILURE:
      return {
        ...state,
        dashboardId: "",
        getDashboards: {
          ...state.getDashboards,
          loading: false,
          error: action.payload,
        },
      };
    case dashboardConstants.CREATE_DASHBOARD_PENDING:
      return {
        ...state,
        createDashboard: {
          ...state.createDashboard,
          loading: true,
          error: null,
        },
      };
    case dashboardConstants.CREATE_DASHBOARD_SUCCESS:
      return {
        ...state,
        dashboardId: action.payload.id,
        createDashboard: {
          ...state.createDashboard,
          loading: false,
        },
      };
    case dashboardConstants.CREATE_DASHBOARD_FAILURE:
      return {
        ...state,
        dashboardId: null,
        createDashboard: {
          ...state.createDashboard,
          loading: false,
          error: action.payload,
        },
      };
    case dashboardConstants.DELETE_DASHBOARD_PENDING:
      return {
        ...state,
        deleteDashboard: {
          ...state.deleteDashboard,
          loading: true,
          error: null,
        },
      };
    case dashboardConstants.DELETE_DASHBOARD_SUCCESS:
      return {
        ...state,
        dashboardId: "",
        blocks: [],
        meta: {},
        deleteDashboard: {
          ...state.deleteDashboard,
          loading: false,
        },
      };
    case dashboardConstants.DELETE_DASHBOARD_FAILURE:
      return {
        ...state,
        deleteDashboard: {
          ...state.deleteDashboard,
          loading: false,
          error: action.payload,
        },
      };
    case dashboardConstants.GET_DASHBOARD_BLOCKS_PENDING:
      return {
        ...state,
        getBlocks: {
          ...state.getBlocks,
          loading: true,
          error: null,
        },
      };
    case dashboardConstants.GET_DASHBOARD_BLOCKS_SUCCESS:
      return {
        ...state,
        blocks: action.payload,
        getBlocks: {
          ...state.getBlocks,
          loading: false,
        },
      };
    case dashboardConstants.GET_DASHBOARD_BLOCKS_FAILURE:
      return {
        ...state,
        blocks: [],
        getBlocks: {
          ...state.getBlocks,
          loading: false,
          error: action.payload,
        },
      };
    case dashboardConstants.GET_BLOCK_META_PENDING:
      const newLoadingPending = { ...state.getBlocksMeta.loading };
      newLoadingPending[action.payload.blockId] = true;
      const newErrorPending = { ...state.getBlocksMeta.error };
      newErrorPending[action.payload.blockId] = null;
      return {
        ...state,
        getBlocksMeta: {
          ...state.getBlocksMeta,
          loading: { ...newLoadingPending },
          error: { ...newErrorPending },
        },
      };
    case dashboardConstants.GET_BLOCK_META_SUCCESS:
      const { id, type, meta } = action.payload.response;
      const newBlockMeta = { ...state.meta };
      newBlockMeta[id] = { type, meta };
      const newLoadingSuccess = { ...state.getBlocksMeta.loading };
      newLoadingSuccess[action.payload.blockId] = false;
      return {
        ...state,
        meta: { ...newBlockMeta },
        getBlocksMeta: {
          ...state.getBlocksMeta,
          loading: { ...newLoadingSuccess },
        },
      };
    case dashboardConstants.GET_BLOCK_META_FAILURE:
      const newLoadingFailure = { ...state.getBlocksMeta.loading };
      newLoadingFailure[action.payload.blockId] = false;
      const newErrorFailure = { ...state.getBlocksMeta.error };
      newErrorFailure[action.payload.blockId] = action.payload.error;
      return {
        ...state,
        getBlocksMeta: {
          ...state.getBlocksMeta,
          loading: { ...newLoadingFailure },
          error: { ...newErrorFailure },
        },
      };
    case dashboardConstants.CREATE_BLOCK_PENDING:
      return {
        ...state,
        createBlock: {
          ...state.createBlock,
          loading: true,
          error: null,
        },
      };
    case dashboardConstants.CREATE_BLOCK_SUCCESS:
      return {
        ...state,
        blocks: [...state.blocks, action.payload.id],
        createBlock: {
          ...state.createBlock,
          loading: false,
        },
      };
    case dashboardConstants.CREATE_BLOCK_FAILURE:
      return {
        ...state,
        createBlock: {
          ...state.createBlock,
          loading: false,
          error: action.payload,
        },
      };
    case dashboardConstants.DELETE_BLOCK_PENDING:
      return {
        ...state,
        deleteBlock: {
          ...state.deleteBlock,
          loading: true,
          error: null,
        },
      };
    case dashboardConstants.DELETE_BLOCK_SUCCESS:
      return {
        ...state,
        blocks: state.blocks.filter((item) => item !== action.payload.id),
        deleteBlock: {
          ...state.deleteBlock,
          loading: false,
        },
      };
    case dashboardConstants.DELETE_BLOCK_FAILURE:
      return {
        ...state,
        deleteBlock: {
          ...state.deleteBlock,
          loading: false,
          error: action.payload,
        },
      };
    default:
      return state;
  }
};

export default dashboardReducer;
