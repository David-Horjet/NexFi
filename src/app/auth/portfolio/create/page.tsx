'use client';

import { createPortfolio, updatePortfolio } from "@/actions/quicknode.actions";
import { setPortfolio } from "@/features/portfolio/portfolioSlice";
// import { RootState } from "@/store/store";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

export default function Home() {
    const { publicKey, signMessage } = useWallet();

    const router = useRouter();
    // const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(false);
    const [portfolioName, setPortfolioName] = useState('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const walletAddress = publicKey ? publicKey.toBase58() : ""

    const handleCreatePortfolio = async () => {
        if (!publicKey || !signMessage) {
            toast.error('Please connect your wallet first!');
            router.push('/auth');
        }

        if (!portfolioName.trim()) {
            setErrorMessage('Portfolio name cannot be empty.');
            return;
        }

        setIsLoading(true);
        setErrorMessage(null);

        try {
            // Call QuickNode function
            const response = await createPortfolio({
                walletAddress,
                portfolioName,
            });

            if (response.success) {
                // Dispatch to save portfolio in state
                setPortfolio({ name: portfolioName })
                localStorage.setItem("portfolioName", portfolioName)
                const response = await updatePortfolio({
                    portfolioName,
                    addAddresses: [walletAddress],
                    removeAddresses: []
                })
                console.log("update", response)
                if (response.success) {
                    toast.success(`Wallet ${walletAddress} added to portfolio automatically!`);
                }
                toast.success('Portfolio created successfully!');
                router.push('/dashboard');
            } else {
                setErrorMessage(response.error || 'Failed to create portfolio.');
            }
        } catch (error) {
            console.error('Error creating portfolio:', error);
            setErrorMessage('An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
            <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-white">
                    Create Your Portfolio
                </h2>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleCreatePortfolio();
                    }}
                    className="flex flex-col space-y-4"
                >
                    <input
                        type="text"
                        value={portfolioName}
                        onChange={(e) => setPortfolioName(e.target.value)}
                        placeholder="Enter Portfolio Name"
                        className="w-full p-2 rounded bg-gray-800 text-white focus:ring-2 focus:ring-green-500 outline-none"
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-2 px-4 rounded text-white ${isLoading ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
                            }`}
                    >
                        {isLoading ? 'Creating Portfolio...' : 'Create Portfolio'}
                    </button>
                </form>
                {errorMessage && (
                    <p className="text-red-500 mt-4 text-center">{errorMessage}</p>
                )}
            </div>
        </div>
    );
}
