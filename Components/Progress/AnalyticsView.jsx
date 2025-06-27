import React, { useState, useEffect } from 'react';
import { Activity } from '@/entities/all';
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

export default function AnalyticsView() {
  const [activities, setActivities] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [pieData, setPieData] = useState([]);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    const allActivities = await Activity.list('-date');
    setActivities(allActivities);
    processWeeklyData(allActivities);
    processPieData(allActivities);
  };

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
  }

  return (
    <div className="space-y-8">
        <div className="neo-brutalist bg-white dark:bg-black p-6">
            <h3 className="text-2xl font-black uppercase mb-4">
              ACTIVITY DISTRIBUTION
            </h3>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: '#fff' }}/>
                        <Legend wrapperStyle={{ fontWeight: 'bold' }} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
        
      <div className="neo-brutalist bg-white dark:bg-black p-6">
        <h3 className="text-2xl font-black uppercase mb-4">
          WEEKLY IMPACT SCORE
        </h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
              <XAxis dataKey="name" tick={{ fill: 'currentColor', fontWeight: 'bold' }} />
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
                <Bar key={dim.key} dataKey={dim.key} stackId="a" fill={dim.color} name={dim.label} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}