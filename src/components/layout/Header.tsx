import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, Menu } from 'lucide-react';
import { PRIMARY_NAV_ITEMS, SECONDARY_NAV_ITEMS } from '@/src/data/navigation';
import { Button } from '@/src/components/ui/Button';
import { OfficialLogo } from '@/src/components/ui/OfficialLogo';
import { cn } from '@/src/utils/cn';
import { PageContainer } from './PageContainer';

export interface HeaderProps {
  onOpenMobileMenu: () => void;
  isMobileMenuOpen: boolean;
}

export function Header({ onOpenMobileMenu, isMobileMenuOpen }: HeaderProps) {
  const [academyMenuOpen, setAcademyMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    setAcademyMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
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
  }, []);

  const isSecondaryActive = SECONDARY_NAV_ITEMS.some((item) => item.path === location.pathname);

  return (
    <header className="sticky top-0 z-40 h-[76px] border-b border-[#E2E8F0] bg-white/95 backdrop-blur-sm">
      <PageContainer className="flex h-full items-center justify-between gap-6">
        <OfficialLogo tone="light" />

        <nav
          aria-label="Primary Navigation"
          className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#64748B]"
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

          <div ref={dropdownRef} className="relative">
            <button
              type="button"
              onClick={() => setAcademyMenuOpen((prev) => !prev)}
              aria-expanded={academyMenuOpen}
              aria-haspopup="menu"
              className={cn(
                'inline-flex items-center gap-1 whitespace-nowrap shrink-0 py-1.5 transition-colors duration-150 hover:text-[#071A36] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9A52E] rounded',
                isSecondaryActive ? 'text-[#071A36] font-semibold' : 'text-[#64748B]',
              )}
            >
              <span>Academy</span>
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform duration-150',
                  academyMenuOpen && 'rotate-180',
                )}
                aria-hidden="true"
              />
            </button>

            {academyMenuOpen && (
              <div
                role="menu"
                className="absolute left-0 top-full mt-2 w-64 rounded-[14px] border border-[#E2E8F0] bg-white p-2 shadow-lg"
              >
                <div className="grid grid-cols-1 gap-0.5">
                  {SECONDARY_NAV_ITEMS.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      role="menuitem"
                      className={({ isActive }) =>
                        cn(
                          'rounded-[8px] px-3 py-2 text-sm transition-colors duration-150',
                          isActive
                            ? 'bg-[#071A36] text-white font-semibold'
                            : 'text-[#071A36] hover:bg-[#F5F7FA]',
                        )
                      }
                    >
                      {item.label}
                    </NavLink>
                  ))}
                  <div className="my-1 border-t border-[#E2E8F0]" />
                  <Link
                    to="/login"
                    role="menuitem"
                    className="rounded-[8px] px-3 py-2 text-sm font-medium text-[#64748B] hover:bg-[#F5F7FA] hover:text-[#071A36]"
                  >
                    Member Login
                  </Link>
                  <Link
                    to="/admin"
                    role="menuitem"
                    className="rounded-[8px] px-3 py-2 text-sm font-medium text-[#64748B] hover:bg-[#F5F7FA] hover:text-[#071A36]"
                  >
                    Admin Routes (Placeholder)
                  </Link>
                </div>
              </div>
            )}
          </div>
        </nav>

        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <Button to="/book-trial" variant="outline" size="sm">
            Book Free Trial
          </Button>
          <Button to="/register" variant="primary" size="sm">
            Register Now
          </Button>
        </div>

        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Open mobile navigation menu"
          aria-expanded={isMobileMenuOpen}
          className="inline-flex h-11 w-11 items-center justify-center rounded-[10px] border border-[#E2E8F0] bg-white text-[#071A36] hover:bg-[#F5F7FA] lg:hidden cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9A52E]"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>
      </PageContainer>
    </header>
  );
}
