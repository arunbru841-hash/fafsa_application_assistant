'use client'

import { useState } from 'react'
import Image from 'next/image'
import { 
  UserPlus, 
  FileText, 
  School, 
  Send, 
  CheckCircle2, 
  ArrowRight,
  Clock,
  Shield,
  Sparkles
} from 'lucide-react'
import { motion } from 'framer-motion'
import { images } from '@/lib/images'

// FAFSA uses blue color scheme - no green/emerald
const fafsaSteps = [
  {
    number: 1,
    title: 'Create Your FSA ID',
    description: 'Set up your Federal Student Aid account with a unique username and password. Both students and parents need their own FSA ID.',
    icon: UserPlus,
    duration: '10-15 min',
    tips: ['Use a permanent email address', 'Save your credentials securely', 'Parents need separate FSA IDs'],
    color: 'from-primary to-primary-dark',
  },
  {
    number: 2,
    title: 'Gather Your Documents',
    description: 'Collect tax returns, W-2s, bank statements, and other financial records before starting your application.',
    icon: FileText,
    duration: '15-30 min',
    tips: ['Prior year tax returns', 'Social Security numbers', 'Driver\'s license (if applicable)'],
    color: 'from-accent-cool to-cyan-600',
  },
  {
    number: 3,
    title: 'Complete the FAFSA Form',
    description: 'Fill out personal, financial, and school information. Use the IRS Data Retrieval Tool for accurate tax data.',
    icon: School,
    duration: '30-45 min',
    tips: ['Add up to 10 schools', 'Use IRS Data Retrieval', 'Double-check all entries'],
    color: 'from-primary-dark to-primary-darker',
  },
  {
    number: 4,
    title: 'Sign and Submit',
    description: 'Review your application, sign electronically with your FSA ID, and submit. You\'ll receive a confirmation email.',
    icon: Send,
    duration: '5-10 min',
    tips: ['Both student and parent must sign', 'Keep confirmation number', 'Check for processing errors'],
    color: 'from-warning to-amber-600',
  },
  {
    number: 5,
    title: 'Review Your SAR',
    description: 'Your Student Aid Report (SAR) arrives within days. Review it for accuracy and check your Expected Family Contribution (EFC).',
    icon: CheckCircle2,
    duration: '3-5 days',
    tips: ['Correct any errors promptly', 'Share with your schools', 'Await financial aid offers'],
    color: 'from-primary to-primary-dark',
  },
]

export function FAFSAStepsInfographic() {
  const [activeStep, setActiveStep] = useState<number | null>(null)

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container-custom">
        {/* Section Header - Clean with generous spacing */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full text-sm font-medium text-primary-700 mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Simple 5-Step Process</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-sans font-bold text-primary-darker mb-6">
            How to Complete Your FAFSA
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Follow our guided process to maximize your financial aid opportunities. 
            Most students complete the FAFSA in under an hour.
          </p>
        </div>

        {/* Timeline Infographic - Modern card-based design */}
        <div className="relative">
          {/* Connection Line - Hidden on mobile */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent-cool to-primary-dark -translate-y-1/2 rounded-full" />
          
          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-4">
            {fafsaSteps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="relative"
                onMouseEnter={() => setActiveStep(step.number)}
                onMouseLeave={() => setActiveStep(null)}
              >
                {/* Step Card */}
                <div 
                  className={`
                    relative bg-white rounded-2xl p-6 
                    border-2 transition-all duration-300 cursor-pointer
                    ${activeStep === step.number 
                      ? 'border-primary-400 shadow-large scale-105 z-10' 
                      : 'border-gray-100 shadow-soft hover:shadow-medium hover:border-gray-200'
                    }
                  `}
                >
                  {/* Step Number Badge */}
                  <div className={`
                    absolute -top-4 left-1/2 -translate-x-1/2
                    w-10 h-10 rounded-full bg-gradient-to-br ${step.color}
                    flex items-center justify-center
                    text-white font-bold text-lg
                    shadow-medium
                  `}>
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className={`
                    w-14 h-14 rounded-xl bg-gradient-to-br ${step.color} 
                    flex items-center justify-center mb-5 mt-4 mx-auto
                    shadow-soft
                  `}>
                    <step.icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold text-primary-darker text-center mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600 text-center leading-relaxed mb-4">
                    {step.description}
                  </p>

                  {/* Duration Badge */}
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mb-4">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{step.duration}</span>
                  </div>

                  {/* Tips - Shown on hover/active */}
                  <div className={`
                    overflow-hidden transition-all duration-300
                    ${activeStep === step.number ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}
                  `}>
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                        Pro Tips
                      </p>
                      <ul className="space-y-1.5">
                        {step.tips.map((tip, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                            <CheckCircle2 className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Arrow connector for desktop */}
                {index < fafsaSteps.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-4 -translate-y-1/2 z-20">
                    <ArrowRight className="w-6 h-6 text-gray-300" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Stats Bar - Clean design with shadows */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-8 shadow-soft border border-gray-100 text-center">
            <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-primary-600" />
            </div>
            <p className="text-3xl font-bold text-primary-darker mb-2">~45 min</p>
            <p className="text-gray-600">Average completion time</p>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-soft border border-gray-100 text-center">
            <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <p className="text-3xl font-bold text-primary-darker mb-2">100% Free</p>
            <p className="text-gray-600">No fees to apply</p>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-soft border border-gray-100 text-center">
            <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <p className="text-3xl font-bold text-primary-darker mb-2">$112B+</p>
            <p className="text-gray-600">Aid distributed annually</p>
          </div>
        </div>

        {/* Featured Image Section */}
        <div className="mt-20 relative rounded-3xl overflow-hidden shadow-large">
          <div className="aspect-[21/9] relative">
            <Image
              src={images.hero.fafsaSteps}
              alt="FAFSA Application Steps"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-950/80 via-primary-900/60 to-transparent" />
            <div className="absolute inset-0 flex items-center">
              <div className="container-custom">
                <div className="max-w-xl">
                  <h3 className="text-3xl md:text-4xl font-sans font-bold text-white mb-4">
                    Ready to Get Started?
                  </h3>
                  <p className="text-lg text-primary-100 mb-6">
                    Our step-by-step wizard makes completing your FAFSA easier than ever. 
                    Get personalized guidance at every step.
                  </p>
                  <a 
                    href="/application/getting-started"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-900 font-semibold rounded-lg shadow-medium hover:shadow-large transition-all hover:scale-105"
                  >
                    Start Your FAFSA Now
                    <ArrowRight className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

