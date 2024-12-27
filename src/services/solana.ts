import { Connection, PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

const connection = new Connection("https://blissful-cosmopolitan-haze.solana-devnet.quiknode.pro/f8ba66e8edb0d43d768109c5b5b15778ad374284");

export interface SPLToken {
  mint: string;
  balance: number;
}

export const fetchBalances = async (
  address: string
): Promise<{ solBalance: number; splTokens: SPLToken[] }> => {
  const publicKey = new PublicKey(address);
  const solBalance = await connection.getBalance(publicKey) / 1e9;

  const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
    publicKey,
    { programId: TOKEN_PROGRAM_ID }
  );

  const splTokens = tokenAccounts.value.map((account) => ({
    mint: account.account.data.parsed.info.mint,
    balance: account.account.data.parsed.info.tokenAmount.uiAmount,
  }));

  return { solBalance, splTokens };
};
