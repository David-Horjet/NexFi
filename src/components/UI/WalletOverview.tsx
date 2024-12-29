'use client';

import React, { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useDispatch, useSelector } from 'react-redux';
import { Connection, PublicKey } from '@solana/web3.js';
import { setWallet } from '@/features/wallet/walletSlice';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useNetworkConnection } from '@/hooks/useNetwork';
import { processStreamEvent } from '@/utils/blockchain/streamHandler';
import { setPortfolio } from '@/features/portfolio/portfolioSlice';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { usePortfolioName } from '@/hooks/usePortfolioName';
import { getPortfolioBalances } from '@/actions/quicknode.actions';
import { fetchJupList, fetchTokenData, fetchTokens } from '@/actions/tokens.action';
import { calculatePortfolioValue } from '@/utils/helpers';

interface TokenBalance {
  mint: string;
  balance: number;
  price: number;
  change24h: number;
}

interface WalletState {
  address: string;
  tokens: TokenBalance[];
}

const WalletOverview: React.FC = () => {
  const dispatch = useDispatch();
  const { connected, publicKey, disconnect } = useWallet();
  const { connection, network } = useNetworkConnection();
  const wallet = useSelector((state: { wallet: WalletState }) => state.wallet);

  const portfolioName = usePortfolioName();

  const [totalValue, setTotalValue] = useState<number>(0);
  const [totalChange24h, setTotalChange24h] = useState<number>(0);
  const [portfolioLoading, setPortfolioLoading] = useState<boolean>(false);

  const fetchTokenBalances = async (publicKey: PublicKey) => {
    // This is a simplified example. In a real-world scenario, you'd need to use a token program
    // to fetch all token balances associated with the wallet.
    const solBalance = await connection.getBalance(publicKey);
    const tokenBalances: TokenBalance[] = [
      { mint: 'SOL', balance: solBalance / 1e9, price: 0, change24h: 0 },
      // Add other tokens here
    ];
    return tokenBalances;
  };

  console.log(portfolioName);
  const walletAddress = publicKey ? publicKey.toBase58() : ""


  if (portfolioName) {
    useEffect(() => {
      const initializePortfolio = async () => {
        console.log("I'm fetching");

        setPortfolioLoading(true)
        try {
          const response = await getPortfolioBalances({
            portfolioName,
          });
          console.log("response", response);
          if (response.success) {
            const tokenResponse = await fetchTokens({ walletAddress: response.data ? response.data[0].address : walletAddress })
            console.log("tokenResponse", tokenResponse)
            if (tokenResponse.success) {
              const jupListResponse = await fetchJupList();
              console.log("jupListResponse", jupListResponse);
              if (jupListResponse.success) {
                const assets = await Promise.all(
                  tokenResponse.data.tokens.map(async (tokenAccountInfo: any) => {
                    const accountData = tokenAccountInfo.account.data.parsed.info;
                    const tokenMintAddress = accountData.mint;
                    const tokenBalance = accountData.tokenAmount.uiAmount || 0;

                    // const mintInfo = jupListResponse.data?.find((jupToken: { address: string }) => jupToken.address === tokenMintAddress);

                    // Fetch token metadata and price
                    const tokenData = await fetchTokenData(tokenMintAddress) || 0;
                    const tokenPrice = Number(tokenData.priceUsd) || 0
                    const tokenValue = tokenBalance * tokenPrice;
                    // console.log("tokenData", tokenBalance, tokenData, tokenPrice, tokenValue)

                    return {
                      mintAddress: tokenMintAddress,
                      name: tokenData?.baseToken?.name || "Unknown token",
                      symbol: tokenData?.baseToken?.symbol || "Unknown token",
                      imageUrl: tokenData?.info?.imageUrl || "Unknown token",
                      priceChange: tokenData?.priceChange || null,
                      url: tokenData?.url || "",
                      balance: tokenBalance,
                      price: Number(tokenPrice),
                      value: tokenValue,
                      roi: `${((tokenValue - tokenBalance) / tokenBalance).toFixed(2)}%`, // Example ROI calculation
                    };
                  })
                );
                console.log("assets", assets)
                const totalValue = await calculatePortfolioValue(assets);
                console.log("totalValue", totalValue)
                // setPortfolio({
                //   splTokens: jupListResponse.data,
                //   totalValue,
                // });
              }
            }
          }
          setPortfolioLoading(false)
        } catch (error) {
          console.error('Error fetching portfolio data:', error);
          setPortfolioLoading(false)
        }
      };

      initializePortfolio();

      // Set up QuickNode Stream Webhook Listener
      const handleStreamEvent = (event: any) => {
        console.log('Stream Event:', event);
        processStreamEvent(event);

        // Update portfolio on balance change
        if (event.type === 'TRANSFER') {
          initializePortfolio();
        }
      };
      const eventSource = new EventSource('/api/streams'); // Assuming streams are handled via server-sent events
      eventSource.onmessage = (e) => handleStreamEvent(JSON.parse(e.data));

      return () => eventSource.close();
    }, [wallet.address]);
  }


  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-md">
      {!portfolioLoading ? (
        <div className='flex items-center justify-between'>
          <div className="flex items-center space-x-4">
            {/* <div className="w-12 h-12 rounded-full bg-gray-700"></div> */}
            <div>
              <p className="text-sm font-medium text-gray-500 truncate">Total Portfolio Value</p>
              {/* <h2 className="text-lg font-semibold">
                {wallet.address.slice(0, 5)}...
                {wallet.address.slice(-5)}
              </h2> */}
              <p className="text-3xl py-2 text-gray-400">
                ${totalValue.toFixed(2)}
              </p>
              <p
                className={`text-sm ${totalChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}
              >
                24h Change: {totalChange24h.toFixed(2)}%
                ({totalChange24h >= 0 ? '+' : ''}${totalChange24h.toFixed(2)})
              </p>
              <div className="mt-2">
                {wallet.tokens?.map((token) => (
                  <p key={token.mint} className="text-sm text-gray-400">
                    {token.mint}: {token.balance.toFixed(2)} (${(token.balance * token.price).toFixed(2)})
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div
            className={`flex items-center gap-1 text-2xl ${totalChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}
          >
            {totalChange24h >= 0 ? <ArrowUpRight size={30} /> : <ArrowDownRight size={30} />}
            {totalChange24h.toFixed(2)}%
          </div>
        </div>
      ) : (
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-slate-700 h-10 w-10"></div>
          <div className="flex-1 space-y-6 py-1">
            <div className="h-2 bg-slate-700 rounded"></div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-2 bg-slate-700 rounded col-span-2"></div>
                <div className="h-2 bg-slate-700 rounded col-span-1"></div>
              </div>
              <div className="h-2 bg-slate-700 rounded"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletOverview;

