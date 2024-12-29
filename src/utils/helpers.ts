import { fetchTokenData } from "@/actions/tokens.action";
import { Tokens } from "@/types/tokens.types";
import { Connection, PublicKey } from "@solana/web3.js";

export async function parseAndValidateAddress(
  walletAddress: string | null
): Promise<PublicKey> {
  if (!walletAddress) {
    throw new Error("Wallet address is required.");
  }
  try {
    return new PublicKey(walletAddress);
  } catch {
    throw new Error("Invalid wallet address.");
  }
}

export function initializeConnection(): Connection {
  if (!process.env.NEXT_PUBLIC_SOLANA_RPC_URL) {
    throw new Error("SOLANA_RPC_URL is not set");
  }
  return new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL);
}

export function abbreviateAddress(
  address: string,
  startLength = 4,
  endLength = 4
) {
  if (address.length <= startLength + endLength) {
    return address; // Return the original address if it's too short to abbreviate
  }
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
}

export async function calculatePortfolioValue(
  tokens: Tokens[]
) {
  let totalValue = 0;

  for (const token of tokens) {
    try {
      const tokenData = await fetchTokenData(token.mintAddress);
      const price = Number(tokenData?.priceUsd) || null;
      if (price !== null) {
        totalValue += price * token.balance;
      } else {
        console.warn(
          `Skipping token ${token.mintAddress} due to missing price data`
        );
      }
    } catch (error) {
      console.error(
        `Error calculating value for token ${token.mintAddress}:`,
        error
      );
    }
  }

  return totalValue;
}

export function handleError(error: unknown): Response {
  const message =
    error instanceof Error ? error.message : "An unexpected error occurred";
  return new Response(JSON.stringify({ error: message }), {
    headers: { "Content-Type": "application/json" },
    status:
      error instanceof Error && error.message === "Wallet address is required."
        ? 400
        : 500,
  });
}
