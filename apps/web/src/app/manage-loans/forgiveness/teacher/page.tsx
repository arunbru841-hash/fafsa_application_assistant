'use client'

import Link from 'next/link'
import { useState } from 'react'
import { 
  ArrowRight, 
  ArrowLeft,
  BookOpen,
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
  GraduationCap,
  MapPin,
  Award,
  School
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'

interface ForgivenessAmount {
  category: string
  amount: string
  subjects: string[]
  requirements: string[]
  color: string
}

const forgivenessAmounts: ForgivenessAmount[] = [
  {
    category: 'Higher Forgiveness',
    amount: 'Up to $17,500',
    subjects: [
      'Mathematics',
      'Science (biology, chemistry, physics, etc.)',
      'Special Education'
    ],
    requirements: [
      'Highly qualified in these specific subjects',
      'Teaching at elementary or secondary level',
      'Full-time for 5 consecutive years'
    ],
    color: 'bg-green-500'
  },
  {
    category: 'Standard Forgiveness',
    amount: 'Up to $5,000',
    subjects: [
      'English/Language Arts',
      'Social Studies/History',
      'Elementary Education (all subjects)',
      'Other teaching areas'
    ],
    requirements: [
      'Highly qualified in your subject area',
      'Teaching at elementary or secondary level',
      'Full-time for 5 consecutive years'
    ],
    color: 'bg-blue-500'
  }
]

interface EligibilityRequirement {
  title: string
  description: string
  details: string[]
  icon: React.ReactNode
}

const eligibilityRequirements: EligibilityRequirement[] = [
  {
    title: 'Five Consecutive Years of Teaching',
    description: 'Teach full-time for 5 complete, consecutive academic years',
    details: [
      'Must be complete academic years (August-May typically)',
      'Years must be consecutive—no gaps allowed',
      'Full-time as defined by your school or state',
      'Can be at one school or multiple qualifying schools'
    ],
    icon: <Calendar className="w-6 h-6" />
  },
  {
    title: 'Low-Income School or Agency',
    description: 'Work at a school serving low-income students',
    details: [
      'Elementary or secondary school listed in the Teacher Cancellation Low Income Directory',
      'Educational service agency serving low-income students',
      'School must qualify for ALL 5 years you teach there',
      'Directory updated annually—verify each year'
    ],
    icon: <School className="w-6 h-6" />
  },
  {
    title: 'Highly Qualified Teacher Status',
    description: 'Meet state and federal requirements for highly qualified teachers',
    details: [
      'Hold at least a bachelor\'s degree',
      'Have full state certification (not temporary/emergency)',
      'Demonstrate competence in subject area taught',
      'Requirements vary by state—check with your state education agency'
    ],
    icon: <Award className="w-6 h-6" />
  },
  {
    title: 'Eligible Loan Types',
    description: 'Have qualifying federal student loans',
    details: [
      'Direct Subsidized Loans',
      'Direct Unsubsidized Loans',
      'Subsidized Federal Stafford Loans (FFEL)',
      'Unsubsidized Federal Stafford Loans (FFEL)',
      'Loans must have been disbursed after October 1, 1998'
    ],
    icon: <FileText className="w-6 h-6" />
  }
]

interface FAQ {
  question: string
  answer: string
}

const faqs: FAQ[] = [
  {
    question: 'Can I get both Teacher Loan Forgiveness and PSLF?',
    answer: 'Yes, but not for the same period of service. You cannot count the same 5 years toward both programs. However, you can use 5 years for Teacher Loan Forgiveness, then continue working toward PSLF with additional years of service. This can actually maximize your total forgiveness.'
  },
  {
    question: 'What if my school loses its low-income status?',
    answer: 'If your school was listed in the Low Income Directory when you started your 5-year period, you can continue to count service at that school even if it\'s later removed from the directory. However, if you change schools, the new school must be on the current directory.'
  },
  {
    question: 'Does summer break count toward the consecutive years?',
    answer: 'Yes! Summer breaks between academic years don\'t break the consecutive requirement, as long as you return to teaching in the fall. You\'re not required to teach summer school.'
  },
  {
    question: 'Can I qualify if I\'m a part-time teacher?',
    answer: 'No, you must be a full-time teacher. The definition of "full-time" is determined by your school, local education agency (LEA), or state. Generally, this means you meet the school\'s requirements for a full-time annual contract.'
  },
  {
    question: 'What about substitute teachers or teacher\'s aides?',
    answer: 'Substitute teachers generally don\'t qualify unless you\'re a long-term substitute for at least one complete academic year as a highly qualified teacher. Teacher\'s aides and paraprofessionals are not eligible.'
  },
  {
    question: 'Is the forgiven amount taxable?',
    answer: 'Under current law, Teacher Loan Forgiveness is generally taxable as income in the year it\'s forgiven. You may owe federal and state income taxes on the forgiven amount. Consult a tax professional for your specific situation.'
  },
  {
    question: 'When should I apply?',
    answer: 'Apply after you\'ve completed your 5th consecutive year of qualifying teaching service. You don\'t need to wait until you\'ve left teaching—you can apply while still employed as a teacher.'
  },
  {
    question: 'How do I find out if my school qualifies?',
    answer: 'Use the Teacher Cancellation Low Income (TCLI) Directory at studentaid.gov. Search by school name or location. The directory is updated annually, so check it each year you\'re teaching.'
  }
]

const applicationSteps = [
  {
    step: 1,
    title: 'Verify Your School Qualifies',
    description: 'Search the Teacher Cancellation Low Income Directory to confirm your school is listed for each year you taught there.',
    link: 'https://studentaid.gov/tcli/'
  },
  {
    step: 2,
    title: 'Complete 5 Consecutive Years',
    description: 'Ensure you\'ve completed 5 full, consecutive academic years as a full-time, highly qualified teacher.'
  },
  {
    step: 3,
    title: 'Download the Application',
    description: 'Get the Teacher Loan Forgiveness Application from studentaid.gov or your loan servicer.',
    link: 'https://studentaid.gov/sites/default/files/teacher-loan-forgiveness.pdf'
  },
  {
    step: 4,
    title: 'Get Employer Certification',
    description: 'Have the chief administrative officer at your school (or each school where you taught) certify your employment.'
  },
  {
    step: 5,
    title: 'Submit to Your Servicer',
    description: 'Send the completed application to your loan servicer. They\'ll process your request and apply the forgiveness.'
  }
]

export default function TeacherForgivenessPage() {
  const [expandedReq, setExpandedReq] = useState<number | null>(0)
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
              <span className="text-gray-600">Teacher Loan Forgiveness</span>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#162e51] to-[#1a4480] text-white py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-7 h-7" />
                </div>
                <span className="text-[#73b3e7] font-semibold">Federal Forgiveness Program</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Teacher Loan Forgiveness
              </h1>
              <p className="text-xl text-blue-100 mb-6">
                Earn up to $17,500 in student loan forgiveness for teaching 5 consecutive 
                years at a low-income elementary or secondary school.
              </p>
              <div className="flex flex-wrap gap-4">
                <a 
                  href="https://studentaid.gov/manage-loans/forgiveness-cancellation/teacher"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#00bde3] hover:bg-[#00a5c9] text-white font-semibold px-6 py-3 rounded-md transition-colors"
                >
                  <ExternalLink className="w-5 h-5" />
                  Official Program Information
                </a>
                <a 
                  href="https://studentaid.gov/tcli/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-md transition-colors"
                >
                  <MapPin className="w-5 h-5" />
                  Find Qualifying Schools
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
                <div className="text-3xl font-bold text-[#005ea2]">$17,500</div>
                <div className="text-sm text-gray-600">Maximum Forgiveness</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#005ea2]">5</div>
                <div className="text-sm text-gray-600">Years of Teaching</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#005ea2]">$5,000</div>
                <div className="text-sm text-gray-600">Standard Amount</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#005ea2]">Direct</div>
                <div className="text-sm text-gray-600">& FFEL Loans</div>
              </div>
            </div>
          </div>
        </section>

        {/* Forgiveness Amounts */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">How Much Can You Get?</h2>
            <p className="text-gray-600 mb-8">
              The amount forgiven depends on your teaching subject area.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {forgivenessAmounts.map((amount) => (
                <div 
                  key={amount.category}
                  className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden"
                >
                  <div className={`${amount.color} text-white p-6`}>
                    <h3 className="text-lg font-semibold mb-1">{amount.category}</h3>
                    <div className="text-4xl font-bold">{amount.amount}</div>
                  </div>
                  <div className="p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Qualifying Subjects:</h4>
                    <ul className="space-y-2 mb-6">
                      {amount.subjects.map((subject, i) => (
                        <li key={i} className="flex items-center gap-2 text-gray-700">
                          <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                          {subject}
                        </li>
                      ))}
                    </ul>
                    <h4 className="font-semibold text-gray-900 mb-3">Requirements:</h4>
                    <ul className="space-y-2">
                      {amount.requirements.map((req, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="text-gray-400 mt-1">•</span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Eligibility Requirements */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Eligibility Requirements</h2>
            <p className="text-gray-600 mb-8">
              You must meet ALL of these requirements to qualify for Teacher Loan Forgiveness.
            </p>

            <div className="space-y-4">
              {eligibilityRequirements.map((req, index) => (
                <div 
                  key={index}
                  className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedReq(expandedReq === index ? null : index)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-100 transition-colors"
                    aria-expanded={expandedReq === index}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#005ea2] text-white rounded-lg flex items-center justify-center">
                        {req.icon}
                      </div>
                      <div className="text-left">
                        <h3 className="font-bold text-gray-900">{req.title}</h3>
                        <p className="text-sm text-gray-600">{req.description}</p>
                      </div>
                    </div>
                    {expandedReq === index ? (
                      <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                    )}
                  </button>
                  
                  {expandedReq === index && (
                    <div className="px-6 pb-6 border-t border-gray-200 bg-white">
                      <ul className="mt-4 space-y-2">
                        {req.details.map((detail, i) => (
                          <li key={i} className="flex items-start gap-2 text-gray-700">
                            <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Important Note */}
            <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-yellow-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Important: Loan Disbursement Date</h4>
                  <p className="text-gray-700 text-sm">
                    You must NOT have had any outstanding balance on a Direct Loan or FFEL Program loan 
                    as of October 1, 1998, or on the date you obtained a loan after October 1, 1998. 
                    This ensures the program is for newer borrowers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How to Apply */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">How to Apply</h2>
            <p className="text-gray-600 mb-8">
              Follow these steps after completing your 5th consecutive year of qualifying teaching.
            </p>

            <div className="max-w-3xl">
              <div className="space-y-6">
                {applicationSteps.map((step) => (
                  <div key={step.step} className="flex gap-4">
                    <div className="w-10 h-10 bg-[#005ea2] text-white rounded-full flex items-center justify-center font-bold shrink-0">
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-1">{step.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">{step.description}</p>
                      {step.link && (
                        <a 
                          href={step.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[#005ea2] hover:underline text-sm font-medium"
                        >
                          Access this resource <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Teacher vs PSLF Comparison */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Teacher Forgiveness vs. PSLF</h2>
            <p className="text-gray-600 mb-8">
              Compare your options to maximize your loan forgiveness.
            </p>

            <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Feature</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Teacher Loan Forgiveness</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">PSLF</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">Time Required</td>
                      <td className="px-6 py-4 text-sm text-gray-600">5 consecutive years</td>
                      <td className="px-6 py-4 text-sm text-gray-600">10 years (120 payments)</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">Forgiveness Amount</td>
                      <td className="px-6 py-4 text-sm text-gray-600">Up to $17,500</td>
                      <td className="px-6 py-4 text-sm text-gray-600">100% of remaining balance</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">Eligible Loans</td>
                      <td className="px-6 py-4 text-sm text-gray-600">Direct & FFEL Loans</td>
                      <td className="px-6 py-4 text-sm text-gray-600">Direct Loans only</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">Repayment Plan</td>
                      <td className="px-6 py-4 text-sm text-gray-600">Any plan</td>
                      <td className="px-6 py-4 text-sm text-gray-600">IDR or 10-Year Standard</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">Tax on Forgiveness</td>
                      <td className="px-6 py-4 text-sm text-gray-600">Generally taxable</td>
                      <td className="px-6 py-4 text-sm text-gray-600">Tax-free</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">Can Combine?</td>
                      <td className="px-6 py-4 text-sm text-gray-600" colSpan={2}>
                        Yes, but not for same years of service
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6 p-6 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-start gap-3">
                <Info className="w-6 h-6 text-[#005ea2] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Strategy: Combine Both Programs</h4>
                  <p className="text-gray-700 text-sm">
                    If you have large loans and plan to teach long-term, consider using 5 years for 
                    Teacher Loan Forgiveness first, then continuing for 10 more years toward PSLF 
                    for any remaining balance. This can maximize your total forgiveness.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h2>
            <p className="text-gray-600 mb-8">
              Common questions about Teacher Loan Forgiveness.
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
              Ready to Apply for Teacher Loan Forgiveness?
            </h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              First verify your school qualifies, then download the application form 
              and have your employer certify your service.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="https://studentaid.gov/tcli/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-[#005ea2] hover:bg-gray-100 font-semibold px-6 py-3 rounded-md transition-colors"
              >
                <MapPin className="w-5 h-5" />
                Find Qualifying Schools
              </a>
              <a 
                href="https://studentaid.gov/sites/default/files/teacher-loan-forgiveness.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#00bde3] hover:bg-[#00a5c9] text-white font-semibold px-6 py-3 rounded-md transition-colors"
              >
                <Download className="w-5 h-5" />
                Download Application
              </a>
            </div>
          </div>
        </section>

        {/* Navigation Footer */}
        <section className="py-8 bg-white border-t">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <Link 
                href="/manage-loans/forgiveness/pslf" 
                className="flex items-center gap-2 text-[#005ea2] hover:underline font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Public Service Loan Forgiveness
              </Link>
              <Link 
                href="/manage-loans/forgiveness/idr" 
                className="flex items-center gap-2 text-[#005ea2] hover:underline font-medium"
              >
                IDR Forgiveness
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
