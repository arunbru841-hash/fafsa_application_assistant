'use client'

import { useState } from 'react'
import { ApplicationWizard } from '@/components/application/ApplicationWizard'
import { Radio } from '@/components/ui/Radio'
import { Checkbox } from '@/components/ui/Checkbox'
import { Alert } from '@/components/ui/Alert'
import { HelpCircle, CheckCircle, AlertCircle, User } from 'lucide-react'

interface DependencyData {
  bornBefore2002: string
  isMarried: string
  workingOnMasters: string
  activeOrReserveMilitary: string
  isVeteran: string
  hasChildren: string
  hasOtherDependents: string
  isOrphan: string
  isEmancipated: string
  isInLegalGuardianship: string
  isHomeless: string
  atRiskOfHomelessness: string
  confirmIndependentStatus: boolean
}

const DEPENDENCY_QUESTIONS = [
  {
    id: 'bornBefore2002',
    question: 'Were you born before January 1, 2002?',
    helpText: 'For the 2024-25 school year, if you were born before January 1, 2002, you are considered independent based on age.',
  },
  {
    id: 'isMarried',
    question: 'As of today, are you married? (Also answer "Yes" if you are separated but not divorced.)',
    helpText: 'Married students are considered independent regardless of age.',
  },
  {
    id: 'workingOnMasters',
    question: 'At the beginning of the 2024-25 school year, will you be working on a master\'s or doctorate program (such as MA, MBA, MD, JD, PhD, EdD, etc.)?',
    helpText: 'Graduate and professional students are considered independent.',
  },
  {
    id: 'activeOrReserveMilitary',
    question: 'Are you currently serving on active duty in the U.S. Armed Forces for purposes other than training?',
    helpText: 'Active duty military members are considered independent.',
  },
  {
    id: 'isVeteran',
    question: 'Are you a veteran of the U.S. Armed Forces?',
    helpText: 'Veterans are considered independent for FAFSA purposes.',
  },
  {
    id: 'hasChildren',
    question: 'Do you now have or will you have children who will receive more than half of their support from you between July 1, 2024, and June 30, 2025?',
    helpText: 'Having dependents makes you an independent student.',
  },
  {
    id: 'hasOtherDependents',
    question: 'Do you have dependents (other than your children or spouse) who live with you and who receive more than half of their support from you, now and through June 30, 2025?',
    helpText: 'This includes people like elderly parents or other relatives you support.',
  },
  {
    id: 'isOrphan',
    question: 'At any time since you turned age 13, were both your parents deceased, were you in foster care, or were you a dependent or ward of the court?',
    helpText: 'This applies if you were in the foster care system or ward of the court at any point since age 13.',
  },
  {
    id: 'isEmancipated',
    question: 'As determined by a court in your state of legal residence, are you or were you an emancipated minor?',
    helpText: 'An emancipated minor is someone under 18 who has been granted adult status by a court.',
  },
  {
    id: 'isInLegalGuardianship',
    question: 'As determined by a court in your state of legal residence, are you or were you in legal guardianship?',
    helpText: 'This is different from foster care. Legal guardianship is assigned by a court.',
  },
  {
    id: 'isHomeless',
    question: 'At any time on or after July 1, 2023, did your high school or school district homeless liaison determine that you were an unaccompanied youth who was homeless or were self-supporting and at risk of being homeless?',
    helpText: 'A homeless liaison is a staff member at your school who helps students experiencing homelessness.',
  },
  {
    id: 'atRiskOfHomelessness',
    question: 'At any time on or after July 1, 2023, did the director of an emergency shelter or transitional housing program funded by the U.S. Department of Housing and Urban Development determine that you were an unaccompanied youth who was homeless or were self-supporting and at risk of being homeless?',
    helpText: 'This includes shelters and transitional housing programs.',
  },
]

export default function DependencyPage() {
  const [formData, setFormData] = useState<DependencyData>({
    bornBefore2002: '',
    isMarried: '',
    workingOnMasters: '',
    activeOrReserveMilitary: '',
    isVeteran: '',
    hasChildren: '',
    hasOtherDependents: '',
    isOrphan: '',
    isEmancipated: '',
    isInLegalGuardianship: '',
    isHomeless: '',
    atRiskOfHomelessness: '',
    confirmIndependentStatus: false,
  })

  const [showHelp, setShowHelp] = useState<string | null>(null)

  const handleChange = (field: keyof DependencyData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Check if any question is answered "Yes"
  const isIndependent = Object.entries(formData)
    .filter(([key]) => key !== 'confirmIndependentStatus')
    .some(([, value]) => value === 'yes')

  // Calculate how many questions are answered
  const answeredCount = Object.entries(formData)
    .filter(([key]) => key !== 'confirmIndependentStatus')
    .filter(([, value]) => value === 'yes' || value === 'no')
    .length

  const handleNext = async () => {
    // Validate all questions are answered
    const allAnswered = answeredCount === DEPENDENCY_QUESTIONS.length
    if (!allAnswered) {
      return Promise.reject('Please answer all questions')
    }
    console.log('Saving dependency data:', formData)
  }

  return (
    <ApplicationWizard currentStep={3} onNext={handleNext}>
      <div className="space-y-8">
        {/* Introduction */}
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-primary-lighter rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-primary-darker mb-2">Why Does This Matter?</h3>
              <p className="text-sm text-gray-700">
                Your dependency status determines whose information (yours alone or yours and your parents') 
                is required on the FAFSA. If you're <strong>independent</strong>, you won't need to provide 
                parent information. If you're <strong>dependent</strong>, you'll need your parents' financial 
                information in the next steps.
              </p>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
          <span className="text-sm font-medium text-gray-700">
            Questions Answered: {answeredCount} of {DEPENDENCY_QUESTIONS.length}
          </span>
          <div className="w-32 h-2 bg-gray-300 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary-600 transition-all duration-300"
              style={{ width: `${(answeredCount / DEPENDENCY_QUESTIONS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {DEPENDENCY_QUESTIONS.map((q, index) => (
            <div 
              key={q.id} 
              className={`p-6 rounded-lg border-2 transition-all ${
                formData[q.id as keyof DependencyData] === 'yes'
                  ? 'border-primary-light bg-primary-50'
                  : formData[q.id as keyof DependencyData] === 'no'
                  ? 'border-gray-200 bg-white'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-start gap-4">
                <span className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold text-gray-600 flex-shrink-0">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <p className="font-medium text-primary-darker">{q.question}</p>
                    <button
                      type="button"
                      onClick={() => setShowHelp(showHelp === q.id ? null : q.id)}
                      className="p-1 text-gray-400 hover:text-primary transition-colors"
                    >
                      <HelpCircle className="w-5 h-5" />
                    </button>
                  </div>

                  {showHelp === q.id && (
                    <div className="mb-4 p-3 bg-primary-50 border border-primary-200 rounded-lg text-sm text-gray-700">
                      {q.helpText}
                    </div>
                  )}

                  <div className="flex gap-6">
                    <Radio
                      name={q.id}
                      value="yes"
                      label="Yes"
                      checked={formData[q.id as keyof DependencyData] === 'yes'}
                      onChange={() => handleChange(q.id as keyof DependencyData, 'yes')}
                    />
                    <Radio
                      name={q.id}
                      value="no"
                      label="No"
                      checked={formData[q.id as keyof DependencyData] === 'no'}
                      onChange={() => handleChange(q.id as keyof DependencyData, 'no')}
                    />
                  </div>

                  {formData[q.id as keyof DependencyData] === 'yes' && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-primary-dark">
                      <CheckCircle className="w-4 h-4" />
                      <span>This answer indicates independent status</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Status Result */}
        {answeredCount === DEPENDENCY_QUESTIONS.length && (
          <div className={`p-6 rounded-lg border-2 ${
            isIndependent 
              ? 'border-primary-light bg-primary-50' 
              : 'border-primary-300 bg-primary-50'
          }`}>
            <div className="flex items-start gap-4">
              {isIndependent ? (
                <CheckCircle className="w-8 h-8 text-primary flex-shrink-0" />
              ) : (
                <AlertCircle className="w-8 h-8 text-primary flex-shrink-0" />
              )}
              <div>
                <h3 className="font-bold text-lg text-primary-darker mb-2">
                  {isIndependent 
                    ? 'You Are Likely an Independent Student' 
                    : 'You Are Likely a Dependent Student'}
                </h3>
                <p className="text-gray-700 mb-4">
                  {isIndependent 
                    ? 'Based on your answers, you likely qualify as an independent student. You will NOT need to provide parent information on your FAFSA.'
                    : 'Based on your answers, you are considered a dependent student. You will need to provide your parent(s)\' information in the next steps.'}
                </p>
                
                {!isIndependent && (
                  <Alert 
                    variant="info"
                    title="What if I don't have contact with my parents?"
                  >
                    If you cannot provide parent information due to special circumstances (abuse, abandonment, etc.), 
                    you may be able to request a dependency override from your school's financial aid office. 
                    Contact them directly to discuss your situation.
                  </Alert>
                )}

                {isIndependent && (
                  <div className="mt-4">
                    <Checkbox
                      label="I confirm that my answers above are accurate and truthful"
                      checked={formData.confirmIndependentStatus}
                      onChange={(e) => handleChange('confirmIndependentStatus', e.target.checked)}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </ApplicationWizard>
  )
}

