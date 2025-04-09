import React from 'react';
import { Users, ShieldCheck, GraduationCap } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { NumberTicker } from "@/components/magicui/number-ticker";

const Overview = () => {
  const teamMetrics = {
    members: 500,
    coreMembers: 21,
    alumni: 5,
  };

  const teamCards = [
    {
      icon: <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
      title: "Total Members",
      value: teamMetrics.members,
      description: "All active members",
      lightBg: "bg-blue-100",
      darkBg: "bg-blue-900/20",
      lightText: "text-blue-800",
      darkText: "text-blue-300"
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-green-600 dark:text-green-400" />,
      title: "Core Members",
      value: teamMetrics.coreMembers,
      description: "Leadership and key contributors",
      lightBg: "bg-green-100",
      darkBg: "bg-green-900/20",
      lightText: "text-green-800",
      darkText: "text-green-300"
    },
    {
      icon: <GraduationCap className="h-6 w-6 text-purple-600 dark:text-purple-400" />,
      title: "Alumni",
      value: teamMetrics.alumni,
      description: "Previous contributors",
      lightBg: "bg-purple-100",
      darkBg: "bg-purple-900/20",
      lightText: "text-purple-800",
      darkText: "text-purple-300"
    }
  ];

  return (
    <div className="w-full">
      <Card className="w-full bg-white bg-dark border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-white text-center">
            Team Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamCards.map((stat, index) => (
              <Card
                key={index}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md rounded-lg p-5 flex flex-col items-center text-center"
              >
                <div className="p-3 rounded-full shadow-md" style={{ backgroundColor: stat.lightBg }}>
                  {stat.icon}
                </div>
                <CardHeader className="pt-3 pb-1">
                  <CardTitle className="text-lg font-medium text-gray-600 dark:text-gray-300">
                    {stat.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    <NumberTicker
                      value={stat.value}
                      className="whitespace-pre-wrap text-3xl font-medium tracking-tight text-black dark:text-white"
                    />+
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Overview;