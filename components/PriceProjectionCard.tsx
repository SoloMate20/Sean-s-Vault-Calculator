import React from 'react';
import Card from './Card';
import { ArrowTrendingDownIcon, ArrowTrendingUpIcon, EqualsIcon } from './icons';

interface PriceProjectionCardProps {
  finalBalanceInSol: number;
  solPrice: number;
  gbpRate: number | null;
  displayCurrency: 'USD' | 'GBP';
}

const PriceProjectionCard: React.FC<PriceProjectionCardProps> = ({
  finalBalanceInSol,
  solPrice,
  gbpRate,
  displayCurrency,
}) => {

  const scenarios = [
    {
      name: 'Price -20%',
      multiplier: 0.8,
      Icon: ArrowTrendingDownIcon,
      color: 'text-red-400',
    },
    {
      name: 'Current Price',
      multiplier: 1,
      Icon: EqualsIcon,
      color: 'text-brand-text-light',
    },
    {
      name: 'Price +20%',
      multiplier: 1.2,
      Icon: ArrowTrendingUpIcon,
      color: 'text-green-400',
    },
  ];

  const formatFiatCurrency = (value: number, currency: 'USD' | 'GBP') => {
    return new Intl.NumberFormat(currency === 'USD' ? 'en-US' : 'en-GB', {
      style: 'currency',
      currency: currency,
    }).format(value);
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold text-gray-50 mb-4">Future Price Scenarios</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        {scenarios.map(({ name, multiplier, Icon, color }) => {
          const projectedSolPrice = solPrice * multiplier;
          let projectedBalance = finalBalanceInSol * projectedSolPrice; // in USD

          if (displayCurrency === 'GBP') {
            if (!gbpRate) return null;
            projectedBalance *= gbpRate;
          }

          return (
            <div key={name} className="flex flex-col items-center p-4 bg-brand-bg-dark/50 rounded-lg">
              <Icon className={`w-8 h-8 mb-2 ${color}`} />
              <p className="font-bold text-brand-text-light">{name}</p>
              <p className="text-sm text-brand-text-muted">
                SOL @ {formatFiatCurrency(projectedSolPrice, 'USD')}
              </p>
              <p className={`text-2xl font-bold mt-2 ${color}`}>
                {formatFiatCurrency(projectedBalance, displayCurrency)}
              </p>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default PriceProjectionCard;
