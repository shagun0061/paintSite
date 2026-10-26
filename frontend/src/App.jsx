import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';
import { RequireAuth } from './components/admin/RequireAuth.jsx';
import { ToastProvider } from './components/admin/Toast.jsx';
import { ScrollToTop } from './components/layout/ScrollToTop.jsx';
import { Spinner } from './components/ui/States.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { MainLayout } from './layouts/MainLayout.jsx';
import Home from './pages/Home.jsx';
import NotFound from './pages/NotFound.jsx';

// Public inner pages and the whole admin area are split into separate chunks.
const About = lazy(() => import('./pages/About.jsx'));
const Services = lazy(() => import('./pages/Services.jsx'));
const Portfolio = lazy(() => import('./pages/Portfolio.jsx'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail.jsx'));
const Reviews = lazy(() => import('./pages/Reviews.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));

const AdminLayout = lazy(() => import('./layouts/AdminLayout.jsx').then((m) => ({ default: m.AdminLayout })));
const Login = lazy(() => import('./pages/admin/Login.jsx'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard.jsx'));
const Enquiries = lazy(() => import('./pages/admin/Enquiries.jsx'));
const AdminProjects = lazy(() => import('./pages/admin/Projects.jsx'));
const ProjectEditor = lazy(() => import('./pages/admin/ProjectEditor.jsx'));
const AdminReviews = lazy(() => import('./pages/admin/Reviews.jsx'));
const AdminServices = lazy(() => import('./pages/admin/Services.jsx'));
const AdminSettings = lazy(() => import('./pages/admin/Settings.jsx'));
const Account = lazy(() => import('./pages/admin/Account.jsx'));

function AdminRoot({ children }) {
  return (
    <AuthProvider>
      <ToastProvider>{children}</ToastProvider>
    </AuthProvider>
  );
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<Spinner className="min-h-[60vh]" />}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="services" element={<Services />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="portfolio/:slug" element={<ProjectDetail />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          <Route
            path="admin/login"
            element={
              <AdminRoot>
                <Login />
              </AdminRoot>
            }
          />
          <Route
            path="admin"
            element={
              <AdminRoot>
                <RequireAuth>
                  <AdminLayout />
                </RequireAuth>
              </AdminRoot>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="enquiries" element={<Enquiries />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="projects/new" element={<ProjectEditor />} />
            <Route path="projects/:id" element={<ProjectEditor />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="account" element={<Account />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}
