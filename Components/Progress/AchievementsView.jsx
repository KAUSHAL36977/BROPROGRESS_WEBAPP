import React, { useState, useEffect } from "react";
import { Achievement, Activity, User } from "@/entities/all";
import { Trophy, Award, Star, Target, Zap } from "lucide-react";

const BADGE_ICONS = {
  'first-activity': Trophy,
  'week-warrior': Star,
  'month-master': Award,
  'fitness-freak': Target,
  'social-butterfly': Zap,
  'skill-builder': Trophy,
  'career-climber': Award,
  'lifestyle-legend': Star,
  'mindset-master': Target
};

export default function AchievementsView() {
  const [achievements, setAchievements] = useState([]);
  const [activities, setActivities] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const achievementsData = await Achievement.list('-earned_date');
    const activitiesData = await Activity.list();
    const userData = await User.me();
    
    setAchievements(achievementsData);
    setActivities(activitiesData);
    setUser(userData);
  };

  const getBadgeIcon = (iconName) => {
    return BADGE_ICONS[iconName] || Trophy;
  };

  const getCategoryColor = (category) => {
    const colors = {
      milestone: 'bg-yellow-500',
      consistency: 'bg-blue-500',
      improvement: 'bg-green-500',
      social: 'bg-purple-500',
      special: 'bg-pink-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  return (
    <div className="space-y-6">
      {/* Achievement Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="neo-brutalist bg-blue-500 text-white p-4 text-center">
          <div className="text-2xl font-black">{achievements.length}</div>
          <div className="text-xs uppercase">EARNED</div>
        </div>
        <div className="neo-brutalist bg-green-500 text-black p-4 text-center">
          <div className="text-2xl font-black">{activities.length}</div>
          <div className="text-xs uppercase">ACTIVITIES</div>
        </div>
        <div className="neo-brutalist bg-pink-500 text-white p-4 text-center">
          <div className="text-2xl font-black">
            {user?.level || 1}
          </div>
          <div className="text-xs uppercase">LEVEL</div>
        </div>
      </div>

      {/* Achievements List */}
      <div className="space-y-4">
        {achievements.length === 0 ? (
          <div className="neo-brutalist bg-white dark:bg-black p-8 text-center">
            <div className="text-6xl mb-4">🏆</div>
            <div className="text-xl font-bold mb-2">NO ACHIEVEMENTS YET</div>
            <div className="text-gray-600 dark:text-gray-400">
              Start logging activities to earn your first badges!
            </div>
          </div>
        ) : (
          achievements.map((achievement) => {
            const IconComponent = getBadgeIcon(achievement.badge_icon);
            return (
              <div key={achievement.id} className="neo-brutalist bg-white dark:bg-black p-6">
                <div className="flex items-center gap-4">
                  <div className={`neo-brutalist ${getCategoryColor(achievement.category)} text-white p-4`}>
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-black uppercase">
                      {achievement.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      {achievement.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="neo-brutalist bg-yellow-500 text-black px-2 py-1 font-bold">
                        +{achievement.points} PTS
                      </span>
                      <span className="text-gray-500">
                        {new Date(achievement.earned_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}