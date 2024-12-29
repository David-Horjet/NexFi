'use client';

import React, { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useSelector } from 'react-redux';
// import { Connection, PublicKey } from '@solana/web3.js';
// import { setWallet } from '@/features/wallet/walletSlice';
// import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
// import { useNetworkConnection } from '@/hooks/useNetwork';
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
  // const dispatch = useDispatch();
  const { publicKey, disconnect } = useWallet();
  // const { connection, network } = useNetworkConnection();
  const wallet = useSelector((state: { wallet: WalletState }) => state.wallet);

  const portfolioName = usePortfolioName();

  const [totalValue, setTotalValue] = useState<number>(0);
  // const [totalChange24h, setTotalChange24h] = useState<number>(0);
  const [portfolioLoading, setPortfolioLoading] = useState<boolean>(false);

  console.log(portfolioName);
  const walletAddress = publicKey ? publicKey.toBase58() : ""


  if (portfolioName) {
    useEffect(() => {
      const initializePortfolio = async () => {
        console.log("Fetching portfolio data...");
      
        setPortfolioLoading(true);
        try {
          const response = await getPortfolioBalances({
            portfolioName,
          });
          console.log("Portfolio Response:", response);
      
          if (response.success) {
            const walletAddress = response.data ? response.data[0].address : "";
            const tokenResponse = await fetchTokens({ walletAddress });
            console.log("Token Response:", tokenResponse);
      
            if (tokenResponse.success) {
              const jupListResponse = await fetchJupList();
              console.log("Jupiter List Response:", jupListResponse);
      
              if (jupListResponse.success) {
                // Step 1: Fetch SOL balance
                const solBalance = response.data[0].solBalance || 0; // Assuming SOL balance is returned
                const solPriceResponse = await fetchSolPrice();
                const solPrice = solPriceResponse.success ? solPriceResponse.data.solana.usd : 0;
                const solValue = solBalance * solPrice;
      
                console.log("SOL Balance:", solBalance, "SOL Price:", solPrice, "SOL Value:", solValue);
      
                // Step 2: Fetch and calculate token values
                const assets = await Promise.all(
                  tokenResponse.data.tokens.map(async (tokenAccountInfo: any) => {
                    const accountData = tokenAccountInfo.account.data.parsed.info;
                    const tokenMintAddress = accountData.mint;
                    const tokenBalance = accountData.tokenAmount.uiAmount || 0;
      
                    const tokenData = await fetchTokenData(tokenMintAddress) || {};
                    const tokenPrice = Number(tokenData.priceUsd) || 0;
                    const tokenValue = tokenBalance * tokenPrice;
      
                    return {
                      mintAddress: tokenMintAddress,
                      name: tokenData?.baseToken?.name || "Unknown Token",
                      symbol: tokenData?.baseToken?.symbol || "Unknown",
                      imageUrl: tokenData?.info?.imageUrl || "",
                      balance: tokenBalance,
                      price: tokenPrice,
                      value: tokenValue,
                    };
                  })
                );
      
                console.log("Assets:", assets);
      
                // Step 3: Calculate total portfolio value
                const tokenPortfolioValue = await calculatePortfolioValue(assets);
                const totalPortfolioValue = solValue + tokenPortfolioValue;
      
                console.log("Total Portfolio Value:", totalPortfolioValue);
      
                setPortfolio({
                  solValue,
                  tokenAssets: assets,
                  totalValue: totalPortfolioValue,
                });
              }
            }
          }
        } catch (error) {
          console.error("Error fetching portfolio data:", error);
        } finally {
          setPortfolioLoading(false);
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

