import { initializeConnection, parseAndValidateAddress } from "@/utils/helpers";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export async function createPortfolio({
  walletAddress,
  portfolioName,
}: {
  walletAddress: string;
  portfolioName: string;
}) {
  try {
    const response = await fetch("/api/quicknode/functions/portfolio/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ walletAddress, portfolioName }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.message || "Unknown error" };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error calling QuickNode function:", error);
    return { success: false, error: "Failed to call QuickNode function" };
  }
}

export async function getPortfolio({
  portfolioName,
}: {
  portfolioName: string;
}) {
  try {
    const response = await fetch("/api/quicknode/functions/portfolio/get", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ portfolioName }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.message || "Unknown error" };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error calling QuickNode function:", error);
    return { success: false, error: "Failed to call QuickNode function" };
  }
}

export async function updatePortfolio({
  portfolioName,
  addAddresses,
  removeAddresses,
}: {
  portfolioName: string;
  addAddresses: string[];
  removeAddresses: string[];
}) {
  try {
    const response = await fetch("/api/quicknode/functions/portfolio/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ portfolioName, addAddresses, removeAddresses }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.message || "Unknown error" };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error calling QuickNode function:", error);
    return { success: false, error: "Failed to call QuickNode function" };
  }
}

export async function getPortfolioBalances({
  portfolioName,
}: {
  portfolioName: string;
}) {
  try {
    const response = await getPortfolio({ portfolioName });

    const connection = initializeConnection();

    const addresses = response.data.execution.result.addresses;

    const balances = await Promise.all(
      addresses.map(async (address: string) => {
        const publicKey = await parseAndValidateAddress(address);
        const balance = await connection.getBalance(publicKey);
        console.log("balance", balance);
        return {
          address,
          balance: balance / LAMPORTS_PER_SOL,
        };
      })
    );
    console.log("balances", balances);

    return { success: true, data: balances };
  } catch (error) {
    console.error("Error calling QuickNode function:", error);
    return { success: false, error: "Failed to call QuickNode function" };
  }
}
