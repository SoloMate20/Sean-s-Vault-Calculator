export interface CalculationInput {
  initialDeposit: string;
  currency: 'SOL' | 'USD' | 'GBP';
  interestRate: string; // monthly percentage
  duration: string; // in months
  performanceFee: string; // monthly percentage
}

export interface MonthlyData {
  month: number;
  startBalance: number;
  interest: number;
  fee: number;
  endBalance: number;
}

export interface CalculationResult {
  finalBalance: number;
  totalInterest: number;
  totalFees: number;
  monthlyData: MonthlyData[];
}