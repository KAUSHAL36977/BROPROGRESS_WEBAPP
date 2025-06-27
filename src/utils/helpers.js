import { differenceInCalendarDays } from 'date-fns';

// Calculate user progress and stats
export const calculateUserStats = (activities, achievements) => {
  const totalPoints = achievements.reduce((sum, ach) => sum + (ach.points || 0), 0);
  const level = Math.floor(totalPoints / 50) + 1;
  const daysActive = new Set(activities.map(a => a.date.split('T')[0])).size;
  const avgImpact = activities.length > 0 
    ? (activities.reduce((sum, a) => sum + a.impact_score, 0) / activities.length).toFixed(1)
    : 0;

  return {
    totalPoints,
    level,
    daysActive,
    avgImpact
  };
};

// Calculate category averages for radar chart
export const calculateCategoryStats = (activities) => {
  const categories = ['fitness', 'mindset', 'social', 'career', 'skills', 'lifestyle'];
  const stats = {};
  
  categories.forEach(category => {
    const categoryActivities = activities.filter(a => a.category === category);
    if (categoryActivities.length > 0) {
      const avgScore = categoryActivities.reduce((sum, a) => sum + a.impact_score, 0) / categoryActivities.length;
      stats[category] = Math.round(avgScore * 10) / 10;
    } else {
      stats[category] = 0;
    }
  });
  
  return stats;
};

// Calculate streak
export const calculateStreak = (activities, lastActivityDate) => {
  if (!activities.length) return 0;
  
  const sortedActivities = activities
    .map(a => a.date)
    .sort((a, b) => new Date(b) - new Date(a));
  
  let streak = 0;
  let currentDate = new Date();
  
  for (let i = 0; i < sortedActivities.length; i++) {
    const activityDate = new Date(sortedActivities[i]);
    const diff = differenceInCalendarDays(currentDate, activityDate);
    
    if (diff === 0) {
      streak++;
      currentDate = activityDate;
    } else if (diff === 1) {
      streak++;
      currentDate = activityDate;
    } else {
      break;
    }
  }
  
  return streak;
};

// Check and award achievements
export const checkAchievements = (activities, existingAchievements) => {
  const newAchievements = [];
  const existingBadgeIcons = existingAchievements.map(a => a.badge_icon);
  
  const achievementDefinitions = [
    { 
      badge: 'first-activity', 
      condition: () => activities.length >= 1, 
      points: 10, 
      title: 'FIRST STEPS', 
      desc: 'Logged your first activity!',
      category: 'milestone'
    },
    { 
      badge: 'week-warrior', 
      condition: () => activities.length >= 5, 
      points: 25, 
      title: 'WEEK WARRIOR', 
      desc: '5 activities logged!',
      category: 'milestone'
    },
    { 
      badge: 'month-master', 
      condition: () => activities.length >= 20, 
      points: 100, 
      title: 'MONTH MASTER', 
      desc: '20 activities logged!',
      category: 'milestone'
    },
    { 
      badge: 'fitness-freak', 
      condition: () => activities.filter(a => a.category === 'fitness').length >= 10, 
      points: 75, 
      title: 'FITNESS FREAK', 
      desc: '10 fitness activities completed!',
      category: 'improvement'
    },
    { 
      badge: 'mindset-master', 
      condition: () => activities.filter(a => a.category === 'mindset').length >= 5, 
      points: 50, 
      title: 'MIND MASTER', 
      desc: '5 mindset activities completed!',
      category: 'improvement'
    },
    { 
      badge: 'social-butterfly', 
      condition: () => activities.filter(a => a.category === 'social').length >= 5, 
      points: 50, 
      title: 'SOCIAL BUTTERFLY', 
      desc: '5 social activities completed!',
      category: 'social'
    }
  ];
  
  achievementDefinitions.forEach(def => {
    if (!existingBadgeIcons.includes(def.badge) && def.condition()) {
      newAchievements.push({
        title: def.title,
        description: def.desc,
        category: def.category,
        badge_icon: def.badge,
        points: def.points
      });
    }
  });

  return newAchievements;
};

// Format date for display
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Get category emoji and color
export const getCategoryInfo = (category) => {
  const categories = {
    fitness: { emoji: '💪', color: 'bg-red-500', label: 'FITNESS' },
    mindset: { emoji: '🧠', color: 'bg-blue-500', label: 'MINDSET' },
    social: { emoji: '🤝', color: 'bg-green-500', label: 'SOCIAL' },
    career: { emoji: '💼', color: 'bg-purple-500', label: 'CAREER' },
    skills: { emoji: '🎯', color: 'bg-orange-500', label: 'SKILLS' },
    lifestyle: { emoji: '🌟', color: 'bg-pink-500', label: 'LIFESTYLE' }
  };
  
  return categories[category] || { emoji: '📝', color: 'bg-gray-500', label: 'OTHER' };
};

// Validate activity data
export const validateActivity = (activity) => {
  const errors = [];
  
  if (!activity.title || activity.title.trim().length === 0) {
    errors.push('Activity title is required');
  }
  
  if (!activity.category) {
    errors.push('Category is required');
  }
  
  if (!activity.impact_score || activity.impact_score < 1 || activity.impact_score > 10) {
    errors.push('Impact score must be between 1 and 10');
  }
  
  if (!activity.date) {
    errors.push('Date is required');
  }
  
  return errors;
};

// Debounce function for search
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Filter activities
export const filterActivities = (activities, filters) => {
  return activities.filter(activity => {
    // Category filter
    if (filters.category && filters.category !== 'all' && activity.category !== filters.category) {
      return false;
    }
    
    // Date range filter
    if (filters.startDate && new Date(activity.date) < new Date(filters.startDate)) {
      return false;
    }
    
    if (filters.endDate && new Date(activity.date) > new Date(filters.endDate)) {
      return false;
    }
    
    // Search filter
    if (filters.search && !activity.title.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    return true;
  });
};

// Sort activities
export const sortActivities = (activities, sortBy = 'date', sortOrder = 'desc') => {
  return [...activities].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'date':
        aValue = new Date(a.date);
        bValue = new Date(b.date);
        break;
      case 'impact_score':
        aValue = a.impact_score;
        bValue = b.impact_score;
        break;
      case 'title':
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case 'category':
        aValue = a.category;
        bValue = b.category;
        break;
      default:
        aValue = new Date(a.date);
        bValue = new Date(b.date);
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
}; 