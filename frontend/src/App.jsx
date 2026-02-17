import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Assessment from './pages/Assessment';
import Profile from './pages/Profile';
import Stressors from './pages/Stressors';
import Resources from './pages/Resources';
import Recommendations from './pages/Recommendations';
import AdminPanel from './pages/AdminPanel';

export default function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
                    <Navbar />
                    <Routes>
                        {/* Public */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* Protected */}
                        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                        <Route path="/assessment" element={<ProtectedRoute><Assessment /></ProtectedRoute>} />
                        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                        <Route path="/stressors" element={<ProtectedRoute><Stressors /></ProtectedRoute>} />
                        <Route path="/resources" element={<ProtectedRoute><Resources /></ProtectedRoute>} />
                        <Route path="/recommendations" element={<ProtectedRoute><Recommendations /></ProtectedRoute>} />
                        <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />

                        {/* Default redirect */}
                        <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}
