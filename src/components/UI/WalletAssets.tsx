'use client';

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import web3 from '@solana/web3.js';

const WalletAssets: React.FC = () => {
  const wallet = useSelector((state: {address: string}) => state.wallet); // Assuming wallet.address contains the public key
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Utility to fetch token metadata and pricing
  const fetchTokenMetadataAndPrice = async (mintAddress: string) => {
    try {
      // Fetch token metadata using Solana Token List
      const tokenList = await fetch('https://cdn.jsdelivr.net/gh/solana-labs/token-list@main/src/tokens/solana.tokenlist.json');
      const { tokens } = await tokenList.json();
      const tokenInfo = tokens.find((token: {address: string}) => token.address === mintAddress);

      // Fetch price data (e.g., from CoinGecko)
      const priceResponse = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${mintAddress}`);
      console.log(priceResponse, mintAddress, "mintAddress");
      
      const priceData = await priceResponse.json();
      console.log(priceData);
      

      return {
        name: tokenInfo?.name || priceData?.pairs[0].baseToken.name || 'Unknown Token',
        symbol: tokenInfo?.symbol || priceData?.pairs[0].baseToken.symbol || 'Unknown',
        price: priceData[mintAddress]?.usd ||priceData?.pairs[0].priceUsd || 0,
      };
    } catch (error) {
      console.error(`Error fetching metadata or price for ${mintAddress}:`, error);
      return {
        name: 'Unknown Token',
        symbol: 'Unknown',
        price: 0,
      };
    }
  };

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setLoading(true);

        // Initialize Solana connection
        const connection = new web3.Connection(
          'https://blissful-cosmopolitan-haze.solana-mainnet.quiknode.pro/f8ba66e8edb0d43d768109c5b5b15778ad374284'
        );

        // Fetch all token accounts for the wallet
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
          new web3.PublicKey(wallet.address),
          { programId: new web3.PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA') }
        );

        const assets = await Promise.all(
          tokenAccounts.value.map(async (tokenAccountInfo) => {
            const accountData = tokenAccountInfo.account.data.parsed.info;
            const mintAddress = accountData.mint;
            const balance = accountData.tokenAmount.uiAmount || 0;

            // Fetch token metadata and price
            const { name, symbol, price } = await fetchTokenMetadataAndPrice(mintAddress);
            const value = balance * price;

            return {
              mintAddress,
              name,
              symbol,
              balance,
              price: Number(price),
              value,
              roi: `${((value - balance) / balance).toFixed(2)}%`, // Example ROI calculation
            };
          })
        );

        setTokens(assets);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tokens:', error);
        setLoading(false);
      }
    };

    if (wallet?.address) {
      fetchAssets();
    }
  }, [wallet]);

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Assets</h1>
        <button
          className="bg-gray-800 px-4 py-2 rounded-lg text-sm hover:bg-gray-700"
          onClick={() => console.log('Handle Filter by App/Token')}
        >
          By Token
        </button>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading assets...</p>
      ) : tokens.length > 0 ? (
        <div>
          <div className="flex justify-between text-gray-500 mb-2">
            <p>Asset</p>
            <p>Symbol</p>
            <p>Price (USD)</p>
            <p>Balance</p>
            <p>Value (USD)</p>
            <p>ROI</p>
          </div>
          {tokens.map((token, index) => (
            <div
              key={index}
              className="flex justify-between items-center py-2 border-b border-gray-800"
            >
              <p>{token.name}</p>
              <p>{token.symbol}</p>
              <p>${token.price.toFixed(2)}</p>
              <p>{token.balance.toFixed(2)}</p>
              <p>${token.value.toFixed(2)}</p>
              <p>{token.roi}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No assets found.</p>
      )}
    </div>
  );
};

export default WalletAssets;
