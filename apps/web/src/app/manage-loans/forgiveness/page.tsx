'use client'

import Link from 'next/link'
import { useState } from 'react'
import { 
  ArrowRight, 
  ArrowLeft,
  Award,
  Clock, 
  Calendar,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Building2,
  GraduationCap,
  Shield,
  FileText,
  Users,
  Heart,
  Scale,
  Briefcase,
  DollarSign,
  Info,
  BookOpen,
  AlertTriangle
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'

interface ForgivenessProgram {
  id: string
  name: string
  shortName: string
  description: string
  eligibility: string[]
  requirements: string[]
  forgivenessAmount: string
  timeline: string
  icon: React.ReactNode
  color: string
  link: string
}

const forgivenessPrograms: ForgivenessProgram[] = [
  {
    id: 'pslf',
    name: 'Public Service Loan Forgiveness (PSLF)',
    shortName: 'PSLF',
    description: 'Forgives remaining balance after 120 qualifying payments while working full-time for a qualifying public service employer.',
    eligibility: [
      'Work full-time for qualifying employer (government, 501(c)(3) nonprofit)',
      'Have Direct Loans (or consolidate into Direct Loans)',
      'Repay under an income-driven repayment plan or 10-year Standard Plan',
      'Make 120 qualifying monthly payments'
    ],
    requirements: [
      'Submit PSLF form annually and when changing employers',
      'Payments need not be consecutive',
      'Must be employed by qualifying employer when applying for forgiveness'
    ],
    forgivenessAmount: '100% of remaining balance',
    timeline: '10 years (120 payments)',
    icon: <Building2 className="w-8 h-8" />,
    color: 'bg-blue-500',
    link: 'https://studentaid.gov/manage-loans/forgiveness-cancellation/public-service'
  },
  {
    id: 'teacher',
    name: 'Teacher Loan Forgiveness',
    shortName: 'Teacher',
    description: 'Provides loan forgiveness for highly qualified teachers who work in low-income schools for five consecutive years.',
    eligibility: [
      'Teach full-time for 5 complete, consecutive academic years',
      'Work in a low-income elementary or secondary school',
      'Be highly qualified as defined by the program',
      'Have Direct or FFEL loans made after October 1, 1998'
    ],
    requirements: [
      'Not have an outstanding balance on Oct 1, 1998',
      'Submit Teacher Loan Forgiveness Application',
      'Meet state certification requirements'
    ],
    forgivenessAmount: 'Up to $17,500 (STEM/Special Ed) or $5,000 (other subjects)',
    timeline: '5 years of teaching',
    icon: <BookOpen className="w-8 h-8" />,
    color: 'bg-green-500',
    link: 'https://studentaid.gov/manage-loans/forgiveness-cancellation/teacher'
  },
  {
    id: 'idr',
    name: 'Income-Driven Repayment Forgiveness',
    shortName: 'IDR Forgiveness',
    description: 'Forgives remaining balance after 20-25 years of qualifying payments under an income-driven repayment plan.',
    eligibility: [
      'Enrolled in an IDR plan (SAVE, PAYE, IBR, or ICR)',
      'Make qualifying payments for 20-25 years',
      'Have eligible federal student loans'
    ],
    requirements: [
      'Recertify income annually',
      'Stay enrolled in an IDR plan',
      'Payment counts from economic hardship deferment may count'
    ],
    forgivenessAmount: '100% of remaining balance',
    timeline: '20 years (SAVE/PAYE/IBR new) or 25 years (IBR old/ICR)',
    icon: <DollarSign className="w-8 h-8" />,
    color: 'bg-purple-500',
    link: 'https://studentaid.gov/manage-loans/repayment/plans/income-driven'
  }
]

interface DischargeType {
  name: string
  description: string
  eligibility: string
  icon: React.ReactNode
}

const dischargeTypes: DischargeType[] = [
  {
    name: 'Total and Permanent Disability Discharge',
    description: 'Discharge for borrowers who are totally and permanently disabled.',
    eligibility: 'Documentation from VA, SSA, or physician showing total and permanent disability',
    icon: <Heart className="w-6 h-6" />
  },
  {
    name: 'Closed School Discharge',
    description: 'Discharge if your school closes while you\'re enrolled or shortly after withdrawal.',
    eligibility: 'Enrolled when school closed, or withdrew within 180 days of closure',
    icon: <Building2 className="w-6 h-6" />
  },
  {
    name: 'Borrower Defense to Repayment',
    description: 'Discharge if your school misled you or engaged in misconduct.',
    eligibility: 'Evidence that school made false claims or violated laws',
    icon: <Scale className="w-6 h-6" />
  },
  {
    name: 'False Certification Discharge',
    description: 'Discharge if your school falsely certified your eligibility for loans.',
    eligibility: 'School certified eligibility improperly (e.g., no high school diploma when required)',
    icon: <AlertTriangle className="w-6 h-6" />
  },
  {
    name: 'Unpaid Refund Discharge',
    description: 'Discharge if your school didn\'t return required loan funds.',
    eligibility: 'School failed to pay required refund when you withdrew',
    icon: <DollarSign className="w-6 h-6" />
  },
  {
    name: 'Death Discharge',
    description: 'Discharge of a borrower\'s loans upon death.',
    eligibility: 'Proof of death (death certificate)',
    icon: <FileText className="w-6 h-6" />
  },
  {
    name: 'Bankruptcy Discharge',
    description: 'Discharge through bankruptcy proceedings (rare for student loans).',
    eligibility: 'Court determination of "undue hardship" in adversary proceeding',
    icon: <Scale className="w-6 h-6" />
  }
]

interface PSLFStep {
  step: number
  title: string
  description: string
}

const pslfSteps: PSLFStep[] = [
  {
    step: 1,
    title: 'Confirm Your Loans Are Eligible',
    description: 'Only Direct Loans qualify. If you have FFEL or Perkins loans, consolidate them into a Direct Consolidation Loan first.'
  },
  {
    step: 2,
    title: 'Verify Your Employer Qualifies',
    description: 'Use the PSLF Help Tool to confirm your employer is a government agency or 501(c)(3) nonprofit organization.'
  },
  {
    step: 3,
    title: 'Enroll in an IDR Plan',
    description: 'Apply for an income-driven repayment plan. This ensures your payments are as low as possible while making qualifying payments.'
  },
  {
    step: 4,
    title: 'Submit the PSLF Form Annually',
    description: 'Certify your employment each year by submitting the PSLF form. This tracks your progress toward 120 payments.'
  },
  {
    step: 5,
    title: 'Make 120 Qualifying Payments',
    description: 'Continue making payments while employed full-time by a qualifying employer. Payments don\'t need to be consecutive.'
  },
  {
    step: 6,
    title: 'Apply for Forgiveness',
    description: 'After 120 payments, submit your final PSLF form. If approved, your remaining balance will be forgiven tax-free.'
  }
]

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: 'Is PSLF forgiveness taxable?',
    answer: 'No, PSLF forgiveness is not considered taxable income. The forgiven amount will not be reported to the IRS as income, so you won\'t owe federal income tax on it.'
  },
  {
    question: 'Is IDR forgiveness taxable?',
    answer: 'Currently, through 2025, IDR forgiveness is not taxable under the American Rescue Plan Act. After 2025, unless the law is extended, forgiven amounts may be considered taxable income. Check with a tax professional for your specific situation.'
  },
  {
    question: 'Can I pursue both PSLF and Teacher Loan Forgiveness?',
    answer: 'Yes, but the same payments cannot count toward both programs. You could use Teacher Loan Forgiveness first (5 years) to forgive some loans, then pursue PSLF for remaining loans. However, payments during Teacher Loan Forgiveness would not count toward PSLF unless you\'re also meeting all PSLF requirements.'
  },
  {
    question: 'What if I made payments on the wrong repayment plan for PSLF?',
    answer: 'As of 2024, there is a one-time payment count adjustment that may count past payments made on any repayment plan toward PSLF. Check your payment count on StudentAid.gov or contact MOHELA (the PSLF servicer) for details.'
  },
  {
    question: 'Do payments during COVID-19 forbearance count toward PSLF?',
    answer: 'Yes! If you were employed by a qualifying employer during the COVID-19 payment pause (March 2020 - September 2023), those months count as qualifying payments for PSLF even though no payment was required. Submit a PSLF form to certify your employment for this period.'
  },
  {
    question: 'What happens if my employer stops qualifying for PSLF?',
    answer: 'You won\'t lose credit for past qualifying payments, but future payments won\'t count until you work for a qualifying employer again. Your qualifying payment count is preserved.'
  }
]

export default function ForgivenessPage() {
  const [expandedProgram, setExpandedProgram] = useState<string | null>('pslf')
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)

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
              <span className="text-gray-600">Forgiveness & Discharge</span>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#162e51] via-[#1a3a64] to-[#0d2240] text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-white/10 rounded-xl">
                  <Award className="w-8 h-8 text-[#00bde3]" />
                </div>
                <span className="text-[#00bde3] font-semibold">Forgiveness & Discharge</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Student Loan Forgiveness Programs
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                Learn about federal student loan forgiveness, cancellation, and discharge programs. 
                Find out if you qualify to have some or all of your loans forgiven.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://studentaid.gov/pslf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="bg-[#00bde3] hover:bg-[#00a8cc] text-[#162e51] font-semibold px-6 py-3 flex items-center gap-2">
                    PSLF Help Tool
                    <ExternalLink className="w-5 h-5" />
                  </Button>
                </a>
                <Link href="/manage-loans/repayment/plans">
                  <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-6 py-3 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    View IDR Plans
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Important Notice */}
        <section className="bg-green-50 border-b border-green-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-green-800">Loan Forgiveness is FREE</h3>
                <p className="text-green-700">
                  You never need to pay a company to apply for federal loan forgiveness. All applications 
                  are free through StudentAid.gov or your loan servicer. Be wary of scams!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Forgiveness Programs */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Major Forgiveness Programs</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                These programs can forgive part or all of your federal student loan balance if you meet specific requirements.
              </p>
            </div>

            <div className="space-y-6">
              {forgivenessPrograms.map((program) => (
                <div
                  key={program.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                >
                  <div
                    className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => setExpandedProgram(expandedProgram === program.id ? null : program.id)}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`${program.color} p-3 rounded-lg text-white flex-shrink-0`}>
                        {program.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{program.name}</h3>
                            <p className="text-gray-600">{program.description}</p>
                          </div>
                          <div className="flex-shrink-0">
                            {expandedProgram === program.id ? (
                              <ChevronUp className="w-6 h-6 text-[#005ea2]" />
                            ) : (
                              <ChevronDown className="w-6 h-6 text-gray-400" />
                            )}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-4 mt-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Award className="w-4 h-4 text-green-500" />
                            <span>{program.forgivenessAmount}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4 text-blue-500" />
                            <span>{program.timeline}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {expandedProgram === program.id && (
                    <div className="border-t border-gray-200 p-6 bg-gray-50">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            Eligibility Requirements
                          </h4>
                          <ul className="space-y-2">
                            {program.eligibility.map((req, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                                <span className="text-green-500 mt-1">•</span>
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-blue-500" />
                            Key Requirements
                          </h4>
                          <ul className="space-y-2">
                            {program.requirements.map((req, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                                <span className="text-blue-500 mt-1">•</span>
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="mt-6">
                        <a
                          href={program.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-[#005ea2] hover:underline font-medium"
                        >
                          Learn more about {program.shortName}
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PSLF Step-by-Step */}
        <section className="py-12 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">How to Pursue PSLF</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Follow these steps to work toward Public Service Loan Forgiveness.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pslfSteps.map((step) => (
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
                href="https://studentaid.gov/pslf"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-[#005ea2] hover:bg-[#004d8a] text-white font-semibold px-6 py-3 flex items-center gap-2 mx-auto">
                  Start PSLF Help Tool
                  <ExternalLink className="w-5 h-5" />
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* Qualifying Employers */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">PSLF Qualifying Employers</h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                <h3 className="font-bold text-green-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Eligible Employers
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-green-800">
                    <span className="text-green-500 mt-1">✓</span>
                    <span><strong>Government:</strong> Federal, state, local, or tribal government organizations (any agency or department)</span>
                  </li>
                  <li className="flex items-start gap-2 text-green-800">
                    <span className="text-green-500 mt-1">✓</span>
                    <span><strong>501(c)(3) Nonprofits:</strong> Tax-exempt organizations under Section 501(c)(3) of the IRS code</span>
                  </li>
                  <li className="flex items-start gap-2 text-green-800">
                    <span className="text-green-500 mt-1">✓</span>
                    <span><strong>Military Service:</strong> Full-time employment as part of the U.S. military</span>
                  </li>
                  <li className="flex items-start gap-2 text-green-800">
                    <span className="text-green-500 mt-1">✓</span>
                    <span><strong>AmeriCorps/Peace Corps:</strong> Full-time volunteer service</span>
                  </li>
                  <li className="flex items-start gap-2 text-green-800">
                    <span className="text-green-500 mt-1">✓</span>
                    <span><strong>Other Qualifying Nonprofits:</strong> Organizations providing qualifying public services</span>
                  </li>
                </ul>
              </div>

              <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                <h3 className="font-bold text-red-900 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Ineligible Employers
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-red-800">
                    <span className="text-red-500 mt-1">✗</span>
                    <span><strong>For-profit companies:</strong> Even if they do public service work</span>
                  </li>
                  <li className="flex items-start gap-2 text-red-800">
                    <span className="text-red-500 mt-1">✗</span>
                    <span><strong>For-profit contractors:</strong> Working for a for-profit that contracts with government</span>
                  </li>
                  <li className="flex items-start gap-2 text-red-800">
                    <span className="text-red-500 mt-1">✗</span>
                    <span><strong>Labor unions:</strong> Even if affiliated with government workers</span>
                  </li>
                  <li className="flex items-start gap-2 text-red-800">
                    <span className="text-red-500 mt-1">✗</span>
                    <span><strong>Partisan political organizations:</strong> Political parties, campaigns, PACs</span>
                  </li>
                  <li className="flex items-start gap-2 text-red-800">
                    <span className="text-red-500 mt-1">✗</span>
                    <span><strong>Religious organizations:</strong> For time spent on religious instruction or worship</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6 text-center">
              <a
                href="https://studentaid.gov/pslf/employer-search"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#005ea2] hover:underline font-medium"
              >
                Search for Your Employer
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* Discharge Programs */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Loan Discharge Programs</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                In certain circumstances, you may qualify to have your loans discharged (cancelled) entirely.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dischargeTypes.map((discharge, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
                      {discharge.icon}
                    </div>
                    <h3 className="font-bold text-gray-900">{discharge.name}</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{discharge.description}</p>
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">Eligibility: </span>
                    <span className="text-gray-600">{discharge.eligibility}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <a
                href="https://studentaid.gov/manage-loans/forgiveness-cancellation"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#005ea2] hover:underline font-medium"
              >
                View All Discharge Options
                <ExternalLink className="w-4 h-4" />
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
                Get answers to common questions about loan forgiveness.
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

        {/* CTA Section */}
        <section className="py-12 bg-gradient-to-r from-[#005ea2] to-[#0076d6]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Check Your Eligibility?</h2>
            <p className="text-blue-100 text-lg mb-8">
              Use the official tools to verify your employer, track your progress, and apply for forgiveness.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://studentaid.gov/pslf"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-white text-[#005ea2] hover:bg-blue-50 font-semibold px-6 py-3 flex items-center gap-2">
                  PSLF Help Tool
                  <ExternalLink className="w-5 h-5" />
                </Button>
              </a>
              <a
                href="https://studentaid.gov/idr"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-6 py-3 flex items-center gap-2">
                  Apply for IDR
                  <ExternalLink className="w-5 h-5" />
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* Navigation */}
        <section className="py-8 bg-gray-50 border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <Link href="/manage-loans/loan-simulator" className="flex items-center gap-2 text-[#005ea2] hover:underline">
                <ArrowLeft className="w-5 h-5" />
                Back to Loan Simulator
              </Link>
              <Link href="/manage-loans/consolidation" className="flex items-center gap-2 text-[#005ea2] hover:underline">
                Loan Consolidation
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
