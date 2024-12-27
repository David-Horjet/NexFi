'use client';

import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const WalletModal: React.FC = () => {
  const { connected } = useWallet();

  return (
    <div className="wallet-modal">
      <WalletMultiButton />
      {connected ? <p className="text-green-500 mt-2">Wallet Connected</p> : <p>Connect a wallet to proceed</p>}
    </div>
  );
};

export default WalletModal;
