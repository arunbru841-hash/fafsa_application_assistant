import { Router, Request, Response, NextFunction } from 'express'
import { validateField, calculateEFC } from '../controllers/validation.controller'
import { z } from 'zod'
import { logger } from '../utils/logger'

const router = Router()

// POST /api/validation/field - Validate a single field
router.post('/field', validateField)

// POST /api/validation/calculate-efc - Calculate Expected Family Contribution
router.post('/calculate-efc', calculateEFC)

// POST /api/validation/batch - Validate multiple fields at once
router.post('/batch', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { fields } = req.body

    if (!Array.isArray(fields) || fields.length === 0) {
      return res.status(400).json({
        error: 'Fields array is required',
        example: {
          fields: [
            { fieldName: 'email', value: 'user@example.com' },
            { fieldName: 'phone', value: '5551234567' },
          ],
        },
      })
    }

    // Limit batch size
    if (fields.length > 50) {
      return res.status(400).json({
        error: 'Too many fields. Maximum 50 fields per batch.',
      })
    }

    const results: Record<string, { valid: boolean; errors: string[]; warnings?: string[] }> = {}
    let allValid = true

    for (const field of fields) {
      const { fieldName, value } = field
      if (!fieldName) continue

      // Mock validation (use actual validation logic)
      const isValid = value !== undefined && value !== ''
      results[fieldName] = {
        valid: isValid,
        errors: isValid ? [] : [`${fieldName} is required`],
      }
      if (!isValid) allValid = false
    }

    logger.info(`Batch validation: ${fields.length} fields, allValid: ${allValid}`)

    res.json({
      valid: allValid,
      results,
      summary: {
        total: fields.length,
        passed: Object.values(results).filter(r => r.valid).length,
        failed: Object.values(results).filter(r => !r.valid).length,
      },
    })
  } catch (error) {
    next(error)
  }
})

// GET /api/validation/rules - Get available validation rules
router.get('/rules', (_req: Request, res: Response) => {
  res.json({
    availableFields: [
      { field: 'ssn', format: 'XXX-XX-XXXX', description: 'Social Security Number' },
      { field: 'email', format: 'user@domain.com', description: 'Email address' },
      { field: 'phone', format: 'XXXXXXXXXX', description: '10-digit phone number' },
      { field: 'zipCode', format: 'XXXXX or XXXXX-XXXX', description: 'ZIP code' },
      { field: 'date', format: 'YYYY-MM-DD', description: 'Date' },
      { field: 'dateOfBirth', format: 'YYYY-MM-DD', description: 'Date of birth (must be in past)' },
      { field: 'state', format: 'XX', description: 'US state 2-letter code' },
      { field: 'federalSchoolCode', format: 'XXXXXX', description: 'Federal school code' },
      { field: 'income', format: 'number', description: 'Income amount (0-100,000,000)' },
      { field: 'assets', format: 'number', description: 'Asset amount (0-1,000,000,000)' },
      { field: 'ein', format: 'XX-XXXXXXX', description: 'Employer Identification Number' },
      { field: 'firstName', format: 'string', description: 'First name (letters only)' },
      { field: 'lastName', format: 'string', description: 'Last name (letters only)' },
      { field: 'driverLicense', format: 'string', description: 'Driver license number' },
      { field: 'alienRegistration', format: 'AXXXXXXXX', description: 'Alien Registration Number' },
    ],
    efcCalculation: {
      endpoint: '/api/validation/calculate-efc',
      method: 'POST',
      requiredFields: ['householdSize', 'numberInCollege'],
      optionalFields: [
        'parentIncome',
        'studentIncome', 
        'parentAssets',
        'studentAssets',
        'isIndependent',
        'maritalStatus',
        'parentAge',
        'stateOfResidency',
      ],
    },
  })
})

// POST /api/validation/dependency-status - Determine dependency status
router.post('/dependency-status', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dependencySchema = z.object({
      dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      isMarried: z.boolean(),
      hasChildren: z.boolean(),
      isVeteran: z.boolean(),
      isOrphan: z.boolean(),
      isEmancipated: z.boolean(),
      isHomeless: z.boolean(),
      isGraduateStudent: z.boolean(),
      isActiveOrReserveMilitary: z.boolean(),
    })

    const validation = dependencySchema.safeParse(req.body)
    if (!validation.success) {
      return res.status(400).json({
        error: 'Invalid input',
        details: validation.error.errors,
      })
    }

    const data = validation.data
    const dob = new Date(data.dateOfBirth)
    const today = new Date()
    const age = Math.floor((today.getTime() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000))

    // Determine if student is independent based on criteria
    const independenceReasons: string[] = []
    
    if (age >= 24) independenceReasons.push('Age 24 or older')
    if (data.isMarried) independenceReasons.push('Married')
    if (data.hasChildren) independenceReasons.push('Has children or legal dependents')
    if (data.isVeteran) independenceReasons.push('U.S. veteran or active duty')
    if (data.isOrphan) independenceReasons.push('Orphan or ward of the court')
    if (data.isEmancipated) independenceReasons.push('Legally emancipated minor')
    if (data.isHomeless) independenceReasons.push('Homeless or at risk of homelessness')
    if (data.isGraduateStudent) independenceReasons.push('Graduate or professional student')
    if (data.isActiveOrReserveMilitary) independenceReasons.push('Active duty military or reserve')

    const isIndependent = independenceReasons.length > 0

    logger.info(`Dependency status check: ${isIndependent ? 'independent' : 'dependent'}`)

    res.json({
      status: isIndependent ? 'independent' : 'dependent',
      reasons: independenceReasons,
      age,
      requiresParentInfo: !isIndependent,
      message: isIndependent
        ? 'Based on your answers, you may be considered an independent student for FAFSA purposes.'
        : 'Based on your answers, you are considered a dependent student and will need to provide parent information.',
      note: 'This is a preliminary assessment. The Department of Education makes the final determination.',
    })
  } catch (error) {
    next(error)
  }
})

export default router
