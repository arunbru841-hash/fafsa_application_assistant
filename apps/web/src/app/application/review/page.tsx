'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ApplicationWizard } from '@/components/application/ApplicationWizard'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { Alert } from '@/components/ui/Alert'
import { 
  CheckCircle, 
  Edit, 
  User, 
  Users, 
  DollarSign, 
  GraduationCap,
  FileText,
  Shield,
  AlertTriangle,
  Send,
  Download,
  Clock
} from 'lucide-react'

// Mock data - in production, this would come from the application state/API
const MOCK_APPLICATION_DATA = {
  student: {
    firstName: 'John',
    lastName: 'Smith',
    dateOfBirth: '2004-05-15',
    email: 'john.smith@email.com',
    phone: '(555) 123-4567',
    address: '123 Main Street, Berkeley, CA 94704',
    ssn: '***-**-6789',
    citizenshipStatus: 'U.S. Citizen',
  },
  dependency: {
    status: 'Dependent',
    reason: 'Under 24, unmarried, no dependents',
  },
  financial: {
    taxFilingStatus: 'Completed 2023 tax return',
    adjustedGrossIncome: '$12,500',
    taxPaid: '$0',
    incomeFromWork: '$12,500',
    assets: '$2,500',
  },
  parent: {
    parent1: {
      name: 'Mary Smith',
      relationship: 'Mother',
      dateOfBirth: '1975-03-22',
      ssn: '***-**-1234',
    },
    parent2: {
      name: 'Robert Smith',
      relationship: 'Father',
      dateOfBirth: '1973-08-10',
      ssn: '***-**-5678',
    },
    householdSize: 4,
    numberInCollege: 2,
    parentAGI: '$85,000',
    parentAssets: '$15,000',
  },
  schools: [
    { name: 'University of California, Berkeley', code: '001312', housing: 'On Campus', priority: 1 },
    { name: 'Stanford University', code: '001305', housing: 'On Campus', priority: 2 },
    { name: 'University of Michigan', code: '002325', housing: 'Off Campus', priority: 3 },
  ],
  estimatedEFC: 8500,
  pellGrantEligible: true,
  estimatedPellGrant: 0,
}

interface ReviewSectionProps {
  title: string
  icon: React.ReactNode
  editPath: string
  children: React.ReactNode
}

function ReviewSection({ title, icon, editPath, children }: ReviewSectionProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary-lighter rounded-full flex items-center justify-center">
            {icon}
          </div>
          <h3 className="font-bold text-primary-darker">{title}</h3>
        </div>
        <Link
          href={editPath}
          className="flex items-center gap-1 text-sm text-primary hover:text-primary-dark"
        >
          <Edit className="w-4 h-4" />
          Edit
        </Link>
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}

interface DataRowProps {
  label: string
  value: string | number | React.ReactNode
}

function DataRow({ label, value }: DataRowProps) {
  return (
    <div className="flex justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium text-primary-darker">{value}</span>
    </div>
  )
}

export default function ReviewPage() {
  const [agreements, setAgreements] = useState({
    accuracy: false,
    electronic: false,
    privacy: false,
    terms: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const data = MOCK_APPLICATION_DATA

  const allAgreed = Object.values(agreements).every(Boolean)

  const handleSubmit = async () => {
    if (!allAgreed) return

    setIsSubmitting(true)
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsSubmitted(true)
    setIsSubmitting(false)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-primary-lighter rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-primary-darker mb-4">
            FAFSA Submitted Successfully!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Your FAFSA has been submitted. You will receive a confirmation email shortly.
          </p>
          
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-6 mb-8 text-left">
            <h2 className="font-bold text-primary-darker mb-4">Next Steps:</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm flex-shrink-0">1</span>
                <span className="text-gray-700">Check your email for the Student Aid Report (SAR) within 3-5 days</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm flex-shrink-0">2</span>
                <span className="text-gray-700">Review your SAR for any errors and make corrections if needed</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm flex-shrink-0">3</span>
                <span className="text-gray-700">Your schools will receive your FAFSA data and send financial aid offers</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm flex-shrink-0">4</span>
                <span className="text-gray-700">Compare offers and accept the best package for your situation</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" asChild>
              <Link href="/dashboard">
                <FileText className="w-4 h-4 mr-2" />
                View Dashboard
              </Link>
            </Button>
            <Button asChild>
              <Link href="/">
                Return to Home
              </Link>
            </Button>
          </div>

          <p className="mt-8 text-sm text-gray-500">
            Confirmation Number: <span className="font-mono font-medium">FAFSA-2024-{Date.now().toString().slice(-8)}</span>
          </p>
        </div>
      </div>
    )
  }

  return (
    <ApplicationWizard currentStep={7}>
      <div className="space-y-6">
        {/* EFC Summary Card */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-primary-100 mb-1">Estimated Expected Family Contribution (EFC)</p>
              <p className="text-4xl font-bold">
                ${data.estimatedEFC.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              {data.pellGrantEligible ? (
                <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                  <CheckCircle className="w-5 h-5 text-primary-light" />
                  <span>Pell Grant Eligible</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                  <Clock className="w-5 h-5" />
                  <span>Above Pell Threshold</span>
                </div>
              )}
            </div>
          </div>
          <p className="mt-4 text-sm text-primary-100">
            This is an estimate based on the information provided. Your actual EFC will be 
            calculated after your FAFSA is processed.
          </p>
        </div>

        {/* Review Sections */}
        <ReviewSection 
          title="Student Information" 
          icon={<User className="w-4 h-4 text-primary" />}
          editPath="/application/student-info"
        >
          <div className="grid md:grid-cols-2 gap-4">
            <DataRow label="Name" value={`${data.student.firstName} ${data.student.lastName}`} />
            <DataRow label="Date of Birth" value={data.student.dateOfBirth} />
            <DataRow label="Email" value={data.student.email} />
            <DataRow label="Phone" value={data.student.phone} />
            <DataRow label="SSN" value={data.student.ssn} />
            <DataRow label="Citizenship" value={data.student.citizenshipStatus} />
            <div className="md:col-span-2">
              <DataRow label="Address" value={data.student.address} />
            </div>
          </div>
        </ReviewSection>

        <ReviewSection 
          title="Dependency Status" 
          icon={<Users className="w-4 h-4 text-primary" />}
          editPath="/application/dependency"
        >
          <div className="flex items-center gap-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              data.dependency.status === 'Independent' 
                ? 'bg-primary-lighter text-primary-dark' 
                : 'bg-primary-lighter text-primary-dark'
            }`}>
              {data.dependency.status}
            </span>
            <span className="text-gray-600">{data.dependency.reason}</span>
          </div>
        </ReviewSection>

        <ReviewSection 
          title="Your Financial Information" 
          icon={<DollarSign className="w-4 h-4 text-primary" />}
          editPath="/application/financial"
        >
          <DataRow label="Tax Filing Status" value={data.financial.taxFilingStatus} />
          <DataRow label="Adjusted Gross Income" value={data.financial.adjustedGrossIncome} />
          <DataRow label="U.S. Income Tax Paid" value={data.financial.taxPaid} />
          <DataRow label="Income from Work" value={data.financial.incomeFromWork} />
          <DataRow label="Total Assets" value={data.financial.assets} />
        </ReviewSection>

        <ReviewSection 
          title="Parent Information" 
          icon={<Users className="w-4 h-4 text-primary" />}
          editPath="/application/parent-info"
        >
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Parent 1</p>
                <p className="font-medium">{data.parent.parent1.name}</p>
                <p className="text-sm text-gray-600">{data.parent.parent1.relationship}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Parent 2</p>
                <p className="font-medium">{data.parent.parent2.name}</p>
                <p className="text-sm text-gray-600">{data.parent.parent2.relationship}</p>
              </div>
            </div>
            <DataRow label="Household Size" value={data.parent.householdSize} />
            <DataRow label="Number in College" value={data.parent.numberInCollege} />
            <DataRow label="Parent AGI" value={data.parent.parentAGI} />
            <DataRow label="Parent Assets" value={data.parent.parentAssets} />
          </div>
        </ReviewSection>

        <ReviewSection 
          title="School Selections" 
          icon={<GraduationCap className="w-4 h-4 text-primary" />}
          editPath="/application/schools"
        >
          <div className="space-y-3">
            {data.schools.map((school) => (
              <div 
                key={school.code}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {school.priority}
                  </span>
                  <div>
                    <p className="font-medium text-primary-darker">{school.name}</p>
                    <p className="text-sm text-gray-500">Code: {school.code} • {school.housing}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ReviewSection>

        {/* Warnings */}
        <Alert variant="warning" title="Before You Submit">
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Review all information carefully for accuracy</li>
            <li>Incorrect information may delay processing or affect your aid</li>
            <li>Your parent(s) will need to sign with their FSA ID after submission</li>
            <li>You can make corrections after submission if needed</li>
          </ul>
        </Alert>

        {/* Agreements */}
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <h3 className="font-bold text-primary-darker flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Required Agreements
          </h3>

          <div className="space-y-3">
            <Checkbox
              label="I certify that all information provided is complete and accurate to the best of my knowledge. I understand that providing false information may result in penalties."
              checked={agreements.accuracy}
              onChange={(e) => setAgreements(prev => ({ ...prev, accuracy: e.target.checked }))}
            />
            <Checkbox
              label="I agree to submit this FAFSA electronically and understand it has the same legal effect as a paper signature."
              checked={agreements.electronic}
              onChange={(e) => setAgreements(prev => ({ ...prev, electronic: e.target.checked }))}
            />
            <Checkbox
              label="I authorize the release of my FAFSA information to the schools I have listed and to state agencies as appropriate."
              checked={agreements.privacy}
              onChange={(e) => setAgreements(prev => ({ ...prev, privacy: e.target.checked }))}
            />
            <Checkbox
              label="I have read and agree to the Terms of Service and Privacy Policy."
              checked={agreements.terms}
              onChange={(e) => setAgreements(prev => ({ ...prev, terms: e.target.checked }))}
            />
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200">
          <Button variant="secondary">
            <Download className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
          
          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-500">
              {allAgreed 
                ? 'Ready to submit!' 
                : 'Please agree to all terms above'}
            </p>
            <Button
              size="lg"
              onClick={handleSubmit}
              disabled={!allAgreed || isSubmitting}
              className="min-w-[200px]"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Submit FAFSA
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </ApplicationWizard>
  )
}
