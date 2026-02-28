import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores';

// Pages
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import DashboardLayout from '@/pages/DashboardLayout';
import EmergencyPage from '@/pages/EmergencyPage';
import HealthcareGuidancePage from '@/pages/HealthcareGuidancePage';
import SarkariYojnaPage from '@/pages/SarkariYojnaPage';
import InsurancePage from '@/pages/InsurancePage';
import ProfilePage from '@/pages/ProfilePage';
import DoctorPortal from '@/pages/DoctorPortal';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard/emergency" replace />} />
          <Route path="emergency" element={<EmergencyPage />} />
          <Route path="guidance" element={<HealthcareGuidancePage />} />
          <Route path="yojna" element={<SarkariYojnaPage />} />
          <Route path="insurance" element={<InsurancePage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="doctor" element={<DoctorPortal />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
