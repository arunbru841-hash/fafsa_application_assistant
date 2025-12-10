import { CheckCircle2, ArrowRight } from 'lucide-react'

const steps = [
  {
    number: '01',
    title: 'Create Your Account',
    description: 'Sign up in seconds with your email. We\'ll guide you through the FSA ID creation process.',
  },
  {
    number: '02',
    title: 'Answer Simple Questions',
    description: 'Our smart questionnaire determines your eligibility and what documents you\'ll need.',
  },
  {
    number: '03',
    title: 'Upload Documents',
    description: 'Securely upload tax returns and financial documents. We\'ll auto-fill your application.',
  },
  {
    number: '04',
    title: 'Review & Submit',
    description: 'Our AI validates every field in real-time. Submit with confidence knowing it\'s 100% accurate.',
  },
]

export function HowItWorks() {
  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-sans font-bold text-primary-darker mb-4">
            Complete Your FAFSA in 4 Simple Steps
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From start to finish in under an hour. We make it simple.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="absolute left-8 top-20 w-0.5 h-24 bg-gradient-to-b from-primary-400 to-primary-200 hidden md:block" />
              )}

              {/* Step Card */}
              <div className="flex flex-col md:flex-row gap-6 mb-8 group">
                {/* Number Badge */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform">
                    {step.number}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 card p-6 group-hover:shadow-medium transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-semibold text-primary-darker">{step.title}</h3>
                    <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                  </div>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="/get-started"
            className="inline-flex items-center text-primary-600 font-semibold hover:text-primary-700 group"
          >
            Start Your FAFSA Now
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  )
}
