import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type AccountState = {
    accounts: any[]
}

const initialState: AccountState = {
    accounts: []
}
export const accountSlice = createSlice({
    name: 'account',
    initialState: initialState,
    reducers: {
        setAccounts: (state: AccountState, action: PayloadAction<any[]>) => {
            state.accounts = action.payload
        }
    }
})
export const { setAccounts } = accountSlice.actions;
export default accountSlice.reducer;