import React, { useState, useEffect } from "react";
import { User, Activity, Achievement } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User as UserIcon, Settings, Download, Upload, Trash2 } from "lucide-react";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [activities, setActivities] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [stats, setStats] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ display_name: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await User.me();
      const activitiesData = await Activity.list();
      const achievementsData = await Achievement.list();
      
      setUser(userData);
      setActivities(activitiesData);
      setAchievements(achievementsData);
      setFormData({ display_name: userData.display_name || userData.full_name || 'Bro' });
      
      // Calculate stats
      const totalPoints = achievementsData.reduce((sum, ach) => sum + (ach.points || 0), 0);
      const level = Math.floor(totalPoints / 50) + 1;
      const daysActive = new Set(activitiesData.map(a => a.date.split('T')[0])).size;
      
      setStats({
        totalPoints,
        level,
        daysActive,
        avgImpact: activitiesData.length > 0 
          ? (activitiesData.reduce((sum, a) => sum + a.impact_score, 0) / activitiesData.length).toFixed(1)
          : 0
      });
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleSaveProfile = async () => {
    try {
      await User.updateMyUserData(formData);
      setEditMode(false);
      loadData();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const exportData = () => {
    const data = {
      activities,
      achievements,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bros-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!user) {
    return (
      <div className="py-6">
        <div className="neo-brutalist bg-white dark:bg-black p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <div className="font-bold">LOADING PROFILE...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-black uppercase tracking-tight mb-2">
          PROFILE
        </h1>
      </div>

      {/* User Info */}
      <div className="neo-brutalist bg-white dark:bg-black p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="neo-brutalist bg-blue-500 text-white p-4">
            <UserIcon className="w-8 h-8" />
          </div>
          <div className="flex-1">
            {editMode ? (
              <div className="space-y-2">
                <Input
                  value={formData.display_name}
                  onChange={(e) => setFormData({...formData, display_name: e.target.value})}
                  className="neo-brutalist text-xl font-bold"
                  placeholder="Display name"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleSaveProfile}
                    className="neo-brutalist bg-green-500 text-black hover:bg-green-600 text-sm"
                  >
                    SAVE
                  </Button>
                  <Button
                    onClick={() => setEditMode(false)}
                    className="neo-brutalist bg-gray-500 text-white hover:bg-gray-600 text-sm"
                  >
                    CANCEL
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-black">
                  {formData.display_name}
                </h2>
                <div className="text-gray-600 dark:text-gray-400">
                  {user.email}
                </div>
                <Button
                  onClick={() => setEditMode(true)}
                  className="neo-brutalist bg-gray-200 dark:bg-gray-800 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 mt-2 text-sm"
                >
                  <Settings className="w-4 h-4 mr-1" />
                  EDIT
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Level Display */}
        <div className="neo-brutalist bg-yellow-500 text-black p-4 text-center">
          <div className="text-3xl font-black">LEVEL {stats.level}</div>
          <div className="text-sm">
            {stats.totalPoints % 50}/50 XP to next level
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="neo-brutalist bg-blue-500 text-white p-4 text-center">
          <div className="text-2xl font-black">{activities.length}</div>
          <div className="text-xs uppercase">Activities</div>
        </div>
        <div className="neo-brutalist bg-green-500 text-black p-4 text-center">
          <div className="text-2xl font-black">{achievements.length}</div>
          <div className="text-xs uppercase">Achievements</div>
        </div>
        <div className="neo-brutalist bg-purple-500 text-white p-4 text-center">
          <div className="text-2xl font-black">{stats.daysActive}</div>
          <div className="text-xs uppercase">Days Active</div>
        </div>
        <div className="neo-brutalist bg-orange-500 text-black p-4 text-center">
          <div className="text-2xl font-black">{stats.avgImpact}</div>
          <div className="text-xs uppercase">Avg Impact</div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-4">
        <Button
          onClick={exportData}
          className="neo-brutalist bg-green-500 text-black hover:bg-green-600 w-full py-3"
        >
          <Download className="w-5 h-5 mr-2" />
          EXPORT DATA
        </Button>

        <div className="neo-brutalist bg-red-500 text-white p-6 text-center">
          <div className="font-black text-lg mb-2">DANGER ZONE</div>
          <div className="text-sm mb-4 opacity-90">
            This will permanently delete all your data
          </div>
          <Button
            onClick={async () => {
              if (confirm('Are you sure? This cannot be undone!')) {
                // Note: In a real app, you'd implement data deletion
                alert('Data deletion not implemented in demo');
              }
            }}
            className="neo-brutalist bg-black text-white hover:bg-gray-800"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            DELETE ALL DATA
          </Button>
        </div>
      </div>
    </div>
  );
}