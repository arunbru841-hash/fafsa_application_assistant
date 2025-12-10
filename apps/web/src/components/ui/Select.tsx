import { forwardRef, SelectHTMLAttributes } from 'react'
import { ChevronDown, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  helperText?: string
  options: SelectOption[]
  placeholder?: string
  required?: boolean
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, options, placeholder, required, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className={cn(
            'block text-gray-900 font-bold mb-1',
            required && "after:content-['_*'] after:text-secondary-dark"
          )}>
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              'w-full border-2 px-3 py-2 text-base rounded-sm bg-white appearance-none pr-10 transition-colors',
              error 
                ? 'border-secondary-dark bg-red-50 focus:border-secondary-dark focus:ring-2 focus:ring-secondary-dark/20' 
                : 'border-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-secondary-dark font-semibold flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-gray-600">{helperText}</p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'

