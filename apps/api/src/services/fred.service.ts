/**
 * FRED (Federal Reserve Economic Data) API Service
 * 
 * Provides access to economic data including:
 * - Consumer Price Index (CPI) for inflation
 * - Federal Funds Rate
 * - Unemployment Rate
 * - Median Household Income
 * - Total Student Loans Outstanding
 * 
 * API Documentation: https://fred.stlouisfed.org/docs/api/fred/
 */

import { config } from '../config'
import { logger } from '../utils/logger'

const BASE_URL = 'https://api.stlouisfed.org/fred'
const API_KEY = config.apis.fred.apiKey

// FRED Series IDs
export const SERIES_IDS = {
  CPI: 'CPIAUCSL',                    // Consumer Price Index for All Urban Consumers
  FEDERAL_FUNDS_RATE: 'FEDFUNDS',     // Federal Funds Effective Rate
  UNEMPLOYMENT_RATE: 'UNRATE',         // Unemployment Rate
  MEDIAN_HOUSEHOLD_INCOME: 'MEHOINUSA672N', // Median Household Income
  TOTAL_STUDENT_LOANS: 'TOTALSL',     // Total Student Loans Outstanding
  GDP: 'GDP',                          // Gross Domestic Product
  INFLATION_RATE: 'FPCPITOTLZGUSA',   // Inflation, consumer prices
} as const

// Types
export interface FredObservation {
  date: string
  value: number | null
}

export interface FredSeries {
  id: string
  title: string
  observationStart: string
  observationEnd: string
  frequency: string
  units: string
  notes?: string
}

export interface EconomicIndicators {
  cpi: FredObservation | null
  federalFundsRate: FredObservation | null
  unemploymentRate: FredObservation | null
  totalStudentLoans: FredObservation | null
  lastUpdated: string
}

export interface InflationData {
  currentCPI: number
  yearOverYearChange: number
  monthOverMonthChange: number
  baseYear: number
  lastUpdated: string
}

// Simple in-memory cache
const cache = new Map<string, { data: any; expires: number }>()
const CACHE_TTL = 6 * 60 * 60 * 1000 // 6 hours

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
 * Get series information
 */
export async function getSeriesInfo(seriesId: string): Promise<FredSeries | null> {
  const cacheKey = `fred:series:${seriesId}`
  const cached = getCached<FredSeries>(cacheKey)
  if (cached) {
    return cached
  }

  const params = new URLSearchParams({
    api_key: API_KEY,
    series_id: seriesId,
    file_type: 'json',
  })

  try {
    const url = `${BASE_URL}/series?${params.toString()}`
    logger.info(`Fetching FRED series info: ${seriesId}`)

    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`FRED API error: ${response.status}`)
    }

    interface FredSeriesAPIResponse {
      id: string
      title: string
      observation_start: string
      observation_end: string
      frequency: string
      units: string
      notes?: string
    }

    const data = await response.json() as { seriess?: FredSeriesAPIResponse[] }
    
    if (!data.seriess || data.seriess.length === 0) {
      return null
    }

    const series = data.seriess[0]
    const result: FredSeries = {
      id: series.id,
      title: series.title,
      observationStart: series.observation_start,
      observationEnd: series.observation_end,
      frequency: series.frequency,
      units: series.units,
      notes: series.notes,
    }

    setCache(cacheKey, result)
    return result
  } catch (error) {
    logger.error(`Error fetching FRED series ${seriesId}:`, error)
    throw error
  }
}
/**
 * Get observations for a series
 */
export async function getSeriesObservations(
  seriesId: string,
  options: {
    startDate?: string  // YYYY-MM-DD
    endDate?: string
    limit?: number
    sortOrder?: 'asc' | 'desc'
  } = {}
): Promise<FredObservation[]> {
  const cacheKey = `fred:observations:${seriesId}:${JSON.stringify(options)}`
  const cached = getCached<FredObservation[]>(cacheKey)
  if (cached) {
    logger.debug(`Returning cached FRED observations for ${seriesId}`)
    return cached
  }

  const params = new URLSearchParams({
    api_key: API_KEY,
    series_id: seriesId,
    file_type: 'json',
    sort_order: options.sortOrder || 'desc',
  })

  if (options.startDate) {
    params.append('observation_start', options.startDate)
  }
  if (options.endDate) {
    params.append('observation_end', options.endDate)
  }
  if (options.limit) {
    params.append('limit', String(options.limit))
  }

  try {
    const url = `${BASE_URL}/series/observations?${params.toString()}`
    logger.info(`Fetching FRED observations for ${seriesId}`)

    const response = await fetch(url)
    
    if (!response.ok) {
      const errorText = await response.text()
      logger.error(`FRED API error: ${response.status} - ${errorText}`)
      throw new Error(`FRED API error: ${response.status}`)
    }

    interface FredObservationAPIResponse {
      date: string
      value: string
    }

    const data = await response.json() as { observations?: FredObservationAPIResponse[] }

    const observations: FredObservation[] = (data.observations || [])
      .map((obs: FredObservationAPIResponse) => ({
        date: obs.date,
        value: obs.value === '.' ? null : parseFloat(obs.value),
      }))
      .filter((obs: FredObservation) => obs.value !== null)

    setCache(cacheKey, observations)
    return observations
  } catch (error) {
    logger.error(`Error fetching FRED observations for ${seriesId}:`, error)
    throw error
  }
}

/**
 * Get the latest observation for a series
 */
export async function getLatestObservation(seriesId: string): Promise<FredObservation | null> {
  const observations = await getSeriesObservations(seriesId, {
    limit: 1,
    sortOrder: 'desc',
  })
  return observations[0] || null
}

/**
 * Get current CPI and inflation data
 */
export async function getInflationData(): Promise<InflationData> {
  const cacheKey = 'fred:inflation'
  const cached = getCached<InflationData>(cacheKey)
  if (cached) {
    return cached
  }

  // Get last 13 months of CPI data
  const endDate = new Date().toISOString().split('T')[0]
  const startDate = new Date()
  startDate.setMonth(startDate.getMonth() - 13)

  const observations = await getSeriesObservations(SERIES_IDS.CPI, {
    startDate: startDate.toISOString().split('T')[0],
    endDate,
    sortOrder: 'desc',
  })

  if (observations.length < 2) {
    throw new Error('Insufficient CPI data')
  }

  const current = observations[0]
  const lastMonth = observations[1]
  const lastYear = observations.find(obs => {
    const obsDate = new Date(obs.date)
    const currentDate = new Date(current.date)
    return obsDate.getFullYear() === currentDate.getFullYear() - 1 &&
           obsDate.getMonth() === currentDate.getMonth()
  })

  const result: InflationData = {
    currentCPI: current.value!,
    yearOverYearChange: lastYear 
      ? ((current.value! - lastYear.value!) / lastYear.value!) * 100 
      : 0,
    monthOverMonthChange: ((current.value! - lastMonth.value!) / lastMonth.value!) * 100,
    baseYear: 1982, // CPI base year
    lastUpdated: current.date,
  }

  setCache(cacheKey, result)
  return result
}

/**
 * Get current economic indicators relevant to student loans
 */
export async function getEconomicIndicators(): Promise<EconomicIndicators> {
  const cacheKey = 'fred:indicators'
  const cached = getCached<EconomicIndicators>(cacheKey)
  if (cached) {
    return cached
  }

  try {
    const [cpi, fedRate, unemployment, studentLoans] = await Promise.all([
      getLatestObservation(SERIES_IDS.CPI).catch(() => null),
      getLatestObservation(SERIES_IDS.FEDERAL_FUNDS_RATE).catch(() => null),
      getLatestObservation(SERIES_IDS.UNEMPLOYMENT_RATE).catch(() => null),
      getLatestObservation(SERIES_IDS.TOTAL_STUDENT_LOANS).catch(() => null),
    ])

    const result: EconomicIndicators = {
      cpi,
      federalFundsRate: fedRate,
      unemploymentRate: unemployment,
      totalStudentLoans: studentLoans,
      lastUpdated: new Date().toISOString(),
    }

    setCache(cacheKey, result)
    return result
  } catch (error) {
    logger.error('Error fetching economic indicators:', error)
    throw error
  }
}

/**
 * Get total student loans outstanding (in billions)
 */
export async function getTotalStudentLoans(): Promise<{
  amount: number
  date: string
  formattedAmount: string
}> {
  const observation = await getLatestObservation(SERIES_IDS.TOTAL_STUDENT_LOANS)
  
  if (!observation) {
    throw new Error('Unable to fetch student loan data')
  }

  // TOTALSL is in billions of dollars
  const amountBillions = observation.value!
  
  return {
    amount: amountBillions,
    date: observation.date,
    formattedAmount: `$${amountBillions.toFixed(1)} billion`,
  }
}

/**
 * Get historical CPI data for a given period
 */
export async function getCPIHistory(years: number = 10): Promise<FredObservation[]> {
  const startDate = new Date()
  startDate.setFullYear(startDate.getFullYear() - years)

  return getSeriesObservations(SERIES_IDS.CPI, {
    startDate: startDate.toISOString().split('T')[0],
    sortOrder: 'asc',
  })
}

/**
 * Calculate inflation-adjusted value
 */
export async function adjustForInflation(
  amount: number,
  fromYear: number,
  toYear: number = new Date().getFullYear()
): Promise<number> {
  const fromDate = `${fromYear}-01-01`
  const toDate = `${toYear}-01-01`

  const observations = await getSeriesObservations(SERIES_IDS.CPI, {
    startDate: fromDate,
    endDate: toDate,
    sortOrder: 'asc',
  })

  if (observations.length < 2) {
    return amount // No adjustment possible
  }

  const fromCPI = observations[0].value!
  const toCPI = observations[observations.length - 1].value!

  return amount * (toCPI / fromCPI)
}

/**
 * Search for economic series
 */
export async function searchSeries(
  query: string,
  limit: number = 10
): Promise<FredSeries[]> {
  const params = new URLSearchParams({
    api_key: API_KEY,
    search_text: query,
    file_type: 'json',
    limit: String(limit),
  })

  try {
    const url = `${BASE_URL}/series/search?${params.toString()}`
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`FRED API error: ${response.status}`)
    }

    interface FredSeriesSearchResult {
      id: string
      title: string
      observation_start: string
      observation_end: string
      frequency: string
      units: string
      notes?: string
    }

    const data = await response.json() as { seriess?: FredSeriesSearchResult[] }

    return (data.seriess || []).map((series: FredSeriesSearchResult) => ({
      id: series.id,
      title: series.title,
      observationStart: series.observation_start,
      observationEnd: series.observation_end,
      frequency: series.frequency,
      units: series.units,
      notes: series.notes,
    }))
  } catch (error) {
    logger.error('Error searching FRED series:', error)
    throw error
  }
}

/**
 * Get poverty guidelines adjusted for current economic conditions
 */
export async function getPovertyContext(): Promise<{
  federalPovertyLevel2024: number
  perAdditionalPerson: number
  inflationAdjustmentFactor: number
  lastUpdated: string
}> {
  const inflation = await getInflationData()
  
  // 2024 Federal Poverty Guidelines (48 contiguous states)
  const baseFPL = 15060
  const perPerson = 5380

  return {
    federalPovertyLevel2024: baseFPL,
    perAdditionalPerson: perPerson,
    inflationAdjustmentFactor: 1 + (inflation.yearOverYearChange / 100),
    lastUpdated: inflation.lastUpdated,
  }
}

export default {
  SERIES_IDS,
  getSeriesInfo,
  getSeriesObservations,
  getLatestObservation,
  getInflationData,
  getEconomicIndicators,
  getTotalStudentLoans,
  getCPIHistory,
  adjustForInflation,
  searchSeries,
  getPovertyContext,
}
