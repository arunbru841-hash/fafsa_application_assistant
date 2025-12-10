import { forwardRef, InputHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { AlertTriangle } from 'lucide-react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  required?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, leftIcon, rightIcon, required, ...props }, ref) => {
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
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full border-2 px-3 py-2 text-base rounded-sm bg-white transition-colors',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error 
                ? 'border-secondary-dark bg-red-50 focus:border-secondary-dark focus:ring-2 focus:ring-secondary-dark/20' 
                : 'border-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
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

Input.displayName = 'Input'

