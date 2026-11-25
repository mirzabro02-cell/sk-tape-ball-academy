import { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
  Award,
  BookOpen,
  Building2,
  CalendarClock,
  CreditCard,
  Dumbbell,
  HelpCircle,
  Home,
  Images,
  Info,
  Mail,
  Newspaper,
  Trophy,
  Users,
  X,
} from 'lucide-react';
import { PRIMARY_NAV_ITEMS, SECONDARY_NAV_ITEMS } from '@/src/data/navigation';
import { useAcademyState } from '@/src/context/AcademyStateContext';
import { Button } from '@/src/components/ui/Button';
import { OfficialLogo } from '@/src/components/ui/OfficialLogo';
import { ThemeToggle } from '@/src/components/ui/ThemeToggle';
import { WhatsAppCta } from '@/src/components/ui/WhatsAppCta';
import { useReducedMotion } from '@/src/hooks/useReducedMotion';
import { useScrollLock } from '@/src/hooks/useScrollLock';
import { cn } from '@/src/utils/cn';

export interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
}

const ROUTE_ICONS: Record<string, typeof Home> = {
  '/': Home,
  '/about': Info,
  '/programs': Dumbbell,
  '/coaches': Users,
  '/matches': Trophy,
  '/gallery': Images,
  '/contact': Mail,
  '/admissions': BookOpen,
  '/schedule': CalendarClock,
  '/achievements': Award,
  '/facilities': Building2,
  '/fees': CreditCard,
  '/updates': Newspaper,
  '/faqs': HelpCircle,
};

export function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  const prefersReduced = useReducedMotion();
  const { state } = useAcademyState();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  useScrollLock(open);

  useEffect(() => {
    if (!open) {
      return;
    }
    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div
          id="mobile-navigation-drawer"
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReduced ? 0 : 0.18 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#050D1B]/78 backdrop-blur-xs"
          />

          <motion.aside
            initial={prefersReduced ? { opacity: 0 } : { x: '100%' }}
            animate={prefersReduced ? { opacity: 1 } : { x: 0 }}
            exit={prefersReduced ? { opacity: 0 } : { x: '100%' }}
            transition={{ duration: prefersReduced ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="fixed right-0 top-0 bottom-0 flex w-full max-w-sm flex-col border-l border-[#E2E8F0] bg-white shadow-2xl dark:border-white/12 dark:bg-gradient-to-b dark:from-[#081730] dark:to-[#050D1B]"
          >
            <div className="flex h-[76px] items-center justify-between border-b border-[#E2E8F0] px-5 dark:border-white/10">
              <OfficialLogo tone="auto" onClick={onClose} size="sm" layout="stacked" />
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                aria-label="Close navigation drawer"
                className="inline-flex h-11 w-11 items-center justify-center rounded-[10px] border border-[#CBD5E1] text-[#07152C] hover:border-[#D5A83C] hover:bg-[#F4F6FA] dark:border-white/15 dark:bg-[#0F213B] dark:text-white dark:hover:border-[#D5A83C]/65 dark:hover:bg-[#162B4D] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D5A83C]"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
              <div className="flex items-center justify-between rounded-[12px] border border-[#E2E8F0] bg-[#F4F6FA] px-3.5 py-2.5 dark:border-white/10 dark:bg-[#0F213B]/80">
                <span className="text-xs font-semibold text-[#475569] dark:text-[#B8C7DF]">
                  Theme
                </span>
                <ThemeToggle variant="surface" showLabel />
              </div>

              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#64748B] dark:text-[#859BB9]">
                  Main Navigation
                </p>
                <nav className="mt-2.5 flex flex-col gap-1.5" aria-label="Mobile Primary Links">
                  {PRIMARY_NAV_ITEMS.map((item) => {
                    const Icon = ROUTE_ICONS[item.path] ?? Home;
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/'}
                        onClick={onClose}
                        className={({ isActive }) =>
                          cn(
                            'flex min-h-[44px] items-center gap-3 rounded-[10px] px-3.5 py-2.5 text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D5A83C]',
                            isActive
                              ? 'bg-gradient-to-r from-[#D5A83C] via-[#DCB146] to-[#E4BC54] text-[#050D1B] font-bold shadow-[0_8px_22px_-8px_rgba(213,168,60,0.65)]'
                              : 'text-[#07152C] hover:bg-[#F4F6FA] dark:text-white/90 dark:hover:bg-white/8',
                          )
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <Icon
                              className={cn(
                                'h-4 w-4 shrink-0',
                                isActive
                                  ? 'text-[#050D1B]'
                                  : 'text-[#64748B] dark:text-[#D5A83C]/90',
                              )}
                              aria-hidden="true"
                            />
                            <span>{item.label}</span>
                          </>
                        )}
                      </NavLink>
                    );
                  })}
                </nav>
              </div>

              <div className="border-t border-[#E2E8F0] pt-5 dark:border-white/10">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#64748B] dark:text-[#859BB9]">
                  Explore Academy
                </p>
                <nav className="mt-2.5 grid grid-cols-2 gap-2" aria-label="Mobile Secondary Links">
                  {SECONDARY_NAV_ITEMS.map((item) => {
                    const Icon = ROUTE_ICONS[item.path] ?? BookOpen;
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={onClose}
                        className={({ isActive }) =>
                          cn(
                            'flex min-h-[44px] items-center gap-2 rounded-[10px] border px-3 py-2 text-xs sm:text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D5A83C]',
                            isActive
                              ? 'border-[#D5A83C] bg-[#D5A83C] text-[#050D1B] font-bold shadow-xs'
                              : 'border-[#E2E8F0] bg-[#F4F6FA]/70 text-[#07152C] hover:border-[#D5A83C]/60 hover:bg-[#F4F6FA] dark:border-white/10 dark:bg-[#0F213B]/60 dark:text-white/88 dark:hover:border-[#D5A83C]/55 dark:hover:bg-[#162B4D]',
                          )
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <Icon
                              className={cn(
                                'h-3.5 w-3.5 shrink-0',
                                isActive
                                  ? 'text-[#050D1B]'
                                  : 'text-[#64748B] dark:text-[#D5A83C]/85',
                              )}
                              aria-hidden="true"
                            />
                            <span className="truncate">{item.label}</span>
                          </>
                        )}
                      </NavLink>
                    );
                  })}
                </nav>
              </div>

              <div className="border-t border-[#E2E8F0] pt-5 space-y-3 dark:border-white/10">
                <Button
                  to="/register"
                  variant="primary"
                  size="lg"
                  shape="pill"
                  fullWidth
                  onClick={onClose}
                  rightIcon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
                >
                  Register Now
                </Button>
                <Button
                  to="/programs"
                  variant="outline"
                  shape="pill"
                  fullWidth
                  onClick={onClose}
                >
                  Explore Programs
                </Button>
                <WhatsAppCta variant="banner" hideIfUnconfigured />
              </div>

              <div className="border-t border-[#E2E8F0] pt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-[#64748B] dark:border-white/10 dark:text-[#859BB9]">
                <NavLink
                  to="/login"
                  onClick={onClose}
                  className="py-1 font-semibold hover:text-[#07152C] dark:hover:text-[#D5A83C] transition-colors rounded-[4px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D5A83C]"
                >
                  Member Login
                </NavLink>
                <NavLink
                  to="/application-status"
                  onClick={onClose}
                  className="py-1 font-semibold hover:text-[#07152C] dark:hover:text-[#D5A83C] transition-colors rounded-[4px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D5A83C]"
                >
                  Track Application
                </NavLink>
              </div>
            </div>

            <div className="border-t border-[#E2E8F0] bg-[#F4F6FA] px-5 py-3.5 text-center dark:border-white/10 dark:bg-[#050D1B]">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#07152C] dark:text-[#D5A83C]">
                {state.siteSettings.tagline}
              </p>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
