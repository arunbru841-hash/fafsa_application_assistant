'use client'

import Link from 'next/link'
import { useState } from 'react'
import { 
  ArrowRight, 
  ArrowLeft,
  Clock,
  Calendar,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FileText,
  DollarSign,
  Info,
  AlertTriangle,
  TrendingUp,
  Calculator,
  Shield,
  Target,
  Scale
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'

interface IDRPlan {
  id: string
  name: string
  shortName: string
  paymentFormula: string
  forgivenessTimeline: string
  whoQualifies: string[]
  benefits: string[]
  considerations: string[]
  color: string
}

const idrPlans: IDRPlan[] = [
  {
    id: 'save',
    name: 'Saving on a Valuable Education (SAVE)',
    shortName: 'SAVE',
    paymentFormula: '5-10% of discretionary income',
    forgivenessTimeline: '20-25 years (10 years for balances ≤$12,000)',
    whoQualifies: [
      'Borrowers with Direct Loans',
      'No income or debt requirements',
      'Undergraduate and graduate borrowers'
    ],
    benefits: [
      'Lowest payments of any IDR plan',
      'Undergraduate-only: 5% of income',
      'Unpaid interest doesn\'t capitalize',
      'Shorter forgiveness for small balances'
    ],
    considerations: [
      'Newest plan - some provisions still being implemented',
      'Replaces REPAYE plan',
      'Higher-income protection (225% of poverty line)'
    ],
    color: 'bg-emerald-500'
  },
  {
    id: 'paye',
    name: 'Pay As You Earn (PAYE)',
    shortName: 'PAYE',
    paymentFormula: '10% of discretionary income',
    forgivenessTimeline: '20 years',
    whoQualifies: [
      'New borrowers as of Oct 1, 2007',
      'Received disbursement after Oct 1, 2011',
      'Must demonstrate partial financial hardship'
    ],
    benefits: [
      'Payment cap at 10-year standard amount',
      '20-year forgiveness (not 25)',
      'Good for moderate income borrowers'
    ],
    considerations: [
      'Strict eligibility requirements',
      'Must recertify income annually',
      'SAVE may offer better terms for many borrowers'
    ],
    color: 'bg-blue-500'
  },
  {
    id: 'ibr',
    name: 'Income-Based Repayment (IBR)',
    shortName: 'IBR',
    paymentFormula: '10-15% of discretionary income',
    forgivenessTimeline: '20-25 years',
    whoQualifies: [
      'Most Direct and FFEL loan borrowers',
      'Must demonstrate partial financial hardship',
      'New borrowers (after 7/1/14): 10%, 20 years'
    ],
    benefits: [
      'Available for FFEL loans without consolidation',
      'Payment cap at 10-year standard amount',
      'Widely available'
    ],
    considerations: [
      'Older borrowers: 15% of income, 25-year forgiveness',
      'Less generous than SAVE for most borrowers',
      'Must recertify annually'
    ],
    color: 'bg-purple-500'
  },
  {
    id: 'icr',
    name: 'Income-Contingent Repayment (ICR)',
    shortName: 'ICR',
    paymentFormula: '20% of discretionary income',
    forgivenessTimeline: '25 years',
    whoQualifies: [
      'Any Direct Loan borrower',
      'Only IDR plan for Parent PLUS (after consolidation)',
      'No income requirement'
    ],
    benefits: [
      'Only IDR option for Parent PLUS loans',
      'No partial financial hardship requirement',
      'Available regardless of income'
    ],
    considerations: [
      'Highest payment percentage (20%)',
      'Longest forgiveness timeline (25 years)',
      'Generally only use for Parent PLUS'
    ],
    color: 'bg-orange-500'
  }
]

interface FAQ {
  question: string
  answer: string
}

const faqs: FAQ[] = [
  {
    question: 'Is IDR forgiveness taxable?',
    answer: 'IDR forgiveness is currently tax-free through 2025 under the American Rescue Plan Act. After 2025, forgiven amounts may be treated as taxable income unless Congress extends this provision. Plan ahead and save for potential taxes.'
  },
  {
    question: 'Do I have to stay on the same IDR plan for the entire forgiveness period?',
    answer: 'No, you can switch between IDR plans. Your qualifying payments carry over as long as you remain on an IDR plan. However, switching could affect your monthly payment amount and potentially your forgiveness timeline.'
  },
  {
    question: 'What happens if my income increases significantly?',
    answer: 'Your payments will increase when you recertify income, but they\'re capped at the 10-year standard repayment amount under PAYE and IBR. Under SAVE, there\'s no cap, but the formula still provides lower payments than standard repayment.'
  },
  {
    question: 'Can I make extra payments to reduce my balance?',
    answer: 'Yes, but consider whether it\'s strategic. If you\'ll receive significant forgiveness, extra payments just reduce that forgiveness. If your balance will be paid off before forgiveness, extra payments save on interest.'
  },
  {
    question: 'What if I miss the annual income recertification deadline?',
    answer: 'Missing recertification can cause your payments to jump to the standard repayment amount and may cause any unpaid interest to capitalize. Set reminders and recertify on time every year.'
  },
  {
    question: 'Does time in deferment or forbearance count toward forgiveness?',
    answer: 'Generally no. However, certain qualifying periods count, such as economic hardship deferment and COVID-19 forbearance. Time in school deferment typically doesn\'t count toward IDR forgiveness.'
  },
  {
    question: 'Can I combine IDR forgiveness with PSLF?',
    answer: 'Absolutely! If you work for a qualifying employer, you can pursue PSLF (forgiveness after 10 years/120 payments) while on an IDR plan. If your PSLF application is denied, your IDR forgiveness timeline continues.'
  },
  {
    question: 'What\'s the difference between SAVE and the old REPAYE plan?',
    answer: 'SAVE replaced REPAYE with better terms: higher income protection (225% vs 150% of poverty line), undergraduate payments at 5% instead of 10%, and accelerated forgiveness for small balances. REPAYE borrowers were automatically moved to SAVE.'
  }
]

const forgivenessTimeline = [
  {
    years: '10',
    description: 'SAVE Plan with balance ≤$12,000',
    note: 'Shortest timeline for small loan balances'
  },
  {
    years: '20',
    description: 'SAVE (undergrad only), PAYE, IBR (new borrowers)',
    note: 'Standard timeline for undergraduate loans'
  },
  {
    years: '25',
    description: 'SAVE (with grad loans), IBR (older borrowers), ICR',
    note: 'Timeline for graduate/professional loans'
  }
]

export default function IDRForgivenessPage() {
  const [expandedPlan, setExpandedPlan] = useState<string | null>('save')
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <nav className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-[#005ea2] hover:underline">Home</Link>
              <span className="text-gray-400">/</span>
              <Link href="/manage-loans" className="text-[#005ea2] hover:underline">Manage Loans</Link>
              <span className="text-gray-400">/</span>
              <Link href="/manage-loans/forgiveness" className="text-[#005ea2] hover:underline">Forgiveness</Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-600">IDR Forgiveness</span>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#162e51] to-[#1a4480] text-white py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                  <Clock className="w-7 h-7" />
                </div>
                <span className="text-[#73b3e7] font-semibold">Federal Forgiveness Program</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Income-Driven Repayment Forgiveness
              </h1>
              <p className="text-xl text-blue-100 mb-6">
                Get your remaining student loan balance forgiven after 20-25 years of 
                payments under an income-driven repayment plan—regardless of your employer.
              </p>
              <div className="flex flex-wrap gap-4">
                <a 
                  href="https://studentaid.gov/manage-loans/repayment/plans/income-driven"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#00bde3] hover:bg-[#00a5c9] text-white font-semibold px-6 py-3 rounded-md transition-colors"
                >
                  <ExternalLink className="w-5 h-5" />
                  Official IDR Information
                </a>
                <Link 
                  href="/manage-loans/loan-simulator"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-md transition-colors"
                >
                  <Calculator className="w-5 h-5" />
                  Estimate Your Payments
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Key Stats */}
        <section className="bg-white border-b py-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#005ea2]">20-25</div>
                <div className="text-sm text-gray-600">Years of Payments</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#005ea2]">100%</div>
                <div className="text-sm text-gray-600">Remaining Balance</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#005ea2]">Any</div>
                <div className="text-sm text-gray-600">Employer Type</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#005ea2]">4</div>
                <div className="text-sm text-gray-600">IDR Plan Options</div>
              </div>
            </div>
          </div>
        </section>

        {/* Forgiveness Timeline */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">When Do You Get Forgiveness?</h2>
            <p className="text-gray-600 mb-8">
              The timeline depends on your plan and loan types.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              {forgivenessTimeline.map((item) => (
                <div 
                  key={item.years}
                  className="bg-white rounded-xl border-2 border-gray-200 p-6 text-center"
                >
                  <div className="text-5xl font-bold text-[#005ea2] mb-2">{item.years}</div>
                  <div className="text-lg font-semibold text-gray-900 mb-2">Years</div>
                  <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                  <p className="text-xs text-gray-500 italic">{item.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* IDR Plans Comparison */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">IDR Plans with Forgiveness</h2>
            <p className="text-gray-600 mb-8">
              All four income-driven repayment plans offer forgiveness. Click each to learn more.
            </p>

            <div className="space-y-4">
              {idrPlans.map((plan) => (
                <div 
                  key={plan.id}
                  className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedPlan(expandedPlan === plan.id ? null : plan.id)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-100 transition-colors"
                    aria-expanded={expandedPlan === plan.id}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 ${plan.color} text-white rounded-lg flex items-center justify-center font-bold text-lg`}>
                        {plan.shortName.charAt(0)}
                      </div>
                      <div className="text-left">
                        <h3 className="font-bold text-gray-900">{plan.name}</h3>
                        <p className="text-sm text-gray-600">
                          {plan.paymentFormula} • Forgiveness after {plan.forgivenessTimeline}
                        </p>
                      </div>
                    </div>
                    {expandedPlan === plan.id ? (
                      <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                    )}
                  </button>
                  
                  {expandedPlan === plan.id && (
                    <div className="px-6 pb-6 border-t border-gray-200 bg-white">
                      <div className="grid md:grid-cols-3 gap-6 mt-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            Who Qualifies
                          </h4>
                          <ul className="space-y-2">
                            {plan.whoQualifies.map((item, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                <span className="text-green-600 mt-1">•</span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-[#005ea2]" />
                            Benefits
                          </h4>
                          <ul className="space-y-2">
                            {plan.benefits.map((item, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                <span className="text-[#005ea2] mt-1">•</span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Info className="w-5 h-5 text-yellow-600" />
                            Considerations
                          </h4>
                          <ul className="space-y-2">
                            {plan.considerations.map((item, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                <span className="text-yellow-600 mt-1">•</span>
                                {item}
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

        {/* How IDR Forgiveness Works */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">How IDR Forgiveness Works</h2>
            <p className="text-gray-600 mb-8">
              Understand the path to having your remaining balance forgiven.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-[#005ea2] text-white rounded-full flex items-center justify-center font-bold shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Enroll in an IDR Plan</h3>
                    <p className="text-gray-600 text-sm">
                      Apply through StudentAid.gov or your loan servicer. You'll need to provide 
                      income information (most can use IRS Data Retrieval Tool).
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-[#005ea2] text-white rounded-full flex items-center justify-center font-bold shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Make Qualifying Payments</h3>
                    <p className="text-gray-600 text-sm">
                      Pay at least your required monthly amount each month. Even $0 payments count 
                      if that's your calculated amount based on income.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-[#005ea2] text-white rounded-full flex items-center justify-center font-bold shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Recertify Income Annually</h3>
                    <p className="text-gray-600 text-sm">
                      Every year, you must update your income and family size. Your servicer will 
                      notify you when it's time to recertify.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-[#005ea2] text-white rounded-full flex items-center justify-center font-bold shrink-0">
                    4
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Track Your Progress</h3>
                    <p className="text-gray-600 text-sm">
                      Log into StudentAid.gov to see your qualifying payment count. The IDR Account 
                      Adjustment may have added credit for past periods.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold shrink-0">
                    5
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Receive Forgiveness</h3>
                    <p className="text-gray-600 text-sm">
                      After reaching your plan's required number of payments (240-300), any 
                      remaining balance is forgiven. You should receive notification from your servicer.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-[#005ea2]" />
                    What Counts as a Qualifying Payment
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">Made while enrolled in an IDR plan</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">For the full scheduled amount (including $0 payments)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">Made within 15 days of due date</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">Made after October 2007 (for most plans)</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-6 h-6 text-yellow-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">Tax Implications</h4>
                      <p className="text-sm text-gray-700">
                        IDR forgiveness is currently tax-free through 2025. After that, forgiven 
                        amounts may be taxable as income. This could mean a significant tax bill—
                        start saving now for potential taxes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* IDR Account Adjustment */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="max-w-3xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                IDR Account Adjustment (One-Time)
              </h2>
              <p className="text-gray-600 mb-6">
                The Department of Education completed a one-time account adjustment that may 
                have credited you with additional months toward IDR forgiveness.
              </p>
              
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 mb-6">
                <h3 className="font-bold text-gray-900 mb-3">What Got Counted:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    Any months in repayment status (regardless of plan)
                  </li>
                  <li className="flex items-start gap-2 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    Certain deferments (economic hardship, unemployment)
                  </li>
                  <li className="flex items-start gap-2 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    Forbearance periods of 12+ consecutive months
                  </li>
                  <li className="flex items-start gap-2 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    Time before consolidation (for consolidated loans)
                  </li>
                </ul>
              </div>

              <p className="text-gray-600 text-sm">
                Check your StudentAid.gov account to see your updated payment count. 
                Some borrowers received automatic forgiveness if they reached the required number.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h2>
            <p className="text-gray-600 mb-8">
              Common questions about income-driven repayment forgiveness.
            </p>

            <div className="space-y-4 max-w-3xl">
              {faqs.map((faq, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                    aria-expanded={expandedFaq === index}
                    aria-controls={`faq-${index}`}
                  >
                    <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                    {expandedFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                    )}
                  </button>
                  {expandedFaq === index && (
                    <div 
                      id={`faq-${index}`}
                      className="px-6 pb-4 text-gray-600"
                    >
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 bg-[#005ea2]">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Estimate Your Path to Forgiveness
            </h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Use our loan simulator to compare IDR plans and see how much you might 
              have forgiven under different scenarios.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="/manage-loans/loan-simulator"
                className="inline-flex items-center gap-2 bg-white text-[#005ea2] hover:bg-gray-100 font-semibold px-6 py-3 rounded-md transition-colors"
              >
                <Calculator className="w-5 h-5" />
                Loan Simulator
              </Link>
              <a 
                href="https://studentaid.gov/manage-loans/repayment/plans/income-driven"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#00bde3] hover:bg-[#00a5c9] text-white font-semibold px-6 py-3 rounded-md transition-colors"
              >
                <ExternalLink className="w-5 h-5" />
                Apply for IDR Plan
              </a>
            </div>
          </div>
        </section>

        {/* Navigation Footer */}
        <section className="py-8 bg-white border-t">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <Link 
                href="/manage-loans/forgiveness/teacher" 
                className="flex items-center gap-2 text-[#005ea2] hover:underline font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Teacher Loan Forgiveness
              </Link>
              <Link 
                href="/manage-loans/forgiveness" 
                className="flex items-center gap-2 text-[#005ea2] hover:underline font-medium"
              >
                All Forgiveness Programs
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
