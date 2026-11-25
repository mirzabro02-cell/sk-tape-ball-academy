import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAcademyState } from '@/src/context/AcademyStateContext';
import { PageTransition } from '@/src/components/motion/MotionPrimitives';
import { MaintenancePage } from '@/src/pages/MaintenancePage';
import { Header } from './Header';
import { MobileDrawer } from './MobileDrawer';
import { Footer } from './Footer';
import { PageContainer } from './PageContainer';

export function MainLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { state } = useAcademyState();

  if (state.siteSettings.maintenance.enabled) {
    return <MaintenancePage />;
  }

  const isEdgeToEdgePage =
    location.pathname === '/' ||
    location.pathname === '/about' ||
    location.pathname === '/programs';

  return (
    <div className="min-h-screen flex flex-col overflow-x-clip bg-[var(--bg-canvas)] text-[var(--text-primary)] transition-colors duration-200">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-[10px] focus:bg-[#07152C] focus:px-4 focus:py-2.5 focus:text-xs focus:font-bold focus:text-[#D5A83C] focus:shadow-lg focus:ring-2 focus:ring-[#D5A83C]"
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

      <main
        id="main-content"
        className={isEdgeToEdgePage ? 'flex-1 pb-12 sm:pb-16' : 'flex-1 pt-5 pb-12 sm:pt-8 sm:pb-16'}
      >
        {isEdgeToEdgePage ? (
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        ) : (
          <PageContainer>
            <PageTransition key={location.pathname}>
              <Outlet />
            </PageTransition>
          </PageContainer>
        )}
      </main>

      <Footer />
    </div>
  );
}
