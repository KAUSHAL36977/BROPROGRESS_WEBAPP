import React from 'react';
import AnalyticsView from '../components/Progress/AnalyticsView';
import AchievementsView from '../components/Progress/AchievementsView';
import ChallengesView from '../components/Progress/ChallengesView';
import { LineChart, Trophy, Goal } from 'lucide-react';

const ProgressPage = ({ activities, achievements, challenges }) => {
    return (
        <div className="py-6 fade-in">
            <h1 className="text-4xl font-black uppercase tracking-tight text-center mb-8">
                PROGRESS HUB
            </h1>

            <div className="space-y-6">
                {/* Analytics Section */}
                <div className="neo-card">
                    <div className="flex items-center gap-2 mb-4">
                        <LineChart className="w-6 h-6 text-blue-500" />
                        <h2 className="text-2xl font-black uppercase">ANALYTICS</h2>
                    </div>
                    <AnalyticsView activities={activities} />
                </div>

                {/* Achievements Section */}
                <div className="neo-card">
                    <div className="flex items-center gap-2 mb-4">
                        <Trophy className="w-6 h-6 text-green-500" />
                        <h2 className="text-2xl font-black uppercase">ACHIEVEMENTS</h2>
                    </div>
                    <AchievementsView activities={activities} achievements={achievements} />
                </div>

                {/* Challenges Section */}
                <div className="neo-card">
                    <div className="flex items-center gap-2 mb-4">
                        <Goal className="w-6 h-6 text-pink-500" />
                        <h2 className="text-2xl font-black uppercase">CHALLENGES</h2>
                    </div>
                    <ChallengesView activities={activities} challenges={challenges} />
                </div>
            </div>
        </div>
    );
};

export default ProgressPage;