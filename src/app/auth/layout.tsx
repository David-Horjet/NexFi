import WalletContextProvider from "@/components/WalletProvider/WalletProvider";
import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";

const bricolage_GrotesqueFont = Bricolage_Grotesque({
    weight: ["200", "300", "400", "500", "600", "700", "800"],
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Auth | NexFi",
    description: "Track your DeFi Portfolio with Real-Time Updates",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <body
                className={`${bricolage_GrotesqueFont.className} antialiased`}
            >
                <WalletContextProvider>
                    {children}
                </WalletContextProvider>
            </body>
        </html>
    );
}
