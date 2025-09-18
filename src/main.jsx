import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import Home from './pages/Home.jsx'
import { SignUp, SignIn, EmailVerification, UserProfile, EventCreation, EventReview } from './pages/forms'
import ProtectedRoute from './components/ProtectedRoute'

createRoot(document.getElementById('root')).render(
  <StrictMode>
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
        
        {/* Catch all route - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  </StrictMode>,
)
