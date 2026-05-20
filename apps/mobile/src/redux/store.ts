import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import { api } from "./api";

const authPersistConfig = {
  key: "auth",
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export const persistor = store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
