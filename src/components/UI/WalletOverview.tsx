'use client';

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { processStreamEvent } from '@/utils/blockchain/streamHandler';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { usePortfolioName } from '@/hooks/usePortfolioName';
import { getPortfolioBalances } from '@/actions/quicknode.actions';
import { fetchSolPrice, fetchTokenData, fetchTokens } from '@/actions/tokens.action';
import { calculatePortfolioValue } from '@/utils/helpers';
import { Tokens } from '@/types/tokens.types';

interface TokenBalance {
  mint: string;
  balance: number;
  price: number;
  change24h: number;
}

interface TokenMetaData {
  account: {
    data: {
      parsed: {
        info: {
          mint: string
          tokenAmount: {
            uiAmount: number
          }
        }
      }
    }
  }
}

interface WalletState {
  address: string;
  tokens: TokenBalance[];
}

const WalletOverview: React.FC = () => {
  const wallet = useSelector((state: { wallet: WalletState }) => state.wallet);
  const portfolioName = usePortfolioName();

  const [totalValue, setTotalValue] = useState<number>(0);
  const [totalChange24h, setTotalChange24h] = useState<number>(0);
  const [tokens, setTokens] = useState<Tokens[]>([]); // Fixed to array of Tokens
  const [portfolioLoading, setPortfolioLoading] = useState<boolean>(false);

  useEffect(() => {
    if (portfolioName) {
      const initializePortfolio = async () => {
        setPortfolioLoading(true);
        try {
          const response = await getPortfolioBalances({ portfolioName });
          if (response.success) {
            const walletAddress = response.data?.[0]?.address || '';
            const tokenResponse = await fetchTokens({ walletAddress });

            if (tokenResponse.success) {
              const solBalance = response.data?.[0]?.balance || 0;
              const solPriceResponse = await fetchSolPrice();
              const solPrice = solPriceResponse.success ? solPriceResponse.data.solana.usd : 0;
              const sol24hrChange = solPriceResponse.success
                ? solPriceResponse.data.solana.usd_24h_change
                : 0;

              const solValue = solBalance * solPrice;

              const assets = await Promise.all(
                tokenResponse.data.tokens.map(async (tokenAccountInfo: TokenMetaData) => {
                  const accountData = tokenAccountInfo.account.data.parsed.info;
                  const tokenMintAddress = accountData.mint;
                  const tokenBalance = accountData.tokenAmount.uiAmount || 0;

                  const tokenData = await fetchTokenData(tokenMintAddress);
                  const tokenPrice = Number(tokenData?.priceUsd) || 0;
                  const tokenValue = tokenBalance * tokenPrice;

                  return {
                    mintAddress: tokenMintAddress,
                    name: tokenData?.baseToken?.name || 'Unknown Token',
                    symbol: tokenData?.baseToken?.symbol || 'Unknown',
                    imageUrl: tokenData?.info?.imageUrl || '',
                    balance: tokenBalance,
                    price: tokenPrice,
                    value: tokenValue,
                    priceChange: 0, // Add appropriate value
                    url: '', // Placeholder
                    roi: '', // Placeholder
                  };
                })
              );

              const tokenPortfolioValue = await calculatePortfolioValue(assets);
              setTotalValue(solValue + tokenPortfolioValue);
              setTotalChange24h(sol24hrChange);
              setTokens(assets);
            }
          }
        } catch (error) {
          console.error('Error fetching portfolio data:', error);
        } finally {
          setPortfolioLoading(false);
        }
      };

      initializePortfolio();

      const handleStreamEvent = (event: { type: string; }) => {
        processStreamEvent(event);
        if (event.type === 'TRANSFER') {
          initializePortfolio();
        }
      };

      const eventSource = new EventSource('/api/webhook');
      eventSource.onmessage = (e) => handleStreamEvent(JSON.parse(e.data));

      return () => eventSource.close();
    }
  }, [wallet.address, portfolioName]);

  return (
    <>
      {!portfolioLoading ? (
        <>
          <div className="bg-gray-900 p-6 rounded-lg shadow-md mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Portfolio Value</p>
                <p className="text-3xl py-2 text-gray-100">${totalValue.toFixed(2)}</p>
                <p
                  className={`text-sm ${totalChange24h >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}
                >
                  24h Change: {totalChange24h.toFixed(2)}%
                </p>
              </div>
              <div
                className={`flex items-center gap-1 text-2xl ${totalChange24h >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}
              >
                {totalChange24h >= 0 ? <ArrowUpRight size={30} /> : <ArrowDownRight size={30} />}
                {totalChange24h.toFixed(2)}%
              </div>
            </div>
          </div>
          <div className="bg-gray-900 p-6 rounded-lg shadow-md">
            <h1 className="text-xl font-semibold mb-4">Assets</h1>
            {tokens.length > 0 ? (
              <table className="w-full text-gray-100">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="px-4 py-2">Asset</th>
                    <th className="px-4 py-2">Symbol</th>
                    <th className="px-4 py-2">Price (USD)</th>
                    <th className="px-4 py-2">Balance</th>
                    <th className="px-4 py-2">Value (USD)</th>
                  </tr>
                </thead>
                <tbody>
                  {tokens.map((token, index) => (
                    <tr key={index} className="border-b border-gray-800">
                      <td className="px-4 py-2">{token.name}</td>
                      <td className="px-4 py-2">{token.symbol}</td>
                      <td className="px-4 py-2">${token.price.toFixed(2)}</td>
                      <td className="px-4 py-2">{token.balance.toFixed(2)}</td>
                      <td className="px-4 py-2">${token.value.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-400">No assets found.</p>
            )}
          </div>
        </>
      ) : (
        <p className="text-gray-400">Loading portfolio...</p>
      )}
    </>
  );
};

export default WalletOverview;
