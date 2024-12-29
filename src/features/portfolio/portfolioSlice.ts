import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SPLToken {
  mint: string;
  balance: number;
}

interface PortfolioState {
  solBalance?: number;
  splTokens?: SPLToken[];
  totalValue?: number;
  name?: string;
}

const initialState: PortfolioState = {
  solBalance: 0,
  splTokens: [],
  totalValue: 0,
  name: "",
};

const portfolioSlice = createSlice({
  name: "portfolio",
  initialState,
  reducers: {
    setPortfolio: (state, action: PayloadAction<PortfolioState>) => {
      return action.payload;
    },
  },
});

export const { setPortfolio } = portfolioSlice.actions;
export default portfolioSlice.reducer;
