import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
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

export function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  const prefersReduced = useReducedMotion();
  const { state } = useAcademyState();
  useScrollLock(open);

  useEffect(() => {
    if (!open) {
      return;
    }
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50 xl:hidden"
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
            className="fixed inset-0 bg-[#050D1B]/75 backdrop-blur-xs"
          />

          <motion.aside
            initial={prefersReduced ? { opacity: 0 } : { x: '100%' }}
            animate={prefersReduced ? { opacity: 1 } : { x: 0 }}
            exit={prefersReduced ? { opacity: 0 } : { x: '100%' }}
            transition={{ duration: prefersReduced ? 0 : 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="fixed right-0 top-0 bottom-0 flex w-full max-w-sm flex-col border-l border-[#E2E8F0] bg-white shadow-2xl dark:border-white/10 dark:bg-[#0F213B]"
          >
            <div className="flex h-[76px] items-center justify-between border-b border-[#E2E8F0] px-5 dark:border-white/10">
              <OfficialLogo tone="auto" onClick={onClose} />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close navigation drawer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#E2E8F0] text-[#07152C] hover:bg-[#F5F7FA] dark:border-white/15 dark:text-white dark:hover:bg-[#162B4D] cursor-pointer"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
              <div className="flex items-center justify-between rounded-[12px] border border-[#E2E8F0] bg-[#F5F7FA] px-3.5 py-2.5 dark:border-white/10 dark:bg-[#07152C]">
                <span className="text-xs font-semibold text-[#475569] dark:text-[#B4C4DC]">
                  Appearance
                </span>
                <ThemeToggle variant="surface" showLabel />
              </div>

              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#64748B] dark:text-[#7F95B8]">
                  Main Navigation
                </p>
                <nav className="mt-2.5 flex flex-col gap-1">
                  {PRIMARY_NAV_ITEMS.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.path === '/'}
                      onClick={onClose}
                      className={({ isActive }) =>
                        cn(
                          'rounded-[10px] px-3.5 py-2.5 text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-[#07152C] text-[#D5A52B] font-semibold dark:bg-[#D5A52B] dark:text-[#07152C]'
                            : 'text-[#07152C] hover:bg-[#F5F7FA] dark:text-white/90 dark:hover:bg-white/5',
                        )
                      }
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </nav>
              </div>

              <div className="border-t border-[#E2E8F0] pt-5 dark:border-white/10">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#64748B] dark:text-[#7F95B8]">
                  Explore Academy
                </p>
                <nav className="mt-2.5 grid grid-cols-2 gap-1.5">
                  {SECONDARY_NAV_ITEMS.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={onClose}
                      className={({ isActive }) =>
                        cn(
                          'rounded-[10px] px-3 py-2 text-sm transition-colors',
                          isActive
                            ? 'bg-[#07152C] text-[#D5A52B] font-semibold dark:bg-[#D5A52B] dark:text-[#07152C]'
                            : 'text-[#07152C] hover:bg-[#F5F7FA] dark:text-white/85 dark:hover:bg-white/5',
                        )
                      }
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </nav>
              </div>

              <div className="border-t border-[#E2E8F0] pt-5 space-y-3 dark:border-white/10">
                <Button to="/register" variant="primary" fullWidth onClick={onClose}>
                  Register Now
                </Button>
                <Button to="/programs" variant="outline" fullWidth onClick={onClose}>
                  Explore Programs
                </Button>
                <WhatsAppCta variant="banner" hideIfUnconfigured />
              </div>

              <div className="border-t border-[#E2E8F0] pt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-[#64748B] dark:border-white/10 dark:text-[#7F95B8]">
                <NavLink
                  to="/login"
                  onClick={onClose}
                  className="font-medium hover:text-[#07152C] dark:hover:text-white"
                >
                  Member Login
                </NavLink>
                <NavLink
                  to="/application-status"
                  onClick={onClose}
                  className="font-medium hover:text-[#07152C] dark:hover:text-white"
                >
                  Track Application
                </NavLink>
              </div>
            </div>

            <div className="border-t border-[#E2E8F0] bg-[#F5F7FA] px-5 py-3.5 text-center dark:border-white/10 dark:bg-[#07152C]">
              <p className="text-[11px] font-semibold tracking-wider text-[#07152C] dark:text-[#D5A52B]">
                {state.siteSettings.tagline}
              </p>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
