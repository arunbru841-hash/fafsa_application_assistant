'use client'

import Link from 'next/link'
import { useState } from 'react'
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
  TrendingUp,
  TrendingDown,
  FileText,
  Calculator,
  Users,
  Shield,
  Info,
  Award,
  Percent
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'

interface RepaymentPlan {
  id: string
  name: string
  shortName: string
  category: 'standard' | 'idr'
  description: string
  monthlyPayment: string
  repaymentPeriod: string
  eligibleLoans: string[]
  pros: string[]
  cons: string[]
  bestFor: string
  forgiveness?: string
  discretionaryIncome?: string
}

const standardPlans: RepaymentPlan[] = [
  {
    id: 'standard',
    name: 'Standard Repayment Plan',
    shortName: 'Standard',
    category: 'standard',
    description: 'Fixed monthly payments over 10 years. This is the default plan if you don\'t choose another option.',
    monthlyPayment: 'Fixed amount (at least $50)',
    repaymentPeriod: '10 years (up to 30 for consolidation loans)',
    eligibleLoans: ['All Direct Loans', 'All FFEL Program loans'],
    pros: [
      'Pay off loans faster',
      'Pay less interest over time',
      'Predictable fixed payments'
    ],
    cons: [
      'Higher monthly payments',
      'Less flexibility if income changes'
    ],
    bestFor: 'Borrowers who can afford higher payments and want to minimize total interest paid'
  },
  {
    id: 'graduated',
    name: 'Graduated Repayment Plan',
    shortName: 'Graduated',
    category: 'standard',
    description: 'Payments start low and increase every two years. Designed for borrowers expecting income growth.',
    monthlyPayment: 'Starts low, increases every 2 years',
    repaymentPeriod: '10 years (up to 30 for consolidation loans)',
    eligibleLoans: ['All Direct Loans', 'All FFEL Program loans'],
    pros: [
      'Lower initial payments',
      'Payments grow with expected income',
      'Same 10-year timeline as Standard'
    ],
    cons: [
      'Pay more total interest than Standard',
      'Payments can become quite high'
    ],
    bestFor: 'Borrowers with lower starting income who expect significant salary increases'
  },
  {
    id: 'extended',
    name: 'Extended Repayment Plan',
    shortName: 'Extended',
    category: 'standard',
    description: 'Lower monthly payments by extending the repayment period up to 25 years. Requires more than $30,000 in loans.',
    monthlyPayment: 'Fixed or graduated',
    repaymentPeriod: 'Up to 25 years',
    eligibleLoans: ['Direct Loans (if balance > $30,000)', 'FFEL loans (if balance > $30,000)'],
    pros: [
      'Lower monthly payments',
      'Choice of fixed or graduated payments',
      'More manageable for large balances'
    ],
    cons: [
      'Pay significantly more interest',
      'Longer time in debt',
      'Requires $30,000+ in loans'
    ],
    bestFor: 'Borrowers with large loan balances who need lower payments but don\'t qualify for IDR'
  }
]

const idrPlans: RepaymentPlan[] = [
  {
    id: 'save',
    name: 'Saving on a Valuable Education (SAVE) Plan',
    shortName: 'SAVE',
    category: 'idr',
    description: 'The newest IDR plan, replacing REPAYE. Offers significant interest benefits and lower payments for most borrowers.',
    monthlyPayment: '10% of discretionary income',
    repaymentPeriod: '20 years (undergrad only) or 25 years (any grad loans)',
    eligibleLoans: ['Direct Subsidized Loans', 'Direct Unsubsidized Loans', 'Direct PLUS Loans (grad students)', 'Direct Consolidation Loans'],
    discretionaryIncome: 'Income above 225% of federal poverty line',
    forgiveness: 'Remaining balance forgiven after 20-25 years',
    pros: [
      'Government covers unpaid interest on all loans',
      'Larger income protection (225% of poverty line)',
      'Potentially $0 payments if income is low enough',
      'Spousal income excluded if filing separately'
    ],
    cons: [
      'Parent PLUS loans not eligible',
      'Court actions may affect program',
      'Forgiven amount may be taxable'
    ],
    bestFor: 'Most borrowers, especially those with lower incomes or pursuing PSLF'
  },
  {
    id: 'paye',
    name: 'Pay As You Earn (PAYE) Plan',
    shortName: 'PAYE',
    category: 'idr',
    description: 'Caps payments at 10% of discretionary income, with a cap based on Standard Plan payment amount.',
    monthlyPayment: '10% of discretionary income (capped)',
    repaymentPeriod: '20 years',
    eligibleLoans: ['Direct Subsidized Loans', 'Direct Unsubsidized Loans', 'Direct PLUS Loans (grad students)', 'Direct Consolidation Loans (no parent PLUS)'],
    discretionaryIncome: 'Income above 150% of federal poverty line',
    forgiveness: 'Remaining balance forgiven after 20 years',
    pros: [
      'Payment capped at Standard Plan amount',
      'Interest subsidy on subsidized loans for 3 years',
      '20-year forgiveness timeline'
    ],
    cons: [
      'Must be "new borrower" as of Oct 2007',
      'Must demonstrate financial need',
      'Parent PLUS loans not eligible'
    ],
    bestFor: 'New borrowers who qualify and want payment protection'
  },
  {
    id: 'ibr',
    name: 'Income-Based Repayment (IBR) Plan',
    shortName: 'IBR',
    category: 'idr',
    description: 'Payments based on income and family size. Two versions exist based on when you first borrowed.',
    monthlyPayment: '10% (new borrowers) or 15% (others) of discretionary income',
    repaymentPeriod: '20 years (new borrowers) or 25 years (others)',
    eligibleLoans: ['Direct Subsidized/Unsubsidized Loans', 'Direct PLUS Loans (grad students)', 'All FFEL Program loans', 'Direct Consolidation Loans'],
    discretionaryIncome: 'Income above 150% of federal poverty line',
    forgiveness: 'Remaining balance forgiven after 20-25 years',
    pros: [
      'Available for both Direct and FFEL loans',
      'Payment capped at Standard Plan amount',
      'Interest subsidy on subsidized loans for 3 years'
    ],
    cons: [
      'Older borrowers pay 15% for 25 years',
      'Must demonstrate financial need',
      'Parent PLUS loans not eligible'
    ],
    bestFor: 'Borrowers with FFEL loans or those who don\'t qualify for SAVE/PAYE'
  },
  {
    id: 'icr',
    name: 'Income-Contingent Repayment (ICR) Plan',
    shortName: 'ICR',
    category: 'idr',
    description: 'The oldest IDR plan. Higher payments than other IDR plans but available for Parent PLUS loans after consolidation.',
    monthlyPayment: '20% of discretionary income OR fixed payment over 12 years (whichever is less)',
    repaymentPeriod: '25 years',
    eligibleLoans: ['All Direct Loans', 'Direct Consolidation Loans (including consolidated Parent PLUS)'],
    discretionaryIncome: 'Income above 100% of federal poverty line',
    forgiveness: 'Remaining balance forgiven after 25 years',
    pros: [
      'Only IDR plan for Parent PLUS loans (after consolidation)',
      'No income cap requirement',
      'Available to all Direct Loan borrowers'
    ],
    cons: [
      'Highest payments among IDR plans',
      'Smaller income protection allowance',
      'Longest forgiveness timeline (25 years)'
    ],
    bestFor: 'Parent PLUS borrowers (after consolidation) or those who don\'t qualify for other IDR plans'
  }
]

interface ComparisonRow {
  feature: string
  standard: string
  graduated: string
  extended: string
  save: string
  paye: string
  ibr: string
  icr: string
}

const comparisonData: ComparisonRow[] = [
  {
    feature: 'Monthly Payment',
    standard: 'Fixed',
    graduated: 'Increases every 2 years',
    extended: 'Fixed or graduated',
    save: '10% discretionary',
    paye: '10% discretionary (capped)',
    ibr: '10-15% discretionary',
    icr: '20% discretionary'
  },
  {
    feature: 'Repayment Period',
    standard: '10 years',
    graduated: '10 years',
    extended: 'Up to 25 years',
    save: '20-25 years',
    paye: '20 years',
    ibr: '20-25 years',
    icr: '25 years'
  },
  {
    feature: 'Loan Forgiveness',
    standard: 'No',
    graduated: 'No',
    extended: 'No',
    save: 'Yes, after 20-25 years',
    paye: 'Yes, after 20 years',
    ibr: 'Yes, after 20-25 years',
    icr: 'Yes, after 25 years'
  },
  {
    feature: 'Parent PLUS Eligible',
    standard: 'Yes',
    graduated: 'Yes',
    extended: 'Yes',
    save: 'No',
    paye: 'No',
    ibr: 'No',
    icr: 'Yes (if consolidated)'
  },
  {
    feature: 'PSLF Eligible',
    standard: 'Yes (10-year only)',
    graduated: 'No',
    extended: 'No',
    save: 'Yes',
    paye: 'Yes',
    ibr: 'Yes',
    icr: 'Yes'
  }
]

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: 'How do I apply for an income-driven repayment plan?',
    answer: 'You can apply for an IDR plan online at StudentAid.gov/idr. The application takes about 10-15 minutes and you\'ll need to provide income information. If you give consent to access your tax information, the process is faster and your plan can be automatically recertified each year.'
  },
  {
    question: 'How often do I need to recertify my income for IDR plans?',
    answer: 'You must recertify your income and family size annually. If you provided consent for automatic tax data retrieval, your servicer will recertify automatically. Otherwise, you\'ll need to submit updated information each year. Failure to recertify can result in higher payments.'
  },
  {
    question: 'Can I switch between repayment plans?',
    answer: 'Yes, you can change your repayment plan at any time by contacting your loan servicer. However, switching plans may affect your progress toward forgiveness or your total interest paid. Consider the implications carefully before switching.'
  },
  {
    question: 'Which plan is best for Public Service Loan Forgiveness (PSLF)?',
    answer: 'Income-driven repayment plans are generally best for PSLF because they result in the lowest monthly payments, meaning you\'ll have more forgiven after 120 payments. The SAVE plan is often the best choice for most borrowers pursuing PSLF.'
  },
  {
    question: 'Is forgiven loan balance taxable?',
    answer: 'For PSLF, forgiveness is tax-free. For IDR forgiveness, the forgiven amount may be considered taxable income. However, through 2025, IDR forgiveness is also tax-free under the American Rescue Plan Act. Check current tax laws for your expected forgiveness date.'
  },
  {
    question: 'What happens if my income increases significantly?',
    answer: 'With IDR plans, your payment will increase as your income increases. For PAYE and IBR, payments are capped at what you\'d pay under the Standard Plan. For SAVE and ICR, there is no cap, so payments could potentially exceed Standard Plan amounts.'
  }
]

export default function RepaymentPlansPage() {
  const [activeTab, setActiveTab] = useState<'standard' | 'idr'>('idr')
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)

  const currentPlans = activeTab === 'standard' ? standardPlans : idrPlans

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
              <Link href="/manage-loans/repayment" className="text-[#005ea2] hover:underline">
                Repayment
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-600">Repayment Plans</span>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#162e51] via-[#1a3a64] to-[#0d2240] text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-white/10 rounded-xl">
                  <FileText className="w-8 h-8 text-[#00bde3]" />
                </div>
                <span className="text-[#00bde3] font-semibold">Repayment Plans</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Federal Student Loan Repayment Plans
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                Compare Standard, Graduated, Extended, and Income-Driven Repayment (IDR) plans 
                to find the option that best fits your financial situation and goals.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://studentaid.gov/idr"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="bg-[#00bde3] hover:bg-[#00a8cc] text-[#162e51] font-semibold px-6 py-3 flex items-center gap-2">
                    Apply for IDR Plan
                    <ExternalLink className="w-5 h-5" />
                  </Button>
                </a>
                <Link href="/manage-loans/loan-simulator">
                  <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-6 py-3 flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    Compare with Loan Simulator
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* IDR Notice */}
        <section className="bg-blue-50 border-b border-blue-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-start gap-3">
              <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-800">Income-Driven Repayment Updates</h3>
                <p className="text-blue-700">
                  The SAVE Plan is the newest income-driven repayment option, offering significant benefits for most borrowers. 
                  Stay up-to-date on <a href="https://studentaid.gov/announcements-events/idr-court-actions" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900">court actions affecting IDR plans</a>.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Plan Category Tabs */}
        <section className="py-8 bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => setActiveTab('idr')}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  activeTab === 'idr'
                    ? 'bg-[#005ea2] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Income-Driven Plans (IDR)
                </div>
              </button>
              <button
                onClick={() => setActiveTab('standard')}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  activeTab === 'standard'
                    ? 'bg-[#005ea2] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Standard, Graduated & Extended
                </div>
              </button>
            </div>
          </div>
        </section>

        {/* Plan Cards */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {activeTab === 'idr' ? 'Income-Driven Repayment Plans' : 'Standard Repayment Plans'}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {activeTab === 'idr' 
                  ? 'IDR plans base your payment on your income and family size, with potential loan forgiveness after 20-25 years.'
                  : 'Fixed-payment plans with set repayment timelines. You\'ll pay less interest overall but have higher monthly payments.'
                }
              </p>
            </div>

            <div className="grid gap-6">
              {currentPlans.map((plan) => (
                <div
                  key={plan.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                >
                  <div 
                    className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => setSelectedPlan(selectedPlan === plan.id ? null : plan.id)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                          {plan.forgiveness && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                              Forgiveness Available
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 mb-4">{plan.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <div className="text-sm text-gray-500">Monthly Payment</div>
                            <div className="font-semibold text-gray-900">{plan.monthlyPayment}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Repayment Period</div>
                            <div className="font-semibold text-gray-900">{plan.repaymentPeriod}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Best For</div>
                            <div className="font-semibold text-gray-900 text-sm">{plan.bestFor}</div>
                          </div>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        {selectedPlan === plan.id ? (
                          <ChevronUp className="w-6 h-6 text-[#005ea2]" />
                        ) : (
                          <ChevronDown className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {selectedPlan === plan.id && (
                    <div className="border-t border-gray-200 p-6 bg-gray-50">
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Eligible Loans */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-[#005ea2]" />
                            Eligible Loans
                          </h4>
                          <ul className="space-y-2">
                            {plan.eligibleLoans.map((loan, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                {loan}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Additional Info for IDR */}
                        {plan.discretionaryIncome && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                              <Percent className="w-5 h-5 text-[#005ea2]" />
                              Discretionary Income Calculation
                            </h4>
                            <p className="text-sm text-gray-600 mb-3">{plan.discretionaryIncome}</p>
                            {plan.forgiveness && (
                              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                                <div className="font-medium text-green-800 text-sm">Forgiveness</div>
                                <div className="text-green-700 text-sm">{plan.forgiveness}</div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="grid md:grid-cols-2 gap-6 mt-6">
                        {/* Pros */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-green-600" />
                            Advantages
                          </h4>
                          <ul className="space-y-2">
                            {plan.pros.map((pro, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                {pro}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Cons */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <TrendingDown className="w-5 h-5 text-amber-600" />
                            Considerations
                          </h4>
                          <ul className="space-y-2">
                            {plan.cons.map((con, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                                <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                                {con}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Compare All Repayment Plans</h2>
              <p className="text-lg text-gray-600">
                Side-by-side comparison of key features across all federal student loan repayment plans.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[900px]">
                <thead>
                  <tr className="bg-[#162e51] text-white">
                    <th className="text-left p-4 font-semibold">Feature</th>
                    <th className="text-center p-4 font-semibold">Standard</th>
                    <th className="text-center p-4 font-semibold">Graduated</th>
                    <th className="text-center p-4 font-semibold">Extended</th>
                    <th className="text-center p-4 font-semibold bg-[#005ea2]">SAVE</th>
                    <th className="text-center p-4 font-semibold">PAYE</th>
                    <th className="text-center p-4 font-semibold">IBR</th>
                    <th className="text-center p-4 font-semibold">ICR</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-4 border-b border-gray-200 font-medium text-gray-900">{row.feature}</td>
                      <td className="p-4 border-b border-gray-200 text-center text-sm text-gray-600">{row.standard}</td>
                      <td className="p-4 border-b border-gray-200 text-center text-sm text-gray-600">{row.graduated}</td>
                      <td className="p-4 border-b border-gray-200 text-center text-sm text-gray-600">{row.extended}</td>
                      <td className="p-4 border-b border-gray-200 text-center text-sm text-gray-600 bg-blue-50">{row.save}</td>
                      <td className="p-4 border-b border-gray-200 text-center text-sm text-gray-600">{row.paye}</td>
                      <td className="p-4 border-b border-gray-200 text-center text-sm text-gray-600">{row.ibr}</td>
                      <td className="p-4 border-b border-gray-200 text-center text-sm text-gray-600">{row.icr}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* IDR Deep Dive */}
        <section className="py-12 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Understanding Income-Driven Repayment</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                IDR plans calculate your payment based on your discretionary income and family size.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Calculator className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Payment Calculation</h3>
                <p className="text-gray-600 text-sm">
                  Your payment is a percentage (10-20%) of your <strong>discretionary income</strong>, 
                  which is the difference between your adjusted gross income and a percentage of the 
                  federal poverty guideline for your family size.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Annual Recertification</h3>
                <p className="text-gray-600 text-sm">
                  You must recertify your income and family size each year. If you provide consent 
                  for IRS data retrieval, this can happen automatically. Failure to recertify can 
                  result in significantly higher payments.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Loan Forgiveness</h3>
                <p className="text-gray-600 text-sm">
                  After making payments for 20-25 years (depending on the plan), any remaining 
                  balance is forgiven. For those pursuing PSLF, forgiveness occurs after just 
                  120 qualifying payments (10 years).
                </p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <a
                href="https://studentaid.gov/idr"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-[#005ea2] hover:bg-[#004d8a] text-white font-semibold px-6 py-3 flex items-center gap-2 mx-auto">
                  Apply for an IDR Plan
                  <ExternalLink className="w-5 h-5" />
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-12 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-gray-600">
                Get answers to common questions about repayment plans.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-100 transition-colors"
                  >
                    <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                    {openFAQ === index ? (
                      <ChevronUp className="w-5 h-5 text-[#005ea2] flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    )}
                  </button>
                  {openFAQ === index && (
                    <div className="px-6 pb-6 pt-0">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Navigation */}
        <section className="py-8 bg-gray-50 border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <Link href="/manage-loans/repayment" className="flex items-center gap-2 text-[#005ea2] hover:underline">
                <ArrowLeft className="w-5 h-5" />
                Back to Repayment Overview
              </Link>
              <Link href="/manage-loans/loan-simulator" className="flex items-center gap-2 text-[#005ea2] hover:underline">
                Loan Simulator
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
