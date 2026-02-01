import { configureStore } from "@reduxjs/toolkit";
import { rootApiSlice } from "./rootApiSlice";
import authReducer from "./authSlice";

export const store = configureStore({
  reducer: {
    [rootApiSlice.reducerPath]: rootApiSlice.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(rootApiSlice.middleware),
});
