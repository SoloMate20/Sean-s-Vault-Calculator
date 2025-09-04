import { useState, useEffect } from 'react';

const API_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd';

export const useSolanaPrice = (refreshInterval: number = 30000) => {
  const [price, setPrice] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchPrice = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch SOL price from CoinGecko');
      }
      const data = await response.json();
      const solPrice = data?.solana?.usd;
      if (typeof solPrice !== 'number') {
        throw new Error('Invalid price format received');
      }
      setPrice(solPrice);
      setLastUpdated(new Date());
      setError(null);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred');
      }
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrice(); // Initial fetch

    const intervalId = setInterval(fetchPrice, refreshInterval);

    return () => clearInterval(intervalId); // Cleanup on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshInterval]);

  return { price, isLoading, error, lastUpdated };
};