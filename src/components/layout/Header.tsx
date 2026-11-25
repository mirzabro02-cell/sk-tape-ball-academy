import { NavLink } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { PRIMARY_NAV_ITEMS } from '@/src/data/navigation';
import { Button } from '@/src/components/ui/Button';
import { OfficialLogo } from '@/src/components/ui/OfficialLogo';
import { cn } from '@/src/utils/cn';
import { PageContainer } from './PageContainer';

export interface HeaderProps {
  onOpenMobileMenu: () => void;
  isMobileMenuOpen: boolean;
}

export function Header({ onOpenMobileMenu, isMobileMenuOpen }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 h-[76px] border-b border-[#E2E8F0] bg-white/95 backdrop-blur-sm">
      <PageContainer className="flex h-full items-center justify-between gap-4 xl:gap-6">
        <OfficialLogo tone="light" />

        <nav
          aria-label="Primary Navigation"
          className="hidden xl:flex items-center gap-4 text-sm font-medium text-[#64748B]"
        >
          {PRIMARY_NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                cn(
                  'whitespace-nowrap shrink-0 py-1.5 transition-colors duration-150 hover:text-[#071A36] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9A52E] rounded',
                  isActive
                    ? 'text-[#071A36] font-semibold underline decoration-[#D9A52E] decoration-2 underline-offset-8'
                    : 'text-[#64748B]',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden xl:flex items-center gap-2.5 shrink-0">
          <Button to="/book-trial" variant="outline" size="sm" className="px-3.5">
            Book Free Trial
          </Button>
          <Button to="/register" variant="primary" size="sm" className="px-3.5">
            Register Now
          </Button>
        </div>

        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Open mobile navigation menu"
          aria-expanded={isMobileMenuOpen}
          className="inline-flex h-11 w-11 items-center justify-center rounded-[10px] border border-[#E2E8F0] bg-white text-[#071A36] hover:bg-[#F5F7FA] xl:hidden cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9A52E]"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>
      </PageContainer>
    </header>
  );
}
