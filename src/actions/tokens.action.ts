export async function fetchTokens({
  walletAddress,
}: {
  walletAddress: string;
}) {
  try {
    const response = await fetch(
      `/api/wallet/tokens?walletAddress=${walletAddress}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.message || "Unknown error" };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error calling fetchTokens function:", error);
    return { success: false, error: "Failed to call fetchTokens function" };
  }
}

export async function fetchJupList() {
  try {
    const response = await fetch(`https://token.jup.ag/all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.message || "Unknown error" };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error calling fetchJupList function:", error);
    return { success: false, error: "Failed to call fetchJupList function" };
  }
}

export async function fetchSolPrice() {
  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd&include_24hr_change=true`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.message || "Unknown error" };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error calling fetchSolPrice function:", error);
    return { success: false, error: "Failed to call fetchSolPrice function" };
  }
}

export async function fetchTokenData(mintAddress: string) {
    try {
      const response = await fetch(
        `https://api.dexscreener.com/latest/dex/tokens/${mintAddress}`
      );
  
      if (!response.ok) {
        console.error(`Failed to fetch token price for ${mintAddress}`);
        return null;
      }
  
      const tokenData = await response.json();
      console.log("tokenData", tokenData);
      
  
      // Extract the token price from the response data
      const data = tokenData.pairs?.[0];
      if (data) {
        return data;
      } else {
        console.error(`No data found for token ${mintAddress}`);
        return null;
      }
    } catch (error) {
      console.error("Error fetching token data:", error);
      return null;
    }
  }
  
