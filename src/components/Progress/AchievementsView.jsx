import React from "react";
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

const AchievementsView = ({ activities, achievements }) => {
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

  if (!achievements || achievements.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-6xl mb-4">🏆</div>
        <div className="text-xl font-bold mb-2">NO ACHIEVEMENTS YET</div>
        <div className="text-gray-600 dark:text-gray-400">
          Start logging activities to earn your first badges!
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Achievement Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="neo-brutalist bg-blue-500 text-white p-4 text-center">
          <div className="text-2xl font-black">{achievements.length}</div>
          <div className="text-xs uppercase">EARNED</div>
        </div>
        <div className="neo-brutalist bg-green-500 text-black p-4 text-center">
          <div className="text-2xl font-black">{activities?.length || 0}</div>
          <div className="text-xs uppercase">ACTIVITIES</div>
        </div>
        <div className="neo-brutalist bg-pink-500 text-white p-4 text-center">
          <div className="text-2xl font-black">
            {achievements.reduce((sum, ach) => sum + (ach.points || 0), 0)}
          </div>
          <div className="text-xs uppercase">TOTAL PTS</div>
        </div>
      </div>

      {/* Achievements List */}
      <div className="space-y-4">
        {achievements.map((achievement) => {
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
        })}
      </div>

      {/* Achievement Progress */}
      <div className="neo-card">
        <h3 className="text-xl font-black uppercase mb-4">ACHIEVEMENT PROGRESS</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-bold">First Steps</span>
            <span className="neo-brutalist bg-green-500 text-white px-2 py-1 text-sm">
              {activities?.length >= 1 ? 'COMPLETED' : '0/1'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-bold">Week Warrior</span>
            <span className="neo-brutalist bg-green-500 text-white px-2 py-1 text-sm">
              {activities?.length >= 5 ? 'COMPLETED' : `${activities?.length || 0}/5`}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-bold">Month Master</span>
            <span className="neo-brutalist bg-green-500 text-white px-2 py-1 text-sm">
              {activities?.length >= 20 ? 'COMPLETED' : `${activities?.length || 0}/20`}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-bold">Fitness Freak</span>
            <span className="neo-brutalist bg-green-500 text-white px-2 py-1 text-sm">
              {(activities?.filter(a => a.category === 'fitness').length || 0) >= 10 
                ? 'COMPLETED' 
                : `${activities?.filter(a => a.category === 'fitness').length || 0}/10`
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementsView;