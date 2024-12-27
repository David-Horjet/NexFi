import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WalletState {
  address: string;
  connected: boolean;
  balance: number;
}

const initialState: WalletState = {
  address: "",
  connected: false,
  balance: 0,
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    connectWallet: (state, action: PayloadAction<string>) => {
      state.address = action.payload;
      state.connected = true;
    },
    disconnectWallet: (state) => {
      state.address = "";
      state.connected = false;
    },
    setWallet(
      state,
      action: PayloadAction<{ address: string; balance: number }>
    ) {
      state.address = action.payload.address;
      state.balance = action.payload.balance;
    },
    updateBalance: (state, action) => {
      state.balance += action.payload; // Update balance
    },
  },
});

export const { connectWallet, disconnectWallet, setWallet, updateBalance } = walletSlice.actions;
export default walletSlice.reducer;
