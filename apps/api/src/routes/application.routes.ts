import { Router, Response, NextFunction } from 'express'
import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid'
import { authenticate, AuthRequest } from '../middleware/auth'
import { logger } from '../utils/logger'

const router = Router()

// In-memory storage (replace with database in production)
const applications: Map<string, Application> = new Map()

// Types
interface Application {
  id: string
  userId: string
  academicYear: string
  status: 'draft' | 'in-progress' | 'submitted' | 'processed' | 'corrections-needed'
  currentStep: number
  data: ApplicationData
  createdAt: Date
  updatedAt: Date
  submittedAt?: Date
}

interface ApplicationData {
  studentInfo?: StudentInfo
  dependencyStatus?: DependencyStatus
  financialInfo?: FinancialInfo
  parentInfo?: ParentInfo[]
  schoolSelections?: SchoolSelection[]
}

interface StudentInfo {
  firstName: string
  lastName: string
  middleName?: string
  suffix?: string
  dateOfBirth: string
  ssn?: string
  email: string
  phone: string
  address: Address
  citizenship: string
  maritalStatus: string
  stateOfResidence: string
}

interface Address {
  street: string
  city: string
  state: string
  zip: string
  country: string
}

interface DependencyStatus {
  isIndependent: boolean
  answers: Record<string, boolean>
  overrideReason?: string
}

interface FinancialInfo {
  taxFilingStatus: string
  agi: number
  taxesPaid: number
  untaxedIncome: number
  assets: number
  cashAndSavings: number
  investmentValue: number
  businessValue: number
}

interface ParentInfo {
  parentNumber: 1 | 2
  firstName: string
  lastName: string
  dateOfBirth: string
  ssn?: string
  email?: string
  maritalStatus: string
  occupation?: string
  employer?: string
  financialInfo?: FinancialInfo
}

interface SchoolSelection {
  schoolId: string
  schoolName: string
  housingPlan: 'on-campus' | 'off-campus' | 'with-parent'
  priority: number
}

// Validation schemas
const createApplicationSchema = z.object({
  academicYear: z.string().regex(/^\d{4}-\d{4}$/, 'Academic year must be in format YYYY-YYYY'),
})

const updateApplicationSchema = z.object({
  currentStep: z.number().min(1).max(7).optional(),
  studentInfo: z.object({
    firstName: z.string().min(1).max(100),
    lastName: z.string().min(1).max(100),
    middleName: z.string().max(100).optional(),
    suffix: z.string().max(10).optional(),
    dateOfBirth: z.string(),
    ssn: z.string().regex(/^\d{3}-\d{2}-\d{4}$/).optional(),
    email: z.string().email(),
    phone: z.string(),
    address: z.object({
      street: z.string(),
      city: z.string(),
      state: z.string().length(2),
      zip: z.string().regex(/^\d{5}(-\d{4})?$/),
      country: z.string().default('US'),
    }),
    citizenship: z.string(),
    maritalStatus: z.string(),
    stateOfResidence: z.string().length(2),
  }).optional(),
  dependencyStatus: z.object({
    isIndependent: z.boolean(),
    answers: z.record(z.boolean()),
    overrideReason: z.string().optional(),
  }).optional(),
  financialInfo: z.object({
    taxFilingStatus: z.string(),
    agi: z.number(),
    taxesPaid: z.number(),
    untaxedIncome: z.number(),
    assets: z.number(),
    cashAndSavings: z.number(),
    investmentValue: z.number(),
    businessValue: z.number(),
  }).optional(),
  parentInfo: z.array(z.object({
    parentNumber: z.union([z.literal(1), z.literal(2)]),
    firstName: z.string(),
    lastName: z.string(),
    dateOfBirth: z.string(),
    ssn: z.string().optional(),
    email: z.string().email().optional(),
    maritalStatus: z.string(),
    occupation: z.string().optional(),
    employer: z.string().optional(),
    financialInfo: z.object({
      taxFilingStatus: z.string(),
      agi: z.number(),
      taxesPaid: z.number(),
      untaxedIncome: z.number(),
      assets: z.number(),
      cashAndSavings: z.number(),
      investmentValue: z.number(),
      businessValue: z.number(),
    }).optional(),
  })).optional(),
  schoolSelections: z.array(z.object({
    schoolId: z.string(),
    schoolName: z.string(),
    housingPlan: z.enum(['on-campus', 'off-campus', 'with-parent']),
    priority: z.number().min(1).max(10),
  })).max(10).optional(),
}).partial()

// All routes require authentication
router.use(authenticate)

// GET /api/applications - List all applications for the authenticated user
router.get('/', async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }

    const userApplications = Array.from(applications.values())
      .filter(app => app.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    logger.info(`User ${userId} retrieved ${userApplications.length} applications`)

    res.json({
      applications: userApplications.map(app => ({
        id: app.id,
        academicYear: app.academicYear,
        status: app.status,
        currentStep: app.currentStep,
        createdAt: app.createdAt,
        updatedAt: app.updatedAt,
        submittedAt: app.submittedAt,
        progress: Math.round((app.currentStep / 7) * 100),
      })),
      total: userApplications.length,
    })
  } catch (error) {
    next(error)
  }
})

// POST /api/applications - Create a new application
router.post('/', async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }

    const validation = createApplicationSchema.safeParse(req.body)
    if (!validation.success) {
      res.status(400).json({
        error: 'Validation failed',
        details: validation.error.errors,
      })
      return
    }

    const { academicYear } = validation.data

    // Check if user already has an application for this academic year
    const existingApp = Array.from(applications.values()).find(
      app => app.userId === userId && app.academicYear === academicYear
    )

    if (existingApp) {
      res.status(409).json({
        error: 'Conflict',
        message: `You already have an application for ${academicYear}`,
        existingApplicationId: existingApp.id,
      })
      return
    }

    const newApplication: Application = {
      id: uuidv4(),
      userId,
      academicYear,
      status: 'draft',
      currentStep: 1,
      data: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    applications.set(newApplication.id, newApplication)
    
    logger.info(`User ${userId} created new application ${newApplication.id} for ${academicYear}`)

    res.status(201).json({
      message: 'Application created successfully',
      application: {
        id: newApplication.id,
        academicYear: newApplication.academicYear,
        status: newApplication.status,
        currentStep: newApplication.currentStep,
        createdAt: newApplication.createdAt,
      },
    })
  } catch (error) {
    next(error)
  }
})

// GET /api/applications/:id - Get a specific application
router.get('/:id', async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId
    const { id } = req.params

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }

    const application = applications.get(id)
    
    if (!application) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Application not found',
      })
      return
    }

    if (application.userId !== userId) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have access to this application',
      })
      return
    }

    logger.info(`User ${userId} retrieved application ${id}`)

    res.json({
      application: {
        id: application.id,
        academicYear: application.academicYear,
        status: application.status,
        currentStep: application.currentStep,
        data: application.data,
        createdAt: application.createdAt,
        updatedAt: application.updatedAt,
        submittedAt: application.submittedAt,
        progress: Math.round((application.currentStep / 7) * 100),
      },
    })
  } catch (error) {
    next(error)
  }
})

// PATCH /api/applications/:id - Update an application
router.patch('/:id', async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId
    const { id } = req.params

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }

    const application = applications.get(id)
    
    if (!application) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Application not found',
      })
      return
    }

    if (application.userId !== userId) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have access to this application',
      })
      return
    }

    if (application.status === 'submitted') {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Cannot modify a submitted application',
      })
      return
    }

    const validation = updateApplicationSchema.safeParse(req.body)
    if (!validation.success) {
      res.status(400).json({
        error: 'Validation failed',
        details: validation.error.errors,
      })
      return
    }

    const updates = validation.data

    // Apply updates
    if (updates.currentStep !== undefined) {
      application.currentStep = updates.currentStep
    }
    if (updates.studentInfo) {
      application.data.studentInfo = { ...application.data.studentInfo, ...updates.studentInfo } as StudentInfo
    }
    if (updates.dependencyStatus) {
      application.data.dependencyStatus = updates.dependencyStatus
    }
    if (updates.financialInfo) {
      application.data.financialInfo = updates.financialInfo
    }
    if (updates.parentInfo) {
      application.data.parentInfo = updates.parentInfo as ParentInfo[]
    }
    if (updates.schoolSelections) {
      application.data.schoolSelections = updates.schoolSelections as SchoolSelection[]
    }

    application.updatedAt = new Date()
    application.status = application.currentStep > 1 ? 'in-progress' : 'draft'

    applications.set(id, application)

    logger.info(`User ${userId} updated application ${id}`)

    res.json({
      message: 'Application updated successfully',
      application: {
        id: application.id,
        status: application.status,
        currentStep: application.currentStep,
        updatedAt: application.updatedAt,
        progress: Math.round((application.currentStep / 7) * 100),
      },
    })
  } catch (error) {
    next(error)
  }
})

// POST /api/applications/:id/submit - Submit an application
router.post('/:id/submit', async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId
    const { id } = req.params

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }

    const application = applications.get(id)
    
    if (!application) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Application not found',
      })
      return
    }

    if (application.userId !== userId) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have access to this application',
      })
      return
    }

    if (application.status === 'submitted') {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Application already submitted',
      })
      return
    }

    // Validate completeness
    const errors: string[] = []
    if (!application.data.studentInfo) errors.push('Student information is required')
    if (!application.data.dependencyStatus) errors.push('Dependency status is required')
    if (!application.data.financialInfo) errors.push('Financial information is required')
    if (!application.data.schoolSelections?.length) errors.push('At least one school selection is required')
    
    if (application.data.dependencyStatus?.isIndependent === false && !application.data.parentInfo?.length) {
      errors.push('Parent information is required for dependent students')
    }

    if (errors.length > 0) {
      res.status(400).json({
        error: 'Incomplete Application',
        message: 'Please complete all required sections before submitting',
        missingFields: errors,
      })
      return
    }

    application.status = 'submitted'
    application.submittedAt = new Date()
    application.updatedAt = new Date()
    application.currentStep = 7

    applications.set(id, application)

    logger.info(`User ${userId} submitted application ${id}`)

    res.json({
      message: 'Application submitted successfully',
      application: {
        id: application.id,
        status: application.status,
        submittedAt: application.submittedAt,
        confirmationNumber: `FAFSA-${application.academicYear.replace('-', '')}-${application.id.substring(0, 8).toUpperCase()}`,
      },
    })
  } catch (error) {
    next(error)
  }
})

// DELETE /api/applications/:id - Delete a draft application
router.delete('/:id', async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId
    const { id } = req.params

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }

    const application = applications.get(id)
    
    if (!application) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Application not found',
      })
      return
    }

    if (application.userId !== userId) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have access to this application',
      })
      return
    }

    if (application.status === 'submitted') {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Cannot delete a submitted application',
      })
      return
    }

    applications.delete(id)

    logger.info(`User ${userId} deleted application ${id}`)

    res.json({
      message: 'Application deleted successfully',
    })
  } catch (error) {
    next(error)
  }
})

export default router
