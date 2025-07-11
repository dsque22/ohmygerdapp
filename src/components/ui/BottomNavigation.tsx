'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  Plus, 
  Settings, 
  ShoppingBag,
  BarChart3
} from 'lucide-react'

interface NavItem {
  href: string
  icon: React.ReactNode
  label: string
  primary?: boolean
}

const navItems: NavItem[] = [
  {
    href: '/dashboard',
    icon: <Home className="w-5 h-5" />,
    label: 'Home'
  },
  {
    href: '/shop',
    icon: <ShoppingBag className="w-5 h-5" />,
    label: 'Shop'
  },
  {
    href: '/settings',
    icon: <Settings className="w-5 h-5" />,
    label: 'Settings'
  }
]

const primaryAction: NavItem = {
  href: '/tracking',
  icon: <Plus className="w-6 h-6" />,
  label: 'Track Today',
  primary: true
}

export function BottomNavigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 sm:hidden z-50 safe-area-bottom" style={{ backgroundColor: '#14301f' }}>
      <div className="flex items-center justify-around py-3 px-4">
        {/* Nav items distributed evenly */}
        {navItems.map((item) => {
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-2 px-2 rounded-xl transition-all duration-200 min-w-[60px] ${
                isActive
                  ? 'text-white bg-white/10'
                  : 'text-white/70 hover:text-white active:bg-white/10'
              }`}
            >
              <div>
                {item.icon}
              </div>
              <span className="text-xs mt-1 font-sans font-medium">
                {item.label}
              </span>
            </Link>
          )
        })}

        {/* Track Today button */}
        <Link
          href={primaryAction.href}
          className="flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-200 shadow-lg -translate-y-1"
          style={{ backgroundColor: '#df6552' }}
        >
          <div className="p-1">
            {primaryAction.icon}
          </div>
          <span className="text-xs mt-1 font-sans font-semibold text-white">
            {primaryAction.label}
          </span>
        </Link>
      </div>
    </nav>
  )
}