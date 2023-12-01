import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import { persistStore } from 'redux-persist';
import accountReducer from "./account/accountSlice";

export function makeStore() {
    return configureStore({
        reducer: {
            account: accountReducer
        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: false,
            }),
    })
}

export const store = makeStore()

export type AppState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    AppState,
    unknown,
    Action<string>
>

export const persistor = persistStore(store)    