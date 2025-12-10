/**
 * API Services Index
 * 
 * Central export point for all API client services
 */

// API Client
export { default as apiClient, handleApiError } from './client'
export type { ApiResponse } from './client'

// Auth Services
export {
  login,
  register,
  logout,
  getCurrentUser,
  updateProfile,
  changePassword,
  refreshAccessToken,
  isAuthenticated,
  getStoredUser,
  tokenStorage,
} from './auth'
export type {
  User,
  AuthTokens,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  ProfileUpdateData,
  ChangePasswordData,
} from './auth'

// School Services (College Scorecard)
export {
  searchSchools,
  autocompleteSchools,
  getSchoolsNearZip,
  getSchoolById,
  getSchoolFinancialAid,
  formatTuition,
  formatPercentage as formatSchoolPercentage,
  getOwnershipLabel,
} from './schools'
export type {
  School,
  SchoolSearchParams,
  SchoolSearchResult,
  SchoolAutocompleteResult,
  FinancialAidData,
} from './schools'

// Economic Services (Treasury + FRED)
export {
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
} from './economic'
export type {
  InterestRate,
  StudentLoanRates,
  InflationData,
  EconomicIndicators,
  StudentLoanTotal,
  PovertyGuidelines,
  EconomicSummary,
} from './economic'
