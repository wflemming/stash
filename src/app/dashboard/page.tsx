'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import Link from "next/link";
import { formatCurrency, generateProjectionData } from "@/lib/projections";
import { mockSpendingPatterns } from "@/data/mock-transactions";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/components/ThemeProvider";

interface Stash {
  id: string;
  amount: number;
  category: string;
  date: string;
  futureValue: number;
}

export default function Dashboard() {
  const [stashes, setStashes] = useState<Stash[]>([]);
  const [totalStashed, setTotalStashed] = useState(0);

  useEffect(() => {
    // Load stashes from localStorage
    const savedStashes = localStorage.getItem('stashes');
    if (savedStashes) {
      const parsed = JSON.parse(savedStashes);
      setStashes(parsed);
      setTotalStashed(parsed.reduce((sum: number, s: Stash) => sum + s.amount, 0));
    } else {
      // Demo data
      const demoStashes: Stash[] = [
        { id: '1', amount: 150, category: 'Saturday Night Out', date: '2026-01-11', futureValue: 324 },
        { id: '2', amount: 85, category: 'Food Delivery', date: '2026-01-08', futureValue: 183 },
      ];
      setStashes(demoStashes);
      setTotalStashed(235);
    }
  }, []);

  const projectionData = generateProjectionData(totalStashed, 0, 10, 0.08);
  const futureValue = projectionData[projectionData.length - 1]?.value || 0;
  const growthPercent = totalStashed > 0 ? Math.round(((futureValue - totalStashed) / totalStashed) * 100) : 0;

  const { resolvedTheme } = useTheme();

  return (
    <div className="min-h-screen app-bg">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 app-header backdrop-blur-lg border-b">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo & Nav */}
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2">
                <span className="text-2xl font-bold bg-gradient-to-r from-slate-900 via-indigo-600 to-purple-600 dark:from-white dark:via-indigo-200 dark:to-purple-200 bg-clip-text text-transparent">
                  JOFO
                </span>
              </Link>
              <nav className="hidden md:flex items-center gap-1">
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="text-primary-app bg-slate-200/50 dark:bg-slate-800/50">
                    Dashboard
                  </Button>
                </Link>
                <Link href="/tonight">
                  <Button variant="ghost" size="sm" className="text-secondary-app hover:text-primary-app">
                    Tonight
                  </Button>
                </Link>
                <Link href="/pledge">
                  <Button variant="ghost" size="sm" className="text-secondary-app hover:text-primary-app">
                    Stash
                  </Button>
                </Link>
              </nav>
            </div>

            {/* Right side - Actions & Avatar */}
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link href="/pledge" className="hidden sm:block">
                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  + New Stash
                </Button>
              </Link>
              {/* User Avatar Placeholder */}
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium cursor-pointer hover:ring-2 hover:ring-indigo-400/50 transition-all">
                U
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-primary-app mb-2">
            Welcome back
          </h1>
          <p className="text-secondary-app">
            Your stash is growing. Keep stacking for Future You.
          </p>
        </motion.div>

        {/* Quick Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="app-card-secondary rounded-xl p-4 border">
            <p className="text-secondary-app text-xs uppercase tracking-wider mb-1">Total Stashed</p>
            <p className="text-xl font-bold text-primary-app">{formatCurrency(totalStashed)}</p>
          </div>
          <div className="app-card-secondary rounded-xl p-4 border">
            <p className="text-secondary-app text-xs uppercase tracking-wider mb-1">Future Value</p>
            <p className="text-xl font-bold text-green-600 dark:text-green-400">{formatCurrency(futureValue)}</p>
          </div>
          <div className="app-card-secondary rounded-xl p-4 border">
            <p className="text-secondary-app text-xs uppercase tracking-wider mb-1">Growth</p>
            <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">+{growthPercent}%</p>
          </div>
          <div className="app-card-secondary rounded-xl p-4 border">
            <p className="text-secondary-app text-xs uppercase tracking-wider mb-1">Stashes</p>
            <p className="text-xl font-bold text-primary-app">{stashes.length}</p>
          </div>
        </motion.div>

        {/* Main Stats Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-indigo-600/10 to-purple-600/10 dark:from-indigo-600/20 dark:to-purple-600/20 border border-indigo-500/30 rounded-2xl p-6 md:p-8 mb-8"
        >
          <div className="text-center">
            <p className="text-secondary-app text-sm mb-2">Total Stashed for Future You</p>
            <h2 className="text-4xl md:text-5xl font-bold text-primary-app mb-2">
              {formatCurrency(totalStashed)}
            </h2>
            <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
              <span className="text-xl">→</span>
              <span className="text-2xl font-bold">{formatCurrency(futureValue)}</span>
              <span className="text-secondary-app text-sm">in 10 years</span>
            </div>
          </div>
        </motion.div>

        {/* Two Column Layout for Chart and Insights */}
        <div className="grid lg:grid-cols-5 gap-6 mb-8">
          {/* Projection Chart - Takes more space */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            <Card className="app-card border p-6 h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-primary-app">Growth Projection</h3>
                <span className="text-xs text-muted-app bg-slate-200/50 dark:bg-slate-700/50 px-2 py-1 rounded">10 Year Forecast</span>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={projectionData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="year"
                      stroke={resolvedTheme === 'dark' ? '#64748b' : '#94a3b8'}
                      tickFormatter={(value) => `Yr ${value}`}
                    />
                    <YAxis
                      stroke={resolvedTheme === 'dark' ? '#64748b' : '#94a3b8'}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: resolvedTheme === 'dark' ? '#1e293b' : '#ffffff',
                        border: resolvedTheme === 'dark' ? '1px solid #475569' : '1px solid #e2e8f0',
                        borderRadius: '8px',
                      }}
                      labelStyle={{ color: resolvedTheme === 'dark' ? '#94a3b8' : '#64748b' }}
                      formatter={(value) => [formatCurrency(value as number), 'Value']}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#6366f1"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorValue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>

          {/* Spending Insights - Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <Card className="app-card border p-6 h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-primary-app">Opportunities</h3>
                <Link href="/tonight" className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
                  View all
                </Link>
              </div>
              <div className="space-y-4">
                {mockSpendingPatterns.slice(0, 2).map((pattern, index) => (
                  <motion.div
                    key={pattern.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="app-subtle rounded-lg p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{pattern.emoji}</div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-primary-app font-medium text-sm truncate">{pattern.name}</h4>
                        <p className="text-secondary-app text-xs mt-0.5 line-clamp-2">{pattern.insight}</p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-indigo-600 dark:text-indigo-400 text-xs">
                            ~{formatCurrency(pattern.averageAmount)}/{pattern.frequency}
                          </p>
                          <Link href={`/pledge?pattern=${pattern.id}`}>
                            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 hover:bg-indigo-500/20">
                              Stash It
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Stash History Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="app-card border p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-primary-app">Your Stash</h3>
                <p className="text-secondary-app text-sm">Track your stash and watch it grow</p>
              </div>
              <Link href="/pledge">
                <Button size="sm" variant="outline" className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                  + Add Stash
                </Button>
              </Link>
            </div>

            {/* Table Header */}
            <div className="hidden md:grid grid-cols-4 gap-4 px-4 py-2 app-subtle rounded-lg mb-3">
              <span className="text-secondary-app text-xs uppercase tracking-wider">Category</span>
              <span className="text-secondary-app text-xs uppercase tracking-wider">Date</span>
              <span className="text-secondary-app text-xs uppercase tracking-wider text-right">Amount</span>
              <span className="text-secondary-app text-xs uppercase tracking-wider text-right">Future Value</span>
            </div>

            <div className="space-y-2">
              {stashes.map((stash, index) => (
                <motion.div
                  key={stash.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                  className="grid md:grid-cols-4 gap-2 md:gap-4 items-center px-4 py-3 bg-slate-100/50 dark:bg-slate-700/20 hover:bg-slate-200/50 dark:hover:bg-slate-700/30 rounded-lg transition-colors"
                >
                  <p className="text-primary-app font-medium">{stash.category}</p>
                  <p className="text-secondary-app text-sm">{stash.date}</p>
                  <p className="text-primary-app font-semibold md:text-right">{formatCurrency(stash.amount)}</p>
                  <p className="text-green-600 dark:text-green-400 text-sm md:text-right flex items-center md:justify-end gap-1">
                    <span className="text-muted-app">→</span> {formatCurrency(stash.futureValue)}
                  </p>
                </motion.div>
              ))}
            </div>

            {stashes.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-app">No stash yet. Start building for Future You!</p>
                <Link href="/pledge">
                  <Button className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white">
                    Make Your First Stash
                  </Button>
                </Link>
              </div>
            )}
          </Card>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-6 py-8 mt-8 border-t border-slate-200/50 dark:border-slate-800/50">
        <p className="text-center text-muted-app text-sm">
          JOFO Demo - Built by{" "}
          <a href="https://wheelerflemming.com" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
            Wheeler Flemming
          </a>
        </p>
      </footer>
    </div>
  );
}
