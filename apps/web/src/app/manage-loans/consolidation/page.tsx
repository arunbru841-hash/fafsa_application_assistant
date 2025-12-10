'use client'

import Link from 'next/link'
import { useState } from 'react'
import { 
  ArrowRight, 
  ArrowLeft,
  RefreshCw,
  Clock, 
  AlertCircle,
  CheckCircle,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FileText,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Shield,
  Info,
  Calculator,
  Scale
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'

interface ConsolidationBenefit {
  title: string
  description: string
  icon: React.ReactNode
}

const benefits: ConsolidationBenefit[] = [
  {
    title: 'Single Monthly Payment',
    description: 'Combine multiple federal student loans into one loan with one monthly payment to one servicer.',
    icon: <DollarSign className="w-6 h-6" />
  },
  {
    title: 'Access to IDR Plans',
    description: 'Some loans become eligible for income-driven repayment plans only after consolidation.',
    icon: <FileText className="w-6 h-6" />
  },
  {
    title: 'PSLF Eligibility',
    description: 'FFEL and Perkins loans become eligible for PSLF after consolidating into Direct Loans.',
    icon: <Shield className="w-6 h-6" />
  },
  {
    title: 'Fixed Interest Rate',
    description: 'Your new interest rate is a weighted average of your current rates, rounded up to the nearest 1/8%.',
    icon: <TrendingUp className="w-6 h-6" />
  },
  {
    title: 'Flexible Repayment',
    description: 'Choose from multiple repayment plans including Standard, Graduated, Extended, and IDR options.',
    icon: <RefreshCw className="w-6 h-6" />
  },
  {
    title: 'Lower Monthly Payment Option',
    description: 'Extended repayment terms (up to 30 years) can lower your monthly payment amount.',
    icon: <TrendingDown className="w-6 h-6" />
  }
]

interface ConsolidationDrawback {
  title: string
  description: string
}

const drawbacks: ConsolidationDrawback[] = [
  {
    title: 'Loss of Interest Benefits',
    description: 'You may lose any remaining interest subsidy on subsidized loans during deferment periods.'
  },
  {
    title: 'Loss of Loan Cancellation Benefits',
    description: 'Perkins Loan cancellation benefits are lost when you consolidate Perkins loans.'
  },
  {
    title: 'Potentially More Interest',
    description: 'Extending your repayment term means you\'ll pay more interest over the life of the loan.'
  },
  {
    title: 'Forgiveness Progress Reset',
    description: 'If you consolidate loans that already have qualifying PSLF or IDR payments, you may lose that progress (with some exceptions).'
  },
  {
    title: 'No Interest Rate Reduction',
    description: 'Consolidation does not lower your interest rate; it creates a weighted average of existing rates.'
  },
  {
    title: 'Can\'t Consolidate Private Loans',
    description: 'Private student loans cannot be included in a federal Direct Consolidation Loan.'
  }
]

interface EligibleLoan {
  loanType: string
  eligible: boolean
  notes: string
}

const eligibleLoans: EligibleLoan[] = [
  { loanType: 'Direct Subsidized Loans', eligible: true, notes: 'Can be consolidated' },
  { loanType: 'Direct Unsubsidized Loans', eligible: true, notes: 'Can be consolidated' },
  { loanType: 'Direct PLUS Loans', eligible: true, notes: 'Can be consolidated' },
  { loanType: 'Direct Consolidation Loans', eligible: true, notes: 'Can be reconsolidated with other loans' },
  { loanType: 'Subsidized Federal Stafford Loans (FFEL)', eligible: true, notes: 'Can be consolidated into Direct Loans' },
  { loanType: 'Unsubsidized Federal Stafford Loans (FFEL)', eligible: true, notes: 'Can be consolidated into Direct Loans' },
  { loanType: 'FFEL PLUS Loans', eligible: true, notes: 'Can be consolidated into Direct Loans' },
  { loanType: 'FFEL Consolidation Loans', eligible: true, notes: 'Can be consolidated into Direct Loans' },
  { loanType: 'Federal Perkins Loans', eligible: true, notes: 'Can be consolidated (may lose cancellation benefits)' },
  { loanType: 'Federal Nursing Loans', eligible: true, notes: 'Can be consolidated' },
  { loanType: 'Health Professions Student Loans', eligible: true, notes: 'Can be consolidated' },
  { loanType: 'Private Student Loans', eligible: false, notes: 'Not eligible for federal consolidation' }
]

interface ConsolidationStep {
  step: number
  title: string
  description: string
}

const consolidationSteps: ConsolidationStep[] = [
  {
    step: 1,
    title: 'Review Your Loans',
    description: 'Log in to StudentAid.gov to see all your federal student loans and determine which ones you want to consolidate.'
  },
  {
    step: 2,
    title: 'Weigh the Pros and Cons',
    description: 'Consider whether consolidation makes sense for your situation. Think about forgiveness progress, interest costs, and benefits you might lose.'
  },
  {
    step: 3,
    title: 'Start the Application',
    description: 'Begin the Direct Consolidation Loan application at StudentAid.gov. The process takes about 30 minutes.'
  },
  {
    step: 4,
    title: 'Select Your Loans',
    description: 'Choose which eligible federal loans to include in your consolidation. You can consolidate some or all of your loans.'
  },
  {
    step: 5,
    title: 'Choose a Repayment Plan',
    description: 'Select your repayment plan. If you\'re pursuing PSLF, choose an income-driven repayment plan.'
  },
  {
    step: 6,
    title: 'Wait for Processing',
    description: 'Processing typically takes 30-45 days. Continue making payments on your old loans until notified that consolidation is complete.'
  }
]

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: 'How is my consolidation loan interest rate calculated?',
    answer: 'Your new interest rate is the weighted average of the interest rates on the loans being consolidated, rounded up to the nearest one-eighth of one percent (0.125%). This means your rate won\'t be lower than before, but it also won\'t be higher.'
  },
  {
    question: 'Can I consolidate just some of my loans?',
    answer: 'Yes, you can choose which eligible federal loans to consolidate. You don\'t have to consolidate all your loans. This flexibility allows you to keep certain loans separate if they have benefits you want to preserve.'
  },
  {
    question: 'Will consolidation affect my progress toward PSLF?',
    answer: 'It depends. If you consolidate loans that already have qualifying PSLF payments, you may lose that progress unless you\'re consolidating to get FFEL or Perkins loans into the Direct Loan program. However, the one-time payment count adjustment may help count past payments. Contact MOHELA (the PSLF servicer) before consolidating.'
  },
  {
    question: 'How long does consolidation take?',
    answer: 'The consolidation process typically takes 30-45 days from the date you submit your application. During this time, continue making payments on your existing loans to avoid delinquency.'
  },
  {
    question: 'Can I consolidate loans that are in default?',
    answer: 'Yes, you may be able to consolidate defaulted loans under certain conditions. You must either make three consecutive, voluntary, on-time payments on the defaulted loan before consolidating, or agree to repay under an income-driven repayment plan.'
  },
  {
    question: 'Is consolidation the same as refinancing?',
    answer: 'No. Federal loan consolidation creates a new Direct Consolidation Loan with a weighted average interest rate. Refinancing (usually through private lenders) may offer a lower rate but converts your federal loans to private loans, causing you to lose federal benefits like IDR plans and PSLF.'
  },
  {
    question: 'Can I undo a consolidation?',
    answer: 'No, once you consolidate your loans, you cannot undo the consolidation. Make sure you carefully consider the pros and cons before proceeding.'
  }
]

export default function ConsolidationPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)
  const [showAllLoans, setShowAllLoans] = useState(false)

  const displayedLoans = showAllLoans ? eligibleLoans : eligibleLoans.slice(0, 6)

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
              <span className="text-gray-600">Consolidation</span>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#162e51] via-[#1a3a64] to-[#0d2240] text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-white/10 rounded-xl">
                  <RefreshCw className="w-8 h-8 text-[#00bde3]" />
                </div>
                <span className="text-[#00bde3] font-semibold">Loan Consolidation</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Federal Student Loan Consolidation
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                Combine multiple federal student loans into a single Direct Consolidation Loan 
                with one monthly payment and one servicer. Learn if consolidation is right for you.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://studentaid.gov/app/launchConsolidation.action"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="bg-[#00bde3] hover:bg-[#00a8cc] text-[#162e51] font-semibold px-6 py-3 flex items-center gap-2">
                    Apply for Consolidation
                    <ExternalLink className="w-5 h-5" />
                  </Button>
                </a>
                <Link href="/manage-loans/loan-simulator">
                  <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-6 py-3 flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    Loan Simulator
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Important Notice */}
        <section className="bg-amber-50 border-b border-amber-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-800">Important: Consolidation Cannot Be Undone</h3>
                <p className="text-amber-700">
                  Once you consolidate your loans, you cannot reverse the process. Carefully review the benefits 
                  and drawbacks before applying, especially if you have progress toward loan forgiveness.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What is Consolidation */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">What is a Direct Consolidation Loan?</h2>
                <div className="prose prose-lg">
                  <p className="text-gray-600 mb-4">
                    A <strong>Direct Consolidation Loan</strong> allows you to combine multiple federal education 
                    loans into one loan with a single loan servicer. The result is one monthly payment instead 
                    of multiple payments to different servicers.
                  </p>
                  <p className="text-gray-600 mb-4">
                    Your new interest rate is a <strong>weighted average</strong> of your current rates, rounded 
                    up to the nearest 1/8 of a percent. While consolidation doesn't reduce your interest rate, 
                    it can simplify repayment and make you eligible for additional repayment plans.
                  </p>
                  <p className="text-gray-600">
                    Consolidation is free and you should never pay a company to consolidate your federal loans.
                  </p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-200">
                <h3 className="font-bold text-gray-900 text-xl mb-6">Consolidation at a Glance</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900">Free to Apply</div>
                      <div className="text-sm text-gray-600">No fees for federal consolidation</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900">Processing Time</div>
                      <div className="text-sm text-gray-600">Typically 30-45 days</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900">Repayment Terms</div>
                      <div className="text-sm text-gray-600">Up to 30 years depending on balance</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900">Fixed Interest Rate</div>
                      <div className="text-sm text-gray-600">Weighted average of current rates</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits & Drawbacks */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Benefits & Drawbacks</h2>
              <p className="text-lg text-gray-600">
                Weigh the pros and cons to decide if consolidation is right for you.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Benefits */}
              <div>
                <h3 className="text-xl font-bold text-green-800 mb-6 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6" />
                  Benefits
                </h3>
                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-green-100 rounded-lg text-green-600 flex-shrink-0">
                          {benefit.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{benefit.title}</h4>
                          <p className="text-gray-600 text-sm">{benefit.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Drawbacks */}
              <div>
                <h3 className="text-xl font-bold text-red-800 mb-6 flex items-center gap-2">
                  <TrendingDown className="w-6 h-6" />
                  Drawbacks
                </h3>
                <div className="space-y-4">
                  {drawbacks.map((drawback, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-red-100 rounded-lg text-red-600 flex-shrink-0">
                          <AlertCircle className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{drawback.title}</h4>
                          <p className="text-gray-600 text-sm">{drawback.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Eligible Loans */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Which Loans Can Be Consolidated?</h2>
              <p className="text-lg text-gray-600">
                Most federal student loans are eligible for consolidation into a Direct Consolidation Loan.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white rounded-xl overflow-hidden shadow-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-left p-4 font-semibold text-gray-900 border-b-2 border-gray-200">Loan Type</th>
                    <th className="text-center p-4 font-semibold text-gray-900 border-b-2 border-gray-200">Eligible</th>
                    <th className="text-left p-4 font-semibold text-gray-900 border-b-2 border-gray-200">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedLoans.map((loan, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-4 border-b border-gray-200 font-medium text-gray-900">{loan.loanType}</td>
                      <td className="p-4 border-b border-gray-200 text-center">
                        {loan.eligible ? (
                          <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-red-500 mx-auto" />
                        )}
                      </td>
                      <td className="p-4 border-b border-gray-200 text-gray-600">{loan.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {eligibleLoans.length > 6 && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => setShowAllLoans(!showAllLoans)}
                  className="flex items-center gap-2 text-[#005ea2] hover:underline font-medium mx-auto"
                >
                  {showAllLoans ? (
                    <>Show Less <ChevronUp className="w-4 h-4" /></>
                  ) : (
                    <>Show All Loan Types ({eligibleLoans.length}) <ChevronDown className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* How to Consolidate */}
        <section className="py-12 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">How to Consolidate Your Loans</h2>
              <p className="text-lg text-gray-600">
                Follow these steps to complete the consolidation process.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {consolidationSteps.map((step) => (
                <div key={step.step} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="w-10 h-10 bg-[#005ea2] rounded-full flex items-center justify-center text-white font-bold mb-4">
                    {step.step}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <a
                href="https://studentaid.gov/app/launchConsolidation.action"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-[#005ea2] hover:bg-[#004d8a] text-white font-semibold px-6 py-3 flex items-center gap-2 mx-auto">
                  Start Consolidation Application
                  <ExternalLink className="w-5 h-5" />
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* Consolidation vs Refinancing */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Consolidation vs. Refinancing</h2>
              <p className="text-lg text-gray-600">
                These terms are often confused, but they're very different.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
                  <RefreshCw className="w-6 h-6" />
                  Federal Consolidation
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-blue-800">
                    <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span>Combines federal loans into a new federal loan</span>
                  </li>
                  <li className="flex items-start gap-2 text-blue-800">
                    <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span>Keeps all federal loan benefits (IDR, PSLF, deferment, etc.)</span>
                  </li>
                  <li className="flex items-start gap-2 text-blue-800">
                    <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span>Interest rate is weighted average (no reduction)</span>
                  </li>
                  <li className="flex items-start gap-2 text-blue-800">
                    <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span>Free to apply through StudentAid.gov</span>
                  </li>
                  <li className="flex items-start gap-2 text-blue-800">
                    <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span>No credit check required</span>
                  </li>
                </ul>
              </div>

              <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
                <h3 className="text-xl font-bold text-amber-900 mb-4 flex items-center gap-2">
                  <Scale className="w-6 h-6" />
                  Private Refinancing
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-amber-800">
                    <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span>Replaces federal loans with a private loan</span>
                  </li>
                  <li className="flex items-start gap-2 text-amber-800">
                    <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span>Lose ALL federal benefits permanently</span>
                  </li>
                  <li className="flex items-start gap-2 text-amber-800">
                    <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span>May offer lower interest rate (based on credit)</span>
                  </li>
                  <li className="flex items-start gap-2 text-amber-800">
                    <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span>Requires good credit and/or cosigner</span>
                  </li>
                  <li className="flex items-start gap-2 text-amber-800">
                    <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span>No access to PSLF, IDR, or federal deferment</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 p-6 bg-red-50 rounded-xl border border-red-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-red-900 mb-2">Warning About Refinancing</h4>
                  <p className="text-red-800">
                    If you refinance federal student loans with a private lender, you permanently lose access to 
                    all federal benefits including income-driven repayment, Public Service Loan Forgiveness, 
                    deferment, and forbearance options. Only refinance if you're certain you won't need these protections.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-gray-600">
                Get answers to common questions about loan consolidation.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
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

        {/* CTA Section */}
        <section className="py-12 bg-gradient-to-r from-[#005ea2] to-[#0076d6]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Consolidate?</h2>
            <p className="text-blue-100 text-lg mb-8">
              The federal consolidation application is free and takes about 30 minutes to complete.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://studentaid.gov/app/launchConsolidation.action"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-white text-[#005ea2] hover:bg-blue-50 font-semibold px-6 py-3 flex items-center gap-2">
                  Apply for Consolidation
                  <ExternalLink className="w-5 h-5" />
                </Button>
              </a>
              <Link href="/manage-loans/servicers">
                <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-6 py-3 flex items-center gap-2">
                  Contact Your Servicer First
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Navigation */}
        <section className="py-8 bg-gray-50 border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <Link href="/manage-loans/forgiveness" className="flex items-center gap-2 text-[#005ea2] hover:underline">
                <ArrowLeft className="w-5 h-5" />
                Back to Forgiveness
              </Link>
              <Link href="/manage-loans/servicers" className="flex items-center gap-2 text-[#005ea2] hover:underline">
                Find Your Servicer
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
