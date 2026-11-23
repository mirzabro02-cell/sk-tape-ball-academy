import { BrowserRouter } from 'react-router-dom';
import { MotionConfig } from 'motion/react';
import { RouteSeoSync } from '@/src/components/seo/RouteSeoSync';
import { ScrollToTop } from '@/src/components/layout/ScrollToTop';
import { AppErrorBoundary } from '@/src/components/ui/AppErrorBoundary';
import { AppRoutes } from '@/src/routes/AppRoutes';

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <AppErrorBoundary>
        <BrowserRouter>
          <ScrollToTop />
          <RouteSeoSync />
          <AppRoutes />
        </BrowserRouter>
      </AppErrorBoundary>
    </MotionConfig>
  );
}
