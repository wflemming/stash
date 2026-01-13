'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { formatCurrency, generateProjectionData, calculateFutureValue } from "@/lib/projections";
import { getCheckingAccount, getInvestmentAccount } from "@/data/mock-accounts";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Link from "next/link";

// Confetti particle component
function ConfettiParticle({ delay, x, color }: { delay: number; x: number; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, x: x, rotate: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        y: [0, 300, 500],
        x: [x, x + (Math.random() - 0.5) * 100, x + (Math.random() - 0.5) * 150],
        rotate: [0, 360, 720],
      }}
      transition={{
        duration: 3,
        delay: delay,
        ease: "easeOut",
      }}
      className="absolute top-0 w-3 h-3 rounded-sm"
      style={{ backgroundColor: color, left: '50%' }}
    />
  );
}

// Confetti burst component
function ConfettiBurst() {
  const colors = ['#6366f1', '#22c55e', '#f59e0b', '#ec4899', '#8b5cf6', '#14b8a6'];
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    delay: Math.random() * 0.5,
    x: (Math.random() - 0.5) * 400,
    color: colors[Math.floor(Math.random() * colors.length)],
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map((particle) => (
        <ConfettiParticle key={particle.id} {...particle} />
      ))}
    </div>
  );
}

function TransferContent() {
  const searchParams = useSearchParams();
  const amountParam = searchParams.get('amount');
  const amount = amountParam ? parseFloat(amountParam) : 150;

  const [currentStep, setCurrentStep] = useState(0);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [animatedAmount, setAnimatedAmount] = useState(0);
  const [showChart, setShowChart] = useState(false);

  const checkingAccount = getCheckingAccount();
  const investmentAccount = getInvestmentAccount();
  const futureValue = Math.round(calculateFutureValue(amount, 0.08, 10));
  const projectionData = generateProjectionData(amount, 0, 10, 0.08);

  const steps = [
    { id: 'checking', title: 'Your Checking Account' },
    { id: 'flowing', title: 'Transferring...' },
    { id: 'landing', title: 'Investment Received' },
    { id: 'growth', title: 'Watch It Grow' },
    { id: 'celebration', title: 'Future You Celebrates!' },
  ];

  const advanceStep = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, steps.length]);

  // Auto-advance through steps
  useEffect(() => {
    if (!autoAdvance) return;

    const delays = [2500, 2000, 2000, 3500, 0]; // Last step doesn't auto-advance
    const delay = delays[currentStep];

    if (delay > 0 && currentStep < steps.length - 1) {
      const timer = setTimeout(advanceStep, delay);
      return () => clearTimeout(timer);
    }
  }, [currentStep, autoAdvance, advanceStep, steps.length]);

  // Animate amount counting up when flowing
  useEffect(() => {
    if (currentStep === 1) {
      const duration = 1500;
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        setAnimatedAmount(amount * progress);
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [currentStep, amount]);

  // Delay chart animation
  useEffect(() => {
    if (currentStep === 3) {
      const timer = setTimeout(() => setShowChart(true), 500);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const handleClick = () => {
    if (!autoAdvance) {
      advanceStep();
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-6 py-12"
      onClick={handleClick}
    >
      <div className="w-full max-w-lg">
        {/* Progress indicators */}
        <div className="flex justify-center gap-2 mb-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index <= currentStep ? 'bg-indigo-500' : 'bg-slate-700'
              }`}
              initial={{ width: 20 }}
              animate={{ width: index === currentStep ? 40 : 20 }}
            />
          ))}
        </div>

        {/* Toggle auto-advance */}
        <div className="text-center mb-6">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setAutoAdvance(!autoAdvance);
            }}
            className="text-slate-500 text-xs hover:text-slate-300 transition-colors"
          >
            {autoAdvance ? 'Click anywhere to skip ahead' : 'Click to advance'}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Show Checking Account */}
          {currentStep === 0 && (
            <motion.div
              key="checking"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <Card className="bg-slate-800/50 border-slate-700 p-8 mb-6">
                  <div className="text-4xl mb-4">🏦</div>
                  <h2 className="text-xl font-semibold text-white mb-2">
                    {checkingAccount?.institution}
                  </h2>
                  <p className="text-slate-400 text-sm mb-4">
                    {checkingAccount?.name} {checkingAccount?.accountNumber}
                  </p>
                  <div className="text-4xl font-bold text-white">
                    {formatCurrency(checkingAccount?.balance || 0)}
                  </div>
                  <p className="text-slate-500 text-sm mt-2">Available Balance</p>
                </Card>
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-slate-400"
              >
                Preparing to transfer <span className="text-indigo-400 font-semibold">{formatCurrency(amount)}</span>
              </motion.p>
            </motion.div>
          )}

          {/* Step 2: Money Flowing Animation */}
          {currentStep === 1 && (
            <motion.div
              key="flowing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center relative"
            >
              {/* Source */}
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mb-8"
              >
                <div className="text-2xl mb-2">🏦</div>
                <p className="text-slate-400 text-sm">{checkingAccount?.name}</p>
              </motion.div>

              {/* Flowing money animation */}
              <div className="relative h-40 flex flex-col items-center justify-center">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: -30, scale: 0.5 }}
                    animate={{
                      opacity: [0, 1, 1, 0],
                      y: [-30, 0, 30, 60],
                      scale: [0.5, 1, 1, 0.5],
                    }}
                    transition={{
                      duration: 1.5,
                      delay: i * 0.3,
                      repeat: 1,
                      ease: "easeInOut",
                    }}
                    className="absolute text-4xl"
                  >
                    💵
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-5xl font-bold text-green-400 z-10"
                >
                  {formatCurrency(Math.round(animatedAmount))}
                </motion.div>
              </div>

              {/* Destination */}
              <motion.div
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="mt-8"
              >
                <div className="text-2xl mb-2">📈</div>
                <p className="text-slate-400 text-sm">Future You Account</p>
              </motion.div>
            </motion.div>
          )}

          {/* Step 3: Landing in Investment Account */}
          {currentStep === 2 && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/10 border-green-500/30 p-8 mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    className="text-5xl mb-4"
                  >
                    ✅
                  </motion.div>
                  <h2 className="text-xl font-semibold text-white mb-2">
                    Future You Account
                  </h2>
                  <p className="text-slate-400 text-sm mb-4">
                    {investmentAccount?.accountNumber}
                  </p>
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4, type: "spring" }}
                    className="text-4xl font-bold text-green-400"
                  >
                    +{formatCurrency(amount)}
                  </motion.div>
                  <p className="text-green-400/70 text-sm mt-2">Transfer Complete</p>
                </Card>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-slate-400"
              >
                Now watch your money grow...
              </motion.p>
            </motion.div>
          )}

          {/* Step 4: Growth Chart */}
          {currentStep === 3 && (
            <motion.div
              key="growth"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <motion.h2
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-2xl font-bold text-white mb-2"
              >
                The Power of Compound Growth
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-slate-400 mb-6"
              >
                {formatCurrency(amount)} today becomes {formatCurrency(futureValue)} in 10 years
              </motion.p>

              <Card className="bg-slate-800/50 border-slate-700 p-6">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={showChart ? projectionData : projectionData.map(d => ({ ...d, value: 0 }))}>
                      <defs>
                        <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
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
                        domain={[0, futureValue * 1.1]}
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
                        stroke="#22c55e"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorGrowth)"
                        animationDuration={2000}
                        animationEasing="ease-out"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2 }}
                  className="mt-4 flex justify-between text-sm"
                >
                  <div className="text-slate-400">
                    <span className="text-white font-semibold">{formatCurrency(amount)}</span> today
                  </div>
                  <div className="text-green-400">
                    <span className="font-semibold">{formatCurrency(futureValue)}</span> in 10 years
                  </div>
                </motion.div>
              </Card>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5 }}
                className="text-slate-500 text-sm mt-4"
              >
                Based on 8% average annual return
              </motion.p>
            </motion.div>
          )}

          {/* Step 5: Celebration */}
          {currentStep === 4 && (
            <motion.div
              key="celebration"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <ConfettiBurst />

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <motion.div
                  animate={{
                    rotate: [0, -10, 10, -10, 10, 0],
                    scale: [1, 1.1, 1.1, 1.1, 1.1, 1],
                  }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="text-7xl mb-6"
                >
                  🎉
                </motion.div>

                <h2 className="text-3xl font-bold text-white mb-4">
                  Future You Is Thriving!
                </h2>

                <Card className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border-indigo-500/30 p-8 mb-6">
                  <p className="text-slate-400 mb-2">You just invested</p>
                  <motion.div
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.4 }}
                    className="text-4xl font-bold text-white mb-4"
                  >
                    {formatCurrency(amount)}
                  </motion.div>

                  <div className="flex items-center justify-center gap-3 mb-4">
                    <motion.span
                      animate={{ x: [0, 10, 0] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="text-2xl text-green-400"
                    >
                      →
                    </motion.span>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-green-500/20 border border-green-500/30 rounded-xl p-4"
                  >
                    <p className="text-green-400 text-sm mb-1">Projected Value in 10 Years</p>
                    <motion.p
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.8 }}
                      className="text-4xl font-bold text-green-400"
                    >
                      {formatCurrency(futureValue)}
                    </motion.p>
                  </motion.div>
                </Card>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="text-slate-400 mb-8"
                >
                  That&apos;s a <span className="text-green-400 font-semibold">{Math.round((futureValue / amount - 1) * 100)}% gain</span> from doing nothing but waiting!
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  className="flex flex-col gap-3"
                >
                  <Link href="/tonight" className="w-full">
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700 py-6 text-lg">
                      Keep Stashing 💪
                    </Button>
                  </Link>
                  <Link href="/dashboard" className="w-full">
                    <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-800 py-6">
                      View Dashboard
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function TransferPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </div>
    }>
      <TransferContent />
    </Suspense>
  );
}
