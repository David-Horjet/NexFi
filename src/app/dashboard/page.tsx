// import History from "@/components/UI/History";
// import WalletModal from "@/components/UI/Modals/WalletModal";
import PerformanceChart from "@/components/UI/PerformanceChart";
import WalletAssets from "@/components/UI/WalletAssets";
import WalletOverview from "@/components/UI/WalletOverview";
import WalletContextProvider from "@/components/WalletProvider/WalletProvider";

export default function Home() {
  return (
    <WalletContextProvider>
      <section className="h-full overflow-y-auto">
        {/* <WalletModal /> */}
        <WalletOverview />
        {/* <div className="grid">
          <PerformanceChart />
          
        </div> */}
        {/* <WalletAssets /> */}
      </section>
    </WalletContextProvider>
  );
}
