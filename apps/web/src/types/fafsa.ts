export interface Student {
  id: string
  email: string
  firstName: string
  lastName: string
  ssn?: string
  dateOfBirth?: string
  phoneNumber?: string
  address?: Address
  createdAt: Date
  updatedAt: Date
}

export interface Address {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

export interface FAFSAApplication {
  id: string
  studentId: string
  status: ApplicationStatus
  currentStep: number
  completionPercentage: number
  
  // Student Information
  studentInfo?: StudentInfo
  
  // Dependency Status
  dependencyStatus?: DependencyStatus
  
  // Financial Information
  financialInfo?: FinancialInfo
  
  // Parent Information (if dependent)
  parentInfo?: ParentInfo
  
  // School Selection
  schools?: SchoolSelection[]
  
  createdAt: Date
  updatedAt: Date
  submittedAt?: Date
}

export type ApplicationStatus =
  | 'draft'
  | 'in-progress'
  | 'review'
  | 'submitted'
  | 'verified'
  | 'corrections-needed'

export interface StudentInfo {
  ssn: string
  firstName: string
  middleName?: string
  lastName: string
  dateOfBirth: string
  phoneNumber: string
  email: string
  address: Address
  
  // Additional Info
  citizenship: 'us-citizen' | 'eligible-noncitizen' | 'other'
  alienRegistrationNumber?: string
  maritalStatus: 'single' | 'married' | 'separated' | 'divorced' | 'widowed'
  maritalStatusDate?: string
  driversLicenseNumber?: string
  driversLicenseState?: string
  
  // Education
  highSchoolName?: string
  highSchoolCity?: string
  highSchoolState?: string
  highSchoolCompletionDate?: string
  highSchoolCompletionType: 'diploma' | 'ged' | 'homeschool' | 'in-progress'
  
  // Selective Service (males 18-25)
  selectiveServiceRegistered?: boolean
}

export interface DependencyStatus {
  isIndependent: boolean
  independenceReasons?: IndependenceReason[]
}

export type IndependenceReason =
  | 'age-24-or-older'
  | 'married'
  | 'graduate-student'
  | 'active-military'
  | 'veteran'
  | 'has-dependents'
  | 'orphan-ward-of-court'
  | 'emancipated-minor'
  | 'homeless'

export interface FinancialInfo {
  // Tax Information
  taxYear: number
  filedTaxReturn: boolean
  taxReturnType?: '1040' | '1040A' | '1040EZ'
  adjustedGrossIncome: number
  incomeTaxPaid: number
  untaxedIncome: UntaxedIncome
  
  // Assets
  cashSavingsChecking: number
  investmentNetWorth: number
  businessFarmNetWorth: number
  
  // Additional Information
  receivedFederalBenefits: boolean
  dislocatedWorker: boolean
}

export interface UntaxedIncome {
  childSupportReceived: number
  interestIncome: number
  veteransBenefits: number
  otherUntaxedIncome: number
}

export interface ParentInfo {
  // Parent 1
  parent1FirstName: string
  parent1LastName: string
  parent1SSN: string
  parent1DateOfBirth: string
  parent1Email: string
  
  // Parent 2 (if applicable)
  parent2FirstName?: string
  parent2LastName?: string
  parent2SSN?: string
  parent2DateOfBirth?: string
  parent2Email?: string
  
  // Marital Status
  maritalStatus: 'married' | 'remarried' | 'single' | 'divorced' | 'separated' | 'widowed'
  
  // Household Information
  householdSize: number
  numberInCollege: number
  
  // Financial Information
  financialInfo: FinancialInfo
}

export interface SchoolSelection {
  federalSchoolCode: string
  schoolName: string
  housingPlan: 'on-campus' | 'off-campus' | 'with-parent'
  priority: number
}

export interface School {
  id: string
  federalSchoolCode: string
  name: string
  city: string
  state: string
  zipCode: string
  
  // Financial Aid Info
  fafsaPriorityDeadline?: string
  cssProfileRequired: boolean
  averageAidPackage?: number
  percentReceivingAid?: number
  meetsFullNeed: boolean
  
  // Contact
  financialAidPhone?: string
  financialAidEmail?: string
  website?: string
}

export interface ValidationError {
  field: string
  message: string
  severity: 'error' | 'warning' | 'info'
}

export interface EFCCalculation {
  efc: number
  breakdown: {
    parentContribution: number
    studentContribution: number
    assetContribution: number
  }
  notes: string[]
}
