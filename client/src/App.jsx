import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import GroupsPage from './pages/GroupsPage';
import GroupPage from './pages/GroupPage';
import NotificationsPage from './pages/NotificationsPage';

function Protected({ children }) {
  const { isAuthenticated, authLoading } = useAuth();
  if (authLoading) return <main className="screen-center">Restoring your session…</main>;
  return isAuthenticated ? <Layout>{children}</Layout> : <Navigate to="/login" replace />;
}

function Guest({ mode }) {
  const { isAuthenticated, authLoading } = useAuth();
  if (authLoading) return <main className="screen-center">Loading…</main>;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <AuthPage mode={mode} />;
}

export default function App() {
  return <AuthProvider><Routes>
    <Route path="/login" element={<Guest mode="login" />} />
    <Route path="/register" element={<Guest mode="register" />} />
    <Route path="/dashboard" element={<Protected><DashboardPage /></Protected>} />
    <Route path="/groups" element={<Protected><GroupsPage /></Protected>} />
    <Route path="/groups/:groupId" element={<Protected><GroupPage /></Protected>} />
    <Route path="/groups/:groupId/:tab" element={<Protected><GroupPage /></Protected>} />
    <Route path="/notifications" element={<Protected><NotificationsPage /></Protected>} />
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes></AuthProvider>;
}
