// 2024 Federal Poverty Guidelines (48 contiguous states)
export const POVERTY_GUIDELINES_2024: { [key: number]: number } = {
  1: 15060,
  2: 20440,
  3: 25820,
  4: 31200,
  5: 36580,
  6: 41960,
  7: 47340,
  8: 52720
}

// Additional for each person over 8
export const POVERTY_PER_ADDITIONAL = 5380

export interface RepaymentResult {
  planName: string
  monthlyPayment: number
  totalPaid: number
  totalInterest: number
  payoffMonths: number
  forgiveness: number
  forgivenessYear: number | null
  isEligible: boolean
  notes: string[]
}

export interface SimulatorInputs {
  totalBalance: number
  weightedInterestRate: number
  annualIncome: number
  familySize: number
  filingStatus: 'single' | 'married-joint' | 'married-separate'
  spouseIncome: number
  spouseLoanBalance: number
}

/**
 * Calculate monthly payment for Standard Plan (10-year amortization)
 * Uses standard amortization formula: P = L[c(1+c)^n]/[(1+c)^n - 1]
 * where P = payment, L = loan balance, c = monthly rate, n = number of payments
 */
export function calculateStandardPayment(balance: number, annualRate: number): number {
  if (balance <= 0) return 0
  const monthlyRate = annualRate / 100 / 12
  const months = 120 // 10-year standard plan
  
  if (monthlyRate === 0) return balance / months
  
  const payment = balance * (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                  (Math.pow(1 + monthlyRate, months) - 1)
  
  // Federal minimum payment is $50
  return Math.max(50, payment)
}

/**
 * Get poverty line amount for a given family size
 */
export function getPovertyLine(familySize: number): number {
  if (familySize <= 0) return POVERTY_GUIDELINES_2024[1]
  if (familySize <= 8) return POVERTY_GUIDELINES_2024[familySize]
  return POVERTY_GUIDELINES_2024[8] + (familySize - 8) * POVERTY_PER_ADDITIONAL
}

/**
 * Calculate IDR (Income-Driven Repayment) payment
 * Formula: (AGI - (Poverty Line × Multiplier)) × Percentage / 12
 * 
 * @param income - Annual Adjusted Gross Income (AGI)
 * @param familySize - Number of people in household
 * @param percentage - Plan percentage (10% for SAVE/PAYE, 15% for older IBR, 20% for ICR)
 * @param povertyMultiplier - Income protection multiplier (2.25 for SAVE, 1.5 for PAYE/IBR, 1.0 for ICR)
 */
export function calculateIDRPayment(
  income: number, 
  familySize: number, 
  percentage: number,
  povertyMultiplier: number
): number {
  if (income < 0 || familySize < 1 || percentage <= 0) return 0
  
  const povertyLine = getPovertyLine(familySize)
  const incomeProtection = povertyLine * povertyMultiplier
  const discretionaryIncome = Math.max(0, income - incomeProtection)
  const annualPayment = discretionaryIncome * (percentage / 100)
  
  return Math.max(0, annualPayment / 12)
}

/**
 * Simulate loan repayment over time
 * 
 * @param balance - Starting loan balance
 * @param annualRate - Annual interest rate as percentage (e.g., 5.5 for 5.5%)
 * @param monthlyPayment - Monthly payment amount
 * @param maxMonths - Maximum months to simulate
 * @param forgivenessMonth - Month at which remaining balance is forgiven (null if no forgiveness)
 */
export function simulateLoanRepayment(
  balance: number,
  annualRate: number,
  monthlyPayment: number,
  maxMonths: number,
  forgivenessMonth: number | null
): { totalPaid: number; totalInterest: number; payoffMonths: number; forgiveness: number } {
  if (balance <= 0 || monthlyPayment < 0) {
    return { totalPaid: 0, totalInterest: 0, payoffMonths: 0, forgiveness: 0 }
  }

  let currentBalance = balance
  let totalPaid = 0
  let totalInterest = 0
  const monthlyRate = annualRate / 100 / 12
  let months = 0

  while (currentBalance > 0 && months < maxMonths) {
    months++
    const interestCharge = currentBalance * monthlyRate
    totalInterest += interestCharge
    
    // Check if forgiveness applies
    if (forgivenessMonth && months >= forgivenessMonth) {
      return {
        totalPaid,
        totalInterest: totalInterest - interestCharge,
        payoffMonths: months,
        forgiveness: currentBalance
      }
    }

    const payment = Math.min(monthlyPayment, currentBalance + interestCharge)
    totalPaid += payment
    currentBalance = currentBalance + interestCharge - payment

    if (currentBalance < 0.01) currentBalance = 0
  }

  return { totalPaid, totalInterest, payoffMonths: months, forgiveness: 0 }
}

/**
 * Format a number as US currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

/**
 * Format months into years and months string
 */
export function formatMonths(months: number): string {
  if (months <= 0) return '0 months'
  const years = Math.floor(months / 12)
  const remainingMonths = months % 12
  if (years === 0) return `${remainingMonths} months`
  if (remainingMonths === 0) return `${years} years`
  return `${years} years, ${remainingMonths} months`
}

/**
 * Validation error interface
 */
export interface ValidationError {
  field: string
  message: string
}

/**
 * Validate simulator inputs
 */
export function validateInputs(inputs: SimulatorInputs): ValidationError[] {
  const errors: ValidationError[] = []
  
  if (inputs.totalBalance <= 0) {
    errors.push({ field: 'totalBalance', message: 'Loan balance must be greater than $0' })
  } else if (inputs.totalBalance > 1000000) {
    errors.push({ field: 'totalBalance', message: 'Please enter a realistic loan balance (under $1,000,000)' })
  }
  
  if (inputs.weightedInterestRate <= 0) {
    errors.push({ field: 'weightedInterestRate', message: 'Interest rate must be greater than 0%' })
  } else if (inputs.weightedInterestRate > 15) {
    errors.push({ field: 'weightedInterestRate', message: 'Interest rate seems too high. Federal rates are typically 3-9%' })
  }
  
  if (inputs.annualIncome < 0) {
    errors.push({ field: 'annualIncome', message: 'Income cannot be negative' })
  } else if (inputs.annualIncome > 10000000) {
    errors.push({ field: 'annualIncome', message: 'Please enter a realistic income amount' })
  }
  
  if (inputs.familySize < 1 || inputs.familySize > 20) {
    errors.push({ field: 'familySize', message: 'Family size must be between 1 and 20' })
  }
  
  if (inputs.filingStatus === 'married-joint' && inputs.spouseIncome < 0) {
    errors.push({ field: 'spouseIncome', message: 'Spouse income cannot be negative' })
  }
  
  return errors
}
