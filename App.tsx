
import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CalculationInput, CalculationResult, MonthlyData } from './types';
import { useSolanaPrice } from './hooks/useSolanaPrice';
import { useExchangeRate } from './hooks/useExchangeRate';
import Card from './components/Card';
import { SolanaIcon, LoadingSpinner } from './components/icons';

function App() {
  const [input, setInput] = useState<CalculationInput>({
    initialDeposit: '100',
    currency: 'SOL',
    interestRate: '5',
    duration: '12',
    performanceFee: '25',
  });
  const [result, setResult] = useState<CalculationResult | null>(null);
  const { price: solPrice, isLoading: solPriceLoading, error: solPriceError, lastUpdated } = useSolanaPrice();
  const { rate: gbpRate, isLoading: gbpRateLoading, error: gbpRateError } = useExchangeRate('GBP');
  const [isCalculating, setIsCalculating] = useState(false);
  const [displayCurrency, setDisplayCurrency] = useState<'SOL' | 'USD' | 'GBP'>('SOL');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInput(prev => ({ ...prev, [name]: value }));
  };

  const calculateCompoundInterest = (): CalculationResult => {
    const initialDeposit = parseFloat(input.initialDeposit);
    const interestRate = parseFloat(input.interestRate) / 100; // monthly
    const duration = parseInt(input.duration, 10);
    const performanceFee = parseFloat(input.performanceFee) / 100;

    if (isNaN(initialDeposit) || isNaN(interestRate) || isNaN(duration) || isNaN(performanceFee)) {
      return { finalBalance: 0, totalInterest: 0, totalFees: 0, monthlyData: [] };
    }
    
    let initialDepositInSol = initialDeposit;
    if (input.currency === 'USD' && solPrice) {
      initialDepositInSol = initialDeposit / solPrice;
    } else if (input.currency === 'GBP' && solPrice && gbpRate) {
      const depositInUsd = initialDeposit / gbpRate;
      initialDepositInSol = depositInUsd / solPrice;
    }


    let currentBalance = initialDepositInSol;
    let totalInterest = 0;
    let totalFees = 0;
    const monthlyData: MonthlyData[] = [];

    for (let month = 1; month <= duration; month++) {
      const startBalance = currentBalance;
      const interest = startBalance * interestRate;
      const fee = interest * performanceFee;
      const endBalance = startBalance + interest - fee;

      totalInterest += interest;
      totalFees += fee;
      currentBalance = endBalance;

      monthlyData.push({
        month,
        startBalance,
        interest,
        fee,
        endBalance,
      });
    }

    return {
      finalBalance: currentBalance,
      totalInterest,
      totalFees,
      monthlyData,
    };
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsCalculating(true);
    // Simulate calculation time for user feedback
    setTimeout(() => {
      const calculationResult = calculateCompoundInterest();
      setResult(calculationResult);
      // Set display currency to match input currency on new calculation
      if (input.currency === 'SOL' || input.currency === 'USD' || input.currency === 'GBP') {
        setDisplayCurrency(input.currency);
      }
      setIsCalculating(false);
    }, 500);
  };

  const convertSolToUsd = (solAmount: number) => (solAmount * (solPrice ?? 0));
  const convertUsdToGbp = (usdAmount: number) => (usdAmount * (gbpRate ?? 0));
  
  const formatCurrency = (value: number, currency: 'SOL' | 'USD' | 'GBP') => {
    if (currency === 'USD') {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
    }
    if (currency === 'GBP') {
        return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(value);
    }
    return `${value.toFixed(4)} SOL`;
  };

  const formatDisplayCurrency = (solValue: number) => {
    if (displayCurrency === 'USD') {
        if (!solPrice) return 'N/A';
        return formatCurrency(convertSolToUsd(solValue), 'USD');
    }
    if (displayCurrency === 'GBP') {
        if (!solPrice || !gbpRate) return 'N/A';
        return formatCurrency(convertUsdToGbp(convertSolToUsd(solValue)), 'GBP');
    }
    return formatCurrency(solValue, 'SOL');
  };

  const getSubtitle = (solValue: number): string => {
    const potentialCurrencies: Array<'SOL' | 'USD' | 'GBP'> = ['SOL', 'USD', 'GBP'];
    const otherCurrencies = potentialCurrencies.filter(c => c !== displayCurrency);

    const formattedValues = otherCurrencies
        .map(currency => {
            if (currency === 'USD') {
                if (!solPrice) return null;
                return formatCurrency(convertSolToUsd(solValue), 'USD');
            }
            if (currency === 'GBP') {
                if (!solPrice || !gbpRate) return null;
                return formatCurrency(convertUsdToGbp(convertSolToUsd(solValue)), 'GBP');
            }
            if (currency === 'SOL') {
                return formatCurrency(solValue, 'SOL');
            }
            return null;
        })
        .filter((value): value is string => value !== null);
    
    // Return a non-breaking space to maintain layout if no other currencies can be shown
    if (formattedValues.length === 0) return '\u00A0'; 

    return formattedValues.join(' / ');
  };
  
  const yAxisTickFormatter = (tick: any): string => {
    const num = Number(tick);
    if (isNaN(num)) return String(tick);

    // For USD and GBP, use a compact, locale-aware format.
    // This is clean for an axis and handles large numbers gracefully (e.g., 1.5K, 1M).
    if (displayCurrency === 'USD' || displayCurrency === 'GBP') {
      return new Intl.NumberFormat('en-US', {
        notation: 'compact',
        compactDisplay: 'short',
        maximumFractionDigits: 1,
      }).format(num);
    }
    
    // For SOL, maintain more precision for smaller numbers, and use
    // compact notation for larger values to ensure readability.
    if (num < 1) return num.toFixed(3);
    if (num < 1000) return num.toFixed(2);

    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      compactDisplay: 'short',
      maximumFractionDigits: 2,
    }).format(num);
  };

  const chartData = useMemo(() => {
    if (!result) return [];
    return result.monthlyData.map(d => {
        let displayBalance = d.endBalance;
        if (displayCurrency === 'USD' && solPrice) {
            displayBalance = convertSolToUsd(d.endBalance);
        } else if (displayCurrency === 'GBP' && solPrice && gbpRate) {
            displayBalance = convertUsdToGbp(convertSolToUsd(d.endBalance));
        }
        return {
            ...d,
            displayBalance,
        };
    });
  }, [result, displayCurrency, solPrice, gbpRate]);

  const years = (parseInt(input.duration) / 12).toFixed(1);
  
  const isCalculateDisabled = isCalculating || solPriceLoading || (input.currency === 'GBP' && (!gbpRate || gbpRateLoading));

  return (
    <div className="bg-brand-bg-dark min-h-screen text-brand-text-light font-sans">
      <main className="container mx-auto p-4 md:p-8">
        <header className="text-center mb-8">
          <div className="inline-flex items-center">
            <SolanaIcon className="w-12 h-12 mr-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-50">Vault Calculator</h1>
          </div>
          <p className="text-brand-text-muted mt-2">
            Project your potential earnings with our advanced vault calculator.
          </p>
        </header>

        <div className="space-y-8">
          <Card>
            <h2 className="text-2xl font-bold text-gray-50 mb-4 flex items-center">
              <SolanaIcon className="w-6 h-6 mr-2" />
              Live SOL Price
            </h2>
            {solPriceLoading ? <LoadingSpinner className="w-8 h-8 text-brand-yellow" /> :
              solPriceError ? <p className="text-red-400">{solPriceError}</p> :
              solPrice ? (
                <div>
                  <p className="text-3xl font-bold text-brand-text-light">{formatCurrency(solPrice, 'USD')}</p>
                  {lastUpdated && <p className="text-xs text-brand-text-muted mt-1">Updated: {lastUpdated.toLocaleString()}</p>}
                </div>
              ) : <p>Could not fetch price.</p>}
          </Card>

          <div className="space-y-8">
            <Card>
              <h2 className="text-2xl font-bold text-gray-50 mb-4">Investment Parameters</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="initialDeposit" className="block text-sm font-medium text-brand-text-light">Initial Deposit</label>
                    <input type="number" name="initialDeposit" id="initialDeposit" value={input.initialDeposit} onChange={handleInputChange} className="mt-1 block w-full rounded-md bg-brand-bg-dark border-brand-text-muted/50 focus:ring-brand-yellow focus:border-brand-yellow sm:text-sm p-2" step="any" required/>
                  </div>
                  <div>
                    <label htmlFor="currency" className="block text-sm font-medium text-brand-text-light">Deposit Currency</label>
                    <select name="currency" id="currency" value={input.currency} onChange={handleInputChange} className="mt-1 block w-full rounded-md bg-brand-bg-dark border-brand-text-muted/50 focus:ring-brand-yellow focus:border-brand-yellow sm:text-sm p-2">
                      <option>SOL</option>
                      <option>USD</option>
                      <option>GBP</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="interestRate" className="block text-sm font-medium text-brand-text-light">Monthly Interest (%)</label>
                    <input type="number" name="interestRate" id="interestRate" value={input.interestRate} onChange={handleInputChange} className="mt-1 block w-full rounded-md bg-brand-bg-dark border-brand-text-muted/50 focus:ring-brand-yellow focus:border-brand-yellow sm:text-sm p-2" step="any" required/>
                  </div>
                  <div>
                    <label htmlFor="duration" className="block text-sm font-medium text-brand-text-light">Duration (Months)</label>
                    <input type="number" name="duration" id="duration" value={input.duration} onChange={handleInputChange} className="mt-1 block w-full rounded-md bg-brand-bg-dark border-brand-text-muted/50 focus:ring-brand-yellow focus:border-brand-yellow sm:text-sm p-2" required/>
                  </div>
                  <div>
                    <label htmlFor="performanceFee" className="block text-sm font-medium text-brand-text-light">Performance Fee (%)</label>
                    <input type="number" name="performanceFee" id="performanceFee" value={input.performanceFee} onChange={handleInputChange} className="mt-1 block w-full rounded-md bg-brand-bg-dark border-brand-text-muted/50 focus:ring-brand-yellow focus:border-brand-yellow sm:text-sm p-2" step="any" required/>
                  </div>
                </div>
                <button type="submit" disabled={isCalculateDisabled} className="w-full flex justify-center items-center bg-brand-yellow hover:bg-brand-yellow/90 text-brand-bg-dark font-bold py-3 px-4 rounded-md transition duration-300 disabled:bg-brand-text-muted/50 disabled:cursor-not-allowed">
                  {isCalculating ? <LoadingSpinner className="w-5 h-5"/> : 'Calculate Growth'}
                </button>
              </form>
            </Card>

            {result && (
              <div className="space-y-8">
                <Card>
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4">
                    <h2 className="text-2xl font-bold text-gray-50">Results Summary</h2>
                    <div className="flex items-center space-x-1 bg-brand-bg-dark/50 p-1 rounded-lg self-start sm:self-center">
                        {(['SOL', 'USD', 'GBP'] as const).map((currency) => {
                            const isDisabled = (currency === 'USD' && !solPrice) || (currency === 'GBP' && (!solPrice || !gbpRate));
                            return (
                                <button
                                    key={currency}
                                    onClick={() => setDisplayCurrency(currency)}
                                    disabled={isDisabled}
                                    className={`px-3 py-1 rounded-md text-sm font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:ring-offset-2 focus:ring-offset-brand-card-bg disabled:opacity-50 disabled:cursor-not-allowed ${
                                        displayCurrency === currency
                                            ? 'bg-brand-yellow text-brand-bg-dark'
                                            : 'text-brand-text-light hover:bg-brand-text-muted/20'
                                    }`}
                                >
                                    {currency}
                                </button>
                            )
                        })}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                    <div className="flex flex-col justify-center items-center p-4 bg-brand-bg-dark/50 rounded-lg">
                      <p className="text-sm text-brand-text-muted">Investment Period</p>
                      <p className="text-2xl font-bold text-brand-text-light">{input.duration} Months</p>
                      <p className="text-sm text-brand-text-muted">({years} years)</p>
                    </div>
                    <div className="flex flex-col justify-center items-center p-4 bg-brand-bg-dark/50 rounded-lg">
                      <p className="text-sm text-brand-text-muted">Interest Earned</p>
                      <p className="text-2xl font-bold text-green-400">{formatDisplayCurrency(result.totalInterest)}</p>
                      <p className="text-sm text-brand-text-muted min-h-[1.25rem]">{getSubtitle(result.totalInterest)}</p>
                    </div>
                    <div className="flex flex-col justify-center items-center p-4 bg-brand-bg-dark/50 rounded-lg">
                      <p className="text-sm text-brand-text-muted">Total Fees Paid</p>
                      <p className="text-2xl font-bold text-red-400">{formatDisplayCurrency(result.totalFees)}</p>
                      <p className="text-sm text-brand-text-muted min-h-[1.25rem]">{getSubtitle(result.totalFees)}</p>
                    </div>
                    <div className="flex flex-col justify-center items-center p-4 bg-brand-bg-dark/50 rounded-lg">
                      <p className="text-sm text-brand-text-muted">Final Balance</p>
                      <p className="text-2xl font-bold text-brand-text-light">{formatDisplayCurrency(result.finalBalance)}</p>
                      <p className="text-sm text-brand-text-muted min-h-[1.25rem]">{getSubtitle(result.finalBalance)}</p>
                    </div>
                  </div>
                </Card>
                <Card>
                  <h2 className="text-2xl font-bold text-gray-50 mb-4">Balance Growth Over Time</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#bbc9cc20" />
                      <XAxis dataKey="month" stroke="#bbc9cc" label={{ value: 'Month', position: 'insideBottom', offset: -5, fill: '#69aca3' }} />
                      <YAxis 
                        stroke="#bbc9cc" 
                        tickFormatter={yAxisTickFormatter}
                      />
                      <Tooltip contentStyle={{ backgroundColor: '#013a33', border: '1px solid #bbc9cc50', borderRadius: '0.5rem' }} formatter={(value: number) => formatCurrency(value, displayCurrency)}/>
                      <Legend />
                      <Line type="monotone" dataKey="displayBalance" name={`Balance (${displayCurrency})`} stroke="#f0c555" activeDot={{ r: 8 }} strokeWidth={2} dot={false}/>
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
                <Card>
                    <h3 className="text-xl font-bold text-gray-50 mb-4">Monthly Breakdown</h3>
                    <div className="overflow-x-auto max-h-96">
                        <table className="w-full text-sm text-left text-brand-text-light">
                            <thead className="text-xs text-brand-text-muted uppercase bg-brand-bg-dark sticky top-0">
                                <tr>
                                    <th scope="col" className="px-4 py-2">Month</th>
                                    <th scope="col" className="px-4 py-2">Start Balance</th>
                                    <th scope="col" className="px-4 py-2">Interest</th>
                                    <th scope="col" className="px-4 py-2">Fee</th>
                                    <th scope="col" className="px-4 py-2">End Balance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {result.monthlyData.map(data => (
                                    <tr key={data.month} className="bg-brand-card-bg border-b border-brand-bg-dark/50 hover:bg-brand-bg-dark/50">
                                        <td className="px-4 py-2 font-medium">{data.month}</td>
                                        <td className="px-4 py-2">{formatDisplayCurrency(data.startBalance)}</td>
                                        <td className="px-4 py-2 text-green-400">+{formatDisplayCurrency(data.interest)}</td>
                                        <td className="px-4 py-2 text-red-400">-{formatDisplayCurrency(data.fee)}</td>
                                        <td className="px-4 py-2 font-medium">{formatDisplayCurrency(data.endBalance)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </main>
      <footer className="text-center p-4 mt-8">
        <p className="text-xs text-brand-text-muted max-w-3xl mx-auto">
          Disclaimer: This calculator is for demonstration and informational purposes only and does not constitute financial advice. The rates and fees used are illustrative and may not reflect actual returns. Cryptocurrency investments are subject to market risk and volatility; prices can go up as well as down. Please conduct your own research and consult with a qualified financial advisor before making any investment decisions.
        </p>
      </footer>
    </div>
  );
}

export default App;
