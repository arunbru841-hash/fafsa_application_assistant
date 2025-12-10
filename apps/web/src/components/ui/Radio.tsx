import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface RadioProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  description?: string
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, description, ...props }, ref) => {
    return (
      <div className="flex items-start gap-3">
        <input
          type="radio"
          ref={ref}
          className={cn(
            'w-4 h-4 mt-0.5 border-gray-300 text-primary-600 focus:ring-primary-500 focus:ring-offset-0 cursor-pointer',
            className
          )}
          {...props}
        />
        <div className="flex-1">
          <label className="text-sm font-medium text-primary-darker cursor-pointer">
            {label}
          </label>
          {description && (
            <p className="text-sm text-gray-600 mt-0.5">{description}</p>
          )}
        </div>
      </div>
    )
  }
)

Radio.displayName = 'Radio'
