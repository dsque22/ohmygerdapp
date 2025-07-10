import React from 'react'
import { cn } from '@/lib/utils'

interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  min?: number
  max?: number
  step?: number
  value?: number
  onChange?: (value: number) => void
  showValue?: boolean
  valueLabel?: string
  color?: 'primary' | 'accent' | 'red' | 'green'
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ 
    className, 
    label, 
    min = 0, 
    max = 10, 
    step = 1, 
    value = 0, 
    onChange, 
    showValue = true, 
    valueLabel,
    color = 'primary',
    ...props 
  }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = Number(e.target.value)
      onChange?.(newValue)
    }

    const percentage = ((value - min) / (max - min)) * 100

    const colorClasses = {
      primary: 'accent-primary-700',
      accent: 'accent-accent',
      red: 'accent-red-500',
      green: 'accent-green-500',
    }

    return (
      <div className="w-full">
        {label && (
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-text-primary">
              {label}
            </label>
            {showValue && (
              <span className="text-sm font-semibold text-text-primary">
                {valueLabel ? `${valueLabel}: ${value}` : value}
              </span>
            )}
          </div>
        )}
        <div className="relative">
          <input
            ref={ref}
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={handleChange}
            className={cn(
              'w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer',
              'slider-thumb:appearance-none slider-thumb:h-5 slider-thumb:w-5',
              'slider-thumb:rounded-full slider-thumb:bg-white slider-thumb:shadow-medium',
              'slider-thumb:border-2 slider-thumb:border-primary-700',
              'slider-thumb:cursor-pointer slider-thumb:transition-all slider-thumb:duration-200',
              'hover:slider-thumb:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-500',
              colorClasses[color],
              className
            )}
            {...props}
          />
          <div
            className={cn(
              'absolute top-0 left-0 h-2 rounded-lg transition-all duration-200',
              color === 'primary' && 'bg-primary-700',
              color === 'accent' && 'bg-accent',
              color === 'red' && 'bg-red-500',
              color === 'green' && 'bg-green-500'
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-text-muted mt-1">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      </div>
    )
  }
)

Slider.displayName = 'Slider'

export { Slider }