import { Route, Routes } from 'react-router-dom';
import { AdminLayout } from '@/src/components/layout/AdminLayout';
import { MainLayout } from '@/src/components/layout/MainLayout';
import { AboutPage } from '@/src/pages/AboutPage';
import { AcademyPlaceholderPage } from '@/src/pages/AcademyPlaceholderPage';
import { AchievementsPage } from '@/src/pages/AchievementsPage';
import { AdminPlaceholderPage } from '@/src/pages/AdminPlaceholderPage';
import { AdmissionsPage } from '@/src/pages/AdmissionsPage';
import { ApplicationStatusPage } from '@/src/pages/ApplicationStatusPage';
import { BookTrialPage } from '@/src/pages/BookTrialPage';
import { CoachesPage } from '@/src/pages/CoachesPage';
import { CoachProfilePage } from '@/src/pages/CoachProfilePage';
import { ContactPage } from '@/src/pages/ContactPage';
import { FacilitiesPage } from '@/src/pages/FacilitiesPage';
import { FaqsPage } from '@/src/pages/FaqsPage';
import { FeesPage } from '@/src/pages/FeesPage';
import { ForgotPasswordPage } from '@/src/pages/ForgotPasswordPage';
import { GalleryPage } from '@/src/pages/GalleryPage';
import { HomePage } from '@/src/pages/HomePage';
import { LegalPage } from '@/src/pages/LegalPage';
import { LoginPage } from '@/src/pages/LoginPage';
import { MatchDetailPage } from '@/src/pages/MatchDetailPage';
import { MatchesPage } from '@/src/pages/MatchesPage';
import { NotFoundPage } from '@/src/pages/NotFoundPage';
import { PlayerProfilePage } from '@/src/pages/PlayerProfilePage';
import { ProgramDetailPage } from '@/src/pages/ProgramDetailPage';
import { ProgramsPage } from '@/src/pages/ProgramsPage';
import { RegisterPage } from '@/src/pages/RegisterPage';
import { RegistrationConfirmationPage } from '@/src/pages/RegistrationConfirmationPage';
import { ResetPasswordPage } from '@/src/pages/ResetPasswordPage';
import { SchedulePage } from '@/src/pages/SchedulePage';
import { ADMIN_PLACEHOLDER_ROUTES, PUBLIC_PLACEHOLDER_ROUTES } from './routeConfig';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/programs" element={<ProgramsPage />} />
        <Route path="/programs/:slug" element={<ProgramDetailPage />} />
        <Route path="/coaches" element={<CoachesPage />} />
        <Route path="/coaches/:slug" element={<CoachProfilePage />} />
        <Route path="/facilities" element={<FacilitiesPage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/matches" element={<MatchesPage />} />
        <Route path="/matches/:slug" element={<MatchDetailPage />} />
        <Route path="/achievements" element={<AchievementsPage />} />
        <Route path="/players/:slug" element={<PlayerProfilePage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/admissions" element={<AdmissionsPage />} />
        <Route path="/fees" element={<FeesPage />} />
        <Route path="/faqs" element={<FaqsPage />} />

        {/* Legal Routes */}
        <Route path="/privacy-policy" element={<LegalPage slug="privacy-policy" />} />
        <Route path="/privacy" element={<LegalPage slug="privacy-policy" />} />
        <Route path="/terms" element={<LegalPage slug="terms" />} />
        <Route path="/admission-policy" element={<LegalPage slug="admission-policy" />} />
        <Route path="/refund-policy" element={<LegalPage slug="refund-policy" />} />
        <Route path="/child-safety" element={<LegalPage slug="child-safety" />} />
        <Route
          path="/photography-consent"
          element={<LegalPage slug="photography-consent" />}
        />

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
        <Route path="/registration-confirmation" element={<RegistrationConfirmationPage />} />
        <Route path="/application-status" element={<ApplicationStatusPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
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
