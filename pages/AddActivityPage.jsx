import React, { useState } from "react";
import { Activity, Achievement, User } from "@/entities/all";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, ArrowLeft } from "lucide-react";
import { differenceInCalendarDays } from 'date-fns';

const CATEGORIES = [
  { key: 'fitness', label: 'FITNESS', emoji: '💪', color: 'bg-red-500' },
  { key: 'mindset', label: 'MINDSET', emoji: '🧠', color: 'bg-blue-500' },
  { key: 'social', label: 'SOCIAL', emoji: '🤝', color: 'bg-green-500' },
  { key: 'career', label: 'CAREER', emoji: '💼', color: 'bg-purple-500' },
  { key: 'skills', label: 'SKILLS', emoji: '🎯', color: 'bg-orange-500' },
  { key: 'lifestyle', label: 'LIFESTYLE', emoji: '🌟', color: 'bg-pink-500' }
];

const checkAndAwardAchievements = async (activities, existingAchievements) => {
  const newAchievements = [];
  const existingBadgeIcons = existingAchievements.map(a => a.badge_icon);
  
  const achievementDefinitions = [
    { badge: 'first-activity', condition: () => activities.length >= 1, points: 10, title: 'FIRST STEPS', desc: 'Logged your first activity!' },
    { badge: 'week-warrior', condition: () => activities.length >= 5, points: 25, title: 'WEEK WARRIOR', desc: '5 activities logged!' },
    { badge: 'month-master', condition: () => activities.length >= 20, points: 100, title: 'MONTH MASTER', desc: '20 activities logged!' },
  ];
  
  achievementDefinitions.forEach(def => {
    if (!existingBadgeIcons.includes(def.badge) && def.condition()) {
      newAchievements.push({
        title: def.title,
        description: def.desc,
        category: 'milestone',
        badge_icon: def.badge,
        earned_date: new Date().toISOString(),
        points: def.points
      });
    }
  });

  if (newAchievements.length > 0) {
    await Achievement.bulkCreate(newAchievements);
  }
};

const updateUserProgress = async (newActivity) => {
  const user = await User.me();
  const activities = await Activity.list();
  const achievements = await Achievement.list();

  // 1. Award Achievements
  await checkAndAwardAchievements(activities, achievements);

  // 2. Recalculate Points & Level
  const allAchievements = await Achievement.list();
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
  await User.updateMyUserData({
    total_points: totalPoints,
    level: level,
    current_streak,
    longest_streak,
    last_activity_date
  });
};

export default function AddActivity() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    impact_score: 5,
    notes: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.category) return;

    setIsSubmitting(true);
    try {
      const newActivityData = {
        ...formData,
        impact_score: parseInt(formData.impact_score)
      };
      await Activity.create(newActivityData);
      await updateUserProgress(newActivityData);
      navigate(createPageUrl("Dashboard"));
    } catch (error) {
      console.error('Error creating activity:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          onClick={() => navigate(createPageUrl("Dashboard"))}
          className="neo-brutalist bg-gray-200 dark:bg-gray-800 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 p-3"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-3xl font-black uppercase tracking-tight">
          ADD ACTIVITY
        </h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="neo-brutalist bg-white dark:bg-black p-6">
          <label className="block text-sm font-black uppercase mb-2">
            ACTIVITY TITLE
          </label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            placeholder="What did you do?"
            className="neo-brutalist text-lg font-bold"
            required
          />
        </div>

        {/* Category Selection */}
        <div className="neo-brutalist bg-white dark:bg-black p-6">
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
        <div className="neo-brutalist bg-white dark:bg-black p-6">
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
        <div className="neo-brutalist bg-white dark:bg-black p-6">
          <label className="block text-sm font-black uppercase mb-2">
            DATE
          </label>
          <Input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
            className="neo-brutalist"
          />
        </div>

        {/* Notes */}
        <div className="neo-brutalist bg-white dark:bg-black p-6">
          <label className="block text-sm font-black uppercase mb-2">
            NOTES (OPTIONAL)
          </label>
          <Textarea
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            placeholder="Any additional details..."
            className="neo-brutalist resize-none"
            rows="3"
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={!formData.title || !formData.category || isSubmitting}
          className="neo-brutalist bg-green-500 text-black hover:bg-green-600 w-full py-4 text-lg font-black uppercase"
        >
          <Save className="w-6 h-6 mr-2" />
          {isSubmitting ? 'SAVING...' : 'SAVE ACTIVITY'}
        </Button>
      </form>
    </div>
  );
}