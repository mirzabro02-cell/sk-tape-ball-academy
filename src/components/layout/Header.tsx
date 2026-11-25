import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ArrowRight, ChevronDown, Menu } from 'lucide-react';
import { PRIMARY_NAV_ITEMS, SECONDARY_NAV_ITEMS } from '@/src/data/navigation';
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
  const location = useLocation();
  const [academyMenuOpen, setAcademyMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isSecondaryActive = SECONDARY_NAV_ITEMS.some(
    (item) => location.pathname === item.path,
  );

  useEffect(() => {
    setAcademyMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!academyMenuOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setAcademyMenuOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setAcademyMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [academyMenuOpen]);

  return (
    <header className="sticky top-0 z-40 h-[78px] border-b border-[#E2E8F0] bg-white/95 backdrop-blur-xl shadow-[var(--shadow-header)] transition-colors duration-200 dark:border-white/10 dark:bg-[#07152C]/94">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-[#D5A52B]/35 to-transparent"
      />

      <PageContainer className="flex h-full items-center justify-between gap-3 xl:gap-6">
        <OfficialLogo tone="auto" />

        <nav
          aria-label="Primary Navigation"
          className="hidden xl:flex items-center gap-5 2xl:gap-6 text-sm font-medium"
        >
          {PRIMARY_NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                cn(
                  'relative whitespace-nowrap shrink-0 py-2 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D5A52B] rounded-[6px]',
                  isActive
                    ? 'font-bold text-[#07152C] dark:text-[#D5A52B] after:absolute after:inset-x-0 after:bottom-0 after:h-[2.5px] after:rounded-full after:bg-[#D5A52B]'
                    : 'text-[#475569] hover:text-[#07152C] dark:text-[#C5D3E6] dark:hover:text-white after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:origin-center after:scale-x-0 after:rounded-full after:bg-[#D5A52B]/70 after:transition-transform after:duration-150 hover:after:scale-x-100',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}

          <div ref={dropdownRef} className="relative">
            <button
              type="button"
              onClick={() => setAcademyMenuOpen((prev) => !prev)}
              aria-expanded={academyMenuOpen}
              aria-haspopup="menu"
              className={cn(
                'relative inline-flex items-center gap-1 whitespace-nowrap shrink-0 py-2 transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D5A52B] rounded-[6px]',
                isSecondaryActive || academyMenuOpen
                  ? 'font-bold text-[#07152C] dark:text-[#D5A52B] after:absolute after:inset-x-0 after:bottom-0 after:h-[2.5px] after:rounded-full after:bg-[#D5A52B]'
                  : 'text-[#475569] hover:text-[#07152C] dark:text-[#C5D3E6] dark:hover:text-white',
              )}
            >
              <span>Academy</span>
              <ChevronDown
                className={cn(
                  'h-3.5 w-3.5 transition-transform duration-150',
                  academyMenuOpen && 'rotate-180 text-[#D5A52B]',
                )}
                aria-hidden="true"
              />
            </button>

            {academyMenuOpen && (
              <div
                role="menu"
                aria-label="Academy Pages"
                className="absolute left-0 top-[calc(100%+10px)] z-50 w-56 rounded-[14px] border border-[#CBD5E1] bg-white p-1.5 shadow-xl dark:border-white/14 dark:bg-[#0B1C38] dark:shadow-[0_20px_44px_-12px_rgba(2,8,19,0.85)]"
              >
                {SECONDARY_NAV_ITEMS.map((subItem) => (
                  <NavLink
                    key={subItem.path}
                    to={subItem.path}
                    role="menuitem"
                    onClick={() => setAcademyMenuOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center justify-between rounded-[9px] px-3 py-2.5 text-sm font-medium transition-colors duration-150',
                        isActive
                          ? 'bg-[#D5A52B] text-[#050D1B] font-bold'
                          : 'text-[#07152C] hover:bg-[#F5F7FA] dark:text-[#D7E2F1] dark:hover:bg-white/8 dark:hover:text-white',
                      )
                    }
                  >
                    <span>{subItem.label}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="hidden xl:flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-[#F5F7FA]/90 p-1.5 shadow-xs dark:border-white/12 dark:bg-[#0F213B]/90 shrink-0">
          <ThemeToggle variant="header" />
          <Button
            to="/register"
            variant="primary"
            size="sm"
            className="rounded-full px-4 font-bold"
            rightIcon={<ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />}
          >
            Register Now
          </Button>
        </div>

        <div className="flex items-center gap-2 xl:hidden shrink-0">
          <ThemeToggle variant="header" />
          <button
            type="button"
            onClick={onOpenMobileMenu}
            aria-label="Open mobile navigation menu"
            aria-expanded={isMobileMenuOpen}
            className="inline-flex h-11 w-11 items-center justify-center rounded-[10px] border border-[#CBD5E1] bg-white text-[#07152C] hover:border-[#D5A52B] hover:bg-[#F5F7FA] dark:border-white/15 dark:bg-[#0F213B] dark:text-white dark:hover:border-[#D5A52B]/65 dark:hover:bg-[#162B4D] transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D5A52B]"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </PageContainer>
    </header>
  );
}
