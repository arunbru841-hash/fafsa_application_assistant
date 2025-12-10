'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ArrowRight, Calculator, DollarSign, GraduationCap, Users, HelpCircle, CheckCircle, Info, AlertTriangle, TrendingUp, Award, BookOpen, Briefcase, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { EconomicDashboard } from '@/components/economic'

// 2026-27 Award Year Constants
const PELL_GRANT_MAX = 7395 // 2025-26 max, typically increases slightly each year
const PELL_GRANT_MAX_2627 = 7595 // Estimated for 2026-27
const SUBSIDIZED_LOAN_FRESHMAN = 3500
const SUBSIDIZED_LOAN_SOPHOMORE = 4500
const SUBSIDIZED_LOAN_JUNIOR_SENIOR = 5500
const UNSUBSIDIZED_LOAN_DEPENDENT_FRESHMAN = 2000
const UNSUBSIDIZED_LOAN_DEPENDENT_SOPHOMORE = 2000
const UNSUBSIDIZED_LOAN_DEPENDENT_JUNIOR_SENIOR = 2000
const UNSUBSIDIZED_LOAN_INDEPENDENT_FRESHMAN = 6000
const UNSUBSIDIZED_LOAN_INDEPENDENT_SOPHOMORE = 6000
const UNSUBSIDIZED_LOAN_INDEPENDENT_JUNIOR_SENIOR = 7000
const WORK_STUDY_TYPICAL = 2500
const FSEOG_MAX = 4000

// SAI thresholds for Pell Grant eligibility
const PELL_SAI_MAX = 6656 // Maximum SAI to receive any Pell Grant

interface EstimatorInputs {
  studentType: 'dependent' | 'independent' | ''
  yearInSchool: 'freshman' | 'sophomore' | 'junior' | 'senior' | 'graduate' | ''
  enrollmentStatus: 'full-time' | 'half-time' | 'less-than-half-time' | ''
  studentIncome: number
  parentIncome: number
  familySize: number
  numberInCollege: number
  studentAssets: number
  parentAssets: number
  costOfAttendance: number
}

interface AidEstimate {
  sai: number
  pellGrant: number
  fseog: number
  subsidizedLoan: number
  unsubsidizedLoan: number
  workStudy: number
  totalGrants: number
  totalLoans: number
  totalAid: number
  financialNeed: number
}

// Simplified SAI calculation (actual formula is much more complex)
function calculateSAI(inputs: EstimatorInputs): number {
  if (!inputs.studentType || !inputs.yearInSchool) return 0

  let sai = 0
  
  if (inputs.studentType === 'dependent') {
    // Simplified dependent student SAI calculation
    // Real formula considers many more factors
    const adjustedParentIncome = Math.max(0, inputs.parentIncome - 30000) // Income protection allowance approximation
    const parentContribution = adjustedParentIncome * 0.22 // Simplified percentage
    const assetContribution = inputs.parentAssets * 0.05 // Asset assessment rate
    
    const studentIncomeContribution = Math.max(0, inputs.studentIncome - 8500) * 0.50 // Student income assessment
    const studentAssetContribution = inputs.studentAssets * 0.20 // Student asset rate
    
    const familyContribution = parentContribution + assetContribution
    const perStudentContribution = familyContribution / Math.max(1, inputs.numberInCollege)
    
    sai = Math.round(perStudentContribution + studentIncomeContribution + studentAssetContribution)
  } else {
    // Independent student SAI calculation
    const adjustedIncome = Math.max(0, inputs.studentIncome - 15000) // Income protection approximation
    const incomeContribution = adjustedIncome * 0.25
    const assetContribution = inputs.studentAssets * 0.20
    
    sai = Math.round(incomeContribution + assetContribution)
  }
  
  // SAI can be negative (indicates high need)
  return Math.max(-1500, sai)
}

// Calculate Pell Grant based on SAI
function calculatePellGrant(sai: number, enrollmentStatus: string): number {
  if (sai > PELL_SAI_MAX) return 0
  
  // Simplified Pell calculation
  let pellAmount = 0
  
  if (sai <= 0) {
    pellAmount = PELL_GRANT_MAX_2627
  } else if (sai <= 1500) {
    pellAmount = PELL_GRANT_MAX_2627 - (sai * 0.5)
  } else if (sai <= 3000) {
    pellAmount = PELL_GRANT_MAX_2627 * 0.75 - ((sai - 1500) * 0.3)
  } else if (sai <= PELL_SAI_MAX) {
    pellAmount = Math.max(0, PELL_GRANT_MAX_2627 * 0.4 - ((sai - 3000) * 0.25))
  }
  
  // Adjust for enrollment status
  if (enrollmentStatus === 'half-time') {
    pellAmount *= 0.5
  } else if (enrollmentStatus === 'less-than-half-time') {
    pellAmount *= 0.25
  }
  
  return Math.round(Math.max(0, pellAmount))
}

function calculateAidEstimate(inputs: EstimatorInputs): AidEstimate | null {
  if (!inputs.studentType || !inputs.yearInSchool || !inputs.enrollmentStatus) {
    return null
  }
  
  const sai = calculateSAI(inputs)
  const financialNeed = Math.max(0, inputs.costOfAttendance - sai)
  
  // Calculate Pell Grant
  const pellGrant = inputs.yearInSchool !== 'graduate' 
    ? calculatePellGrant(sai, inputs.enrollmentStatus)
    : 0
  
  // FSEOG (Federal Supplemental Educational Opportunity Grant) - for exceptional need
  const fseog = sai <= 0 && inputs.yearInSchool !== 'graduate' 
    ? Math.min(FSEOG_MAX, financialNeed * 0.15) 
    : 0
  
  // Subsidized Loans (need-based)
  let subsidizedLoan = 0
  if (inputs.yearInSchool !== 'graduate' && financialNeed > 0) {
    switch (inputs.yearInSchool) {
      case 'freshman':
        subsidizedLoan = SUBSIDIZED_LOAN_FRESHMAN
        break
      case 'sophomore':
        subsidizedLoan = SUBSIDIZED_LOAN_SOPHOMORE
        break
      case 'junior':
      case 'senior':
        subsidizedLoan = SUBSIDIZED_LOAN_JUNIOR_SENIOR
        break
    }
  }
  
  // Unsubsidized Loans
  let unsubsidizedLoan = 0
  if (inputs.studentType === 'dependent') {
    switch (inputs.yearInSchool) {
      case 'freshman':
        unsubsidizedLoan = UNSUBSIDIZED_LOAN_DEPENDENT_FRESHMAN
        break
      case 'sophomore':
        unsubsidizedLoan = UNSUBSIDIZED_LOAN_DEPENDENT_SOPHOMORE
        break
      case 'junior':
      case 'senior':
        unsubsidizedLoan = UNSUBSIDIZED_LOAN_DEPENDENT_JUNIOR_SENIOR
        break
      case 'graduate':
        unsubsidizedLoan = 20500
        break
    }
  } else {
    switch (inputs.yearInSchool) {
      case 'freshman':
        unsubsidizedLoan = UNSUBSIDIZED_LOAN_INDEPENDENT_FRESHMAN
        break
      case 'sophomore':
        unsubsidizedLoan = UNSUBSIDIZED_LOAN_INDEPENDENT_SOPHOMORE
        break
      case 'junior':
      case 'senior':
        unsubsidizedLoan = UNSUBSIDIZED_LOAN_INDEPENDENT_JUNIOR_SENIOR
        break
      case 'graduate':
        unsubsidizedLoan = 20500
        break
    }
  }
  
  // Work-Study
  const workStudy = financialNeed > 0 && inputs.enrollmentStatus !== 'less-than-half-time'
    ? WORK_STUDY_TYPICAL
    : 0
  
  const totalGrants = pellGrant + fseog
  const totalLoans = subsidizedLoan + unsubsidizedLoan
  const totalAid = totalGrants + totalLoans + workStudy
  
  return {
    sai,
    pellGrant: Math.round(pellGrant),
    fseog: Math.round(fseog),
    subsidizedLoan,
    unsubsidizedLoan,
    workStudy,
    totalGrants: Math.round(totalGrants),
    totalLoans,
    totalAid: Math.round(totalAid),
    financialNeed: Math.round(financialNeed),
  }
}

export default function AidEstimatorPage() {
  const [step, setStep] = useState(1)
  const [inputs, setInputs] = useState<EstimatorInputs>({
    studentType: '',
    yearInSchool: '',
    enrollmentStatus: '',
    studentIncome: 0,
    parentIncome: 0,
    familySize: 4,
    numberInCollege: 1,
    studentAssets: 0,
    parentAssets: 0,
    costOfAttendance: 25000,
  })
  const [estimate, setEstimate] = useState<AidEstimate | null>(null)
  const [showFAQ, setShowFAQ] = useState<string | null>(null)

  const updateInput = (field: keyof EstimatorInputs, value: any) => {
    setInputs(prev => ({ ...prev, [field]: value }))
  }

  const handleCalculate = () => {
    const result = calculateAidEstimate(inputs)
    setEstimate(result)
    setStep(4)
  }

  const canProceedStep1 = inputs.studentType !== ''
  const canProceedStep2 = inputs.yearInSchool !== '' && inputs.enrollmentStatus !== ''
  const canProceedStep3 = true // Financial info has defaults

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
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
                <li className="text-white font-medium">Federal Student Aid Estimator</li>
              </ol>
            </nav>
            
            <div className="max-w-4xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-accent-cool/20 rounded-full flex items-center justify-center">
                  <Calculator className="w-8 h-8 text-accent-cool" />
                </div>
                <div>
                  <h1 className="text-4xl sm:text-5xl font-bold">
                    Federal Student Aid Estimator
                  </h1>
                  <p className="text-gray-300 mt-2">2026–27 Award Year</p>
                </div>
              </div>
              <p className="text-xl text-gray-300 leading-relaxed mb-6">
                Get an early estimate of how much federal student aid you may be eligible to receive. This tool provides estimates based on the Student Aid Index (SAI) calculation.
              </p>
              
              {/* Important Notice */}
              <div className="bg-warning/20 border border-warning/40 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-warning flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white">This Is Not the FAFSA® Form</p>
                    <p className="text-gray-300 text-sm">
                      This estimator provides estimates only. To apply for federal student aid, you must complete the <Link href="/application/getting-started" className="text-accent-cool hover:underline">FAFSA® form</Link>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Progress Bar */}
        <section className="bg-gray-100 border-b border-gray-200">
          <div className="container-custom py-4">
            <div className="flex items-center justify-between max-w-3xl mx-auto">
              {[
                { num: 1, label: 'Student Type' },
                { num: 2, label: 'Enrollment' },
                { num: 3, label: 'Finances' },
                { num: 4, label: 'Results' },
              ].map((s, idx) => (
                <div key={s.num} className="flex items-center">
                  <div className={`flex items-center gap-2 ${step >= s.num ? 'text-primary' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      step > s.num ? 'bg-green-500 text-white' :
                      step === s.num ? 'bg-primary text-white' :
                      'bg-gray-300 text-gray-600'
                    }`}>
                      {step > s.num ? <CheckCircle className="w-5 h-5" /> : s.num}
                    </div>
                    <span className="hidden sm:inline font-medium">{s.label}</span>
                  </div>
                  {idx < 3 && (
                    <div className={`w-12 sm:w-24 h-1 mx-2 rounded ${step > s.num ? 'bg-green-500' : 'bg-gray-300'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Estimator Form */}
        <section className="py-12 lg:py-16">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto">
              
              {/* Step 1: Student Type */}
              {step === 1 && (
                <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-primary-darker mb-6">
                    Step 1: What Type of Student Are You?
                  </h2>
                  
                  <div className="space-y-4 mb-8">
                    <label 
                      className={`block p-6 border-2 rounded-lg cursor-pointer transition-all ${
                        inputs.studentType === 'dependent' 
                          ? 'border-primary bg-primary/5' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="studentType"
                        value="dependent"
                        checked={inputs.studentType === 'dependent'}
                        onChange={(e) => updateInput('studentType', e.target.value)}
                        className="sr-only"
                      />
                      <div className="flex items-start gap-4">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          inputs.studentType === 'dependent' ? 'border-primary' : 'border-gray-300'
                        }`}>
                          {inputs.studentType === 'dependent' && (
                            <div className="w-3 h-3 bg-primary rounded-full" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-primary" />
                            <span className="font-bold text-primary-darker text-lg">Dependent Student</span>
                          </div>
                          <p className="text-base-dark mt-2">
                            You're under 24, unmarried, don't have dependents, and rely on your parents for financial support. You'll report parent information on your FAFSA.
                          </p>
                        </div>
                      </div>
                    </label>
                    
                    <label 
                      className={`block p-6 border-2 rounded-lg cursor-pointer transition-all ${
                        inputs.studentType === 'independent' 
                          ? 'border-primary bg-primary/5' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="studentType"
                        value="independent"
                        checked={inputs.studentType === 'independent'}
                        onChange={(e) => updateInput('studentType', e.target.value)}
                        className="sr-only"
                      />
                      <div className="flex items-start gap-4">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          inputs.studentType === 'independent' ? 'border-primary' : 'border-gray-300'
                        }`}>
                          {inputs.studentType === 'independent' && (
                            <div className="w-3 h-3 bg-primary rounded-full" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <GraduationCap className="w-5 h-5 text-primary" />
                            <span className="font-bold text-primary-darker text-lg">Independent Student</span>
                          </div>
                          <p className="text-base-dark mt-2">
                            You're 24 or older, married, a graduate student, a veteran, have dependents of your own, or meet other independence criteria. Parent information is not required.
                          </p>
                        </div>
                      </div>
                    </label>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-base-dark">
                        <strong>Not sure?</strong> Most undergraduate students under 24 are considered dependent. Check our <Link href="/application/dependency" className="text-primary hover:underline">dependency status guide</Link> for help.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button
                      onClick={() => setStep(2)}
                      disabled={!canProceedStep1}
                      className="px-8"
                    >
                      Continue
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Enrollment Information */}
              {step === 2 && (
                <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-primary-darker mb-6">
                    Step 2: Enrollment Information
                  </h2>
                  
                  <div className="space-y-6 mb-8">
                    {/* Year in School */}
                    <div>
                      <label className="block font-semibold text-primary-darker mb-3">
                        What year will you be in during 2026–27?
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {[
                          { value: 'freshman', label: 'Freshman' },
                          { value: 'sophomore', label: 'Sophomore' },
                          { value: 'junior', label: 'Junior' },
                          { value: 'senior', label: 'Senior' },
                          { value: 'graduate', label: 'Graduate' },
                        ].map(option => (
                          <label
                            key={option.value}
                            className={`p-4 border-2 rounded-lg cursor-pointer text-center transition-all ${
                              inputs.yearInSchool === option.value
                                ? 'border-primary bg-primary/5 text-primary font-semibold'
                                : 'border-gray-200 hover:border-gray-300 text-base-dark'
                            }`}
                          >
                            <input
                              type="radio"
                              name="yearInSchool"
                              value={option.value}
                              checked={inputs.yearInSchool === option.value}
                              onChange={(e) => updateInput('yearInSchool', e.target.value)}
                              className="sr-only"
                            />
                            {option.label}
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    {/* Enrollment Status */}
                    <div>
                      <label className="block font-semibold text-primary-darker mb-3">
                        What will your enrollment status be?
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                          { value: 'full-time', label: 'Full-time', desc: '12+ credits' },
                          { value: 'half-time', label: 'Half-time', desc: '6-11 credits' },
                          { value: 'less-than-half-time', label: 'Less than half-time', desc: 'Under 6 credits' },
                        ].map(option => (
                          <label
                            key={option.value}
                            className={`p-4 border-2 rounded-lg cursor-pointer text-center transition-all ${
                              inputs.enrollmentStatus === option.value
                                ? 'border-primary bg-primary/5'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name="enrollmentStatus"
                              value={option.value}
                              checked={inputs.enrollmentStatus === option.value}
                              onChange={(e) => updateInput('enrollmentStatus', e.target.value)}
                              className="sr-only"
                            />
                            <span className={`font-semibold ${inputs.enrollmentStatus === option.value ? 'text-primary' : 'text-primary-darker'}`}>
                              {option.label}
                            </span>
                            <span className="block text-sm text-base-dark mt-1">{option.desc}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    {/* Cost of Attendance */}
                    <div>
                      <label className="block font-semibold text-primary-darker mb-2">
                        Estimated Cost of Attendance (per year)
                      </label>
                      <p className="text-sm text-base-dark mb-3">
                        Include tuition, fees, room, board, books, and personal expenses.
                      </p>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <input
                          type="number"
                          value={inputs.costOfAttendance}
                          onChange={(e) => updateInput('costOfAttendance', Number(e.target.value))}
                          className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                          placeholder="25000"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Average: Community college ~$12,000 | Public university ~$25,000 | Private university ~$55,000
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setStep(1)}>
                      Back
                    </Button>
                    <Button
                      onClick={() => setStep(3)}
                      disabled={!canProceedStep2}
                    >
                      Continue
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Financial Information */}
              {step === 3 && (
                <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-primary-darker mb-6">
                    Step 3: Financial Information
                  </h2>
                  
                  <p className="text-base-dark mb-6">
                    Enter your 2024 tax year information. All fields accept whole numbers (no commas or decimals).
                  </p>
                  
                  <div className="space-y-6 mb-8">
                    {/* Student Income */}
                    <div>
                      <label className="block font-semibold text-primary-darker mb-2">
                        Student's Total Income (2024)
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <input
                          type="number"
                          value={inputs.studentIncome || ''}
                          onChange={(e) => updateInput('studentIncome', Number(e.target.value) || 0)}
                          className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                          placeholder="0"
                        />
                      </div>
                    </div>
                    
                    {/* Student Assets */}
                    <div>
                      <label className="block font-semibold text-primary-darker mb-2">
                        Student's Assets (savings, investments)
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <input
                          type="number"
                          value={inputs.studentAssets || ''}
                          onChange={(e) => updateInput('studentAssets', Number(e.target.value) || 0)}
                          className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                          placeholder="0"
                        />
                      </div>
                    </div>
                    
                    {/* Parent Information - Only for Dependent Students */}
                    {inputs.studentType === 'dependent' && (
                      <>
                        <div className="border-t border-gray-200 pt-6">
                          <h3 className="font-bold text-primary-darker mb-4 flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            Parent Information
                          </h3>
                        </div>
                        
                        <div>
                          <label className="block font-semibold text-primary-darker mb-2">
                            Parents' Total Income (2024)
                          </label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                            <input
                              type="number"
                              value={inputs.parentIncome || ''}
                              onChange={(e) => updateInput('parentIncome', Number(e.target.value) || 0)}
                              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                              placeholder="50000"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block font-semibold text-primary-darker mb-2">
                            Parents' Assets (savings, investments, not including home)
                          </label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                            <input
                              type="number"
                              value={inputs.parentAssets || ''}
                              onChange={(e) => updateInput('parentAssets', Number(e.target.value) || 0)}
                              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                              placeholder="0"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block font-semibold text-primary-darker mb-2">
                              Family Size
                            </label>
                            <input
                              type="number"
                              min="1"
                              max="20"
                              value={inputs.familySize}
                              onChange={(e) => updateInput('familySize', Number(e.target.value) || 1)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                            />
                          </div>
                          <div>
                            <label className="block font-semibold text-primary-darker mb-2">
                              Number in College
                            </label>
                            <input
                              type="number"
                              min="1"
                              max="10"
                              value={inputs.numberInCollege}
                              onChange={(e) => updateInput('numberInCollege', Number(e.target.value) || 1)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-base-dark">
                        <strong>Privacy:</strong> This estimator does not save your information. Your data is only used to calculate the estimate and is not transmitted anywhere.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setStep(2)}>
                      Back
                    </Button>
                    <Button onClick={handleCalculate}>
                      <Calculator className="mr-2 w-5 h-5" />
                      Calculate Estimate
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 4: Results */}
              {step === 4 && estimate && (
                <div>
                  {/* SAI Result */}
                  <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-8 mb-8">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-primary-darker mb-2">
                        Your Estimated Student Aid Index (SAI)
                      </h2>
                      <div className="inline-flex items-center justify-center bg-primary-lighter/30 rounded-2xl px-8 py-4">
                        <span className={`text-5xl font-bold ${estimate.sai < 0 ? 'text-green-600' : 'text-primary-darker'}`}>
                          {estimate.sai.toLocaleString()}
                        </span>
                      </div>
                      {estimate.sai < 0 && (
                        <p className="text-green-600 mt-2 font-medium">
                          A negative SAI indicates higher financial need
                        </p>
                      )}
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-base-dark mb-1">Cost of Attendance</p>
                        <p className="text-2xl font-bold text-primary-darker">{formatCurrency(inputs.costOfAttendance)}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-base-dark mb-1">Estimated Financial Need</p>
                        <p className="text-2xl font-bold text-green-600">{formatCurrency(estimate.financialNeed)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Aid Breakdown */}
                  <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-8 mb-8">
                    <h3 className="text-xl font-bold text-primary-darker mb-6 flex items-center gap-2">
                      <DollarSign className="w-6 h-6 text-primary" />
                      Estimated Federal Aid Eligibility
                    </h3>
                    
                    {/* Grants */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                        <Award className="w-5 h-5" />
                        Grants (Free Money - No Repayment)
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-3 border-b border-gray-100">
                          <div>
                            <span className="font-medium text-primary-darker">Federal Pell Grant</span>
                            <p className="text-xs text-gray-500">Based on SAI and enrollment status</p>
                          </div>
                          <span className={`font-bold text-lg ${estimate.pellGrant > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                            {formatCurrency(estimate.pellGrant)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-100">
                          <div>
                            <span className="font-medium text-primary-darker">FSEOG</span>
                            <p className="text-xs text-gray-500">For students with exceptional need</p>
                          </div>
                          <span className={`font-bold text-lg ${estimate.fseog > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                            {formatCurrency(estimate.fseog)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-3 bg-green-50 rounded-lg px-4">
                          <span className="font-bold text-green-700">Total Grants</span>
                          <span className="font-bold text-xl text-green-700">{formatCurrency(estimate.totalGrants)}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Loans */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-blue-700 mb-3 flex items-center gap-2">
                        <BookOpen className="w-5 h-5" />
                        Loans (Must Be Repaid)
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-3 border-b border-gray-100">
                          <div>
                            <span className="font-medium text-primary-darker">Direct Subsidized Loan</span>
                            <p className="text-xs text-gray-500">No interest while in school</p>
                          </div>
                          <span className="font-bold text-lg text-blue-600">
                            {formatCurrency(estimate.subsidizedLoan)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-100">
                          <div>
                            <span className="font-medium text-primary-darker">Direct Unsubsidized Loan</span>
                            <p className="text-xs text-gray-500">Interest accrues while in school</p>
                          </div>
                          <span className="font-bold text-lg text-blue-600">
                            {formatCurrency(estimate.unsubsidizedLoan)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-3 bg-blue-50 rounded-lg px-4">
                          <span className="font-bold text-blue-700">Total Loans</span>
                          <span className="font-bold text-xl text-blue-700">{formatCurrency(estimate.totalLoans)}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Work-Study */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-purple-700 mb-3 flex items-center gap-2">
                        <Briefcase className="w-5 h-5" />
                        Work-Study (Earn While You Learn)
                      </h4>
                      <div className="flex justify-between items-center py-3 bg-purple-50 rounded-lg px-4">
                        <div>
                          <span className="font-medium text-purple-700">Federal Work-Study</span>
                          <p className="text-xs text-purple-600">Part-time jobs on or off campus</p>
                        </div>
                        <span className="font-bold text-xl text-purple-700">{formatCurrency(estimate.workStudy)}</span>
                      </div>
                    </div>
                    
                    {/* Total */}
                    <div className="bg-primary-darker rounded-lg p-6 text-white">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-lg font-bold">Total Estimated Federal Aid</span>
                          <p className="text-primary-light text-sm">Grants + Loans + Work-Study</p>
                        </div>
                        <span className="text-4xl font-bold">{formatCurrency(estimate.totalAid)}</span>
                      </div>
                      <div className="mt-4 pt-4 border-t border-primary-light/30">
                        <div className="flex justify-between items-center">
                          <span className="text-primary-light">Remaining Cost After Federal Aid</span>
                          <span className="font-bold text-xl">
                            {formatCurrency(Math.max(0, inputs.costOfAttendance - estimate.totalAid))}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Important Notes */}
                  <div className="bg-warning-light border border-warning rounded-lg p-6 mb-8">
                    <h4 className="font-bold text-warning-dark mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Important Information
                    </h4>
                    <ul className="space-y-2 text-sm text-base-dark">
                      <li>• These are <strong>estimates only</strong>. Actual aid may differ based on your complete FAFSA information.</li>
                      <li>• State and institutional aid are <strong>not included</strong>. Many schools offer additional grants and scholarships.</li>
                      <li>• Federal Work-Study depends on school participation and funding availability.</li>
                      <li>• FSEOG funds are limited and awarded on a first-come, first-served basis.</li>
                      <li>• Graduate students are not eligible for Pell Grants or subsidized loans.</li>
                    </ul>
                  </div>

                  {/* Next Steps */}
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mb-8">
                    <h4 className="font-bold text-primary-darker mb-4">Next Steps</h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      <Link 
                        href="/application/getting-started"
                        className="flex flex-col items-center text-center p-4 bg-white rounded-lg border border-gray-200 hover:border-primary hover:shadow-md transition-all"
                      >
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                          <GraduationCap className="w-6 h-6 text-primary" />
                        </div>
                        <span className="font-semibold text-primary-darker">Start Your FAFSA</span>
                        <span className="text-sm text-base-dark">Apply for real aid</span>
                      </Link>
                      <Link 
                        href="/deadlines"
                        className="flex flex-col items-center text-center p-4 bg-white rounded-lg border border-gray-200 hover:border-primary hover:shadow-md transition-all"
                      >
                        <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mb-3">
                          <TrendingUp className="w-6 h-6 text-secondary" />
                        </div>
                        <span className="font-semibold text-primary-darker">Check Deadlines</span>
                        <span className="text-sm text-base-dark">Don't miss state dates</span>
                      </Link>
                      <button
                        onClick={() => {
                          setStep(1)
                          setEstimate(null)
                        }}
                        className="flex flex-col items-center text-center p-4 bg-white rounded-lg border border-gray-200 hover:border-primary hover:shadow-md transition-all"
                      >
                        <div className="w-12 h-12 bg-accent-cool/10 rounded-full flex items-center justify-center mb-3">
                          <Calculator className="w-6 h-6 text-accent-cool-dark" />
                        </div>
                        <span className="font-semibold text-primary-darker">Recalculate</span>
                        <span className="text-sm text-base-dark">Try different inputs</span>
                      </button>
                    </div>
                  </div>

                  {/* Start Over Button */}
                  <div className="text-center mb-8">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setStep(1)
                        setInputs({
                          studentType: '',
                          yearInSchool: '',
                          enrollmentStatus: '',
                          studentIncome: 0,
                          parentIncome: 0,
                          familySize: 4,
                          numberInCollege: 1,
                          studentAssets: 0,
                          parentAssets: 0,
                          costOfAttendance: 25000,
                        })
                        setEstimate(null)
                      }}
                    >
                      Start Over with New Information
                    </Button>
                  </div>

                  {/* Economic Dashboard */}
                  <div className="mt-8">
                    <EconomicDashboard />
                  </div>
                </div>
              )}
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
                    id: 'difference',
                    q: 'How is this estimator different from the FAFSA® form?',
                    a: 'The Federal Student Aid Estimator provides early estimates of federal aid eligibility. The FAFSA form is the official application you must complete to actually receive federal student aid. This estimator does not apply for aid—you must submit a FAFSA form to be considered for federal, state, and institutional aid.',
                  },
                  {
                    id: 'sai',
                    q: 'What is the Student Aid Index (SAI)?',
                    a: 'The SAI is an eligibility index number that colleges use to determine how much federal student aid you can receive. It replaced the Expected Family Contribution (EFC) starting with the 2024-25 award year. A lower (or negative) SAI indicates greater financial need. The SAI is not a dollar amount you\'re expected to pay.',
                  },
                  {
                    id: 'calculate',
                    q: 'How is the SAI calculated?',
                    a: 'The SAI is calculated using a formula set by Congress that considers family income, assets, family size, and number of family members in college. For dependent students, parent information is included. The formula includes income protection allowances and asset assessment rates. Our estimator uses a simplified version of this formula.',
                  },
                  {
                    id: 'pell',
                    q: 'How do I know if I qualify for a Pell Grant?',
                    a: 'Pell Grant eligibility is based primarily on your SAI. For the 2026-27 year, students with an SAI at or below approximately 6,656 may qualify for some Pell Grant. Students with an SAI at or below 0 qualify for the maximum Pell Grant. The amount also depends on your enrollment status (full-time vs. part-time).',
                  },
                  {
                    id: 'state',
                    q: 'Does this include state financial aid?',
                    a: 'No, this estimator only shows federal student aid programs. Each state has its own aid programs with different eligibility requirements. Check with your state\'s higher education agency or the schools you\'re applying to for information about state grants and scholarships.',
                  },
                ].map(faq => (
                  <div key={faq.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                      onClick={() => setShowFAQ(showFAQ === faq.id ? null : faq.id)}
                    >
                      <span className="font-semibold text-primary-darker pr-4">{faq.q}</span>
                      {showFAQ === faq.id ? (
                        <ChevronUp className="w-5 h-5 text-primary flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-primary flex-shrink-0" />
                      )}
                    </button>
                    {showFAQ === faq.id && (
                      <div className="px-6 pb-4">
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
              Ready to Apply for Federal Student Aid?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Complete the FAFSA form to receive your official aid eligibility. It takes about 30 minutes with your documents ready.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/application/getting-started"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-darker font-bold rounded hover:bg-gray-100 transition-colors text-lg"
              >
                Start Your FAFSA Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <a 
                href="https://studentaid.gov/aid-estimator/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-bold rounded hover:bg-white hover:text-primary-darker transition-colors text-lg"
              >
                Official FSA Estimator
                <ExternalLink className="ml-2 w-5 h-5" />
              </a>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}
