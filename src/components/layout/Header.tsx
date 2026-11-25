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

const DESKTOP_TOP_PATHS = new Set(['/', '/about', '/programs', '/coaches', '/matches']);

export function Header({ onOpenMobileMenu, isMobileMenuOpen }: HeaderProps) {
  const location = useLocation();
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const moreTriggerRef = useRef<HTMLButtonElement>(null);

  const desktopPrimaryLinks = PRIMARY_NAV_ITEMS.filter((item) =>
    DESKTOP_TOP_PATHS.has(item.path),
  );
  const desktopMoreLinks = [
    ...PRIMARY_NAV_ITEMS.filter((item) => !DESKTOP_TOP_PATHS.has(item.path)),
    ...SECONDARY_NAV_ITEMS,
  ];

  const isMoreActive = desktopMoreLinks.some((item) => location.pathname === item.path);

  useEffect(() => {
    setMoreMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!moreMenuOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMoreMenuOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setMoreMenuOpen(false);
        moreTriggerRef.current?.focus();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [moreMenuOpen]);

  return (
    <header className="sticky top-0 z-40 h-[76px] border-b border-[#E2E8F0] bg-white/95 backdrop-blur-xl shadow-[var(--shadow-header)] transition-colors duration-200 dark:border-white/10 dark:bg-[#07152C]/92">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-[#D5A83C]/40 to-transparent"
      />

      <PageContainer className="flex h-full items-center justify-between gap-4 lg:gap-8">
        <OfficialLogo tone="auto" layout="stacked" />

        <nav
          aria-label="Primary Navigation"
          className="hidden lg:flex items-center gap-6 xl:gap-7 text-sm font-medium"
        >
          {desktopPrimaryLinks.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                cn(
                  'relative whitespace-nowrap shrink-0 py-2 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D5A83C] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#07152C] rounded-[6px]',
                  isActive
                    ? 'font-bold text-[#07152C] dark:text-[#D5A83C] after:absolute after:inset-x-0 after:bottom-0 after:h-[2.5px] after:rounded-full after:bg-[#D5A83C]'
                    : 'text-[#475569] hover:text-[#07152C] dark:text-[#C5D3E6] dark:hover:text-white after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:origin-center after:scale-x-0 after:rounded-full after:bg-[#D5A83C]/75 after:transition-transform after:duration-150 hover:after:scale-x-100',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}

          <div ref={dropdownRef} className="relative">
            <button
              ref={moreTriggerRef}
              type="button"
              onClick={() => setMoreMenuOpen((prev) => !prev)}
              aria-expanded={moreMenuOpen}
              aria-haspopup="menu"
              className={cn(
                'relative inline-flex items-center gap-1 whitespace-nowrap shrink-0 py-2 transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D5A83C] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#07152C] rounded-[6px]',
                isMoreActive || moreMenuOpen
                  ? 'font-bold text-[#07152C] dark:text-[#D5A83C] after:absolute after:inset-x-0 after:bottom-0 after:h-[2.5px] after:rounded-full after:bg-[#D5A83C]'
                  : 'text-[#475569] hover:text-[#07152C] dark:text-[#C5D3E6] dark:hover:text-white',
              )}
            >
              <span>More</span>
              <ChevronDown
                className={cn(
                  'h-3.5 w-3.5 transition-transform duration-150',
                  moreMenuOpen && 'rotate-180 text-[#D5A83C]',
                )}
                aria-hidden="true"
              />
            </button>

            {moreMenuOpen && (
              <div
                role="menu"
                aria-label="More Academy Pages"
                className="absolute right-0 top-[calc(100%+12px)] z-50 w-[332px] rounded-[16px] border border-[#CBD5E1] bg-white p-2 shadow-xl dark:border-white/14 dark:bg-[#0B1C38] dark:shadow-[0_22px_48px_-12px_rgba(2,8,19,0.88)]"
              >
                <div className="grid grid-cols-2 gap-1">
                  {desktopMoreLinks.map((subItem) => (
                    <NavLink
                      key={subItem.path}
                      to={subItem.path}
                      role="menuitem"
                      onClick={() => setMoreMenuOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center rounded-[10px] px-3 py-2.5 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D5A83C]',
                          isActive
                            ? 'bg-[#D5A83C] text-[#050D1B] font-bold'
                            : 'text-[#07152C] hover:bg-[#F4F6FA] dark:text-[#D7E2F1] dark:hover:bg-white/8 dark:hover:text-white',
                        )
                      }
                    >
                      <span className="truncate">{subItem.label}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>

        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <ThemeToggle variant="header" />
          <Button
            to="/register"
            variant="primary"
            size="sm"
            shape="pill"
            className="px-5 font-bold"
            rightIcon={<ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />}
          >
            Register Now
          </Button>
        </div>

        <div className="flex items-center gap-2 lg:hidden shrink-0">
          <ThemeToggle variant="header" />
          <button
            type="button"
            onClick={onOpenMobileMenu}
            aria-label="Open mobile navigation menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation-drawer"
            className="inline-flex h-11 w-11 items-center justify-center rounded-[10px] border border-[#CBD5E1] bg-white text-[#07152C] hover:border-[#D5A83C] hover:bg-[#F4F6FA] dark:border-white/15 dark:bg-[#0F213B] dark:text-white dark:hover:border-[#D5A83C]/65 dark:hover:bg-[#162B4D] transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D5A83C]"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </PageContainer>
    </header>
  );
}
