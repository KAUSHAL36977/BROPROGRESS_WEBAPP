import React, { useState, useEffect } from 'react';
import { Challenge, Activity } from '@/entities/all';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Calendar, CheckCircle, Flag } from 'lucide-react';

export default function ChallengesView() {
    const [challenges, setChallenges] = useState([]);
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const challengeData = await Challenge.list();
        const activityData = await Activity.list();
        setChallenges(challengeData);
        setActivities(activityData);
    };

    const getChallengeProgress = (challenge) => {
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
                            <Progress value={percentage} className="h-4 border-2 border-black dark:border-white [&>*]:bg-blue-500" />
                        </div>

                        <div className="mt-4">
                            <span className="neo-brutalist bg-yellow-500 text-black px-2 py-1 font-bold">
                                REWARD: +{challenge.reward_points} PTS
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}