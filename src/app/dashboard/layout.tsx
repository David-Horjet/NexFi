import type { Metadata } from "next";
import SideNav from "@/components/SideNav/SideNav";
import ClientReduxProvider from "@/components/ReduxProvider/ReduxProvider";
import { Bricolage_Grotesque } from "next/font/google";
import TopNav from "@/components/TopNav/TopNav";

const bricolage_GrotesqueFont = Bricolage_Grotesque({
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portfolio Dashboard",
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
        <ClientReduxProvider>
          <section className="flex h-screen overflow-y-hidden bg-gray-800 text-white">
            <SideNav />
            <section className="flex-1 flex flex-col overflow-hidden">
              <TopNav />
              <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">{children}</main>
            </section>
          </section>
        </ClientReduxProvider>
      </body>
    </html>
  );
}
