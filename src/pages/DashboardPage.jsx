import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { TrendingUp, Target, Zap, Plus, Flame, BrainCircuit } from "lucide-react";
import RadarChart from "../components/RadarChart";
import dataService from "../services/dataService";
import { calculateCategoryStats, calculateStreak, checkAchievements } from "../utils/helpers";

const DashboardPage = ({ user, activities, achievements, updateUser, updateActivities, updateAchievements }) => {
  const [stats, setStats] = useState({
    fitness: 0,
    mindset: 0,
    social: 0,
    career: 0,
    skills: 0,
    lifestyle: 0
  });
  const [weakestDimension, setWeakestDimension] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, [activities, achievements]);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Calculate category averages from activities
      const categoryStats = calculateCategoryStats(activities);
      setStats(categoryStats);
      
      // Find weakest dimension
      let minScore = 11;
      let weakestDim = null;
      Object.entries(categoryStats).forEach(([category, score]) => {
        if (score < minScore) {
          minScore = score;
          weakestDim = category;
        }
      });
      setWeakestDimension(weakestDim);
      
      // Check for new achievements
      const newAchievements = checkAchievements(activities, achievements);
      if (newAchievements.length > 0) {
        newAchievements.forEach(achievement => {
          dataService.addAchievement(achievement);
        });
        updateAchievements(dataService.getAchievements());
      }
      
      // Update user streak
      const currentStreak = calculateStreak(activities, user?.last_activity_date);
      if (currentStreak !== user?.current_streak) {
        const updatedUser = dataService.updateUser({
          current_streak: currentStreak,
          longest_streak: Math.max(currentStreak, user?.longest_streak || 0)
        });
        if (updatedUser) {
          updateUser(updatedUser);
        }
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [activities, achievements, user, updateUser, updateAchievements]);

  const totalScore = Object.values(stats).reduce((sum, score) => sum + score, 0);
  const overallLevel = user?.level || 1;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-6 fade-in">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-black uppercase tracking-tight mb-2">
          LEVEL {overallLevel} BRO
        </h1>
        <div className="text-2xl font-bold text-blue-500">
          {totalScore.toFixed(1)}/60 TOTAL SCORE
        </div>
      </div>

      {/* Radar Chart */}
      <div className="flex justify-center">
        <div className="neo-brutalist bg-gray-50 dark:bg-gray-900 p-6">
          <RadarChart data={stats} size={320} />
        </div>
      </div>
      
      {/* Personalized Suggestion */}
      {weakestDimension && (
        <div className="neo-brutalist bg-yellow-400 text-black p-4">
          <div className="flex items-center gap-3">
            <BrainCircuit className="w-8 h-8"/>
            <div>
              <h3 className="font-black uppercase">OPPORTUNITY DETECTED</h3>
              <p className="text-sm">Your <span className="font-bold">{weakestDimension.toUpperCase()}</span> dimension is an area for growth. Log an activity to level up!</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="neo-brutalist bg-pink-500 text-white p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-6 h-6" />
            <div className="font-black uppercase text-sm">Activities</div>
          </div>
          <div className="text-3xl font-black">{activities.length}</div>
          <div className="text-sm opacity-90">TOTAL LOGGED</div>
        </div>

        <div className="neo-brutalist bg-green-500 text-black p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-6 h-6" />
            <div className="font-black uppercase text-sm">Achievements</div>
          </div>
          <div className="text-3xl font-black">{achievements.length}</div>
          <div className="text-sm opacity-90">BADGES EARNED</div>
        </div>

        <div className="neo-brutalist bg-orange-500 text-black p-4">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-6 h-6" />
            <div className="font-black uppercase text-sm">STREAK</div>
          </div>
          <div className="text-3xl font-black">{user?.current_streak || 0}</div>
          <div className="text-sm opacity-90">DAYS IN A ROW</div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="neo-brutalist bg-white dark:bg-black p-6">
        <h2 className="text-2xl font-black uppercase mb-4 flex items-center gap-2">
          <Zap className="w-6 h-6 text-yellow-500" />
          RECENT ACTIVITIES
        </h2>
        
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">💪</div>
            <div className="text-xl font-bold mb-2">NO ACTIVITIES YET</div>
            <div className="text-gray-600 dark:text-gray-400 mb-4">
              Start logging your activities to see your progress!
            </div>
            <Link to="/add-activity">
              <button className="neo-button bg-blue-500 text-white hover:bg-blue-600">
                <Plus className="w-5 h-5 mr-2" />
                ADD FIRST ACTIVITY
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {activities.slice(0, 5).map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 border-2 border-black dark:border-white">
                <div>
                  <div className="font-bold">{activity.title}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 uppercase">
                    {activity.category}
                  </div>
                </div>
                <div className="neo-brutalist bg-blue-500 text-white px-3 py-1 text-sm font-black">
                  {activity.impact_score}/10
                </div>
              </div>
            ))}
            
            {activities.length > 5 && (
              <div className="text-center pt-4">
                <div className="text-gray-600 dark:text-gray-400">
                  +{activities.length - 5} more activities
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick Add Button */}
      <div className="fixed bottom-28 md:bottom-24 right-4 z-10">
        <Link to="/add-activity">
          <button className="neo-brutalist bg-green-500 text-black hover:bg-green-600 w-16 h-16 rounded-full">
            <Plus className="w-8 h-8" />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default DashboardPage;