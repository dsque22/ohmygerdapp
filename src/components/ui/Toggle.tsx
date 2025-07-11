import React from 'react'
import { cn } from '@/lib/utils'

interface ToggleProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange' | 'size'> {
  label?: string
  description?: string
  checked?: boolean
  onChange?: (checked: boolean) => void
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'accent'
}

const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>(
  ({ className, label, description, checked = false, onChange, size = 'md', color = 'primary', ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.checked)
    }

    const sizeClasses = {
      sm: {
        toggle: 'w-10 h-5',
        thumb: 'w-4 h-4',
        translate: 'translate-x-5',
      },
      md: {
        toggle: 'w-12 h-6',
        thumb: 'w-5 h-5',
        translate: 'translate-x-6',
      },
      lg: {
        toggle: 'w-14 h-7',
        thumb: 'w-6 h-6',
        translate: 'translate-x-7',
      },
    }

    const currentSize = sizeClasses[size]
    
    const getBackgroundColor = () => {
      if (!checked) return 'bg-gray-200'
      return color === 'accent' ? 'bg-[#df6552]' : 'bg-primary-700'
    }
    
    const getFocusRingColor = () => {
      return color === 'accent' ? 'focus:ring-[#df6552]' : 'focus:ring-primary-500'
    }

    return (
      <div className="flex items-start space-x-3">
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            checked={checked}
            onChange={handleChange}
            className="sr-only"
            {...props}
          />
          <div
            className={cn(
              'relative inline-flex cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out',
              'focus:outline-none focus:ring-2 focus:ring-offset-2',
              getBackgroundColor(),
              getFocusRingColor(),
              currentSize.toggle,
              className
            )}
            onClick={() => onChange?.(!checked)}
          >
            <div
              className={cn(
                'pointer-events-none relative inline-block rounded-full bg-white shadow-soft transform transition duration-200 ease-in-out',
                checked ? currentSize.translate : 'translate-x-0',
                currentSize.thumb
              )}
            >
              <span
                className={cn(
                  'absolute inset-0 flex items-center justify-center transition-opacity duration-200',
                  checked ? 'opacity-0' : 'opacity-100'
                )}
              >
                <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 12 12">
                  <path
                    d="M4 8L8 4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span
                className={cn(
                  'absolute inset-0 flex items-center justify-center transition-opacity duration-200',
                  checked ? 'opacity-100' : 'opacity-0'
                )}
              >
                <svg className={cn("w-3 h-3", color === 'accent' ? 'text-[#df6552]' : 'text-primary-700')} fill="currentColor" viewBox="0 0 12 12">
                  <path d="M10 4L5 9L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              </span>
            </div>
          </div>
        </div>
        {(label || description) && (
          <div className="flex-1 min-w-0">
            {label && (
              <label
                className="block text-sm font-medium text-text-primary cursor-pointer"
                onClick={() => onChange?.(!checked)}
              >
                {label}
              </label>
            )}
            {description && (
              <p className="text-sm text-text-secondary mt-1">{description}</p>
            )}
          </div>
        )}
      </div>
    )
  }
)

Toggle.displayName = 'Toggle'

export { Toggle }