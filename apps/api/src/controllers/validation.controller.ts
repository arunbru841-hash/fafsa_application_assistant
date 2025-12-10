import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { AppError } from '../middleware/errorHandler'
import { logger } from '../utils/logger'

// SSN validation helper
const isValidSSN = (ssn: string): boolean => {
  const cleaned = ssn.replace(/[-\s]/g, '')
  if (!/^\d{9}$/.test(cleaned)) return false
  const areaNumber = parseInt(cleaned.substring(0, 3), 10)
  if (areaNumber === 0 || areaNumber === 666 || areaNumber >= 900) return false
  if (cleaned.substring(3, 5) === '00') return false
  if (cleaned.substring(5, 9) === '0000') return false
  return true
}

// US State codes
const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
  'DC', 'PR', 'VI', 'GU', 'AS', 'MP'
]

// Extended field validation rules
const validationRules: Record<string, z.ZodSchema> = {
  ssn: z.string()
    .regex(/^\d{3}-?\d{2}-?\d{4}$/, 'SSN must be 9 digits (XXX-XX-XXXX format)')
    .refine(isValidSSN, 'Invalid SSN. Cannot start with 000, 666, or 900-999.'),
  
  email: z.string()
    .email('Invalid email address')
    .max(254, 'Email too long'),
  
  zipCode: z.string()
    .regex(/^\d{5}(-\d{4})?$/, 'ZIP code must be 5 or 9 digits (XXXXX or XXXXX-XXXX)'),
  
  phone: z.string()
    .regex(/^1?\d{10}$|^\d{3}[-.\s]?\d{3}[-.\s]?\d{4}$/, 'Phone must be 10 digits'),
  
  date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .refine((val: string) => !isNaN(new Date(val).getTime()), 'Invalid date'),
  
  dateOfBirth: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .refine((val: string) => {
      const dob = new Date(val)
      const today = new Date()
      return dob < today
    }, 'Date of birth must be in the past'),
  
  state: z.string()
    .length(2, 'State must be 2-letter code')
    .toUpperCase()
    .refine((val: string) => US_STATES.includes(val.toUpperCase()), 'Invalid state code'),
  
  federalSchoolCode: z.string()
    .regex(/^[A-Z]\d{5}$|^\d{6}$|^\d{8}$/, 'Invalid federal school code format'),
  
  income: z.number()
    .min(0, 'Income cannot be negative')
    .max(100000000, 'Income exceeds maximum'),
  
  assets: z.number()
    .min(0, 'Assets cannot be negative')
    .max(1000000000, 'Assets exceed maximum'),
  
  ein: z.string()
    .regex(/^\d{2}-?\d{7}$/, 'EIN must be 9 digits (XX-XXXXXXX format)'),
  
  firstName: z.string()
    .min(1, 'First name is required')
    .max(35, 'First name too long')
    .regex(/^[a-zA-Z\s\-']+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
  
  lastName: z.string()
    .min(1, 'Last name is required')
    .max(35, 'Last name too long')
    .regex(/^[a-zA-Z\s\-']+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
  
  driverLicense: z.string()
    .min(1, 'Driver license number is required')
    .max(20, 'Driver license number too long'),
  
  alienRegistration: z.string()
    .regex(/^[A-Za-z]\d{8,9}$/, 'Alien Registration Number must start with a letter followed by 8-9 digits'),
}

// Field-specific warning generators
const getFieldWarnings = (fieldName: string, value: unknown): string[] => {
  const warnings: string[] = []
  
  if (fieldName === 'email' && typeof value === 'string') {
    const domain = value.split('@')[1]?.toLowerCase()
    const typos: Record<string, string> = {
      'gmial.com': 'gmail.com',
      'gmal.com': 'gmail.com',
      'gamil.com': 'gmail.com',
      'yaho.com': 'yahoo.com',
      'hotmal.com': 'hotmail.com',
      'outlok.com': 'outlook.com',
    }
    if (domain && typos[domain]) {
      warnings.push(`Did you mean ${typos[domain]}?`)
    }
  }
  
  if (fieldName === 'dateOfBirth' && typeof value === 'string') {
    const dob = new Date(value)
    const age = Math.floor((Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    if (age >= 24) {
      warnings.push('Based on your age, you may qualify as an independent student.')
    }
    if (age < 18) {
      warnings.push('Students under 18 typically need parent information for FAFSA.')
    }
  }
  
  return warnings
}

export const validateField = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { fieldName, value } = req.body

    if (!fieldName || value === undefined) {
      throw new AppError('Field name and value are required', 400)
    }

    const rule = validationRules[fieldName]
    if (!rule) {
      // Unknown field - return valid with warning
      logger.warn(`Unknown validation field: ${fieldName}`)
      res.json({ 
        valid: true, 
        errors: [],
        warnings: ['No validation rules defined for this field'],
      })
      return
    }

    const result = rule.safeParse(value)
    const warnings = getFieldWarnings(fieldName, value)

    if (!result.success) {
      logger.info(`Field validation failed: ${fieldName}`)
      res.json({
        valid: false,
        errors: result.error.errors.map((e: z.ZodIssue) => e.message),
        warnings,
      })
      return
    }

    logger.info(`Field validation passed: ${fieldName}`)
    res.json({ 
      valid: true, 
      errors: [],
      warnings: warnings.length > 0 ? warnings : undefined,
    })
  } catch (error) {
    next(error)
  }
}

// EFC Calculation (2024-25 Federal Methodology - Simplified)
export const calculateEFC = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const efcSchema = z.object({
      parentIncome: z.number().min(0).default(0),
      studentIncome: z.number().min(0).default(0),
      parentAssets: z.number().min(0).default(0),
      studentAssets: z.number().min(0).default(0),
      householdSize: z.number().min(1).max(20).default(1),
      numberInCollege: z.number().min(1).max(10).default(1),
      isIndependent: z.boolean().default(false),
      maritalStatus: z.enum(['single', 'married', 'separated', 'divorced', 'widowed']).optional(),
      parentAge: z.number().min(20).max(100).optional(),
      stateOfResidency: z.string().length(2).optional(),
    })

    const validation = efcSchema.safeParse(req.body)
    if (!validation.success) {
      throw new AppError('Invalid EFC calculation input', 400)
    }

    const {
      parentIncome,
      studentIncome,
      parentAssets,
      studentAssets,
      householdSize,
      numberInCollege,
      isIndependent,
    } = validation.data

    // Income Protection Allowances (2024-25 estimates)
    const studentIPA = 7040 // Single student
    const parentIPATable: Record<number, number> = {
      2: 19370,
      3: 24120,
      4: 29790,
      5: 35150,
      6: 41110,
    }
    const parentIPA = parentIPATable[Math.min(householdSize, 6)] || 41110 + (householdSize - 6) * 4640

    // Asset Protection Allowance (simplified - varies by parent age)
    const parentAPA = 5000

    // Calculate Available Income
    const studentAvailableIncome = Math.max(0, studentIncome - studentIPA) * 0.5
    const parentAvailableIncome = isIndependent 
      ? 0 
      : Math.max(0, parentIncome - parentIPA) * 0.22

    // Calculate Available Assets
    const studentAvailableAssets = studentAssets * 0.2
    const parentAvailableAssets = isIndependent 
      ? 0 
      : Math.max(0, parentAssets - parentAPA) * 0.056

    // Total Contribution
    let totalContribution = 
      studentAvailableIncome + 
      parentAvailableIncome + 
      studentAvailableAssets + 
      parentAvailableAssets

    // Adjust for number in college
    const efc = Math.round(Math.max(0, totalContribution / numberInCollege))

    // Pell Grant eligibility (2024-25)
    const pellMaxEFC = 6656
    const pellMaxGrant = 7395
    const pellGrantEligible = efc <= pellMaxEFC
    let estimatedPellGrant = 0
    
    if (pellGrantEligible) {
      if (efc === 0) {
        estimatedPellGrant = pellMaxGrant
      } else {
        // Simplified calculation
        estimatedPellGrant = Math.max(0, pellMaxGrant - efc)
      }
    }

    logger.info(`EFC calculated: ${efc}`)

    res.json({
      efc,
      formattedEFC: new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: 'USD',
        maximumFractionDigits: 0 
      }).format(efc),
      breakdown: {
        studentIncomeContribution: Math.round(studentAvailableIncome),
        parentIncomeContribution: Math.round(parentAvailableIncome),
        studentAssetContribution: Math.round(studentAvailableAssets),
        parentAssetContribution: Math.round(parentAvailableAssets),
        totalBeforeAdjustment: Math.round(totalContribution),
        numberInCollegeAdjustment: numberInCollege,
      },
      eligibility: {
        pellGrant: {
          eligible: pellGrantEligible,
          estimatedAmount: estimatedPellGrant,
          formattedAmount: new Intl.NumberFormat('en-US', { 
            style: 'currency', 
            currency: 'USD',
            maximumFractionDigits: 0 
          }).format(estimatedPellGrant),
          maxGrant: pellMaxGrant,
        },
        fseog: {
          eligible: efc === 0,
          note: 'Federal Supplemental Educational Opportunity Grant is for students with exceptional financial need (zero EFC)',
        },
        workStudy: {
          eligible: efc <= 10000,
          note: 'Federal Work-Study eligibility varies by school',
        },
        subsidizedLoans: {
          eligible: true,
          note: 'Most students qualify for some Direct Subsidized Loans based on financial need',
        },
      },
      notes: [
        'This is an estimated EFC using the 2024-25 federal methodology.',
        'Actual EFC may vary based on additional factors.',
        'Schools may use different formulas for institutional aid.',
        'Changes to income or family size can significantly affect EFC.',
        isIndependent 
          ? 'Calculated as independent student (no parent contribution).'
          : 'Calculated as dependent student (includes parent contribution).',
      ],
      methodology: 'Federal Methodology (FM) - Simplified',
      year: '2024-25',
    })
  } catch (error) {
    next(error)
  }
}
