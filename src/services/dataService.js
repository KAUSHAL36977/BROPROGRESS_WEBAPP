// Data Service for localStorage persistence
class DataService {
  constructor() {
    this.storageKeys = {
      activities: 'bro_progress_activities',
      achievements: 'bro_progress_achievements',
      challenges: 'bro_progress_challenges',
      user: 'bro_progress_user',
      settings: 'bro_progress_settings'
    };
    
    this.initializeData();
  }

  // Initialize default data if none exists
  initializeData() {
    if (!this.getActivities().length) {
      this.setActivities([]);
    }
    
    if (!this.getAchievements().length) {
      this.setAchievements([]);
    }
    
    if (!this.getChallenges().length) {
      this.setChallenges(this.getDefaultChallenges());
    }
    
    if (!this.getUser()) {
      this.setUser(this.getDefaultUser());
    }
    
    if (!this.getSettings()) {
      this.setSettings(this.getDefaultSettings());
    }
  }

  // Generate unique ID
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Activity CRUD operations
  getActivities() {
    try {
      const data = localStorage.getItem(this.storageKeys.activities);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading activities:', error);
      return [];
    }
  }

  setActivities(activities) {
    try {
      localStorage.setItem(this.storageKeys.activities, JSON.stringify(activities));
    } catch (error) {
      console.error('Error saving activities:', error);
    }
  }

  addActivity(activity) {
    const activities = this.getActivities();
    const newActivity = {
      ...activity,
      id: this.generateId(),
      created_date: new Date().toISOString(),
      updated_date: new Date().toISOString()
    };
    activities.unshift(newActivity);
    this.setActivities(activities);
    return newActivity;
  }

  updateActivity(id, updates) {
    const activities = this.getActivities();
    const index = activities.findIndex(activity => activity.id === id);
    if (index !== -1) {
      activities[index] = {
        ...activities[index],
        ...updates,
        updated_date: new Date().toISOString()
      };
      this.setActivities(activities);
      return activities[index];
    }
    return null;
  }

  deleteActivity(id) {
    const activities = this.getActivities();
    const filteredActivities = activities.filter(activity => activity.id !== id);
    this.setActivities(filteredActivities);
  }

  // Achievement CRUD operations
  getAchievements() {
    try {
      const data = localStorage.getItem(this.storageKeys.achievements);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading achievements:', error);
      return [];
    }
  }

  setAchievements(achievements) {
    try {
      localStorage.setItem(this.storageKeys.achievements, JSON.stringify(achievements));
    } catch (error) {
      console.error('Error saving achievements:', error);
    }
  }

  addAchievement(achievement) {
    const achievements = this.getAchievements();
    const newAchievement = {
      ...achievement,
      id: this.generateId(),
      earned_date: new Date().toISOString()
    };
    achievements.unshift(newAchievement);
    this.setAchievements(achievements);
    return newAchievement;
  }

  // Challenge CRUD operations
  getChallenges() {
    try {
      const data = localStorage.getItem(this.storageKeys.challenges);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading challenges:', error);
      return [];
    }
  }

  setChallenges(challenges) {
    try {
      localStorage.setItem(this.storageKeys.challenges, JSON.stringify(challenges));
    } catch (error) {
      console.error('Error saving challenges:', error);
    }
  }

  addChallenge(challenge) {
    const challenges = this.getChallenges();
    const newChallenge = {
      ...challenge,
      id: this.generateId(),
      created_date: new Date().toISOString()
    };
    challenges.push(newChallenge);
    this.setChallenges(challenges);
    return newChallenge;
  }

  // User operations
  getUser() {
    try {
      const data = localStorage.getItem(this.storageKeys.user);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error reading user:', error);
      return null;
    }
  }

  setUser(user) {
    try {
      localStorage.setItem(this.storageKeys.user, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user:', error);
    }
  }

  updateUser(updates) {
    const user = this.getUser();
    if (user) {
      const updatedUser = { ...user, ...updates };
      this.setUser(updatedUser);
      return updatedUser;
    }
    return null;
  }

  // Settings operations
  getSettings() {
    try {
      const data = localStorage.getItem(this.storageKeys.settings);
      return data ? JSON.parse(data) : this.getDefaultSettings();
    } catch (error) {
      console.error('Error reading settings:', error);
      return this.getDefaultSettings();
    }
  }

  setSettings(settings) {
    try {
      localStorage.setItem(this.storageKeys.settings, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }

  // Default data
  getDefaultUser() {
    return {
      id: this.generateId(),
      display_name: 'Bro',
      email: 'bro@example.com',
      level: 1,
      total_points: 0,
      current_streak: 0,
      longest_streak: 0,
      last_activity_date: null,
      created_date: new Date().toISOString()
    };
  }

  getDefaultSettings() {
    return {
      theme: 'light',
      notifications: true,
      auto_backup: true,
      language: 'en'
    };
  }

  getDefaultChallenges() {
    return [
      {
        id: this.generateId(),
        title: 'FIRST WEEK WARRIOR',
        description: 'Complete 7 activities in your first week',
        dimension: 'any',
        goal: 7,
        unit: 'activities',
        reward_points: 50,
        badge_icon: 'week-warrior',
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        created_date: new Date().toISOString()
      },
      {
        id: this.generateId(),
        title: 'FITNESS FOUNDATION',
        description: 'Complete 10 fitness activities',
        dimension: 'fitness',
        goal: 10,
        unit: 'activities',
        reward_points: 100,
        badge_icon: 'fitness-freak',
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        created_date: new Date().toISOString()
      },
      {
        id: this.generateId(),
        title: 'MIND MASTER',
        description: 'Complete 5 mindset activities',
        dimension: 'mindset',
        goal: 5,
        unit: 'activities',
        reward_points: 75,
        badge_icon: 'mindset-master',
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        created_date: new Date().toISOString()
      }
    ];
  }

  // Utility methods
  clearAllData() {
    Object.values(this.storageKeys).forEach(key => {
      localStorage.removeItem(key);
    });
  }

  exportData() {
    return {
      activities: this.getActivities(),
      achievements: this.getAchievements(),
      challenges: this.getChallenges(),
      user: this.getUser(),
      settings: this.getSettings(),
      exportDate: new Date().toISOString()
    };
  }

  importData(data) {
    try {
      if (data.activities) this.setActivities(data.activities);
      if (data.achievements) this.setAchievements(data.achievements);
      if (data.challenges) this.setChallenges(data.challenges);
      if (data.user) this.setUser(data.user);
      if (data.settings) this.setSettings(data.settings);
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }
}

// Create singleton instance
const dataService = new DataService();
export default dataService; 