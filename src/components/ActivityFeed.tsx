'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface FeedActivity {
  id: string;
  userName: string;
  avatar: string;
  activityName: string;
  emoji: string;
  amountSaved: number;
  actionType: 'tucked' | 'doing' | 'chose' | 'started' | 'stashed';
  timestamp: string;
  minutesAgo: number;
}

// Mock data with realistic names and activities from jomo-activities.ts
const mockActivities: FeedActivity[] = [
  {
    id: '1',
    userName: 'Sarah',
    avatar: 'S',
    activityName: 'Movie marathon night',
    emoji: '🎬',
    amountSaved: 85,
    actionType: 'tucked',
    timestamp: '2m ago',
    minutesAgo: 2,
  },
  {
    id: '2',
    userName: 'Mike',
    avatar: 'M',
    activityName: 'Pizza from scratch',
    emoji: '🍕',
    amountSaved: 127,
    actionType: 'doing',
    timestamp: '5m ago',
    minutesAgo: 5,
  },
  {
    id: '3',
    userName: 'Emma',
    avatar: 'E',
    activityName: 'Game night with roommates',
    emoji: '🎮',
    amountSaved: 150,
    actionType: 'chose',
    timestamp: '8m ago',
    minutesAgo: 8,
  },
  {
    id: '4',
    userName: 'Jake',
    avatar: 'J',
    activityName: 'Home Cocktail Lab',
    emoji: '🍹',
    amountSaved: 120,
    actionType: 'started',
    timestamp: '12m ago',
    minutesAgo: 12,
  },
  {
    id: '5',
    userName: 'Olivia',
    avatar: 'O',
    activityName: 'Spa Night Extravaganza',
    emoji: '🧖',
    amountSaved: 100,
    actionType: 'tucked',
    timestamp: '15m ago',
    minutesAgo: 15,
  },
  {
    id: '6',
    userName: 'Noah',
    avatar: 'N',
    activityName: 'Living Room Karaoke',
    emoji: '🎤',
    amountSaved: 130,
    actionType: 'doing',
    timestamp: '18m ago',
    minutesAgo: 18,
  },
  {
    id: '7',
    userName: 'Ava',
    avatar: 'A',
    activityName: 'Blanket Burrito Reading',
    emoji: '📚',
    amountSaved: 75,
    actionType: 'chose',
    timestamp: '22m ago',
    minutesAgo: 22,
  },
  {
    id: '8',
    userName: 'Liam',
    avatar: 'L',
    activityName: 'Murder Mystery Dinner',
    emoji: '🔍',
    amountSaved: 200,
    actionType: 'stashed',
    timestamp: '25m ago',
    minutesAgo: 25,
  },
  {
    id: '9',
    userName: 'Mia',
    avatar: 'M',
    activityName: 'DIY Paint Night',
    emoji: '🎨',
    amountSaved: 80,
    actionType: 'started',
    timestamp: '28m ago',
    minutesAgo: 28,
  },
  {
    id: '10',
    userName: 'Ethan',
    avatar: 'E',
    activityName: 'Living Room Camping',
    emoji: '⛺',
    amountSaved: 150,
    actionType: 'doing',
    timestamp: '32m ago',
    minutesAgo: 32,
  },
  {
    id: '11',
    userName: 'Harper',
    avatar: 'H',
    activityName: 'Vinyl & Vibes',
    emoji: '🎵',
    amountSaved: 70,
    actionType: 'chose',
    timestamp: '38m ago',
    minutesAgo: 38,
  },
  {
    id: '12',
    userName: 'Ben',
    avatar: 'B',
    activityName: 'Chopped: Home Edition',
    emoji: '👨‍🍳',
    amountSaved: 160,
    actionType: 'started',
    timestamp: '45m ago',
    minutesAgo: 45,
  },
  {
    id: '13',
    userName: 'Chloe',
    avatar: 'C',
    activityName: 'Digital Detox Night',
    emoji: '📵',
    amountSaved: 35,
    actionType: 'stashed',
    timestamp: '52m ago',
    minutesAgo: 52,
  },
  {
    id: '14',
    userName: 'Lucas',
    avatar: 'L',
    activityName: 'YouTube University',
    emoji: '💡',
    amountSaved: 45,
    actionType: 'doing',
    timestamp: '1h ago',
    minutesAgo: 65,
  },
  {
    id: '15',
    userName: 'Zoe',
    avatar: 'Z',
    activityName: 'Grocery Store Sommelier',
    emoji: '🍷',
    amountSaved: 175,
    actionType: 'tucked',
    timestamp: '1h ago',
    minutesAgo: 72,
  },
  {
    id: '16',
    userName: 'Daniel',
    avatar: 'D',
    activityName: 'At-Home Trivia',
    emoji: '🧠',
    amountSaved: 145,
    actionType: 'started',
    timestamp: '1h ago',
    minutesAgo: 78,
  },
  {
    id: '17',
    userName: 'Lily',
    avatar: 'L',
    activityName: 'Vision Board Night',
    emoji: '✨',
    amountSaved: 55,
    actionType: 'chose',
    timestamp: '2h ago',
    minutesAgo: 95,
  },
  {
    id: '18',
    userName: 'James',
    avatar: 'J',
    activityName: 'Bad Movie Night',
    emoji: '🍿',
    amountSaved: 140,
    actionType: 'doing',
    timestamp: '2h ago',
    minutesAgo: 110,
  },
];

const actionMessages = {
  tucked: 'just tucked',
  doing: 'is doing',
  chose: 'chose',
  started: 'started',
  stashed: 'stashed for',
};

// Avatar colors based on first letter
const avatarColors: Record<string, string> = {
  A: 'bg-rose-500',
  B: 'bg-amber-500',
  C: 'bg-emerald-500',
  D: 'bg-cyan-500',
  E: 'bg-indigo-500',
  F: 'bg-violet-500',
  G: 'bg-pink-500',
  H: 'bg-teal-500',
  I: 'bg-orange-500',
  J: 'bg-blue-500',
  K: 'bg-purple-500',
  L: 'bg-green-500',
  M: 'bg-red-500',
  N: 'bg-yellow-500',
  O: 'bg-sky-500',
  P: 'bg-lime-500',
  Q: 'bg-fuchsia-500',
  R: 'bg-rose-400',
  S: 'bg-indigo-400',
  T: 'bg-emerald-400',
  U: 'bg-amber-400',
  V: 'bg-cyan-400',
  W: 'bg-violet-400',
  X: 'bg-pink-400',
  Y: 'bg-teal-400',
  Z: 'bg-blue-400',
};

interface ActivityFeedProps {
  compact?: boolean;
  limit?: number;
}

export function ActivityFeed({ compact = false, limit }: ActivityFeedProps) {
  const [activities, setActivities] = useState<FeedActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading and staggered appearance
    const timer = setTimeout(() => {
      const displayActivities = limit ? mockActivities.slice(0, limit) : mockActivities;
      setActivities(displayActivities);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [limit]);

  const formatActivityText = (activity: FeedActivity): React.ReactNode => {
    const action = actionMessages[activity.actionType];

    if (activity.actionType === 'tucked') {
      return (
        <>
          <span className="font-semibold text-white">{activity.userName}</span>
          <span className="text-slate-400"> {action} </span>
          <span className="font-semibold text-green-400">${activity.amountSaved}</span>
          <span className="text-slate-400"> {' -> '} </span>
          <span className="text-white">{activity.activityName}</span>
          <span className="ml-1">{activity.emoji}</span>
        </>
      );
    }

    if (activity.actionType === 'doing') {
      return (
        <>
          <span className="font-semibold text-white">{activity.userName}</span>
          <span className="text-slate-400"> {action} </span>
          <span className="text-white">{activity.activityName}</span>
          <span className="ml-1">{activity.emoji}</span>
          <span className="text-slate-400"> - saving </span>
          <span className="font-semibold text-green-400">${activity.amountSaved}</span>
        </>
      );
    }

    return (
      <>
        <span className="font-semibold text-white">{activity.userName}</span>
        <span className="text-slate-400"> {action} </span>
        <span className="text-white">{activity.activityName}</span>
        <span className="ml-1">{activity.emoji}</span>
      </>
    );
  };

  if (isLoading) {
    return (
      <div className={`${compact ? 'space-y-3' : 'space-y-4'}`}>
        {[...Array(compact ? 3 : 5)].map((_, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 ${
              compact
                ? 'bg-slate-800/30 rounded-lg p-3'
                : 'bg-slate-800/50 border border-slate-700/50 rounded-xl p-4'
            } animate-pulse`}
          >
            <div className={`${compact ? 'w-8 h-8' : 'w-10 h-10'} rounded-full bg-slate-700`} />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-700 rounded w-3/4" />
              <div className="h-3 bg-slate-700 rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`${compact ? 'space-y-2' : 'space-y-3'}`}>
      <AnimatePresence mode="popLayout">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{
              duration: 0.4,
              delay: index * 0.08,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className={`flex items-start gap-3 ${
              compact
                ? 'bg-slate-800/30 hover:bg-slate-800/50 rounded-lg p-3'
                : 'bg-slate-800/50 border border-slate-700/50 hover:border-slate-600/50 rounded-xl p-4'
            } transition-colors duration-200 cursor-pointer group`}
          >
            {/* Avatar */}
            <div
              className={`${
                compact ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm'
              } rounded-full ${
                avatarColors[activity.avatar] || 'bg-indigo-500'
              } flex items-center justify-center font-semibold text-white flex-shrink-0 shadow-lg`}
            >
              {activity.avatar}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className={`${compact ? 'text-sm' : 'text-base'} leading-relaxed`}>
                {formatActivityText(activity)}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`${compact ? 'text-xs' : 'text-sm'} text-slate-500`}>
                  {activity.timestamp}
                </span>
                {!compact && activity.actionType !== 'tucked' && activity.actionType !== 'doing' && (
                  <span className="text-xs text-slate-600">
                    {' | '}
                    <span className="text-green-400/70">${activity.amountSaved} saved</span>
                  </span>
                )}
              </div>
            </div>

            {/* Interaction hint (non-compact only) */}
            {!compact && (
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <span className="text-xs text-slate-500 whitespace-nowrap">
                  Nice choice!
                </span>
              </motion.div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Live indicator */}
      {!compact && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: activities.length * 0.08 + 0.5 }}
          className="flex items-center justify-center gap-2 py-4"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          <span className="text-xs text-slate-500">Live updates from the JOFO community</span>
        </motion.div>
      )}
    </div>
  );
}

export default ActivityFeed;
