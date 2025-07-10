import React from 'react'
import { cn } from '@/lib/utils'

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  description?: string
  checked?: boolean
  onChange?: (checked: boolean) => void
  size?: 'sm' | 'md' | 'lg'
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, checked = false, onChange, size = 'md', ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.checked)
    }

    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    }

    const inputId = React.useId()

    return (
      <div className="flex items-start space-x-3">
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            checked={checked}
            onChange={handleChange}
            className={cn(
              'appearance-none border-2 border-gray-300 rounded-md cursor-pointer',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
              'checked:bg-primary-700 checked:border-primary-700',
              'hover:border-gray-400 transition-colors duration-200',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              sizeClasses[size],
              className
            )}
            {...props}
          />
          {checked && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <svg
                className={cn(
                  'text-white',
                  size === 'sm' && 'w-3 h-3',
                  size === 'md' && 'w-4 h-4',
                  size === 'lg' && 'w-5 h-5'
                )}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </div>
        {(label || description) && (
          <div className="flex-1 min-w-0">
            {label && (
              <label
                htmlFor={inputId}
                className="block text-sm font-medium text-text-primary cursor-pointer"
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

Checkbox.displayName = 'Checkbox'

export { Checkbox }