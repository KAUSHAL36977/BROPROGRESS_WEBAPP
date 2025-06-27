import React from 'react';
import { Calendar, CheckCircle, Flag } from 'lucide-react';

const ChallengesView = ({ activities, challenges }) => {
  const getChallengeProgress = (challenge) => {
    if (!activities) return { progress: 0, percentage: 0, isCompleted: false };
    
    const relevantActivities = activities.filter(activity => {
      const activityDate = new Date(activity.date);
      const startDate = new Date(challenge.start_date);
      const endDate = new Date(challenge.end_date);
      
      const isWithinDate = activityDate >= startDate && activityDate <= endDate;
      const matchesDimension = challenge.dimension === 'any' || challenge.dimension === activity.category;
      
      return isWithinDate && matchesDimension;
    });

    const progress = relevantActivities.length;
    const percentage = Math.min(100, (progress / challenge.goal) * 100);
    
    return { progress, percentage, isCompleted: progress >= challenge.goal };
  };

  if (!challenges || challenges.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-6xl mb-4">🎯</div>
        <div className="text-xl font-bold mb-2">NO CHALLENGES AVAILABLE</div>
        <div className="text-gray-600 dark:text-gray-400">
          Challenges will appear here as you progress!
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {challenges.map(challenge => {
        const { progress, percentage, isCompleted } = getChallengeProgress(challenge);
        return (
          <div key={challenge.id} className={`neo-brutalist p-6 ${isCompleted ? 'bg-green-100 dark:bg-green-900' : 'bg-white dark:bg-black'}`}>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-black uppercase">{challenge.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-2">{challenge.description}</p>
              </div>
              {isCompleted && <CheckCircle className="w-8 h-8 text-green-500" />}
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-500 my-4">
              <Calendar className="w-4 h-4" />
              <span>{new Date(challenge.start_date).toLocaleDateString()} - {new Date(challenge.end_date).toLocaleDateString()}</span>
              <span className="font-black mx-2">|</span>
              <Flag className="w-4 h-4" />
              <span>GOAL: {challenge.goal} {challenge.unit}</span>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-bold">Progress</span>
                <span className="text-sm font-bold">{progress} / {challenge.goal}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 border-2 border-black dark:border-white">
                <div 
                  className="bg-blue-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>

            <div className="mt-4">
              <span className="neo-brutalist bg-yellow-500 text-black px-2 py-1 font-bold">
                REWARD: +{challenge.reward_points} PTS
              </span>
            </div>
          </div>
        );
      })}

      {/* Challenge Stats */}
      <div className="neo-card">
        <h3 className="text-xl font-black uppercase mb-4">CHALLENGE STATS</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="neo-brutalist bg-blue-500 text-white p-4 text-center">
            <div className="text-2xl font-black">
              {challenges.filter(c => getChallengeProgress(c).isCompleted).length}
            </div>
            <div className="text-xs uppercase">Completed</div>
          </div>
          <div className="neo-brutalist bg-green-500 text-black p-4 text-center">
            <div className="text-2xl font-black">
              {challenges.filter(c => !getChallengeProgress(c).isCompleted).length}
            </div>
            <div className="text-xs uppercase">Active</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengesView;