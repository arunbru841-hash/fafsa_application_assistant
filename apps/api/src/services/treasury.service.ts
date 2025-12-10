/**
 * U.S. Treasury Fiscal Data API Service
 * 
 * Provides access to federal financial data including:
 * - Average interest rates on Treasury securities
 * - Debt information
 * - Other fiscal data
 * 
 * API Documentation: https://fiscaldata.treasury.gov/api-documentation/
 * 
 * Note: This API does NOT require an API key
 */

import { logger } from '../utils/logger'

const BASE_URL = 'https://api.fiscaldata.treasury.gov/services/api/fiscal_service'

// Types
export interface InterestRate {
  recordDate: string
  securityTypeDesc: string
  avgInterestRateAmt: number
}

export interface DebtData {
  recordDate: string
  debtHeldByPublic: number
  intragovernmentalHoldings: number
  totalPublicDebtOutstanding: number
}

export interface TreasuryDataResponse<T> {
  data: T[]
  meta: {
    count: number
    totalCount: number
    totalPages: number
  }
  links: {
    self: string
    first: string
    next?: string
    last: string
  }
}

// Simple in-memory cache
const cache = new Map<string, { data: any; expires: number }>()
const CACHE_TTL = 60 * 60 * 1000 // 1 hour

function getCached<T>(key: string): T | null {
  const cached = cache.get(key)
  if (cached && cached.expires > Date.now()) {
    return cached.data as T
  }
  cache.delete(key)
  return null
}

function setCache(key: string, data: any): void {
  cache.set(key, { data, expires: Date.now() + CACHE_TTL })
}

/**
 * Build query string from parameters
 */
function buildQueryString(params: Record<string, string | number | undefined>): string {
  const queryParams = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      queryParams.append(key, String(value))
    }
  })
  
  return queryParams.toString()
}

/**
 * Get average interest rates on Treasury securities
 */
export async function getInterestRates(options: {
  startDate?: string  // YYYY-MM-DD format
  endDate?: string
  securityType?: string
  limit?: number
  sortOrder?: 'asc' | 'desc'
} = {}): Promise<InterestRate[]> {
  const cacheKey = `treasury:rates:${JSON.stringify(options)}`
  const cached = getCached<InterestRate[]>(cacheKey)
  if (cached) {
    logger.debug('Returning cached Treasury interest rates')
    return cached
  }

  const filters: string[] = []
  
  if (options.startDate) {
    filters.push(`record_date:gte:${options.startDate}`)
  }
  if (options.endDate) {
    filters.push(`record_date:lte:${options.endDate}`)
  }
  if (options.securityType) {
    filters.push(`security_type_desc:eq:${options.securityType}`)
  }

  const params: Record<string, string | number | undefined> = {
    fields: 'record_date,security_type_desc,avg_interest_rate_amt',
    sort: options.sortOrder === 'asc' ? 'record_date' : '-record_date',
    'page[size]': options.limit || 100,
  }

  if (filters.length > 0) {
    params.filter = filters.join(',')
  }

  try {
    const url = `${BASE_URL}/v2/accounting/od/avg_interest_rates?${buildQueryString(params)}`
    logger.info('Fetching interest rates from Treasury API')

    const response = await fetch(url)
    
    if (!response.ok) {
      const errorText = await response.text()
      logger.error(`Treasury API error: ${response.status} - ${errorText}`)
      throw new Error(`Treasury API error: ${response.status}`)
    }

    interface TreasuryRateItem {
      record_date: string
      security_type_desc: string
      avg_interest_rate_amt: string
    }

    const data = await response.json() as { data?: TreasuryRateItem[] }

    const rates: InterestRate[] = (data.data || []).map((item: TreasuryRateItem) => ({
      recordDate: item.record_date,
      securityTypeDesc: item.security_type_desc,
      avgInterestRateAmt: parseFloat(item.avg_interest_rate_amt),
    }))

    setCache(cacheKey, rates)
    return rates
  } catch (error) {
    logger.error('Error fetching Treasury interest rates:', error)
    throw error
  }
}

/**
 * Get latest interest rates (most recent data)
 */
export async function getLatestInterestRates(): Promise<InterestRate[]> {
  return getInterestRates({
    limit: 20,
    sortOrder: 'desc',
  })
}

/**
 * Get debt to the penny data
 */
export async function getDebtData(options: {
  startDate?: string
  endDate?: string
  limit?: number
} = {}): Promise<DebtData[]> {
  const cacheKey = `treasury:debt:${JSON.stringify(options)}`
  const cached = getCached<DebtData[]>(cacheKey)
  if (cached) {
    logger.debug('Returning cached Treasury debt data')
    return cached
  }

  const filters: string[] = []
  
  if (options.startDate) {
    filters.push(`record_date:gte:${options.startDate}`)
  }
  if (options.endDate) {
    filters.push(`record_date:lte:${options.endDate}`)
  }

  const params: Record<string, string | number | undefined> = {
    fields: 'record_date,debt_held_public_amt,intragov_hold_amt,tot_pub_debt_out_amt',
    sort: '-record_date',
    'page[size]': options.limit || 30,
  }

  if (filters.length > 0) {
    params.filter = filters.join(',')
  }

  try {
    const url = `${BASE_URL}/v2/accounting/od/debt_to_penny?${buildQueryString(params)}`
    logger.info('Fetching debt data from Treasury API')

    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`Treasury API error: ${response.status}`)
    }

    interface TreasuryDebtItem {
      record_date: string
      debt_held_public_amt: string
      intragov_hold_amt: string
      tot_pub_debt_out_amt: string
    }

    const data = await response.json() as { data?: TreasuryDebtItem[] }

    const debtData: DebtData[] = (data.data || []).map((item: TreasuryDebtItem) => ({
      recordDate: item.record_date,
      debtHeldByPublic: parseFloat(item.debt_held_public_amt),
      intragovernmentalHoldings: parseFloat(item.intragov_hold_amt),
      totalPublicDebtOutstanding: parseFloat(item.tot_pub_debt_out_amt),
    }))

    setCache(cacheKey, debtData)
    return debtData
  } catch (error) {
    logger.error('Error fetching Treasury debt data:', error)
    throw error
  }
}

/**
 * Get current student loan interest rate context
 * Uses Treasury rates as a baseline reference
 */
export async function getStudentLoanRateContext(): Promise<{
  treasuryNoteRate: number | null
  treasuryBondRate: number | null
  lastUpdated: string | null
  federalStudentLoanRates: {
    directSubsidized: number
    directUnsubsidized: number
    directUnsubsidizedGrad: number
    directPLUS: number
    effectiveDate: string
  }
}> {
  const rates = await getLatestInterestRates()
  
  // Find relevant Treasury rates
  const treasuryNote = rates.find(r => 
    r.securityTypeDesc.toLowerCase().includes('treasury note')
  )
  const treasuryBond = rates.find(r => 
    r.securityTypeDesc.toLowerCase().includes('treasury bond')
  )

  // Federal student loan rates for 2024-2025 academic year
  // These are set annually based on the 10-year Treasury note
  return {
    treasuryNoteRate: treasuryNote?.avgInterestRateAmt || null,
    treasuryBondRate: treasuryBond?.avgInterestRateAmt || null,
    lastUpdated: treasuryNote?.recordDate || treasuryBond?.recordDate || null,
    federalStudentLoanRates: {
      // Rates effective July 1, 2024 - June 30, 2025
      directSubsidized: 6.53,
      directUnsubsidized: 6.53,
      directUnsubsidizedGrad: 8.08,
      directPLUS: 9.08,
      effectiveDate: '2024-07-01',
    },
  }
}

/**
 * Get historical interest rate trends
 */
export async function getInterestRateTrends(
  years: number = 5
): Promise<Array<{
  year: number
  avgRate: number
}>> {
  const startDate = new Date()
  startDate.setFullYear(startDate.getFullYear() - years)
  
  const rates = await getInterestRates({
    startDate: startDate.toISOString().split('T')[0],
    limit: 1000,
    sortOrder: 'asc',
  })

  // Group by year and calculate average
  const yearlyRates: Record<number, number[]> = {}
  
  rates.forEach(rate => {
    const year = new Date(rate.recordDate).getFullYear()
    if (!yearlyRates[year]) {
      yearlyRates[year] = []
    }
    yearlyRates[year].push(rate.avgInterestRateAmt)
  })

  return Object.entries(yearlyRates).map(([year, rateValues]) => ({
    year: parseInt(year),
    avgRate: rateValues.reduce((a, b) => a + b, 0) / rateValues.length,
  })).sort((a, b) => a.year - b.year)
}

export default {
  getInterestRates,
  getLatestInterestRates,
  getDebtData,
  getStudentLoanRateContext,
  getInterestRateTrends,
}
