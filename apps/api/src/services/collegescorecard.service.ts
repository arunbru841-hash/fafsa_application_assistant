/**
 * College Scorecard API Service
 * 
 * Provides access to comprehensive college and university data including:
 * - School search and details
 * - Tuition and cost information
 * - Financial aid statistics
 * - Graduation rates and outcomes
 * 
 * API Documentation: https://github.com/RTICWDT/open-data-maker/blob/master/API.md
 */

import { config } from '../config'
import { logger } from '../utils/logger'

const BASE_URL = 'https://api.data.gov/ed/collegescorecard/v1'
const API_KEY = config.apis.collegeScorecard.apiKey

// Types
export interface CollegeScorecardSchool {
  id: number
  'school.name': string
  'school.city': string
  'school.state': string
  'school.zip': string
  'school.school_url': string
  'school.ownership': number // 1=Public, 2=Private nonprofit, 3=Private for-profit
  'school.degrees_awarded.predominant': number
  'school.region_id': number
  'latest.student.size': number
  'latest.cost.tuition.in_state': number
  'latest.cost.tuition.out_of_state': number
  'latest.cost.avg_net_price.overall': number
  'latest.aid.pell_grant_rate': number
  'latest.aid.federal_loan_rate': number
  'latest.aid.median_debt.completers.overall': number
  'latest.aid.median_debt.completers.monthly_payments': number
  'latest.admissions.admission_rate.overall': number
  'latest.completion.rate_suppressed.overall': number
  'latest.earnings.10_yrs_after_entry.median': number
  'location.lat': number
  'location.lon': number
}

export interface SchoolSearchResult {
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
  query?: string
  state?: string
  city?: string
  zip?: string
  distance?: number
  ownership?: number | number[]
  degreeType?: number | number[]
  minStudentSize?: number
  maxStudentSize?: number
  page?: number
  perPage?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface SchoolSearchResponse {
  metadata: {
    total: number
    page: number
    perPage: number
  }
  results: SchoolSearchResult[]
}

// Helper to transform ownership code to string
function getOwnershipType(code: number): 'public' | 'private-nonprofit' | 'private-for-profit' {
  switch (code) {
    case 1: return 'public'
    case 2: return 'private-nonprofit'
    case 3: return 'private-for-profit'
    default: return 'public'
  }
}

// Transform API response to our format
function transformSchool(raw: CollegeScorecardSchool): SchoolSearchResult {
  return {
    id: raw.id,
    name: raw['school.name'] || '',
    city: raw['school.city'] || '',
    state: raw['school.state'] || '',
    zip: raw['school.zip'] || '',
    website: raw['school.school_url'] || '',
    ownership: getOwnershipType(raw['school.ownership']),
    studentSize: raw['latest.student.size'] || 0,
    inStateTuition: raw['latest.cost.tuition.in_state'] || 0,
    outOfStateTuition: raw['latest.cost.tuition.out_of_state'] || 0,
    avgNetPrice: raw['latest.cost.avg_net_price.overall'] || 0,
    pellGrantRate: raw['latest.aid.pell_grant_rate'] || 0,
    federalLoanRate: raw['latest.aid.federal_loan_rate'] || 0,
    medianDebt: raw['latest.aid.median_debt.completers.overall'] || 0,
    monthlyPayment: raw['latest.aid.median_debt.completers.monthly_payments'] || 0,
    admissionRate: raw['latest.admissions.admission_rate.overall'] || 0,
    graduationRate: raw['latest.completion.rate_suppressed.overall'] || 0,
    medianEarnings: raw['latest.earnings.10_yrs_after_entry.median'] || 0,
    latitude: raw['location.lat'],
    longitude: raw['location.lon'],
  }
}

// Standard fields to request
const STANDARD_FIELDS = [
  'id',
  'school.name',
  'school.city',
  'school.state',
  'school.zip',
  'school.school_url',
  'school.ownership',
  'school.degrees_awarded.predominant',
  'latest.student.size',
  'latest.cost.tuition.in_state',
  'latest.cost.tuition.out_of_state',
  'latest.cost.avg_net_price.overall',
  'latest.aid.pell_grant_rate',
  'latest.aid.federal_loan_rate',
  'latest.aid.median_debt.completers.overall',
  'latest.aid.median_debt.completers.monthly_payments',
  'latest.admissions.admission_rate.overall',
  'latest.completion.rate_suppressed.overall',
  'latest.earnings.10_yrs_after_entry.median',
  'location.lat',
  'location.lon',
].join(',')

// Simple in-memory cache
const cache = new Map<string, { data: any; expires: number }>()
const CACHE_TTL = 24 * 60 * 60 * 1000 // 24 hours

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
 * Search for schools using the College Scorecard API
 */
export async function searchSchools(params: SchoolSearchParams): Promise<SchoolSearchResponse> {
  const cacheKey = `schools:search:${JSON.stringify(params)}`
  const cached = getCached<SchoolSearchResponse>(cacheKey)
  if (cached) {
    logger.debug('Returning cached school search results')
    return cached
  }

  const queryParams = new URLSearchParams({
    api_key: API_KEY,
    _fields: STANDARD_FIELDS,
    _per_page: String(params.perPage || 20),
    _page: String(params.page || 0),
  })

  // Add search parameters
  if (params.query) {
    queryParams.append('school.name', params.query)
  }

  if (params.state) {
    queryParams.append('school.state', params.state)
  }

  if (params.city) {
    queryParams.append('school.city', params.city)
  }

  if (params.zip && params.distance) {
    queryParams.append('zip', params.zip)
    queryParams.append('distance', `${params.distance}mi`)
  }

  if (params.ownership) {
    const ownershipValues = Array.isArray(params.ownership) 
      ? params.ownership.join(',') 
      : String(params.ownership)
    queryParams.append('school.ownership', ownershipValues)
  }

  if (params.degreeType) {
    const degreeValues = Array.isArray(params.degreeType)
      ? params.degreeType.join(',')
      : String(params.degreeType)
    queryParams.append('school.degrees_awarded.predominant', degreeValues)
  }

  if (params.minStudentSize || params.maxStudentSize) {
    const min = params.minStudentSize || ''
    const max = params.maxStudentSize || ''
    queryParams.append('latest.student.size__range', `${min}..${max}`)
  }

  if (params.sortBy) {
    const sortOrder = params.sortOrder === 'desc' ? ':desc' : ':asc'
    queryParams.append('_sort', `${params.sortBy}${sortOrder}`)
  }

  try {
    const url = `${BASE_URL}/schools.json?${queryParams.toString()}`
    logger.info(`Fetching schools from College Scorecard API: ${url.replace(API_KEY, '***')}`)

    const response = await fetch(url)
    
    if (!response.ok) {
      const errorText = await response.text()
      logger.error(`College Scorecard API error: ${response.status} - ${errorText}`)
      throw new Error(`College Scorecard API error: ${response.status}`)
    }

    const data = await response.json() as {
      metadata?: { total?: number; page?: number; per_page?: number }
      results?: CollegeScorecardSchool[]
    }

    const result: SchoolSearchResponse = {
      metadata: {
        total: data.metadata?.total || 0,
        page: data.metadata?.page || 0,
        perPage: data.metadata?.per_page || 20,
      },
      results: (data.results || []).map(transformSchool),
    }

    setCache(cacheKey, result)
    return result
  } catch (error) {
    logger.error('Error fetching schools from College Scorecard API:', error)
    throw error
  }
}

/**
 * Get a single school by ID
 */
export async function getSchoolById(id: number): Promise<SchoolSearchResult | null> {
  const cacheKey = `schools:id:${id}`
  const cached = getCached<SchoolSearchResult>(cacheKey)
  if (cached) {
    logger.debug(`Returning cached school: ${id}`)
    return cached
  }

  const queryParams = new URLSearchParams({
    api_key: API_KEY,
    id: String(id),
    _fields: STANDARD_FIELDS,
  })

  try {
    const url = `${BASE_URL}/schools.json?${queryParams.toString()}`
    logger.info(`Fetching school ${id} from College Scorecard API`)

    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`College Scorecard API error: ${response.status}`)
    }

    const data = await response.json() as {
      results?: CollegeScorecardSchool[]
    }
    
    if (!data.results || data.results.length === 0) {
      return null
    }

    const school = transformSchool(data.results[0])
    setCache(cacheKey, school)
    return school
  } catch (error) {
    logger.error(`Error fetching school ${id} from College Scorecard API:`, error)
    throw error
  }
}

/**
 * Get schools near a ZIP code
 */
export async function getSchoolsNearZip(
  zip: string, 
  distanceMiles: number = 50,
  options: Partial<SchoolSearchParams> = {}
): Promise<SchoolSearchResponse> {
  return searchSchools({
    ...options,
    zip,
    distance: distanceMiles,
  })
}

/**
 * Get schools by state
 */
export async function getSchoolsByState(
  state: string,
  options: Partial<SchoolSearchParams> = {}
): Promise<SchoolSearchResponse> {
  return searchSchools({
    ...options,
    state: state.toUpperCase(),
  })
}

/**
 * Autocomplete school names
 */
export async function autocompleteSchools(
  query: string,
  limit: number = 10
): Promise<Array<{ id: number; name: string; city: string; state: string }>> {
  if (!query || query.length < 3) {
    return []
  }

  const cacheKey = `schools:autocomplete:${query.toLowerCase()}`
  const cached = getCached<Array<{ id: number; name: string; city: string; state: string }>>(cacheKey)
  if (cached) {
    return cached
  }

  const queryParams = new URLSearchParams({
    api_key: API_KEY,
    'school.name': query,
    _fields: 'id,school.name,school.city,school.state',
    _per_page: String(limit),
  })

  try {
    const url = `${BASE_URL}/schools.json?${queryParams.toString()}`
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`College Scorecard API error: ${response.status}`)
    }

    interface AutocompleteAPIResult {
      id: number
      'school.name': string
      'school.city': string
      'school.state': string
    }

    const data = await response.json() as { results?: AutocompleteAPIResult[] }
    
    const results = (data.results || []).map((school: AutocompleteAPIResult) => ({
      id: school.id,
      name: school['school.name'],
      city: school['school.city'],
      state: school['school.state'],
    }))

    setCache(cacheKey, results)
    return results
  } catch (error) {
    logger.error('Error autocompleting schools:', error)
    throw error
  }
}

/**
 * Get financial aid statistics for a school
 */
export async function getSchoolFinancialAid(id: number): Promise<{
  pellGrantRate: number
  federalLoanRate: number
  medianDebt: number
  monthlyPayment: number
  avgNetPrice: number
} | null> {
  const school = await getSchoolById(id)
  if (!school) return null

  return {
    pellGrantRate: school.pellGrantRate,
    federalLoanRate: school.federalLoanRate,
    medianDebt: school.medianDebt,
    monthlyPayment: school.monthlyPayment,
    avgNetPrice: school.avgNetPrice,
  }
}

export default {
  searchSchools,
  getSchoolById,
  getSchoolsNearZip,
  getSchoolsByState,
  autocompleteSchools,
  getSchoolFinancialAid,
}
