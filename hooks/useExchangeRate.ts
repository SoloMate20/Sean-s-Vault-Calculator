import { useState, useEffect } from 'react';

const API_URL = 'https://api.exchangerate-api.com/v4/latest/USD';

export const useExchangeRate = (targetCurrency: string = 'GBP') => {
  const [rate, setRate] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRate = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error('Failed to fetch exchange rate');
        }
        const data = await response.json();
        const exchangeRate = data?.rates?.[targetCurrency];
        
        if (typeof exchangeRate !== 'number') {
          throw new Error(`Invalid rate format for ${targetCurrency}`);
        }
        
        setRate(exchangeRate);
        setError(null);
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError('An unknown error occurred fetching the exchange rate');
        }
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRate();
  }, [targetCurrency]);

  return { rate, isLoading, error };
};