'use client'

import Link from 'next/link'
import { useState } from 'react'
import { 
  CreditCard, 
  Calculator, 
  FileCheck, 
  Building2, 
  ArrowRight, 
  DollarSign, 
  Clock, 
  AlertCircle,
  CheckCircle,
  HelpCircle,
  ExternalLink,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Shield,
  TrendingDown,
  Users,
  Calendar,
  FileText,
  Wallet,
  RefreshCw
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'

interface LoanSection {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  href: string
  color: string
  features: string[]
}

const loanSections: LoanSection[] = [
  {
    id: 'repayment',
    title: 'Loan Repayment',
    description: 'Learn about your repayment options, grace periods, and how to make payments on your federal student loans.',
    icon: <DollarSign className="w-8 h-8" />,
    href: '/manage-loans/repayment',
    color: 'bg-blue-500',
    features: ['Grace period information', 'Making payments', 'Repayment timeline', 'Deferment & forbearance']
  },
  {
    id: 'plans',
    title: 'Repayment Plans',
    description: 'Compare Standard, Graduated, Extended, and Income-Driven Repayment (IDR) plans to find the best fit.',
    icon: <FileText className="w-8 h-8" />,
    href: '/manage-loans/repayment/plans',
    color: 'bg-green-500',
    features: ['Standard & Graduated plans', 'Income-Driven Repayment (IDR)', 'SAVE, PAYE, IBR, ICR plans', 'Plan comparison tool']
  },
  {
    id: 'simulator',
    title: 'Loan Simulator',
    description: 'Calculate your monthly payments and compare different repayment strategies with our interactive tool.',
    icon: <Calculator className="w-8 h-8" />,
    href: '/manage-loans/loan-simulator',
    color: 'bg-purple-500',
    features: ['Monthly payment calculator', 'Total interest estimates', 'Payoff timeline', 'Strategy comparison']
  },
  {
    id: 'forgiveness',
    title: 'Forgiveness & Discharge',
    description: 'Explore Public Service Loan Forgiveness (PSLF), teacher forgiveness, and other loan cancellation programs.',
    icon: <FileCheck className="w-8 h-8" />,
    href: '/manage-loans/forgiveness',
    color: 'bg-amber-500',
    features: ['Public Service Loan Forgiveness', 'Teacher Loan Forgiveness', 'IDR forgiveness', 'Discharge options']
  },
  {
    id: 'consolidation',
    title: 'Loan Consolidation',
    description: 'Combine multiple federal student loans into one Direct Consolidation Loan with a single monthly payment.',
    icon: <RefreshCw className="w-8 h-8" />,
    href: '/manage-loans/consolidation',
    color: 'bg-indigo-500',
    features: ['Combine multiple loans', 'Single monthly payment', 'Access to IDR plans', 'Eligibility requirements']
  },
  {
    id: 'servicers',
    title: 'Find Your Servicer',
    description: 'Identify your loan servicer and learn how to contact them for help with your federal student loans.',
    icon: <Building2 className="w-8 h-8" />,
    href: '/manage-loans/servicers',
    color: 'bg-teal-500',
    features: ['Servicer lookup', 'Contact information', 'What servicers do', 'Loan transfers']
  }
]

interface QuickAction {
  title: string
  description: string
  href: string
  icon: React.ReactNode
  external?: boolean
}

const quickActions: QuickAction[] = [
  {
    title: 'Log In to StudentAid.gov',
    description: 'View your loan details, payment history, and servicer information',
    href: 'https://studentaid.gov/fsa-id/sign-in/landing',
    icon: <ExternalLink className="w-5 h-5" />,
    external: true
  },
  {
    title: 'Make a Payment',
    description: 'Contact your servicer or log in to their website to make a payment',
    href: '/manage-loans/servicers',
    icon: <CreditCard className="w-5 h-5" />
  },
  {
    title: 'Apply for IDR',
    description: 'Submit an income-driven repayment plan application',
    href: 'https://studentaid.gov/idr',
    icon: <FileText className="w-5 h-5" />,
    external: true
  },
  {
    title: 'PSLF Help Tool',
    description: 'Check employer eligibility and track your PSLF progress',
    href: 'https://studentaid.gov/pslf',
    icon: <Shield className="w-5 h-5" />,
    external: true
  }
]

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: 'When do I have to start repaying my student loans?',
    answer: 'For most federal student loans, you must begin repaying after your grace period ends. Direct Subsidized and Unsubsidized Loans have a 6-month grace period after you graduate, leave school, or drop below half-time enrollment. Direct PLUS Loans for graduate students have a 6-month grace period, while Parent PLUS Loans enter repayment when fully disbursed (though parents can request a deferment while the student is enrolled).'
  },
  {
    question: 'What is the difference between deferment and forbearance?',
    answer: 'Both deferment and forbearance allow you to temporarily stop making payments or reduce your payment amount. The key difference is that during deferment, the government may pay the interest on your subsidized loans. During forbearance, you are responsible for all interest that accrues. Deferment is generally the better option if you qualify.'
  },
  {
    question: 'Which repayment plan should I choose?',
    answer: 'The best plan depends on your financial situation and goals. Standard Repayment is best if you can afford the payments and want to pay off loans quickly. Income-Driven Repayment (IDR) plans are ideal if you have a lower income, want lower monthly payments, or are pursuing Public Service Loan Forgiveness. Use our Loan Simulator to compare options.'
  },
  {
    question: 'What happens if I can\'t make my loan payments?',
    answer: 'Contact your loan servicer immediately if you\'re having trouble making payments. They can help you explore options like changing your repayment plan, requesting deferment or forbearance, or applying for an income-driven plan. Ignoring your loans can lead to delinquency and eventually default, which has serious consequences.'
  },
  {
    question: 'How do I qualify for Public Service Loan Forgiveness (PSLF)?',
    answer: 'To qualify for PSLF, you must: (1) work full-time for a qualifying employer (government or 501(c)(3) nonprofit), (2) have Direct Loans, (3) repay under an income-driven repayment plan or 10-year Standard Plan, and (4) make 120 qualifying monthly payments. After meeting all requirements, any remaining balance is forgiven tax-free.'
  },
  {
    question: 'Should I consolidate my federal student loans?',
    answer: 'Consolidation can simplify repayment by combining multiple loans into one and may provide access to additional repayment plans or forgiveness programs. However, it may also cause you to lose certain benefits like progress toward forgiveness or interest rate discounts. Carefully consider the pros and cons before consolidating.'
  }
]

export default function ManageLoansPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#162e51] via-[#1a3a64] to-[#0d2240] text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-white/10 rounded-xl">
                  <Wallet className="w-8 h-8 text-[#00bde3]" />
                </div>
                <span className="text-[#00bde3] font-semibold">Manage Your Loans</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Federal Student Loan Management
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                Everything you need to understand, repay, and manage your federal student loans. 
                Find the right repayment plan, explore forgiveness options, and stay on track with your payments.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/manage-loans/repayment">
                  <Button className="bg-[#00bde3] hover:bg-[#00a8cc] text-[#162e51] font-semibold px-6 py-3 flex items-center gap-2">
                    Start Repayment Guide
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
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

        {/* Quick Actions Bar */}
        <section className="bg-white border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <a
                  key={index}
                  href={action.href}
                  target={action.external ? '_blank' : undefined}
                  rel={action.external ? 'noopener noreferrer' : undefined}
                  className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-[#005ea2] hover:bg-blue-50 transition-colors group"
                >
                  <div className="p-2 bg-[#005ea2]/10 rounded-lg text-[#005ea2] group-hover:bg-[#005ea2] group-hover:text-white transition-colors">
                    {action.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 group-hover:text-[#005ea2]">{action.title}</h3>
                    <p className="text-sm text-gray-500">{action.description}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Important Notice */}
        <section className="bg-amber-50 border-b border-amber-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-800">Important Reminder</h3>
                <p className="text-amber-700">
                  Your loan servicer is your primary contact for all questions about your federal student loans. 
                  Services like payment processing, plan changes, and forgiveness applications are <strong>free</strong> through your servicer. 
                  Never pay a company to help with your federal student loans.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Main Navigation Sections */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore Loan Management Topics</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Choose a topic below to learn more about managing your federal student loans effectively.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loanSections.map((section) => (
                <Link
                  key={section.id}
                  href={section.href}
                  className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:border-[#005ea2] transition-all duration-200"
                >
                  <div className={`${section.color} p-6 flex items-center justify-between`}>
                    <div className="text-white">
                      {section.icon}
                    </div>
                    <ArrowRight className="w-6 h-6 text-white/70 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#005ea2]">
                      {section.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{section.description}</p>
                    <ul className="space-y-2">
                      {section.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-gray-500">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Loan Status Overview */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Understanding Your Loan Status</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Know where your loans are in the repayment lifecycle and what actions you may need to take.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-blue-900">In School</h3>
                </div>
                <p className="text-blue-700 text-sm mb-3">
                  No payments required while enrolled at least half-time. Interest may accrue on unsubsidized loans.
                </p>
                <div className="text-blue-600 text-sm font-medium">
                  Action: Track your loans and plan ahead
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-amber-500 rounded-lg">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-amber-900">Grace Period</h3>
                </div>
                <p className="text-amber-700 text-sm mb-3">
                  6-month period after leaving school before payments begin. Use this time to choose a repayment plan.
                </p>
                <div className="text-amber-600 text-sm font-medium">
                  Action: Select your repayment plan
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-500 rounded-lg">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-green-900">In Repayment</h3>
                </div>
                <p className="text-green-700 text-sm mb-3">
                  Actively making monthly payments. You can change your repayment plan at any time if needed.
                </p>
                <div className="text-green-600 text-sm font-medium">
                  Action: Stay current on payments
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-500 rounded-lg">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-purple-900">Deferment/Forbearance</h3>
                </div>
                <p className="text-purple-700 text-sm mb-3">
                  Temporarily not required to make payments due to financial hardship, returning to school, etc.
                </p>
                <div className="text-purple-600 text-sm font-medium">
                  Action: Plan for resuming payments
                </div>
              </div>
            </div>

            {/* Default Warning */}
            <div className="mt-8 bg-red-50 border border-red-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-red-500 rounded-lg flex-shrink-0">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-red-900 text-lg mb-2">Avoid Default</h3>
                  <p className="text-red-700 mb-4">
                    Defaulting on your student loans has serious consequences including wage garnishment, 
                    tax refund seizure, damaged credit, and loss of eligibility for future federal aid. 
                    If you're struggling to make payments, contact your servicer immediately to explore your options.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link href="/manage-loans/repayment/plans">
                      <Button className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2">
                        Explore Lower Payment Options
                      </Button>
                    </Link>
                    <Link href="/manage-loans/servicers">
                      <Button className="bg-white hover:bg-red-50 text-red-600 border border-red-300 text-sm px-4 py-2">
                        Contact Your Servicer
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Statistics */}
        <section className="py-12 bg-[#162e51] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-4">Federal Student Loan Facts</h2>
              <p className="text-blue-200 max-w-2xl mx-auto">
                Understanding the federal student loan landscape can help you make better decisions.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-[#00bde3] mb-2">43M+</div>
                <div className="text-blue-200">Americans with student loans</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-[#00bde3] mb-2">$1.77T</div>
                <div className="text-blue-200">Total student loan debt</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-[#00bde3] mb-2">$37K</div>
                <div className="text-blue-200">Average borrower balance</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-[#00bde3] mb-2">10-25</div>
                <div className="text-blue-200">Years to repayment</div>
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
                Get answers to common questions about managing your federal student loans.
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

        {/* Get Help CTA */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-[#005ea2] to-[#0076d6] rounded-2xl p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">Need Help With Your Loans?</h2>
                  <p className="text-blue-100 text-lg mb-6">
                    Your loan servicer is your go-to resource for personalized assistance with your federal student loans. 
                    All services are free—never pay for federal loan help.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link href="/manage-loans/servicers">
                      <Button className="bg-white text-[#005ea2] hover:bg-blue-50 font-semibold px-6 py-3 flex items-center gap-2">
                        <Phone className="w-5 h-5" />
                        Find Your Servicer
                      </Button>
                    </Link>
                    <a
                      href="https://studentaid.gov/help-center"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-6 py-3 flex items-center gap-2">
                        <HelpCircle className="w-5 h-5" />
                        FSA Help Center
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </a>
                  </div>
                </div>
                <div className="bg-white/10 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Federal Student Aid Contact</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-blue-100">
                      <Phone className="w-5 h-5" />
                      <span>1-800-433-3243 (1-800-4-FED-AID)</span>
                    </div>
                    <div className="flex items-center gap-3 text-blue-100">
                      <Clock className="w-5 h-5" />
                      <span>Mon–Fri: 8 a.m.–11 p.m. (ET)</span>
                    </div>
                    <div className="flex items-center gap-3 text-blue-100">
                      <Clock className="w-5 h-5" />
                      <span>Sat–Sun: 11 a.m.–5 p.m. (ET)</span>
                    </div>
                    <div className="flex items-start gap-3 text-blue-100">
                      <Mail className="w-5 h-5 mt-0.5" />
                      <span>TTY for deaf/hard of hearing: 1-800-730-8913</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
