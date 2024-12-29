"use client";

import React, { useEffect, useState } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import { useSelector } from "react-redux";

const History: React.FC = () => {
  const [historyItems, setHistoryItems] = useState([]);
  const wallet = useSelector((state: {address: string}) => state.wallet);
  const walletAddress = wallet?.address;

  const connection = new Connection(
    "https://blissful-cosmopolitan-haze.solana-mainnet.quiknode.pro/f8ba66e8edb0d43d768109c5b5b15778ad374284"
  );

  // Fetch additional details about a transaction
  const fetchTransactionDetails = async (signature: string) => {
    try {
      const txn = await connection.getParsedTransaction(signature, {
        commitment: "confirmed",
      });

      if (txn) {
        const { meta, transaction } = txn;
        const instructions = transaction.message.instructions;
        const amount =
          meta?.postTokenBalances?.[0]?.uiTokenAmount?.uiAmount || 0;
        const application = instructions
          ?.map((inst) => inst.programId.toBase58())
          ?.join(", ") || "Unknown Application";
        const status = meta?.err ? "Failed" : "Success";
        const type = instructions.some(
          (i) =>
            i.programId.toBase58() ===
            "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        )
          ? "Token Transfer"
          : "Execute";

        return {
          signature,
          status,
          amount,
          type,
          application,
          time: new Date(txn.blockTime! * 1000).toLocaleTimeString(),
          date: new Date(txn.blockTime! * 1000).toLocaleDateString(),
          color:
            status === "Success"
              ? "green"
              : status === "Failed"
              ? "red"
              : "yellow",
        };
      }
    } catch (error) {
      console.error(`Failed to fetch transaction details for ${signature}:`, error);
      return null;
    }
  };

  useEffect(() => {
    const fetchTransactionHistory = async () => {
      try {
        const pubKey = new PublicKey(walletAddress);
        const signatures = await connection.getSignaturesForAddress(pubKey, {
          limit: 5,
        });

        const detailedHistory = await Promise.all(
          signatures.map(async (item) => {
            return await fetchTransactionDetails(item.signature);
          })
        );

        setHistoryItems(detailedHistory.filter(Boolean)); // Remove null items
      } catch (error) {
        console.error("Failed to fetch history:", error);
      }
    };

    if (walletAddress) {
      fetchTransactionHistory();
    }
  }, [connection, walletAddress, fetchTransactionDetails]);

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md mt-6">
      <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
      <ul className="space-y-4">
        {historyItems.length > 0 ? (
          historyItems.map((item, idx) => (
            <li
              key={idx}
              className={`flex flex-col p-4 rounded-lg ${
                item.color === "green"
                  ? "bg-green-700"
                  : item.color === "yellow"
                  ? "bg-yellow-600"
                  : "bg-red-700"
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold">Type:</span>
                <span>{item.type}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">Amount:</span>
                <span>{item.amount} SOL</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">Application:</span>
                <span>{item.application}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">Status:</span>
                <span>{item.status}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">Time:</span>
                <span>{item.time}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">Date:</span>
                <span>{item.date}</span>
              </div>
            </li>
          ))
        ) : (
          <p className="text-gray-400">No recent transactions found.</p>
        )}
      </ul>
    </div>
  );
};

export default History;
