import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import LoginForm from './components/LoginForm';
import Navbar from './components/Navbar';
import RegisterForm from './components/RegisterForm';
import Report from './components/Report'; // NEW
import VideoPlayer from './components/VideoPlayer';

function App() {
  const isAuthenticated = () => {
    return !!localStorage.getItem('token');
  };

  const PrivateRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          
          {/* About Page */}
          <Route path="/about" element={<AboutPage />} />
          
          {/* Videos Page */}
          <Route path="/videos" element={<VideosPage />} />
          
          {/* Notifications Page */}
          <Route path="/notifications" element={
            <PrivateRoute>
              <NotificationsPage />
            </PrivateRoute>
          } />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/video/:id" 
            element={
              <PrivateRoute>
                <VideoPlayer />
              </PrivateRoute>
            } 
          />
          
          {/* NEW: Report Route */}
          <Route 
            path="/report" 
            element={
              <PrivateRoute>
                <Report />
              </PrivateRoute>
            } 
          />
          
          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

// About Page Component
const AboutPage = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      paddingTop: '100px', 
      padding: '100px 2rem 2rem 2rem',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '2rem', color: '#1e293b' }}>About Learnify</h1>
      <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: '#475569', marginBottom: '2rem' }}>
        Learnify is an innovative AI-powered learning platform that helps you learn from YouTube videos 
        through intelligent segmentation, transcription, and interactive quizzes.
      </p>
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#1e293b' }}>Our Features</h2>
      <ul style={{ fontSize: '1.1rem', lineHeight: '2', color: '#475569', marginLeft: '2rem' }}>
        <li>🎥 Add any YouTube video and start learning</li>
        <li>📝 AI-powered video transcription using Gemini API</li>
        <li>✅ Intelligent quizzes based on actual video content</li>
        <li>📊 Track your progress across video segments</li>
        <li>🎯 Pass quizzes (70%+) to unlock next segments</li>
        <li>💬 AI chatbot for doubt clarification</li>
        <li>📈 Comprehensive performance reports</li>
      </ul>
      <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: '#475569', marginTop: '2rem' }}>
        {/* Built with React, Node.js, MongoDB, and Google Gemini AI. */}
      </p>
    </div>
  );
};

// Videos Page Component
const VideosPage = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      paddingTop: '100px', 
      padding: '100px 2rem 2rem 2rem',
      maxWidth: '1200px',
      margin: '0 auto',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '2rem', color: '#1e293b' }}>Video Library</h1>
      <p style={{ fontSize: '1.2rem', color: '#475569', marginBottom: '2rem' }}>
        Please log in to access your video library and start learning!
      </p>
      <button 
        onClick={() => window.location.href = '/login'}
        style={{
          padding: '1rem 2rem',
          fontSize: '1.1rem',
          background: 'linear-gradient(135deg, #4a90e2, #357abd)',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          cursor: 'pointer',
          fontWeight: '600'
        }}
      >
        Go to Login
      </button>
    </div>
  );
};

// Notifications Page Component
const NotificationsPage = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      paddingTop: '100px', 
      padding: '100px 2rem 2rem 2rem',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '2rem', color: '#1e293b' }}>Notifications</h1>
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '16px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <p style={{ fontSize: '1.2rem', color: '#64748b' }}>
          🔔 No new notifications
        </p>
        <p style={{ fontSize: '1rem', color: '#94a3b8', marginTop: '1rem' }}>
          You're all caught up! Keep learning and passing quizzes.
        </p>
      </div>
    </div>
  );
};

export default App;
