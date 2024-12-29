module.exports = async function fetchTokenPrices(params: { token: string }) {
  const address = params.token || "";
  const price: number = 0;

  try {
    const response = await fetch(
      `https://api.dexscreener.io/latest/dex/tokens/${address}`
    );
    const data = await response.json();

    if (data.pairs && data.pairs.length > 0) {
      price[address] = data.pairs[0].priceUsd;
    } else {
      price[address] = 0; // Default if no price found
    }
  } catch (error) {
    console.error(`Error fetching price for token ${address}:`, error);
    price[address] = 0;
  }

  return price;
};
