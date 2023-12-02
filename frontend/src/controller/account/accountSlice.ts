import { PayloadAction, createSlice } from "@reduxjs/toolkit";
type Account = {
    wallet_address: string,
    onemes_name: string,
    onemes_account_address: string,
    chain: string,
    email: string,
    phone_number: string,
    twitter: string,
    telegram: string,
    use_wallet_address_to_receive: boolean,
    status: number,
    created_at: string
}

type AccountState = {
    accounts: Account[],
    selectedAccount: Account,
}

const initialState: AccountState = {
    accounts: [],
    selectedAccount: {
        wallet_address: "",
        onemes_name: "",
        onemes_account_address: "",
        chain: "",
        email: "",
        phone_number: "",
        twitter: "",
        telegram: "",
        use_wallet_address_to_receive: false,
        status: 1,
        created_at: "2023-12-20"
    }
}
export const accountSlice = createSlice({
    name: 'account',
    initialState: initialState,
    reducers: {
        setAccounts: (state: AccountState, action: PayloadAction<any[]>) => {
            state.accounts = action.payload;
            if (action.payload.length) {
                state.selectedAccount = action.payload[0]
            }
        },
        setSelectedAccount: (state: AccountState, action: PayloadAction<Account>) => {
            state.selectedAccount = action.payload
        }
    }
})
export const { setAccounts, setSelectedAccount } = accountSlice.actions;
export default accountSlice.reducer;