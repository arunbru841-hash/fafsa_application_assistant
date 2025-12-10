'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, MapPin, Building2, Users, DollarSign, GraduationCap, ExternalLink, Loader2, X } from 'lucide-react'
import { useSchoolAutocomplete } from '@/lib/hooks'
import { searchSchools, formatTuition, formatPercentage, getOwnershipLabel } from '@/lib/api'
import type { School, SchoolSearchResult } from '@/lib/api'

interface SchoolSearchProps {
  onSelectSchool?: (school: School) => void
  placeholder?: string
  showFilters?: boolean
  className?: string
}

// US States for filter
const US_STATES = [
  { code: 'AL', name: 'Alabama' }, { code: 'AK', name: 'Alaska' }, { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' }, { code: 'CA', name: 'California' }, { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' }, { code: 'DE', name: 'Delaware' }, { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' }, { code: 'HI', name: 'Hawaii' }, { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' }, { code: 'IN', name: 'Indiana' }, { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' }, { code: 'KY', name: 'Kentucky' }, { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' }, { code: 'MD', name: 'Maryland' }, { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' }, { code: 'MN', name: 'Minnesota' }, { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' }, { code: 'MT', name: 'Montana' }, { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' }, { code: 'NH', name: 'New Hampshire' }, { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' }, { code: 'NY', name: 'New York' }, { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' }, { code: 'OH', name: 'Ohio' }, { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' }, { code: 'PA', name: 'Pennsylvania' }, { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' }, { code: 'SD', name: 'South Dakota' }, { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' }, { code: 'UT', name: 'Utah' }, { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' }, { code: 'WA', name: 'Washington' }, { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' }, { code: 'WY', name: 'Wyoming' }, { code: 'DC', name: 'Washington DC' },
]

export default function SchoolSearch({
  onSelectSchool,
  placeholder = 'Search for a school...',
  showFilters = true,
  className = '',
}: SchoolSearchProps) {
  // Search state
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [ownership, setOwnership] = useState<number[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<SchoolSearchResult | null>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null)
  
  // Refs
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Autocomplete hook
  const { results: autocompleteResults, isLoading: isAutocompleting } = useSchoolAutocomplete(searchQuery)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle search
  const handleSearch = async () => {
    if (!searchQuery && !selectedState) return

    setIsSearching(true)
    setShowDropdown(false)

    try {
      const results = await searchSchools({
        q: searchQuery || undefined,
        state: selectedState || undefined,
        ownership: ownership.length > 0 ? ownership : undefined,
        perPage: 20,
      })
      setSearchResults(results)
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setIsSearching(false)
    }
  }

  // Handle selecting a school from autocomplete
  const handleSelectAutocomplete = async (result: { id: number; name: string; city: string; state: string }) => {
    setSearchQuery(result.name)
    setShowDropdown(false)
    
    // Fetch full school details
    setIsSearching(true)
    try {
      const results = await searchSchools({ q: result.name, perPage: 1 })
      if (results.results.length > 0) {
        const school = results.results[0]
        setSelectedSchool(school)
        onSelectSchool?.(school)
      }
    } finally {
      setIsSearching(false)
    }
  }

  // Handle selecting a school from results
  const handleSelectSchool = (school: School) => {
    setSelectedSchool(school)
    onSelectSchool?.(school)
  }

  // Toggle ownership filter
  const toggleOwnership = (value: number) => {
    setOwnership(prev => 
      prev.includes(value) 
        ? prev.filter(v => v !== value)
        : [...prev, value]
    )
  }

  // Clear selection
  const clearSelection = () => {
    setSelectedSchool(null)
    setSearchQuery('')
    setSearchResults(null)
    inputRef.current?.focus()
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Input */}
      <div ref={searchRef} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setShowDropdown(true)
            }}
            onFocus={() => setShowDropdown(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch()
              }
            }}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          {(isAutocompleting || isSearching) && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 animate-spin" />
          )}
        </div>

        {/* Autocomplete Dropdown */}
        {showDropdown && autocompleteResults.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
            {autocompleteResults.map((result) => (
              <button
                key={result.id}
                onClick={() => handleSelectAutocomplete(result)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 last:border-b-0"
              >
                <GraduationCap className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <div>
                  <div className="font-medium text-gray-900">{result.name}</div>
                  <div className="text-sm text-gray-500">{result.city}, {result.state}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="flex flex-wrap gap-4">
          {/* State Filter */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All States</option>
              {US_STATES.map((state) => (
                <option key={state.code} value={state.code}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>

          {/* Ownership Filter */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">School Type</label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 1, label: 'Public' },
                { value: 2, label: 'Private Nonprofit' },
                { value: 3, label: 'For-Profit' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => toggleOwnership(option.value)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    ownership.includes(option.value)
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSearching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              Search
            </button>
          </div>
        </div>
      )}

      {/* Selected School Card */}
      {selectedSchool && (
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                <GraduationCap className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{selectedSchool.name}</h3>
                <p className="text-sm text-gray-600">
                  {selectedSchool.city}, {selectedSchool.state}
                </p>
                <div className="flex flex-wrap gap-4 mt-2 text-sm">
                  <span className="flex items-center gap-1 text-gray-600">
                    <Building2 className="h-4 w-4" />
                    {getOwnershipLabel(selectedSchool.ownership)}
                  </span>
                  <span className="flex items-center gap-1 text-gray-600">
                    <Users className="h-4 w-4" />
                    {selectedSchool.studentSize?.toLocaleString() || 'N/A'} students
                  </span>
                  <span className="flex items-center gap-1 text-gray-600">
                    <DollarSign className="h-4 w-4" />
                    {formatTuition(selectedSchool.inStateTuition)} (in-state)
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={clearSelection}
              className="p-1 hover:bg-primary-200 rounded-full transition-colors"
              aria-label="Clear selection"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>
      )}

      {/* Search Results */}
      {searchResults && searchResults.results.length > 0 && !selectedSchool && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900">
              Found {searchResults.metadata.total.toLocaleString()} schools
            </h3>
          </div>
          
          <div className="grid gap-3">
            {searchResults.results.map((school) => (
              <div
                key={school.id}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:shadow-sm transition-all cursor-pointer"
                onClick={() => handleSelectSchool(school)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900 hover:text-primary-600">
                      {school.name}
                    </h4>
                    <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {school.city}, {school.state}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    school.ownership === 'public' 
                      ? 'bg-green-100 text-green-700'
                      : school.ownership === 'private-nonprofit'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-orange-100 text-orange-700'
                  }`}>
                    {getOwnershipLabel(school.ownership)}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                  <div>
                    <span className="text-gray-500">Enrollment</span>
                    <p className="font-medium">{school.studentSize?.toLocaleString() || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">In-State Tuition</span>
                    <p className="font-medium">{formatTuition(school.inStateTuition)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Avg Net Price</span>
                    <p className="font-medium">{formatTuition(school.avgNetPrice)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Graduation Rate</span>
                    <p className="font-medium">
                      {school.graduationRate ? formatPercentage(school.graduationRate) : 'N/A'}
                    </p>
                  </div>
                </div>

                {school.website && (
                  <a
                    href={school.website.startsWith('http') ? school.website : `https://${school.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-3 text-sm text-primary-600 hover:text-primary-700"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Visit Website <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {searchResults && searchResults.results.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <GraduationCap className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p>No schools found matching your search criteria.</p>
          <p className="text-sm mt-1">Try adjusting your filters or search term.</p>
        </div>
      )}
    </div>
  )
}
