'use client'

import Link from 'next/link'
import { ArrowRight, Calendar, Clock, AlertTriangle, CheckCircle, Info, MapPin, Building, GraduationCap, ExternalLink, Bell } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { useState } from 'react'

// State deadline data for 2026-27 FAFSA
const stateDeadlines = [
  { state: 'Alabama', deadline: 'Check with your state agency', priority: false, notes: 'Contact ACHE for deadline information' },
  { state: 'Alaska', deadline: 'Check with your state agency', priority: false, notes: 'Alaska Performance Scholarship has specific requirements' },
  { state: 'Arizona', deadline: 'Check with your state agency', priority: false, notes: 'Varies by program' },
  { state: 'Arkansas', deadline: 'June 1, 2026', priority: true, notes: 'Academic Challenge Scholarship' },
  { state: 'California', deadline: 'March 2, 2026', priority: true, notes: 'Cal Grant deadline. For many state financial aid programs, March 2 is the deadline for first-time Cal Grant applicants.' },
  { state: 'Colorado', deadline: 'Check with your state agency', priority: false, notes: 'Colorado Student Grant deadline varies' },
  { state: 'Connecticut', deadline: 'February 15, 2026', priority: true, notes: 'Recommended deadline for best consideration' },
  { state: 'Delaware', deadline: 'April 15, 2026', priority: true, notes: 'Delaware Scholarship Incentive Program' },
  { state: 'District of Columbia', deadline: 'May 1, 2026', priority: true, notes: 'DC Tuition Assistance Grant deadline' },
  { state: 'Florida', deadline: 'May 15, 2026', priority: true, notes: 'Florida Student Assistance Grant. Processing must be complete by this date.' },
  { state: 'Georgia', deadline: 'Check with your state agency', priority: false, notes: 'HOPE and Zell Miller Scholarships have specific criteria' },
  { state: 'Hawaii', deadline: 'Check with your state agency', priority: false, notes: 'Contact University of Hawaii financial aid office' },
  { state: 'Idaho', deadline: 'March 1, 2026', priority: true, notes: 'Idaho Opportunity Scholarship' },
  { state: 'Illinois', deadline: 'As soon as possible after October 1', priority: true, notes: 'Monetary Award Program (MAP) - Awards made until funds exhausted' },
  { state: 'Indiana', deadline: 'April 15, 2026', priority: true, notes: 'Frank O\'Bannon Grant and 21st Century Scholars' },
  { state: 'Iowa', deadline: 'July 1, 2026', priority: false, notes: 'Iowa Tuition Grant' },
  { state: 'Kansas', deadline: 'April 1, 2026', priority: true, notes: 'Kansas Comprehensive Grant' },
  { state: 'Kentucky', deadline: 'As soon as possible after October 1', priority: true, notes: 'Kentucky Educational Excellence Scholarship (KEES)' },
  { state: 'Louisiana', deadline: 'July 1, 2026', priority: false, notes: 'TOPS (Taylor Opportunity Program for Students)' },
  { state: 'Maine', deadline: 'May 1, 2026', priority: true, notes: 'Maine State Grant Program' },
  { state: 'Maryland', deadline: 'March 1, 2026', priority: true, notes: 'Maryland State Scholarship - Howard P. Rawlings Program' },
  { state: 'Massachusetts', deadline: 'May 1, 2026', priority: true, notes: 'MASSGrant and other state aid' },
  { state: 'Michigan', deadline: 'March 1, 2026', priority: true, notes: 'Michigan Competitive Scholarship and Tuition Grant' },
  { state: 'Minnesota', deadline: '30 days after start of term', priority: false, notes: 'Minnesota State Grant Program' },
  { state: 'Mississippi', deadline: 'March 31, 2026', priority: true, notes: 'Mississippi Tuition Assistance Grant (MTAG) and MESG' },
  { state: 'Missouri', deadline: 'April 1, 2026', priority: true, notes: 'Access Missouri Financial Assistance Program' },
  { state: 'Montana', deadline: 'March 1, 2026', priority: true, notes: 'Montana Higher Education Grant' },
  { state: 'Nebraska', deadline: 'Check with your state agency', priority: false, notes: 'Nebraska Opportunity Grant' },
  { state: 'Nevada', deadline: 'As soon as possible', priority: true, notes: 'Silver State Opportunity Grant' },
  { state: 'New Hampshire', deadline: 'Check with your state agency', priority: false, notes: 'Granite State Grant' },
  { state: 'New Jersey', deadline: 'April 15, 2026', priority: true, notes: 'Tuition Aid Grant (TAG) - submit by deadline for guaranteed consideration' },
  { state: 'New Mexico', deadline: 'Check with your state agency', priority: false, notes: 'New Mexico Lottery Scholarship and other programs' },
  { state: 'New York', deadline: 'June 30, 2027', priority: false, notes: 'TAP (Tuition Assistance Program) - apply as early as possible' },
  { state: 'North Carolina', deadline: 'As soon as possible after October 1', priority: true, notes: 'NC Need-Based Scholarship' },
  { state: 'North Dakota', deadline: 'April 15, 2026', priority: true, notes: 'North Dakota State Grant' },
  { state: 'Ohio', deadline: 'October 1, 2026', priority: false, notes: 'Ohio College Opportunity Grant' },
  { state: 'Oklahoma', deadline: 'Check with your state agency', priority: false, notes: 'Oklahoma Tuition Aid Grant' },
  { state: 'Oregon', deadline: 'As soon as possible after October 1', priority: true, notes: 'Oregon Opportunity Grant - awards made until funds exhausted' },
  { state: 'Pennsylvania', deadline: 'May 1, 2026', priority: true, notes: 'PA State Grant Program' },
  { state: 'Rhode Island', deadline: 'March 1, 2026', priority: true, notes: 'Rhode Island State Grant' },
  { state: 'South Carolina', deadline: 'June 30, 2026', priority: false, notes: 'SC Need-based Grant and other programs' },
  { state: 'South Dakota', deadline: 'Check with your state agency', priority: false, notes: 'South Dakota Opportunity Scholarship' },
  { state: 'Tennessee', deadline: 'February 1, 2026', priority: true, notes: 'Tennessee Student Assistance Award' },
  { state: 'Texas', deadline: 'January 15, 2026', priority: true, notes: 'TEXAS Grant priority deadline' },
  { state: 'Utah', deadline: 'Check with your state agency', priority: false, notes: 'Utah Centennial Opportunity Program for Education (UCOPE)' },
  { state: 'Vermont', deadline: 'Check with your state agency', priority: false, notes: 'Vermont Student Assistance Corporation' },
  { state: 'Virginia', deadline: 'Check with your state agency', priority: false, notes: 'Virginia Tuition Assistance Grant' },
  { state: 'Washington', deadline: 'As soon as possible', priority: true, notes: 'Washington College Grant - apply early, funds limited' },
  { state: 'West Virginia', deadline: 'April 15, 2026', priority: true, notes: 'West Virginia Higher Education Grant' },
  { state: 'Wisconsin', deadline: 'Check with your state agency', priority: false, notes: 'Wisconsin Grant' },
  { state: 'Wyoming', deadline: 'Check with your state agency', priority: false, notes: 'Hathaway Scholarship' },
]

export default function DeadlinesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showPriorityOnly, setShowPriorityOnly] = useState(false)

  const filteredStates = stateDeadlines.filter(state => {
    const matchesSearch = state.state.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPriority = showPriorityOnly ? state.priority : true
    return matchesSearch && matchesPriority
  })

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary-darker text-white py-12 lg:py-16">
          <div className="container-custom">
            <nav className="text-sm mb-6">
              <ol className="flex items-center gap-2 text-gray-300">
                <li><Link href="/" className="hover:text-white">Home</Link></li>
                <li>/</li>
                <li><Link href="/application/getting-started" className="hover:text-white">Apply for Aid</Link></li>
                <li>/</li>
                <li className="text-white font-medium">FAFSA Deadlines</li>
              </ol>
            </nav>
            
            <div className="max-w-4xl">
              <h1 className="text-4xl sm:text-5xl font-bold mb-6">
                FAFSA<sup>®</sup> Deadlines
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed mb-6">
                Meeting deadlines is critical to receiving financial aid. There are three types of deadlines you need to know: <strong className="text-white">federal</strong>, <strong className="text-white">state</strong>, and <strong className="text-white">college</strong>. Apply as early as possible to maximize your aid.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/application/getting-started"
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-bold rounded hover:bg-primary-dark transition-colors"
                >
                  Start Your FAFSA
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <a 
                  href="#state-deadlines"
                  className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white font-bold rounded hover:bg-white hover:text-primary-darker transition-colors"
                >
                  View State Deadlines
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Important Alert Banner */}
        <section className="bg-warning-light border-l-4 border-warning">
          <div className="container-custom py-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-warning-dark flex-shrink-0 mt-0.5" />
              <div>
                <h2 className="font-bold text-warning-dark">Important: Don't Miss Your Deadlines!</h2>
                <p className="text-base-dark">
                  Some states award aid on a first-come, first-served basis until funds are exhausted. Apply as soon as possible after October 1, 2025, for the 2026–27 school year.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Three Types of Deadlines */}
        <section className="py-12 lg:py-16 bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary-darker mb-4">Three Types of FAFSA Deadlines</h2>
              <p className="text-lg text-base-dark max-w-3xl mx-auto">
                To maximize your financial aid, you need to meet all applicable deadlines. Each type serves a different purpose.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Federal Deadline */}
              <div className="bg-white rounded-lg shadow-lg p-8 border-t-4 border-primary">
                <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                  <Building className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-primary-darker mb-3">Federal Deadline</h3>
                <div className="bg-primary-lighter/30 rounded-lg p-4 mb-4">
                  <p className="text-2xl font-bold text-primary">June 30, 2027</p>
                  <p className="text-sm text-base-dark">for 2026–27 FAFSA</p>
                </div>
                <p className="text-base-dark mb-4">
                  This is the last day to submit your FAFSA for the 2026–27 award year. However, waiting until this deadline means you may miss state and school deadlines.
                </p>
                <ul className="space-y-2 text-sm text-base-dark">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Required for all federal student aid</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Includes Pell Grants, Direct Loans, Work-Study</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
                    <span>Corrections must be submitted by Sept 14, 2027</span>
                  </li>
                </ul>
              </div>

              {/* State Deadline */}
              <div className="bg-white rounded-lg shadow-lg p-8 border-t-4 border-secondary">
                <div className="w-14 h-14 bg-secondary/10 rounded-lg flex items-center justify-center mb-6">
                  <MapPin className="w-7 h-7 text-secondary" />
                </div>
                <h3 className="text-xl font-bold text-primary-darker mb-3">State Deadlines</h3>
                <div className="bg-secondary/10 rounded-lg p-4 mb-4">
                  <p className="text-2xl font-bold text-secondary">Varies by State</p>
                  <p className="text-sm text-base-dark">Check your state below</p>
                </div>
                <p className="text-base-dark mb-4">
                  Each state has its own deadline for state financial aid programs. Many states have early priority deadlines or award funds on a first-come, first-served basis.
                </p>
                <ul className="space-y-2 text-sm text-base-dark">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>State grants and scholarships</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
                    <span>Some deadlines are as early as January</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
                    <span>Funds may run out before deadline</span>
                  </li>
                </ul>
              </div>

              {/* College Deadline */}
              <div className="bg-white rounded-lg shadow-lg p-8 border-t-4 border-accent-cool">
                <div className="w-14 h-14 bg-accent-cool/10 rounded-lg flex items-center justify-center mb-6">
                  <GraduationCap className="w-7 h-7 text-accent-cool-dark" />
                </div>
                <h3 className="text-xl font-bold text-primary-darker mb-3">College Deadlines</h3>
                <div className="bg-accent-cool/10 rounded-lg p-4 mb-4">
                  <p className="text-2xl font-bold text-accent-cool-dark">Varies by School</p>
                  <p className="text-sm text-base-dark">Contact your school</p>
                </div>
                <p className="text-base-dark mb-4">
                  Each college or career school sets its own priority deadline for financial aid. Some schools have different deadlines for different types of aid.
                </p>
                <ul className="space-y-2 text-sm text-base-dark">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Institutional grants and scholarships</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Campus-based aid (Work-Study, Perkins)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Check each school's financial aid website</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 2026-27 Key Dates Timeline */}
        <section className="py-12 lg:py-16">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-primary-darker mb-8 text-center">
                2026–27 FAFSA Key Dates
              </h2>
              
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary-light hidden md:block"></div>
                
                <div className="space-y-8">
                  {/* October 2025 */}
                  <div className="flex gap-6">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center flex-shrink-0 relative z-10">
                      <Calendar className="w-8 h-8 text-white" />
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-6 flex-1 shadow-sm">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="bg-primary text-white text-sm font-bold px-3 py-1 rounded">October 1, 2025</span>
                        <span className="bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded">NOW OPEN</span>
                      </div>
                      <h3 className="text-xl font-bold text-primary-darker mb-2">2026–27 FAFSA Opens</h3>
                      <p className="text-base-dark">
                        The 2026–27 FAFSA form becomes available. Apply as soon as possible to meet the earliest state and school deadlines. Uses your 2024 tax information.
                      </p>
                    </div>
                  </div>

                  {/* January 2026 */}
                  <div className="flex gap-6">
                    <div className="w-16 h-16 bg-warning rounded-full flex items-center justify-center flex-shrink-0 relative z-10">
                      <AlertTriangle className="w-8 h-8 text-white" />
                    </div>
                    <div className="bg-white border border-warning rounded-lg p-6 flex-1 shadow-sm">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="bg-warning text-white text-sm font-bold px-3 py-1 rounded">January – March 2026</span>
                      </div>
                      <h3 className="text-xl font-bold text-primary-darker mb-2">Early State Deadlines</h3>
                      <p className="text-base-dark">
                        Many states have priority deadlines during this period. Texas (Jan 15), Tennessee (Feb 1), California (March 2), and others have early deadlines. Check your state's specific deadline below.
                      </p>
                    </div>
                  </div>

                  {/* Spring 2026 */}
                  <div className="flex gap-6">
                    <div className="w-16 h-16 bg-accent-cool rounded-full flex items-center justify-center flex-shrink-0 relative z-10">
                      <Clock className="w-8 h-8 text-white" />
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-6 flex-1 shadow-sm">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="bg-accent-cool text-white text-sm font-bold px-3 py-1 rounded">April – May 2026</span>
                      </div>
                      <h3 className="text-xl font-bold text-primary-darker mb-2">Most State & College Deadlines</h3>
                      <p className="text-base-dark">
                        The majority of state priority deadlines and college financial aid deadlines fall during this period. You should receive your financial aid offers from schools around this time.
                      </p>
                    </div>
                  </div>

                  {/* June 2027 */}
                  <div className="flex gap-6">
                    <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center flex-shrink-0 relative z-10">
                      <Bell className="w-8 h-8 text-white" />
                    </div>
                    <div className="bg-white border border-secondary rounded-lg p-6 flex-1 shadow-sm">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="bg-secondary text-white text-sm font-bold px-3 py-1 rounded">June 30, 2027</span>
                      </div>
                      <h3 className="text-xl font-bold text-primary-darker mb-2">Federal FAFSA Deadline</h3>
                      <p className="text-base-dark">
                        This is the final day to submit your 2026–27 FAFSA. Corrections and updates must be submitted by September 14, 2027. Don't wait until this date—you'll miss state and school aid.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* State Deadlines Table */}
        <section id="state-deadlines" className="py-12 lg:py-16 bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-primary-darker mb-4">
                State FAFSA Deadlines for 2026–27
              </h2>
              <p className="text-lg text-base-dark max-w-3xl mx-auto mb-6">
                Find your state's deadline below. Deadlines shown are for the 2026–27 academic year. Always verify with your state agency as deadlines may change.
              </p>
              
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-xl mx-auto">
                <div className="relative flex-1 w-full">
                  <input
                    type="text"
                    placeholder="Search for your state..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                <label className="flex items-center gap-2 text-base-dark cursor-pointer whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={showPriorityOnly}
                    onChange={(e) => setShowPriorityOnly(e.target.checked)}
                    className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  Show priority deadlines only
                </label>
              </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block bg-white rounded-lg shadow-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-primary-darker text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">State</th>
                    <th className="px-6 py-4 text-left font-semibold">Deadline</th>
                    <th className="px-6 py-4 text-left font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStates.map((state, index) => (
                    <tr 
                      key={state.state}
                      className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-primary-lighter/20 transition-colors`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-primary-darker">{state.state}</span>
                          {state.priority && (
                            <span className="bg-warning/20 text-warning-dark text-xs font-medium px-2 py-0.5 rounded">
                              Priority
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-semibold ${state.priority ? 'text-secondary' : 'text-base-dark'}`}>
                          {state.deadline}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-base-dark text-sm">
                        {state.notes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {filteredStates.map((state) => (
                <div 
                  key={state.state}
                  className={`bg-white rounded-lg shadow p-4 border-l-4 ${state.priority ? 'border-warning' : 'border-primary'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-primary-darker">{state.state}</h3>
                    {state.priority && (
                      <span className="bg-warning/20 text-warning-dark text-xs font-medium px-2 py-0.5 rounded">
                        Priority
                      </span>
                    )}
                  </div>
                  <p className={`font-semibold mb-2 ${state.priority ? 'text-secondary' : 'text-base-dark'}`}>
                    {state.deadline}
                  </p>
                  <p className="text-sm text-base-dark">{state.notes}</p>
                </div>
              ))}
            </div>

            {filteredStates.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg">
                <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-lg text-base-dark">No states found matching your search.</p>
              </div>
            )}

            <div className="mt-8 bg-primary-lighter/30 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <Info className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-primary-darker mb-2">Important Notes About State Deadlines</h3>
                  <ul className="text-base-dark space-y-1 text-sm">
                    <li>• Deadlines are subject to change. Always verify with your state's higher education agency.</li>
                    <li>• "As soon as possible" means funds are awarded on a first-come, first-served basis.</li>
                    <li>• Some states require you to list an in-state school first on your FAFSA.</li>
                    <li>• State grant programs may have additional eligibility requirements beyond the FAFSA.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tips Section */}
        <section className="py-12 lg:py-16">
          <div className="container-custom">
            <h2 className="text-3xl font-bold text-primary-darker mb-8 text-center">
              Tips for Meeting FAFSA Deadlines
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-green-600">1</span>
                </div>
                <h3 className="font-bold text-primary-darker mb-2">Apply Early</h3>
                <p className="text-base-dark text-sm">
                  Submit your FAFSA as soon as it opens on October 1. Many states award aid on a first-come, first-served basis.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="font-bold text-primary-darker mb-2">Gather Documents First</h3>
                <p className="text-base-dark text-sm">
                  Have your 2024 tax returns, W-2s, and bank statements ready before you start to avoid delays.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-purple-600">3</span>
                </div>
                <h3 className="font-bold text-primary-darker mb-2">Create FSA ID Early</h3>
                <p className="text-base-dark text-sm">
                  You and your parent each need an FSA ID. Create these accounts before you start the FAFSA.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-orange-600">4</span>
                </div>
                <h3 className="font-bold text-primary-darker mb-2">Check All Deadlines</h3>
                <p className="text-base-dark text-sm">
                  Know your federal, state, AND college deadlines. Mark the earliest one on your calendar.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-br from-primary-darker to-primary py-12 lg:py-16">
          <div className="container-custom text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Don't Wait – Start Your 2026–27 FAFSA Today
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              The earlier you apply, the more aid you may receive. It takes about 30 minutes to complete with your documents ready.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/application/getting-started"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-darker font-bold rounded hover:bg-gray-100 transition-colors text-lg"
              >
                Start FAFSA Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <a 
                href="https://studentaid.gov/apply-for-aid/fafsa/fafsa-deadlines"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-bold rounded hover:bg-white hover:text-primary-darker transition-colors text-lg"
              >
                Official StudentAid.gov
                <ExternalLink className="ml-2 w-5 h-5" />
              </a>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}
