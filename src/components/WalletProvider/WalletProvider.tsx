'use client';

import React, { ReactNode } from 'react';
import {
    ConnectionProvider,
    WalletProvider,
} from '@solana/wallet-adapter-react';
// import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css'; // For wallet modal styles
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';

const WalletContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const wallets = [new PhantomWalletAdapter(), new SolflareWalletAdapter()];

    return (
        <ConnectionProvider endpoint="https://blissful-cosmopolitan-haze.solana-devnet.quiknode.pro/f8ba66e8edb0d43d768109c5b5b15778ad374284">
            <WalletProvider wallets={wallets} autoConnect>
                {children}
            </WalletProvider>
        </ConnectionProvider>
    );
};

export default WalletContextProvider;
