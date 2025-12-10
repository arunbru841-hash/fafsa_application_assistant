/**
 * Economic Data API Routes
 * 
 * Provides endpoints for accessing economic data from:
 * - U.S. Treasury Fiscal Data API (interest rates, debt data)
 * - FRED API (CPI, unemployment, economic indicators)
 */

import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { logger } from '../utils/logger'
import {
  getInterestRates,
  getLatestInterestRates,
  getDebtData,
  getStudentLoanRateContext,
  getInterestRateTrends,
} from '../services/treasury.service'
import {
  getInflationData,
  getEconomicIndicators,
  getTotalStudentLoans,
  getCPIHistory,
  adjustForInflation,
  getSeriesObservations,
  SERIES_IDS,
  getPovertyContext,
} from '../services/fred.service'

const router = Router()

// ============================================
// Treasury API Routes
// ============================================

/**
 * @route GET /api/economic/treasury/rates
 * @desc Get Treasury interest rates
 * @query startDate - Start date (YYYY-MM-DD)
 * @query endDate - End date (YYYY-MM-DD)
 * @query securityType - Type of security
 * @query limit - Maximum results
 */
router.get('/treasury/rates', async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDate, endDate, securityType, limit } = req.query

    const rates = await getInterestRates({
      startDate: startDate as string,
      endDate: endDate as string,
      securityType: securityType as string,
      limit: limit ? parseInt(limit as string) : undefined,
    })

    res.json({
      success: true,
      data: rates,
    })
  } catch (error) {
    logger.error('Error fetching Treasury rates:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch interest rates',
    })
  }
})

/**
 * @route GET /api/economic/treasury/rates/latest
 * @desc Get the most recent Treasury interest rates
 */
router.get('/treasury/rates/latest', async (_req: Request, res: Response): Promise<void> => {
  try {
    const rates = await getLatestInterestRates()

    res.json({
      success: true,
      data: rates,
    })
  } catch (error) {
    logger.error('Error fetching latest Treasury rates:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch latest interest rates',
    })
  }
})

/**
 * @route GET /api/economic/treasury/debt
 * @desc Get national debt data
 * @query startDate - Start date (YYYY-MM-DD)
 * @query endDate - End date (YYYY-MM-DD)
 * @query limit - Maximum results
 */
router.get('/treasury/debt', async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDate, endDate, limit } = req.query

    const debt = await getDebtData({
      startDate: startDate as string,
      endDate: endDate as string,
      limit: limit ? parseInt(limit as string) : undefined,
    })

    res.json({
      success: true,
      data: debt,
    })
  } catch (error) {
    logger.error('Error fetching debt data:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch debt data',
    })
  }
})

/**
 * @route GET /api/economic/treasury/rate-trends
 * @desc Get historical interest rate trends
 * @query years - Number of years of history (default 5)
 */
router.get('/treasury/rate-trends', async (req: Request, res: Response): Promise<void> => {
  try {
    const years = parseInt(req.query.years as string) || 5
    const trends = await getInterestRateTrends(years)

    res.json({
      success: true,
      data: trends,
    })
  } catch (error) {
    logger.error('Error fetching rate trends:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch rate trends',
    })
  }
})

// ============================================
// FRED API Routes
// ============================================

/**
 * @route GET /api/economic/fred/indicators
 * @desc Get current economic indicators
 */
router.get('/fred/indicators', async (_req: Request, res: Response): Promise<void> => {
  try {
    const indicators = await getEconomicIndicators()

    res.json({
      success: true,
      data: indicators,
    })
  } catch (error) {
    logger.error('Error fetching economic indicators:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch economic indicators',
    })
  }
})

/**
 * @route GET /api/economic/fred/inflation
 * @desc Get current inflation data (CPI)
 */
router.get('/fred/inflation', async (_req: Request, res: Response): Promise<void> => {
  try {
    const inflation = await getInflationData()

    res.json({
      success: true,
      data: inflation,
    })
  } catch (error) {
    logger.error('Error fetching inflation data:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch inflation data',
    })
  }
})

/**
 * @route GET /api/economic/fred/cpi-history
 * @desc Get historical CPI data
 * @query years - Number of years (default 10)
 */
router.get('/fred/cpi-history', async (req: Request, res: Response): Promise<void> => {
  try {
    const years = parseInt(req.query.years as string) || 10
    const history = await getCPIHistory(years)

    res.json({
      success: true,
      data: history,
    })
  } catch (error) {
    logger.error('Error fetching CPI history:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch CPI history',
    })
  }
})

/**
 * @route GET /api/economic/fred/student-loans
 * @desc Get total student loans outstanding
 */
router.get('/fred/student-loans', async (_req: Request, res: Response): Promise<void> => {
  try {
    const data = await getTotalStudentLoans()

    res.json({
      success: true,
      data,
    })
  } catch (error) {
    logger.error('Error fetching student loan data:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch student loan data',
    })
  }
})

/**
 * @route POST /api/economic/fred/adjust-inflation
 * @desc Adjust a dollar amount for inflation
 * @body amount - Dollar amount
 * @body fromYear - Year of the original amount
 * @body toYear - Target year (default: current year)
 */
router.post('/fred/adjust-inflation', async (req: Request, res: Response): Promise<void> => {
  try {
    const schema = z.object({
      amount: z.number().positive(),
      fromYear: z.number().min(1900).max(new Date().getFullYear()),
      toYear: z.number().min(1900).max(new Date().getFullYear()).optional(),
    })

    const validation = schema.safeParse(req.body)
    
    if (!validation.success) {
      res.status(400).json({
        success: false,
        error: 'Invalid request body',
        details: validation.error.errors,
      })
      return
    }

    const { amount, fromYear, toYear } = validation.data
    const adjusted = await adjustForInflation(amount, fromYear, toYear)

    res.json({
      success: true,
      data: {
        originalAmount: amount,
        fromYear,
        toYear: toYear || new Date().getFullYear(),
        adjustedAmount: adjusted,
        percentageChange: ((adjusted - amount) / amount) * 100,
      },
    })
  } catch (error) {
    logger.error('Error adjusting for inflation:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to adjust for inflation',
    })
  }
})

/**
 * @route GET /api/economic/fred/series/:seriesId
 * @desc Get observations for any FRED series
 * @param seriesId - FRED series ID
 * @query startDate - Start date (YYYY-MM-DD)
 * @query endDate - End date (YYYY-MM-DD)
 * @query limit - Maximum results
 */
router.get('/fred/series/:seriesId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { seriesId } = req.params
    const { startDate, endDate, limit } = req.query

    const observations = await getSeriesObservations(seriesId, {
      startDate: startDate as string,
      endDate: endDate as string,
      limit: limit ? parseInt(limit as string) : undefined,
      sortOrder: 'desc',
    })

    res.json({
      success: true,
      data: observations,
    })
  } catch (error) {
    logger.error('Error fetching FRED series:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch series data',
    })
  }
})

// ============================================
// Combined/Utility Routes
// ============================================

/**
 * @route GET /api/economic/student-loan-rates
 * @desc Get comprehensive student loan rate context
 * Combines Treasury rates with current federal student loan rates
 */
router.get('/student-loan-rates', async (_req: Request, res: Response): Promise<void> => {
  try {
    const rateContext = await getStudentLoanRateContext()

    res.json({
      success: true,
      data: rateContext,
    })
  } catch (error) {
    logger.error('Error fetching student loan rate context:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch student loan rates',
    })
  }
})

/**
 * @route GET /api/economic/poverty-guidelines
 * @desc Get federal poverty guidelines with inflation context
 */
router.get('/poverty-guidelines', async (_req: Request, res: Response): Promise<void> => {
  try {
    const poverty = await getPovertyContext()

    res.json({
      success: true,
      data: poverty,
    })
  } catch (error) {
    logger.error('Error fetching poverty guidelines:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch poverty guidelines',
    })
  }
})

/**
 * @route GET /api/economic/summary
 * @desc Get a summary of all relevant economic data
 */
router.get('/summary', async (_req: Request, res: Response): Promise<void> => {
  try {
    const [indicators, studentLoanRates, inflation, studentLoans] = await Promise.all([
      getEconomicIndicators().catch(() => null),
      getStudentLoanRateContext().catch(() => null),
      getInflationData().catch(() => null),
      getTotalStudentLoans().catch(() => null),
    ])

    res.json({
      success: true,
      data: {
        economicIndicators: indicators,
        studentLoanRates,
        inflation,
        totalStudentLoans: studentLoans,
        lastUpdated: new Date().toISOString(),
      },
    })
  } catch (error) {
    logger.error('Error fetching economic summary:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch economic summary',
    })
  }
})

/**
 * @route GET /api/economic/available-series
 * @desc List available FRED series IDs
 */
router.get('/available-series', (_req: Request, res: Response): void => {
  res.json({
    success: true,
    data: {
      series: SERIES_IDS,
      descriptions: {
        CPI: 'Consumer Price Index for All Urban Consumers',
        FEDERAL_FUNDS_RATE: 'Federal Funds Effective Rate',
        UNEMPLOYMENT_RATE: 'Unemployment Rate',
        MEDIAN_HOUSEHOLD_INCOME: 'Median Household Income',
        TOTAL_STUDENT_LOANS: 'Total Student Loans Outstanding',
        GDP: 'Gross Domestic Product',
        INFLATION_RATE: 'Inflation Rate (Consumer Prices)',
      },
    },
  })
})

export default router

