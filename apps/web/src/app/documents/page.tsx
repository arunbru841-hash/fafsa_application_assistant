'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import {
  FileText,
  Download,
  CheckCircle,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronRight,
  Printer,
  ExternalLink,
  FileCheck,
  DollarSign,
  Building,
  User,
  Users,
  GraduationCap,
  Shield,
  Calendar,
  CreditCard,
  Home,
  Briefcase,
  Car,
  PiggyBank,
  Receipt,
  FileSpreadsheet,
  ClipboardList,
} from 'lucide-react'

interface Document {
  id: string
  name: string
  description: string
  required: boolean
  category: 'identity' | 'tax' | 'income' | 'assets' | 'household' | 'school'
  forStudent: boolean
  forParent: boolean
  tips: string[]
  whereToGet: string
  templateAvailable: boolean
}

const documents: Document[] = [
  // Identity Documents
  {
    id: 'ssn-card',
    name: 'Social Security Number (SSN)',
    description: 'Your 9-digit Social Security Number is required to create an FSA ID and complete the FAFSA.',
    required: true,
    category: 'identity',
    forStudent: true,
    forParent: true,
    tips: [
      'You don\'t need the physical card - just the number',
      'If you don\'t have an SSN, you may still be eligible with an ITIN',
      'Parents without SSN can still contribute using their ITIN',
    ],
    whereToGet: 'Social Security Administration (ssa.gov) or your original card',
    templateAvailable: false,
  },
  {
    id: 'drivers-license',
    name: 'Driver\'s License or State ID',
    description: 'A valid state-issued ID with your current address for identity verification.',
    required: false,
    category: 'identity',
    forStudent: true,
    forParent: false,
    tips: [
      'Note your license number and state of issue',
      'Expiration date may be requested',
      'Passport can be used as alternative',
    ],
    whereToGet: 'Your state\'s DMV office',
    templateAvailable: false,
  },
  {
    id: 'alien-registration',
    name: 'Alien Registration Number',
    description: 'Required for eligible non-citizens to verify immigration status.',
    required: false,
    category: 'identity',
    forStudent: true,
    forParent: false,
    tips: [
      'Found on your Permanent Resident Card (Green Card)',
      'Also called USCIS Number or A-Number',
      '8-9 digit number starting with "A"',
    ],
    whereToGet: 'Your immigration documents or USCIS account',
    templateAvailable: false,
  },
  
  // Tax Documents
  {
    id: 'tax-return-1040',
    name: 'Federal Income Tax Return (IRS Form 1040)',
    description: 'Your completed federal tax return from two years prior (e.g., 2023 taxes for 2025-26 FAFSA).',
    required: true,
    category: 'tax',
    forStudent: true,
    forParent: true,
    tips: [
      'The IRS Data Retrieval Tool can auto-import this information',
      'Keep a copy even if you use IRS DRT',
      'Note your Adjusted Gross Income (AGI) from Line 11',
      'Record your tax filing status',
    ],
    whereToGet: 'IRS.gov (Get Transcript), tax preparer, or your records',
    templateAvailable: true,
  },
  {
    id: 'w2-forms',
    name: 'W-2 Forms (Wage Statements)',
    description: 'Wage and tax statements from all employers for the applicable tax year.',
    required: true,
    category: 'income',
    forStudent: true,
    forParent: true,
    tips: [
      'Collect W-2s from ALL employers during the year',
      'Box 1 shows your total wages',
      'Box 2 shows federal income tax withheld',
      'Keep for verification if selected',
    ],
    whereToGet: 'Your employer(s) - typically sent by January 31',
    templateAvailable: true,
  },
  {
    id: '1099-forms',
    name: '1099 Forms (Miscellaneous Income)',
    description: 'Records of other income: self-employment, interest, dividends, retirement distributions.',
    required: false,
    category: 'income',
    forStudent: true,
    forParent: true,
    tips: [
      '1099-MISC for freelance/contract work',
      '1099-INT for interest income over $10',
      '1099-DIV for dividend income',
      '1099-R for retirement distributions',
      '1099-G for unemployment compensation',
    ],
    whereToGet: 'Banks, brokerages, clients, or state unemployment office',
    templateAvailable: true,
  },
  {
    id: 'schedule-c',
    name: 'Schedule C (Self-Employment)',
    description: 'Business income and expenses for self-employed individuals.',
    required: false,
    category: 'income',
    forStudent: true,
    forParent: true,
    tips: [
      'Required if you have self-employment income',
      'Net profit from Line 31 is used',
      'Keep records of all business expenses',
    ],
    whereToGet: 'Prepared with your tax return',
    templateAvailable: true,
  },
  {
    id: 'schedule-k1',
    name: 'Schedule K-1 (Partnership/S-Corp Income)',
    description: 'Income from partnerships, S corporations, estates, or trusts.',
    required: false,
    category: 'income',
    forStudent: true,
    forParent: true,
    tips: [
      'Issued by the business entity',
      'Report income even if not distributed',
      'May arrive later than other tax documents',
    ],
    whereToGet: 'The partnership, S-corp, estate, or trust',
    templateAvailable: true,
  },
  
  // Asset Documents
  {
    id: 'bank-statements',
    name: 'Bank Account Statements',
    description: 'Current balances of checking and savings accounts as of the date you file.',
    required: true,
    category: 'assets',
    forStudent: true,
    forParent: true,
    tips: [
      'Record balances from ALL accounts',
      'Include savings, checking, and money market',
      'Use the balance as of the day you complete FAFSA',
      'Don\'t include retirement accounts (401k, IRA)',
    ],
    whereToGet: 'Online banking or recent statements',
    templateAvailable: true,
  },
  {
    id: 'investment-statements',
    name: 'Investment Account Statements',
    description: 'Current value of stocks, bonds, mutual funds, and other investments.',
    required: true,
    category: 'assets',
    forStudent: true,
    forParent: true,
    tips: [
      'Include brokerage accounts, CDs, and money market funds',
      'Report net worth (current value minus debt)',
      'Don\'t include retirement accounts (401k, IRA, pension)',
      'Include 529 plans owned by parent for student',
    ],
    whereToGet: 'Brokerage statements or online account',
    templateAvailable: true,
  },
  {
    id: 'real-estate',
    name: 'Real Estate Records',
    description: 'Market value and mortgage balance for investment properties (NOT your primary home).',
    required: false,
    category: 'assets',
    forStudent: true,
    forParent: true,
    tips: [
      'Primary residence is NOT reported as an asset',
      'Report rental properties and vacation homes',
      'Use current market value minus what you owe',
      'Land and commercial property included',
    ],
    whereToGet: 'Property tax assessment, Zillow estimate, mortgage statement',
    templateAvailable: true,
  },
  {
    id: 'business-records',
    name: 'Business Ownership Records',
    description: 'Net worth of any businesses you own (if more than 100 employees).',
    required: false,
    category: 'assets',
    forStudent: true,
    forParent: true,
    tips: [
      'Small businesses (≤100 employees) may be excluded',
      'Family farms are treated differently',
      'Report net worth: assets minus liabilities',
    ],
    whereToGet: 'Business financial statements, accountant',
    templateAvailable: true,
  },
  
  // Household Information
  {
    id: 'household-info',
    name: 'Household Information Worksheet',
    description: 'List of everyone in your household who receives more than 50% support.',
    required: true,
    category: 'household',
    forStudent: true,
    forParent: true,
    tips: [
      'Include yourself (the student)',
      'Include parents (for dependent students)',
      'Include other children if parents provide 50%+ support',
      'Include others living with you who receive 50%+ support',
    ],
    whereToGet: 'Complete the worksheet below',
    templateAvailable: true,
  },
  {
    id: 'child-support',
    name: 'Child Support Records',
    description: 'Records of child support paid or received during the tax year.',
    required: false,
    category: 'household',
    forStudent: false,
    forParent: true,
    tips: [
      'Child support RECEIVED is reported as untaxed income',
      'Child support PAID is reported separately',
      'Include all children, not just the student',
    ],
    whereToGet: 'Court orders, payment records, bank statements',
    templateAvailable: true,
  },
  {
    id: 'untaxed-income',
    name: 'Untaxed Income Records',
    description: 'Documentation of income not reported on tax returns.',
    required: false,
    category: 'income',
    forStudent: true,
    forParent: true,
    tips: [
      'Veterans non-education benefits',
      'Workers\' compensation',
      'Untaxed portions of IRA distributions',
      'Tax-exempt interest income',
      'Housing, food, and other living allowances',
    ],
    whereToGet: 'Benefits statements, bank records',
    templateAvailable: true,
  },
  
  // School Information
  {
    id: 'school-codes',
    name: 'School Federal Codes',
    description: 'Federal School Codes for up to 20 colleges you\'re considering.',
    required: true,
    category: 'school',
    forStudent: true,
    forParent: false,
    tips: [
      'Search for codes at fafsa.gov',
      'You can add up to 20 schools',
      'Order doesn\'t matter - all schools receive the same info',
      'You can add more schools after submission',
    ],
    whereToGet: 'Federal School Code Search at studentaid.gov',
    templateAvailable: true,
  },
]

const categories = [
  { id: 'identity', name: 'Identity Documents', icon: Shield, color: 'bg-blue-500' },
  { id: 'tax', name: 'Tax Documents', icon: FileText, color: 'bg-green-500' },
  { id: 'income', name: 'Income Records', icon: DollarSign, color: 'bg-yellow-500' },
  { id: 'assets', name: 'Asset Information', icon: PiggyBank, color: 'bg-purple-500' },
  { id: 'household', name: 'Household Information', icon: Users, color: 'bg-pink-500' },
  { id: 'school', name: 'School Information', icon: GraduationCap, color: 'bg-indigo-500' },
]

export default function DocumentsPage() {
  const [expandedDocs, setExpandedDocs] = useState<string[]>([])
  const [filter, setFilter] = useState<'all' | 'student' | 'parent'>('all')
  const [showRequired, setShowRequired] = useState(false)

  const toggleDoc = (docId: string) => {
    setExpandedDocs(prev =>
      prev.includes(docId) ? prev.filter(id => id !== docId) : [...prev, docId]
    )
  }

  const filteredDocs = documents.filter(doc => {
    if (showRequired && !doc.required) return false
    if (filter === 'student' && !doc.forStudent) return false
    if (filter === 'parent' && !doc.forParent) return false
    return true
  })

  const getDocsByCategory = (categoryId: string) => {
    return filteredDocs.filter(doc => doc.category === categoryId)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary to-primary-darker text-white py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <ClipboardList className="w-10 h-10" />
              <h1 className="text-3xl md:text-4xl font-bold">FAFSA Document Checklist</h1>
            </div>
            <p className="text-xl text-primary-light max-w-3xl">
              Gather these documents before starting your FAFSA application. Having everything ready 
              will make the process faster and help you avoid errors.
            </p>
            
            <div className="mt-8 flex flex-wrap gap-4">
              <Button variant="secondary" className="flex items-center gap-2">
                <Printer className="w-4 h-4" />
                Print Checklist
              </Button>
              <Link href="/documents/templates">
                <Button variant="outline" className="flex items-center gap-2 border-white text-white hover:bg-white/10">
                  <Download className="w-4 h-4" />
                  Download Templates
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Important Notice */}
        <section className="bg-amber-50 border-b border-amber-200 py-4 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-start gap-3">
              <Info className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h2 className="font-semibold text-amber-800">Important: Tax Year Information</h2>
                <p className="text-amber-700">
                  For the <strong>2025-26 FAFSA</strong>, you'll use tax information from <strong>2023</strong>.
                  For the <strong>2026-27 FAFSA</strong>, you'll use tax information from <strong>2024</strong>.
                  This is called the "prior-prior year" rule.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="bg-white border-b py-4 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-gray-600 font-medium">Filter by:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    filter === 'all'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Documents
                </button>
                <button
                  onClick={() => setFilter('student')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    filter === 'student'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <User className="w-4 h-4 inline-block mr-1" />
                  Student
                </button>
                <button
                  onClick={() => setFilter('parent')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    filter === 'parent'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Users className="w-4 h-4 inline-block mr-1" />
                  Parent
                </button>
              </div>
              <label className="flex items-center gap-2 cursor-pointer ml-auto">
                <input
                  type="checkbox"
                  checked={showRequired}
                  onChange={(e) => setShowRequired(e.target.checked)}
                  className="w-4 h-4 rounded text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-600">Required only</span>
              </label>
            </div>
          </div>
        </section>

        {/* Document Categories */}
        <section className="py-8 px-4">
          <div className="max-w-6xl mx-auto space-y-8">
            {categories.map(category => {
              const categoryDocs = getDocsByCategory(category.id)
              if (categoryDocs.length === 0) return null
              
              const CategoryIcon = category.icon
              
              return (
                <div key={category.id} className="bg-white rounded-xl shadow-md border overflow-hidden">
                  <div className={`${category.color} text-white px-6 py-4 flex items-center gap-3`}>
                    <CategoryIcon className="w-6 h-6" />
                    <h2 className="text-xl font-bold">{category.name}</h2>
                    <span className="ml-auto bg-white/20 px-3 py-1 rounded-full text-sm">
                      {categoryDocs.length} document{categoryDocs.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  <div className="divide-y">
                    {categoryDocs.map(doc => (
                      <div key={doc.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <button
                          onClick={() => toggleDoc(doc.id)}
                          className="w-full flex items-start gap-4 text-left"
                        >
                          <div className="mt-1">
                            {expandedDocs.includes(doc.id) ? (
                              <ChevronDown className="w-5 h-5 text-gray-400" />
                            ) : (
                              <ChevronRight className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold text-gray-900">{doc.name}</h3>
                              {doc.required && (
                                <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-medium">
                                  Required
                                </span>
                              )}
                              {doc.forStudent && (
                                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                                  Student
                                </span>
                              )}
                              {doc.forParent && (
                                <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full">
                                  Parent
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm mt-1">{doc.description}</p>
                          </div>
                          
                          {doc.templateAvailable && (
                            <Link
                              href={`/documents/templates#${doc.id}`}
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-1 text-primary text-sm font-medium hover:underline"
                            >
                              <FileCheck className="w-4 h-4" />
                              Template
                            </Link>
                          )}
                        </button>
                        
                        {expandedDocs.includes(doc.id) && (
                          <div className="mt-4 ml-9 space-y-4">
                            <div className="bg-blue-50 rounded-lg p-4">
                              <h4 className="font-semibold text-blue-800 text-sm mb-2">
                                📍 Where to Get It
                              </h4>
                              <p className="text-blue-700 text-sm">{doc.whereToGet}</p>
                            </div>
                            
                            <div className="bg-green-50 rounded-lg p-4">
                              <h4 className="font-semibold text-green-800 text-sm mb-2">
                                💡 Tips
                              </h4>
                              <ul className="space-y-1">
                                {doc.tips.map((tip, index) => (
                                  <li key={index} className="text-green-700 text-sm flex items-start gap-2">
                                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    {tip}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Quick Reference Cards */}
        <section className="py-8 px-4 bg-gray-100">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-primary-darker mb-6">Quick Reference</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Dependent Students */}
              <div className="bg-white rounded-xl p-6 shadow-md border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-gray-900">Dependent Students</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  If you're a dependent student, you'll need documents for both yourself AND your parent(s).
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Your tax return + parent tax return
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Your income + parent income
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Your assets + parent assets
                  </li>
                </ul>
              </div>
              
              {/* Independent Students */}
              <div className="bg-white rounded-xl p-6 shadow-md border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-bold text-gray-900">Independent Students</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  If you're an independent student, you only need your own documents (and spouse if married).
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Your tax return only
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Your income only
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Your assets only
                  </li>
                </ul>
              </div>
              
              {/* IRS Data Retrieval */}
              <div className="bg-white rounded-xl p-6 shadow-md border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <FileSpreadsheet className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-bold text-gray-900">IRS Data Retrieval</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  The IRS Data Retrieval Tool (DRT) can automatically import your tax information.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Faster completion
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Reduces errors
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Less likely to be verified
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 px-4 bg-primary-darker text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Start Your FAFSA?</h2>
            <p className="text-primary-light mb-8 max-w-2xl mx-auto">
              Once you've gathered your documents, use our step-by-step guide to complete your FAFSA application.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/application/getting-started">
                <Button variant="secondary" size="lg">
                  Start Application
                </Button>
              </Link>
              <Link href="/documents/templates">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                  View Templates
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}
