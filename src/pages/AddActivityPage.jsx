import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, ArrowLeft } from "lucide-react";
import { differenceInCalendarDays } from 'date-fns';
import dataService from "../services/dataService";
import { validateActivity, checkAchievements } from "../utils/helpers";

const CATEGORIES = [
  { key: 'fitness', label: 'FITNESS', emoji: '💪', color: 'bg-red-500' },
  { key: 'mindset', label: 'MINDSET', emoji: '🧠', color: 'bg-blue-500' },
  { key: 'social', label: 'SOCIAL', emoji: '🤝', color: 'bg-green-500' },
  { key: 'career', label: 'CAREER', emoji: '💼', color: 'bg-purple-500' },
  { key: 'skills', label: 'SKILLS', emoji: '🎯', color: 'bg-orange-500' },
  { key: 'lifestyle', label: 'LIFESTYLE', emoji: '🌟', color: 'bg-pink-500' }
];

const AddActivityPage = ({ user, activities, updateUser, updateActivities, updateAchievements }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    impact_score: 5,
    notes: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState([]);

  const updateUserProgress = async (newActivity) => {
    try {
      // 1. Award Achievements
      const newAchievements = checkAchievements([...activities, newActivity], dataService.getAchievements());
      if (newAchievements.length > 0) {
        newAchievements.forEach(achievement => {
          dataService.addAchievement(achievement);
        });
        updateAchievements(dataService.getAchievements());
      }

      // 2. Recalculate Points & Level
      const allAchievements = dataService.getAchievements();
      const totalPoints = allAchievements.reduce((sum, ach) => sum + ach.points, 0);
      const level = Math.floor(totalPoints / 50) + 1;
      
      // 3. Calculate Streak
      let current_streak = user.current_streak || 0;
      let longest_streak = user.longest_streak || 0;
      const last_activity_date = newActivity.date;

      if (user.last_activity_date) {
        const diff = differenceInCalendarDays(new Date(last_activity_date), new Date(user.last_activity_date));
        if (diff === 1) {
          current_streak += 1;
        } else if (diff > 1) {
          current_streak = 1; // Reset streak
        }
        // if diff is 0, do nothing to the streak
      } else {
        current_streak = 1;
      }
      
      if (current_streak > longest_streak) {
        longest_streak = current_streak;
      }

      // 4. Update User
      const updatedUser = dataService.updateUser({
        total_points: totalPoints,
        level: level,
        current_streak,
        longest_streak,
        last_activity_date
      });
      
      if (updatedUser) {
        updateUser(updatedUser);
      }
    } catch (error) {
      console.error('Error updating user progress:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateActivity(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors([]);
    
    try {
      const newActivityData = {
        ...formData,
        impact_score: parseInt(formData.impact_score)
      };
      
      // Add activity
      const newActivity = dataService.addActivity(newActivityData);
      updateActivities(dataService.getActivities());
      
      // Update user progress
      await updateUserProgress(newActivity);
      
      // Navigate to dashboard
      navigate("/");
    } catch (error) {
      console.error('Error creating activity:', error);
      setErrors(['Failed to create activity. Please try again.']);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-6 space-y-6 fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/")}
          className="neo-button bg-gray-200 dark:bg-gray-800 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 p-3"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-3xl font-black uppercase tracking-tight">
          ADD ACTIVITY
        </h1>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="neo-brutalist bg-red-500 text-white p-4">
          <h3 className="font-black uppercase mb-2">ERRORS</h3>
          <ul className="list-disc list-inside">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="neo-card">
          <label className="block text-sm font-black uppercase mb-2">
            ACTIVITY TITLE
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            placeholder="What did you do?"
            className="neo-input w-full text-lg font-bold"
            required
          />
        </div>

        {/* Category Selection */}
        <div className="neo-card">
          <label className="block text-sm font-black uppercase mb-4">
            CATEGORY
          </label>
          <div className="grid grid-cols-2 gap-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => setFormData({...formData, category: cat.key})}
                className={`neo-brutalist p-4 text-left transition-all ${
                  formData.category === cat.key
                    ? `${cat.color} text-white`
                    : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <div className="text-2xl mb-1">{cat.emoji}</div>
                <div className="font-black text-sm">{cat.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Impact Score */}
        <div className="neo-card">
          <label className="block text-sm font-black uppercase mb-4">
            IMPACT SCORE (1-10)
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="1"
              max="10"
              value={formData.impact_score}
              onChange={(e) => setFormData({...formData, impact_score: e.target.value})}
              className="flex-1 h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <div className="neo-brutalist bg-blue-500 text-white px-4 py-2 text-xl font-black min-w-[60px] text-center">
              {formData.impact_score}
            </div>
          </div>
        </div>

        {/* Date */}
        <div className="neo-card">
          <label className="block text-sm font-black uppercase mb-2">
            DATE
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
            className="neo-input w-full"
            required
          />
        </div>

        {/* Notes */}
        <div className="neo-card">
          <label className="block text-sm font-black uppercase mb-2">
            NOTES (OPTIONAL)
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            placeholder="Any additional details..."
            className="neo-input w-full h-24 resize-none"
            rows="4"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="neo-button bg-green-500 text-black hover:bg-green-600 w-full py-4 text-lg disabled:opacity-50"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="spinner w-6 h-6 mr-2"></div>
              SAVING...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <Save className="w-5 h-5 mr-2" />
              SAVE ACTIVITY
            </div>
          )}
        </button>
      </form>
    </div>
  );
};

export default AddActivityPage;