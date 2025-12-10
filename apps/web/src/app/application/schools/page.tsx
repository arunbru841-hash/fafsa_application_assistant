'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { ApplicationWizard } from '@/components/application/ApplicationWizard'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { 
  Search, 
  GraduationCap, 
  MapPin, 
  Plus, 
  Trash2, 
  ChevronUp, 
  ChevronDown,
  Building2,
  DollarSign,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Star,
  Loader2,
  Users,
  TrendingUp
} from 'lucide-react'
import { 
  searchSchools, 
  autocompleteSchools, 
  formatTuition, 
  getOwnershipLabel 
} from '@/lib/api'
import type { School as APISchool, SchoolAutocompleteResult } from '@/lib/api'

interface School {
  id: string
  name: string
  city: string
  state: string
  federalSchoolCode: string
  type: string
  tuitionInState?: number
  tuitionOutState?: number
  website?: string
  studentSize?: number
  graduationRate?: number
  pellGrantRate?: number
}

interface SelectedSchool extends School {
  priority: number
  housingPlan: string
}

// Transform API school to local format
function transformAPISchool(apiSchool: APISchool): School {
  return {
    id: String(apiSchool.id),
    name: apiSchool.name,
    city: apiSchool.city,
    state: apiSchool.state,
    federalSchoolCode: String(apiSchool.id), // Using ID as code
    type: getOwnershipLabel(apiSchool.ownership),
    tuitionInState: apiSchool.inStateTuition,
    tuitionOutState: apiSchool.outOfStateTuition,
    website: apiSchool.website,
    studentSize: apiSchool.studentSize,
    graduationRate: apiSchool.graduationRate,
    pellGrantRate: apiSchool.pellGrantRate,
  }
}

// All US States for filtering
const ALL_US_STATES = [
  { value: '', label: 'All States' },
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
  { value: 'DC', label: 'District of Columbia' },
  { value: 'PR', label: 'Puerto Rico' },
]

const US_STATES = ALL_US_STATES

const HOUSING_OPTIONS = [
  { value: '', label: 'Select housing plan' },
  { value: 'on-campus', label: 'On Campus' },
  { value: 'off-campus', label: 'Off Campus (not with parents)' },
  { value: 'with-parents', label: 'With Parents' },
]

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function SchoolsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [stateFilter, setStateFilter] = useState('')
  const [searchResults, setSearchResults] = useState<School[]>([])
  const [selectedSchools, setSelectedSchools] = useState<SelectedSchool[]>([])
  const [showSearch, setShowSearch] = useState(true)
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  
  // Autocomplete state
  const [autocompleteResults, setAutocompleteResults] = useState<SchoolAutocompleteResult[]>([])
  const [showAutocomplete, setShowAutocomplete] = useState(false)
  const [isAutocompleting, setIsAutocompleting] = useState(false)
  const autocompleteTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Debounced autocomplete
  const handleQueryChange = useCallback((query: string) => {
    setSearchQuery(query)
    setSearchError(null)
    
    if (autocompleteTimeoutRef.current) {
      clearTimeout(autocompleteTimeoutRef.current)
    }
    
    if (query.length < 2) {
      setAutocompleteResults([])
      setShowAutocomplete(false)
      return
    }
    
    autocompleteTimeoutRef.current = setTimeout(async () => {
      setIsAutocompleting(true)
      try {
        const results = await autocompleteSchools(query, 8)
        setAutocompleteResults(results)
        setShowAutocomplete(results.length > 0)
      } catch {
        setAutocompleteResults([])
      } finally {
        setIsAutocompleting(false)
      }
    }, 300)
  }, [])

  // Close autocomplete on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        setShowAutocomplete(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = async () => {
    if (!searchQuery.trim() && !stateFilter) {
      setSearchError('Please enter a school name or select a state')
      return
    }
    
    setIsSearching(true)
    setSearchError(null)
    setShowAutocomplete(false)
    setHasSearched(true)
    
    try {
      const response = await searchSchools({
        q: searchQuery || undefined,
        state: stateFilter || undefined,
        perPage: 20,
      })
      
      const schools = response.results.map(transformAPISchool)
      setSearchResults(schools)
      
      if (schools.length === 0) {
        setSearchError('No schools found. Try a different search term.')
      }
    } catch (error) {
      console.error('Search error:', error)
      setSearchError('Unable to search schools. Please try again.')
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const selectAutocompleteItem = (item: SchoolAutocompleteResult) => {
    setSearchQuery(item.name)
    setShowAutocomplete(false)
    // Trigger search with the selected name
    setTimeout(handleSearch, 100)
  }

  const addSchool = (school: School) => {
    if (selectedSchools.length >= 10) {
      alert('You can add up to 10 schools on your FAFSA.')
      return
    }

    if (selectedSchools.find(s => s.id === school.id)) {
      alert('This school is already in your list.')
      return
    }

    const newSchool: SelectedSchool = {
      ...school,
      priority: selectedSchools.length + 1,
      housingPlan: '',
    }

    setSelectedSchools([...selectedSchools, newSchool])
  }

  const removeSchool = (schoolId: string) => {
    const newList = selectedSchools
      .filter(s => s.id !== schoolId)
      .map((s, index) => ({ ...s, priority: index + 1 }))
    setSelectedSchools(newList)
  }

  const updateSchool = (schoolId: string, field: keyof SelectedSchool, value: string | number) => {
    setSelectedSchools(
      selectedSchools.map(s =>
        s.id === schoolId ? { ...s, [field]: value } : s
      )
    )
  }

  const moveSchool = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === selectedSchools.length - 1)
    ) {
      return
    }

    const newList = [...selectedSchools]
    const swapIndex = direction === 'up' ? index - 1 : index + 1
    
    // Swap schools
    const temp = newList[index]
    newList[index] = newList[swapIndex]
    newList[swapIndex] = temp
    
    // Update priorities
    newList.forEach((s, i) => {
      s.priority = i + 1
    })

    setSelectedSchools(newList)
  }

  const handleNext = async () => {
    if (selectedSchools.length === 0) {
      return Promise.reject('Please select at least one school')
    }

    // Check if all schools have housing plans
    const missingHousing = selectedSchools.filter(s => !s.housingPlan)
    if (missingHousing.length > 0) {
      return Promise.reject('Please select a housing plan for all schools')
    }

    console.log('Saving school selections:', selectedSchools)
  }

  return (
    <ApplicationWizard currentStep={6} onNext={handleNext}>
      <div className="space-y-8">
        {/* Introduction */}
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-primary-lighter rounded-full flex items-center justify-center flex-shrink-0">
              <GraduationCap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-primary-darker mb-2">Select Your Schools</h3>
              <p className="text-sm text-gray-700">
                You can list up to <strong>10 schools</strong> on your FAFSA. Schools will receive 
                your information in the order you list them. The first school is considered your 
                top choice and may affect state aid eligibility.
              </p>
            </div>
          </div>
        </div>

        {/* School Search Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold text-primary-darker">Search Schools</h3>
            </div>
            <button
              type="button"
              onClick={() => setShowSearch(!showSearch)}
              className="text-sm text-primary hover:text-primary-dark"
            >
              {showSearch ? 'Hide Search' : 'Show Search'}
            </button>
          </div>

          {showSearch && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="md:col-span-2 relative" ref={searchInputRef}>
                  <Input
                    placeholder="Search by school name..."
                    value={searchQuery}
                    onChange={(e) => handleQueryChange(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    onFocus={() => autocompleteResults.length > 0 && setShowAutocomplete(true)}
                  />
                  {isAutocompleting && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                    </div>
                  )}
                  
                  {/* Autocomplete Dropdown */}
                  {showAutocomplete && autocompleteResults.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {autocompleteResults.map(item => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => selectAutocompleteItem(item)}
                          className="w-full px-4 py-2 text-left hover:bg-primary-50 flex items-center gap-2"
                        >
                          <GraduationCap className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <div>
                            <div className="font-medium text-primary-darker text-sm">{item.name}</div>
                            <div className="text-xs text-gray-500">{item.city}, {item.state}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <Select
                  value={stateFilter}
                  onChange={(e) => setStateFilter(e.target.value)}
                  options={US_STATES}
                />
                <Button onClick={handleSearch} disabled={isSearching} className="w-full">
                  {isSearching ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Search
                    </>
                  )}
                </Button>
              </div>

              {/* Search Error */}
              {searchError && (
                <Alert variant="warning" className="mt-2">
                  {searchError}
                </Alert>
              )}

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="border border-gray-200 rounded-lg divide-y divide-gray-200 max-h-96 overflow-y-auto">
                  <div className="bg-gray-50 px-4 py-2 text-sm text-gray-600 font-medium sticky top-0">
                    Found {searchResults.length} schools — Powered by College Scorecard API
                  </div>
                  {searchResults.map(school => {
                    const isSelected = selectedSchools.find(s => s.id === school.id)
                    return (
                      <div
                        key={school.id}
                        className={`p-4 flex items-center justify-between hover:bg-gray-50 ${
                          isSelected ? 'bg-primary-50' : ''
                        }`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-primary-darker">{school.name}</h4>
                            {isSelected && (
                              <span className="text-xs bg-primary-lighter text-primary-dark px-2 py-0.5 rounded-full">
                                Added
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {school.city}, {school.state}
                            </span>
                            <span className="flex items-center gap-1">
                              <Building2 className="w-3 h-3" />
                              {school.type}
                            </span>
                            {school.studentSize && (
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {school.studentSize.toLocaleString()} students
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-sm">
                            {school.tuitionInState && (
                              <>
                                <span className="text-gray-600">
                                  <DollarSign className="w-3 h-3 inline" />
                                  In-State: {formatCurrency(school.tuitionInState)}
                                </span>
                                {school.tuitionOutState !== school.tuitionInState && (
                                  <span className="text-gray-600">
                                    Out-of-State: {formatCurrency(school.tuitionOutState!)}
                                  </span>
                                )}
                              </>
                            )}
                            {school.graduationRate && (
                              <span className="flex items-center gap-1 text-success-600">
                                <TrendingUp className="w-3 h-3" />
                                {(school.graduationRate * 100).toFixed(0)}% grad rate
                              </span>
                            )}
                            {school.pellGrantRate && (
                              <span className="text-primary-dark">
                                {(school.pellGrantRate * 100).toFixed(0)}% receive Pell Grants
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {school.website && (
                            <a
                              href={school.website.startsWith('http') ? school.website : `https://${school.website}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-gray-400 hover:text-primary"
                              title="Visit school website"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                          {!isSelected && (
                            <Button
                              size="sm"
                              onClick={() => addSchool(school)}
                              disabled={selectedSchools.length >= 10}
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Add
                            </Button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {searchResults.length === 0 && hasSearched && !isSearching && !searchError && (
                <div className="text-center py-8 text-gray-500">
                  <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No schools found matching your search.</p>
                  <p className="text-sm mt-1">Try a different search term or browse by state.</p>
                </div>
              )}

              {!hasSearched && !isSearching && (
                <div className="text-center py-8 text-gray-400">
                  <GraduationCap className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Enter a school name or select a state to search</p>
                  <p className="text-xs mt-1">Data provided by the U.S. Department of Education College Scorecard</p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Selected Schools Section */}
        <section className="border-t border-gray-200 pt-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold text-primary-darker">
                Your Schools ({selectedSchools.length}/10)
              </h3>
            </div>
          </div>

          {selectedSchools.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <GraduationCap className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h4 className="font-medium text-primary-darker mb-2">No Schools Selected Yet</h4>
              <p className="text-gray-600 mb-4">
                Search for schools above and add them to your list.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedSchools.map((school, index) => (
                <div
                  key={school.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    {/* Priority Badge */}
                    <div className="flex flex-col items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveSchool(index, 'up')}
                        disabled={index === 0}
                        className="p-1 text-gray-400 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {school.priority}
                      </div>
                      <button
                        type="button"
                        onClick={() => moveSchool(index, 'down')}
                        disabled={index === selectedSchools.length - 1}
                        className="p-1 text-gray-400 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>

                    {/* School Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-primary-darker">{school.name}</h4>
                          <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                            <span>{school.city}, {school.state}</span>
                            <span>•</span>
                            <span>Code: {school.federalSchoolCode}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeSchool(school.id)}
                          className="p-2 text-gray-400 hover:text-error"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Housing Plan Selection */}
                      <div className="mt-4 grid md:grid-cols-2 gap-4">
                        <Select
                          label="Housing Plan"
                          value={school.housingPlan}
                          onChange={(e) => updateSchool(school.id, 'housingPlan', e.target.value)}
                          options={HOUSING_OPTIONS}
                          required
                        />
                        {school.tuitionInState && (
                          <div className="flex items-center gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Tuition: </span>
                              <span className="font-medium text-primary-darker">
                                {formatCurrency(school.tuitionInState)}
                              </span>
                              <span className="text-gray-500"> (in-state)</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Housing status indicator */}
                      <div className="mt-2">
                        {school.housingPlan ? (
                          <span className="inline-flex items-center gap-1 text-sm text-primary">
                            <CheckCircle className="w-4 h-4" />
                            Housing plan selected
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-sm text-warning-600">
                            <AlertCircle className="w-4 h-4" />
                            Please select a housing plan
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedSchools.length > 0 && selectedSchools.length < 10 && (
            <Alert variant="info" className="mt-4">
              <p>
                You can add up to {10 - selectedSchools.length} more school(s). 
                Consider adding backup options to maximize your financial aid opportunities.
              </p>
            </Alert>
          )}
        </section>

        {/* Tips Section */}
        <section className="border-t border-gray-200 pt-8">
          <h3 className="text-lg font-bold text-primary-darker mb-4">Tips for Choosing Schools</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-primary-darker mb-2">📋 List Order Matters</h4>
              <p className="text-sm text-gray-600">
                Some states prioritize aid for students who list in-state public schools first. 
                Check your state's requirements.
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-primary-darker mb-2">🏠 Housing Affects Aid</h4>
              <p className="text-sm text-gray-600">
                Your housing plan affects the cost of attendance calculation, which determines 
                your maximum financial aid eligibility.
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-primary-darker mb-2">📅 Apply Early</h4>
              <p className="text-sm text-gray-600">
                Many schools have limited funds and award aid on a first-come, first-served basis. 
                Submit your FAFSA as soon as possible.
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-primary-darker mb-2">✏️ You Can Edit Later</h4>
              <p className="text-sm text-gray-600">
                You can add, remove, or reorder schools after submitting your FAFSA by logging 
                into StudentAid.gov.
              </p>
            </div>
          </div>
        </section>
      </div>
    </ApplicationWizard>
  )
}

