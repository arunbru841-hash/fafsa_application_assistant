/**
 * Unit tests for loan calculator utility functions
 * 
 * To run these tests, you'll need to add jest to the web package:
 * npm install --save-dev jest @types/jest ts-jest
 * 
 * Add to package.json scripts:
 * "test": "jest"
 * 
 * Create jest.config.js with:
 * module.exports = {
 *   preset: 'ts-jest',
 *   testEnvironment: 'node',
 *   moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' }
 * }
 */

import {
  calculateStandardPayment,
  calculateIDRPayment,
  simulateLoanRepayment,
  getPovertyLine,
  formatCurrency,
  formatMonths,
  validateInputs,
  POVERTY_GUIDELINES_2024,
  POVERTY_PER_ADDITIONAL,
  SimulatorInputs
} from '../loan-calculator'

describe('Loan Calculator Utilities', () => {
  describe('getPovertyLine', () => {
    it('should return correct poverty line for family size 1', () => {
      expect(getPovertyLine(1)).toBe(15060)
    })

    it('should return correct poverty line for family size 4', () => {
      expect(getPovertyLine(4)).toBe(31200)
    })

    it('should return correct poverty line for family size 8', () => {
      expect(getPovertyLine(8)).toBe(52720)
    })

    it('should calculate poverty line for family size > 8', () => {
      // Family of 9 = 52720 + 5380 = 58100
      expect(getPovertyLine(9)).toBe(52720 + 5380)
      // Family of 10 = 52720 + (2 * 5380) = 63480
      expect(getPovertyLine(10)).toBe(52720 + 2 * 5380)
    })

    it('should handle edge case of 0 or negative family size', () => {
      expect(getPovertyLine(0)).toBe(15060)
      expect(getPovertyLine(-1)).toBe(15060)
    })
  })

  describe('calculateStandardPayment', () => {
    it('should calculate standard 10-year payment correctly', () => {
      // $35,000 at 5.5% for 10 years
      // Expected ~$379/month
      const payment = calculateStandardPayment(35000, 5.5)
      expect(payment).toBeCloseTo(379.61, 0)
    })

    it('should return 0 for zero balance', () => {
      expect(calculateStandardPayment(0, 5.5)).toBe(0)
    })

    it('should return 0 for negative balance', () => {
      expect(calculateStandardPayment(-1000, 5.5)).toBe(0)
    })

    it('should handle 0% interest rate', () => {
      // $12,000 at 0% for 10 years = $100/month
      const payment = calculateStandardPayment(12000, 0)
      expect(payment).toBe(100)
    })

    it('should enforce $50 minimum payment', () => {
      // Small balance that would result in <$50 payment
      const payment = calculateStandardPayment(500, 5)
      expect(payment).toBeGreaterThanOrEqual(50)
    })

    it('should handle large balances', () => {
      // $200,000 at 7% should result in ~$2,322/month
      const payment = calculateStandardPayment(200000, 7)
      expect(payment).toBeCloseTo(2322.17, 0)
    })
  })

  describe('calculateIDRPayment', () => {
    it('should calculate SAVE plan payment correctly', () => {
      // $50,000 income, family of 1, SAVE (10%, 225% poverty)
      // Discretionary income = 50000 - (15060 * 2.25) = 50000 - 33885 = 16115
      // Annual payment = 16115 * 0.10 = 1611.50
      // Monthly = 134.29
      const payment = calculateIDRPayment(50000, 1, 10, 2.25)
      expect(payment).toBeCloseTo(134.29, 0)
    })

    it('should calculate PAYE/IBR payment correctly', () => {
      // $50,000 income, family of 1, PAYE/IBR (10%, 150% poverty)
      // Discretionary income = 50000 - (15060 * 1.5) = 50000 - 22590 = 27410
      // Annual payment = 27410 * 0.10 = 2741
      // Monthly = 228.42
      const payment = calculateIDRPayment(50000, 1, 10, 1.5)
      expect(payment).toBeCloseTo(228.42, 0)
    })

    it('should calculate ICR payment correctly', () => {
      // $50,000 income, family of 1, ICR (20%, 100% poverty)
      // Discretionary income = 50000 - 15060 = 34940
      // Annual payment = 34940 * 0.20 = 6988
      // Monthly = 582.33
      const payment = calculateIDRPayment(50000, 1, 20, 1.0)
      expect(payment).toBeCloseTo(582.33, 0)
    })

    it('should return 0 when income is below protected amount', () => {
      // $20,000 income, family of 1, SAVE (225% poverty = 33885)
      // Income is less than protected amount, so discretionary = 0
      const payment = calculateIDRPayment(20000, 1, 10, 2.25)
      expect(payment).toBe(0)
    })

    it('should handle larger family sizes', () => {
      // $80,000 income, family of 4, SAVE
      // Protected = 31200 * 2.25 = 70200
      // Discretionary = 80000 - 70200 = 9800
      // Annual = 980, Monthly = 81.67
      const payment = calculateIDRPayment(80000, 4, 10, 2.25)
      expect(payment).toBeCloseTo(81.67, 0)
    })

    it('should return 0 for invalid inputs', () => {
      expect(calculateIDRPayment(-1000, 1, 10, 2.25)).toBe(0)
      expect(calculateIDRPayment(50000, 0, 10, 2.25)).toBe(0)
      expect(calculateIDRPayment(50000, 1, 0, 2.25)).toBe(0)
    })
  })

  describe('simulateLoanRepayment', () => {
    it('should simulate standard repayment correctly', () => {
      const result = simulateLoanRepayment(35000, 5.5, 380, 120, null)
      
      expect(result.payoffMonths).toBeLessThanOrEqual(120)
      expect(result.totalPaid).toBeGreaterThan(35000)
      expect(result.totalInterest).toBeGreaterThan(0)
      expect(result.forgiveness).toBe(0)
    })

    it('should handle forgiveness correctly', () => {
      // Low payment that won't pay off in 20 years
      const result = simulateLoanRepayment(50000, 6, 100, 300, 240)
      
      expect(result.payoffMonths).toBe(240)
      expect(result.forgiveness).toBeGreaterThan(0)
    })

    it('should pay off before forgiveness if payments are high enough', () => {
      // High payment that will pay off before forgiveness kicks in
      const result = simulateLoanRepayment(20000, 5, 500, 300, 240)
      
      expect(result.payoffMonths).toBeLessThan(240)
      expect(result.forgiveness).toBe(0)
    })

    it('should return zeros for invalid inputs', () => {
      const result = simulateLoanRepayment(0, 5, 100, 120, null)
      expect(result.totalPaid).toBe(0)
      expect(result.payoffMonths).toBe(0)
    })

    it('should handle 0% interest rate', () => {
      // $12,000 at 0% with $100/month = 120 months exactly
      const result = simulateLoanRepayment(12000, 0, 100, 150, null)
      
      expect(result.payoffMonths).toBe(120)
      expect(result.totalInterest).toBe(0)
      expect(result.totalPaid).toBeCloseTo(12000, 0)
    })
  })

  describe('formatCurrency', () => {
    it('should format positive amounts correctly', () => {
      expect(formatCurrency(1234)).toBe('$1,234')
      expect(formatCurrency(1000000)).toBe('$1,000,000')
    })

    it('should format zero correctly', () => {
      expect(formatCurrency(0)).toBe('$0')
    })

    it('should handle decimals by rounding', () => {
      expect(formatCurrency(1234.56)).toBe('$1,235')
      expect(formatCurrency(1234.49)).toBe('$1,234')
    })

    it('should handle negative amounts', () => {
      expect(formatCurrency(-500)).toBe('-$500')
    })
  })

  describe('formatMonths', () => {
    it('should format months only', () => {
      expect(formatMonths(6)).toBe('6 months')
      expect(formatMonths(11)).toBe('11 months')
    })

    it('should format years only', () => {
      expect(formatMonths(12)).toBe('1 years')
      expect(formatMonths(24)).toBe('2 years')
      expect(formatMonths(120)).toBe('10 years')
    })

    it('should format years and months', () => {
      expect(formatMonths(15)).toBe('1 years, 3 months')
      expect(formatMonths(25)).toBe('2 years, 1 months')
    })

    it('should handle zero', () => {
      expect(formatMonths(0)).toBe('0 months')
    })

    it('should handle negative values', () => {
      expect(formatMonths(-5)).toBe('0 months')
    })
  })

  describe('validateInputs', () => {
    const validInputs: SimulatorInputs = {
      totalBalance: 35000,
      weightedInterestRate: 5.5,
      annualIncome: 50000,
      familySize: 1,
      filingStatus: 'single',
      spouseIncome: 0,
      spouseLoanBalance: 0
    }

    it('should return no errors for valid inputs', () => {
      const errors = validateInputs(validInputs)
      expect(errors).toHaveLength(0)
    })

    it('should validate loan balance', () => {
      const errors1 = validateInputs({ ...validInputs, totalBalance: 0 })
      expect(errors1).toContainEqual(expect.objectContaining({ field: 'totalBalance' }))

      const errors2 = validateInputs({ ...validInputs, totalBalance: -1000 })
      expect(errors2).toContainEqual(expect.objectContaining({ field: 'totalBalance' }))

      const errors3 = validateInputs({ ...validInputs, totalBalance: 2000000 })
      expect(errors3).toContainEqual(expect.objectContaining({ field: 'totalBalance' }))
    })

    it('should validate interest rate', () => {
      const errors1 = validateInputs({ ...validInputs, weightedInterestRate: 0 })
      expect(errors1).toContainEqual(expect.objectContaining({ field: 'weightedInterestRate' }))

      const errors2 = validateInputs({ ...validInputs, weightedInterestRate: 20 })
      expect(errors2).toContainEqual(expect.objectContaining({ field: 'weightedInterestRate' }))
    })

    it('should validate income', () => {
      const errors1 = validateInputs({ ...validInputs, annualIncome: -1000 })
      expect(errors1).toContainEqual(expect.objectContaining({ field: 'annualIncome' }))

      const errors2 = validateInputs({ ...validInputs, annualIncome: 50000000 })
      expect(errors2).toContainEqual(expect.objectContaining({ field: 'annualIncome' }))
    })

    it('should validate family size', () => {
      const errors1 = validateInputs({ ...validInputs, familySize: 0 })
      expect(errors1).toContainEqual(expect.objectContaining({ field: 'familySize' }))

      const errors2 = validateInputs({ ...validInputs, familySize: 25 })
      expect(errors2).toContainEqual(expect.objectContaining({ field: 'familySize' }))
    })

    it('should validate spouse income for married-joint', () => {
      const errors = validateInputs({ 
        ...validInputs, 
        filingStatus: 'married-joint',
        spouseIncome: -5000 
      })
      expect(errors).toContainEqual(expect.objectContaining({ field: 'spouseIncome' }))
    })

    it('should not validate spouse income for single filers', () => {
      const errors = validateInputs({ 
        ...validInputs, 
        filingStatus: 'single',
        spouseIncome: -5000  // Invalid but ignored for single
      })
      expect(errors).not.toContainEqual(expect.objectContaining({ field: 'spouseIncome' }))
    })
  })
})

describe('Poverty Guidelines', () => {
  it('should have all 8 family size values', () => {
    expect(Object.keys(POVERTY_GUIDELINES_2024)).toHaveLength(8)
  })

  it('should have correct 2024 values', () => {
    // 2024 Federal Poverty Guidelines for 48 contiguous states
    expect(POVERTY_GUIDELINES_2024[1]).toBe(15060)
    expect(POVERTY_GUIDELINES_2024[2]).toBe(20440)
    expect(POVERTY_GUIDELINES_2024[4]).toBe(31200)
    expect(POVERTY_GUIDELINES_2024[8]).toBe(52720)
  })

  it('should have correct per-additional-person amount', () => {
    expect(POVERTY_PER_ADDITIONAL).toBe(5380)
  })
})
