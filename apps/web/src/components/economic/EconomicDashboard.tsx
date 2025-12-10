'use client'

import { TrendingUp, TrendingDown, DollarSign, Percent, PiggyBank, AlertCircle, Loader2, RefreshCw } from 'lucide-react'
import { useStudentLoanRates, useEconomicSummary } from '@/lib/hooks'
import { formatCurrency, formatLargeCurrency, formatPercentage, formatInterestRate } from '@/lib/api'

interface EconomicDashboardProps {
  className?: string
  showDetailedRates?: boolean
}

export default function EconomicDashboard({
  className = '',
  showDetailedRates = true,
}: EconomicDashboardProps) {
  const { data: loanRates, isLoading: isLoadingRates, error: ratesError, refetch: refetchRates } = useStudentLoanRates()
  const { data: summary, isLoading: isLoadingSummary, error: summaryError, refetch: refetchSummary } = useEconomicSummary()

  const isLoading = isLoadingRates || isLoadingSummary
  const error = ratesError || summaryError

  const handleRefresh = () => {
    refetchRates()
    refetchSummary()
  }

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-8 ${className}`}>
        <div className="flex items-center justify-center gap-3 text-gray-500">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading economic data...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`bg-red-50 rounded-lg border border-red-200 p-6 ${className}`}>
        <div className="flex items-center gap-3 text-red-600">
          <AlertCircle className="h-6 w-6 flex-shrink-0" />
          <div>
            <p className="font-medium">Failed to load economic data</p>
            <p className="text-sm text-red-500 mt-1">{error}</p>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Current Economic Data</h2>
        <button
          onClick={handleRefresh}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          title="Refresh data"
        >
          <RefreshCw className="h-5 w-5" />
        </button>
      </div>

      {/* Federal Student Loan Rates */}
      {loanRates && (
        <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-lg border border-primary-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Percent className="h-5 w-5 text-primary-600" />
            <h3 className="font-semibold text-gray-900">Federal Student Loan Interest Rates</h3>
            <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">
              {loanRates.federalStudentLoanRates.effectiveDate}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-600">Direct Subsidized</p>
              <p className="text-2xl font-bold text-primary-600">
                {formatInterestRate(loanRates.federalStudentLoanRates.directSubsidized)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Undergraduate</p>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-600">Direct Unsubsidized</p>
              <p className="text-2xl font-bold text-primary-600">
                {formatInterestRate(loanRates.federalStudentLoanRates.directUnsubsidized)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Undergraduate</p>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-600">Graduate Unsubsidized</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatInterestRate(loanRates.federalStudentLoanRates.directUnsubsidizedGrad)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Graduate/Professional</p>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-600">Direct PLUS</p>
              <p className="text-2xl font-bold text-purple-600">
                {formatInterestRate(loanRates.federalStudentLoanRates.directPLUS)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Parent/Graduate</p>
            </div>
          </div>

          {showDetailedRates && loanRates.treasuryNoteRate && (
            <div className="mt-4 pt-4 border-t border-primary-200">
              <p className="text-sm text-gray-600">
                <strong>Rate Context:</strong> Federal student loan rates are based on the 10-year Treasury note. 
                Current Treasury note rate: <span className="font-semibold">{formatInterestRate(loanRates.treasuryNoteRate)}</span>
              </p>
            </div>
          )}
        </div>
      )}

      {/* Economic Indicators */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Student Loans */}
          {summary.totalStudentLoans && (
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <PiggyBank className="h-5 w-5" />
                <span className="text-sm font-medium">Total Student Debt</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {formatLargeCurrency(summary.totalStudentLoans.amount)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                As of {summary.totalStudentLoans.date}
              </p>
            </div>
          )}

          {/* Inflation */}
          {summary.inflation && (
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                {summary.inflation.yearOverYearChange > 0 ? (
                  <TrendingUp className="h-5 w-5 text-red-500" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-green-500" />
                )}
                <span className="text-sm font-medium">Inflation (YoY)</span>
              </div>
              <p className={`text-2xl font-bold ${
                summary.inflation.yearOverYearChange > 3 ? 'text-red-600' : 'text-gray-900'
              }`}>
                {formatPercentage(summary.inflation.yearOverYearChange)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                CPI: {summary.inflation.currentCPI.toFixed(1)}
              </p>
            </div>
          )}

          {/* Unemployment */}
          {summary.economicIndicators?.unemploymentRate && (
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <DollarSign className="h-5 w-5" />
                <span className="text-sm font-medium">Unemployment Rate</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {formatPercentage(summary.economicIndicators.unemploymentRate.value)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                As of {summary.economicIndicators.unemploymentRate.date}
              </p>
            </div>
          )}

          {/* Federal Funds Rate */}
          {summary.economicIndicators?.federalFundsRate && (
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Percent className="h-5 w-5" />
                <span className="text-sm font-medium">Federal Funds Rate</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {formatPercentage(summary.economicIndicators.federalFundsRate.value)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                As of {summary.economicIndicators.federalFundsRate.date}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Data Sources Note */}
      <div className="text-xs text-gray-500 text-center">
        Data sources: U.S. Department of Education, Federal Reserve (FRED), U.S. Treasury
        {summary?.lastUpdated && (
          <span> • Last updated: {new Date(summary.lastUpdated).toLocaleString()}</span>
        )}
      </div>
    </div>
  )
}
