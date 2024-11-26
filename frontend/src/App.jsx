import React from 'react';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './components/Login';
import Logout from './components/Logout';
import Dashboard from './components/Dashboard';
import VideoDetail from './components/videoDetail';
import AdminVideos from './components/AdminVideos'; 
import History from './components/History';
// import VoiceCommand from './components/VoiceCommand'; // Import your VoiceCommand component
// import { VoiceProvider } from './context/VoiceContext'; // Import the VoiceProvider

const App = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    // <VoiceProvider> {/* Wrap the Router with VoiceProvider */}
      <Router>
        <Routes>
          {!user ? (
            <>
              <Route path="/" element={<Login />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          ) : (
            <>
              <Route 
                path="/dashboard" 
                element={
                  <>
                    <Dashboard />
                    {/* <VoiceCommand /> VoiceCommand as part of dashboard layout */}
                  </>
                } 
              />
              <Route 
                path="/logout" 
                element={
                  <>
                    <Logout />
                    {/* <VoiceCommand /> VoiceCommand as part of logout layout */}
                  </>
                } 
              />
              <Route 
                path="/video/:videoId" 
                element={
                  <>
                    <VideoDetail />
                    {/* <VoiceCommand /> VoiceCommand as part of video detail layout */}
                  </>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <>
                    <AdminVideos />
                    {/* <VoiceCommand /> VoiceCommand as part of admin layout */}
                  </>
                } 
              />
              <Route 
                path="/history" 
                element={
                  <>
                    <History />
                    {/* <VoiceCommand /> VoiceCommand as part of history layout */}
                  </>
                } 
              />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </>
          )}
        </Routes>
      </Router>
    // </VoiceProvider>
  );
};

export default App;
