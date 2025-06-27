import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './styles/index.css';

// Pages
import DashboardPage from './pages/DashboardPage';
import AddActivityPage from './pages/AddActivityPage';
import ProfilePage from './pages/ProfilePage';
import ProgressPage from './pages/ProgressPage';

// Components
import Navigation from './components/Navigation';
import LoadingSpinner from './components/LoadingSpinner';

// Services
import dataService from './services/dataService';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [activities, setActivities] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Load all data
      const userData = dataService.getUser();
      const activitiesData = dataService.getActivities();
      const achievementsData = dataService.getAchievements();
      const challengesData = dataService.getChallenges();

      setUser(userData);
      setActivities(activitiesData);
      setAchievements(achievementsData);
      setChallenges(challengesData);
    } catch (error) {
      console.error('Error initializing app:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateActivities = (newActivities) => {
    setActivities(newActivities);
  };

  const updateAchievements = (newAchievements) => {
    setAchievements(newAchievements);
  };

  const updateUser = (newUser) => {
    setUser(newUser);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Navigation user={user} />
          
          <main className="mt-4">
            <Routes>
              <Route 
                path="/" 
                element={
                  <DashboardPage 
                    user={user}
                    activities={activities}
                    achievements={achievements}
                    updateUser={updateUser}
                    updateActivities={updateActivities}
                    updateAchievements={updateAchievements}
                  />
                } 
              />
              <Route 
                path="/add-activity" 
                element={
                  <AddActivityPage 
                    user={user}
                    activities={activities}
                    updateUser={updateUser}
                    updateActivities={updateActivities}
                    updateAchievements={updateAchievements}
                  />
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProfilePage 
                    user={user}
                    activities={activities}
                    achievements={achievements}
                    updateUser={updateUser}
                  />
                } 
              />
              <Route 
                path="/progress" 
                element={
                  <ProgressPage 
                    activities={activities}
                    achievements={achievements}
                    challenges={challenges}
                  />
                } 
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App; 