'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import {
  FileText,
  Download,
  Eye,
  ChevronLeft,
  Printer,
  Info,
  CheckCircle,
  FileSpreadsheet,
  Users,
  DollarSign,
  Building,
  Home,
  CreditCard,
  Briefcase,
  Receipt,
  GraduationCap,
  X,
} from 'lucide-react'

interface Template {
  id: string
  name: string
  description: string
  category: string
  icon: React.ElementType
  color: string
  fields: TemplateField[]
  instructions: string[]
  sampleData: Record<string, string>
}

interface TemplateField {
  id: string
  label: string
  type: 'text' | 'number' | 'date' | 'currency' | 'ssn' | 'phone' | 'select'
  placeholder?: string
  options?: string[]
  required?: boolean
  helpText?: string
}

const templates: Template[] = [
  {
    id: 'tax-return-1040',
    name: 'Tax Return Summary (Form 1040)',
    description: 'Key information from your federal tax return needed for FAFSA',
    category: 'Tax Documents',
    icon: FileText,
    color: 'bg-green-500',
    fields: [
      { id: 'taxYear', label: 'Tax Year', type: 'select', options: ['2024', '2023', '2022'], required: true },
      { id: 'filingStatus', label: 'Filing Status', type: 'select', options: ['Single', 'Married Filing Jointly', 'Married Filing Separately', 'Head of Household', 'Qualifying Widow(er)'], required: true },
      { id: 'agi', label: 'Adjusted Gross Income (Line 11)', type: 'currency', placeholder: '0.00', required: true, helpText: 'Found on Line 11 of Form 1040' },
      { id: 'taxableIncome', label: 'Taxable Income (Line 15)', type: 'currency', placeholder: '0.00', required: true },
      { id: 'incomeTaxPaid', label: 'Total Tax (Line 24)', type: 'currency', placeholder: '0.00', required: true },
      { id: 'exemptions', label: 'Number of Exemptions', type: 'number', placeholder: '0' },
      { id: 'educationCredits', label: 'Education Credits (Line 29)', type: 'currency', placeholder: '0.00', helpText: 'American Opportunity or Lifetime Learning Credit' },
    ],
    instructions: [
      'Locate your filed IRS Form 1040 for the required tax year',
      'The IRS Data Retrieval Tool (DRT) can import this automatically',
      'If using DRT, values will be masked for security',
      'Keep original documents for verification if selected',
    ],
    sampleData: {
      taxYear: '2023',
      filingStatus: 'Married Filing Jointly',
      agi: '78,500',
      taxableIncome: '53,200',
      incomeTaxPaid: '6,384',
      exemptions: '4',
      educationCredits: '2,500',
    },
  },
  {
    id: 'w2-forms',
    name: 'W-2 Wage Statement',
    description: 'Wage and tax information from each employer',
    category: 'Income Records',
    icon: Receipt,
    color: 'bg-yellow-500',
    fields: [
      { id: 'employerName', label: 'Employer Name', type: 'text', placeholder: 'Company Name', required: true },
      { id: 'employerEIN', label: 'Employer ID Number (EIN)', type: 'text', placeholder: 'XX-XXXXXXX', required: true },
      { id: 'employerAddress', label: 'Employer Address', type: 'text', placeholder: 'Street, City, State ZIP' },
      { id: 'wagesTips', label: 'Box 1: Wages, Tips, Other Compensation', type: 'currency', placeholder: '0.00', required: true },
      { id: 'federalWithheld', label: 'Box 2: Federal Income Tax Withheld', type: 'currency', placeholder: '0.00', required: true },
      { id: 'socialSecurityWages', label: 'Box 3: Social Security Wages', type: 'currency', placeholder: '0.00' },
      { id: 'socialSecurityTax', label: 'Box 4: Social Security Tax Withheld', type: 'currency', placeholder: '0.00' },
      { id: 'medicareWages', label: 'Box 5: Medicare Wages', type: 'currency', placeholder: '0.00' },
      { id: 'medicareTax', label: 'Box 6: Medicare Tax Withheld', type: 'currency', placeholder: '0.00' },
    ],
    instructions: [
      'You need a separate W-2 from each employer',
      'Employers must provide W-2s by January 31',
      'Box 1 shows your total taxable wages',
      'Keep all W-2s for your records',
    ],
    sampleData: {
      employerName: 'ABC Corporation',
      employerEIN: '12-3456789',
      employerAddress: '123 Business Ave, Chicago, IL 60601',
      wagesTips: '52,000',
      federalWithheld: '5,720',
      socialSecurityWages: '52,000',
      socialSecurityTax: '3,224',
      medicareWages: '52,000',
      medicareTax: '754',
    },
  },
  {
    id: '1099-forms',
    name: '1099 Miscellaneous Income',
    description: 'Self-employment, interest, dividends, and other income',
    category: 'Income Records',
    icon: DollarSign,
    color: 'bg-orange-500',
    fields: [
      { id: 'form1099Type', label: '1099 Type', type: 'select', options: ['1099-MISC', '1099-NEC', '1099-INT', '1099-DIV', '1099-G', '1099-R'], required: true },
      { id: 'payerName', label: 'Payer Name', type: 'text', placeholder: 'Company or Institution Name', required: true },
      { id: 'payerTIN', label: 'Payer TIN', type: 'text', placeholder: 'XX-XXXXXXX' },
      { id: 'amount', label: 'Total Amount', type: 'currency', placeholder: '0.00', required: true },
      { id: 'federalWithheld', label: 'Federal Income Tax Withheld', type: 'currency', placeholder: '0.00' },
      { id: 'stateWithheld', label: 'State Income Tax Withheld', type: 'currency', placeholder: '0.00' },
    ],
    instructions: [
      '1099-NEC: Non-employee compensation (freelance/contract work)',
      '1099-INT: Interest income over $10 from banks',
      '1099-DIV: Dividend income from investments',
      '1099-G: Unemployment compensation or tax refunds',
      '1099-R: Retirement distributions',
    ],
    sampleData: {
      form1099Type: '1099-NEC',
      payerName: 'Freelance Client LLC',
      payerTIN: '98-7654321',
      amount: '8,500',
      federalWithheld: '0',
      stateWithheld: '0',
    },
  },
  {
    id: 'bank-statements',
    name: 'Bank Account Summary',
    description: 'Current balances of all checking and savings accounts',
    category: 'Asset Information',
    icon: Building,
    color: 'bg-blue-500',
    fields: [
      { id: 'bankName', label: 'Bank/Institution Name', type: 'text', placeholder: 'Bank Name', required: true },
      { id: 'accountType', label: 'Account Type', type: 'select', options: ['Checking', 'Savings', 'Money Market', 'CD'], required: true },
      { id: 'accountLast4', label: 'Account Number (Last 4 digits)', type: 'text', placeholder: 'XXXX' },
      { id: 'currentBalance', label: 'Current Balance', type: 'currency', placeholder: '0.00', required: true, helpText: 'Balance as of date you complete FAFSA' },
      { id: 'balanceDate', label: 'Balance Date', type: 'date', required: true },
      { id: 'ownerName', label: 'Account Owner(s)', type: 'text', placeholder: 'Name(s) on account' },
    ],
    instructions: [
      'Report balance as of the day you complete FAFSA',
      'Include ALL checking, savings, and money market accounts',
      'Include CDs (Certificates of Deposit)',
      'Do NOT include retirement accounts (401k, IRA, etc.)',
      'Joint accounts: report full balance if you have access',
    ],
    sampleData: {
      bankName: 'First National Bank',
      accountType: 'Checking',
      accountLast4: '4521',
      currentBalance: '3,245.67',
      balanceDate: '2024-10-01',
      ownerName: 'John Smith',
    },
  },
  {
    id: 'investment-statements',
    name: 'Investment Account Summary',
    description: 'Stocks, bonds, mutual funds, and other investments',
    category: 'Asset Information',
    icon: CreditCard,
    color: 'bg-purple-500',
    fields: [
      { id: 'brokerageName', label: 'Brokerage/Institution', type: 'text', placeholder: 'Fidelity, Vanguard, etc.', required: true },
      { id: 'accountType', label: 'Account Type', type: 'select', options: ['Individual Brokerage', 'Joint Brokerage', '529 Plan', 'UGMA/UTMA', 'Trust', 'Other'], required: true },
      { id: 'accountNumber', label: 'Account Number (Last 4)', type: 'text', placeholder: 'XXXX' },
      { id: 'marketValue', label: 'Current Market Value', type: 'currency', placeholder: '0.00', required: true },
      { id: 'marginBalance', label: 'Margin Balance Owed (if any)', type: 'currency', placeholder: '0.00' },
      { id: 'netValue', label: 'Net Value', type: 'currency', placeholder: '0.00', required: true, helpText: 'Market value minus any debt' },
      { id: 'valueDate', label: 'Value Date', type: 'date', required: true },
    ],
    instructions: [
      'Report current market value, not what you paid',
      'Include stocks, bonds, mutual funds, ETFs',
      'Include 529 plans owned by parent for student',
      'Do NOT include retirement accounts (401k, 403b, IRA, Roth IRA)',
      'Subtract any margin debt from total value',
    ],
    sampleData: {
      brokerageName: 'Fidelity Investments',
      accountType: 'Individual Brokerage',
      accountNumber: '7892',
      marketValue: '15,340.00',
      marginBalance: '0',
      netValue: '15,340.00',
      valueDate: '2024-10-01',
    },
  },
  {
    id: 'real-estate',
    name: 'Real Estate Holdings',
    description: 'Investment properties (NOT your primary residence)',
    category: 'Asset Information',
    icon: Home,
    color: 'bg-teal-500',
    fields: [
      { id: 'propertyAddress', label: 'Property Address', type: 'text', placeholder: 'Full address', required: true },
      { id: 'propertyType', label: 'Property Type', type: 'select', options: ['Rental Property', 'Vacation Home', 'Land', 'Commercial', 'Other'], required: true },
      { id: 'marketValue', label: 'Current Market Value', type: 'currency', placeholder: '0.00', required: true, helpText: 'Estimated fair market value today' },
      { id: 'mortgageOwed', label: 'Mortgage/Debt Owed', type: 'currency', placeholder: '0.00', required: true },
      { id: 'netEquity', label: 'Net Equity', type: 'currency', placeholder: '0.00', required: true, helpText: 'Market value minus mortgage balance' },
      { id: 'ownershipPercent', label: 'Your Ownership Percentage', type: 'number', placeholder: '100' },
    ],
    instructions: [
      'Do NOT report your primary residence (where you live)',
      'Include rental properties, vacation homes, land',
      'Use current fair market value (Zillow, recent appraisal)',
      'Net equity = Market value minus total debt on property',
      'For partial ownership, report your share only',
    ],
    sampleData: {
      propertyAddress: '456 Rental Lane, Austin, TX 78701',
      propertyType: 'Rental Property',
      marketValue: '185,000',
      mortgageOwed: '120,000',
      netEquity: '65,000',
      ownershipPercent: '100',
    },
  },
  {
    id: 'business-records',
    name: 'Business Ownership',
    description: 'Net worth of businesses you own or have interest in',
    category: 'Asset Information',
    icon: Briefcase,
    color: 'bg-indigo-500',
    fields: [
      { id: 'businessName', label: 'Business Name', type: 'text', placeholder: 'Business name', required: true },
      { id: 'businessType', label: 'Business Type', type: 'select', options: ['Sole Proprietorship', 'Partnership', 'LLC', 'S-Corporation', 'C-Corporation', 'Other'], required: true },
      { id: 'ownershipPercent', label: 'Your Ownership Percentage', type: 'number', placeholder: '100', required: true },
      { id: 'numberOfEmployees', label: 'Number of Full-Time Employees', type: 'number', placeholder: '0', required: true, helpText: 'Businesses with 100 or fewer may be excluded' },
      { id: 'totalAssets', label: 'Total Business Assets', type: 'currency', placeholder: '0.00', required: true },
      { id: 'totalLiabilities', label: 'Total Business Liabilities', type: 'currency', placeholder: '0.00', required: true },
      { id: 'netWorth', label: 'Business Net Worth', type: 'currency', placeholder: '0.00', required: true },
    ],
    instructions: [
      'Small family businesses (≤100 employees) may be excluded from assets',
      'Family farms have special treatment - consult financial aid office',
      'Net worth = Total assets minus total liabilities',
      'For partnerships, report your share based on ownership percentage',
    ],
    sampleData: {
      businessName: 'Smith Consulting LLC',
      businessType: 'LLC',
      ownershipPercent: '50',
      numberOfEmployees: '3',
      totalAssets: '45,000',
      totalLiabilities: '12,000',
      netWorth: '33,000',
    },
  },
  {
    id: 'household-info',
    name: 'Household Information Worksheet',
    description: 'List of household members for family size calculation',
    category: 'Household Information',
    icon: Users,
    color: 'bg-pink-500',
    fields: [
      { id: 'memberName', label: 'Full Name', type: 'text', placeholder: 'First and Last Name', required: true },
      { id: 'relationship', label: 'Relationship to Student', type: 'select', options: ['Self (Student)', 'Parent', 'Stepparent', 'Sibling', 'Spouse', 'Child', 'Other Dependent'], required: true },
      { id: 'age', label: 'Age', type: 'number', placeholder: '0', required: true },
      { id: 'inCollege', label: 'Will be in college 2025-26?', type: 'select', options: ['Yes - at least half-time', 'No'], required: true, helpText: 'Enrolled at least half-time in degree program' },
      { id: 'supportPercent', label: 'Percent Support Provided', type: 'number', placeholder: '100', helpText: 'Must be >50% to be counted' },
    ],
    instructions: [
      'Include yourself (the student)',
      'Include parents if you\'re a dependent student',
      'Include siblings if parents provide >50% of their support',
      'Include your children/dependents if you provide >50% support',
      'Do NOT include roommates or people not receiving support',
      'Number in college affects your aid eligibility',
    ],
    sampleData: {
      memberName: 'Jane Smith',
      relationship: 'Self (Student)',
      age: '18',
      inCollege: 'Yes - at least half-time',
      supportPercent: '100',
    },
  },
  {
    id: 'school-codes',
    name: 'School Selection Worksheet',
    description: 'Federal School Codes for colleges you\'re considering',
    category: 'School Information',
    icon: GraduationCap,
    color: 'bg-red-500',
    fields: [
      { id: 'schoolName', label: 'School Name', type: 'text', placeholder: 'University/College Name', required: true },
      { id: 'federalCode', label: 'Federal School Code', type: 'text', placeholder: '000000', required: true, helpText: '6-digit code from studentaid.gov' },
      { id: 'city', label: 'City', type: 'text', placeholder: 'City' },
      { id: 'state', label: 'State', type: 'text', placeholder: 'State' },
      { id: 'housingPlan', label: 'Housing Plan', type: 'select', options: ['On Campus', 'Off Campus', 'With Parent'], required: true },
      { id: 'priority', label: 'Priority', type: 'select', options: ['First Choice', 'Second Choice', 'Third Choice', 'Safety School', 'Considering'] },
    ],
    instructions: [
      'You can list up to 20 schools on FAFSA',
      'Search for codes at studentaid.gov/fafsa-app/FSCsearch',
      'Order doesn\'t matter - all schools receive the same information',
      'You can add more schools after submitting FAFSA',
      'Housing plan affects Cost of Attendance calculation',
    ],
    sampleData: {
      schoolName: 'University of Illinois at Urbana-Champaign',
      federalCode: '001775',
      city: 'Champaign',
      state: 'Illinois',
      housingPlan: 'On Campus',
      priority: 'First Choice',
    },
  },
  {
    id: 'untaxed-income',
    name: 'Untaxed Income Worksheet',
    description: 'Income not reported on tax returns',
    category: 'Income Records',
    icon: FileSpreadsheet,
    color: 'bg-cyan-500',
    fields: [
      { id: 'incomeType', label: 'Type of Untaxed Income', type: 'select', options: ['Child Support Received', 'Workers\' Compensation', 'Veterans Benefits', 'Housing Allowance', 'Combat Pay', 'Clergy Housing', 'Other'], required: true },
      { id: 'annualAmount', label: 'Annual Amount', type: 'currency', placeholder: '0.00', required: true },
      { id: 'source', label: 'Source/Payer', type: 'text', placeholder: 'Who pays this?' },
      { id: 'frequency', label: 'Payment Frequency', type: 'select', options: ['Monthly', 'Bi-weekly', 'Weekly', 'Annual', 'One-time'] },
      { id: 'startDate', label: 'When Did Payments Start?', type: 'date' },
    ],
    instructions: [
      'Report all untaxed income for the appropriate tax year',
      'Child support received IS reported (paid is separate)',
      'Veterans education benefits are NOT reported here',
      'Tax-exempt interest income is reported separately',
      'Living allowances (military, clergy) are included',
    ],
    sampleData: {
      incomeType: 'Child Support Received',
      annualAmount: '6,000',
      source: 'Ex-Spouse',
      frequency: 'Monthly',
      startDate: '2020-01-15',
    },
  },
  {
    id: 'child-support',
    name: 'Child Support Payment Records',
    description: 'Child support paid to others during the year',
    category: 'Household Information',
    icon: Users,
    color: 'bg-amber-500',
    fields: [
      { id: 'recipientName', label: 'Recipient Name', type: 'text', placeholder: 'Name of person receiving support', required: true },
      { id: 'childName', label: 'Child\'s Name', type: 'text', placeholder: 'Child\'s name', required: true },
      { id: 'annualAmount', label: 'Annual Amount Paid', type: 'currency', placeholder: '0.00', required: true },
      { id: 'courtOrdered', label: 'Court Ordered?', type: 'select', options: ['Yes', 'No'], required: true },
      { id: 'caseNumber', label: 'Case/Court Order Number', type: 'text', placeholder: 'If applicable' },
    ],
    instructions: [
      'Report child support PAID (separate from support received)',
      'Include court-ordered and voluntary payments',
      'Keep payment records (canceled checks, court receipts)',
      'This reduces your available income for FAFSA calculation',
    ],
    sampleData: {
      recipientName: 'Jane Doe',
      childName: 'Tommy Doe',
      annualAmount: '7,200',
      courtOrdered: 'Yes',
      caseNumber: 'FAM-2019-12345',
    },
  },
  {
    id: 'schedule-c',
    name: 'Schedule C - Self Employment',
    description: 'Business income and expenses for self-employed individuals',
    category: 'Tax Documents',
    icon: Briefcase,
    color: 'bg-emerald-500',
    fields: [
      { id: 'businessName', label: 'Business Name', type: 'text', placeholder: 'Business or your name', required: true },
      { id: 'businessCode', label: 'Business Code', type: 'text', placeholder: 'NAICS code' },
      { id: 'grossReceipts', label: 'Gross Receipts (Line 1)', type: 'currency', placeholder: '0.00', required: true },
      { id: 'totalExpenses', label: 'Total Expenses (Line 28)', type: 'currency', placeholder: '0.00', required: true },
      { id: 'netProfit', label: 'Net Profit/Loss (Line 31)', type: 'currency', placeholder: '0.00', required: true, helpText: 'This is what FAFSA uses' },
      { id: 'businessUseHome', label: 'Business Use of Home Deduction', type: 'currency', placeholder: '0.00' },
    ],
    instructions: [
      'Net profit from Line 31 is used for FAFSA calculations',
      'Keep records of all business income and expenses',
      'Depreciation may be added back for some calculations',
      'Self-employment tax is calculated separately',
    ],
    sampleData: {
      businessName: 'Smith Freelance Services',
      businessCode: '541990',
      grossReceipts: '45,000',
      totalExpenses: '12,500',
      netProfit: '32,500',
      businessUseHome: '1,800',
    },
  },
]

export default function TemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [showSampleData, setShowSampleData] = useState(false)
  const [formData, setFormData] = useState<Record<string, string>>({})

  const handleFieldChange = (fieldId: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }))
  }

  const loadSampleData = () => {
    if (selectedTemplate) {
      setFormData(selectedTemplate.sampleData)
      setShowSampleData(true)
    }
  }

  const clearForm = () => {
    setFormData({})
    setShowSampleData(false)
  }

  const printTemplate = () => {
    window.print()
  }

  const categories = [...new Set(templates.map(t => t.category))]

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1">
        {/* Header */}
        <section className="bg-gradient-to-br from-primary to-primary-darker text-white py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <Link href="/documents" className="inline-flex items-center gap-2 text-primary-light hover:text-white mb-4">
              <ChevronLeft className="w-4 h-4" />
              Back to Document Checklist
            </Link>
            <h1 className="text-3xl font-bold mb-2">Document Templates</h1>
            <p className="text-primary-light">
              Use these worksheets to organize your information before completing FAFSA. 
              Load sample data to see what typical entries look like.
            </p>
          </div>
        </section>

        <div className="max-w-6xl mx-auto py-8 px-4">
          {selectedTemplate ? (
            /* Template Detail View */
            <div className="bg-white rounded-xl shadow-lg border overflow-hidden">
              {/* Template Header */}
              <div className={`${selectedTemplate.color} text-white p-6`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <selectedTemplate.icon className="w-10 h-10" />
                    <div>
                      <h2 className="text-2xl font-bold">{selectedTemplate.name}</h2>
                      <p className="text-white/80">{selectedTemplate.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedTemplate(null)
                      clearForm()
                    }}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 border-b p-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-blue-800 mb-2">Instructions</h3>
                    <ul className="space-y-1">
                      {selectedTemplate.instructions.map((instruction, index) => (
                        <li key={index} className="text-blue-700 text-sm flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          {instruction}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 border-b bg-gray-50 flex flex-wrap gap-3">
                <Button onClick={loadSampleData} variant="outline" className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Load Sample Data
                </Button>
                <Button onClick={clearForm} variant="outline" className="flex items-center gap-2">
                  Clear Form
                </Button>
                <Button onClick={printTemplate} variant="outline" className="flex items-center gap-2">
                  <Printer className="w-4 h-4" />
                  Print
                </Button>
              </div>

              {/* Form Fields */}
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {selectedTemplate.fields.map(field => (
                    <div key={field.id} className={field.type === 'text' && field.id.includes('address') ? 'md:col-span-2' : ''}>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      
                      {field.type === 'select' ? (
                        <select
                          value={formData[field.id] || ''}
                          onChange={(e) => handleFieldChange(field.id, e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                        >
                          <option value="">Select...</option>
                          {field.options?.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      ) : field.type === 'currency' ? (
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                          <input
                            type="text"
                            value={formData[field.id] || ''}
                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                            placeholder={field.placeholder}
                            className="w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                          />
                        </div>
                      ) : (
                        <input
                          type={field.type === 'date' ? 'date' : field.type === 'number' ? 'number' : 'text'}
                          value={formData[field.id] || ''}
                          onChange={(e) => handleFieldChange(field.id, e.target.value)}
                          placeholder={field.placeholder}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                      )}
                      
                      {field.helpText && (
                        <p className="text-xs text-gray-500 mt-1">{field.helpText}</p>
                      )}
                    </div>
                  ))}
                </div>

                {showSampleData && (
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 text-green-800">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">Sample data loaded!</span>
                    </div>
                    <p className="text-green-700 text-sm mt-1">
                      This shows example values. Replace with your actual information.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Template List View */
            <div className="space-y-8">
              {categories.map(category => {
                const categoryTemplates = templates.filter(t => t.category === category)
                return (
                  <div key={category}>
                    <h2 className="text-xl font-bold text-gray-800 mb-4">{category}</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {categoryTemplates.map(template => {
                        const TemplateIcon = template.icon
                        // W-2 has a dedicated page with authentic IRS form
                        if (template.id === 'w2-forms') {
                          return (
                            <Link
                              key={template.id}
                              href="/documents/templates/w2"
                              className="bg-white rounded-xl p-5 shadow-md border hover:shadow-lg hover:border-primary transition-all text-left group"
                            >
                              <div className="flex items-start gap-4">
                                <div className={`w-12 h-12 ${template.color} rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                                  <TemplateIcon className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                                    {template.name}
                                  </h3>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {template.description}
                                  </p>
                                  <p className="text-xs text-green-600 mt-2 font-medium flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" />
                                    Official IRS Format →
                                  </p>
                                </div>
                              </div>
                            </Link>
                          )
                        }
                        return (
                          <button
                            key={template.id}
                            onClick={() => setSelectedTemplate(template)}
                            className="bg-white rounded-xl p-5 shadow-md border hover:shadow-lg hover:border-primary transition-all text-left group"
                          >
                            <div className="flex items-start gap-4">
                              <div className={`w-12 h-12 ${template.color} rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                                <TemplateIcon className="w-6 h-6" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                                  {template.name}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                  {template.description}
                                </p>
                                <p className="text-xs text-primary mt-2 font-medium">
                                  {template.fields.length} fields →
                                </p>
                              </div>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Help Section */}
        {!selectedTemplate && (
          <section className="bg-gray-100 py-8 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">How to Use These Templates</h2>
              <div className="grid md:grid-cols-3 gap-6 mt-6">
                <div className="bg-white rounded-lg p-5 shadow">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <h3 className="font-semibold mb-2">Select a Template</h3>
                  <p className="text-sm text-gray-600">
                    Choose the document type you need to prepare
                  </p>
                </div>
                <div className="bg-white rounded-lg p-5 shadow">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">2</span>
                  </div>
                  <h3 className="font-semibold mb-2">View Sample Data</h3>
                  <p className="text-sm text-gray-600">
                    Load sample data to see what typical entries look like
                  </p>
                </div>
                <div className="bg-white rounded-lg p-5 shadow">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">3</span>
                  </div>
                  <h3 className="font-semibold mb-2">Fill In Your Info</h3>
                  <p className="text-sm text-gray-600">
                    Replace sample data with your actual information
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
      
      <Footer />
    </div>
  )
}
