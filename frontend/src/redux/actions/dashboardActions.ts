import dashboardAPI from "../../api/dashboard";
import dashboardConstants from "../constants/dashboardConstants";
import { Dispatch } from "redux";

const dashboardActions = {
  getDashboardsPending: () => ({
    type: dashboardConstants.GET_DASHBOARDS_PENDING,
  }),
  getDashboardsSuccess: (response: Array<string>) => ({
    type: dashboardConstants.GET_DASHBOARDS_SUCCESS,
    payload: response,
  }),
  getDashboardsFailure: (error: string) => ({
    type: dashboardConstants.GET_DASHBOARDS_FAILURE,
    payload: error,
  }),
  getDashboards: () => async (dispatch: Dispatch) => {
    dispatch(dashboardActions.getDashboardsPending());
    try {
      const { data } = await dashboardAPI.getUserDashboards();
      dispatch(dashboardActions.getDashboardsSuccess(data));
    } catch (error: any) {
      dispatch(dashboardActions.getDashboardsFailure(error.message));
    }
  },
  createDashboardPending: () => ({
    type: dashboardConstants.CREATE_DASHBOARD_PENDING,
  }),
  createDashboardSuccess: (response: IdRes) => ({
    type: dashboardConstants.CREATE_DASHBOARD_SUCCESS,
    payload: response,
  }),
  createDashboardFailure: (error: string) => ({
    type: dashboardConstants.CREATE_DASHBOARD_FAILURE,
    payload: error,
  }),
  createDashboard: () => async (dispatch: Dispatch) => {
    dispatch(dashboardActions.createDashboardPending());
    try {
      const { data } = await dashboardAPI.createUserDashboard();
      dispatch(dashboardActions.createDashboardSuccess(data));
    } catch (error: any) {
      dispatch(dashboardActions.createDashboardFailure(error.message));
    }
  },
  deleteDashboardPending: () => ({
    type: dashboardConstants.DELETE_DASHBOARD_PENDING,
  }),
  deleteDashboardSuccess: () => ({
    type: dashboardConstants.DELETE_DASHBOARD_SUCCESS,
  }),
  deleteDashboardFailure: (error: string) => ({
    type: dashboardConstants.DELETE_DASHBOARD_FAILURE,
    payload: error,
  }),
  deleteDashboard: (payload: DeleteDashboardParams) => async (
    dispatch: Dispatch
  ) => {
    dispatch(dashboardActions.deleteDashboardPending());
    try {
      const { dashboardId } = payload;
      await dashboardAPI.deleteDashboard(dashboardId);
      dispatch(dashboardActions.deleteDashboardSuccess());
    } catch (error: any) {
      dispatch(dashboardActions.createDashboardFailure(error.message));
    }
  },
  getBlocksPending: () => ({
    type: dashboardConstants.GET_DASHBOARD_BLOCKS_PENDING,
  }),
  getBlocksSuccess: (response: Array<string>) => ({
    type: dashboardConstants.GET_DASHBOARD_BLOCKS_SUCCESS,
    payload: response,
  }),
  getBlocksFailure: (error: string) => ({
    type: dashboardConstants.GET_DASHBOARD_BLOCKS_FAILURE,
    payload: error,
  }),
  getBlocks: (payload: GetBlocksParams) => async (dispatch: Dispatch) => {
    dispatch(dashboardActions.getBlocksPending());
    try {
      const { dashboardId } = payload;
      const { data } = await dashboardAPI.getDashboardBlocks(dashboardId);
      dispatch(dashboardActions.getBlocksSuccess(data));
    } catch (error:any) {
      dispatch(dashboardActions.getBlocksFailure(error.message));
    }
  },
  getBlockMetaPending: (blockId: string) => ({
    type: dashboardConstants.GET_BLOCK_META_PENDING,
    payload: { blockId },
  }),
  getBlockMetaSuccess: (blockId: string, response: BlockMetaRes) => ({
    type: dashboardConstants.GET_BLOCK_META_SUCCESS,
    payload: { blockId, response },
  }),
  getBlockMetaFailure: (blockId: string, error: string) => ({
    type: dashboardConstants.GET_BLOCK_META_FAILURE,
    payload: { blockId, error },
  }),
  getBlockMeta: (payload: GetBlockMetaParams) => async (dispatch: Dispatch) => {
    const { blockId } = payload;
    dispatch(dashboardActions.getBlockMetaPending(blockId));
    try {
      const { data } = await dashboardAPI.getBlockMeta(blockId);
      dispatch(dashboardActions.getBlockMetaSuccess(blockId, data));
    } catch (error:any) {
      dispatch(dashboardActions.getBlockMetaFailure(blockId, error.message));
    }
  },
  createBlockPending: () => ({
    type: dashboardConstants.CREATE_BLOCK_PENDING,
  }),
  createBlockSuccess: (response: IdRes) => ({
    type: dashboardConstants.CREATE_BLOCK_SUCCESS,
    payload: response,
  }),
  createBlockFailure: (error: string) => ({
    type: dashboardConstants.CREATE_BLOCK_FAILURE,
    payload: error,
  }),
  createBlock: (payload: CreateBlockParams) => async (dispatch: Dispatch) => {
    dispatch(dashboardActions.createBlockPending());
    try {
      const { dashboardId, type, meta } = payload;
      const { data } = await dashboardAPI.createDashboardBlock(
        dashboardId,
        type,
        meta
      );
      dispatch(dashboardActions.createBlockSuccess(data));
    } catch (error:any) {
      dispatch(dashboardActions.createDashboardFailure(error.message));
    }
  },
  deleteBlockPending: () => ({
    type: dashboardConstants.DELETE_BLOCK_PENDING,
  }),
  deleteBlockSuccess: (response: IdRes) => ({
    type: dashboardConstants.DELETE_BLOCK_SUCCESS,
    payload: response,
  }),
  deleteBlockFailure: (error: string) => ({
    type: dashboardConstants.DELETE_BLOCK_FAILURE,
    payload: error,
  }),
  deleteBlock: (payload: DeleteBlockParams) => async (dispatch: Dispatch) => {
    dispatch(dashboardActions.deleteBlockPending());
    try {
      const { blockId } = payload;
      const { data } = await dashboardAPI.deleteBlock(blockId);
      dispatch(dashboardActions.deleteBlockSuccess(data));
    } catch (error:any) {
      dispatch(dashboardActions.deleteBlockFailure(error.message));
    }
  },
};

interface DashboardIdParam {
  dashboardId: string;
}

interface BlockIdParam {
  blockId: string;
}

interface BlockMeta {
  type: string;
  meta: { [key: string]: any };
}

interface IdRes {
  id: string;
}

type DeleteDashboardParams = DashboardIdParam;
type GetBlocksParams = DashboardIdParam;
type GetBlockMetaParams = BlockIdParam;
type CreateBlockParams = DashboardIdParam & BlockMeta;
type DeleteBlockParams = BlockIdParam;
type BlockMetaRes = IdRes & BlockMeta;


export default dashboardActions;
