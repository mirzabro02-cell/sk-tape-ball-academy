import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { PageTransition } from '@/src/components/motion/MotionPrimitives';
import { Header } from './Header';
import { MobileDrawer } from './MobileDrawer';
import { Footer } from './Footer';
import { PageContainer } from './PageContainer';

export function MainLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col overflow-x-clip bg-[#F5F7FA] text-[#07152C] transition-colors duration-200 dark:bg-[#07152C] dark:text-white">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-[10px] focus:bg-[#07152C] focus:px-4 focus:py-2.5 focus:text-xs focus:font-bold focus:text-[#D5A52B] focus:shadow-lg"
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

      <main id="main-content" className="flex-1 py-6 sm:py-10">
        <PageContainer>
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </PageContainer>
      </main>

      <Footer />
    </div>
  );
}
