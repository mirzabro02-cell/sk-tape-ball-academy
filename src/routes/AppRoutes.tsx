import { Route, Routes } from 'react-router-dom';
import { AdminLayout } from '@/src/components/layout/AdminLayout';
import { MainLayout } from '@/src/components/layout/MainLayout';
import { AcademyPlaceholderPage } from '@/src/pages/AcademyPlaceholderPage';
import { AdminPlaceholderPage } from '@/src/pages/AdminPlaceholderPage';
import { BookTrialPage } from '@/src/pages/BookTrialPage';
import { ContactPage } from '@/src/pages/ContactPage';
import { HomePage } from '@/src/pages/HomePage';
import { LoginPage } from '@/src/pages/LoginPage';
import { NotFoundPage } from '@/src/pages/NotFoundPage';
import { RegisterPage } from '@/src/pages/RegisterPage';
import { ADMIN_PLACEHOLDER_ROUTES, PUBLIC_PLACEHOLDER_ROUTES } from './routeConfig';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />

        {PUBLIC_PLACEHOLDER_ROUTES.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <AcademyPlaceholderPage
                routePath={route.path}
                title={route.title}
                sectionLabel={route.sectionLabel}
                description={route.description}
                plannedModules={route.plannedModules}
              />
            }
          />
        ))}

        <Route path="/contact" element={<ContactPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/book-trial" element={<BookTrialPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        {ADMIN_PLACEHOLDER_ROUTES.map((adminRoute) =>
          adminRoute.index ? (
            <Route
              key={adminRoute.path}
              index
              element={
                <AdminPlaceholderPage
                  routePath={adminRoute.path}
                  title={adminRoute.title}
                  description={adminRoute.description}
                />
              }
            />
          ) : (
            <Route
              key={adminRoute.path}
              path={adminRoute.path.replace('/admin/', '')}
              element={
                <AdminPlaceholderPage
                  routePath={adminRoute.path}
                  title={adminRoute.title}
                  description={adminRoute.description}
                />
              }
            />
          ),
        )}
      </Route>
    </Routes>
  );
}
