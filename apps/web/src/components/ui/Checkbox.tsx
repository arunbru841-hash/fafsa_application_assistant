import { InputHTMLAttributes, forwardRef, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode
  description?: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, ...props }, ref) => {
    return (
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          ref={ref}
          className={cn(
            'w-4 h-4 mt-0.5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 focus:ring-offset-0 cursor-pointer',
            className
          )}
          {...props}
        />
        {(label || description) && (
          <div className="flex-1">
            {label && (
              <label className="text-sm font-medium text-primary-darker cursor-pointer">
                {label}
              </label>
            )}
            {description && (
              <p className="text-sm text-gray-600 mt-0.5">{description}</p>
            )}
          </div>
        )}
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'
