import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AdminRouteGuard } from '@/src/components/admin/AdminRouteGuard';
import { AdminLayout } from '@/src/components/layout/AdminLayout';
import { MainLayout } from '@/src/components/layout/MainLayout';
import { RouteLoadingFallback } from '@/src/components/ui/RouteLoadingFallback';
import { HomePage } from '@/src/pages/HomePage';

const AboutPage = lazy(() =>
  import('@/src/pages/AboutPage').then((m) => ({ default: m.AboutPage })),
);
const AchievementsPage = lazy(() =>
  import('@/src/pages/AchievementsPage').then((m) => ({ default: m.AchievementsPage })),
);
const AdmissionsPage = lazy(() =>
  import('@/src/pages/AdmissionsPage').then((m) => ({ default: m.AdmissionsPage })),
);
const ApplicationStatusPage = lazy(() =>
  import('@/src/pages/ApplicationStatusPage').then((m) => ({
    default: m.ApplicationStatusPage,
  })),
);
const BookTrialPage = lazy(() =>
  import('@/src/pages/BookTrialPage').then((m) => ({ default: m.BookTrialPage })),
);
const CoachesPage = lazy(() =>
  import('@/src/pages/CoachesPage').then((m) => ({ default: m.CoachesPage })),
);
const CoachProfilePage = lazy(() =>
  import('@/src/pages/CoachProfilePage').then((m) => ({ default: m.CoachProfilePage })),
);
const ContactPage = lazy(() =>
  import('@/src/pages/ContactPage').then((m) => ({ default: m.ContactPage })),
);
const FacilitiesPage = lazy(() =>
  import('@/src/pages/FacilitiesPage').then((m) => ({ default: m.FacilitiesPage })),
);
const FaqsPage = lazy(() =>
  import('@/src/pages/FaqsPage').then((m) => ({ default: m.FaqsPage })),
);
const FeesPage = lazy(() =>
  import('@/src/pages/FeesPage').then((m) => ({ default: m.FeesPage })),
);
const ForgotPasswordPage = lazy(() =>
  import('@/src/pages/ForgotPasswordPage').then((m) => ({
    default: m.ForgotPasswordPage,
  })),
);
const GalleryPage = lazy(() =>
  import('@/src/pages/GalleryPage').then((m) => ({ default: m.GalleryPage })),
);
const LegalPage = lazy(() =>
  import('@/src/pages/LegalPage').then((m) => ({ default: m.LegalPage })),
);
const LoginPage = lazy(() =>
  import('@/src/pages/LoginPage').then((m) => ({ default: m.LoginPage })),
);
const MatchDetailPage = lazy(() =>
  import('@/src/pages/MatchDetailPage').then((m) => ({ default: m.MatchDetailPage })),
);
const MatchesPage = lazy(() =>
  import('@/src/pages/MatchesPage').then((m) => ({ default: m.MatchesPage })),
);
const NotFoundPage = lazy(() =>
  import('@/src/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
);
const PlayerProfilePage = lazy(() =>
  import('@/src/pages/PlayerProfilePage').then((m) => ({ default: m.PlayerProfilePage })),
);
const ProgramDetailPage = lazy(() =>
  import('@/src/pages/ProgramDetailPage').then((m) => ({ default: m.ProgramDetailPage })),
);
const ProgramsPage = lazy(() =>
  import('@/src/pages/ProgramsPage').then((m) => ({ default: m.ProgramsPage })),
);
const RegisterPage = lazy(() =>
  import('@/src/pages/RegisterPage').then((m) => ({ default: m.RegisterPage })),
);
const RegistrationConfirmationPage = lazy(() =>
  import('@/src/pages/RegistrationConfirmationPage').then((m) => ({
    default: m.RegistrationConfirmationPage,
  })),
);
const ResetPasswordPage = lazy(() =>
  import('@/src/pages/ResetPasswordPage').then((m) => ({ default: m.ResetPasswordPage })),
);
const SchedulePage = lazy(() =>
  import('@/src/pages/SchedulePage').then((m) => ({ default: m.SchedulePage })),
);

const AdminLoginPage = lazy(() =>
  import('@/src/pages/admin/AdminLoginPage').then((m) => ({ default: m.AdminLoginPage })),
);
const AdminAchievementsPage = lazy(() =>
  import('@/src/pages/admin/AdminAchievementsPage').then((m) => ({
    default: m.AdminAchievementsPage,
  })),
);
const AdminAdmissionsPage = lazy(() =>
  import('@/src/pages/admin/AdminAdmissionsPage').then((m) => ({
    default: m.AdminAdmissionsPage,
  })),
);
const AdminAttendancePage = lazy(() =>
  import('@/src/pages/admin/AdminAttendancePage').then((m) => ({
    default: m.AdminAttendancePage,
  })),
);
const AdminBatchesPage = lazy(() =>
  import('@/src/pages/admin/AdminBatchesPage').then((m) => ({
    default: m.AdminBatchesPage,
  })),
);
const AdminBlogPage = lazy(() =>
  import('@/src/pages/admin/AdminBlogPage').then((m) => ({ default: m.AdminBlogPage })),
);
const AdminCoachesPage = lazy(() =>
  import('@/src/pages/admin/AdminCoachesPage').then((m) => ({
    default: m.AdminCoachesPage,
  })),
);
const AdminDashboardPage = lazy(() =>
  import('@/src/pages/admin/AdminDashboardPage').then((m) => ({
    default: m.AdminDashboardPage,
  })),
);
const AdminFeesPage = lazy(() =>
  import('@/src/pages/admin/AdminFeesPage').then((m) => ({ default: m.AdminFeesPage })),
);
const AdminGalleryPage = lazy(() =>
  import('@/src/pages/admin/AdminGalleryPage').then((m) => ({
    default: m.AdminGalleryPage,
  })),
);
const AdminMatchesPage = lazy(() =>
  import('@/src/pages/admin/AdminMatchesPage').then((m) => ({
    default: m.AdminMatchesPage,
  })),
);
const AdminProgramsPage = lazy(() =>
  import('@/src/pages/admin/AdminProgramsPage').then((m) => ({
    default: m.AdminProgramsPage,
  })),
);
const AdminReportsPage = lazy(() =>
  import('@/src/pages/admin/AdminReportsPage').then((m) => ({
    default: m.AdminReportsPage,
  })),
);
const AdminSchedulesPage = lazy(() =>
  import('@/src/pages/admin/AdminSchedulesPage').then((m) => ({
    default: m.AdminSchedulesPage,
  })),
);
const AdminSettingsPage = lazy(() =>
  import('@/src/pages/admin/AdminSettingsPage').then((m) => ({
    default: m.AdminSettingsPage,
  })),
);
const AdminStudentsPage = lazy(() =>
  import('@/src/pages/admin/AdminStudentsPage').then((m) => ({
    default: m.AdminStudentsPage,
  })),
);
const AdminTestimonialsPage = lazy(() =>
  import('@/src/pages/admin/AdminTestimonialsPage').then((m) => ({
    default: m.AdminTestimonialsPage,
  })),
);
const AdminTrialBookingsPage = lazy(() =>
  import('@/src/pages/admin/AdminTrialBookingsPage').then((m) => ({
    default: m.AdminTrialBookingsPage,
  })),
);
const AdminWebsiteContentPage = lazy(() =>
  import('@/src/pages/admin/AdminWebsiteContentPage').then((m) => ({
    default: m.AdminWebsiteContentPage,
  })),
);

export function AppRoutes() {
  return (
    <Suspense fallback={<RouteLoadingFallback />}>
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

          <Route path="/contact" element={<ContactPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/registration-confirmation"
            element={<RegistrationConfirmationPage />}
          />
          <Route path="/application-status" element={<ApplicationStatusPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/book-trial" element={<BookTrialPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Unadvertised Protected Admin Portal */}
        <Route path="/sk-portal/login" element={<AdminLoginPage />} />
        <Route
          path="/sk-portal"
          element={
            <AdminRouteGuard>
              <AdminLayout />
            </AdminRouteGuard>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="students" element={<AdminStudentsPage />} />
          <Route path="coaches" element={<AdminCoachesPage />} />
          <Route path="programs" element={<AdminProgramsPage />} />
          <Route path="batches" element={<AdminBatchesPage />} />
          <Route path="schedules" element={<AdminSchedulesPage />} />
          <Route path="schedule" element={<Navigate to="/sk-portal/schedules" replace />} />
          <Route path="admissions" element={<AdminAdmissionsPage />} />
          <Route path="trial-bookings" element={<AdminTrialBookingsPage />} />
          <Route path="trials" element={<Navigate to="/sk-portal/trial-bookings" replace />} />
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
    </Suspense>
  );
}
