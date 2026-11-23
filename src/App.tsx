import { BrowserRouter } from 'react-router-dom';
import { MotionConfig } from 'motion/react';
import { ScrollToTop } from '@/src/components/layout/ScrollToTop';
import { AppRoutes } from '@/src/routes/AppRoutes';

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <ScrollToTop />
        <AppRoutes />
      </BrowserRouter>
    </MotionConfig>
  );
}
