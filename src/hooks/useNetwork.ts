import { useState, useEffect } from "react";
import { Connection } from "@solana/web3.js";

export const useNetworkConnection = () => {
  const [network, setNetwork] = useState<"mainnet" | "devnet" | "testnet">(
    "mainnet"
  );  

  // console.log(network);
  

  const endpoints: Record<"mainnet" | "devnet" | "testnet", string> = {
    mainnet:
      "https://blissful-cosmopolitan-haze.solana-mainnet.quiknode.pro/f8ba66e8edb0d43d768109c5b5b15778ad374284",
    devnet:
      "https://blissful-cosmopolitan-haze.solana-devnet.quiknode.pro/f8ba66e8edb0d43d768109c5b5b15778ad374284",
    testnet:
      "https://blissful-cosmopolitan-haze.solana-testnet.quiknode.pro/f8ba66e8edb0d43d768109c5b5b15778ad374284",
  };

  const [connection, setConnection] = useState<Connection>(
    new Connection(endpoints["mainnet"])
  );

  useEffect(() => {
    if (network in endpoints) {
      setConnection(new Connection(endpoints[network]));
    }
  }, [network, endpoints]);

  return { network, setNetwork, connection };
};
