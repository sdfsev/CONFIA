
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginView from './views/LoginView';
import RegisterView from './views/RegisterView';
import HomeView from './views/HomeView';
import SearchView from './views/SearchView';
import ProfileView from './views/ProfileView';
import DashboardView from './views/DashboardView';
import OnboardingView from './views/OnboardingView';
import PlansView from './views/PlansView';
import NotificationsView from './views/NotificationsView';
import AdminView from './views/AdminView';
import BottomNav from './components/BottomNav';
import './firebaseService'; // Initialize Firebase

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDark, setIsDark] = useState(true);

  // Apply dark mode class to html element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Hide BottomNav on certain screens
  const publicPages = ['/login', '/register'];
  const hideNav = publicPages.includes(location.pathname) || ['/onboarding', '/admin'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark overflow-x-hidden">
      <Routes>
        <Route path="/login" element={<LoginView />} />
        <Route path="/register" element={<RegisterView />} />
        
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomeView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <SearchView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:id"
          element={
            <ProtectedRoute>
              <ProfileView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <OnboardingView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/plans"
          element={
            <ProtectedRoute>
              <PlansView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationsView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminView />
            </ProtectedRoute>
          }
        />
      </Routes>
      
      {!hideNav && <BottomNav />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </AuthProvider>
  );
};

export default App;
