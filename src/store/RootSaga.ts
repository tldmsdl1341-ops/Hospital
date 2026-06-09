import { all, fork } from "redux-saga/effects";
import { watchSidebarSaga } from "@/features/sidebar/SidebarSaga";

export default function* rootSaga() {
  yield all([fork(watchSidebarSaga)]);
}
