import type { Metadata } from "next";
import "./globals.css";
import ClientReduxProvider from "@/components/ReduxProvider/ReduxProvider";
import { Bricolage_Grotesque } from "next/font/google";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl } from "@solana/web3.js";
import { useMemo } from "react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { NextAuthProvider } from "@/components/NextAuthProvider/NextAuthProvider";

const bricolage_GrotesqueFont = Bricolage_Grotesque({
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NexFi",
  description: "Track your DeFi Portfolio with Real-Time Updates",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const network = WalletAdapterNetwork.Mainnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
    ],
    []
  );
  return (
    <html lang="en" className="dark">
      <body
        className={`${bricolage_GrotesqueFont.className} antialiased`}
      >
        {/* <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider> */}
        <NextAuthProvider>
          <ClientReduxProvider>
            {children}
          </ClientReduxProvider>
        </NextAuthProvider>
        {/* </WalletModalProvider> */}
        {/* </WalletProvider>
        </ConnectionProvider> */}
        <Toaster
          richColors
        //  toastOptions={toastOptions}
        />
      </body>
    </html>
  );
}
