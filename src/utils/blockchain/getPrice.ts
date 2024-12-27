/**
 * Fetch the price of a given token using QuickNode Functions.
 * @param tokenSymbol - The symbol of the token (e.g., SOL, USDC).
 */
export const getPrice = async (tokenSymbol: string) => {
    try {
      const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${tokenSymbol}&vs_currencies=usd`);
      const data = await response.json();
      return data[tokenSymbol]?.usd || null;
    } catch (error) {
      console.error("Error fetching token price:", error);
      throw new Error("Failed to fetch token price.");
    }
  };
  