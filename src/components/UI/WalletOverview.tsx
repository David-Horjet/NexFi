'use client';

import React, { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useDispatch, useSelector } from 'react-redux';
import { Connection } from '@solana/web3.js';
import { setWallet } from '@/features/wallet/walletSlice';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useNetworkConnection } from '@/hooks/useNetwork';

interface WalletState {
  address: string;
  balance: number;
}

const WalletOverview: React.FC = () => {
  const dispatch = useDispatch();
  const { connected, publicKey, disconnect } = useWallet();
  const { connection, network } = useNetworkConnection();
  const wallet = useSelector((state: { wallet: WalletState }) => state.wallet);

  const [solPrice, setSolPrice] = useState<number | null>(null);
  const [solChange, setSolChange] = useState<number | null>(null);
  const [gainOrLoss, setGainOrLoss] = useState<number | null>(null);

  useEffect(() => {
    const fetchSolPrice = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd&include_24hr_change=true'
        );
        const data = await response.json();
        setSolPrice(data.solana.usd ?? null);
        setSolChange(data.solana.usd_24h_change ?? null);
      } catch (error) {
        console.error('Error fetching SOL price:', error);
      }
    };
    fetchSolPrice();
  }, []);

  useEffect(() => {
    if (wallet.balance && solPrice !== null) {
      setGainOrLoss(wallet.balance * solPrice * (solChange ?? 0) / 100);
    }
  }, [wallet.balance, solPrice, solChange]);

  useEffect(() => {
    if (publicKey) {
      const fetchBalance = async () => {
        try {
          const balance = await connection.getBalance(publicKey);
          dispatch(
            setWallet({ address: publicKey.toBase58(), balance: balance / 1e9 })
          );
        } catch (error) {
          console.error('Error fetching balance:', error);
        }
      };
      fetchBalance();
    }
  }, [publicKey, dispatch, network, connection]);

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-md">
      {connected ? (
        <div className='flex items-center justify-between'>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-gray-700"></div>
            <div>
              <h2 className="text-lg font-semibold">
                {wallet.address.slice(0, 5)}...
                {wallet.address.slice(-5)}
              </h2>
              <p className="text-sm text-gray-400">
                Balance: {wallet.balance.toFixed(2)} SOL
              </p>
              {solPrice !== null && (
                <>
                  <p className="text-sm text-gray-400">
                    Price: ${solPrice.toFixed(2)} USD
                  </p>
                  <p
                    className={`text-sm ${solChange && solChange >= 0
                        ? 'text-green-400'
                        : 'text-red-400'
                      }`}
                  >
                    24h Change: {solChange?.toFixed(2)}%{' '}
                    ({gainOrLoss && `${gainOrLoss >= 0 ? '+' : ''}$${gainOrLoss.toFixed(2)}`})
                  </p>
                </>
              )}
            </div>
          </div>
          <button
            onClick={disconnect}
            className="bg-red-600 px-4 py-2 mt-4 rounded-lg text-white hover:bg-red-700"
          >
            Disconnect Wallet
          </button>
        </div>
      ) : (
        <WalletModalProvider>
          <div className="flex flex-col items-center">
            <p className="text-gray-400 mb-4">No wallet connected</p>
            <WalletMultiButton />
          </div>
        </WalletModalProvider>
      )}
    </div>
  );
};

export default WalletOverview;

