import { call, put, takeLatest } from "redux-saga/effects";
import { fetchSidebarApi } from "@/lib/api/SidebarApi";
import {
  fetchSidebarRequest,
  fetchSidebarSuccess,
  fetchSidebarFailure,
} from "./SidebarSlice";
import type { SidebarItem } from "./SidebarTypes";

function* fetchSidebarSaga() {
  try {
    const items: SidebarItem[] = yield call(fetchSidebarApi);
    yield put(fetchSidebarSuccess(items));
  } catch {
    yield put(fetchSidebarFailure("사이드바 로드 실패"));
  }
}

export function* watchSidebarSaga() {
  yield takeLatest(fetchSidebarRequest.type, fetchSidebarSaga);
}
