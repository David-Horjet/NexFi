"use client";

import { useState, useEffect, useCallback } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import { getBalances } from "@/utils/blockchain/getBalances";
import { getPrice } from "@/utils/blockchain/getPrice";

interface BlockchainData {
  solBalance: number | null;
  tokenBalances: Array<{ mint: string; balance: number }>;
  solPrice: number | null;
  loading: boolean;
  error: string | null;
}

export const useBlockchainData = (
  publicKey: PublicKey | null,
  network: string
) => {
  const [data, setData] = useState<BlockchainData>({
    solBalance: null,
    tokenBalances: [],
    solPrice: null,
    loading: true,
    error: null,
  });

  const fetchBlockchainData = useCallback(async () => {
    if (!publicKey) {
      setData((prev) => ({
        ...prev,
        loading: false,
        error: "Public key not provided.",
      }));
      return;
    }

    const connection = new Connection(network);

    try {
      setData((prev) => ({ ...prev, loading: true, error: null }));

      const balances = await getBalances(connection, publicKey);
      const solPrice = await getPrice("solana");

      setData({
        solBalance: balances.solBalance,
        tokenBalances: balances.tokenBalances,
        solPrice,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("Error fetching blockchain data:", error);
      setData((prev) => ({
        ...prev,
        loading: false,
        error: error.message || "Failed to fetch blockchain data.",
      }));
    }
  }, [publicKey, network]);

  useEffect(() => {
    fetchBlockchainData();
  }, [fetchBlockchainData]);

  return { ...data, refetch: fetchBlockchainData };
};
