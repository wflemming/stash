'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { mockSpendingPatterns } from "@/data/mock-transactions";

type Step = 'email' | 'connect' | 'analyzing' | 'insights';

export default function Onboarding() {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      localStorage.setItem('user_email', email);
      setStep('connect');
    }
  };

  const handleConnect = () => {
    setStep('analyzing');
    // Simulate analysis
    setTimeout(() => {
      setStep('insights');
    }, 3000);
  };

  const handleContinue = () => {
    router.push('/pledge?pattern=saturday-night');
  };

  return (
    <div className="min-h-screen app-bg flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          {/* Step 1: Email */}
          {step === 'email' && (
            <motion.div
              key="email"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="app-card border p-8">
                <h2 className="text-2xl font-bold text-primary-app mb-2 text-center">
                  Let&apos;s get started
                </h2>
                <p className="text-secondary-app text-center mb-8">
                  Enter your email to begin your journey
                </p>
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-slate-900 border-slate-600 text-primary-app placeholder:text-muted-app"
                    required
                  />
                  <Button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                  >
                    Continue
                  </Button>
                </form>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Connect Bank */}
          {step === 'connect' && (
            <motion.div
              key="connect"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="app-card border p-8">
                <div className="text-center">
                  <div className="text-5xl mb-6">🏦</div>
                  <h2 className="text-2xl font-bold text-primary-app mb-2">
                    Connect Your Bank
                  </h2>
                  <p className="text-secondary-app mb-8">
                    We&apos;ll analyze your spending to find opportunities
                  </p>
                  <div className="space-y-3">
                    <Button
                      onClick={handleConnect}
                      className="w-full bg-indigo-600 hover:bg-indigo-700"
                    >
                      Connect with Plaid
                    </Button>
                    <Button
                      onClick={handleConnect}
                      variant="outline"
                      className="w-full border-slate-600 text-primary-app hover:bg-slate-700"
                    >
                      Use Demo Data
                    </Button>
                  </div>
                  <p className="text-muted-app text-xs mt-6">
                    Demo mode uses sample transactions to show how it works
                  </p>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Step 3: Analyzing */}
          {step === 'analyzing' && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="app-card border p-8">
                <div className="text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="text-5xl mb-6 inline-block"
                  >
                    🔍
                  </motion.div>
                  <h2 className="text-2xl font-bold text-primary-app mb-2">
                    Analyzing Your Spending
                  </h2>
                  <p className="text-secondary-app mb-8">
                    AI is finding patterns in your transactions...
                  </p>
                  <div className="space-y-2">
                    {['Reading transactions...', 'Finding patterns...', 'Calculating opportunities...'].map((text, i) => (
                      <motion.p
                        key={text}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.8 }}
                        className="text-muted-app text-sm"
                      >
                        {text}
                      </motion.p>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Step 4: Insights */}
          {step === 'insights' && (
            <motion.div
              key="insights"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="app-card border p-8">
                <div className="text-center mb-6">
                  <div className="text-5xl mb-4">✨</div>
                  <h2 className="text-2xl font-bold text-primary-app mb-2">
                    We Found Something
                  </h2>
                </div>

                {/* Main Insight */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-indigo-600/20 border border-indigo-500/30 rounded-xl p-6 mb-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">{mockSpendingPatterns[0].emoji}</div>
                    <div>
                      <h3 className="text-primary-app font-semibold text-lg">
                        {mockSpendingPatterns[0].name}
                      </h3>
                      <p className="text-primary-app text-sm mt-1">
                        {mockSpendingPatterns[0].insight}
                      </p>
                      <p className="text-indigo-600 dark:text-indigo-400 font-semibold mt-3">
                        ~${mockSpendingPatterns[0].averageAmount}/week
                      </p>
                    </div>
                  </div>
                </motion.div>

                <Button
                  onClick={handleContinue}
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                >
                  Make Your First Stash
                </Button>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
