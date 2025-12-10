'use client'

import { useState } from 'react'
import { ApplicationWizard } from '@/components/application/ApplicationWizard'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Radio } from '@/components/ui/Radio'
import { Checkbox } from '@/components/ui/Checkbox'
import { Alert } from '@/components/ui/Alert'
import { Tooltip } from '@/components/ui/Tooltip'
import { 
  DollarSign, 
  FileText, 
  HelpCircle, 
  TrendingUp, 
  Building2,
  Calculator,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

interface FinancialData {
  // Tax Information
  taxFilingStatus: string
  taxReturnType: string
  adjustedGrossIncome: string
  usTaxPaid: string
  
  // Income from Work
  studentEarnings: string
  spouseEarnings: string
  
  // Untaxed Income
  childSupportReceived: string
  interestIncome: string
  iraDistributions: string
  untaxedPensions: string
  housingAllowance: string
  veteransNoneducationBenefits: string
  otherUntaxedIncome: string
  
  // Assets
  cashSavingsChecking: string
  investmentNetWorth: string
  businessFarmNetWorth: string
  
  // Additional Information
  isDislocatedWorker: string
  receivedMeansTestedBenefits: string
  
  // Confirmation
  useIrsDataRetrieval: boolean
  confirmAccuracy: boolean
}

const TAX_FILING_STATUS_OPTIONS = [
  { value: '', label: 'Select filing status' },
  { value: 'single', label: 'Single' },
  { value: 'married-joint', label: 'Married Filing Jointly' },
  { value: 'married-separate', label: 'Married Filing Separately' },
  { value: 'head-household', label: 'Head of Household' },
  { value: 'widow', label: 'Qualifying Widow(er)' },
]

const TAX_RETURN_OPTIONS = [
  { value: '', label: 'Select tax return type' },
  { value: 'completed', label: 'Already completed 2023 tax return' },
  { value: 'will-file', label: 'Will file 2023 tax return' },
  { value: 'not-filing', label: 'Will not file 2023 tax return' },
]

const formatCurrency = (value: string): string => {
  const num = value.replace(/[^0-9]/g, '')
  if (!num) return ''
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(parseInt(num, 10))
}

const parseCurrency = (value: string): string => {
  return value.replace(/[^0-9]/g, '')
}

export default function FinancialPage() {
  const [formData, setFormData] = useState<FinancialData>({
    taxFilingStatus: '',
    taxReturnType: '',
    adjustedGrossIncome: '',
    usTaxPaid: '',
    studentEarnings: '',
    spouseEarnings: '',
    childSupportReceived: '',
    interestIncome: '',
    iraDistributions: '',
    untaxedPensions: '',
    housingAllowance: '',
    veteransNoneducationBenefits: '',
    otherUntaxedIncome: '',
    cashSavingsChecking: '',
    investmentNetWorth: '',
    businessFarmNetWorth: '',
    isDislocatedWorker: '',
    receivedMeansTestedBenefits: '',
    useIrsDataRetrieval: false,
    confirmAccuracy: false,
  })

  const [errors, setErrors] = useState<Partial<Record<keyof FinancialData, string>>>({})

  const handleChange = (field: keyof FinancialData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleCurrencyChange = (field: keyof FinancialData, value: string) => {
    const numericValue = parseCurrency(value)
    setFormData(prev => ({ ...prev, [field]: numericValue }))
  }

  const calculateEstimatedEFC = (): number => {
    const agi = parseInt(formData.adjustedGrossIncome || '0', 10)
    const assets = parseInt(formData.cashSavingsChecking || '0', 10) + 
                   parseInt(formData.investmentNetWorth || '0', 10)
    
    // Simplified EFC calculation for display purposes
    const incomeContribution = Math.max(0, (agi - 7000) * 0.22)
    const assetContribution = assets * 0.2
    
    return Math.round(incomeContribution + assetContribution)
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FinancialData, string>> = {}

    if (!formData.taxReturnType) {
      newErrors.taxReturnType = 'Please select your tax filing status'
    }
    if (formData.taxReturnType !== 'not-filing' && !formData.adjustedGrossIncome) {
      newErrors.adjustedGrossIncome = 'Please enter your adjusted gross income'
    }
    if (!formData.confirmAccuracy) {
      newErrors.confirmAccuracy = 'Please confirm the accuracy of your information'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = async () => {
    if (!validateForm()) {
      return Promise.reject('Please complete all required fields')
    }
    console.log('Saving financial data:', formData)
  }

  const estimatedEFC = calculateEstimatedEFC()

  return (
    <ApplicationWizard currentStep={4} onNext={handleNext}>
      <div className="space-y-8">
        {/* IRS Data Retrieval Tool Notice */}
        <Alert variant="info" title="Save Time with IRS Data Retrieval">
          <p className="mb-3">
            The IRS Data Retrieval Tool (DRT) can automatically transfer your tax information 
            to your FAFSA, reducing errors and speeding up processing.
          </p>
          <Checkbox
            label="I want to use the IRS Data Retrieval Tool (recommended)"
            checked={formData.useIrsDataRetrieval}
            onChange={(e) => handleChange('useIrsDataRetrieval', e.target.checked)}
          />
          {formData.useIrsDataRetrieval && (
            <p className="mt-2 text-sm text-gray-600">
              You'll be redirected to the IRS website to securely transfer your data during final submission.
            </p>
          )}
        </Alert>

        {/* Tax Information Section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-primary-darker">2023 Tax Information</h3>
          </div>
          <p className="text-sm text-gray-600 mb-6">
            Information from your 2023 federal income tax return (Form 1040).
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <Select
              label="Tax Return Status"
              value={formData.taxReturnType}
              onChange={(e) => handleChange('taxReturnType', e.target.value)}
              options={TAX_RETURN_OPTIONS}
              error={errors.taxReturnType}
              required
            />
            {formData.taxReturnType && formData.taxReturnType !== 'not-filing' && (
              <Select
                label="Filing Status"
                value={formData.taxFilingStatus}
                onChange={(e) => handleChange('taxFilingStatus', e.target.value)}
                options={TAX_FILING_STATUS_OPTIONS}
              />
            )}
          </div>

          {formData.taxReturnType !== 'not-filing' && formData.taxReturnType && (
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adjusted Gross Income (AGI)
                  <Tooltip content="Line 11 on your 2023 Form 1040">
                    <HelpCircle className="w-4 h-4 inline ml-1 text-gray-400" />
                  </Tooltip>
                </label>
                <Input
                  placeholder="$0"
                  value={formData.adjustedGrossIncome ? formatCurrency(formData.adjustedGrossIncome) : ''}
                  onChange={(e) => handleCurrencyChange('adjustedGrossIncome', e.target.value)}
                  error={errors.adjustedGrossIncome}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  U.S. Income Tax Paid
                  <Tooltip content="Line 22 on your 2023 Form 1040">
                    <HelpCircle className="w-4 h-4 inline ml-1 text-gray-400" />
                  </Tooltip>
                </label>
                <Input
                  placeholder="$0"
                  value={formData.usTaxPaid ? formatCurrency(formData.usTaxPaid) : ''}
                  onChange={(e) => handleCurrencyChange('usTaxPaid', e.target.value)}
                />
              </div>
            </div>
          )}
        </section>

        {/* Income from Work Section */}
        <section className="border-t border-gray-200 pt-8">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-primary-darker">Income from Work</h3>
          </div>
          <p className="text-sm text-gray-600 mb-6">
            Enter your 2023 income from work (wages, salaries, tips, etc.).
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Income from Work
                <Tooltip content="Total earnings from all jobs, including W-2 wages and self-employment">
                  <HelpCircle className="w-4 h-4 inline ml-1 text-gray-400" />
                </Tooltip>
              </label>
              <Input
                placeholder="$0"
                value={formData.studentEarnings ? formatCurrency(formData.studentEarnings) : ''}
                onChange={(e) => handleCurrencyChange('studentEarnings', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Spouse's Income from Work
                <Tooltip content="If married, enter your spouse's total earnings">
                  <HelpCircle className="w-4 h-4 inline ml-1 text-gray-400" />
                </Tooltip>
              </label>
              <Input
                placeholder="$0"
                value={formData.spouseEarnings ? formatCurrency(formData.spouseEarnings) : ''}
                onChange={(e) => handleCurrencyChange('spouseEarnings', e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Untaxed Income Section */}
        <section className="border-t border-gray-200 pt-8">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-primary-darker">Untaxed Income & Benefits</h3>
          </div>
          <p className="text-sm text-gray-600 mb-6">
            Report any untaxed income received in 2023. Enter $0 if none.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Child Support Received
              </label>
              <Input
                placeholder="$0"
                value={formData.childSupportReceived ? formatCurrency(formData.childSupportReceived) : ''}
                onChange={(e) => handleCurrencyChange('childSupportReceived', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tax-Exempt Interest Income
              </label>
              <Input
                placeholder="$0"
                value={formData.interestIncome ? formatCurrency(formData.interestIncome) : ''}
                onChange={(e) => handleCurrencyChange('interestIncome', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Untaxed IRA Distributions
              </label>
              <Input
                placeholder="$0"
                value={formData.iraDistributions ? formatCurrency(formData.iraDistributions) : ''}
                onChange={(e) => handleCurrencyChange('iraDistributions', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Untaxed Pensions
              </label>
              <Input
                placeholder="$0"
                value={formData.untaxedPensions ? formatCurrency(formData.untaxedPensions) : ''}
                onChange={(e) => handleCurrencyChange('untaxedPensions', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Military/Clergy Housing Allowance
              </label>
              <Input
                placeholder="$0"
                value={formData.housingAllowance ? formatCurrency(formData.housingAllowance) : ''}
                onChange={(e) => handleCurrencyChange('housingAllowance', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Veterans Non-Education Benefits
              </label>
              <Input
                placeholder="$0"
                value={formData.veteransNoneducationBenefits ? formatCurrency(formData.veteransNoneducationBenefits) : ''}
                onChange={(e) => handleCurrencyChange('veteransNoneducationBenefits', e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Other Untaxed Income
                <Tooltip content="Workers' compensation, disability, etc. (not reported elsewhere)">
                  <HelpCircle className="w-4 h-4 inline ml-1 text-gray-400" />
                </Tooltip>
              </label>
              <Input
                placeholder="$0"
                value={formData.otherUntaxedIncome ? formatCurrency(formData.otherUntaxedIncome) : ''}
                onChange={(e) => handleCurrencyChange('otherUntaxedIncome', e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Assets Section */}
        <section className="border-t border-gray-200 pt-8">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-primary-darker">Assets</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Report your current asset balances as of today.
          </p>
          
          <Alert variant="info" title="What to Include">
            Include savings, checking, money market accounts, and investment accounts. 
            Do NOT include retirement accounts (401k, IRA) or the value of your home.
          </Alert>

          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cash, Savings, and Checking
              </label>
              <Input
                placeholder="$0"
                value={formData.cashSavingsChecking ? formatCurrency(formData.cashSavingsChecking) : ''}
                onChange={(e) => handleCurrencyChange('cashSavingsChecking', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Net Worth of Investments
                <Tooltip content="Stocks, bonds, mutual funds, 529 plans, etc. (not retirement accounts)">
                  <HelpCircle className="w-4 h-4 inline ml-1 text-gray-400" />
                </Tooltip>
              </label>
              <Input
                placeholder="$0"
                value={formData.investmentNetWorth ? formatCurrency(formData.investmentNetWorth) : ''}
                onChange={(e) => handleCurrencyChange('investmentNetWorth', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Net Worth of Business/Farm
                <Tooltip content="Only include if you own a business with more than 100 employees">
                  <HelpCircle className="w-4 h-4 inline ml-1 text-gray-400" />
                </Tooltip>
              </label>
              <Input
                placeholder="$0"
                value={formData.businessFarmNetWorth ? formatCurrency(formData.businessFarmNetWorth) : ''}
                onChange={(e) => handleCurrencyChange('businessFarmNetWorth', e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Additional Questions */}
        <section className="border-t border-gray-200 pt-8">
          <h3 className="text-lg font-bold text-primary-darker mb-4">Additional Questions</h3>
          
          <div className="space-y-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-primary-darker mb-3">
                Are you a dislocated worker?
              </p>
              <p className="text-sm text-gray-600 mb-4">
                A dislocated worker is someone who has been laid off, or received a layoff notice, 
                from their job through no fault of their own.
              </p>
              <div className="flex gap-6">
                <Radio
                  name="isDislocatedWorker"
                  value="yes"
                  label="Yes"
                  checked={formData.isDislocatedWorker === 'yes'}
                  onChange={(e) => handleChange('isDislocatedWorker', e.target.value)}
                />
                <Radio
                  name="isDislocatedWorker"
                  value="no"
                  label="No"
                  checked={formData.isDislocatedWorker === 'no'}
                  onChange={(e) => handleChange('isDislocatedWorker', e.target.value)}
                />
                <Radio
                  name="isDislocatedWorker"
                  value="unsure"
                  label="Don't Know"
                  checked={formData.isDislocatedWorker === 'unsure'}
                  onChange={(e) => handleChange('isDislocatedWorker', e.target.value)}
                />
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-primary-darker mb-3">
                Did you (or your spouse) receive means-tested federal benefits in 2022 or 2023?
              </p>
              <p className="text-sm text-gray-600 mb-4">
                This includes SNAP (food stamps), Medicaid, SSI, TANF, or free/reduced school lunch.
              </p>
              <div className="flex gap-6">
                <Radio
                  name="receivedMeansTestedBenefits"
                  value="yes"
                  label="Yes"
                  checked={formData.receivedMeansTestedBenefits === 'yes'}
                  onChange={(e) => handleChange('receivedMeansTestedBenefits', e.target.value)}
                />
                <Radio
                  name="receivedMeansTestedBenefits"
                  value="no"
                  label="No"
                  checked={formData.receivedMeansTestedBenefits === 'no'}
                  onChange={(e) => handleChange('receivedMeansTestedBenefits', e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Estimated EFC Preview */}
        {(formData.adjustedGrossIncome || formData.cashSavingsChecking) && (
          <section className="border-t border-gray-200 pt-8">
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-lighter rounded-full flex items-center justify-center flex-shrink-0">
                  <Calculator className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-primary-darker mb-2">Estimated EFC Preview</h3>
                  <p className="text-3xl font-bold text-primary mb-2">
                    {formatCurrency(estimatedEFC.toString())}
                  </p>
                  <p className="text-sm text-gray-600">
                    This is a rough estimate based on the information provided. Your actual Expected Family 
                    Contribution (EFC) will be calculated after you submit your complete FAFSA.
                  </p>
                  {estimatedEFC <= 6656 && (
                    <div className="mt-3 flex items-center gap-2 text-primary-dark">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">You may be eligible for the Federal Pell Grant!</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Confirmation */}
        <section className="border-t border-gray-200 pt-8">
          <div className="p-4 bg-gray-50 rounded-lg">
            <Checkbox
              label={
                <span>
                  I certify that the information I have provided is accurate and complete to the best of my knowledge.
                  I understand that providing false information may result in penalties.
                </span>
              }
              checked={formData.confirmAccuracy}
              onChange={(e) => handleChange('confirmAccuracy', e.target.checked)}
            />
            {errors.confirmAccuracy && (
              <p className="mt-2 text-sm text-error flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.confirmAccuracy}
              </p>
            )}
          </div>
        </section>
      </div>
    </ApplicationWizard>
  )
}

