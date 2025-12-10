'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ArrowLeft, ArrowRight, Save, CheckCircle } from 'lucide-react'

const steps = [
  { id: 1, name: 'Get Started', path: '/application/getting-started' },
  { id: 2, name: 'Student Information', path: '/application/student-info' },
  { id: 3, name: 'Dependency Status', path: '/application/dependency' },
  { id: 4, name: 'Financial Information', path: '/application/financial' },
  { id: 5, name: 'Parent Information', path: '/application/parent-info' },
  { id: 6, name: 'School Selection', path: '/application/schools' },
  { id: 7, name: 'Review & Submit', path: '/application/review' },
]

interface ApplicationWizardProps {
  currentStep: number
  children: React.ReactNode
  onNext?: () => void | Promise<void>
  onBack?: () => void
  onSave?: () => void | Promise<void>
}

export function ApplicationWizard({
  currentStep,
  children,
  onNext,
  onBack,
  onSave,
}: ApplicationWizardProps) {
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  const currentStepData = steps[currentStep - 1]
  const isFirstStep = currentStep === 1
  const isLastStep = currentStep === steps.length

  const handleNext = async () => {
    if (onNext) {
      await onNext()
    }
    if (currentStep < steps.length) {
      router.push(steps[currentStep].path)
    }
  }

  const handleBack = () => {
    if (onBack) {
      onBack()
    }
    if (currentStep > 1) {
      router.push(steps[currentStep - 2].path)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    if (onSave) {
      await onSave()
    }
    setSaving(false)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      {/* Progress Bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="container-custom py-2">
          {/* Step Indicator */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-gray-700">
                Step {currentStep} of {steps.length}
              </span>
              <span className="text-sm font-bold text-primary">
                {Math.round((currentStep / steps.length) * 100)}% Complete
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Steps */}
          <div className="hidden md:flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                      step.id < currentStep
                        ? 'bg-primary text-white'
                        : step.id === currentStep
                        ? 'bg-accent-cool text-primary-darker ring-4 ring-accent-cool/30'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {step.id < currentStep ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <span
                    className={`mt-2 text-xs font-semibold ${
                      step.id === currentStep
                        ? 'text-primary'
                        : step.id < currentStep
                        ? 'text-primary-dark'
                        : 'text-gray-500'
                    }`}
                  >
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-12 lg:w-20 h-0.5 mx-2 ${
                      step.id < currentStep ? 'bg-primary' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 container-custom py-8">
        <div className="max-w-4xl mx-auto">
          {/* Current Step Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary-darker mb-2">
              {currentStepData.name}
            </h1>
            <p className="text-gray-600">
              Complete this section to continue with your FAFSA application
            </p>
          </div>

          {/* Step Content */}
          <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-lg p-8 mb-8 shadow-sm">{children}</div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <div>
              {!isFirstStep && (
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  className="gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
              )}
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="secondary"
                onClick={handleSave}
                disabled={saving}
                className="gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save & Exit'}
              </Button>

              <Button
                variant="primary"
                onClick={handleNext}
                className="gap-2"
              >
                {isLastStep ? 'Review & Submit' : 'Continue'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
