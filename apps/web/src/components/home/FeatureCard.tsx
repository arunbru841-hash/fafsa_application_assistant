import {
  ShieldCheck,
  Lightbulb,
  Calculator,
  FileText,
  School,
  Headphones,
} from 'lucide-react'

const iconMap = {
  'shield-check': ShieldCheck,
  'lightbulb': Lightbulb,
  'calculator': Calculator,
  'file-text': FileText,
  'school': School,
  'headphones': Headphones,
}

interface FeatureCardProps {
  icon: keyof typeof iconMap
  title: string
  description: string
  color: 'primary' | 'secondary' | 'success' | 'warning'
}

const colorClasses = {
  primary: 'bg-primary-100 text-primary-600',
  secondary: 'bg-secondary-100 text-secondary-600',
  success: 'bg-primary-lighter text-primary',
  warning: 'bg-warning-100 text-warning-600',
}

export function FeatureCard({ icon, title, description, color }: FeatureCardProps) {
  const Icon = iconMap[icon]

  return (
    <div className="card-hover p-8 group">
      <div className={`w-14 h-14 rounded-xl ${colorClasses[color]} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-xl font-semibold text-primary-darker mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  )
}
