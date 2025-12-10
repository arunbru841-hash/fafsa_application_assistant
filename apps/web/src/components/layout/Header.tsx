'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Menu, X, Search, User, LogOut, ChevronDown } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user, isAuthenticated, logout, isLoading } = useAuth()

  return (
    <>
      {/* USA Government Banner - Official Site Indicator */}
      <div className="bg-base-50 border-b border-base-200">
        <div className="max-w-7xl mx-auto px-4 py-1 flex items-center gap-2">
          <Image
            src="https://studentaid.gov/universal-navigation/assets/flag-usa.svg"
            alt="U.S. flag"
            width={16}
            height={11}
            className="flex-shrink-0"
          />
          <span className="text-xs text-base-600">
            An official website of the United States government
          </span>
        </div>
      </div>

      {/* Main Header - StudentAid.gov Style */}
      <header className="bg-primary-800">
        <nav className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex items-center gap-2">
                {/* FSA Logo Mark */}
                <div className="w-10 h-10 bg-white rounded flex items-center justify-center">
                  <span className="text-primary-800 font-bold text-lg">FSA</span>
                </div>
                <div className="hidden sm:flex flex-col">
                  <span className="text-white font-bold text-lg leading-tight">
                    Federal Student Aid
                  </span>
                  <span className="text-primary-200 text-xs">
                    An Office of the U.S. Department of Education
                  </span>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              <Link 
                href="/application/getting-started"
                className="px-4 py-2 text-white font-semibold hover:bg-primary-700 rounded transition-colors"
              >
                Apply for Aid
              </Link>
              <Link 
                href="/documents"
                className="px-4 py-2 text-white font-semibold hover:bg-primary-700 rounded transition-colors"
              >
                Documents
              </Link>
              <Link 
                href="/manage-loans"
                className="px-4 py-2 text-white font-semibold hover:bg-primary-700 rounded transition-colors"
              >
                Manage Loans
              </Link>
              <Link 
                href="/resources"
                className="px-4 py-2 text-white font-semibold hover:bg-primary-700 rounded transition-colors"
              >
                Resources
              </Link>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <button className="p-2 text-white hover:bg-primary-700 rounded transition-colors">
                <Search className="w-5 h-5" />
              </button>

              {/* Login/Account */}
              {isLoading ? (
                <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              ) : isAuthenticated && user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white text-primary-800 font-bold rounded hover:bg-base-100 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span className="max-w-[120px] truncate">{user.firstName}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* User Dropdown Menu */}
                  {userMenuOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setUserMenuOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
                        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                          <p className="font-semibold text-primary-800 truncate">{user.firstName} {user.lastName}</p>
                          <p className="text-sm text-gray-600 truncate">{user.email}</p>
                        </div>
                        <div className="py-1">
                          <Link
                            href="/application/getting-started"
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            My FAFSA Application
                          </Link>
                          <Link
                            href="/account/profile"
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            Account Settings
                          </Link>
                          <Link
                            href="/account/documents"
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            My Documents
                          </Link>
                        </div>
                        <div className="border-t border-gray-200 py-1">
                          <button
                            onClick={async () => {
                              setUserMenuOpen(false)
                              await logout()
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Log Out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white text-primary-800 font-bold rounded hover:bg-base-100 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>Log In</span>
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden p-2 text-white hover:bg-primary-700 rounded transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </nav>

        {/* Secondary Navigation Bar */}
        <div className="bg-primary-700 border-t border-primary-600">
          <div className="max-w-7xl mx-auto px-4">
            <div className="hidden lg:flex items-center h-12 gap-6">
              <Link 
                href="/application/getting-started"
                className="text-white text-sm font-medium hover:text-primary-200 transition-colors flex items-center gap-1"
              >
                <span className="text-cyan-400">●</span>
                FAFSA® Form
              </Link>
              <Link 
                href="/manage-loans/repayment"
                className="text-white text-sm font-medium hover:text-primary-200 transition-colors"
              >
                Repayment
              </Link>
              <Link 
                href="/manage-loans/repayment/plans"
                className="text-white text-sm font-medium hover:text-primary-200 transition-colors"
              >
                Repayment Plans
              </Link>
              <Link 
                href="/manage-loans/forgiveness"
                className="text-white text-sm font-medium hover:text-primary-200 transition-colors"
              >
                Forgiveness
              </Link>
              <Link 
                href="/manage-loans/loan-simulator"
                className="text-white text-sm font-medium hover:text-primary-200 transition-colors"
              >
                Loan Simulator
              </Link>
              <Link 
                href="/aid-estimator"
                className="text-white text-sm font-medium hover:text-primary-200 transition-colors"
              >
                Aid Estimator
              </Link>
              <Link 
                href="/deadlines"
                className="text-white text-sm font-medium hover:text-primary-200 transition-colors"
              >
                Deadlines
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-primary-700 border-t border-primary-600">
            <div className="px-4 py-4 space-y-1">
              <Link
                href="/application/getting-started"
                className="block px-4 py-3 text-white font-semibold hover:bg-primary-600 rounded"
                onClick={() => setMobileMenuOpen(false)}
              >
                Apply for Aid
              </Link>
              <Link
                href="/documents"
                className="block px-4 py-3 text-white font-semibold hover:bg-primary-600 rounded"
                onClick={() => setMobileMenuOpen(false)}
              >
                Documents
              </Link>
              <Link
                href="/manage-loans"
                className="block px-4 py-3 text-white font-semibold hover:bg-primary-600 rounded"
                onClick={() => setMobileMenuOpen(false)}
              >
                Manage Loans
              </Link>
              <Link
                href="/resources"
                className="block px-4 py-3 text-white font-semibold hover:bg-primary-600 rounded"
                onClick={() => setMobileMenuOpen(false)}
              >
                Resources
              </Link>
              <div className="pt-4 border-t border-primary-600">
                <Link
                  href="/application/getting-started"
                  className="block px-4 py-3 text-cyan-400 font-semibold hover:bg-primary-600 rounded"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  FAFSA® Form
                </Link>
                <Link
                  href="/manage-loans/repayment"
                  className="block px-4 py-3 text-primary-200 font-medium hover:bg-primary-600 rounded"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Repayment
                </Link>
                <Link
                  href="/manage-loans/repayment/plans"
                  className="block px-4 py-3 text-primary-200 font-medium hover:bg-primary-600 rounded"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Repayment Plans
                </Link>
                <Link
                  href="/manage-loans/forgiveness"
                  className="block px-4 py-3 text-primary-200 font-medium hover:bg-primary-600 rounded"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Forgiveness
                </Link>
                <Link
                  href="/manage-loans/loan-simulator"
                  className="block px-4 py-3 text-primary-200 font-medium hover:bg-primary-600 rounded"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Loan Simulator
                </Link>
                <Link
                  href="/aid-estimator"
                  className="block px-4 py-3 text-primary-200 font-medium hover:bg-primary-600 rounded"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Aid Estimator
                </Link>
                <Link
                  href="/deadlines"
                  className="block px-4 py-3 text-primary-200 font-medium hover:bg-primary-600 rounded"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Deadlines
                </Link>
              </div>
              <div className="pt-4">
                {isAuthenticated && user ? (
                  <>
                    <div className="px-4 py-3 mb-2 bg-primary-600 rounded">
                      <p className="text-white font-semibold">{user.firstName} {user.lastName}</p>
                      <p className="text-primary-200 text-sm truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/account/profile"
                      className="block px-4 py-2 text-primary-200 hover:bg-primary-600 rounded"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Account Settings
                    </Link>
                    <button
                      onClick={async () => {
                        setMobileMenuOpen(false)
                        await logout()
                      }}
                      className="block w-full text-left px-4 py-2 text-red-300 hover:bg-primary-600 rounded"
                    >
                      Log Out
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="block w-full px-4 py-3 bg-white text-primary-800 font-bold text-center rounded"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Log In
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  )
}
