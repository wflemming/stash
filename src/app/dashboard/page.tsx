'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import Link from "next/link";
import { formatCurrency, generateProjectionData } from "@/lib/projections";
import { mockSpendingPatterns } from "@/data/mock-transactions";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from "react";

interface Pledge {
  id: string;
  amount: number;
  category: string;
  date: string;
  futureValue: number;
}

export default function Dashboard() {
  const [pledges, setPledges] = useState<Pledge[]>([]);
  const [totalPledged, setTotalPledged] = useState(0);

  useEffect(() => {
    // Load pledges from localStorage
    const savedPledges = localStorage.getItem('pledges');
    if (savedPledges) {
      const parsed = JSON.parse(savedPledges);
      setPledges(parsed);
      setTotalPledged(parsed.reduce((sum: number, p: Pledge) => sum + p.amount, 0));
    } else {
      // Demo data
      const demoPledges: Pledge[] = [
        { id: '1', amount: 150, category: 'Saturday Night Out', date: '2026-01-11', futureValue: 324 },
        { id: '2', amount: 85, category: 'Food Delivery', date: '2026-01-08', futureValue: 183 },
      ];
      setPledges(demoPledges);
      setTotalPledged(235);
    }
  }, []);

  const projectionData = generateProjectionData(totalPledged, 0, 10, 0.08);
  const futureValue = projectionData[projectionData.length - 1]?.value || 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-6 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-12"
        >
          <Link href="/">
            <h1 className="text-2xl font-bold text-white">Stash</h1>
          </Link>
          <Link href="/pledge">
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              + New Pledge
            </Button>
          </Link>
        </motion.div>

        {/* Main Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-3xl p-8 mb-8"
        >
          <div className="text-center">
            <p className="text-slate-400 text-sm mb-2">Total Pledged to Future You</p>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-2">
              {formatCurrency(totalPledged)}
            </h2>
            <div className="flex items-center justify-center gap-2 text-green-400">
              <span className="text-2xl">→</span>
              <span className="text-3xl font-bold">{formatCurrency(futureValue)}</span>
              <span className="text-slate-400 text-sm">in 10 years</span>
            </div>
          </div>
        </motion.div>

        {/* Projection Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-slate-800/50 border-slate-700 p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Growth Projection</h3>
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
                    stroke="#64748b"
                    tickFormatter={(value) => `Yr ${value}`}
                  />
                  <YAxis
                    stroke="#64748b"
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #475569',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: '#94a3b8' }}
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

        {/* Spending Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Spending Opportunities</h3>
          <div className="grid gap-4">
            {mockSpendingPatterns.slice(0, 2).map((pattern, index) => (
              <motion.div
                key={pattern.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <Card className="bg-slate-800/50 border-slate-700 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">{pattern.emoji}</div>
                      <div>
                        <h4 className="text-white font-semibold">{pattern.name}</h4>
                        <p className="text-slate-400 text-sm">{pattern.insight}</p>
                        <p className="text-indigo-400 text-sm mt-2">
                          ~{formatCurrency(pattern.averageAmount)}/{pattern.frequency}
                        </p>
                      </div>
                    </div>
                    <Link href={`/pledge?pattern=${pattern.id}`}>
                      <Button variant="outline" size="sm" className="border-indigo-500 text-indigo-400 hover:bg-indigo-500/20">
                        Pledge
                      </Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Pledge History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">Your Pledges</h3>
          <div className="space-y-3">
            {pledges.map((pledge, index) => (
              <motion.div
                key={pledge.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.05 }}
              >
                <Card className="bg-slate-800/30 border-slate-700/50 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">{pledge.category}</p>
                      <p className="text-slate-500 text-sm">{pledge.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-semibold">{formatCurrency(pledge.amount)}</p>
                      <p className="text-green-400 text-sm">→ {formatCurrency(pledge.futureValue)} in 10yr</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
