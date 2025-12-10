'use client'

import { ApplicationWizard } from '@/components/application/ApplicationWizard'
import { Button } from '@/components/ui/Button'
import { CheckCircle, FileText, HelpCircle, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export default function GettingStartedPage() {
  return (
    <ApplicationWizard currentStep={1}>
      <div className="space-y-8">
        {/* Welcome Message */}
        <div className="text-center py-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-lighter rounded-full mb-4">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-primary-darker mb-2">
            Welcome to Your FAFSA Application
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We'll guide you through every step. This typically takes about 45 minutes to complete.
          </p>
        </div>

        {/* What You'll Need */}
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-primary-darker mb-4 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-primary" />
            What You'll Need
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-bold text-primary-darker">Personal Information:</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>Social Security Number</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>Driver's License (if applicable)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>Alien Registration Number (if not a U.S. citizen)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>Date of birth</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-primary-darker">Financial Documents:</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>2023 Federal Tax Return (Form 1040)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>W-2 Forms</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>Bank statements</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>Investment records (if applicable)</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-white rounded-lg border border-primary-200">
            <p className="text-sm text-gray-700">
              <strong className="text-primary-darker">Pro Tip:</strong> You can save your progress at any time and return later. We'll keep your information secure.
            </p>
          </div>
        </div>

        {/* FSA ID Notice */}
        <div className="bg-warning-50 border border-warning rounded-lg p-6">
          <h3 className="text-lg font-bold text-primary-darker mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            Important: FSA ID Required
          </h3>
          <p className="text-gray-700 mb-4">
            You'll need an FSA ID to sign your FAFSA electronically. If you don't have one yet, create it at{' '}
            <a 
              href="https://studentaid.gov/fsa-id/create-account/launch"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary-dark font-bold underline"
            >
              StudentAid.gov
            </a>
          </p>
          <div className="flex items-start gap-3 text-sm text-gray-600">
            <CheckCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
            <span>
              Both you and your parent (if dependent) will need separate FSA IDs. The process takes about 10 minutes.
            </span>
          </div>
        </div>

        {/* Eligibility Quick Check */}
        <div>
          <h3 className="text-lg font-bold text-primary-darker mb-4">
            Quick Eligibility Check
          </h3>
          <div className="space-y-3">
            {[
              'Are you a U.S. citizen or eligible noncitizen?',
              'Do you have a valid Social Security Number?',
              'Have you registered with Selective Service (if male, ages 18-25)?',
              'Do you have a high school diploma or GED?',
            ].map((question, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{question}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-gray-600">
            If you answered "No" to any of these, you may still be eligible. We'll help you determine your eligibility as we go.
          </p>
        </div>

        {/* Privacy Notice */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-start gap-3 text-sm text-gray-600">
            <div className="w-10 h-10 bg-primary-lighter rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-bold text-primary-darker mb-1">Your Information is Secure</p>
              <p>
                We use bank-level encryption and are FERPA compliant. Your data is never shared without your permission and is stored securely.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ApplicationWizard>
  )
}
