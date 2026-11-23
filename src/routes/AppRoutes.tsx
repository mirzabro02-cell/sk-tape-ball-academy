import { Navigate, Route, Routes } from 'react-router-dom';
import { AdminLayout } from '@/src/components/layout/AdminLayout';
import { MainLayout } from '@/src/components/layout/MainLayout';
import { AboutPage } from '@/src/pages/AboutPage';
import { AcademyPlaceholderPage } from '@/src/pages/AcademyPlaceholderPage';
import { AchievementsPage } from '@/src/pages/AchievementsPage';
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
import { AdminAchievementsPage } from '@/src/pages/admin/AdminAchievementsPage';
import { AdminAdmissionsPage } from '@/src/pages/admin/AdminAdmissionsPage';
import { AdminAttendancePage } from '@/src/pages/admin/AdminAttendancePage';
import { AdminBatchesPage } from '@/src/pages/admin/AdminBatchesPage';
import { AdminBlogPage } from '@/src/pages/admin/AdminBlogPage';
import { AdminCoachesPage } from '@/src/pages/admin/AdminCoachesPage';
import { AdminDashboardPage } from '@/src/pages/admin/AdminDashboardPage';
import { AdminFeesPage } from '@/src/pages/admin/AdminFeesPage';
import { AdminGalleryPage } from '@/src/pages/admin/AdminGalleryPage';
import { AdminMatchesPage } from '@/src/pages/admin/AdminMatchesPage';
import { AdminProgramsPage } from '@/src/pages/admin/AdminProgramsPage';
import { AdminReportsPage } from '@/src/pages/admin/AdminReportsPage';
import { AdminSchedulesPage } from '@/src/pages/admin/AdminSchedulesPage';
import { AdminSettingsPage } from '@/src/pages/admin/AdminSettingsPage';
import { AdminStudentsPage } from '@/src/pages/admin/AdminStudentsPage';
import { AdminTestimonialsPage } from '@/src/pages/admin/AdminTestimonialsPage';
import { AdminTrialBookingsPage } from '@/src/pages/admin/AdminTrialBookingsPage';
import { AdminWebsiteContentPage } from '@/src/pages/admin/AdminWebsiteContentPage';
import { PUBLIC_PLACEHOLDER_ROUTES } from './routeConfig';

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

      {/* Complete Admin Panel Frontend (Part 7) */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="students" element={<AdminStudentsPage />} />
        <Route path="coaches" element={<AdminCoachesPage />} />
        <Route path="programs" element={<AdminProgramsPage />} />
        <Route path="batches" element={<AdminBatchesPage />} />
        <Route path="schedules" element={<AdminSchedulesPage />} />
        <Route path="schedule" element={<Navigate to="/admin/schedules" replace />} />
        <Route path="admissions" element={<AdminAdmissionsPage />} />
        <Route path="trial-bookings" element={<AdminTrialBookingsPage />} />
        <Route path="trials" element={<Navigate to="/admin/trial-bookings" replace />} />
        <Route path="fees" element={<AdminFeesPage />} />
        <Route path="attendance" element={<AdminAttendancePage />} />
        <Route path="matches" element={<AdminMatchesPage />} />
        <Route path="achievements" element={<AdminAchievementsPage />} />
        <Route path="gallery" element={<AdminGalleryPage />} />
        <Route path="testimonials" element={<AdminTestimonialsPage />} />
        <Route path="blog" element={<AdminBlogPage />} />
        <Route path="website-content" element={<AdminWebsiteContentPage />} />
        <Route path="reports" element={<AdminReportsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>
    </Routes>
  );
}
