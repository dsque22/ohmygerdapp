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

    const getThumbBorderColor = (color: string) => {
      if (color === 'accent') return '#df6552'
      if (color === 'primary') return '#14301f'
      if (color === 'red') return '#ef4444'
      if (color === 'green') return '#10b981'
      return '#14301f'
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
              'focus:outline-none focus:ring-2',
              color === 'accent' ? 'focus:ring-[#df6552]' : 'focus:ring-primary-500',
              className
            )}
            style={{
              accentColor: getThumbBorderColor(color)
            }}
            {...props}
          />
        </div>
        <div className="flex justify-between text-xs text-text-muted mt-1">
          <span>{min} (low)</span>
          <span>{max} (high)</span>
        </div>
      </div>
    )
  }
)

Slider.displayName = 'Slider'

export { Slider }