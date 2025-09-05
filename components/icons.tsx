import React from 'react';

export const VaultIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
  >
    <defs>
      <linearGradient id="vaultIconGradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#f0c555" />
        <stop offset="100%" stopColor="#14F195" />
      </linearGradient>
    </defs>
    <path
      d="M12 2.5L3.5 7.5V16.5L12 21.5L20.5 16.5V7.5L12 2.5Z"
      stroke="url(#vaultIconGradient)"
      strokeWidth="1.5"
    />
    <path
      d="M12 7.5L8 10V14L12 16.5L16 14V10L12 7.5Z"
      fill="url(#vaultIconGradient)"
    />
  </svg>
);

export const SolanaIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
  >
    <defs>
      <linearGradient id="solana-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#9945FF" />
        <stop offset="100%" stopColor="#14F195" />
      </linearGradient>
    </defs>
    <path
      d="M37.5 12.5H12.5V31.25H37.5V12.5Z"
      fill="url(#solana-gradient)"
    />
    <path
      d="M62.5 12.5H87.5V31.25H62.5V12.5Z"
      fill="url(#solana-gradient)"
    />
    <path
      d="M37.5 43.75H12.5V62.5H37.5V43.75Z"
      fill="url(#solana-gradient)"
    />
    <path
      d="M62.5 43.75H87.5V62.5H62.5V43.75Z"
      fill="url(#solana-gradient)"
    />
    <path
      d="M37.5 75H12.5V93.75H37.5V75Z"
      fill="url(#solana-gradient)"
    />
    <path
      d="M62.5 75H87.5V93.75H62.5V75Z"
      fill="url(#solana-gradient)"
    />
  </svg>
);

export const LoadingSpinner: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        className={`animate-spin ${className}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
    >
        <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
        ></circle>
        <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
    </svg>
);

export const CurrencyExchangeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
    </svg>
);

export const ArrowTrendingDownIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6 9 12.75l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.898m0 0 3.182-5.511m-3.182 5.51-5.511-3.181" />
    </svg>
);
  
export const ArrowTrendingUpIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.286 4.286a11.948 11.948 0 0 0 4.306-6.43l.776-2.898m0 0 3.182 5.511M16.5 7.5l-5.511 3.181" />
    </svg>
);

export const EqualsIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
    </svg>
);