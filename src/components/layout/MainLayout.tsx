import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { useReducedMotion } from '@/src/hooks/useReducedMotion';
import { Header } from './Header';
import { MobileDrawer } from './MobileDrawer';
import { Footer } from './Footer';
import { PageContainer } from './PageContainer';

export function MainLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const prefersReduced = useReducedMotion();

  return (
    <div className="min-h-screen flex flex-col overflow-x-clip bg-[#F5F7FA] text-[#071A36]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-[10px] focus:bg-[#071A36] focus:px-4 focus:py-2.5 focus:text-xs focus:font-bold focus:text-[#D9A52E] focus:shadow-lg"
      >
        Skip to main content
      </a>

      <Header
        isMobileMenuOpen={mobileMenuOpen}
        onOpenMobileMenu={() => setMobileMenuOpen(true)}
      />

      <MobileDrawer
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <main id="main-content" className="flex-1 py-8 sm:py-12">
        <PageContainer>
          <motion.div
            key={location.pathname}
            initial={prefersReduced ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: prefersReduced ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <Outlet />
          </motion.div>
        </PageContainer>
      </main>

      <Footer />
    </div>
  );
}
