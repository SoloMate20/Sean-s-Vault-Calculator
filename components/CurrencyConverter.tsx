import React, { useState, useMemo } from 'react';
import Card from './Card';
import { CurrencyExchangeIcon } from './icons';

interface CurrencyConverterProps {
    rate: number;
    baseCurrency?: string;
    targetCurrency?: string;
}

const CurrencyConverter: React.FC<CurrencyConverterProps> = ({ 
    rate,
    baseCurrency = 'USD',
    targetCurrency = 'GBP'
}) => {
    const [amount, setAmount] = useState('100');

    const convertedAmount = useMemo(() => {
        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount) || !rate) {
            return 0;
        }
        return numericAmount * rate;
    }, [amount, rate]);

    const formatGbp = (value: number) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(value);

    return (
        <Card>
            <h2 className="text-2xl font-bold text-gray-50 mb-4 flex items-center">
                <CurrencyExchangeIcon className="w-6 h-6 mr-2" />
                {baseCurrency} to {targetCurrency} Converter
            </h2>
            <div className="space-y-4">
                <p className="text-sm text-brand-text-muted">
                    Using live rate: 1 {baseCurrency} = {rate.toFixed(4)} {targetCurrency}
                </p>
                <div>
                    <label htmlFor="usd-amount" className="block text-sm font-medium text-brand-text-light">{baseCurrency} Amount</label>
                    <div className="mt-1">
                        <input
                            type="number"
                            name="usd-amount"
                            id="usd-amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="block w-full rounded-md bg-brand-bg-dark border-brand-text-muted/50 focus:ring-brand-yellow focus:border-brand-yellow sm:text-sm p-2"
                            placeholder="Enter amount"
                            step="any"
                        />
                    </div>
                </div>
                <div>
                    <p className="block text-sm font-medium text-brand-text-light">{targetCurrency} Equivalent</p>
                    <p className="text-2xl font-bold text-brand-text-light mt-1">
                        {formatGbp(convertedAmount)}
                    </p>
                </div>
            </div>
        </Card>
    );
};

export default CurrencyConverter;