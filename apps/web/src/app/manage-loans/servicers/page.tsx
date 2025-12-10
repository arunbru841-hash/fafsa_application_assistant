'use client'

import Link from 'next/link'
import { useState } from 'react'
import { 
  ArrowRight, 
  ArrowLeft,
  Building2,
  Clock, 
  AlertCircle,
  CheckCircle,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Phone,
  Mail,
  Globe,
  Search,
  Info,
  Shield,
  DollarSign,
  FileText,
  Users,
  RefreshCw,
  AlertTriangle
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface LoanServicer {
  name: string
  phone: string
  website: string
  description: string
  loanTypes: string[]
}

const loanServicers: LoanServicer[] = [
  {
    name: 'MOHELA',
    phone: '1-888-866-4352',
    website: 'https://www.mohela.com',
    description: 'Designated servicer for PSLF. Also services Direct Loans and FFEL loans.',
    loanTypes: ['Direct Loans', 'FFEL Loans', 'PSLF']
  },
  {
    name: 'Nelnet',
    phone: '1-888-486-4722',
    website: 'https://www.nelnet.com',
    description: 'Services Direct Loans and FFEL loans owned by the Department of Education.',
    loanTypes: ['Direct Loans', 'FFEL Loans']
  },
  {
    name: 'Aidvantage',
    phone: '1-800-722-1300',
    website: 'https://www.aidvantage.com',
    description: 'Services Direct Loans and FFEL loans. Took over many accounts from Navient.',
    loanTypes: ['Direct Loans', 'FFEL Loans']
  },
  {
    name: 'Edfinancial',
    phone: '1-855-337-6884',
    website: 'https://www.edfinancial.com',
    description: 'Services Direct Loans and FFEL loans owned by the Department of Education.',
    loanTypes: ['Direct Loans', 'FFEL Loans']
  },
  {
    name: 'ECSI',
    phone: '1-866-313-3797',
    website: 'https://www.ecsi.net',
    description: 'Services Federal Perkins Loans and some institutional loans.',
    loanTypes: ['Perkins Loans', 'Institutional Loans']
  },
  {
    name: 'Default Resolution Group',
    phone: '1-800-621-3115',
    website: 'https://myeddebt.ed.gov',
    description: 'Handles defaulted federal student loans for the Department of Education.',
    loanTypes: ['Defaulted Loans']
  }
]

interface ServicerService {
  title: string
  description: string
  icon: React.ReactNode
}

const servicerServices: ServicerService[] = [
  {
    title: 'Process Payments',
    description: 'Receive and apply your monthly payments, process extra payments, and maintain payment records.',
    icon: <DollarSign className="w-6 h-6" />
  },
  {
    title: 'Manage Repayment Plans',
    description: 'Help you understand and switch between different repayment plans including IDR plans.',
    icon: <FileText className="w-6 h-6" />
  },
  {
    title: 'Handle Deferment & Forbearance',
    description: 'Process requests to temporarily pause or reduce payments during financial hardship.',
    icon: <Clock className="w-6 h-6" />
  },
  {
    title: 'Assist with Forgiveness',
    description: 'Help you apply for loan forgiveness programs and track progress toward PSLF.',
    icon: <Shield className="w-6 h-6" />
  },
  {
    title: 'Consolidation Support',
    description: 'Provide information and assistance with loan consolidation applications.',
    icon: <RefreshCw className="w-6 h-6" />
  },
  {
    title: 'Answer Questions',
    description: 'Provide customer service for any questions about your loans, payments, or options.',
    icon: <HelpCircle className="w-6 h-6" />
  }
]

interface TransferTip {
  title: string
  description: string
}

const transferTips: TransferTip[] = [
  {
    title: 'Watch for Communications',
    description: 'You\'ll receive notices from both your old and new servicer when a transfer occurs. Read them carefully.'
  },
  {
    title: 'Update Auto-Pay',
    description: 'If you have automatic payments, you\'ll need to set them up again with your new servicer.'
  },
  {
    title: 'Verify Your Information',
    description: 'Create an account with your new servicer and verify that all your loan information transferred correctly.'
  },
  {
    title: 'Don\'t Stop Payments',
    description: 'Continue making payments during the transfer. Payments made during transfer will be credited to your account.'
  },
  {
    title: 'Keep Records',
    description: 'Save copies of your payment history and loan details from your old servicer before the transfer completes.'
  },
  {
    title: 'Confirm IDR/PSLF Status',
    description: 'If you\'re on an IDR plan or pursuing PSLF, confirm your status and payment counts with your new servicer.'
  }
]

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: 'How do I find out who my loan servicer is?',
    answer: 'Log in to StudentAid.gov and go to your account dashboard. Scroll down to "My Loan Servicers" to see which servicer(s) handle your loans. You can also call the Federal Student Aid Information Center at 1-800-433-3243.'
  },
  {
    question: 'Why was my loan transferred to a new servicer?',
    answer: 'The Department of Education periodically reassigns loans between servicers. This can happen for various reasons including servicer contract changes, workload balancing, or when a servicer exits the program. The transfer doesn\'t change your loan terms.'
  },
  {
    question: 'Do I have to pay my servicer for their help?',
    answer: 'No! All services from your federal loan servicer are free. Never pay a company to help with repayment plans, forgiveness applications, or consolidation. These services are always free through your servicer.'
  },
  {
    question: 'Can I choose my own loan servicer?',
    answer: 'Generally, no. The Department of Education assigns your servicer. However, if you consolidate your loans or if you\'re pursuing PSLF, your loans may be transferred to a different servicer.'
  },
  {
    question: 'What if I have loans with multiple servicers?',
    answer: 'You\'ll need to work with each servicer separately for their respective loans. If this is inconvenient, you can consolidate your loans into a Direct Consolidation Loan, which will result in a single servicer.'
  },
  {
    question: 'What should I do if I can\'t reach my servicer?',
    answer: 'Try multiple contact methods (phone, email, online chat). If you still can\'t get help, you can contact the Federal Student Aid Ombudsman Group for assistance at 1-877-557-2575 or submit a complaint at StudentAid.gov.'
  }
]

export default function ServicersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)

  const filteredServicers = loanServicers.filter(servicer =>
    servicer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    servicer.loanTypes.some(type => type.toLowerCase().includes(searchTerm.toLowerCase()))
  )

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
              <span className="text-gray-600">Loan Servicers</span>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#162e51] via-[#1a3a64] to-[#0d2240] text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-white/10 rounded-xl">
                  <Building2 className="w-8 h-8 text-[#00bde3]" />
                </div>
                <span className="text-[#00bde3] font-semibold">Loan Servicers</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Find Your Student Loan Servicer
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                Your loan servicer is your primary contact for managing your federal student loans. 
                Learn who they are, how to contact them, and what services they provide—all for free.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://studentaid.gov/fsa-id/sign-in/landing"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="bg-[#00bde3] hover:bg-[#00a8cc] text-[#162e51] font-semibold px-6 py-3 flex items-center gap-2">
                    Log In to Find Your Servicer
                    <ExternalLink className="w-5 h-5" />
                  </Button>
                </a>
                <a href="tel:1-800-433-3243">
                  <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-6 py-3 flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    Call 1-800-4-FED-AID
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Warning Banner */}
        <section className="bg-amber-50 border-b border-amber-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-800">Beware of Scams</h3>
                <p className="text-amber-700">
                  Your loan servicer will <strong>never</strong> charge you for help with your federal student loans. 
                  Be wary of companies claiming to help with forgiveness, consolidation, or payment plans for a fee. 
                  All these services are free through your servicer.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How to Find Your Servicer */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">How to Find Your Servicer</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                The easiest way to identify your loan servicer is through your StudentAid.gov account.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 text-center">
                <div className="w-14 h-14 bg-[#005ea2] rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">1</div>
                <h3 className="font-bold text-gray-900 mb-2">Log In to StudentAid.gov</h3>
                <p className="text-gray-600 text-sm">
                  Use your FSA ID to sign in to your account at StudentAid.gov
                </p>
              </div>

              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 text-center">
                <div className="w-14 h-14 bg-[#005ea2] rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">2</div>
                <h3 className="font-bold text-gray-900 mb-2">Go to Your Dashboard</h3>
                <p className="text-gray-600 text-sm">
                  Navigate to "My Aid" section on your account dashboard
                </p>
              </div>

              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 text-center">
                <div className="w-14 h-14 bg-[#005ea2] rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">3</div>
                <h3 className="font-bold text-gray-900 mb-2">View My Loan Servicers</h3>
                <p className="text-gray-600 text-sm">
                  Scroll to "My Loan Servicers" to see contact information
                </p>
              </div>
            </div>

            <div className="text-center">
              <a
                href="https://studentaid.gov/fsa-id/sign-in/landing"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-[#005ea2] hover:bg-[#004d8a] text-white font-semibold px-6 py-3 flex items-center gap-2 mx-auto">
                  Find My Servicer Now
                  <ExternalLink className="w-5 h-5" />
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* Servicer Directory */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Federal Student Loan Servicers</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Contact information for all federal student loan servicers.
              </p>
            </div>

            <div className="max-w-md mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by servicer name or loan type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServicers.map((servicer, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{servicer.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{servicer.description}</p>
                  
                  <div className="space-y-3 mb-4">
                    <a
                      href={`tel:${servicer.phone.replace(/[^0-9]/g, '')}`}
                      className="flex items-center gap-2 text-[#005ea2] hover:underline"
                    >
                      <Phone className="w-4 h-4" />
                      {servicer.phone}
                    </a>
                    <a
                      href={servicer.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[#005ea2] hover:underline"
                    >
                      <Globe className="w-4 h-4" />
                      Visit Website
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {servicer.loanTypes.map((type, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {filteredServicers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No servicers found matching your search.
              </div>
            )}
          </div>
        </section>

        {/* What Servicers Do */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">What Your Servicer Does for You</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Your loan servicer provides many free services to help you manage your loans.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {servicerServices.map((service, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-[#005ea2] rounded-lg text-white">
                      {service.icon}
                    </div>
                    <h3 className="font-bold text-gray-900">{service.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm">{service.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-green-50 rounded-xl border border-green-200">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-green-900 mb-2">All Services Are FREE</h4>
                  <p className="text-green-800">
                    Every service your loan servicer provides is free of charge. This includes helping you apply for 
                    income-driven repayment plans, loan forgiveness, deferment, forbearance, and consolidation. 
                    If someone asks you to pay for these services, it's a scam.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Loan Transfers */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">When Your Loan Is Transferred</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Sometimes the Department of Education transfers loans between servicers. Here's what to expect.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {transferTips.map((tip, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-2">{tip.title}</h3>
                  <p className="text-gray-600 text-sm">{tip.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-start gap-3">
                <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-blue-900 mb-2">Your Loan Terms Don't Change</h4>
                  <p className="text-blue-800">
                    When your loan is transferred to a new servicer, your interest rate, repayment plan, and loan 
                    balance remain the same. Only the company you make payments to changes. Your IDR plan and PSLF 
                    progress should also transfer, but always verify with your new servicer.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PSLF Servicer */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-[#005ea2] to-[#0076d6] rounded-2xl p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="w-8 h-8 text-[#00bde3]" />
                    <span className="text-[#00bde3] font-semibold">PSLF Servicer</span>
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-4">Pursuing Public Service Loan Forgiveness?</h2>
                  <p className="text-blue-100 text-lg mb-6">
                    MOHELA is the designated servicer for PSLF. If you're working toward Public Service Loan 
                    Forgiveness, your loans will be transferred to MOHELA for servicing.
                  </p>
                  <a
                    href="https://www.mohela.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="bg-white text-[#005ea2] hover:bg-blue-50 font-semibold px-6 py-3 flex items-center gap-2">
                      Visit MOHELA
                      <ExternalLink className="w-5 h-5" />
                    </Button>
                  </a>
                </div>
                <div className="bg-white/10 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">MOHELA Contact Info</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-blue-100">
                      <Phone className="w-5 h-5" />
                      <span>1-888-866-4352</span>
                    </div>
                    <div className="flex items-center gap-3 text-blue-100">
                      <Clock className="w-5 h-5" />
                      <span>Mon–Fri: 7 a.m.–9 p.m. (CT)</span>
                    </div>
                    <div className="flex items-center gap-3 text-blue-100">
                      <Globe className="w-5 h-5" />
                      <a href="https://www.mohela.com" target="_blank" rel="noopener noreferrer" className="hover:underline">
                        www.mohela.com
                      </a>
                    </div>
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
                Get answers to common questions about loan servicers.
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

        {/* Federal Student Aid Contact */}
        <section className="py-12 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gray-100 rounded-xl p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Additional Help?</h2>
              <p className="text-gray-600 mb-6">
                If you're having trouble with your loan servicer or need additional assistance, contact the 
                Federal Student Aid Information Center.
              </p>
              <div className="grid md:grid-cols-3 gap-6 text-left">
                <div className="bg-white rounded-lg p-4">
                  <div className="flex items-center gap-2 text-[#005ea2] font-semibold mb-2">
                    <Phone className="w-5 h-5" />
                    Phone
                  </div>
                  <p className="text-gray-900 font-medium">1-800-433-3243</p>
                  <p className="text-sm text-gray-500">(1-800-4-FED-AID)</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="flex items-center gap-2 text-[#005ea2] font-semibold mb-2">
                    <Clock className="w-5 h-5" />
                    Hours
                  </div>
                  <p className="text-gray-700 text-sm">Mon–Fri: 8 a.m.–11 p.m. ET</p>
                  <p className="text-gray-700 text-sm">Sat–Sun: 11 a.m.–5 p.m. ET</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="flex items-center gap-2 text-[#005ea2] font-semibold mb-2">
                    <HelpCircle className="w-5 h-5" />
                    Ombudsman
                  </div>
                  <p className="text-gray-900 font-medium">1-877-557-2575</p>
                  <p className="text-sm text-gray-500">For unresolved issues</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation */}
        <section className="py-8 bg-gray-50 border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <Link href="/manage-loans/consolidation" className="flex items-center gap-2 text-[#005ea2] hover:underline">
                <ArrowLeft className="w-5 h-5" />
                Back to Consolidation
              </Link>
              <Link href="/manage-loans" className="flex items-center gap-2 text-[#005ea2] hover:underline">
                Manage Loans Overview
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
