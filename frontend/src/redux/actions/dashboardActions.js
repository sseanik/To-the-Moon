import dashboardAPI from "../../api/dashboard";
import dashboardConstants from "../constants/dashboardConstants";

const dashboardActions = {
  getDashboardsPending: () => ({
    type: dashboardConstants.GET_DASHBOARDS_PENDING,
  }),
  getDashboardsSuccess: (response) => ({
    type: dashboardConstants.GET_DASHBOARDS_SUCCESS,
    payload: response,
  }),
  getDashboardsFailure: (error) => ({
    type: dashboardConstants.GET_DASHBOARDS_FAILURE,
    payload: error,
  }),
  getDashboards: () => async (dispatch) => {
    dispatch(dashboardActions.getDashboardsPending());
    try {
      const { data } = await dashboardAPI.getUserDashboards();
      dispatch(dashboardActions.getDashboardsSuccess(data));
    } catch (error) {
      dispatch(dashboardActions.getDashboardsFailure(error.message));
    }
  },
  createDashboardPending: () => ({
    type: dashboardConstants.CREATE_DASHBOARD_PENDING,
  }),
  createDashboardSuccess: (response) => ({
    type: dashboardConstants.CREATE_DASHBOARD_SUCCESS,
    payload: response,
  }),
  createDashboardFailure: (error) => ({
    type: dashboardConstants.CREATE_DASHBOARD_FAILURE,
    payload: error,
  }),
  createDashboard: () => async (dispatch) => {
    dispatch(dashboardActions.createDashboardPending());
    try {
      const { data } = await dashboardAPI.createUserDashboard();
      dispatch(dashboardActions.createDashboardSuccess(data));
    } catch (error) {
      dispatch(dashboardActions.createDashboardFailure(error.message));
    }
  },
  deleteDashboardPending: () => ({
    type: dashboardConstants.DELETE_DASHBOARD_PENDING,
  }),
  deleteDashboardSuccess: () => ({
    type: dashboardConstants.DELETE_DASHBOARD_SUCCESS,
  }),
  deleteDashboardFailure: (error) => ({
    type: dashboardConstants.DELETE_DASHBOARD_FAILURE,
    payload: error,
  }),
  deleteDashboard: (payload) => async (dispatch) => {
    dispatch(dashboardActions.deleteDashboardPending());
    try {
      const { dashboardId } = payload;
      const { data } = await dashboardAPI.deleteDashboard(dashboardId);
      dispatch(dashboardActions.deleteDashboardSuccess(data));
    } catch (error) {
      dispatch(dashboardActions.createDashboardFailure(error.message));
    }
  },
  getBlocksPending: () => ({
    type: dashboardConstants.GET_DASHBOARD_BLOCKS_PENDING,
  }),
  getBlocksSuccess: (response) => ({
    type: dashboardConstants.GET_DASHBOARD_BLOCKS_SUCCESS,
    payload: response
  }),
  getBlocksFailure: (error) => ({
    type: dashboardConstants.GET_DASHBOARD_BLOCKS_FAILURE,
    payload: error,
  }),
  getBlocks: (payload) => async (dispatch) => {
    dispatch(dashboardActions.getBlocksPending());
    try {
      const { dashboardId } = payload;
      const { data } = await dashboardAPI.getDashboardBlocks(dashboardId);
      dispatch(dashboardActions.getBlocksSuccess(data));
    } catch (error) {
      dispatch(dashboardActions.getBlocksFailure(error.message));
    }
  },
  getBlockMetaPending: () => ({
    type: dashboardConstants.GET_BLOCK_META_PENDING,
  }),
  getBlockMetaSuccess: (response) => ({
    type: dashboardConstants.GET_BLOCK_META_SUCCESS,
    payload: response
  }),
  getBlockMetaFailure: (error) => ({
    type: dashboardConstants.GET_BLOCK_META_FAILURE,
    payload: error,
  }),
  getBlockMeta: (payload) => async (dispatch) => {
    dispatch(dashboardActions.getBlockMetaPending());
    try {
      const { blockId } = payload;
      const { data } = await dashboardAPI.getBlockMeta(blockId);
      dispatch(dashboardActions.getBlockMetaSuccess(data));
    } catch (error) {
      dispatch(dashboardActions.getBlockMetaFailure(error.message));
    }
  },
  createBlockPending: () => ({
    type: dashboardConstants.CREATE_BLOCK_PENDING,
  }),
  createBlockSuccess: (response) => ({
    type: dashboardConstants.CREATE_BLOCK_SUCCESS,
    payload: response
  }),
  createBlockFailure: (error) => ({
    type: dashboardConstants.CREATE_BLOCK_FAILURE,
    payload: error,
  }),
  createBlock: (payload) => async (dispatch) => {
    dispatch(dashboardActions.createBlockPending());
    try {
      const { dashboardId, type, meta } = payload;
      const { data } = await dashboardAPI.createDashboardBlock(dashboardId, type, meta);
      dispatch(dashboardActions.createBlockSuccess(data));
    } catch (error) {
      dispatch(dashboardActions.createDashboardFailure(error.message));
    }
  },
  deleteBlockPending: () => ({
    type: dashboardConstants.DELETE_BLOCK_PENDING,
  }),
  deleteBlockSuccess: (response) => ({
    type: dashboardConstants.DELETE_BLOCK_SUCCESS,
    payload: response
  }),
  deleteBlockFailure: (error) => ({
    type: dashboardConstants.DELETE_BLOCK_FAILURE,
    payload: error,
  }),
  deleteBlock: (payload) => async (dispatch) => {
    dispatch(dashboardActions.deleteBlockPending());
    try {
      const { blockId } = payload;
      const { data } = await dashboardAPI.deleteBlock(blockId);
      dispatch(dashboardActions.deleteBlockSuccess(data));
    } catch (error) {
      dispatch(dashboardActions.deleteBlockFailure(error.message));
    }
  },
};

export default dashboardActions;
