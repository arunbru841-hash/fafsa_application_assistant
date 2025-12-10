'use client'

import { useState } from 'react'
import { ApplicationWizard } from '@/components/application/ApplicationWizard'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Radio } from '@/components/ui/Radio'
import { Checkbox } from '@/components/ui/Checkbox'
import { Alert } from '@/components/ui/Alert'
import { Tooltip } from '@/components/ui/Tooltip'
import { 
  Users, 
  HelpCircle, 
  Plus, 
  Trash2,
  DollarSign,
  FileText,
  Home,
  AlertCircle
} from 'lucide-react'

interface Parent {
  id: string
  relationship: string
  firstName: string
  lastName: string
  dateOfBirth: string
  ssn: string
  email: string
  phone: string
  highestEducation: string
}

interface ParentInfoData {
  // Parents
  parents: Parent[]
  maritalStatus: string
  marriageDate: string
  
  // Household
  householdSize: string
  numberInCollege: string
  
  // Tax Information
  parentTaxReturnStatus: string
  parentFilingStatus: string
  parentAGI: string
  parentTaxPaid: string
  
  // Income from Work
  parent1Earnings: string
  parent2Earnings: string
  
  // Untaxed Income
  parentChildSupportReceived: string
  parentUntaxedPensions: string
  parentIRADistributions: string
  parentOtherUntaxedIncome: string
  
  // Assets
  parentCashSavings: string
  parentInvestments: string
  parentBusinessFarm: string
  
  // Additional
  parentIsDislocatedWorker: string
  parentReceivedBenefits: string
  
  // State
  parentStateOfResidence: string
  parentLegalResident: string
  
  // Confirmation
  confirmParentInfo: boolean
}

const RELATIONSHIP_OPTIONS = [
  { value: '', label: 'Select relationship' },
  { value: 'mother', label: 'Mother' },
  { value: 'father', label: 'Father' },
  { value: 'stepmother', label: 'Stepmother' },
  { value: 'stepfather', label: 'Stepfather' },
]

const MARITAL_STATUS_OPTIONS = [
  { value: '', label: 'Select status' },
  { value: 'married', label: 'Married or Remarried' },
  { value: 'never-married', label: 'Never Married' },
  { value: 'divorced', label: 'Divorced or Separated' },
  { value: 'widowed', label: 'Widowed' },
  { value: 'unmarried-together', label: 'Unmarried and Living Together' },
]

const EDUCATION_OPTIONS = [
  { value: '', label: 'Select highest level' },
  { value: 'middle-school', label: 'Middle School/Jr. High' },
  { value: 'high-school', label: 'High School' },
  { value: 'college', label: 'College or Beyond' },
  { value: 'other', label: 'Other/Unknown' },
]

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

const TAX_RETURN_OPTIONS = [
  { value: '', label: 'Select tax return type' },
  { value: 'completed', label: 'Already completed 2023 tax return' },
  { value: 'will-file', label: 'Will file 2023 tax return' },
  { value: 'not-filing', label: 'Will not file 2023 tax return' },
]

const FILING_STATUS_OPTIONS = [
  { value: '', label: 'Select filing status' },
  { value: 'single', label: 'Single' },
  { value: 'married-joint', label: 'Married Filing Jointly' },
  { value: 'married-separate', label: 'Married Filing Separately' },
  { value: 'head-household', label: 'Head of Household' },
  { value: 'widow', label: 'Qualifying Widow(er)' },
]

const formatCurrency = (value: string): string => {
  const num = value.replace(/[^0-9]/g, '')
  if (!num) return ''
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(parseInt(num, 10))
}

const parseCurrency = (value: string): string => {
  return value.replace(/[^0-9]/g, '')
}

export default function ParentInfoPage() {
  const [formData, setFormData] = useState<ParentInfoData>({
    parents: [
      {
        id: '1',
        relationship: '',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        ssn: '',
        email: '',
        phone: '',
        highestEducation: '',
      },
    ],
    maritalStatus: '',
    marriageDate: '',
    householdSize: '',
    numberInCollege: '',
    parentTaxReturnStatus: '',
    parentFilingStatus: '',
    parentAGI: '',
    parentTaxPaid: '',
    parent1Earnings: '',
    parent2Earnings: '',
    parentChildSupportReceived: '',
    parentUntaxedPensions: '',
    parentIRADistributions: '',
    parentOtherUntaxedIncome: '',
    parentCashSavings: '',
    parentInvestments: '',
    parentBusinessFarm: '',
    parentIsDislocatedWorker: '',
    parentReceivedBenefits: '',
    parentStateOfResidence: '',
    parentLegalResident: '',
    confirmParentInfo: false,
  })

  const [errors, setErrors] = useState<Partial<Record<string, string>>>({})

  const handleChange = (field: keyof ParentInfoData, value: string | boolean | Parent[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleParentChange = (index: number, field: keyof Parent, value: string) => {
    const newParents = [...formData.parents]
    newParents[index] = { ...newParents[index], [field]: value }
    handleChange('parents', newParents)
  }

  const handleCurrencyChange = (field: keyof ParentInfoData, value: string) => {
    const numericValue = parseCurrency(value)
    handleChange(field, numericValue)
  }

  const addParent = () => {
    if (formData.parents.length < 2) {
      handleChange('parents', [
        ...formData.parents,
        {
          id: Date.now().toString(),
          relationship: '',
          firstName: '',
          lastName: '',
          dateOfBirth: '',
          ssn: '',
          email: '',
          phone: '',
          highestEducation: '',
        },
      ])
    }
  }

  const removeParent = (index: number) => {
    if (formData.parents.length > 1) {
      const newParents = formData.parents.filter((_, i) => i !== index)
      handleChange('parents', newParents)
    }
  }

  const needsTwoParents = formData.maritalStatus === 'married' || formData.maritalStatus === 'unmarried-together'

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Validate first parent
    if (!formData.parents[0].firstName) newErrors['parent0FirstName'] = 'First name is required'
    if (!formData.parents[0].lastName) newErrors['parent0LastName'] = 'Last name is required'
    if (!formData.parents[0].dateOfBirth) newErrors['parent0DateOfBirth'] = 'Date of birth is required'
    
    // Validate marital status
    if (!formData.maritalStatus) newErrors.maritalStatus = 'Marital status is required'
    
    // Validate household
    if (!formData.householdSize) newErrors.householdSize = 'Household size is required'
    if (!formData.numberInCollege) newErrors.numberInCollege = 'Number in college is required'
    
    // Validate confirmation
    if (!formData.confirmParentInfo) newErrors.confirmParentInfo = 'Please confirm the information'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = async () => {
    if (!validateForm()) {
      return Promise.reject('Please complete all required fields')
    }
    console.log('Saving parent info:', formData)
  }

  return (
    <ApplicationWizard currentStep={5} onNext={handleNext}>
      <div className="space-y-8">
        {/* Introduction */}
        <Alert variant="info" title="Parent Information Required">
          <p>
            As a dependent student, you need to provide information about your parent(s). 
            This includes their income, assets, and household information from 2023.
          </p>
        </Alert>

        {/* Marital Status Section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Home className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-primary-darker">Parent Marital Status</h3>
          </div>
          <p className="text-sm text-gray-600 mb-6">
            What is your parents' current marital status?
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <Select
              label="Marital Status"
              value={formData.maritalStatus}
              onChange={(e) => handleChange('maritalStatus', e.target.value)}
              options={MARITAL_STATUS_OPTIONS}
              error={errors.maritalStatus}
              required
            />
            {(formData.maritalStatus === 'married' || formData.maritalStatus === 'unmarried-together') && (
              <Input
                label="Date of Marriage (if applicable)"
                type="date"
                value={formData.marriageDate}
                onChange={(e) => handleChange('marriageDate', e.target.value)}
              />
            )}
          </div>
        </section>

        {/* Parent Details Section */}
        <section className="border-t border-gray-200 pt-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold text-primary-darker">Parent Details</h3>
            </div>
            {!needsTwoParents && formData.parents.length < 2 && (
              <button
                type="button"
                onClick={addParent}
                className="text-sm text-primary hover:text-primary-dark flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add Second Parent
              </button>
            )}
          </div>

          {needsTwoParents && formData.parents.length === 1 && (
            <Alert variant="warning" title="Second Parent Required" className="mb-6">
              Based on your parents' marital status, you need to provide information for both parents.
              <button
                type="button"
                onClick={addParent}
                className="mt-2 text-sm font-medium text-warning-700 underline"
              >
                Add Second Parent
              </button>
            </Alert>
          )}

          {formData.parents.map((parent, index) => (
            <div 
              key={parent.id} 
              className={`p-6 bg-gray-50 rounded-lg ${index > 0 ? 'mt-6' : ''}`}
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-primary-darker">
                  Parent {index + 1}
                </h4>
                {formData.parents.length > 1 && !needsTwoParents && (
                  <button
                    type="button"
                    onClick={() => removeParent(index)}
                    className="text-sm text-error hover:text-error-700 flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </button>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Select
                  label="Relationship to You"
                  value={parent.relationship}
                  onChange={(e) => handleParentChange(index, 'relationship', e.target.value)}
                  options={RELATIONSHIP_OPTIONS}
                />
                <Select
                  label="Highest Level of Education"
                  value={parent.highestEducation}
                  onChange={(e) => handleParentChange(index, 'highestEducation', e.target.value)}
                  options={EDUCATION_OPTIONS}
                />
                <Input
                  label="First Name"
                  placeholder="Enter first name"
                  value={parent.firstName}
                  onChange={(e) => handleParentChange(index, 'firstName', e.target.value)}
                  error={errors[`parent${index}FirstName`]}
                  required
                />
                <Input
                  label="Last Name"
                  placeholder="Enter last name"
                  value={parent.lastName}
                  onChange={(e) => handleParentChange(index, 'lastName', e.target.value)}
                  error={errors[`parent${index}LastName`]}
                  required
                />
                <Input
                  label="Date of Birth"
                  type="date"
                  value={parent.dateOfBirth}
                  onChange={(e) => handleParentChange(index, 'dateOfBirth', e.target.value)}
                  error={errors[`parent${index}DateOfBirth`]}
                  required
                />
                <Input
                  label="Social Security Number"
                  type="password"
                  placeholder="XXX-XX-XXXX"
                  value={parent.ssn}
                  onChange={(e) => handleParentChange(index, 'ssn', e.target.value)}
                  autoComplete="off"
                />
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="parent@example.com"
                  value={parent.email}
                  onChange={(e) => handleParentChange(index, 'email', e.target.value)}
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={parent.phone}
                  onChange={(e) => handleParentChange(index, 'phone', e.target.value)}
                />
              </div>
            </div>
          ))}
        </section>

        {/* Household Section */}
        <section className="border-t border-gray-200 pt-8">
          <div className="flex items-center gap-2 mb-4">
            <Home className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-primary-darker">Household Information</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number in Household
                <Tooltip content="Include yourself, your parent(s), and anyone else they support">
                  <HelpCircle className="w-4 h-4 inline ml-1 text-gray-400" />
                </Tooltip>
              </label>
              <Input
                type="number"
                min="1"
                max="20"
                placeholder="Enter number"
                value={formData.householdSize}
                onChange={(e) => handleChange('householdSize', e.target.value)}
                error={errors.householdSize}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number in College (2024-25)
                <Tooltip content="Include yourself and any siblings in college at least half-time">
                  <HelpCircle className="w-4 h-4 inline ml-1 text-gray-400" />
                </Tooltip>
              </label>
              <Input
                type="number"
                min="1"
                max="10"
                placeholder="Enter number"
                value={formData.numberInCollege}
                onChange={(e) => handleChange('numberInCollege', e.target.value)}
                error={errors.numberInCollege}
                required
              />
            </div>
            <Select
              label="State of Legal Residence"
              value={formData.parentStateOfResidence}
              onChange={(e) => handleChange('parentStateOfResidence', e.target.value)}
              options={US_STATES}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Legal resident before Jan 1, 2019?
              </label>
              <div className="flex gap-6">
                <Radio
                  name="parentLegalResident"
                  value="yes"
                  label="Yes"
                  checked={formData.parentLegalResident === 'yes'}
                  onChange={(e) => handleChange('parentLegalResident', e.target.value)}
                />
                <Radio
                  name="parentLegalResident"
                  value="no"
                  label="No"
                  checked={formData.parentLegalResident === 'no'}
                  onChange={(e) => handleChange('parentLegalResident', e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Parent Tax Information */}
        <section className="border-t border-gray-200 pt-8">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-primary-darker">Parent Tax Information (2023)</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Select
              label="Tax Return Status"
              value={formData.parentTaxReturnStatus}
              onChange={(e) => handleChange('parentTaxReturnStatus', e.target.value)}
              options={TAX_RETURN_OPTIONS}
            />
            {formData.parentTaxReturnStatus && formData.parentTaxReturnStatus !== 'not-filing' && (
              <Select
                label="Filing Status"
                value={formData.parentFilingStatus}
                onChange={(e) => handleChange('parentFilingStatus', e.target.value)}
                options={FILING_STATUS_OPTIONS}
              />
            )}
          </div>

          {formData.parentTaxReturnStatus !== 'not-filing' && formData.parentTaxReturnStatus && (
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adjusted Gross Income (AGI)
                </label>
                <Input
                  placeholder="$0"
                  value={formData.parentAGI ? formatCurrency(formData.parentAGI) : ''}
                  onChange={(e) => handleCurrencyChange('parentAGI', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  U.S. Income Tax Paid
                </label>
                <Input
                  placeholder="$0"
                  value={formData.parentTaxPaid ? formatCurrency(formData.parentTaxPaid) : ''}
                  onChange={(e) => handleCurrencyChange('parentTaxPaid', e.target.value)}
                />
              </div>
            </div>
          )}
        </section>

        {/* Parent Income from Work */}
        <section className="border-t border-gray-200 pt-8">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-primary-darker">Parent Income from Work (2023)</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Parent 1 Income from Work
              </label>
              <Input
                placeholder="$0"
                value={formData.parent1Earnings ? formatCurrency(formData.parent1Earnings) : ''}
                onChange={(e) => handleCurrencyChange('parent1Earnings', e.target.value)}
              />
            </div>
            {formData.parents.length > 1 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parent 2 Income from Work
                </label>
                <Input
                  placeholder="$0"
                  value={formData.parent2Earnings ? formatCurrency(formData.parent2Earnings) : ''}
                  onChange={(e) => handleCurrencyChange('parent2Earnings', e.target.value)}
                />
              </div>
            )}
          </div>
        </section>

        {/* Parent Assets */}
        <section className="border-t border-gray-200 pt-8">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-primary-darker">Parent Assets</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Report your parents' current asset balances. Do not include retirement accounts or home value.
          </p>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cash, Savings, Checking
              </label>
              <Input
                placeholder="$0"
                value={formData.parentCashSavings ? formatCurrency(formData.parentCashSavings) : ''}
                onChange={(e) => handleCurrencyChange('parentCashSavings', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Investments
              </label>
              <Input
                placeholder="$0"
                value={formData.parentInvestments ? formatCurrency(formData.parentInvestments) : ''}
                onChange={(e) => handleCurrencyChange('parentInvestments', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business/Farm Net Worth
              </label>
              <Input
                placeholder="$0"
                value={formData.parentBusinessFarm ? formatCurrency(formData.parentBusinessFarm) : ''}
                onChange={(e) => handleCurrencyChange('parentBusinessFarm', e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Additional Questions */}
        <section className="border-t border-gray-200 pt-8">
          <h3 className="text-lg font-bold text-primary-darker mb-4">Additional Questions</h3>
          
          <div className="space-y-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-primary-darker mb-3">
                Is either parent a dislocated worker?
              </p>
              <div className="flex gap-6">
                <Radio
                  name="parentIsDislocatedWorker"
                  value="yes"
                  label="Yes"
                  checked={formData.parentIsDislocatedWorker === 'yes'}
                  onChange={(e) => handleChange('parentIsDislocatedWorker', e.target.value)}
                />
                <Radio
                  name="parentIsDislocatedWorker"
                  value="no"
                  label="No"
                  checked={formData.parentIsDislocatedWorker === 'no'}
                  onChange={(e) => handleChange('parentIsDislocatedWorker', e.target.value)}
                />
                <Radio
                  name="parentIsDislocatedWorker"
                  value="unsure"
                  label="Don't Know"
                  checked={formData.parentIsDislocatedWorker === 'unsure'}
                  onChange={(e) => handleChange('parentIsDislocatedWorker', e.target.value)}
                />
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-primary-darker mb-3">
                Did any parent receive means-tested federal benefits in 2022 or 2023?
              </p>
              <div className="flex gap-6">
                <Radio
                  name="parentReceivedBenefits"
                  value="yes"
                  label="Yes"
                  checked={formData.parentReceivedBenefits === 'yes'}
                  onChange={(e) => handleChange('parentReceivedBenefits', e.target.value)}
                />
                <Radio
                  name="parentReceivedBenefits"
                  value="no"
                  label="No"
                  checked={formData.parentReceivedBenefits === 'no'}
                  onChange={(e) => handleChange('parentReceivedBenefits', e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Confirmation */}
        <section className="border-t border-gray-200 pt-8">
          <div className="p-4 bg-gray-50 rounded-lg">
            <Checkbox
              label={
                <span>
                  I confirm that the parent information provided is accurate. I understand that my 
                  parent(s) will need to sign this FAFSA with their own FSA ID before it can be submitted.
                </span>
              }
              checked={formData.confirmParentInfo}
              onChange={(e) => handleChange('confirmParentInfo', e.target.checked)}
            />
            {errors.confirmParentInfo && (
              <p className="mt-2 text-sm text-error flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.confirmParentInfo}
              </p>
            )}
          </div>
        </section>
      </div>
    </ApplicationWizard>
  )
}

