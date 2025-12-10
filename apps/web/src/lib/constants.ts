export const US_STATES = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' },
  { code: 'DC', name: 'District of Columbia' },
]

export const MARITAL_STATUS_OPTIONS = [
  { value: 'single', label: 'Single' },
  { value: 'married', label: 'Married/Remarried' },
  { value: 'separated', label: 'Separated' },
  { value: 'divorced', label: 'Divorced' },
  { value: 'widowed', label: 'Widowed' },
]

export const CITIZENSHIP_OPTIONS = [
  { value: 'us-citizen', label: 'U.S. Citizen' },
  { value: 'eligible-noncitizen', label: 'Eligible Noncitizen' },
  { value: 'other', label: 'Other' },
]

export const HIGH_SCHOOL_COMPLETION_OPTIONS = [
  { value: 'diploma', label: 'High School Diploma' },
  { value: 'ged', label: 'GED' },
  { value: 'homeschool', label: 'Homeschooled' },
  { value: 'in-progress', label: 'Will Graduate This Year' },
]

export const HOUSING_PLAN_OPTIONS = [
  { value: 'on-campus', label: 'On Campus' },
  { value: 'off-campus', label: 'Off Campus' },
  { value: 'with-parent', label: 'With Parent' },
]

export const DEPENDENCY_QUESTIONS = [
  {
    id: 'age',
    question: 'Were you born before January 1, 2002?',
    reason: 'age-24-or-older' as const,
  },
  {
    id: 'married',
    question: 'Are you married as of today?',
    reason: 'married' as const,
  },
  {
    id: 'graduate',
    question: 'Will you be working on a master\'s or doctorate program during the 2025-2026 school year?',
    reason: 'graduate-student' as const,
  },
  {
    id: 'military',
    question: 'Are you currently serving on active duty in the U.S. Armed Forces for purposes other than training?',
    reason: 'active-military' as const,
  },
  {
    id: 'veteran',
    question: 'Are you a veteran of the U.S. Armed Forces?',
    reason: 'veteran' as const,
  },
  {
    id: 'dependents',
    question: 'Do you have children who will receive more than half of their support from you?',
    reason: 'has-dependents' as const,
  },
  {
    id: 'orphan',
    question: 'At any time since you turned age 13, were both your parents deceased, were you in foster care, or were you a dependent/ward of the court?',
    reason: 'orphan-ward-of-court' as const,
  },
  {
    id: 'emancipated',
    question: 'Are you or were you an emancipated minor as determined by a court?',
    reason: 'emancipated-minor' as const,
  },
  {
    id: 'homeless',
    question: 'Are you homeless or at risk of being homeless?',
    reason: 'homeless' as const,
  },
]

export const FAFSA_DEADLINES = {
  federal: '2026-06-30',
  applicationOpen: '2025-10-01',
}

export const HELP_TEXT = {
  ssn: 'Enter your 9-digit Social Security Number. This must match your Social Security card exactly.',
  dateOfBirth: 'Enter your date of birth as it appears on your Social Security card.',
  citizenship: 'U.S. citizens and eligible noncitizens can receive federal student aid. If you\'re unsure, select "Other" and we\'ll help you determine eligibility.',
  selectiveService: 'Males ages 18-25 must be registered with Selective Service to receive federal student aid. Register at sss.gov.',
  agi: 'Adjusted Gross Income (AGI) is found on line 11 of IRS Form 1040.',
  assets: 'Report current balances of all bank accounts, investments, and businesses. Do NOT include retirement accounts or your primary home.',
  householdSize: 'Include yourself, your parents, and other dependents who receive more than half their support from your parents.',
}
