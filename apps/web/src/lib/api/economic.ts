/**
 * Economic Data API Client
 * 
 * Client-side service for accessing economic data from Treasury and FRED APIs
 */

import apiClient, { handleApiError } from './client'

// Types
export interface InterestRate {
  recordDate: string
  securityTypeDesc: string
  avgInterestRateAmt: number
}

export interface StudentLoanRates {
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
}

export interface InflationData {
  currentCPI: number
  yearOverYearChange: number
  monthOverMonthChange: number
  baseYear: number
  lastUpdated: string
}

export interface EconomicIndicators {
  cpi: { date: string; value: number } | null
  federalFundsRate: { date: string; value: number } | null
  unemploymentRate: { date: string; value: number } | null
  totalStudentLoans: { date: string; value: number } | null
  lastUpdated: string
}

export interface StudentLoanTotal {
  amount: number
  date: string
  formattedAmount: string
}

export interface PovertyGuidelines {
  federalPovertyLevel2024: number
  perAdditionalPerson: number
  inflationAdjustmentFactor: number
  lastUpdated: string
}

export interface EconomicSummary {
  economicIndicators: EconomicIndicators | null
  studentLoanRates: StudentLoanRates | null
  inflation: InflationData | null
  totalStudentLoans: StudentLoanTotal | null
  lastUpdated: string
}

// Response types
interface ApiResponseWrapper<T> {
  success: boolean
  data: T
}

// ============================================
// Treasury API Functions
// ============================================

/**
 * Get Treasury interest rates
 */
export async function getInterestRates(options?: {
  startDate?: string
  endDate?: string
  securityType?: string
  limit?: number
}): Promise<InterestRate[]> {
  try {
    const params = new URLSearchParams()
    if (options?.startDate) params.append('startDate', options.startDate)
    if (options?.endDate) params.append('endDate', options.endDate)
    if (options?.securityType) params.append('securityType', options.securityType)
    if (options?.limit) params.append('limit', String(options.limit))

    const response = await apiClient.get<ApiResponseWrapper<InterestRate[]>>(
      `/economic/treasury/rates?${params.toString()}`
    )

    return response.data.data || []
  } catch (error) {
    console.error('Error fetching interest rates:', handleApiError(error))
    throw error
  }
}

/**
 * Get latest Treasury interest rates
 */
export async function getLatestInterestRates(): Promise<InterestRate[]> {
  try {
    const response = await apiClient.get<ApiResponseWrapper<InterestRate[]>>(
      '/economic/treasury/rates/latest'
    )

    return response.data.data || []
  } catch (error) {
    console.error('Error fetching latest interest rates:', handleApiError(error))
    throw error
  }
}

/**
 * Get interest rate trends
 */
export async function getInterestRateTrends(years: number = 5): Promise<Array<{
  year: number
  avgRate: number
}>> {
  try {
    const response = await apiClient.get<ApiResponseWrapper<Array<{ year: number; avgRate: number }>>>(
      `/economic/treasury/rate-trends?years=${years}`
    )

    return response.data.data || []
  } catch (error) {
    console.error('Error fetching rate trends:', handleApiError(error))
    throw error
  }
}

// ============================================
// FRED API Functions
// ============================================

/**
 * Get economic indicators
 */
export async function getEconomicIndicators(): Promise<EconomicIndicators> {
  try {
    const response = await apiClient.get<ApiResponseWrapper<EconomicIndicators>>(
      '/economic/fred/indicators'
    )

    return response.data.data
  } catch (error) {
    console.error('Error fetching economic indicators:', handleApiError(error))
    throw error
  }
}

/**
 * Get inflation data
 */
export async function getInflationData(): Promise<InflationData> {
  try {
    const response = await apiClient.get<ApiResponseWrapper<InflationData>>(
      '/economic/fred/inflation'
    )

    return response.data.data
  } catch (error) {
    console.error('Error fetching inflation data:', handleApiError(error))
    throw error
  }
}

/**
 * Get CPI history
 */
export async function getCPIHistory(years: number = 10): Promise<Array<{
  date: string
  value: number
}>> {
  try {
    const response = await apiClient.get<ApiResponseWrapper<Array<{ date: string; value: number }>>>(
      `/economic/fred/cpi-history?years=${years}`
    )

    return response.data.data || []
  } catch (error) {
    console.error('Error fetching CPI history:', handleApiError(error))
    throw error
  }
}

/**
 * Get total student loans outstanding
 */
export async function getTotalStudentLoans(): Promise<StudentLoanTotal> {
  try {
    const response = await apiClient.get<ApiResponseWrapper<StudentLoanTotal>>(
      '/economic/fred/student-loans'
    )

    return response.data.data
  } catch (error) {
    console.error('Error fetching student loan total:', handleApiError(error))
    throw error
  }
}

/**
 * Adjust an amount for inflation
 */
export async function adjustForInflation(
  amount: number,
  fromYear: number,
  toYear?: number
): Promise<{
  originalAmount: number
  fromYear: number
  toYear: number
  adjustedAmount: number
  percentageChange: number
}> {
  try {
    const response = await apiClient.post<ApiResponseWrapper<{
      originalAmount: number
      fromYear: number
      toYear: number
      adjustedAmount: number
      percentageChange: number
    }>>('/economic/fred/adjust-inflation', {
      amount,
      fromYear,
      toYear,
    })

    return response.data.data
  } catch (error) {
    console.error('Error adjusting for inflation:', handleApiError(error))
    throw error
  }
}

// ============================================
// Combined/Utility Functions
// ============================================

/**
 * Get student loan rates (combines Treasury data with federal rates)
 */
export async function getStudentLoanRates(): Promise<StudentLoanRates> {
  try {
    const response = await apiClient.get<ApiResponseWrapper<StudentLoanRates>>(
      '/economic/student-loan-rates'
    )

    return response.data.data
  } catch (error) {
    console.error('Error fetching student loan rates:', handleApiError(error))
    throw error
  }
}

/**
 * Get poverty guidelines
 */
export async function getPovertyGuidelines(): Promise<PovertyGuidelines> {
  try {
    const response = await apiClient.get<ApiResponseWrapper<PovertyGuidelines>>(
      '/economic/poverty-guidelines'
    )

    return response.data.data
  } catch (error) {
    console.error('Error fetching poverty guidelines:', handleApiError(error))
    throw error
  }
}

/**
 * Get full economic summary
 */
export async function getEconomicSummary(): Promise<EconomicSummary> {
  try {
    const response = await apiClient.get<ApiResponseWrapper<EconomicSummary>>(
      '/economic/summary'
    )

    return response.data.data
  } catch (error) {
    console.error('Error fetching economic summary:', handleApiError(error))
    throw error
  }
}

// ============================================
// Formatting Helpers
// ============================================

/**
 * Format currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format large currency amounts (billions/trillions)
 */
export function formatLargeCurrency(amountInBillions: number): string {
  if (amountInBillions >= 1000) {
    return `$${(amountInBillions / 1000).toFixed(2)} trillion`
  }
  return `$${amountInBillions.toFixed(1)} billion`
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`
}

/**
 * Format interest rate
 */
export function formatInterestRate(rate: number): string {
  return `${rate.toFixed(2)}%`
}

export default {
  getInterestRates,
  getLatestInterestRates,
  getInterestRateTrends,
  getEconomicIndicators,
  getInflationData,
  getCPIHistory,
  getTotalStudentLoans,
  adjustForInflation,
  getStudentLoanRates,
  getPovertyGuidelines,
  getEconomicSummary,
  formatCurrency,
  formatLargeCurrency,
  formatPercentage,
  formatInterestRate,
}
