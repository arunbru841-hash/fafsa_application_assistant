'use client'

import Link from 'next/link'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { 
  ArrowRight, 
  ArrowLeft,
  DollarSign, 
  Clock, 
  Calendar,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Calculator,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Target,
  Info,
  RefreshCw,
  BarChart3,
  Percent,
  Award,
  Printer,
  Download,
  Save,
  RotateCcw
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { EconomicDashboard } from '@/components/economic'

// Validation helper functions
interface ValidationError {
  field: string
  message: string
}

function validateInputs(inputs: SimulatorInputs): ValidationError[] {
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

// localStorage key
const STORAGE_KEY = 'loanSimulatorInputs'

// Save to localStorage
function saveToLocalStorage(inputs: SimulatorInputs): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(inputs))
    } catch (e) {
      console.warn('Failed to save to localStorage:', e)
    }
  }
}

// Load from localStorage
function loadFromLocalStorage(): SimulatorInputs | null {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        return JSON.parse(saved)
      }
    } catch (e) {
      console.warn('Failed to load from localStorage:', e)
    }
  }
  return null
}

// 2024 Federal Poverty Guidelines (48 contiguous states)
const POVERTY_GUIDELINES_2024: { [key: number]: number } = {
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
const POVERTY_PER_ADDITIONAL = 5380

interface LoanEntry {
  id: number
  balance: number
  interestRate: number
  loanType: 'subsidized' | 'unsubsidized' | 'plus' | 'perkins' | 'consolidation'
}

interface SimulatorInputs {
  totalBalance: number
  weightedInterestRate: number
  annualIncome: number
  familySize: number
  filingStatus: 'single' | 'married-joint' | 'married-separate'
  spouseIncome: number
  spouseLoanBalance: number
}

interface RepaymentResult {
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

// Calculate monthly payment for Standard Plan (10-year amortization)
function calculateStandardPayment(balance: number, annualRate: number): number {
  const monthlyRate = annualRate / 100 / 12
  const months = 120
  if (monthlyRate === 0) return balance / months
  const payment = balance * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
  return Math.max(50, payment)
}

// Calculate IDR payment
function calculateIDRPayment(
  income: number, 
  familySize: number, 
  percentage: number,
  povertyMultiplier: number
): number {
  const povertyLine = familySize <= 8 
    ? POVERTY_GUIDELINES_2024[familySize] 
    : POVERTY_GUIDELINES_2024[8] + (familySize - 8) * POVERTY_PER_ADDITIONAL
  
  const incomeProtection = povertyLine * povertyMultiplier
  const discretionaryIncome = Math.max(0, income - incomeProtection)
  const annualPayment = discretionaryIncome * (percentage / 100)
  return Math.max(0, annualPayment / 12)
}

// Simulate loan repayment
function simulateLoanRepayment(
  balance: number,
  annualRate: number,
  monthlyPayment: number,
  maxMonths: number,
  forgivenessMonth: number | null
): { totalPaid: number; totalInterest: number; payoffMonths: number; forgiveness: number } {
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

export default function LoanSimulatorPage() {
  const defaultInputs: SimulatorInputs = {
    totalBalance: 35000,
    weightedInterestRate: 5.5,
    annualIncome: 50000,
    familySize: 1,
    filingStatus: 'single',
    spouseIncome: 0,
    spouseLoanBalance: 0
  }

  const [inputs, setInputs] = useState<SimulatorInputs>(defaultInputs)
  const [showResults, setShowResults] = useState(false)
  const [selectedPlans, setSelectedPlans] = useState<string[]>(['standard', 'save', 'paye', 'ibr'])
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])
  const [isSaved, setIsSaved] = useState(false)

  // Load saved inputs on mount
  useEffect(() => {
    const saved = loadFromLocalStorage()
    if (saved) {
      setInputs(saved)
      setIsSaved(true)
    }
  }, [])

  // Auto-save when inputs change (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      saveToLocalStorage(inputs)
    }, 500)
    return () => clearTimeout(timer)
  }, [inputs])

  // Reset to defaults
  const handleReset = useCallback(() => {
    setInputs(defaultInputs)
    setShowResults(false)
    setValidationErrors([])
    setIsSaved(false)
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  // Print results
  const handlePrint = useCallback(() => {
    window.print()
  }, [])

  // Handle calculate with validation
  const handleCalculate = useCallback(() => {
    const errors = validateInputs(inputs)
    setValidationErrors(errors)
    if (errors.length === 0) {
      setShowResults(true)
      saveToLocalStorage(inputs)
      setIsSaved(true)
    }
  }, [inputs])

  // Get error for a specific field
  const getFieldError = (field: string): string | undefined => {
    return validationErrors.find(e => e.field === field)?.message
  }

  const results = useMemo<RepaymentResult[]>(() => {
    if (!showResults) return []

    const { totalBalance, weightedInterestRate, annualIncome, familySize, filingStatus, spouseIncome } = inputs
    const combinedIncome = filingStatus === 'married-joint' ? annualIncome + spouseIncome : annualIncome

    const standardPayment = calculateStandardPayment(totalBalance, weightedInterestRate)
    
    const allResults: RepaymentResult[] = []

    // Standard Plan
    const standardSim = simulateLoanRepayment(totalBalance, weightedInterestRate, standardPayment, 120, null)
    allResults.push({
      planName: 'Standard (10-Year)',
      monthlyPayment: standardPayment,
      totalPaid: standardSim.totalPaid,
      totalInterest: standardSim.totalInterest,
      payoffMonths: standardSim.payoffMonths,
      forgiveness: 0,
      forgivenessYear: null,
      isEligible: true,
      notes: ['Fixed payments', 'Lowest total interest', 'Fastest payoff']
    })

    // Graduated Plan (approximation - starts at 50% of standard, increases)
    const graduatedStartPayment = standardPayment * 0.5
    const graduatedAvgPayment = standardPayment * 0.85 // rough average
    const graduatedSim = simulateLoanRepayment(totalBalance, weightedInterestRate, graduatedAvgPayment, 120, null)
    allResults.push({
      planName: 'Graduated (10-Year)',
      monthlyPayment: graduatedStartPayment,
      totalPaid: graduatedSim.totalPaid * 1.1, // Approximate higher interest
      totalInterest: graduatedSim.totalInterest * 1.2,
      payoffMonths: 120,
      forgiveness: 0,
      forgivenessYear: null,
      isEligible: true,
      notes: ['Payments start low, increase every 2 years', 'Good if expecting income growth']
    })

    // Extended Plan (25-year)
    if (totalBalance >= 30000) {
      const extendedPayment = calculateStandardPayment(totalBalance, weightedInterestRate) * 0.6 // rough approximation
      const extendedSim = simulateLoanRepayment(totalBalance, weightedInterestRate, extendedPayment, 300, null)
      allResults.push({
        planName: 'Extended (25-Year)',
        monthlyPayment: extendedPayment,
        totalPaid: extendedSim.totalPaid,
        totalInterest: extendedSim.totalInterest,
        payoffMonths: extendedSim.payoffMonths,
        forgiveness: 0,
        forgivenessYear: null,
        isEligible: true,
        notes: ['Requires $30,000+ in loans', 'Lower payments but more interest']
      })
    }

    // SAVE Plan (10% of discretionary income, 225% poverty line)
    const savePayment = calculateIDRPayment(combinedIncome, familySize, 10, 2.25)
    const saveForgiveness = totalBalance > 12000 ? 240 : 120 // 10 years if <$12k, 20 years otherwise (simplified)
    const saveSim = simulateLoanRepayment(totalBalance, weightedInterestRate, savePayment, 300, saveForgiveness)
    allResults.push({
      planName: 'SAVE Plan',
      monthlyPayment: savePayment,
      totalPaid: saveSim.totalPaid,
      totalInterest: saveSim.totalInterest,
      payoffMonths: saveSim.payoffMonths,
      forgiveness: saveSim.forgiveness,
      forgivenessYear: saveSim.forgiveness > 0 ? Math.ceil(saveForgiveness / 12) : null,
      isEligible: true,
      notes: [
        '10% of discretionary income',
        'Largest income protection (225% poverty)',
        'Government covers unpaid interest',
        saveSim.forgiveness > 0 ? `$${Math.round(saveSim.forgiveness).toLocaleString()} forgiven after ${Math.ceil(saveForgiveness/12)} years` : 'Paid in full before forgiveness'
      ]
    })

    // PAYE Plan (10% of discretionary income, 150% poverty line, capped)
    const payePayment = Math.min(
      calculateIDRPayment(combinedIncome, familySize, 10, 1.5),
      standardPayment
    )
    const payeSim = simulateLoanRepayment(totalBalance, weightedInterestRate, payePayment, 300, 240)
    const payeEligible = payePayment < standardPayment
    allResults.push({
      planName: 'PAYE Plan',
      monthlyPayment: payePayment,
      totalPaid: payeSim.totalPaid,
      totalInterest: payeSim.totalInterest,
      payoffMonths: payeSim.payoffMonths,
      forgiveness: payeSim.forgiveness,
      forgivenessYear: payeSim.forgiveness > 0 ? 20 : null,
      isEligible: payeEligible,
      notes: payeEligible 
        ? [
            '10% of discretionary income (capped)',
            'Must be "new borrower" as of Oct 2007',
            payeSim.forgiveness > 0 ? `$${Math.round(payeSim.forgiveness).toLocaleString()} forgiven after 20 years` : 'Paid in full before forgiveness'
          ]
        : ['May not qualify - payment exceeds Standard Plan']
    })

    // IBR Plan (10% or 15% depending on when borrowed)
    const ibrPayment = Math.min(
      calculateIDRPayment(combinedIncome, familySize, 10, 1.5), // Assuming new borrower
      standardPayment
    )
    const ibrSim = simulateLoanRepayment(totalBalance, weightedInterestRate, ibrPayment, 300, 240)
    allResults.push({
      planName: 'IBR Plan (New Borrower)',
      monthlyPayment: ibrPayment,
      totalPaid: ibrSim.totalPaid,
      totalInterest: ibrSim.totalInterest,
      payoffMonths: ibrSim.payoffMonths,
      forgiveness: ibrSim.forgiveness,
      forgivenessYear: ibrSim.forgiveness > 0 ? 20 : null,
      isEligible: ibrPayment < standardPayment,
      notes: [
        '10% of discretionary income for new borrowers',
        '15% for borrowers before July 2014',
        ibrSim.forgiveness > 0 ? `$${Math.round(ibrSim.forgiveness).toLocaleString()} forgiven after 20 years` : 'Paid in full before forgiveness'
      ]
    })

    // ICR Plan (20% of discretionary income)
    const icrPayment = calculateIDRPayment(combinedIncome, familySize, 20, 1.0)
    const icrSim = simulateLoanRepayment(totalBalance, weightedInterestRate, icrPayment, 300, 300)
    allResults.push({
      planName: 'ICR Plan',
      monthlyPayment: icrPayment,
      totalPaid: icrSim.totalPaid,
      totalInterest: icrSim.totalInterest,
      payoffMonths: icrSim.payoffMonths,
      forgiveness: icrSim.forgiveness,
      forgivenessYear: icrSim.forgiveness > 0 ? 25 : null,
      isEligible: true,
      notes: [
        '20% of discretionary income',
        'Only IDR option for Parent PLUS (after consolidation)',
        'Highest payments among IDR plans'
      ]
    })

    return allResults.filter(r => selectedPlans.includes(r.planName.toLowerCase().replace(/[^a-z]/g, '').substring(0, 4)) || selectedPlans.length === 0)
  }, [inputs, showResults, selectedPlans])

  // Export to CSV - defined after results
  const handleExportCSV = useCallback(() => {
    if (results.length === 0) return
    
    const headers = ['Plan Name', 'Monthly Payment', 'Total Paid', 'Total Interest', 'Payoff Time (months)', 'Forgiveness Amount']
    const rows = results.map(r => [
      r.planName,
      r.monthlyPayment.toFixed(2),
      r.totalPaid.toFixed(2),
      r.totalInterest.toFixed(2),
      r.payoffMonths.toString(),
      r.forgiveness.toFixed(2)
    ])
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `loan-simulation-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }, [results])

  const handleInputChange = (field: keyof SimulatorInputs, value: string | number) => {
    setInputs(prev => ({
      ...prev,
      [field]: typeof value === 'string' ? parseFloat(value) || 0 : value
    }))
    setShowResults(false)
    // Clear validation error for this field when user types
    setValidationErrors(prev => prev.filter(e => e.field !== field))
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatMonths = (months: number) => {
    const years = Math.floor(months / 12)
    const remainingMonths = months % 12
    if (years === 0) return `${remainingMonths} months`
    if (remainingMonths === 0) return `${years} years`
    return `${years} years, ${remainingMonths} months`
  }

  // Find best options
  const lowestPayment = results.length > 0 ? Math.min(...results.filter(r => r.isEligible).map(r => r.monthlyPayment)) : 0
  const lowestTotal = results.length > 0 ? Math.min(...results.filter(r => r.isEligible).map(r => r.totalPaid)) : 0
  const fastestPayoff = results.length > 0 ? Math.min(...results.filter(r => r.isEligible).map(r => r.payoffMonths)) : 0

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center space-x-2 text-sm">
              <Link href="/manage-loans" className="text-[#005ea2] hover:underline">
                Manage Loans
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-600">Loan Simulator</span>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#162e51] via-[#1a3a64] to-[#0d2240] text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-white/10 rounded-xl">
                  <Calculator className="w-8 h-8 text-[#00bde3]" />
                </div>
                <span className="text-[#00bde3] font-semibold">Loan Simulator</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Student Loan Repayment Calculator
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                Compare repayment plans side-by-side to find the best option for your situation. 
                See how different plans affect your monthly payment, total cost, and payoff timeline.
              </p>
            </div>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Input Form */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 sticky top-4">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-[#005ea2]" />
                    Your Information
                  </h2>

                  <div className="space-y-6">
                    {/* Loan Information */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wide">Loan Details</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Total Loan Balance
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                            <Input
                              type="number"
                              value={inputs.totalBalance || ''}
                              onChange={(e) => handleInputChange('totalBalance', e.target.value)}
                              className={`pl-7 ${getFieldError('totalBalance') ? 'border-red-500' : ''}`}
                              placeholder="35000"
                              aria-label="Total loan balance in dollars"
                              aria-invalid={!!getFieldError('totalBalance')}
                              aria-describedby={getFieldError('totalBalance') ? 'balance-error' : undefined}
                            />
                          </div>
                          {getFieldError('totalBalance') && (
                            <p id="balance-error" className="text-red-600 text-xs mt-1" role="alert">
                              {getFieldError('totalBalance')}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Weighted Interest Rate (%)
                          </label>
                          <div className="relative">
                            <Input
                              type="number"
                              step="0.1"
                              value={inputs.weightedInterestRate || ''}
                              onChange={(e) => handleInputChange('weightedInterestRate', e.target.value)}
                              className={getFieldError('weightedInterestRate') ? 'border-red-500' : ''}
                              placeholder="5.5"
                              aria-label="Weighted interest rate percentage"
                              aria-invalid={!!getFieldError('weightedInterestRate')}
                              aria-describedby={getFieldError('weightedInterestRate') ? 'rate-error' : undefined}
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                          </div>
                          {getFieldError('weightedInterestRate') && (
                            <p id="rate-error" className="text-red-600 text-xs mt-1" role="alert">
                              {getFieldError('weightedInterestRate')}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            Average rate across all your loans
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Income Information */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wide">Income Details</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Annual Income (AGI)
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                            <Input
                              type="number"
                              value={inputs.annualIncome || ''}
                              onChange={(e) => handleInputChange('annualIncome', e.target.value)}
                              className={`pl-7 ${getFieldError('annualIncome') ? 'border-red-500' : ''}`}
                              placeholder="50000"
                              aria-label="Annual income in dollars"
                              aria-invalid={!!getFieldError('annualIncome')}
                            />
                          </div>
                          {getFieldError('annualIncome') && (
                            <p className="text-red-600 text-xs mt-1" role="alert">
                              {getFieldError('annualIncome')}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Family Size
                          </label>
                          <Select
                            value={inputs.familySize.toString()}
                            onChange={(e) => handleInputChange('familySize', parseInt(e.target.value))}
                            options={[
                              { value: '1', label: '1' },
                              { value: '2', label: '2' },
                              { value: '3', label: '3' },
                              { value: '4', label: '4' },
                              { value: '5', label: '5' },
                              { value: '6', label: '6' },
                              { value: '7', label: '7' },
                              { value: '8', label: '8' }
                            ]}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tax Filing Status
                          </label>
                          <Select
                            value={inputs.filingStatus}
                            onChange={(e) => setInputs(prev => ({ ...prev, filingStatus: e.target.value as any }))}
                            options={[
                              { value: 'single', label: 'Single' },
                              { value: 'married-joint', label: 'Married Filing Jointly' },
                              { value: 'married-separate', label: 'Married Filing Separately' }
                            ]}
                          />
                        </div>

                        {inputs.filingStatus === 'married-joint' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Spouse's Annual Income
                            </label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                              <Input
                                type="number"
                                value={inputs.spouseIncome || ''}
                                onChange={(e) => handleInputChange('spouseIncome', e.target.value)}
                                className="pl-7"
                                placeholder="0"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <Button
                      onClick={handleCalculate}
                      className="w-full bg-[#005ea2] hover:bg-[#004d8a] text-white font-semibold py-3 flex items-center justify-center gap-2"
                      aria-label="Calculate loan repayment estimates"
                    >
                      <Calculator className="w-5 h-5" />
                      Calculate Payments
                    </Button>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={handleReset}
                        className="flex-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md flex items-center justify-center gap-1 transition-colors"
                        aria-label="Reset all inputs to default values"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Reset
                      </button>
                      {showResults && (
                        <>
                          <button
                            onClick={handlePrint}
                            className="flex-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md flex items-center justify-center gap-1 transition-colors print:hidden"
                            aria-label="Print results"
                          >
                            <Printer className="w-4 h-4" />
                            Print
                          </button>
                          <button
                            onClick={handleExportCSV}
                            className="flex-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md flex items-center justify-center gap-1 transition-colors"
                            aria-label="Export results to CSV file"
                          >
                            <Download className="w-4 h-4" />
                            Export
                          </button>
                        </>
                      )}
                    </div>

                    {/* Save Status */}
                    {isSaved && (
                      <p className="text-xs text-gray-500 text-center mt-2 flex items-center justify-center gap-1">
                        <Save className="w-3 h-3" />
                        Data saved automatically
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="lg:col-span-2">
                {!showResults ? (
                  <div className="bg-gray-50 rounded-xl p-12 text-center border border-gray-200">
                    <Calculator className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">Enter Your Information</h3>
                    <p className="text-gray-500">
                      Fill out the form on the left and click "Calculate Payments" to compare repayment plans.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingDown className="w-5 h-5 text-green-600" />
                          <span className="text-sm font-medium text-green-800">Lowest Monthly Payment</span>
                        </div>
                        <div className="text-2xl font-bold text-green-900">{formatCurrency(lowestPayment)}</div>
                        <div className="text-sm text-green-700">
                          {results.find(r => r.monthlyPayment === lowestPayment && r.isEligible)?.planName}
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                          <PiggyBank className="w-5 h-5 text-blue-600" />
                          <span className="text-sm font-medium text-blue-800">Lowest Total Cost</span>
                        </div>
                        <div className="text-2xl font-bold text-blue-900">{formatCurrency(lowestTotal)}</div>
                        <div className="text-sm text-blue-700">
                          {results.find(r => r.totalPaid === lowestTotal && r.isEligible)?.planName}
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-4 border border-purple-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="w-5 h-5 text-purple-600" />
                          <span className="text-sm font-medium text-purple-800">Fastest Payoff</span>
                        </div>
                        <div className="text-2xl font-bold text-purple-900">{formatMonths(fastestPayoff)}</div>
                        <div className="text-sm text-purple-700">
                          {results.find(r => r.payoffMonths === fastestPayoff && r.isEligible)?.planName}
                        </div>
                      </div>
                    </div>

                    {/* Detailed Results */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-gray-900">Plan Comparison</h3>
                      
                      {results.map((result, index) => (
                        <div
                          key={index}
                          className={`bg-white rounded-xl p-6 border ${
                            result.isEligible ? 'border-gray-200' : 'border-gray-200 opacity-60'
                          } ${
                            result.monthlyPayment === lowestPayment && result.isEligible
                              ? 'ring-2 ring-green-500'
                              : ''
                          }`}
                        >
                          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-lg font-bold text-gray-900">{result.planName}</h4>
                                {result.monthlyPayment === lowestPayment && result.isEligible && (
                                  <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded">
                                    Lowest Payment
                                  </span>
                                )}
                                {result.totalPaid === lowestTotal && result.isEligible && (
                                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                                    Lowest Total
                                  </span>
                                )}
                                {!result.isEligible && (
                                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded">
                                    May Not Qualify
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-[#005ea2]">
                                {formatCurrency(result.monthlyPayment)}/mo
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <div className="text-sm text-gray-500">Total Paid</div>
                              <div className="font-semibold text-gray-900">{formatCurrency(result.totalPaid)}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">Total Interest</div>
                              <div className="font-semibold text-gray-900">{formatCurrency(result.totalInterest)}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">Payoff Time</div>
                              <div className="font-semibold text-gray-900">{formatMonths(result.payoffMonths)}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">Forgiveness</div>
                              <div className="font-semibold text-gray-900">
                                {result.forgiveness > 0 ? formatCurrency(result.forgiveness) : '—'}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {result.notes.map((note, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                              >
                                {note}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Disclaimer */}
                    <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-amber-800">
                          <strong>Disclaimer:</strong> These are estimates based on the information you provided. 
                          Actual payments may vary based on your specific loan details, servicer calculations, 
                          and program requirements. For personalized information, contact your loan servicer or 
                          use the official <a href="https://studentaid.gov/loan-simulator" target="_blank" rel="noopener noreferrer" className="underline hover:text-amber-900">Federal Student Aid Loan Simulator</a>.
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Tips Section */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Choosing the Right Repayment Plan</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <TrendingDown className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Want Lower Payments?</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Income-Driven Repayment plans base your payment on what you can afford. 
                  The SAVE plan typically offers the lowest payments for most borrowers.
                </p>
                <Link href="/manage-loans/repayment/plans" className="text-[#005ea2] hover:underline text-sm font-medium flex items-center gap-1">
                  Learn about IDR plans <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <PiggyBank className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Want to Pay Less Overall?</h3>
                <p className="text-gray-600 text-sm mb-4">
                  The Standard 10-year plan has the highest monthly payments but the lowest 
                  total cost. Paying extra when possible also saves money.
                </p>
                <Link href="/manage-loans/repayment" className="text-[#005ea2] hover:underline text-sm font-medium flex items-center gap-1">
                  Payment strategies <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Pursuing PSLF?</h3>
                <p className="text-gray-600 text-sm mb-4">
                  If you work in public service, an IDR plan with low payments maximizes 
                  how much is forgiven after 120 payments (10 years).
                </p>
                <Link href="/manage-loans/forgiveness" className="text-[#005ea2] hover:underline text-sm font-medium flex items-center gap-1">
                  PSLF details <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Official Tool CTA */}
        <section className="py-12 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-gradient-to-r from-[#005ea2] to-[#0076d6] rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Try the Official Loan Simulator</h2>
              <p className="text-blue-100 mb-6">
                For the most accurate estimates using your actual loan data, use the Federal Student Aid 
                Loan Simulator. It connects to your real loan information.
              </p>
              <a
                href="https://studentaid.gov/loan-simulator"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-white text-[#005ea2] hover:bg-blue-50 font-semibold px-6 py-3 flex items-center gap-2 mx-auto">
                  <ExternalLink className="w-5 h-5" />
                  Go to Official Loan Simulator
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* Current Interest Rates & Economic Indicators */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <EconomicDashboard />
          </div>
        </section>

        {/* Navigation */}
        <section className="py-8 bg-gray-50 border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <Link href="/manage-loans/repayment/plans" className="flex items-center gap-2 text-[#005ea2] hover:underline">
                <ArrowLeft className="w-5 h-5" />
                Back to Repayment Plans
              </Link>
              <Link href="/manage-loans/forgiveness" className="flex items-center gap-2 text-[#005ea2] hover:underline">
                Loan Forgiveness
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
