import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnalyticsView from '../components/progress/AnalyticsView';
import AchievementsView from '../components/progress/AchievementsView';
import ChallengesView from '../components/progress/ChallengesView';
import { LineChart, Trophy, Goal } from 'lucide-react';

export default function ProgressPage() {
    return (
        <div className="py-6">
            <h1 className="text-4xl font-black uppercase tracking-tight text-center mb-8">
                PROGRESS HUB
            </h1>

            <Tabs defaultValue="analytics" className="w-full">
                <TabsList className="grid w-full grid-cols-3 neo-brutalist bg-gray-100 dark:bg-gray-800 p-1 h-auto">
                    <TabsTrigger value="analytics" className="py-3 font-black uppercase text-xs sm:text-sm data-[state=active]:bg-blue-500 data-[state=active]:text-white dark:data-[state=active]:text-black">
                        <LineChart className="w-4 h-4 mr-2" />
                        Analytics
                    </TabsTrigger>
                    <TabsTrigger value="achievements" className="py-3 font-black uppercase text-xs sm:text-sm data-[state=active]:bg-green-500 data-[state=active]:text-black">
                        <Trophy className="w-4 h-4 mr-2" />
                        Achievements
                    </TabsTrigger>
                    <TabsTrigger value="challenges" className="py-3 font-black uppercase text-xs sm:text-sm data-[state=active]:bg-pink-500 data-[state=active]:text-white dark:data-[state=active]:text-black">
                        <Goal className="w-4 h-4 mr-2" />
                        Challenges
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="analytics" className="mt-6">
                    <AnalyticsView />
                </TabsContent>
                <TabsContent value="achievements" className="mt-6">
                    <AchievementsView />
                </TabsContent>
                <TabsContent value="challenges" className="mt-6">
                    <ChallengesView />
                </TabsContent>
            </Tabs>
        </div>
    );
}