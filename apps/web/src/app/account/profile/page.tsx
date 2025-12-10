'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { User, Mail, Lock, Shield, CheckCircle, AlertTriangle, Eye, EyeOff, Save } from 'lucide-react'

export default function ProfilePage() {
  const router = useRouter()
  const { user, updateProfile, changePassword, isLoading: authLoading, isAuthenticated } = useAuth()
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/account/profile')
    }
  }, [authLoading, isAuthenticated, router])
  
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'security'>('profile')
  
  // Profile form state
  const [firstName, setFirstName] = useState(user?.firstName || '')
  const [lastName, setLastName] = useState(user?.lastName || '')
  const [email, setEmail] = useState(user?.email || '')
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileError, setProfileError] = useState('')
  const [profileSuccess, setProfileSuccess] = useState('')
  
  // Password form state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')

  // Update form when user data loads
  useState(() => {
    if (user) {
      setFirstName(user.firstName)
      setLastName(user.lastName)
      setEmail(user.email)
    }
  })

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileError('')
    setProfileSuccess('')
    setProfileLoading(true)

    try {
      await updateProfile({ firstName, lastName, email })
      setProfileSuccess('Profile updated successfully!')
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setProfileLoading(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess('')

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match')
      return
    }

    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters')
      return
    }

    setPasswordLoading(true)

    try {
      await changePassword({ currentPassword, newPassword })
      setPasswordSuccess('Password changed successfully!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : 'Failed to change password')
    } finally {
      setPasswordLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading your profile...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-primary-darker mb-2">Account Settings</h1>
          <p className="text-gray-600 mb-8">Manage your account information and security settings</p>
          
          {/* Tabs */}
          <div className="flex gap-1 mb-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
                activeTab === 'profile'
                  ? 'text-primary border-primary'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              <User className="w-4 h-4 inline-block mr-2" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
                activeTab === 'password'
                  ? 'text-primary border-primary'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              <Lock className="w-4 h-4 inline-block mr-2" />
              Password
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
                activeTab === 'security'
                  ? 'text-primary border-primary'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              <Shield className="w-4 h-4 inline-block mr-2" />
              Security
            </button>
          </div>
          
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-primary-darker mb-6">Personal Information</h2>
              
              {profileSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <p className="text-green-700">{profileSuccess}</p>
                  </div>
                </div>
              )}
              
              {profileError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <p className="text-red-700">{profileError}</p>
                  </div>
                </div>
              )}
              
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      required
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit" disabled={profileLoading}>
                    {profileLoading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Save className="w-4 h-4" />
                        Save Changes
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          )}
          
          {/* Password Tab */}
          {activeTab === 'password' && (
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-primary-darker mb-6">Change Password</h2>
              
              {passwordSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <p className="text-green-700">{passwordSuccess}</p>
                  </div>
                </div>
              )}
              
              {passwordError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <p className="text-red-700">{passwordError}</p>
                  </div>
                </div>
              )}
              
              <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-md">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      id="currentPassword"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">At least 8 characters with uppercase, lowercase, and numbers</p>
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      required
                    />
                  </div>
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-sm text-red-600 mt-1">Passwords do not match</p>
                  )}
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit" disabled={passwordLoading}>
                    {passwordLoading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Changing...
                      </span>
                    ) : (
                      'Change Password'
                    )}
                  </Button>
                </div>
              </form>
            </div>
          )}
          
          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-primary-darker mb-6">Security Settings</h2>
              
              <div className="space-y-6">
                {/* Account Status */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">Account Status</h3>
                  <div className="flex items-center gap-2">
                    {user?.verified ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-green-700">Email verified</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                        <span className="text-yellow-700">Email not verified</span>
                        <Button variant="outline" size="sm" className="ml-4">
                          Send Verification Email
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Two-Factor Authentication */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">Two-Factor Authentication</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Add an extra layer of security to your account by requiring a verification code in addition to your password.
                  </p>
                  <Button variant="outline">
                    <Shield className="w-4 h-4 mr-2" />
                    Enable 2FA
                  </Button>
                </div>
                
                {/* Login Sessions */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">Active Sessions</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    You're currently logged in on this device. Last login: {user?.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'N/A'}
                  </p>
                  <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
                    Sign Out All Other Sessions
                  </Button>
                </div>
                
                {/* Danger Zone */}
                <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                  <h3 className="font-semibold text-red-800 mb-2">Danger Zone</h3>
                  <p className="text-red-700 text-sm mb-3">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-100">
                    Delete Account
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
