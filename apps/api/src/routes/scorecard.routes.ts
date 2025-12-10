/**
 * College Scorecard API Routes
 * 
 * Provides endpoints for searching schools, getting school details,
 * and accessing financial aid information from the College Scorecard API.
 */

import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { logger } from '../utils/logger'
import {
  searchSchools,
  getSchoolById,
  getSchoolsNearZip,
  autocompleteSchools,
  getSchoolFinancialAid,
} from '../services/collegescorecard.service'

const router = Router()

// Validation schemas
const searchQuerySchema = z.object({
  q: z.string().optional(),
  state: z.string().length(2).optional(),
  city: z.string().optional(),
  zip: z.string().optional(),
  distance: z.coerce.number().positive().optional(),
  ownership: z.string().optional(), // comma-separated: 1,2,3
  degreeType: z.string().optional(), // comma-separated: 1,2,3,4
  minSize: z.coerce.number().positive().optional(),
  maxSize: z.coerce.number().positive().optional(),
  page: z.coerce.number().min(0).optional(),
  perPage: z.coerce.number().min(1).max(100).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
})

/**
 * @route GET /api/scorecard/schools
 * @desc Search for schools
 * @query q - Search query (school name)
 * @query state - Two-letter state code
 * @query city - City name
 * @query zip - ZIP code for geographic search
 * @query distance - Distance in miles (requires zip)
 * @query ownership - School type (1=public, 2=private nonprofit, 3=private for-profit)
 * @query degreeType - Degree type (1=certificate, 2=associate, 3=bachelor, 4=graduate)
 * @query minSize - Minimum student enrollment
 * @query maxSize - Maximum student enrollment
 * @query page - Page number (0-indexed)
 * @query perPage - Results per page (max 100)
 * @query sortBy - Field to sort by
 * @query sortOrder - asc or desc
 */
router.get('/schools', async (req: Request, res: Response): Promise<void> => {
  try {
    const validation = searchQuerySchema.safeParse(req.query)
    
    if (!validation.success) {
      res.status(400).json({
        success: false,
        error: 'Invalid query parameters',
        details: validation.error.errors,
      })
      return
    }

    const query = validation.data

    const result = await searchSchools({
      query: query.q,
      state: query.state,
      city: query.city,
      zip: query.zip,
      distance: query.distance,
      ownership: query.ownership ? query.ownership.split(',').map(Number) : undefined,
      degreeType: query.degreeType ? query.degreeType.split(',').map(Number) : undefined,
      minStudentSize: query.minSize,
      maxStudentSize: query.maxSize,
      page: query.page,
      perPage: query.perPage,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    })

    res.json({
      success: true,
      ...result,
    })
  } catch (error) {
    logger.error('Error searching schools:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to search schools',
    })
  }
})

/**
 * @route GET /api/scorecard/schools/autocomplete
 * @desc Autocomplete school names
 * @query q - Search query (minimum 3 characters)
 * @query limit - Maximum results (default 10)
 */
router.get('/schools/autocomplete', async (req: Request, res: Response): Promise<void> => {
  try {
    const query = req.query.q as string
    const limit = parseInt(req.query.limit as string) || 10

    if (!query || query.length < 3) {
      res.status(400).json({
        success: false,
        error: 'Query must be at least 3 characters',
      })
      return
    }

    const results = await autocompleteSchools(query, limit)

    res.json({
      success: true,
      results,
    })
  } catch (error) {
    logger.error('Error autocompleting schools:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to autocomplete schools',
    })
  }
})

/**
 * @route GET /api/scorecard/schools/near/:zip
 * @desc Get schools near a ZIP code
 * @param zip - ZIP code
 * @query distance - Distance in miles (default 50)
 */
router.get('/schools/near/:zip', async (req: Request, res: Response): Promise<void> => {
  try {
    const { zip } = req.params
    const distance = parseInt(req.query.distance as string) || 50

    if (!/^\d{5}$/.test(zip)) {
      res.status(400).json({
        success: false,
        error: 'Invalid ZIP code format',
      })
      return
    }

    const result = await getSchoolsNearZip(zip, distance)

    res.json({
      success: true,
      ...result,
    })
  } catch (error) {
    logger.error('Error getting schools near ZIP:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to get schools near ZIP code',
    })
  }
})

/**
 * @route GET /api/scorecard/schools/:id
 * @desc Get a single school by ID
 * @param id - School ID
 */
router.get('/schools/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id)

    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        error: 'Invalid school ID',
      })
      return
    }

    const school = await getSchoolById(id)

    if (!school) {
      res.status(404).json({
        success: false,
        error: 'School not found',
      })
      return
    }

    res.json({
      success: true,
      data: school,
    })
  } catch (error) {
    logger.error('Error getting school by ID:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to get school',
    })
  }
})

/**
 * @route GET /api/scorecard/schools/:id/financial-aid
 * @desc Get financial aid statistics for a school
 * @param id - School ID
 */
router.get('/schools/:id/financial-aid', async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id)

    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        error: 'Invalid school ID',
      })
      return
    }

    const financialAid = await getSchoolFinancialAid(id)

    if (!financialAid) {
      res.status(404).json({
        success: false,
        error: 'School not found',
      })
      return
    }

    res.json({
      success: true,
      data: financialAid,
    })
  } catch (error) {
    logger.error('Error getting school financial aid:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to get financial aid data',
    })
  }
})

export default router
