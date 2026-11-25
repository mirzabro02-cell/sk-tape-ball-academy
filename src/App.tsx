import { BrowserRouter } from 'react-router-dom';
import { MotionConfig } from 'motion/react';
import { ThemeProvider } from '@/src/context/ThemeContext';
import { AcademyStateProvider } from '@/src/context/AcademyStateContext';
import { AdminAuthProvider } from '@/src/context/AdminAuthContext';
import { RouteSeoSync } from '@/src/components/seo/RouteSeoSync';
import { ScrollToTop } from '@/src/components/layout/ScrollToTop';
import { AppErrorBoundary } from '@/src/components/ui/AppErrorBoundary';
import { AppRoutes } from '@/src/routes/AppRoutes';

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ThemeProvider>
        <AppErrorBoundary>
          <AcademyStateProvider>
            <AdminAuthProvider>
              <BrowserRouter>
                <ScrollToTop />
                <RouteSeoSync />
                <AppRoutes />
              </BrowserRouter>
            </AdminAuthProvider>
          </AcademyStateProvider>
        </AppErrorBoundary>
      </ThemeProvider>
    </MotionConfig>
  );
}
