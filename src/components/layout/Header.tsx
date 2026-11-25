import { NavLink } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { PRIMARY_NAV_ITEMS } from '@/src/data/navigation';
import { Button } from '@/src/components/ui/Button';
import { OfficialLogo } from '@/src/components/ui/OfficialLogo';
import { ThemeToggle } from '@/src/components/ui/ThemeToggle';
import { cn } from '@/src/utils/cn';
import { PageContainer } from './PageContainer';

export interface HeaderProps {
  onOpenMobileMenu: () => void;
  isMobileMenuOpen: boolean;
}

export function Header({ onOpenMobileMenu, isMobileMenuOpen }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 h-[76px] border-b border-[#E2E8F0] bg-white/95 backdrop-blur-md transition-colors duration-200 dark:border-white/10 dark:bg-[#07152C]/92">
      <PageContainer className="flex h-full items-center justify-between gap-4 xl:gap-6">
        <OfficialLogo tone="auto" />

        <nav
          aria-label="Primary Navigation"
          className="hidden xl:flex items-center gap-5 text-sm font-medium text-[#475569] dark:text-[#B4C4DC]"
        >
          {PRIMARY_NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                cn(
                  'relative whitespace-nowrap shrink-0 py-1.5 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D5A52B] rounded',
                  isActive
                    ? 'text-[#07152C] dark:text-white font-semibold after:absolute after:inset-x-0 after:-bottom-1 after:h-[2px] after:rounded-full after:bg-[#D5A52B]'
                    : 'text-[#475569] hover:text-[#07152C] dark:text-[#B4C4DC] dark:hover:text-white',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden xl:flex items-center gap-3 shrink-0">
          <ThemeToggle variant="header" />
          <Button to="/register" variant="primary" size="sm" className="px-4 font-bold">
            Register Now
          </Button>
        </div>

        <div className="flex items-center gap-2 xl:hidden">
          <ThemeToggle variant="header" />
          <button
            type="button"
            onClick={onOpenMobileMenu}
            aria-label="Open mobile navigation menu"
            aria-expanded={isMobileMenuOpen}
            className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#E2E8F0] bg-white text-[#07152C] hover:bg-[#F5F7FA] dark:border-white/15 dark:bg-[#0F213B] dark:text-white dark:hover:bg-[#162B4D] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D5A52B]"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </PageContainer>
    </header>
  );
}
