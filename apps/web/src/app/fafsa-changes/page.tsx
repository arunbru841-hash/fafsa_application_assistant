'use client'

import Link from 'next/link'
import { ArrowRight, CheckCircle, XCircle, RefreshCw, Users, Calculator, FileText, Shield, Clock, TrendingUp, AlertTriangle, Info, Star, Zap, Lock, Database, GraduationCap, DollarSign, ChevronDown, ChevronUp, ExternalLink, HelpCircle } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useState } from 'react'

export default function FAFSAChangesPage() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary-darker text-white py-12 lg:py-16">
          <div className="container-custom">
            <nav className="text-sm mb-6">
              <ol className="flex items-center gap-2 text-gray-300">
                <li><Link href="/" className="hover:text-white">Home</Link></li>
                <li>/</li>
                <li><Link href="/application/getting-started" className="hover:text-white">Apply for Aid</Link></li>
                <li>/</li>
                <li className="text-white font-medium">FAFSA Changes</li>
              </ol>
            </nav>
            
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 bg-accent-cool/20 border border-accent-cool/40 rounded-full px-4 py-1.5 mb-6">
                <RefreshCw className="w-4 h-4 text-accent-cool" />
                <span className="text-accent-cool font-semibold text-sm">FAFSA Simplification Act</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-bold mb-6">
                What's New with the FAFSA<sup>®</sup>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed mb-6">
                The FAFSA form has undergone significant changes due to the FAFSA Simplification Act. Learn about the new features, updated formulas, and what these changes mean for students and families.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/application/getting-started"
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-bold rounded hover:bg-primary-dark transition-colors"
                >
                  Start Your FAFSA
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <a 
                  href="#key-changes"
                  className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white font-bold rounded hover:bg-white hover:text-primary-darker transition-colors"
                >
                  View Key Changes
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Overview Cards */}
        <section className="py-12 lg:py-16 bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary-darker mb-4">
                At a Glance: Major FAFSA Updates
              </h2>
              <p className="text-lg text-base-dark max-w-3xl mx-auto">
                These changes are designed to simplify the application process and expand access to federal student aid.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-green-500">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-bold text-primary-darker text-lg mb-2">Fewer Questions</h3>
                <p className="text-base-dark text-sm">
                  Reduced from 108 to approximately 36 questions for most applicants
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-primary">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Calculator className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-primary-darker text-lg mb-2">New SAI Formula</h3>
                <p className="text-base-dark text-sm">
                  Student Aid Index (SAI) replaces Expected Family Contribution (EFC)
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-purple-500">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Database className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-bold text-primary-darker text-lg mb-2">IRS Direct Data</h3>
                <p className="text-base-dark text-sm">
                  Tax information automatically transferred from the IRS
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-accent-cool">
                <div className="w-12 h-12 bg-accent-cool/10 rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-accent-cool-dark" />
                </div>
                <h3 className="font-bold text-primary-darker text-lg mb-2">More Pell Eligibility</h3>
                <p className="text-base-dark text-sm">
                  Expanded eligibility for Federal Pell Grants
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Key Changes Section */}
        <section id="key-changes" className="py-12 lg:py-16">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-primary-darker mb-8 text-center">
                Key Changes Explained
              </h2>
              
              {/* Change 1: SAI */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6 overflow-hidden">
                <button
                  onClick={() => toggleSection('sai')}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Calculator className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-primary-darker text-lg">Student Aid Index (SAI) Replaces EFC</h3>
                      <p className="text-base-dark text-sm">New formula for determining financial need</p>
                    </div>
                  </div>
                  {expandedSection === 'sai' ? (
                    <ChevronUp className="w-6 h-6 text-primary flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-primary flex-shrink-0" />
                  )}
                </button>
                {expandedSection === 'sai' && (
                  <div className="px-6 pb-6 border-t border-gray-100 pt-4">
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div className="bg-red-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <XCircle className="w-5 h-5 text-red-600" />
                          <span className="font-bold text-red-700">Old: Expected Family Contribution (EFC)</span>
                        </div>
                        <ul className="space-y-2 text-sm text-base-dark">
                          <li>• Minimum value of $0</li>
                          <li>• Often misunderstood as what families must pay</li>
                          <li>• Complex calculation methodology</li>
                          <li>• Limited number of students in college consideration</li>
                        </ul>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="font-bold text-green-700">New: Student Aid Index (SAI)</span>
                        </div>
                        <ul className="space-y-2 text-sm text-base-dark">
                          <li>• Can go as low as -$1,500</li>
                          <li>• Clearly defined as an eligibility index, not payment amount</li>
                          <li>• Simplified calculation</li>
                          <li>• Better reflects true financial need</li>
                        </ul>
                      </div>
                    </div>
                    <div className="bg-primary-lighter/30 rounded-lg p-4">
                      <p className="text-sm text-base-dark">
                        <strong>What this means for you:</strong> The SAI is not a dollar amount that you're expected to pay. 
                        It's an eligibility index number that colleges use to determine your financial aid package. 
                        A negative SAI indicates higher financial need and may qualify you for the maximum Pell Grant.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Change 2: Contributors */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6 overflow-hidden">
                <button
                  onClick={() => toggleSection('contributors')}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-primary-darker text-lg">New "Contributor" Concept</h3>
                      <p className="text-base-dark text-sm">Multiple people may need to provide information</p>
                    </div>
                  </div>
                  {expandedSection === 'contributors' ? (
                    <ChevronUp className="w-6 h-6 text-primary flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-primary flex-shrink-0" />
                  )}
                </button>
                {expandedSection === 'contributors' && (
                  <div className="px-6 pb-6 border-t border-gray-100 pt-4">
                    <p className="text-base-dark mb-4">
                      A <strong>contributor</strong> is anyone required to provide information on the FAFSA form. Each contributor needs their own StudentAid.gov account and must provide consent for the IRS to transfer their tax information.
                    </p>
                    
                    <h4 className="font-bold text-primary-darker mb-3">Who might be a contributor?</h4>
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h5 className="font-semibold text-primary-darker mb-2">Always a Contributor:</h5>
                        <ul className="space-y-1 text-sm text-base-dark">
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                            <span>The student (you)</span>
                          </li>
                        </ul>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h5 className="font-semibold text-primary-darker mb-2">May Be Contributors:</h5>
                        <ul className="space-y-1 text-sm text-base-dark">
                          <li className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-purple-600 flex-shrink-0" />
                            <span>Biological or adoptive parent(s)</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-purple-600 flex-shrink-0" />
                            <span>Stepparent</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-purple-600 flex-shrink-0" />
                            <span>Student's spouse</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="bg-warning-light border border-warning rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-warning-dark flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-warning-dark mb-1">Important!</p>
                          <p className="text-sm text-base-dark">
                            All contributors must create a StudentAid.gov account <strong>before</strong> starting the FAFSA. Each contributor completes their own section independently and must provide consent and approval for IRS data transfer.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Change 3: IRS Direct Data Exchange */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6 overflow-hidden">
                <button
                  onClick={() => toggleSection('irs')}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Database className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-primary-darker text-lg">Direct IRS Data Transfer</h3>
                      <p className="text-base-dark text-sm">Automatic, secure tax information import</p>
                    </div>
                  </div>
                  {expandedSection === 'irs' ? (
                    <ChevronUp className="w-6 h-6 text-primary flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-primary flex-shrink-0" />
                  )}
                </button>
                {expandedSection === 'irs' && (
                  <div className="px-6 pb-6 border-t border-gray-100 pt-4">
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div className="bg-red-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <XCircle className="w-5 h-5 text-red-600" />
                          <span className="font-bold text-red-700">Old Method</span>
                        </div>
                        <ul className="space-y-2 text-sm text-base-dark">
                          <li>• IRS Data Retrieval Tool (DRT) was optional</li>
                          <li>• Manual data entry was allowed</li>
                          <li>• Higher risk of errors</li>
                          <li>• More verification issues</li>
                        </ul>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="font-bold text-green-700">New Method</span>
                        </div>
                        <ul className="space-y-2 text-sm text-base-dark">
                          <li>• FUTURE Act Direct Data Exchange (FA-DDX)</li>
                          <li>• Automatic transfer with consent</li>
                          <li>• Reduced errors and verification</li>
                          <li>• Tax data not visible to applicants</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Lock className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-secondary mb-1">Consent is Required</p>
                          <p className="text-sm text-base-dark">
                            All contributors must provide consent and approval for the IRS data transfer. If any contributor refuses consent, the student will <strong>not be eligible</strong> for federal student aid—even if they manually enter tax information.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Change 4: Pell Grant Changes */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6 overflow-hidden">
                <button
                  onClick={() => toggleSection('pell')}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-accent-cool/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <DollarSign className="w-6 h-6 text-accent-cool-dark" />
                    </div>
                    <div>
                      <h3 className="font-bold text-primary-darker text-lg">Expanded Pell Grant Eligibility</h3>
                      <p className="text-base-dark text-sm">More students qualify for free money</p>
                    </div>
                  </div>
                  {expandedSection === 'pell' ? (
                    <ChevronUp className="w-6 h-6 text-primary flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-primary flex-shrink-0" />
                  )}
                </button>
                {expandedSection === 'pell' && (
                  <div className="px-6 pb-6 border-t border-gray-100 pt-4">
                    <p className="text-base-dark mb-4">
                      The new Pell Grant eligibility formula is primarily based on family size and federal poverty level, making it easier to determine eligibility and expanding access to more students.
                    </p>
                    
                    <h4 className="font-bold text-primary-darker mb-3">New Pell Grant Tiers</h4>
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center gap-4 bg-green-50 rounded-lg p-4">
                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                          MAX
                        </div>
                        <div>
                          <h5 className="font-bold text-green-700">Maximum Pell Grant</h5>
                          <p className="text-sm text-base-dark">
                            For families with adjusted gross income (AGI) at or below 175% of the federal poverty level, 
                            or who received means-tested benefits (SNAP, SSI, Medicaid, TANF)
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 bg-blue-50 rounded-lg p-4">
                        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          SLIDING
                        </div>
                        <div>
                          <h5 className="font-bold text-blue-700">Sliding Scale</h5>
                          <p className="text-sm text-base-dark">
                            For families between 175% and 275% of federal poverty level, Pell amount decreases on a sliding scale
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 bg-purple-50 rounded-lg p-4">
                        <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          MIN
                        </div>
                        <div>
                          <h5 className="font-bold text-purple-700">Minimum Pell Grant</h5>
                          <p className="text-sm text-base-dark">
                            Students may still qualify for a minimum Pell Grant based on SAI and cost of attendance
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-primary-lighter/30 rounded-lg p-4">
                      <p className="text-sm text-base-dark">
                        <strong>Good news:</strong> The maximum Pell Grant for 2025-26 is $7,395 and typically increases each year. 
                        Approximately 1.5 million additional students are expected to qualify for Pell Grants under the new formula.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Change 5: Number in College */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6 overflow-hidden">
                <button
                  onClick={() => toggleSection('siblings')}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-primary-darker text-lg">Sibling Discount Eliminated</h3>
                      <p className="text-base-dark text-sm">Number in college no longer reduces SAI</p>
                    </div>
                  </div>
                  {expandedSection === 'siblings' ? (
                    <ChevronUp className="w-6 h-6 text-primary flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-primary flex-shrink-0" />
                  )}
                </button>
                {expandedSection === 'siblings' && (
                  <div className="px-6 pb-6 border-t border-gray-100 pt-4">
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div className="bg-red-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <XCircle className="w-5 h-5 text-red-600" />
                          <span className="font-bold text-red-700">Old Formula</span>
                        </div>
                        <p className="text-sm text-base-dark">
                          The EFC was divided by the number of family members in college, significantly reducing the amount each student was expected to contribute.
                        </p>
                      </div>
                      <div className="bg-yellow-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <AlertTriangle className="w-5 h-5 text-yellow-600" />
                          <span className="font-bold text-yellow-700">New Formula</span>
                        </div>
                        <p className="text-sm text-base-dark">
                          The number of family members in college is no longer factored into the SAI calculation for federal aid purposes.
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-primary-lighter/30 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-primary-darker mb-1">What This Means</p>
                          <p className="text-sm text-base-dark">
                            Families with multiple children in college simultaneously may see a higher SAI than under the old formula. 
                            However, colleges may still consider this factor when awarding institutional aid. Check with your school's 
                            financial aid office about their policies.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Change 6: Simplified Form */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6 overflow-hidden">
                <button
                  onClick={() => toggleSection('simplified')}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Zap className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-primary-darker text-lg">Simplified Application</h3>
                      <p className="text-base-dark text-sm">Fewer questions, faster completion</p>
                    </div>
                  </div>
                  {expandedSection === 'simplified' ? (
                    <ChevronUp className="w-6 h-6 text-primary flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-primary flex-shrink-0" />
                  )}
                </button>
                {expandedSection === 'simplified' && (
                  <div className="px-6 pb-6 border-t border-gray-100 pt-4">
                    <div className="flex items-center justify-center gap-8 mb-6">
                      <div className="text-center">
                        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-2">
                          <span className="text-3xl font-bold text-red-600">108</span>
                        </div>
                        <p className="text-sm text-base-dark">Old Questions</p>
                      </div>
                      <ArrowRight className="w-8 h-8 text-gray-400" />
                      <div className="text-center">
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-2">
                          <span className="text-3xl font-bold text-green-600">~36</span>
                        </div>
                        <p className="text-sm text-base-dark">New Questions</p>
                      </div>
                    </div>
                    
                    <h4 className="font-bold text-primary-darker mb-3">What's Simplified?</h4>
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-base-dark">Tax information automatically imported from IRS (no manual entry)</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-base-dark">Fewer asset questions for most families</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-base-dark">Streamlined dependency status questions</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-base-dark">Mobile-friendly design</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-base-dark">Available in multiple languages</span>
                      </li>
                    </ul>
                    
                    <div className="bg-accent-cool/10 rounded-lg p-4">
                      <p className="text-sm text-base-dark">
                        <strong>Completion time:</strong> Most students can complete the FAFSA in about 30 minutes or less with their documents ready. 
                        The new form is designed to be completed on a smartphone as easily as on a computer.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-12 lg:py-16 bg-gray-50">
          <div className="container-custom">
            <h2 className="text-3xl font-bold text-primary-darker mb-8 text-center">
              Before & After Comparison
            </h2>
            
            <div className="max-w-4xl mx-auto overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
                <thead className="bg-primary-darker text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Feature</th>
                    <th className="px-6 py-4 text-left font-semibold">Old FAFSA</th>
                    <th className="px-6 py-4 text-left font-semibold">New FAFSA</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="px-6 py-4 font-medium text-primary-darker">Financial Need Metric</td>
                    <td className="px-6 py-4 text-base-dark">Expected Family Contribution (EFC)</td>
                    <td className="px-6 py-4 text-green-600 font-medium">Student Aid Index (SAI)</td>
                  </tr>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <td className="px-6 py-4 font-medium text-primary-darker">Minimum Value</td>
                    <td className="px-6 py-4 text-base-dark">$0</td>
                    <td className="px-6 py-4 text-green-600 font-medium">-$1,500</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-6 py-4 font-medium text-primary-darker">Number of Questions</td>
                    <td className="px-6 py-4 text-base-dark">Up to 108</td>
                    <td className="px-6 py-4 text-green-600 font-medium">~36</td>
                  </tr>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <td className="px-6 py-4 font-medium text-primary-darker">Tax Data Entry</td>
                    <td className="px-6 py-4 text-base-dark">Manual or IRS DRT (optional)</td>
                    <td className="px-6 py-4 text-green-600 font-medium">Automatic IRS transfer (required)</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-6 py-4 font-medium text-primary-darker">Multiple Students in College</td>
                    <td className="px-6 py-4 text-base-dark">EFC divided by number</td>
                    <td className="px-6 py-4 text-orange-600 font-medium">No longer considered</td>
                  </tr>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <td className="px-6 py-4 font-medium text-primary-darker">Schools Listed</td>
                    <td className="px-6 py-4 text-base-dark">Up to 10</td>
                    <td className="px-6 py-4 text-green-600 font-medium">Up to 20</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-6 py-4 font-medium text-primary-darker">School Order Visible</td>
                    <td className="px-6 py-4 text-base-dark">Yes</td>
                    <td className="px-6 py-4 text-green-600 font-medium">No (privacy protection)</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-primary-darker">Pell Grant Formula</td>
                    <td className="px-6 py-4 text-base-dark">Based on EFC</td>
                    <td className="px-6 py-4 text-green-600 font-medium">Based on income & poverty level</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Tips for the New FAFSA */}
        <section className="py-12 lg:py-16">
          <div className="container-custom">
            <h2 className="text-3xl font-bold text-primary-darker mb-8 text-center">
              Tips for the New FAFSA
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="font-bold text-primary-darker mb-2">Create Accounts Early</h3>
                <p className="text-base-dark text-sm">
                  All contributors need a StudentAid.gov account. Create these before October 1 to avoid delays when the new FAFSA opens.
                </p>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="font-bold text-primary-darker mb-2">Gather Documents</h3>
                <p className="text-base-dark text-sm">
                  Have Social Security numbers, 2024 tax information, and bank statements ready. Even with IRS transfer, some info is needed.
                </p>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="font-bold text-primary-darker mb-2">Coordinate with Contributors</h3>
                <p className="text-base-dark text-sm">
                  Each contributor completes their section separately. Coordinate timing so everyone can complete their part promptly.
                </p>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-primary">4</span>
                </div>
                <h3 className="font-bold text-primary-darker mb-2">Provide Consent</h3>
                <p className="text-base-dark text-sm">
                  All contributors must consent to IRS data transfer. Without consent from everyone, no federal aid is available.
                </p>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-primary">5</span>
                </div>
                <h3 className="font-bold text-primary-darker mb-2">Apply Early</h3>
                <p className="text-base-dark text-sm">
                  Apply as soon as possible after October 1. Some states award aid first-come, first-served until funds run out.
                </p>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-primary">6</span>
                </div>
                <h3 className="font-bold text-primary-darker mb-2">Check Your SAI</h3>
                <p className="text-base-dark text-sm">
                  After submission, review your FAFSA Submission Summary and estimated SAI. Contact schools if you have questions about your aid.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 lg:py-16 bg-gray-50">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-primary-darker mb-8 text-center">
                Frequently Asked Questions
              </h2>
              
              <div className="space-y-4">
                {[
                  {
                    q: 'When did these FAFSA changes take effect?',
                    a: 'The FAFSA Simplification Act changes were phased in starting with the 2024-25 award year. The full implementation with all new features is now in effect for the 2025-26 and 2026-27 FAFSA forms.',
                  },
                  {
                    q: 'Will I receive more or less financial aid with the new FAFSA?',
                    a: 'It depends on your individual circumstances. Some students will qualify for more federal aid due to expanded Pell Grant eligibility and the ability for SAI to go negative. Others, particularly families with multiple children in college simultaneously, may see changes. Colleges may also adjust their institutional aid to account for the new formula.',
                  },
                  {
                    q: 'What if my parent refuses to provide consent for IRS data transfer?',
                    a: 'Unfortunately, if a required contributor refuses to provide consent and approval for the IRS data transfer, the student will not be eligible for federal student aid. This is a significant change from the old FAFSA where manual data entry was allowed.',
                  },
                  {
                    q: 'Can I still use the old FAFSA form?',
                    a: 'No. The old FAFSA form is no longer available. All applicants must use the new simplified FAFSA form with the updated features and requirements.',
                  },
                  {
                    q: 'Why was the sibling discount eliminated?',
                    a: 'Congress made this change as part of the FAFSA Simplification Act to redirect more federal aid to students from lower-income families. However, many colleges continue to consider multiple family members in college when awarding their own institutional aid.',
                  },
                ].map((faq, idx) => (
                  <div key={idx} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      className="w-full px-6 py-4 text-left flex items-start gap-3 hover:bg-gray-50 transition-colors"
                      onClick={() => toggleSection(`faq-${idx}`)}
                    >
                      <HelpCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="font-semibold text-primary-darker flex-1">{faq.q}</span>
                      {expandedSection === `faq-${idx}` ? (
                        <ChevronUp className="w-5 h-5 text-primary flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-primary flex-shrink-0" />
                      )}
                    </button>
                    {expandedSection === `faq-${idx}` && (
                      <div className="px-6 pb-4 pl-14">
                        <p className="text-base-dark">{faq.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-br from-primary-darker to-primary py-12 lg:py-16">
          <div className="container-custom text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Apply with the New FAFSA?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              The new simplified FAFSA is faster and easier than ever. Start your application today to unlock federal student aid.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/application/getting-started"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-darker font-bold rounded hover:bg-gray-100 transition-colors text-lg"
              >
                Start Your FAFSA
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link 
                href="/aid-estimator"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-bold rounded hover:bg-white hover:text-primary-darker transition-colors text-lg"
              >
                Estimate Your Aid First
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}
