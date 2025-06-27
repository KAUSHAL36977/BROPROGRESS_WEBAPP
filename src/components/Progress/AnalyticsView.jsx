import React, { useState, useEffect } from 'react';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const DIMENSIONS = [
  { key: 'fitness', label: 'Fitness', color: '#FF0066' },
  { key: 'mindset', label: 'Mindset', color: '#0066FF' },
  { key: 'social', label: 'Social', color: '#00FF66' },
  { key: 'career', label: 'Career', color: '#FF6600' },
  { key: 'skills', label: 'Skills', color: '#6600FF' },
  { key: 'lifestyle', label: 'Lifestyle', color: '#FFFF00' }
];

const AnalyticsView = ({ activities }) => {
  const [weeklyData, setWeeklyData] = useState([]);
  const [pieData, setPieData] = useState([]);

  useEffect(() => {
    if (activities) {
      processWeeklyData(activities);
      processPieData(activities);
    }
  }, [activities]);

  const processWeeklyData = (data) => {
    const today = new Date();
    const last4Weeks = Array.from({ length: 4 }).map((_, i) => {
      const date = new Date();
      date.setDate(today.getDate() - i * 7);
      return {
        start: startOfWeek(date, { weekStartsOn: 1 }),
        end: endOfWeek(date, { weekStartsOn: 1 })
      };
    }).reverse();

    const processedData = last4Weeks.map(week => {
      const weekLabel = `${format(week.start, 'MMM d')}`;
      const weekActivities = data.filter(a => {
        const activityDate = new Date(a.date);
        return activityDate >= week.start && activityDate <= week.end;
      });

      const weeklyStats = { name: weekLabel };
      DIMENSIONS.forEach(dim => {
        const dimActivities = weekActivities.filter(a => a.category === dim.key);
        weeklyStats[dim.key] = dimActivities.length > 0
          ? dimActivities.reduce((sum, a) => sum + a.impact_score, 0)
          : 0;
      });
      return weeklyStats;
    });
    setWeeklyData(processedData);
  };
  
  const processPieData = (data) => {
    const categoryCounts = {};
    data.forEach(activity => {
      categoryCounts[activity.category] = (categoryCounts[activity.category] || 0) + 1;
    });
    
    const pieChartData = DIMENSIONS.map(dim => ({
      name: dim.label,
      value: categoryCounts[dim.key] || 0,
      color: dim.color,
    })).filter(item => item.value > 0);
    setPieData(pieChartData);
  };

  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-6xl mb-4">📊</div>
        <div className="text-xl font-bold mb-2">NO DATA TO ANALYZE</div>
        <div className="text-gray-600 dark:text-gray-400">
          Start logging activities to see your analytics!
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Activity Distribution */}
      <div>
        <h3 className="text-xl font-black uppercase mb-4">
          ACTIVITY DISTRIBUTION
        </h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie 
                data={pieData} 
                dataKey="value" 
                nameKey="name" 
                cx="50%" 
                cy="50%" 
                outerRadius={100} 
                label={({ name, value }) => `${name}: ${value}`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0,0,0,0.8)', 
                  borderColor: '#fff',
                  color: '#fff',
                  fontWeight: 'bold'
                }}
              />
              <Legend wrapperStyle={{ fontWeight: 'bold' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Weekly Impact Score */}
      <div>
        <h3 className="text-xl font-black uppercase mb-4">
          WEEKLY IMPACT SCORE
        </h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
              <XAxis 
                dataKey="name" 
                tick={{ fill: 'currentColor', fontWeight: 'bold' }} 
              />
              <YAxis tick={{ fill: 'currentColor' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  borderColor: '#fff',
                  color: '#fff',
                  fontWeight: 'bold'
                }}
                cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
              />
              <Legend wrapperStyle={{ fontWeight: 'bold' }} />
              {DIMENSIONS.map(dim => (
                <Bar 
                  key={dim.key} 
                  dataKey={dim.key} 
                  stackId="a" 
                  fill={dim.color} 
                  name={dim.label} 
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="neo-brutalist bg-blue-500 text-white p-4 text-center">
          <div className="text-2xl font-black">{activities.length}</div>
          <div className="text-xs uppercase">Total Activities</div>
        </div>
        <div className="neo-brutalist bg-green-500 text-black p-4 text-center">
          <div className="text-2xl font-black">
            {(activities.reduce((sum, a) => sum + a.impact_score, 0) / activities.length).toFixed(1)}
          </div>
          <div className="text-xs uppercase">Avg Impact</div>
        </div>
        <div className="neo-brutalist bg-purple-500 text-white p-4 text-center">
          <div className="text-2xl font-black">
            {new Set(activities.map(a => a.date.split('T')[0])).size}
          </div>
          <div className="text-xs uppercase">Days Active</div>
        </div>
        <div className="neo-brutalist bg-orange-500 text-black p-4 text-center">
          <div className="text-2xl font-black">
            {Math.max(...activities.map(a => a.impact_score))}
          </div>
          <div className="text-xs uppercase">Best Score</div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;