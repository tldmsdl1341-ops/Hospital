import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import navReducer from "@/features/nav/NavSlice";
import sidebarReducer from "@/features/sidebar/SidebarSlice";
import rootSaga from "./RootSaga";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    nav: navReducer,
    sidebar: sidebarReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type RootState = {
  nav: ReturnType<typeof navReducer>;
  sidebar: ReturnType<typeof sidebarReducer>;
};
