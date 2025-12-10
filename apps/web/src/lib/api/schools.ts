/**
 * College Scorecard API Client
 * 
 * Client-side service for accessing school data from the College Scorecard API
 */

import apiClient, { handleApiError } from './client'

// Types
export interface School {
  id: number
  name: string
  city: string
  state: string
  zip: string
  website: string
  ownership: 'public' | 'private-nonprofit' | 'private-for-profit'
  studentSize: number
  inStateTuition: number
  outOfStateTuition: number
  avgNetPrice: number
  pellGrantRate: number
  federalLoanRate: number
  medianDebt: number
  monthlyPayment: number
  admissionRate: number
  graduationRate: number
  medianEarnings: number
  latitude?: number
  longitude?: number
}

export interface SchoolSearchParams {
  q?: string
  state?: string
  city?: string
  zip?: string
  distance?: number
  ownership?: number[]
  degreeType?: number[]
  minSize?: number
  maxSize?: number
  page?: number
  perPage?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface SchoolSearchResult {
  metadata: {
    total: number
    page: number
    perPage: number
  }
  results: School[]
}

export interface SchoolAutocompleteResult {
  id: number
  name: string
  city: string
  state: string
}

export interface FinancialAidData {
  pellGrantRate: number
  federalLoanRate: number
  medianDebt: number
  monthlyPayment: number
  avgNetPrice: number
}

// API Response types
interface SchoolSearchResponse {
  success: boolean
  metadata: {
    total: number
    page: number
    perPage: number
  }
  results: School[]
}

interface AutocompleteResponse {
  success: boolean
  results: SchoolAutocompleteResult[]
}

interface SchoolResponse {
  success: boolean
  data: School
}

interface FinancialAidResponse {
  success: boolean
  data: FinancialAidData
}

/**
 * Search for schools
 */
export async function searchSchools(params: SchoolSearchParams): Promise<SchoolSearchResult> {
  try {
    const queryParams = new URLSearchParams()
    
    if (params.q) queryParams.append('q', params.q)
    if (params.state) queryParams.append('state', params.state)
    if (params.city) queryParams.append('city', params.city)
    if (params.zip) queryParams.append('zip', params.zip)
    if (params.distance) queryParams.append('distance', String(params.distance))
    if (params.ownership) queryParams.append('ownership', params.ownership.join(','))
    if (params.degreeType) queryParams.append('degreeType', params.degreeType.join(','))
    if (params.minSize) queryParams.append('minSize', String(params.minSize))
    if (params.maxSize) queryParams.append('maxSize', String(params.maxSize))
    if (params.page !== undefined) queryParams.append('page', String(params.page))
    if (params.perPage) queryParams.append('perPage', String(params.perPage))
    if (params.sortBy) queryParams.append('sortBy', params.sortBy)
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder)

    const response = await apiClient.get<SchoolSearchResponse>(
      `/scorecard/schools?${queryParams.toString()}`
    )

    return {
      metadata: response.data.metadata || { total: 0, page: 0, perPage: 20 },
      results: response.data.results || [],
    }
  } catch (error) {
    console.error('Error searching schools:', handleApiError(error))
    throw error
  }
}

/**
 * Autocomplete school names
 */
export async function autocompleteSchools(
  query: string,
  limit: number = 10
): Promise<SchoolAutocompleteResult[]> {
  if (!query || query.length < 3) {
    return []
  }

  try {
    const response = await apiClient.get<AutocompleteResponse>(
      `/scorecard/schools/autocomplete?q=${encodeURIComponent(query)}&limit=${limit}`
    )

    return response.data.results || []
  } catch (error) {
    console.error('Error autocompleting schools:', handleApiError(error))
    return []
  }
}

/**
 * Get schools near a ZIP code
 */
export async function getSchoolsNearZip(
  zip: string,
  distance: number = 50
): Promise<SchoolSearchResult> {
  try {
    const response = await apiClient.get<SchoolSearchResponse>(
      `/scorecard/schools/near/${zip}?distance=${distance}`
    )

    return {
      metadata: response.data.metadata || { total: 0, page: 0, perPage: 20 },
      results: response.data.results || [],
    }
  } catch (error) {
    console.error('Error getting schools near ZIP:', handleApiError(error))
    throw error
  }
}

/**
 * Get a single school by ID
 */
export async function getSchoolById(id: number): Promise<School | null> {
  try {
    const response = await apiClient.get<SchoolResponse>(
      `/scorecard/schools/${id}`
    )

    return response.data.data || null
  } catch (error) {
    console.error('Error getting school:', handleApiError(error))
    return null
  }
}

/**
 * Get financial aid data for a school
 */
export async function getSchoolFinancialAid(id: number): Promise<FinancialAidData | null> {
  try {
    const response = await apiClient.get<FinancialAidResponse>(
      `/scorecard/schools/${id}/financial-aid`
    )

    return response.data.data || null
  } catch (error) {
    console.error('Error getting financial aid data:', handleApiError(error))
    return null
  }
}

/**
 * Format tuition for display
 */
export function formatTuition(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format percentage for display
 */
export function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(1)}%`
}

/**
 * Get ownership type label
 */
export function getOwnershipLabel(ownership: School['ownership']): string {
  switch (ownership) {
    case 'public':
      return 'Public'
    case 'private-nonprofit':
      return 'Private (Nonprofit)'
    case 'private-for-profit':
      return 'Private (For-Profit)'
    default:
      return 'Unknown'
  }
}

export default {
  searchSchools,
  autocompleteSchools,
  getSchoolsNearZip,
  getSchoolById,
  getSchoolFinancialAid,
  formatTuition,
  formatPercentage,
  getOwnershipLabel,
}
