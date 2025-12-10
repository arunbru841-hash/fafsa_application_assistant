'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Eye, EyeOff, Lock, Mail, User, ArrowRight, Shield, CheckCircle, AlertTriangle, Info, Calendar, Phone, ExternalLink } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'

interface PasswordRequirement {
  label: string
  validator: (password: string) => boolean
}

const passwordRequirements: PasswordRequirement[] = [
  { label: 'At least 8 characters', validator: (p) => p.length >= 8 },
  { label: 'At least one uppercase letter', validator: (p) => /[A-Z]/.test(p) },
  { label: 'At least one lowercase letter', validator: (p) => /[a-z]/.test(p) },
  { label: 'At least one number', validator: (p) => /\d/.test(p) },
  { label: 'At least one special character (!@#$%^&*)', validator: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
]

export default function SignupPage() {
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  
  const { register, isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  
  // Form fields
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    confirmEmail: '',
    dateOfBirth: '',
    ssn: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push('/application/getting-started')
    }
  }, [isAuthenticated, authLoading, router])

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    if (step === 1) {
      // Validate step 1
      if (formData.email !== formData.confirmEmail) {
        setError('Email addresses do not match')
        return
      }
      setStep(2)
      return
    }
    
    if (step === 2) {
      // Validate step 2
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match')
        return
      }
      
      const allRequirementsMet = passwordRequirements.every(req => req.validator(formData.password))
      if (!allRequirementsMet) {
        setError('Password does not meet all requirements')
        return
      }
      
      if (!agreedToTerms) {
        setError('You must agree to the terms and conditions')
        return
      }
      
      setIsLoading(true)
      
      try {
        await register({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
        })
        setSuccess('Account created successfully! Redirecting...')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create account. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }
  }

  const getPasswordStrength = () => {
    const metRequirements = passwordRequirements.filter(req => req.validator(formData.password)).length
    if (metRequirements === 0) return { label: '', color: '', width: '0%' }
    if (metRequirements <= 2) return { label: 'Weak', color: 'bg-red-500', width: '33%' }
    if (metRequirements <= 4) return { label: 'Medium', color: 'bg-yellow-500', width: '66%' }
    return { label: 'Strong', color: 'bg-green-500', width: '100%' }
  }

  const passwordStrength = getPasswordStrength()

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {step > 1 ? <CheckCircle className="w-6 h-6" /> : '1'}
              </div>
              <span className={`ml-2 mr-4 font-medium ${step >= 1 ? 'text-primary-darker' : 'text-gray-400'}`}>
                Personal Info
              </span>
            </div>
            <div className={`w-16 h-1 rounded ${step > 1 ? 'bg-primary' : 'bg-gray-200'}`}></div>
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ml-4 ${
                step >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                2
              </div>
              <span className={`ml-2 font-medium ${step >= 2 ? 'text-primary-darker' : 'text-gray-400'}`}>
                Create Password
              </span>
            </div>
          </div>

          {/* Signup Card */}
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-primary-darker px-8 py-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4">
                <User className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-white">Create Your Account</h1>
              <p className="text-primary-light mt-2">
                {step === 1 ? 'Enter your personal information' : 'Create a secure password'}
              </p>
            </div>
            
            {/* Form */}
            <div className="px-8 py-6">
              {/* Success Message */}
              {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-green-700">{success}</p>
                  </div>
                </div>
              )}
              
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                {/* Step 1: Personal Information */}
                {step === 1 && (
                  <div className="space-y-5">
                    {/* Name Fields */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-semibold text-primary-darker mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => updateField('firstName', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-semibold text-primary-darker mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => updateField('lastName', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                          required
                        />
                      </div>
                    </div>
                    
                    {/* Email Field */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-primary-darker mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          id="email"
                          value={formData.email}
                          onChange={(e) => updateField('email', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                          placeholder="you@example.com"
                          required
                        />
                      </div>
                    </div>
                    
                    {/* Confirm Email */}
                    <div>
                      <label htmlFor="confirmEmail" className="block text-sm font-semibold text-primary-darker mb-2">
                        Confirm Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          id="confirmEmail"
                          value={formData.confirmEmail}
                          onChange={(e) => updateField('confirmEmail', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                          placeholder="Confirm your email"
                          required
                        />
                      </div>
                      {formData.confirmEmail && formData.email !== formData.confirmEmail && (
                        <p className="text-red-600 text-sm mt-1">Email addresses do not match</p>
                      )}
                    </div>
                    
                    {/* Date of Birth */}
                    <div>
                      <label htmlFor="dob" className="block text-sm font-semibold text-primary-darker mb-2">
                        Date of Birth
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="date"
                          id="dob"
                          value={formData.dateOfBirth}
                          onChange={(e) => updateField('dateOfBirth', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                          required
                        />
                      </div>
                    </div>
                    
                    {/* Phone (Optional) */}
                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-primary-darker mb-2">
                        Phone Number <span className="text-gray-400 font-normal">(Optional)</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => updateField('phone', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                          placeholder="(555) 555-5555"
                        />
                      </div>
                    </div>
                    
                    {/* SSN Notice */}
                    <div className="bg-primary-lighter/30 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-base-dark">
                          <strong>Note:</strong> When you complete your FAFSA, you'll need to provide your Social Security Number. 
                          Make sure to have it ready when you apply.
                        </p>
                      </div>
                    </div>
                    
                    <Button type="submit" className="w-full py-3 text-lg">
                      Continue
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </div>
                )}
                
                {/* Step 2: Create Password */}
                {step === 2 && (
                  <div className="space-y-5">
                    {/* Password Field */}
                    <div>
                      <label htmlFor="password" className="block text-sm font-semibold text-primary-darker mb-2">
                        Create Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          id="password"
                          value={formData.password}
                          onChange={(e) => updateField('password', e.target.value)}
                          className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                          placeholder="Create a strong password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      
                      {/* Password Strength Meter */}
                      {formData.password && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-500">Password strength</span>
                            <span className={`text-xs font-medium ${
                              passwordStrength.label === 'Weak' ? 'text-red-500' :
                              passwordStrength.label === 'Medium' ? 'text-yellow-600' :
                              'text-green-600'
                            }`}>{passwordStrength.label}</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                              style={{ width: passwordStrength.width }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Password Requirements */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-primary-darker text-sm mb-3">Password Requirements:</h4>
                      <ul className="space-y-2">
                        {passwordRequirements.map((req, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm">
                            {req.validator(formData.password) ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                            )}
                            <span className={req.validator(formData.password) ? 'text-green-700' : 'text-gray-600'}>
                              {req.label}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Confirm Password */}
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-semibold text-primary-darker mb-2">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          id="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={(e) => updateField('confirmPassword', e.target.value)}
                          className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                          placeholder="Confirm your password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                        <p className="text-red-600 text-sm mt-1">Passwords do not match</p>
                      )}
                      {formData.confirmPassword && formData.password === formData.confirmPassword && formData.password && (
                        <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" /> Passwords match
                        </p>
                      )}
                    </div>
                    
                    {/* Terms and Conditions */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={agreedToTerms}
                          onChange={(e) => setAgreedToTerms(e.target.checked)}
                          className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary mt-0.5"
                        />
                        <span className="text-sm text-base-dark">
                          I agree to the{' '}
                          <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>
                          {' '}and{' '}
                          <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
                          I understand that my information will be used to apply for federal student aid.
                        </span>
                      </label>
                    </div>
                    
                    {/* Buttons */}
                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(1)}
                        className="flex-1 py-3"
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 py-3"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Creating...
                          </span>
                        ) : (
                          'Create Account'
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </form>
              
              {/* Already have account */}
              <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                <p className="text-base-dark">
                  Already have an account?{' '}
                  <Link href="/login" className="text-primary font-semibold hover:underline">
                    Log In
                  </Link>
                </p>
              </div>
            </div>
          </div>
          
          {/* Security Notice */}
          <div className="mt-6 bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-primary-darker text-sm">Your information is protected</h3>
                <p className="text-xs text-base-dark mt-1">
                  We use industry-standard encryption to protect your personal information. 
                  Your data is never sold or shared with third parties for marketing purposes.
                </p>
              </div>
            </div>
          </div>
          
          {/* FSA ID Notice */}
          <div className="mt-4 bg-accent-cool/10 rounded-lg border border-accent-cool/30 p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-accent-cool-dark flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-primary-darker text-sm">About FSA ID</h3>
                <p className="text-xs text-base-dark mt-1">
                  Your StudentAid.gov account serves as your FSA ID, which you'll use to sign your FAFSA electronically. 
                  Parents of dependent students also need their own FSA ID to complete the FAFSA.{' '}
                  <a 
                    href="https://studentaid.gov/fsa-id/create-account/launch"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center gap-1"
                  >
                    Learn more <ExternalLink className="w-3 h-3" />
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
