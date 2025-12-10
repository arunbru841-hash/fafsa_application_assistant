import { ReactNode } from 'react'
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error'
  title?: string
  children: ReactNode
  icon?: boolean
  className?: string
}

const variantStyles = {
  info: 'bg-primary-50 border-primary-200 text-primary-900',
  success: 'bg-primary-50 border-primary-light text-primary-darker',
  warning: 'bg-warning-50 border-warning-200 text-warning-900',
  error: 'bg-error-50 border-error-200 text-error-900',
}

const iconComponents = {
  info: Info,
  success: CheckCircle,
  warning: AlertCircle,
  error: XCircle,
}

const iconColors = {
  info: 'text-primary-600',
  success: 'text-primary',
  warning: 'text-warning-600',
  error: 'text-error-600',
}

export function Alert({ variant = 'info', title, children, icon = true, className }: AlertProps) {
  const Icon = iconComponents[variant]

  return (
    <div className={cn('card border p-4', variantStyles[variant], className)}>
      <div className="flex gap-3">
        {icon && <Icon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', iconColors[variant])} />}
        <div className="flex-1">
          {title && <h4 className="font-semibold mb-1">{title}</h4>}
          <div className="text-sm">{children}</div>
        </div>
      </div>
    </div>
  )
}
