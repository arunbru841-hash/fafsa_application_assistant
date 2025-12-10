import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Shield, CheckCircle, Clock, TrendingUp, Users, Award, Lock, Star, FileText, Calculator, School, HelpCircle, DollarSign, GraduationCap, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { StatsCard } from '@/components/home/StatsCard'
import { FeatureCard } from '@/components/home/FeatureCard'
import { FAFSAStepsInfographic } from '@/components/home/FAFSAStepsInfographic'
import { images } from '@/lib/images'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section - StudentAid.gov Style */}
        <section className="relative bg-primary-darker text-white">
          <div className="container-custom py-16 lg:py-24">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Content */}
              <div>
                {/* NEW Badge */}
                <div className="inline-flex items-center gap-2 bg-accent-cool/20 border border-accent-cool/40 rounded-full px-4 py-1.5 mb-6">
                  <span className="w-2 h-2 bg-accent-cool rounded-full animate-pulse"></span>
                  <span className="text-accent-cool font-semibold text-sm">2026–27 FAFSA Now Available!</span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white">
                  Free Application for Federal Student Aid
                  <span className="block text-accent-cool mt-2">(FAFSA®)</span>
                </h1>
                
                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  Complete your FAFSA to unlock grants, work-study, and loans for college or career school. It's free and takes about 30 minutes with your documents ready.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Link 
                    href="/application/getting-started"
                    className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white font-bold rounded hover:bg-primary-dark transition-colors text-lg"
                  >
                    Start FAFSA Now
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                  <Link 
                    href="/how-it-works"
                    className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-bold rounded hover:bg-white hover:text-primary-darker transition-colors text-lg"
                  >
                    Learn More
                  </Link>
                </div>
                
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-accent-cool" />
                    <span>100% Free</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-accent-cool" />
                    <span>Secure & Private</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-accent-cool" />
                    <span>~30 Minutes</span>
                  </div>
                </div>
              </div>

              {/* Right Column - FAFSA Form Card */}
              <div className="hidden lg:block">
                <div className="bg-white rounded-lg shadow-2xl p-8 text-base-darkest">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
                      <FileText className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-primary-darker">2026–27 FAFSA</h2>
                    <p className="text-base-dark mt-2">Award year: July 1, 2026 – June 30, 2027</p>
                    <p className="text-xs text-gray-500 mt-1">Uses 2024 tax information</p>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3 p-3 bg-primary-50 rounded border-l-4 border-primary">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      <span className="text-base-dark">Create StudentAid.gov account</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-primary-50 rounded border-l-4 border-primary">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      <span className="text-base-dark">Gather 2024 tax documents</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-primary-50 rounded border-l-4 border-primary">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      <span className="text-base-dark">Invite contributors (parents/spouse)</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-primary-50 rounded border-l-4 border-primary">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      <span className="text-base-dark">Complete, sign & submit</span>
                    </div>
                  </div>
                  
                  <Link 
                    href="/application/getting-started"
                    className="block w-full py-4 bg-primary text-white text-center font-bold rounded hover:bg-primary-dark transition-colors"
                  >
                    Begin Application →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Action Cards - StudentAid.gov Style */}
        <section className="py-12 bg-gray-50 border-b border-gray-200">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link href="/application/getting-started" className="group bg-white p-6 rounded-lg border-2 border-transparent hover:border-primary shadow-sm hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-accent-cool/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-accent-cool transition-colors">
                  <FileText className="w-6 h-6 text-accent-cool-darker group-hover:text-white" />
                </div>
                <h3 className="text-lg font-bold text-primary-darker mb-2">Start 2026–27 FAFSA</h3>
                <p className="text-base-dark text-sm">Apply for the upcoming award year</p>
              </Link>
              
              <Link href="/fsa-id" className="group bg-white p-6 rounded-lg border-2 border-transparent hover:border-primary shadow-sm hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-primary-lighter rounded-full flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                  <Lock className="w-6 h-6 text-primary group-hover:text-white" />
                </div>
                <h3 className="text-lg font-bold text-primary-darker mb-2">Create Account</h3>
                <p className="text-base-dark text-sm">StudentAid.gov account required</p>
              </Link>
              
              <Link href="/aid-estimator" className="group bg-white p-6 rounded-lg border-2 border-transparent hover:border-primary shadow-sm hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-primary-lighter rounded-full flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                  <Calculator className="w-6 h-6 text-primary group-hover:text-white" />
                </div>
                <h3 className="text-lg font-bold text-primary-darker mb-2">Estimate Aid</h3>
                <p className="text-base-dark text-sm">See how much aid you may receive</p>
              </Link>
              
              <Link href="/schools" className="group bg-white p-6 rounded-lg border-2 border-transparent hover:border-primary shadow-sm hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-primary-lighter rounded-full flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                  <School className="w-6 h-6 text-primary group-hover:text-white" />
                </div>
                <h3 className="text-lg font-bold text-primary-darker mb-2">Find Schools</h3>
                <p className="text-base-dark text-sm">Search colleges and universities</p>
              </Link>
            </div>
          </div>
        </section>

        {/* Types of Aid Section - StudentAid.gov Style */}
        <section className="py-16 bg-white">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary-darker mb-4">
                Types of Federal Student Aid
              </h2>
              <p className="text-lg text-base-dark max-w-3xl mx-auto">
                The FAFSA determines your eligibility for federal grants, work-study programs, and loans to help pay for college.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-primary-50 p-8 rounded-xl">
              <div className="text-center p-8 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow bg-white">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-primary-darker mb-3">Federal Pell Grant</h3>
                <p className="text-base-dark mb-4">
                  Free money for undergraduates with financial need. No repayment required. Up to 12 terms of eligibility.
                </p>
                <p className="text-2xl font-bold text-primary">Up to $7,395</p>
                <p className="text-xs text-gray-500 mt-1">2025–26 award year maximum</p>
              </div>
              
              <div className="text-center p-8 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow bg-white">
                <div className="w-16 h-16 bg-accent-cool-darker rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-primary-darker mb-3">Federal Work-Study</h3>
                <p className="text-base-dark mb-4">
                  Part-time employment for students with financial need. Earn money while gaining work experience.
                </p>
                <p className="text-2xl font-bold text-accent-cool-darker">Earn While Learning</p>
                <p className="text-xs text-gray-500 mt-1">On-campus or community service jobs</p>
              </div>
              
              <div className="text-center p-8 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow bg-white">
                <div className="w-16 h-16 bg-warning-dark rounded-full flex items-center justify-center mx-auto mb-6">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-primary-darker mb-3">Federal Student Loans</h3>
                <p className="text-base-dark mb-4">
                  Direct Subsidized & Unsubsidized loans with fixed interest rates. Various repayment plans available.
                </p>
                <p className="text-2xl font-bold text-warning-dark">Fixed Low Rates</p>
                <p className="text-xs text-gray-500 mt-1">Income-driven repayment options</p>
              </div>
            </div>
          </div>
        </section>

        {/* Important Dates Section - StudentAid.gov Style */}
        <section className="py-16 bg-primary-darker text-white">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-white">
                Important FAFSA Deadlines
              </h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Don't miss your opportunity for financial aid. Submit your FAFSA as soon as possible.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur rounded-lg p-6 text-center border border-white/20">
                <div className="text-accent-cool text-sm font-bold uppercase tracking-wider mb-2">2026–27 Federal Deadline</div>
                <div className="text-3xl font-bold mb-2">June 30, 2027</div>
                <p className="text-gray-300 text-sm">Award year: July 1, 2026 – June 30, 2027</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur rounded-lg p-6 text-center border border-white/20">
                <div className="text-accent-cool text-sm font-bold uppercase tracking-wider mb-2">2025–26 Still Available</div>
                <div className="text-3xl font-bold mb-2">June 30, 2026</div>
                <p className="text-gray-300 text-sm">Award year: July 1, 2025 – June 30, 2026</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur rounded-lg p-6 text-center border border-white/20">
                <div className="text-accent-cool text-sm font-bold uppercase tracking-wider mb-2">State Priority Deadlines</div>
                <div className="text-3xl font-bold mb-2">As Early as ASAP</div>
                <p className="text-gray-300 text-sm">Many states have early priority dates</p>
              </div>
            </div>
            
            <div className="text-center mt-10">
              <Link 
                href="/deadlines"
                className="inline-flex items-center text-accent-cool hover:text-white font-bold transition-colors"
              >
                View All State Deadlines
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works Section - StudentAid.gov Style */}
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary-darker mb-4">
                How to Complete the FAFSA
              </h2>
              <p className="text-lg text-base-dark max-w-3xl mx-auto">
                Follow these simple steps to complete your Free Application for Federal Student Aid.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="relative">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">1</div>
                <h3 className="text-lg font-bold text-primary-darker mb-2">Create Account</h3>
                <p className="text-base-dark text-sm">
                  Create your StudentAid.gov account. All contributors (parents, spouse) need their own accounts.
                </p>
                <div className="hidden md:block absolute top-6 left-16 w-full h-0.5 bg-primary-light"></div>
              </div>
              
              <div className="relative">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">2</div>
                <h3 className="text-lg font-bold text-primary-darker mb-2">Gather 2024 Taxes</h3>
                <p className="text-base-dark text-sm">
                  Have 2024 tax returns, bank statements, and investment info ready for you and contributors.
                </p>
                <div className="hidden md:block absolute top-6 left-16 w-full h-0.5 bg-primary-light"></div>
              </div>
              
              <div className="relative">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">3</div>
                <h3 className="text-lg font-bold text-primary-darker mb-2">Complete & Consent</h3>
                <p className="text-base-dark text-sm">
                  Fill out your section. All contributors must consent to IRS data transfer. This is required.
                </p>
                <div className="hidden md:block absolute top-6 left-16 w-full h-0.5 bg-primary-light"></div>
              </div>
              
              <div className="relative">
                <div className="w-12 h-12 bg-accent-cool text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">4</div>
                <h3 className="text-lg font-bold text-primary-darker mb-2">Sign & Submit</h3>
                <p className="text-base-dark text-sm">
                  Review your SAI estimate, sign electronically, and submit. Schools receive results automatically.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section - StudentAid.gov Style */}
        <section className="py-16 bg-white">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary-darker mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-base-dark max-w-3xl mx-auto">
                Get answers to the most common questions about the FAFSA.
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              <details className="group border border-gray-200 rounded-lg bg-white">
                <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50">
                  <span className="font-bold text-primary-darker">Who should fill out the FAFSA?</span>
                  <HelpCircle className="w-5 h-5 text-primary group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-6 pb-6 text-base-dark">
                  Anyone seeking federal student aid should complete the FAFSA, including high school seniors, current college students, and graduate students. You must reapply every year you're in school to maintain eligibility.
                </div>
              </details>
              
              <details className="group border border-gray-200 rounded-lg bg-white">
                <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50">
                  <span className="font-bold text-primary-darker">What is a FAFSA contributor?</span>
                  <HelpCircle className="w-5 h-5 text-primary group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-6 pb-6 text-base-dark">
                  A contributor is anyone required to provide information on your FAFSA—typically you, your spouse (if married), or your parent(s) if you're a dependent student. Each contributor needs their own StudentAid.gov account and must consent to have their tax information transferred from the IRS.
                </div>
              </details>
              
              <details className="group border border-gray-200 rounded-lg bg-white">
                <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50">
                  <span className="font-bold text-primary-darker">What is the Student Aid Index (SAI)?</span>
                  <HelpCircle className="w-5 h-5 text-primary group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-6 pb-6 text-base-dark">
                  The SAI replaced the Expected Family Contribution (EFC). It's a number calculated from your FAFSA information that schools use to determine your financial need. Your financial need = Cost of Attendance (COA) minus your SAI.
                </div>
              </details>
              
              <details className="group border border-gray-200 rounded-lg bg-white">
                <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50">
                  <span className="font-bold text-primary-darker">What documents do I need for 2026–27?</span>
                  <HelpCircle className="w-5 h-5 text-primary group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-6 pb-6 text-base-dark">
                  For the 2026–27 FAFSA, you'll need 2024 tax returns, records of child support received, current bank account balances, and net worth of investments. Your tax information will be automatically transferred from the IRS once you provide consent.
                </div>
              </details>
              
              <details className="group border border-gray-200 rounded-lg bg-white">
                <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50">
                  <span className="font-bold text-primary-darker">How long does it take to complete?</span>
                  <HelpCircle className="w-5 h-5 text-primary group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-6 pb-6 text-base-dark">
                  With your documents ready, you can complete your section in about 30 minutes. Remember that all contributors must also complete their sections—you can complete yours first, then invite your contributors.
                </div>
              </details>
            </div>
          </div>
        </section>

        {/* NEW: Important Contributors Section */}
        <section className="py-16 bg-gradient-to-br from-accent-cool-lighter to-white border-y border-accent-cool-light">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-accent-cool/20 rounded-full px-4 py-1.5 mb-4">
                  <Users className="w-4 h-4 text-accent-cool-darker" />
                  <span className="text-accent-cool-darker font-semibold text-sm">New for FAFSA</span>
                </div>
                <h2 className="text-3xl font-bold text-primary-darker mb-4">
                  Understanding FAFSA Contributors
                </h2>
                <p className="text-lg text-base-dark mb-6">
                  The simplified FAFSA uses a contributor model. <strong>All contributors must provide consent for IRS data transfer</strong>—this is required for federal aid eligibility.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-primary-darker">Student (You)</h4>
                      <p className="text-sm text-base-dark">Always a contributor. Complete your section first.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-primary-darker">Parent(s)</h4>
                      <p className="text-sm text-base-dark">Required if you're a dependent student. Biological, adoptive, or stepparent may apply.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-primary-darker">Spouse</h4>
                      <p className="text-sm text-base-dark">Required if married and didn't file taxes jointly with current spouse.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 text-secondary" />
                  </div>
                  <h3 className="text-xl font-bold text-primary-darker">Critical Requirement</h3>
                </div>
                
                <div className="bg-secondary-lighter/50 border-l-4 border-secondary p-4 rounded-r-lg mb-6">
                  <p className="text-base-dark font-medium">
                    <strong>All contributors must consent</strong> to have their federal tax information transferred from the IRS into the FAFSA form.
                  </p>
                </div>
                
                <p className="text-base-dark mb-6">
                  If any required contributor doesn't provide consent, you (the student) <strong>will not be eligible for federal student aid</strong>—even if they manually enter tax information.
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span className="text-base-dark">Each contributor needs a StudentAid.gov account</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span className="text-base-dark">Tax info is transferred securely from IRS</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span className="text-base-dark">Contributors without SSN can still participate</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Resources Section - StudentAid.gov Style */}
        <section className="py-16 bg-gray-50 border-y border-gray-200">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary-darker mb-4">
                Resources & Tools
              </h2>
              <p className="text-lg text-base-dark max-w-3xl mx-auto">
                Everything you need to understand and complete your financial aid application.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link href="/fafsa-guide" className="bg-white p-6 rounded-lg border border-gray-200 hover:border-primary hover:shadow-lg transition-all group">
                <FileText className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-bold text-primary-darker mb-2 group-hover:text-primary">FAFSA Guide</h3>
                <p className="text-base-dark text-sm">Complete guide to filling out your FAFSA form step by step.</p>
              </Link>
              
              <Link href="/aid-estimator" className="bg-white p-6 rounded-lg border border-gray-200 hover:border-primary hover:shadow-lg transition-all group">
                <Calculator className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-bold text-primary-darker mb-2 group-hover:text-primary">Aid Estimator</h3>
                <p className="text-base-dark text-sm">Estimate how much federal student aid you may receive.</p>
              </Link>
              
              <Link href="/loan-simulator" className="bg-white p-6 rounded-lg border border-gray-200 hover:border-primary hover:shadow-lg transition-all group">
                <TrendingUp className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-bold text-primary-darker mb-2 group-hover:text-primary">Loan Simulator</h3>
                <p className="text-base-dark text-sm">Calculate your monthly payments and explore repayment options.</p>
              </Link>
              
              <Link href="/college-search" className="bg-white p-6 rounded-lg border border-gray-200 hover:border-primary hover:shadow-lg transition-all group">
                <School className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-bold text-primary-darker mb-2 group-hover:text-primary">College Search</h3>
                <p className="text-base-dark text-sm">Find schools and compare costs, graduation rates, and more.</p>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section - StudentAid.gov Style */}
        <section className="py-16 bg-gradient-to-r from-primary-darker to-primary-dark text-white">
          <div className="container-custom text-center">
            <h2 className="text-3xl font-bold mb-4 text-white">
              Ready to Apply for the 2026–27 FAFSA?
            </h2>
            <p className="text-xl text-primary-light mb-8 max-w-2xl mx-auto">
              The 2026–27 FAFSA is now available. Complete your application today and unlock federal grants, work-study, and loans for your education.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/application/getting-started"
                className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white font-bold rounded hover:bg-primary-dark transition-colors text-lg"
              >
                Start 2026–27 FAFSA
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link 
                href="/help"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-bold rounded hover:bg-white hover:text-primary-darker transition-colors text-lg"
              >
                Get Help
              </Link>
            </div>
            <p className="mt-8 text-sm text-primary-light">
              Need assistance? Call <strong>1-800-4-FED-AID (1-800-433-3243)</strong> • TTY: 1-800-730-8913
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
