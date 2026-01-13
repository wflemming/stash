'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { jomoActivities, getTrendingActivities, type JomoActivity } from '@/data/jomo-activities';
import { mockFutureYouAccount, getTodaysInsight, getCurrentDayOfWeek } from '@/data/mock-accounts';
import { calculateFutureValue, formatCurrency } from '@/lib/projections';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function TonightPage() {
  const [currentActivity, setCurrentActivity] = useState<JomoActivity | null>(null);
  const [isShuffling, setIsShuffling] = useState(false);
  const trendingActivities = getTrendingActivities();
  const insight = getTodaysInsight();
  const dayOfWeek = getCurrentDayOfWeek();

  // Initialize with a random activity on mount
  useEffect(() => {
    shuffleActivity();
  }, []);

  const shuffleActivity = () => {
    setIsShuffling(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * jomoActivities.length);
      setCurrentActivity(jomoActivities[randomIndex]);
      setIsShuffling(false);
    }, 300);
  };

  const projectedValue = currentActivity
    ? Math.round(calculateFutureValue(currentActivity.estimatedSavings))
    : 0;

  return (
    <div className="min-h-screen app-bg">
      {/* Header */}
      <header className="container mx-auto px-6 py-6">
        <nav className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-slate-900 via-indigo-600 to-purple-600 dark:from-white dark:via-indigo-200 dark:to-purple-200 bg-clip-text text-transparent">
            JOFO
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/dashboard">
              <Button variant="ghost" className="text-secondary-app hover:text-primary-app">
                Dashboard
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-6 pb-20">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block mb-6 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full"
          >
            <span className="text-indigo-600 dark:text-indigo-400 text-sm font-medium">
              {dayOfWeek} Night Vibes
            </span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-slate-900 via-indigo-600 to-purple-600 dark:from-white dark:via-indigo-200 dark:to-purple-200 bg-clip-text text-transparent">
              What&apos;s your vibe tonight?
            </span>
          </h1>
          <p className="text-secondary-app text-lg">
            Your{' '}
            <span className="text-indigo-600 dark:text-indigo-600 dark:text-indigo-400 font-semibold">Future You</span>
            {' '}balance:{' '}
            <span className="text-green-600 dark:text-green-600 dark:text-green-400 font-semibold">
              {formatCurrency(mockFutureYouAccount.balance)}
            </span>
          </p>
        </motion.div>

        {/* Tonight's Pick */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-xl mx-auto mb-8"
        >
          <div className="text-center mb-4">
            <span className="text-muted-app text-sm uppercase tracking-wider">
              Tonight&apos;s Pick
            </span>
          </div>

          <AnimatePresence mode="wait">
            {currentActivity && (
              <motion.div
                key={currentActivity.id}
                initial={{ opacity: 0, scale: 0.95, rotateY: -10 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.95, rotateY: 10 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="app-card border overflow-hidden">
                  <CardContent className="p-8 text-center">
                    <motion.div
                      animate={{
                        scale: isShuffling ? [1, 1.2, 1] : 1,
                        rotate: isShuffling ? [0, 10, -10, 0] : 0
                      }}
                      transition={{ duration: 0.3 }}
                      className="text-6xl mb-4"
                    >
                      {currentActivity.emoji}
                    </motion.div>
                    <h2 className="text-2xl font-bold text-primary-app mb-2">
                      {currentActivity.name}
                    </h2>
                    <p className="text-secondary-app mb-6">
                      {currentActivity.description}
                    </p>

                    <div className="flex justify-center gap-6 mb-4">
                      <div className="text-center">
                        <div className="text-green-600 dark:text-green-400 text-2xl font-bold">
                          {formatCurrency(currentActivity.estimatedSavings)}
                        </div>
                        <div className="text-muted-app text-sm">saved tonight</div>
                      </div>
                      <div className="text-center">
                        <div className="text-indigo-600 dark:text-indigo-400 text-2xl font-bold capitalize">
                          {currentActivity.vibeCategory}
                        </div>
                        <div className="text-muted-app text-sm">vibe category</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Shuffle Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center mt-4"
          >
            <Button
              variant="ghost"
              onClick={shuffleActivity}
              disabled={isShuffling}
              className="text-secondary-app hover:text-primary-app"
            >
              <motion.span
                animate={{ rotate: isShuffling ? 360 : 0 }}
                transition={{ duration: 0.3 }}
                className="mr-2"
              >
                🎲
              </motion.span>
              Shuffle for a different vibe
            </Button>
          </motion.div>
        </motion.div>

        {/* AI Insight Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-xl mx-auto mb-8"
        >
          <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-indigo-500/30">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="text-3xl">🤖</div>
                <div className="flex-1">
                  <div className="text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-2">
                    Based on your spending patterns...
                  </div>
                  <p className="text-slate-300 mb-3">
                    You typically spend ~<span className="text-primary-app font-semibold">${insight.averageSpending}</span> on {dayOfWeek} nights
                  </p>
                  <div className="app-subtle rounded-lg p-4 border border-slate-700">
                    <p className="text-secondary-app text-sm">
                      Stay in tonight and <span className="text-indigo-600 dark:text-indigo-400">Future You</span> gets
                    </p>
                    <p className="text-green-600 dark:text-green-400 text-2xl font-bold">
                      {formatCurrency(projectedValue)} in 10 years
                    </p>
                    <p className="text-muted-app text-xs mt-1">
                      From just {currentActivity ? formatCurrency(currentActivity.estimatedSavings) : '$0'} saved tonight
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="max-w-xl mx-auto mb-16"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/pledge">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-primary-app px-8 py-6 text-lg rounded-full shadow-lg shadow-indigo-500/25"
              >
                <span className="mr-2">💰</span>
                Pay Future You
              </Button>
            </Link>
            <Link href="/pledge">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-green-500/50 text-green-600 dark:text-green-400 hover:bg-green-500/10 px-8 py-6 text-lg rounded-full"
              >
                <span className="mr-2">🎁</span>
                Treat Your Future Self
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Trending Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-primary-app mb-2">
              🔥 Trending Tonight
            </h3>
            <p className="text-muted-app text-sm">
              What other homebodies are doing
            </p>
          </div>

          <div className="overflow-x-auto pb-4 -mx-6 px-6">
            <div className="flex gap-4" style={{ width: 'max-content' }}>
              {trendingActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.05 }}
                  onClick={() => setCurrentActivity(activity)}
                  className="cursor-pointer"
                >
                  <Card className="w-48 app-card-secondary border hover:border-indigo-500/50 transition-all hover:scale-105">
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl mb-2">{activity.emoji}</div>
                      <div className="text-primary-app font-medium text-sm mb-1 truncate">
                        {activity.name}
                      </div>
                      <div className="text-green-600 dark:text-green-400 text-sm font-semibold">
                        Save {formatCurrency(activity.estimatedSavings)}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Streak Reminder */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-full">
            <span className="text-orange-400">🔥</span>
            <span className="text-secondary-app text-sm">
              You&apos;re on a <span className="text-primary-app font-semibold">{mockFutureYouAccount.streakDays}-day</span> streak!
            </span>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
