import { useEffect, useRef, useState } from "react";

export const usePortfolioName = () => {
  const [portfolioName, setPortfolioName] = useState<string | null>(() => {
    // Initialize with localStorage value on first render
    return typeof window !== "undefined"
      ? localStorage.getItem("portfolioName")
      : null;
  });

  // Use a ref to track initialization
  const isInitialized = useRef(false);

  useEffect(() => {
    // Only run the effect if not already initialized
    if (!isInitialized.current) {
      const handlePortfolioNameChange = () => {
        const portfolioName = localStorage.getItem("portfolioName");
        // console.log("Token change detected:", portfolioName);
        setPortfolioName(portfolioName);
      };

      // Initial check
      handlePortfolioNameChange();

      // Add storage event listener for cross-tab synchronization
      window.addEventListener("storage", handlePortfolioNameChange);

      // Mark as initialized
      isInitialized.current = true;

      // Cleanup
      return () => {
        window.removeEventListener("storage", handlePortfolioNameChange);
        isInitialized.current = false;
      };
    }
  }, []); // Empty dependency array ensures single run

  return portfolioName;
};
