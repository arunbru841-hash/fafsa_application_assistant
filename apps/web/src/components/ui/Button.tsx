import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef, ButtonHTMLAttributes, ReactNode, ElementType, ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded font-bold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-white hover:bg-primary-dark focus:ring-primary shadow-sm',
        secondary:
          'bg-transparent text-primary border-2 border-primary hover:bg-primary-lighter focus:ring-primary',
        ghost:
          'text-primary hover:bg-primary-lighter focus:ring-primary',
        danger:
          'bg-error text-white hover:bg-error-dark focus:ring-error',
        success:
          'bg-primary text-white hover:bg-primary-dark focus:ring-primary',
        accent:
          'bg-accent-cool text-primary-darker hover:bg-accent-cool-light focus:ring-accent-cool',
        outline:
          'bg-transparent text-white border-2 border-white hover:bg-white hover:text-primary-darker focus:ring-white',
      },
      size: {
        sm: 'h-9 px-4 text-sm',
        md: 'h-11 px-5 text-base',
        lg: 'h-12 px-6 text-lg',
        xl: 'h-14 px-8 text-lg',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  children?: ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, asChild = false, children, ...props }, ref) => {
    // When asChild is true, we expect a single child element (like Link)
    // and we apply styles to it directly
    if (asChild) {
      return (
        <span className={cn(buttonVariants({ variant, size, fullWidth, className }))}>
          {children}
        </span>
      )
    }
    
    return (
      <button
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { buttonVariants }
