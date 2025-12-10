/**
 * React Hooks for API Services
 * 
 * Custom hooks for fetching and managing data from the backend APIs
 */

'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  searchSchools,
  autocompleteSchools,
  getSchoolById,
  getSchoolFinancialAid,
  getStudentLoanRates,
  getEconomicIndicators,
  getInflationData,
  getEconomicSummary,
  getPovertyGuidelines,
  getTotalStudentLoans,
} from './api'
import type {
  School,
  SchoolSearchParams,
  SchoolSearchResult,
  SchoolAutocompleteResult,
  FinancialAidData,
  StudentLoanRates,
  EconomicIndicators,
  InflationData,
  EconomicSummary,
  PovertyGuidelines,
  StudentLoanTotal,
} from './api'

// Generic hook state
interface UseQueryState<T> {
  data: T | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

// ============================================
// School Hooks
// ============================================

/**
 * Hook for searching schools
 */
export function useSchoolSearch(params: SchoolSearchParams, enabled: boolean = true) {
  const [state, setState] = useState<UseQueryState<SchoolSearchResult>>({
    data: null,
    isLoading: false,
    error: null,
    refetch: async () => {},
  })

  const fetchData = useCallback(async () => {
    if (!enabled) return
    
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      const result = await searchSchools(params)
      setState(prev => ({ ...prev, data: result, isLoading: false }))
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Failed to search schools',
        isLoading: false,
      }))
    }
  }, [params, enabled])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    ...state,
    refetch: fetchData,
  }
}

/**
 * Hook for school autocomplete
 */
export function useSchoolAutocomplete(query: string, limit: number = 10) {
  const [results, setResults] = useState<SchoolAutocompleteResult[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!query || query.length < 3) {
      setResults([])
      return
    }

    let cancelled = false
    setIsLoading(true)

    const timeoutId = setTimeout(async () => {
      try {
        const data = await autocompleteSchools(query, limit)
        if (!cancelled) {
          setResults(data)
        }
      } catch (err) {
        if (!cancelled) {
          setResults([])
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }, 300) // Debounce

    return () => {
      cancelled = true
      clearTimeout(timeoutId)
    }
  }, [query, limit])

  return { results, isLoading }
}

/**
 * Hook for getting a single school
 */
export function useSchool(id: number | null) {
  const [state, setState] = useState<UseQueryState<School>>({
    data: null,
    isLoading: false,
    error: null,
    refetch: async () => {},
  })

  const fetchData = useCallback(async () => {
    if (!id) return

    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const school = await getSchoolById(id)
      setState(prev => ({ ...prev, data: school, isLoading: false }))
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Failed to fetch school',
        isLoading: false,
      }))
    }
  }, [id])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    ...state,
    refetch: fetchData,
  }
}

/**
 * Hook for getting school financial aid data
 */
export function useSchoolFinancialAid(id: number | null) {
  const [state, setState] = useState<UseQueryState<FinancialAidData>>({
    data: null,
    isLoading: false,
    error: null,
    refetch: async () => {},
  })

  const fetchData = useCallback(async () => {
    if (!id) return

    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const data = await getSchoolFinancialAid(id)
      setState(prev => ({ ...prev, data, isLoading: false }))
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Failed to fetch financial aid data',
        isLoading: false,
      }))
    }
  }, [id])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    ...state,
    refetch: fetchData,
  }
}

// ============================================
// Economic Data Hooks
// ============================================

/**
 * Hook for student loan rates
 */
export function useStudentLoanRates() {
  const [state, setState] = useState<UseQueryState<StudentLoanRates>>({
    data: null,
    isLoading: true,
    error: null,
    refetch: async () => {},
  })

  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const data = await getStudentLoanRates()
      setState(prev => ({ ...prev, data, isLoading: false }))
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Failed to fetch loan rates',
        isLoading: false,
      }))
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    ...state,
    refetch: fetchData,
  }
}

/**
 * Hook for economic indicators
 */
export function useEconomicIndicators() {
  const [state, setState] = useState<UseQueryState<EconomicIndicators>>({
    data: null,
    isLoading: true,
    error: null,
    refetch: async () => {},
  })

  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const data = await getEconomicIndicators()
      setState(prev => ({ ...prev, data, isLoading: false }))
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Failed to fetch indicators',
        isLoading: false,
      }))
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    ...state,
    refetch: fetchData,
  }
}

/**
 * Hook for inflation data
 */
export function useInflationData() {
  const [state, setState] = useState<UseQueryState<InflationData>>({
    data: null,
    isLoading: true,
    error: null,
    refetch: async () => {},
  })

  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const data = await getInflationData()
      setState(prev => ({ ...prev, data, isLoading: false }))
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Failed to fetch inflation data',
        isLoading: false,
      }))
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    ...state,
    refetch: fetchData,
  }
}

/**
 * Hook for full economic summary
 */
export function useEconomicSummary() {
  const [state, setState] = useState<UseQueryState<EconomicSummary>>({
    data: null,
    isLoading: true,
    error: null,
    refetch: async () => {},
  })

  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const data = await getEconomicSummary()
      setState(prev => ({ ...prev, data, isLoading: false }))
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Failed to fetch economic summary',
        isLoading: false,
      }))
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    ...state,
    refetch: fetchData,
  }
}

/**
 * Hook for poverty guidelines
 */
export function usePovertyGuidelines() {
  const [state, setState] = useState<UseQueryState<PovertyGuidelines>>({
    data: null,
    isLoading: true,
    error: null,
    refetch: async () => {},
  })

  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const data = await getPovertyGuidelines()
      setState(prev => ({ ...prev, data, isLoading: false }))
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Failed to fetch poverty guidelines',
        isLoading: false,
      }))
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    ...state,
    refetch: fetchData,
  }
}

/**
 * Hook for total student loans outstanding
 */
export function useTotalStudentLoans() {
  const [state, setState] = useState<UseQueryState<StudentLoanTotal>>({
    data: null,
    isLoading: true,
    error: null,
    refetch: async () => {},
  })

  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const data = await getTotalStudentLoans()
      setState(prev => ({ ...prev, data, isLoading: false }))
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Failed to fetch student loan total',
        isLoading: false,
      }))
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    ...state,
    refetch: fetchData,
  }
}

// ============================================
// Combined Hooks
// ============================================

/**
 * Hook for getting school with financial aid data
 */
export function useSchoolWithFinancialAid(id: number | null) {
  const school = useSchool(id)
  const financialAid = useSchoolFinancialAid(id)

  const isLoading = school.isLoading || financialAid.isLoading
  const error = school.error || financialAid.error

  const data = useMemo(() => {
    if (!school.data) return null
    return {
      ...school.data,
      financialAid: financialAid.data,
    }
  }, [school.data, financialAid.data])

  const refetch = useCallback(async () => {
    await Promise.all([school.refetch(), financialAid.refetch()])
  }, [school.refetch, financialAid.refetch])

  return {
    data,
    isLoading,
    error,
    refetch,
  }
}
