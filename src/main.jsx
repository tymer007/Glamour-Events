import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import Home from './pages/Home.jsx'
import { SignUp, SignIn, EmailVerification, UserProfile, EventCreation, EventReview } from './pages/forms'
import AdminDashboard from './pages/AdminDashboard.jsx'
import EventStats from './pages/EventStats.jsx'
import UpcomingEvent from './pages/UpcomingEvent.jsx'
import ProtectedRoute from './components/ProtectedRoute'
import { ToastProvider } from './contexts/ToastContext'
import ToastContainer from './components/ToastContainer'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/verify-email" element={<EmailVerification />} />
          
          {/* Protected Routes */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/create-event" 
            element={
              <ProtectedRoute>
                <EventCreation />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/events/:eventId/review" 
            element={
              <ProtectedRoute>
                <EventReview />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/events/:eventId/stats" 
            element={<EventStats />} 
          />
          <Route 
            path="/events/:eventId" 
            element={<UpcomingEvent />} 
          />
          
          {/* Catch all route - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <ToastContainer />
      </Router>
    </ToastProvider>
  </StrictMode>,
)
