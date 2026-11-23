import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import {
  ADMIN_NAV_ITEMS,
  PRIMARY_NAV_ITEMS,
  SECONDARY_NAV_ITEMS,
} from '@/src/data/navigation';
import { ACADEMY_BRAND } from '@/src/data/brand';
import { Button } from '@/src/components/ui/Button';
import { OfficialLogo } from '@/src/components/ui/OfficialLogo';
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
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Mobile Navigation">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReduced ? 0 : 0.18 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#050D1B]/60 backdrop-blur-[2px]"
          />

          <motion.aside
            initial={prefersReduced ? { opacity: 0 } : { x: '100%' }}
            animate={prefersReduced ? { opacity: 1 } : { x: 0 }}
            exit={prefersReduced ? { opacity: 0 } : { x: '100%' }}
            transition={{ duration: prefersReduced ? 0 : 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="fixed right-0 top-0 bottom-0 flex w-full max-w-sm flex-col bg-white shadow-2xl border-l border-[#E2E8F0]"
          >
            <div className="flex h-[76px] items-center justify-between border-b border-[#E2E8F0] px-5">
              <OfficialLogo tone="light" onClick={onClose} />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close navigation drawer"
                className="inline-flex h-11 w-11 items-center justify-center rounded-[10px] border border-[#E2E8F0] text-[#071A36] hover:bg-[#F5F7FA] cursor-pointer"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
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
                            ? 'bg-[#071A36] text-white font-semibold'
                            : 'text-[#071A36] hover:bg-[#F5F7FA]',
                        )
                      }
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </nav>
              </div>

              <div className="border-t border-[#E2E8F0] pt-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
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
                            ? 'bg-[#071A36] text-white font-semibold'
                            : 'text-[#071A36] hover:bg-[#F5F7FA]',
                        )
                      }
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </nav>
              </div>

              <div className="border-t border-[#E2E8F0] pt-5 space-y-3">
                <Button to="/book-trial" variant="outline" fullWidth onClick={onClose}>
                  Book Free Trial
                </Button>
                <Button to="/register" variant="primary" fullWidth onClick={onClose}>
                  Register Now
                </Button>
                <WhatsAppCta variant="banner" />
              </div>

              <div className="border-t border-[#E2E8F0] pt-5 flex flex-wrap items-center justify-between gap-3 text-xs text-[#64748B]">
                <NavLink to="/login" onClick={onClose} className="font-medium hover:text-[#071A36]">
                  Member Login
                </NavLink>
                <NavLink
                  to="/application-status"
                  onClick={onClose}
                  className="font-medium hover:text-[#071A36]"
                >
                  Track Application
                </NavLink>
                <NavLink
                  to={ADMIN_NAV_ITEMS[0].path}
                  onClick={onClose}
                  className="font-medium hover:text-[#071A36]"
                >
                  Admin Placeholder
                </NavLink>
              </div>
            </div>

            <div className="border-t border-[#E2E8F0] bg-[#F5F7FA] px-5 py-3.5 text-center">
              <p className="text-[11px] font-semibold tracking-wider text-[#071A36]">
                {ACADEMY_BRAND.tagline}
              </p>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
