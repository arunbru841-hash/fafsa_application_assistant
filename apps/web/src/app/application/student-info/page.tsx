'use client'

import { useState } from 'react'
import { ApplicationWizard } from '@/components/application/ApplicationWizard'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Radio } from '@/components/ui/Radio'
import { Button } from '@/components/ui/Button'
import { AlertCircle, User, MapPin, Phone, Mail, Shield } from 'lucide-react'

interface StudentInfo {
  firstName: string
  middleName: string
  lastName: string
  suffix: string
  dateOfBirth: string
  ssn: string
  confirmSsn: string
  email: string
  confirmEmail: string
  phone: string
  streetAddress: string
  city: string
  state: string
  zipCode: string
  citizenshipStatus: string
  alienRegistrationNumber: string
  selectiveService: string
  hasDriverLicense: string
  driverLicenseState: string
  driverLicenseNumber: string
}

const US_STATES = [
  { value: '', label: 'Select State' },
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
  { value: 'DC', label: 'District of Columbia' },
]

const CITIZENSHIP_OPTIONS = [
  { value: 'us-citizen', label: 'U.S. Citizen' },
  { value: 'us-national', label: 'U.S. National' },
  { value: 'permanent-resident', label: 'U.S. Permanent Resident (Green Card holder)' },
  { value: 'eligible-noncitizen', label: 'Eligible Noncitizen' },
  { value: 'other', label: 'None of the above' },
]

export default function StudentInfoPage() {
  const [formData, setFormData] = useState<StudentInfo>({
    firstName: '',
    middleName: '',
    lastName: '',
    suffix: '',
    dateOfBirth: '',
    ssn: '',
    confirmSsn: '',
    email: '',
    confirmEmail: '',
    phone: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    citizenshipStatus: '',
    alienRegistrationNumber: '',
    selectiveService: '',
    hasDriverLicense: '',
    driverLicenseState: '',
    driverLicenseNumber: '',
  })

  const [errors, setErrors] = useState<Partial<Record<keyof StudentInfo, string>>>({})

  const handleChange = (field: keyof StudentInfo, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when field is modified
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof StudentInfo, string>> = {}

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required'
    if (!formData.ssn) newErrors.ssn = 'Social Security Number is required'
    if (formData.ssn !== formData.confirmSsn) newErrors.confirmSsn = 'SSN does not match'
    if (!formData.email) newErrors.email = 'Email is required'
    if (formData.email !== formData.confirmEmail) newErrors.confirmEmail = 'Email does not match'
    if (!formData.streetAddress.trim()) newErrors.streetAddress = 'Street address is required'
    if (!formData.city.trim()) newErrors.city = 'City is required'
    if (!formData.state) newErrors.state = 'State is required'
    if (!formData.zipCode) newErrors.zipCode = 'ZIP code is required'
    if (!formData.citizenshipStatus) newErrors.citizenshipStatus = 'Citizenship status is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = async () => {
    if (!validateForm()) {
      return Promise.reject('Validation failed')
    }
    // Save data to API
    console.log('Saving student info:', formData)
  }

  return (
    <ApplicationWizard currentStep={2} onNext={handleNext}>
      <div className="space-y-6">
        {/* Validation Summary */}
        {Object.keys(errors).length > 0 && (
          <div className="bg-red-50 border-l-4 border-secondary-dark p-4 rounded-r-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-secondary-dark flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-secondary-dark mb-1">Please correct the following errors:</h4>
                <ul className="text-sm text-gray-700 list-disc list-inside">
                  {Object.values(errors).filter(Boolean).map((error, idx) => (
                    <li key={idx}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Personal Information Section */}
        <section className="usa-form-section usa-form-section--primary">
          <div className="usa-form-section__header">
            <div className="usa-form-section__icon">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="usa-form-section__title">Personal Information</h3>
            </div>
          </div>
          <p className="usa-form-section__description">
            Enter your legal name exactly as it appears on your Social Security card. Fields marked with <span className="text-secondary-dark font-bold">*</span> are required.
          </p>

          <div className="usa-form-grid usa-form-grid--2col">
            <Input
              label="First Name"
              placeholder="Enter first name"
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              error={errors.firstName}
              required
            />
            <Input
              label="Middle Name"
              placeholder="Enter middle name (optional)"
              value={formData.middleName}
              onChange={(e) => handleChange('middleName', e.target.value)}
            />
            <Input
              label="Last Name"
              placeholder="Enter last name"
              value={formData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              error={errors.lastName}
              required
            />
            <Select
              label="Suffix"
              value={formData.suffix}
              onChange={(e) => handleChange('suffix', e.target.value)}
              options={[
                { value: '', label: 'None' },
                { value: 'jr', label: 'Jr.' },
                { value: 'sr', label: 'Sr.' },
                { value: 'ii', label: 'II' },
                { value: 'iii', label: 'III' },
                { value: 'iv', label: 'IV' },
              ]}
            />
            <Input
              label="Date of Birth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleChange('dateOfBirth', e.target.value)}
              error={errors.dateOfBirth}
              required
            />
          </div>
        </section>

        {/* Social Security Section */}
        <section className="usa-form-section usa-form-section--accent">
          <div className="usa-form-section__header">
            <div className="usa-form-section__icon bg-accent-cool-dark">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="usa-form-section__title">Social Security Number</h3>
            </div>
          </div>
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700">
                Your SSN is required to verify your identity and process your financial aid. 
                It is encrypted and stored securely according to federal guidelines.
              </p>
            </div>
          </div>

          <div className="usa-form-grid usa-form-grid--2col">
            <Input
              label="Social Security Number"
              type="password"
              placeholder="XXX-XX-XXXX"
              value={formData.ssn}
              onChange={(e) => handleChange('ssn', e.target.value)}
              error={errors.ssn}
              required
              autoComplete="off"
            />
            <Input
              label="Confirm SSN"
              type="password"
              placeholder="XXX-XX-XXXX"
              value={formData.confirmSsn}
              onChange={(e) => handleChange('confirmSsn', e.target.value)}
              error={errors.confirmSsn}
              required
              autoComplete="off"
            />
          </div>
        </section>

        {/* Contact Information Section */}
        <section className="usa-form-section">
          <div className="usa-form-section__header">
            <div className="usa-form-section__icon">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="usa-form-section__title">Contact Information</h3>
            </div>
          </div>

          <div className="usa-form-grid usa-form-grid--2col">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              error={errors.email}
              required
            />
            <Input
              label="Confirm Email"
              type="email"
              placeholder="you@example.com"
              value={formData.confirmEmail}
              onChange={(e) => handleChange('confirmEmail', e.target.value)}
              error={errors.confirmEmail}
              required
            />
            <Input
              label="Phone Number"
              type="tel"
              placeholder="(555) 123-4567"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              helperText="Include area code (optional)"
            />
          </div>
        </section>

        {/* Address Section */}
        <section className="usa-form-section usa-form-section--primary">
          <div className="usa-form-section__header">
            <div className="usa-form-section__icon">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="usa-form-section__title">Mailing Address</h3>
            </div>
          </div>
          <p className="usa-form-section__description">
            Enter your current permanent mailing address. Fields marked with <span className="text-secondary-dark font-bold">*</span> are required.
          </p>

          <div className="space-y-4">
            <Input
              label="Street Address"
              placeholder="123 Main Street, Apt 4B"
              value={formData.streetAddress}
              onChange={(e) => handleChange('streetAddress', e.target.value)}
              error={errors.streetAddress}
              required
            />
            <div className="usa-form-grid usa-form-grid--3col">
              <Input
                label="City"
                placeholder="City"
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                error={errors.city}
                required
              />
              <Select
                label="State"
                value={formData.state}
                onChange={(e) => handleChange('state', e.target.value)}
                options={US_STATES}
                error={errors.state}
                required
              />
              <Input
                label="ZIP Code"
                placeholder="12345"
                value={formData.zipCode}
                onChange={(e) => handleChange('zipCode', e.target.value)}
                error={errors.zipCode}
                required
              />
            </div>
          </div>
        </section>

        {/* Citizenship Section */}
        <section className="usa-form-section">
          <div className="usa-form-section__header">
            <div className="usa-form-section__icon bg-primary-dark">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="usa-form-section__title">Citizenship Status</h3>
            </div>
          </div>
          <p className="usa-form-section__description">
            Select your citizenship status. This determines your eligibility for federal financial aid.
          </p>
          
          <div className="space-y-3">
            {CITIZENSHIP_OPTIONS.map((option) => (
              <Radio
                key={option.value}
                name="citizenshipStatus"
                value={option.value}
                label={option.label}
                checked={formData.citizenshipStatus === option.value}
                onChange={(e) => handleChange('citizenshipStatus', e.target.value)}
              />
            ))}
          </div>

          {formData.citizenshipStatus === 'eligible-noncitizen' && (
            <div className="mt-4">
              <Input
                label="Alien Registration Number"
                placeholder="A-XXXXXXXX"
                value={formData.alienRegistrationNumber}
                onChange={(e) => handleChange('alienRegistrationNumber', e.target.value)}
                helperText="Your 9-digit Alien Registration Number (A-Number)"
              />
            </div>
          )}

          {errors.citizenshipStatus && (
            <p className="usa-error-message">{errors.citizenshipStatus}</p>
          )}
        </section>

        {/* Selective Service Section */}
        <section className="usa-form-section usa-form-section--accent">
          <div className="usa-form-section__header">
            <div className="usa-form-section__icon bg-accent-cool-dark">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="usa-form-section__title">Selective Service Registration</h3>
            </div>
          </div>
          <p className="usa-form-section__description">
            If you are male and between 18-25 years old, you must be registered with Selective Service to receive federal financial aid.
          </p>
          
          <div className="space-y-3">
            <Radio
              name="selectiveService"
              value="registered"
              label="I am registered with Selective Service"
              checked={formData.selectiveService === 'registered'}
              onChange={(e) => handleChange('selectiveService', e.target.value)}
            />
            <Radio
              name="selectiveService"
              value="not-required"
              label="I am not required to register (female, under 18, or over 25)"
              checked={formData.selectiveService === 'not-required'}
              onChange={(e) => handleChange('selectiveService', e.target.value)}
            />
            <Radio
              name="selectiveService"
              value="not-registered"
              label="I am male, 18-25, and not yet registered"
              checked={formData.selectiveService === 'not-registered'}
              onChange={(e) => handleChange('selectiveService', e.target.value)}
            />
          </div>

          {formData.selectiveService === 'not-registered' && (
            <div className="mt-4 p-4 bg-warning-50 border border-warning-200 rounded-lg">
              <p className="text-sm text-gray-700">
                You can register at <a href="https://www.sss.gov" target="_blank" rel="noopener noreferrer" className="text-primary underline">www.sss.gov</a> or 
                check the box on your FAFSA to have us register you automatically.
              </p>
            </div>
          )}
        </section>

        {/* Driver's License Section */}
        <section className="usa-form-section">
          <div className="usa-form-section__header">
            <div className="usa-form-section__icon bg-gray-600">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="usa-form-section__title">Driver's License (Optional)</h3>
            </div>
          </div>
          <p className="usa-form-section__description">
            This information helps verify your identity and is optional.
          </p>
          
          <div className="space-y-3 mb-4">
            <Radio
              name="hasDriverLicense"
              value="yes"
              label="I have a driver's license"
              checked={formData.hasDriverLicense === 'yes'}
              onChange={(e) => handleChange('hasDriverLicense', e.target.value)}
            />
            <Radio
              name="hasDriverLicense"
              value="no"
              label="I do not have a driver's license"
              checked={formData.hasDriverLicense === 'no'}
              onChange={(e) => handleChange('hasDriverLicense', e.target.value)}
            />
          </div>

          {formData.hasDriverLicense === 'yes' && (
            <div className="usa-form-grid usa-form-grid--2col">
              <Select
                label="State of Issue"
                value={formData.driverLicenseState}
                onChange={(e) => handleChange('driverLicenseState', e.target.value)}
                options={US_STATES}
              />
              <Input
                label="License Number"
                placeholder="Driver's license number"
                value={formData.driverLicenseNumber}
                onChange={(e) => handleChange('driverLicenseNumber', e.target.value)}
              />
            </div>
          )}
        </section>
      </div>
    </ApplicationWizard>
  )
}
