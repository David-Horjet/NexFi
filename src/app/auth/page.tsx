'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { signIn } from 'next-auth/react';
import bs58 from 'bs58';
import { setWallet } from '@/features/wallet/walletSlice';
import { toast } from 'sonner';

export default function Home() {
    const router = useRouter();

    const { publicKey, signMessage, connected } = useWallet();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    
    const wallet = useWallet();

    // if (publicKey) {
    //     console.log(publicKey.toBase58())
    // }

    const handleLogin = async () => {
        if (!publicKey || !signMessage) {
            setErrorMessage('Please connect your wallet first!');
            return;
        }

        setIsLoading(true);
        setErrorMessage(null);

        try {
            const message = `Sign this message to authenticate your wallet to NexFi`;
            const encodedMessage = new TextEncoder().encode(message);
            const signature = await signMessage(encodedMessage);

            const result = await signIn('credentials', {
                walletAddress: publicKey.toBase58(),
                signature: bs58.encode(signature),
                message,
                redirect: false,
            });

            if (result?.ok) {
                // Dispatch action to save wallet and portfolio to state
                setWallet({ address: publicKey.toBase58(), balance: 0 })
                toast.success('Signed in successfully!');
                // Redirect to portfolio creation page
                router.push('/auth/portfolio/create');
            } else {
                toast.error('Failed to sign in. Please try again.');
            }
        } catch (error) {
            console.log('Error signing in:', error);
            toast.error(error ? error.message : "Something went wrong")
        } finally {
            setIsLoading(false);
        }
    };

    // useEffect(() => {
    //     console.log(wallet.connected, status, status === "unauthenticated")
    //     if (wallet.connected && status === "unauthenticated") {
    //         handleLogin();
    //     } else if (wallet.connected && status === "authenticated") {
    //         router.push("/dashboard")
    //     } 
    // }, [wallet.connected]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
            <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-white">
                    Sign In to Your Portfolio
                </h2>
                <WalletModalProvider>
                    <div className="flex flex-col items-center">
                        {!connected && (
                            <p className="text-gray-400 mb-4">No wallet connected</p>
                        )}
                        <WalletMultiButton />
                        {wallet.connected && (
                            <button
                                onClick={handleLogin}
                                className={`mt-4 w-full py-2 px-4 rounded text-white ${isLoading ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
                                    }`}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Signing In...' : 'Sign Wallet'}
                            </button>
                        )}
                    </div>
                </WalletModalProvider>
                {errorMessage && (
                    <p className="text-red-500 mt-4 text-center">{errorMessage}</p>
                )}
            </div>
        </div>
    );
}
