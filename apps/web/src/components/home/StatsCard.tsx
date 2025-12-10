import { LucideIcon } from 'lucide-react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatsCardProps {
  icon: LucideIcon
  value: string
  label: string
  trend?: string
}

export function StatsCard({ icon: Icon, value, label, trend }: StatsCardProps) {
  const isPositive = trend?.startsWith('+')
  const isNegative = trend?.startsWith('-')

  return (
    <div className="card p-6 hover:shadow-medium transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
          <Icon className="w-6 h-6 text-primary-600" />
        </div>
        {trend && (
          <span className={`text-sm font-medium flex items-center gap-1 ${
            isPositive ? 'text-primary' : isNegative ? 'text-error-600' : 'text-gray-600'
          }`}>
            {isPositive && <TrendingUp className="w-4 h-4" />}
            {isNegative && <TrendingDown className="w-4 h-4" />}
            {trend}
          </span>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-3xl font-bold text-primary-darker">{value}</p>
        <p className="text-sm text-gray-600">{label}</p>
      </div>
    </div>
  )
}
