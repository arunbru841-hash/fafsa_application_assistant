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
  GraduationCap,
  Shield,
  CreditCard,
  FileText,
  Phone,
  Pause,
  Play,
  TrendingUp,
  Building2,
  Wallet,
  Info
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'

interface GracePeriodInfo {
  loanType: string
  gracePeriod: string
  notes: string
}

const gracePeriods: GracePeriodInfo[] = [
  {
    loanType: 'Direct Subsidized Loans',
    gracePeriod: '6 months',
    notes: 'Interest does not accrue during grace period'
  },
  {
    loanType: 'Direct Unsubsidized Loans',
    gracePeriod: '6 months',
    notes: 'Interest accrues during grace period; consider paying interest to avoid capitalization'
  },
  {
    loanType: 'Direct PLUS Loans (Graduate/Professional)',
    gracePeriod: '6 months',
    notes: 'Automatic 6-month post-enrollment deferment; interest accrues'
  },
  {
    loanType: 'Direct PLUS Loans (Parent)',
    gracePeriod: 'None (can request deferment)',
    notes: 'Enters repayment when fully disbursed; parent can request deferment while student is enrolled'
  },
  {
    loanType: 'Federal Perkins Loans',
    gracePeriod: '9 months',
    notes: 'Interest does not accrue during grace period'
  },
  {
    loanType: 'FFEL Program Loans',
    gracePeriod: '6 months',
    notes: 'Check with your lender for specific terms'
  }
]

interface PaymentOption {
  title: string
  description: string
  icon: React.ReactNode
}

const paymentOptions: PaymentOption[] = [
  {
    title: 'Automatic Debit (Auto-Pay)',
    description: 'Set up automatic payments from your bank account. Many servicers offer a 0.25% interest rate reduction for enrolling in auto-pay.',
    icon: <CreditCard className="w-6 h-6" />
  },
  {
    title: 'One-Time Online Payment',
    description: 'Log in to your loan servicer\'s website to make a one-time payment using your bank account or debit card.',
    icon: <DollarSign className="w-6 h-6" />
  },
  {
    title: 'Payment by Phone',
    description: 'Call your loan servicer to make a payment over the phone. Some servicers may charge a fee for this service.',
    icon: <Phone className="w-6 h-6" />
  },
  {
    title: 'Payment by Mail',
    description: 'Send a check or money order to your loan servicer. Include your account number and allow extra time for processing.',
    icon: <FileText className="w-6 h-6" />
  }
]

interface DefermentType {
  name: string
  description: string
  subsidizedInterest: string
  maxDuration: string
}

const defermentTypes: DefermentType[] = [
  {
    name: 'In-School Deferment',
    description: 'Enrolled at least half-time at an eligible school',
    subsidizedInterest: 'Government pays',
    maxDuration: 'While enrolled + 6 months after'
  },
  {
    name: 'Unemployment Deferment',
    description: 'Receiving unemployment benefits or unable to find full-time employment',
    subsidizedInterest: 'Government pays',
    maxDuration: 'Up to 3 years'
  },
  {
    name: 'Economic Hardship Deferment',
    description: 'Meeting specific economic hardship criteria',
    subsidizedInterest: 'Government pays',
    maxDuration: 'Up to 3 years'
  },
  {
    name: 'Military Service Deferment',
    description: 'On active duty military service during a war, military operation, or national emergency',
    subsidizedInterest: 'Government pays',
    maxDuration: 'During qualifying service + 180 days'
  },
  {
    name: 'Graduate Fellowship Deferment',
    description: 'Enrolled in an approved graduate fellowship program',
    subsidizedInterest: 'Government pays',
    maxDuration: 'While enrolled'
  },
  {
    name: 'Cancer Treatment Deferment',
    description: 'Undergoing treatment for cancer',
    subsidizedInterest: 'Government pays',
    maxDuration: 'During treatment + 6 months'
  }
]

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: 'What happens if I miss a payment?',
    answer: 'If you miss a payment, your loan becomes delinquent. After 90 days of delinquency, your loan servicer will report it to the three major credit bureaus, which can damage your credit score. After 270 days (about 9 months) of delinquency, your loan goes into default. Contact your servicer immediately if you\'re having trouble making payments—they can help you explore options before it becomes a bigger problem.'
  },
  {
    question: 'Can I make extra payments or pay off my loans early?',
    answer: 'Yes! There are no prepayment penalties for federal student loans. Making extra payments can significantly reduce the amount of interest you pay over the life of the loan and help you pay off your debt faster. When making extra payments, specify that you want the extra amount applied to your principal balance, not to future payments.'
  },
  {
    question: 'What\'s the difference between deferment and forbearance?',
    answer: 'During deferment, you may not have to make payments, and the government pays the interest on your subsidized loans. During forbearance, you can stop or reduce payments, but you are responsible for all interest that accrues on all loan types. Deferment is generally the better option if you qualify, as it can save you money on interest.'
  },
  {
    question: 'How do I change my repayment plan?',
    answer: 'Contact your loan servicer to change your repayment plan. You can switch plans at any time, though some plans have eligibility requirements. For income-driven repayment plans, you can apply online at StudentAid.gov/idr. There\'s no fee to change your repayment plan.'
  },
  {
    question: 'What if I have loans from multiple servicers?',
    answer: 'If you have loans with different servicers, you\'ll need to make payments to each one. You can consider consolidating your loans into a Direct Consolidation Loan, which combines them into a single loan with one monthly payment. However, consolidation may affect your eligibility for certain benefits, so evaluate carefully.'
  }
]

export default function LoanRepaymentPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)
  const [showAllDeferments, setShowAllDeferments] = useState(false)

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
              <span className="text-gray-600">Repayment</span>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#162e51] via-[#1a3a64] to-[#0d2240] text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-white/10 rounded-xl">
                  <DollarSign className="w-8 h-8 text-[#00bde3]" />
                </div>
                <span className="text-[#00bde3] font-semibold">Loan Repayment</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Student Loan Repayment
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                Learn about your grace period, how to make payments, and what options are available 
                if you need to temporarily stop or reduce your payments.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/manage-loans/repayment/plans">
                  <Button className="bg-[#00bde3] hover:bg-[#00a8cc] text-[#162e51] font-semibold px-6 py-3 flex items-center gap-2">
                    View Repayment Plans
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/manage-loans/servicers">
                  <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-6 py-3 flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Find Your Servicer
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Grace Period Section */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Grace Period</h2>
            </div>

            <div className="prose prose-lg max-w-none mb-8">
              <p className="text-gray-600">
                A grace period is a set amount of time after you graduate, leave school, or drop below half-time 
                enrollment before you must begin making payments on your student loans. Not all loans have a grace 
                period, so it's important to know your loan types.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-left p-4 font-semibold text-gray-900 border-b-2 border-gray-200">Loan Type</th>
                    <th className="text-left p-4 font-semibold text-gray-900 border-b-2 border-gray-200">Grace Period</th>
                    <th className="text-left p-4 font-semibold text-gray-900 border-b-2 border-gray-200">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {gracePeriods.map((period, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-4 border-b border-gray-200 font-medium text-gray-900">{period.loanType}</td>
                      <td className="p-4 border-b border-gray-200">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          period.gracePeriod.includes('9') ? 'bg-green-100 text-green-800' :
                          period.gracePeriod.includes('6') ? 'bg-blue-100 text-blue-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {period.gracePeriod}
                        </span>
                      </td>
                      <td className="p-4 border-b border-gray-200 text-gray-600">{period.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-blue-800">
                  <strong>Pro Tip:</strong> Even if you're in a grace period, consider making interest payments 
                  on unsubsidized loans to prevent interest from capitalizing (being added to your principal balance) 
                  when repayment begins.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Making Payments Section */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <CreditCard className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Making Payments</h2>
            </div>

            <div className="prose prose-lg max-w-none mb-8">
              <p className="text-gray-600">
                Your loan servicer will provide you with payment options and help you manage your account. 
                Here are the most common ways to make payments on your federal student loans.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {paymentOptions.map((option, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-[#005ea2]/10 rounded-lg text-[#005ea2]">
                      {option.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">{option.title}</h3>
                      <p className="text-gray-600 text-sm">{option.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Auto-Pay Benefits */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-500 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-green-900 text-lg mb-2">Auto-Pay Interest Rate Reduction</h3>
                  <p className="text-green-800 mb-4">
                    Enrolling in automatic debit can save you money! Most loan servicers offer a <strong>0.25% interest 
                    rate reduction</strong> when you sign up for auto-pay. Over the life of your loan, this small 
                    reduction can add up to significant savings.
                  </p>
                  <Link href="/manage-loans/servicers">
                    <Button className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 flex items-center gap-2">
                      Contact Your Servicer to Enroll
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Payment Tips */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Smart Payment Strategies</h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">1</div>
                <h3 className="font-bold text-blue-900 mb-2">Pay More Than the Minimum</h3>
                <p className="text-blue-700 text-sm">
                  Any extra payment goes toward your principal, reducing your total interest. Even small 
                  extra payments can shorten your repayment period significantly.
                </p>
              </div>

              <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">2</div>
                <h3 className="font-bold text-purple-900 mb-2">Target High-Interest Loans First</h3>
                <p className="text-purple-700 text-sm">
                  If you have multiple loans, make minimum payments on all, but put extra money toward 
                  the loan with the highest interest rate (avalanche method).
                </p>
              </div>

              <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
                <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">3</div>
                <h3 className="font-bold text-amber-900 mb-2">Apply Payments to Principal</h3>
                <p className="text-amber-700 text-sm">
                  When making extra payments, instruct your servicer to apply them to your principal 
                  balance, not to advance your due date.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Deferment & Forbearance */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Pause className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Deferment & Forbearance</h2>
            </div>

            <div className="prose prose-lg max-w-none mb-8">
              <p className="text-gray-600">
                If you're having trouble making payments, you may be able to temporarily stop or reduce 
                your payments through deferment or forbearance. These options can help you avoid delinquency 
                and default.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Deferment */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-xl">Deferment</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  A deferment allows you to temporarily stop making payments. For subsidized loans, 
                  <strong> the government pays your interest</strong> during deferment.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Interest may be covered on subsidized loans</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Multiple qualifying circumstances</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Better option if you qualify</span>
                  </div>
                </div>
              </div>

              {/* Forbearance */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Pause className="w-6 h-6 text-amber-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-xl">Forbearance</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Forbearance allows you to stop or reduce payments temporarily. However, 
                  <strong> you are responsible for all interest</strong> that accrues.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    <span>Interest accrues on all loan types</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    <span>May increase your total loan cost</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Easier to qualify for</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Deferment Types */}
            <h3 className="font-bold text-gray-900 text-lg mb-4">Types of Deferment</h3>
            <div className="overflow-x-auto mb-4">
              <table className="w-full border-collapse bg-white rounded-xl overflow-hidden shadow-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-left p-4 font-semibold text-gray-900 border-b-2 border-gray-200">Type</th>
                    <th className="text-left p-4 font-semibold text-gray-900 border-b-2 border-gray-200">Description</th>
                    <th className="text-left p-4 font-semibold text-gray-900 border-b-2 border-gray-200">Subsidized Interest</th>
                    <th className="text-left p-4 font-semibold text-gray-900 border-b-2 border-gray-200">Max Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {(showAllDeferments ? defermentTypes : defermentTypes.slice(0, 3)).map((deferment, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-4 border-b border-gray-200 font-medium text-gray-900">{deferment.name}</td>
                      <td className="p-4 border-b border-gray-200 text-gray-600">{deferment.description}</td>
                      <td className="p-4 border-b border-gray-200">
                        <span className="inline-flex items-center px-2 py-1 rounded text-sm font-medium bg-green-100 text-green-800">
                          {deferment.subsidizedInterest}
                        </span>
                      </td>
                      <td className="p-4 border-b border-gray-200 text-gray-600">{deferment.maxDuration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {defermentTypes.length > 3 && (
              <button
                onClick={() => setShowAllDeferments(!showAllDeferments)}
                className="flex items-center gap-2 text-[#005ea2] hover:underline font-medium"
              >
                {showAllDeferments ? (
                  <>Show Less <ChevronUp className="w-4 h-4" /></>
                ) : (
                  <>Show All Deferment Types ({defermentTypes.length}) <ChevronDown className="w-4 h-4" /></>
                )}
              </button>
            )}
          </div>
        </section>

        {/* Repayment Plans CTA */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-[#005ea2] to-[#0076d6] rounded-2xl p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">Choose the Right Repayment Plan</h2>
                  <p className="text-blue-100 text-lg mb-6">
                    There are several repayment plans available to help you manage your federal student loans. 
                    Compare Standard, Graduated, Extended, and Income-Driven Repayment plans to find the best fit.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link href="/manage-loans/repayment/plans">
                      <Button className="bg-white text-[#005ea2] hover:bg-blue-50 font-semibold px-6 py-3 flex items-center gap-2">
                        View All Repayment Plans
                        <ArrowRight className="w-5 h-5" />
                      </Button>
                    </Link>
                    <Link href="/manage-loans/loan-simulator">
                      <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-6 py-3 flex items-center gap-2">
                        Try Loan Simulator
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-white mb-1">Standard</div>
                    <div className="text-blue-200 text-sm">Fixed payments, 10 years</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-white mb-1">Graduated</div>
                    <div className="text-blue-200 text-sm">Payments increase over time</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-white mb-1">Extended</div>
                    <div className="text-blue-200 text-sm">Lower payments, 25 years</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-white mb-1">IDR</div>
                    <div className="text-blue-200 text-sm">Based on income</div>
                  </div>
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
                Get answers to common questions about repaying your student loans.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
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

        {/* Navigation */}
        <section className="py-8 bg-white border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <Link href="/manage-loans" className="flex items-center gap-2 text-[#005ea2] hover:underline">
                <ArrowLeft className="w-5 h-5" />
                Back to Manage Loans
              </Link>
              <Link href="/manage-loans/repayment/plans" className="flex items-center gap-2 text-[#005ea2] hover:underline">
                Repayment Plans
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
