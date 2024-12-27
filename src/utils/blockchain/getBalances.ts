import { Connection, PublicKey } from '@solana/web3.js';

/**
 * Fetch the SOL and token balances of a given wallet address.
 * @param connection - Solana connection instance.
 * @param publicKey - Wallet public key.
 */
export const getBalances = async (connection: Connection, publicKey: PublicKey) => {
  try {
    // Fetch SOL balance
    const solBalance = await connection.getBalance(publicKey);

    // Fetch token balances
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
      programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
    });

    const tokenBalances = tokenAccounts.value.map(account => ({
      mint: account.account.data.parsed.info.mint,
      balance: account.account.data.parsed.info.tokenAmount.uiAmount,
    }));

    return { solBalance: solBalance / 1e9, tokenBalances };
  } catch (error) {
    console.error("Error fetching balances:", error);
    throw new Error("Failed to fetch balances.");
  }
};
