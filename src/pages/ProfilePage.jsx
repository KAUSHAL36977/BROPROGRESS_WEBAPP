import React, { useState, useEffect } from "react";
import { User as UserIcon, Settings, Download, Trash2 } from "lucide-react";
import dataService from "../services/dataService";
import { calculateUserStats } from "../utils/helpers";

const ProfilePage = ({ user, activities, achievements, updateUser }) => {
  const [stats, setStats] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ display_name: '' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user && activities && achievements) {
      const userStats = calculateUserStats(activities, achievements);
      setStats(userStats);
      setFormData({ display_name: user.display_name || user.full_name || 'Bro' });
    }
  }, [user, activities, achievements]);

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      const updatedUser = dataService.updateUser(formData);
      if (updatedUser) {
        updateUser(updatedUser);
        setEditMode(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportData = () => {
    try {
      const data = dataService.exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `bro-progress-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          const success = dataService.importData(data);
          if (success) {
            window.location.reload(); // Refresh to show imported data
          } else {
            alert('Failed to import data. Please check the file format.');
          }
        } catch (error) {
          console.error('Error importing data:', error);
          alert('Invalid file format. Please select a valid backup file.');
        }
      };
      reader.readAsText(file);
    }
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure? This will permanently delete all your data and cannot be undone!')) {
      dataService.clearAllData();
      window.location.reload();
    }
  };

  if (!user) {
    return (
      <div className="py-6">
        <div className="neo-card text-center">
          <div className="spinner mx-auto mb-4"></div>
          <div className="font-bold">LOADING PROFILE...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 space-y-6 fade-in">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-black uppercase tracking-tight mb-2">
          PROFILE
        </h1>
      </div>

      {/* User Info */}
      <div className="neo-card">
        <div className="flex items-center gap-4 mb-6">
          <div className="neo-brutalist bg-blue-500 text-white p-4">
            <UserIcon className="w-8 h-8" />
          </div>
          <div className="flex-1">
            {editMode ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={formData.display_name}
                  onChange={(e) => setFormData({...formData, display_name: e.target.value})}
                  className="neo-input text-xl font-bold"
                  placeholder="Display name"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveProfile}
                    disabled={isLoading}
                    className="neo-button bg-green-500 text-black hover:bg-green-600 text-sm disabled:opacity-50"
                  >
                    {isLoading ? 'SAVING...' : 'SAVE'}
                  </button>
                  <button
                    onClick={() => setEditMode(false)}
                    className="neo-button bg-gray-500 text-white hover:bg-gray-600 text-sm"
                  >
                    CANCEL
                  </button>
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
                <button
                  onClick={() => setEditMode(true)}
                  className="neo-button bg-gray-200 dark:bg-gray-800 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 mt-2 text-sm"
                >
                  <Settings className="w-4 h-4 mr-1" />
                  EDIT
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Level Display */}
        <div className="neo-brutalist bg-yellow-500 text-black p-4 text-center">
          <div className="text-3xl font-black">LEVEL {stats.level || 1}</div>
          <div className="text-sm">
            {stats.totalPoints ? (stats.totalPoints % 50) : 0}/50 XP to next level
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
          <div className="text-2xl font-black">{stats.daysActive || 0}</div>
          <div className="text-xs uppercase">Days Active</div>
        </div>
        <div className="neo-brutalist bg-orange-500 text-black p-4 text-center">
          <div className="text-2xl font-black">{stats.avgImpact || 0}</div>
          <div className="text-xs uppercase">Avg Impact</div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-4">
        <button
          onClick={exportData}
          className="neo-button bg-green-500 text-black hover:bg-green-600 w-full py-3"
        >
          <Download className="w-5 h-5 mr-2" />
          EXPORT DATA
        </button>

        <div className="neo-brutalist bg-blue-500 text-white p-4">
          <label className="block text-sm font-black uppercase mb-2">
            IMPORT DATA
          </label>
          <input
            type="file"
            accept=".json"
            onChange={importData}
            className="block w-full text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white file:text-black hover:file:bg-gray-100"
          />
          <div className="text-xs mt-2 opacity-90">
            Select a backup file to restore your data
          </div>
        </div>

        <div className="neo-brutalist bg-red-500 text-white p-6 text-center">
          <div className="font-black text-lg mb-2">DANGER ZONE</div>
          <div className="text-sm mb-4 opacity-90">
            This will permanently delete all your data
          </div>
          <button
            onClick={clearAllData}
            className="neo-button bg-black text-white hover:bg-gray-800"
          >
            <Trash2 className="w-5 h-5 mr-2" />
            CLEAR ALL DATA
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;