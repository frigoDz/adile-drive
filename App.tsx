
import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { User, UserRole, RideRequest, RideStatus } from './types';
import { mockAuth } from './services/mockFirebase';
import { checkAppStatus, STATUS_CHANGE_EVENT } from './services/adminService';
import Layout from './components/Layout';
import Login from './screens/Login';
import Signup from './screens/Signup';
import UserHome from './screens/UserHome';
import DriverDashboard from './screens/DriverDashboard';
import History from './screens/History';
import Notifications from './screens/Notifications';
import Settings from './screens/Settings';
import Maintenance from './screens/Maintenance';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(mockAuth.getCurrentUser());
  const [activeRide, setActiveRide] = useState<RideRequest | null>(null);
  const [requests, setRequests] = useState<RideRequest[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [appStatus, setAppStatus] = useState<{ active: boolean; message: string }>({ active: true, message: "" });

  const refreshStatus = useCallback(async () => {
    const status = await checkAppStatus();
    setAppStatus(status);
  }, []);

  useEffect(() => {
    const initApp = async () => {
      await refreshStatus();
      
      // Load Local Data
      const savedRequests = localStorage.getItem('adile_rides');
      if (savedRequests) {
        const parsed = JSON.parse(savedRequests);
        setRequests(parsed.filter((r: any) => r.status === RideStatus.PENDING));
        
        const active = parsed.find((r: any) => 
          (r.passengerId === user?.id || r.driverId === user?.id) && 
          r.status !== RideStatus.COMPLETED && 
          r.status !== RideStatus.CANCELLED
        );
        if (active) setActiveRide(active);
      }
      setIsReady(true);
    };

    initApp();

    // Listen for remote status changes without reloading
    window.addEventListener(STATUS_CHANGE_EVENT, refreshStatus);
    return () => window.removeEventListener(STATUS_CHANGE_EVENT, refreshStatus);
  }, [user, refreshStatus]);

  const handleLogout = () => {
    mockAuth.logout();
    setUser(null);
    setActiveRide(null);
  };

  const handleRideRequest = (req: Partial<RideRequest>) => {
    const newRide: RideRequest = {
      ...req as RideRequest,
      id: Math.random().toString(36).substr(2, 9)
    };
    const saved = JSON.parse(localStorage.getItem('adile_rides') || '[]');
    const updated = [...saved, newRide];
    localStorage.setItem('adile_rides', JSON.stringify(updated));
    setRequests(updated.filter((r: any) => r.status === RideStatus.PENDING));
    setActiveRide(newRide);
  };

  const handleCancelRide = () => {
    if (!activeRide) return;
    const saved = JSON.parse(localStorage.getItem('adile_rides') || '[]');
    const updated = saved.map((r: any) => 
      r.id === activeRide.id ? { ...r, status: RideStatus.CANCELLED } : r
    );
    localStorage.setItem('adile_rides', JSON.stringify(updated));
    setActiveRide(null);
  };

  const handleAcceptRide = (rideId: string) => {
    if (!user) return;
    const saved = JSON.parse(localStorage.getItem('adile_rides') || '[]');
    const updated = saved.map((r: any) => {
      if (r.id === rideId) {
        return { ...r, status: RideStatus.ACCEPTED, driverId: user.id, driverName: user.name };
      }
      return r;
    });
    localStorage.setItem('adile_rides', JSON.stringify(updated));
    setRequests(updated.filter((r: any) => r.status === RideStatus.PENDING));
    const active = updated.find((r: any) => r.id === rideId);
    if (active) setActiveRide(active);
  };

  const handleCompleteRide = (rideId: string) => {
    const saved = JSON.parse(localStorage.getItem('adile_rides') || '[]');
    const updated = saved.map((r: any) => {
      if (r.id === rideId) {
        if (r.status === RideStatus.ACCEPTED) return { ...r, status: RideStatus.EN_ROUTE };
        return { ...r, status: RideStatus.COMPLETED };
      }
      return r;
    });
    localStorage.setItem('adile_rides', JSON.stringify(updated));
    
    const current = updated.find((r: any) => r.id === rideId);
    if (current?.status === RideStatus.COMPLETED) {
      setActiveRide(null);
    } else {
      setActiveRide(current);
    }
  };

  if (!isReady) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!appStatus.active) {
    return <Maintenance message={appStatus.message} />;
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={!user ? <Login onLoginSuccess={setUser} onNavigateToSignup={() => window.location.hash = '#/signup'} /> : <Navigate to="/" />} 
        />
        <Route 
          path="/signup" 
          element={!user ? <Signup onSignupSuccess={setUser} onNavigateToLogin={() => window.location.hash = '#/login'} /> : <Navigate to="/" />} 
        />
        <Route 
          path="/" 
          element={
            user ? (
              <Layout user={user} onLogout={handleLogout}>
                {user.role === UserRole.PASSENGER ? (
                  <UserHome user={user} onRequestRide={handleRideRequest} onCancelRide={handleCancelRide} activeRide={activeRide} />
                ) : (
                  <DriverDashboard 
                    user={user}
                    requests={requests} 
                    onAccept={handleAcceptRide} 
                    activeRide={activeRide} 
                    onComplete={handleCompleteRide}
                  />
                )}
              </Layout>
            ) : <Navigate to="/login" />
          } 
        />
        <Route 
          path="/history" 
          element={user ? <Layout user={user} onLogout={handleLogout} title="Ride History" showBack><History user={user} /></Layout> : <Navigate to="/login" />}
        />
        <Route 
          path="/notifications" 
          element={user ? <Layout user={user} onLogout={handleLogout} title="Notifications" showBack><Notifications /></Layout> : <Navigate to="/login" />}
        />
        <Route 
          path="/settings" 
          element={user ? <Layout user={user} onLogout={handleLogout} title="Settings" showBack><Settings user={user} /></Layout> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
