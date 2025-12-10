import { ReactNode } from 'react'
import { HelpCircle } from 'lucide-react'

export interface TooltipProps {
  content: string | ReactNode
  children: ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
}

export function Tooltip({ content, children, position = 'top' }: TooltipProps) {
  return (
    <div className="group relative inline-block">
      {children}
      <div className={`
        absolute z-[9999] px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-lg
        opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200
        ${position === 'top' ? 'bottom-full left-1/2 -translate-x-1/2 mb-2' : ''}
        ${position === 'bottom' ? 'top-full left-1/2 -translate-x-1/2 mt-2' : ''}
        ${position === 'left' ? 'right-full top-1/2 -translate-y-1/2 mr-2' : ''}
        ${position === 'right' ? 'left-full top-1/2 -translate-y-1/2 ml-2' : ''}
        max-w-xs whitespace-normal pointer-events-none
      `}>
        {content}
        <div className={`
          absolute w-2 h-2 bg-gray-900 rotate-45
          ${position === 'top' ? 'bottom-[-4px] left-1/2 -translate-x-1/2' : ''}
          ${position === 'bottom' ? 'top-[-4px] left-1/2 -translate-x-1/2' : ''}
          ${position === 'left' ? 'right-[-4px] top-1/2 -translate-y-1/2' : ''}
          ${position === 'right' ? 'left-[-4px] top-1/2 -translate-y-1/2' : ''}
        `} />
      </div>
    </div>
  )
}

export function HelpTooltip({ content }: { content: string | ReactNode }) {
  return (
    <Tooltip content={content}>
      <HelpCircle className="w-4 h-4 text-gray-400 hover:text-primary-600 cursor-help transition-colors" />
    </Tooltip>
  )
}

