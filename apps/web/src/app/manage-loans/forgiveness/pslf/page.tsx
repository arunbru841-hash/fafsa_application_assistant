'use client'

import Link from 'next/link'
import { useState } from 'react'
import { 
  ArrowRight, 
  ArrowLeft,
  Building2,
  Clock, 
  Calendar,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FileText,
  Users,
  Shield,
  DollarSign,
  Info,
  AlertTriangle,
  Download,
  ClipboardCheck,
  Briefcase,
  GraduationCap,
  Heart,
  Scale
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'

interface EligibilityStep {
  step: number
  title: string
  description: string
  icon: React.ReactNode
  details: string[]
  tips: string[]
}

const eligibilitySteps: EligibilityStep[] = [
  {
    step: 1,
    title: 'Have Qualifying Loans',
    description: 'Only Direct Loans qualify for PSLF',
    icon: <FileText className="w-6 h-6" />,
    details: [
      'Direct Subsidized Loans',
      'Direct Unsubsidized Loans',
      'Direct PLUS Loans',
      'Direct Consolidation Loans'
    ],
    tips: [
      'FFEL and Perkins loans must be consolidated into Direct Loans to qualify',
      'Consolidation counts as a new loan - payment count restarts',
      'Private loans are never eligible for PSLF'
    ]
  },
  {
    step: 2,
    title: 'Work for Qualifying Employer',
    description: 'Must work full-time for government or eligible nonprofit',
    icon: <Building2 className="w-6 h-6" />,
    details: [
      'Federal, state, local, or tribal government organization',
      '501(c)(3) tax-exempt nonprofit organization',
      'AmeriCorps or Peace Corps (full-time)',
      'Other nonprofits providing qualifying public services'
    ],
    tips: [
      'For-profit companies NEVER qualify, even if doing public service work',
      'Labor unions and partisan political organizations do not qualify',
      'Religious organizations may qualify if they have 501(c)(3) status',
      'Multiple qualifying employers OK - payments are cumulative'
    ]
  },
  {
    step: 3,
    title: 'Be on Qualifying Repayment Plan',
    description: 'IDR plans or 10-Year Standard Plan count',
    icon: <DollarSign className="w-6 h-6" />,
    details: [
      'SAVE Plan (Saving on a Valuable Education)',
      'PAYE (Pay As You Earn)',
      'IBR (Income-Based Repayment)',
      'ICR (Income-Contingent Repayment)',
      '10-Year Standard Repayment Plan'
    ],
    tips: [
      'IDR plans typically result in more forgiveness',
      '10-Year Standard means no balance left to forgive',
      'Graduated and Extended plans do NOT qualify',
      'You can switch plans without losing credit'
    ]
  },
  {
    step: 4,
    title: 'Make 120 Qualifying Payments',
    description: 'Payments need not be consecutive',
    icon: <Calendar className="w-6 h-6" />,
    details: [
      'Payment must be made after October 1, 2007',
      'Payment must be for the full amount due',
      'Payment must be made within 15 days of due date',
      'Must be employed by qualifying employer when payment is made'
    ],
    tips: [
      'Payments during COVID forbearance count (March 2020 - Aug 2024)',
      'Payments don\'t need to be consecutive',
      'Part-time work at multiple qualifying employers can count if combined = 30+ hrs/week',
      'Employment certification tracks your progress'
    ]
  }
]

interface QualifyingEmployer {
  category: string
  examples: string[]
  icon: React.ReactNode
  color: string
}

const qualifyingEmployers: QualifyingEmployer[] = [
  {
    category: 'Government Organizations',
    examples: [
      'Federal agencies (IRS, FDA, VA, etc.)',
      'State government departments',
      'Local government (city, county)',
      'Public school districts',
      'State universities and colleges',
      'Tribal organizations'
    ],
    icon: <Building2 className="w-6 h-6" />,
    color: 'bg-blue-500'
  },
  {
    category: '501(c)(3) Nonprofits',
    examples: [
      'Hospitals and health clinics',
      'Private nonprofit schools and universities',
      'Charitable organizations',
      'Social service agencies',
      'Arts and cultural organizations',
      'Environmental organizations'
    ],
    icon: <Heart className="w-6 h-6" />,
    color: 'bg-green-500'
  },
  {
    category: 'Public Service Organizations',
    examples: [
      'AmeriCorps (full-time)',
      'Peace Corps',
      'Public defender offices',
      'Legal aid organizations',
      'Public health organizations',
      'Emergency management agencies'
    ],
    icon: <Shield className="w-6 h-6" />,
    color: 'bg-purple-500'
  }
]

interface FAQ {
  question: string
  answer: string
}

const faqs: FAQ[] = [
  {
    question: 'What if my employer isn\'t sure if they qualify?',
    answer: 'Submit the PSLF Form and the Department of Education will verify your employer\'s eligibility. The Federal Student Aid website also has an employer search tool to help determine qualification before submitting.'
  },
  {
    question: 'Do I have to work for the same employer for 10 years?',
    answer: 'No! You can work for multiple qualifying employers over time. Payments made while working for ANY qualifying employer count toward your 120 payments. They don\'t need to be consecutive.'
  },
  {
    question: 'What happens if I leave public service before 120 payments?',
    answer: 'Your payment count is saved. If you return to qualifying employment later, you can continue from where you left off. You don\'t lose credit for payments already made.'
  },
  {
    question: 'Is forgiven debt taxable under PSLF?',
    answer: 'No! Unlike IDR forgiveness, PSLF forgiveness is tax-free at both federal and state levels. This is a significant benefit of the program.'
  },
  {
    question: 'Can I make extra payments to pay off my loans faster?',
    answer: 'You can, but it\'s not strategically beneficial for PSLF. Since your balance will be forgiven after 120 payments, paying extra just reduces the forgiveness amount. Put that money toward other goals.'
  },
  {
    question: 'What is employment certification and how often should I submit it?',
    answer: 'The PSLF Form certifies your qualifying employment. Submit it annually and whenever you change employers. This ensures your payments are being tracked and helps catch any issues early.'
  },
  {
    question: 'What if my PSLF application is denied?',
    answer: 'Review the denial reason carefully. Common issues include wrong loan type (need to consolidate to Direct), wrong repayment plan (need to switch to IDR), or employer doesn\'t qualify. You can appeal or make corrections and reapply.'
  },
  {
    question: 'Do payments made during deferment or forbearance count?',
    answer: 'Generally no, but COVID-19 forbearance payments (March 2020 - August 2024) do count as qualifying payments even though $0 was due. This was a special provision.'
  }
]

export default function PSLFPage() {
  const [expandedStep, setExpandedStep] = useState<number | null>(0)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [checklistItems, setChecklistItems] = useState<boolean[]>([false, false, false, false, false])

  const toggleChecklist = (index: number) => {
    const newItems = [...checklistItems]
    newItems[index] = !newItems[index]
    setChecklistItems(newItems)
  }

  const checklist = [
    'I have Direct Loans (or consolidated my other loans into Direct Loans)',
    'I work full-time (30+ hours/week) for a qualifying employer',
    'I\'m on an income-driven repayment plan',
    'I\'ve submitted my PSLF Form to certify my employment',
    'I\'ve logged into StudentAid.gov to check my qualifying payment count'
  ]

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
              <span className="text-gray-600">Public Service Loan Forgiveness</span>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#162e51] to-[#1a4480] text-white py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                  <Building2 className="w-7 h-7" />
                </div>
                <span className="text-[#73b3e7] font-semibold">Federal Forgiveness Program</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Public Service Loan Forgiveness (PSLF)
              </h1>
              <p className="text-xl text-blue-100 mb-6">
                Get 100% of your remaining student loan balance forgiven after making 120 
                qualifying payments while working full-time for a qualifying public service employer.
              </p>
              <div className="flex flex-wrap gap-4">
                <a 
                  href="https://studentaid.gov/manage-loans/forgiveness-cancellation/public-service"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#00bde3] hover:bg-[#00a5c9] text-white font-semibold px-6 py-3 rounded-md transition-colors"
                >
                  <ExternalLink className="w-5 h-5" />
                  Official PSLF Information
                </a>
                <a 
                  href="https://studentaid.gov/pslf/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-md transition-colors"
                >
                  <Download className="w-5 h-5" />
                  PSLF Help Tool
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Key Stats */}
        <section className="bg-white border-b py-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#005ea2]">120</div>
                <div className="text-sm text-gray-600">Qualifying Payments</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#005ea2]">10</div>
                <div className="text-sm text-gray-600">Years of Service</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#005ea2]">100%</div>
                <div className="text-sm text-gray-600">Balance Forgiven</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#005ea2]">$0</div>
                <div className="text-sm text-gray-600">Tax on Forgiveness</div>
              </div>
            </div>
          </div>
        </section>

        {/* Am I Eligible Section */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Am I Eligible for PSLF?</h2>
            <p className="text-gray-600 mb-8">
              You must meet ALL four requirements to qualify for Public Service Loan Forgiveness.
            </p>

            <div className="space-y-4">
              {eligibilitySteps.map((step, index) => (
                <div 
                  key={step.step}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedStep(expandedStep === index ? null : index)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#005ea2] text-white rounded-full flex items-center justify-center font-bold">
                        {step.step}
                      </div>
                      <div className="text-left">
                        <h3 className="font-bold text-gray-900">{step.title}</h3>
                        <p className="text-sm text-gray-600">{step.description}</p>
                      </div>
                    </div>
                    {expandedStep === index ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  
                  {expandedStep === index && (
                    <div className="px-6 pb-6 border-t border-gray-100 bg-gray-50">
                      <div className="grid md:grid-cols-2 gap-6 mt-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            What Qualifies
                          </h4>
                          <ul className="space-y-2">
                            {step.details.map((detail, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                <span className="text-green-600 mt-1">•</span>
                                {detail}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Info className="w-5 h-5 text-[#005ea2]" />
                            Tips to Know
                          </h4>
                          <ul className="space-y-2">
                            {step.tips.map((tip, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                <span className="text-[#005ea2] mt-1">•</span>
                                {tip}
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

        {/* Qualifying Employers */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Qualifying Employers</h2>
            <p className="text-gray-600 mb-8">
              These types of employers qualify for PSLF. Remember: you must work full-time (30+ hours/week).
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              {qualifyingEmployers.map((employer) => (
                <div 
                  key={employer.category}
                  className="bg-gray-50 rounded-xl p-6 border border-gray-200"
                >
                  <div className={`w-12 h-12 ${employer.color} text-white rounded-lg flex items-center justify-center mb-4`}>
                    {employer.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-3">{employer.category}</h3>
                  <ul className="space-y-2">
                    {employer.examples.map((example, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-yellow-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Employers That Do NOT Qualify</h4>
                  <ul className="grid md:grid-cols-2 gap-2">
                    <li className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      For-profit companies (any industry)
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      Labor unions
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      Partisan political organizations
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      For-profit contractors for government
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PSLF Process */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">How to Apply for PSLF</h2>
            <p className="text-gray-600 mb-8">
              Follow these steps to track your progress and eventually apply for forgiveness.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-[#005ea2] text-white rounded-full flex items-center justify-center font-bold shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Ensure You Have Direct Loans</h3>
                    <p className="text-gray-600 text-sm">
                      Log into StudentAid.gov to check your loan types. If you have FFEL or Perkins loans, 
                      consider consolidating them into a Direct Consolidation Loan.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-[#005ea2] text-white rounded-full flex items-center justify-center font-bold shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Enroll in an IDR Plan</h3>
                    <p className="text-gray-600 text-sm">
                      Apply for an income-driven repayment plan like SAVE, PAYE, or IBR. This typically 
                      results in lower payments and more forgiveness.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-[#005ea2] text-white rounded-full flex items-center justify-center font-bold shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Submit the PSLF Form Annually</h3>
                    <p className="text-gray-600 text-sm">
                      Use the PSLF Help Tool to generate and submit your form. Have your employer 
                      certify your employment. Do this every year and when changing jobs.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-[#005ea2] text-white rounded-full flex items-center justify-center font-bold shrink-0">
                    4
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Track Your Qualifying Payments</h3>
                    <p className="text-gray-600 text-sm">
                      After your employer is certified, MOHELA (the PSLF servicer) will track your 
                      qualifying payments. Check your count regularly on StudentAid.gov.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold shrink-0">
                    5
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Apply for Forgiveness at 120 Payments</h3>
                    <p className="text-gray-600 text-sm">
                      Once you have 120 qualifying payments, submit the PSLF Form one final time 
                      to apply for forgiveness. MOHELA will review and process your application.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <div className="bg-white rounded-xl p-6 border border-gray-200 sticky top-4">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <ClipboardCheck className="w-5 h-5 text-[#005ea2]" />
                    Your PSLF Checklist
                  </h3>
                  <div className="space-y-3">
                    {checklist.map((item, index) => (
                      <label 
                        key={index}
                        className="flex items-start gap-3 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={checklistItems[index]}
                          onChange={() => toggleChecklist(index)}
                          className="mt-1 w-5 h-5 rounded border-gray-300 text-[#005ea2] focus:ring-[#005ea2]"
                        />
                        <span className={`text-sm ${checklistItems[index] ? 'text-gray-500 line-through' : 'text-gray-700'}`}>
                          {item}
                        </span>
                      </label>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-semibold text-[#005ea2]">
                        {checklistItems.filter(Boolean).length} of {checklistItems.length} complete
                      </span>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-[#005ea2] h-2 rounded-full transition-all"
                        style={{ width: `${(checklistItems.filter(Boolean).length / checklistItems.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Common Mistakes */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Common PSLF Mistakes to Avoid</h2>
            <p className="text-gray-600 mb-8">
              Don't let these common errors derail your path to forgiveness.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Wrong Loan Type</h3>
                <p className="text-sm text-gray-600">
                  Only Direct Loans qualify. If you have FFEL or Perkins loans, you must consolidate 
                  them first—but this resets your payment count.
                </p>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Wrong Repayment Plan</h3>
                <p className="text-sm text-gray-600">
                  Graduated and Extended plans do NOT qualify. Switch to an income-driven plan 
                  or the 10-Year Standard Plan immediately.
                </p>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Not Certifying Employment</h3>
                <p className="text-sm text-gray-600">
                  Submit the PSLF Form annually. Waiting until you have 120 payments to discover 
                  an issue means potentially starting over.
                </p>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Paying Extra</h3>
                <p className="text-sm text-gray-600">
                  Extra payments don't count extra toward PSLF and just reduce your forgiveness 
                  amount. Stick to the minimum required payment.
                </p>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Missing IDR Recertification</h3>
                <p className="text-sm text-gray-600">
                  You must recertify your income annually for IDR plans. Missing this deadline 
                  can kick you off your qualifying plan.
                </p>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Leaving Job Before Forgiveness</h3>
                <p className="text-sm text-gray-600">
                  You must be employed by a qualifying employer when you apply for forgiveness—not 
                  just when making payments. Don't quit too soon!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h2>
            <p className="text-gray-600 mb-8">
              Get answers to common questions about Public Service Loan Forgiveness.
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
              Ready to Start Your PSLF Journey?
            </h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Use the official PSLF Help Tool to generate your form, check employer eligibility, 
              and track your progress toward forgiveness.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="https://studentaid.gov/pslf/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-[#005ea2] hover:bg-gray-100 font-semibold px-6 py-3 rounded-md transition-colors"
              >
                <ExternalLink className="w-5 h-5" />
                PSLF Help Tool
              </a>
              <Link 
                href="/manage-loans/loan-simulator"
                className="inline-flex items-center gap-2 bg-[#00bde3] hover:bg-[#00a5c9] text-white font-semibold px-6 py-3 rounded-md transition-colors"
              >
                Estimate Your Payments
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Navigation Footer */}
        <section className="py-8 bg-white border-t">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <Link 
                href="/manage-loans/forgiveness" 
                className="flex items-center gap-2 text-[#005ea2] hover:underline font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Forgiveness Programs
              </Link>
              <Link 
                href="/manage-loans/forgiveness/teacher" 
                className="flex items-center gap-2 text-[#005ea2] hover:underline font-medium"
              >
                Teacher Loan Forgiveness
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
