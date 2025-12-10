import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-base-900 text-white">
      {/* Primary Footer - Links */}
      <div className="bg-base-700">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Column 1 */}
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-4">
                Apply for Aid
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/application/getting-started" className="text-base-300 hover:text-white text-sm transition-colors">
                    FAFSA® Form
                  </Link>
                </li>
                <li>
                  <Link href="/fafsa-deadlines" className="text-base-300 hover:text-white text-sm transition-colors">
                    FAFSA Deadlines
                  </Link>
                </li>
                <li>
                  <Link href="/aid-estimator" className="text-base-300 hover:text-white text-sm transition-colors">
                    Aid Estimator
                  </Link>
                </li>
                <li>
                  <Link href="/fafsa-changes" className="text-base-300 hover:text-white text-sm transition-colors">
                    FAFSA Changes
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2 */}
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-4">
                Understand Aid
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/types-of-aid" className="text-base-300 hover:text-white text-sm transition-colors">
                    Types of Aid
                  </Link>
                </li>
                <li>
                  <Link href="/grants" className="text-base-300 hover:text-white text-sm transition-colors">
                    Grants
                  </Link>
                </li>
                <li>
                  <Link href="/loans" className="text-base-300 hover:text-white text-sm transition-colors">
                    Loans
                  </Link>
                </li>
                <li>
                  <Link href="/work-study" className="text-base-300 hover:text-white text-sm transition-colors">
                    Work-Study
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3 */}
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-4">
                Manage Loans
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/repayment" className="text-base-300 hover:text-white text-sm transition-colors">
                    Repayment
                  </Link>
                </li>
                <li>
                  <Link href="/consolidation" className="text-base-300 hover:text-white text-sm transition-colors">
                    Consolidation
                  </Link>
                </li>
                <li>
                  <Link href="/forgiveness" className="text-base-300 hover:text-white text-sm transition-colors">
                    Forgiveness
                  </Link>
                </li>
                <li>
                  <Link href="/loan-simulator" className="text-base-300 hover:text-white text-sm transition-colors">
                    Loan Simulator
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4 */}
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-4">
                Resources
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/help-center" className="text-base-300 hover:text-white text-sm transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-base-300 hover:text-white text-sm transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/announcements" className="text-base-300 hover:text-white text-sm transition-colors">
                    Announcements
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-base-300 hover:text-white text-sm transition-colors">
                    About Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Footer - Logo and Social */}
      <div className="bg-base-900">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded flex items-center justify-center">
                <span className="text-primary-800 font-bold text-lg">FSA</span>
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold">Federal Student Aid</span>
                <span className="text-base-400 text-sm">An Office of the U.S. Department of Education</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a 
                href="https://twitter.com/FAFSA" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-base-700 hover:bg-base-600 rounded-full flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5 text-white" />
              </a>
              <a 
                href="https://www.facebook.com/FederalStudentAid" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-base-700 hover:bg-base-600 rounded-full flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5 text-white" />
              </a>
              <a 
                href="https://www.instagram.com/federalstudentaid" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-base-700 hover:bg-base-600 rounded-full flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a 
                href="https://www.youtube.com/user/FederalStudentAid" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-base-700 hover:bg-base-600 rounded-full flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          {/* Bottom Links */}
          <div className="mt-8 pt-6 border-t border-base-700">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
              <div className="flex flex-wrap justify-center gap-4 text-base-400">
                <Link href="/help-center" className="hover:text-white transition-colors">
                  Help Center
                </Link>
                <span className="text-base-600">|</span>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
                <span className="text-base-600">|</span>
                <Link href="/feedback" className="hover:text-white transition-colors">
                  Submit Feedback
                </Link>
                <span className="text-base-600">|</span>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
                <span className="text-base-600">|</span>
                <Link href="/accessibility" className="hover:text-white transition-colors">
                  Accessibility
                </Link>
                <span className="text-base-600">|</span>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy
                </Link>
              </div>
              <p className="text-base-500 text-center md:text-right">
                © {currentYear} Federal Student Aid
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
