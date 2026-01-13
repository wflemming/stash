'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { formatCurrency, calculateFutureValue } from "@/lib/projections";
import { mockSpendingPatterns } from "@/data/mock-transactions";
import Link from "next/link";

function PledgeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const patternId = searchParams.get('pattern') || 'saturday-night';

  const pattern = mockSpendingPatterns.find(p => p.id === patternId) || mockSpendingPatterns[0];

  const [amount, setAmount] = useState(pattern.averageAmount);
  const [showSuccess, setShowSuccess] = useState(false);

  const futureValue = Math.round(calculateFutureValue(amount, 0.08, 10));

  const handlePledge = () => {
    // Save pledge to localStorage
    const existingPledges = JSON.parse(localStorage.getItem('pledges') || '[]');
    const newPledge = {
      id: Date.now().toString(),
      amount,
      category: pattern.name,
      date: new Date().toISOString().split('T')[0],
      futureValue,
    };
    localStorage.setItem('pledges', JSON.stringify([...existingPledges, newPledge]));

    setShowSuccess(true);
  };

  const handleClose = () => {
    setShowSuccess(false);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/dashboard" className="text-slate-400 text-sm hover:text-white">
              ← Back to Dashboard
            </Link>
          </div>

          <Card className="bg-slate-800/50 border-slate-700 p-8">
            {/* Pattern Info */}
            <div className="text-center mb-8">
              <div className="text-5xl mb-4">{pattern.emoji}</div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Make a Pledge
              </h2>
              <p className="text-slate-400">
                {pattern.pledgeSuggestion}
              </p>
            </div>

            {/* Amount Selector */}
            <div className="mb-8">
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-white mb-2">
                  {formatCurrency(amount)}
                </div>
                <div className="text-slate-400">
                  pledge amount
                </div>
              </div>

              <Slider
                value={[amount]}
                onValueChange={(value) => setAmount(value[0])}
                min={25}
                max={300}
                step={5}
                className="mb-6"
              />

              {/* Quick amounts */}
              <div className="flex gap-2 justify-center">
                {[50, 100, 150, 200].map((preset) => (
                  <Button
                    key={preset}
                    variant={amount === preset ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAmount(preset)}
                    className={amount === preset
                      ? "bg-indigo-600"
                      : "border-slate-600 text-slate-300 hover:bg-slate-700"
                    }
                  >
                    ${preset}
                  </Button>
                ))}
              </div>
            </div>

            {/* Future Value Preview */}
            <motion.div
              key={amount}
              initial={{ opacity: 0.5, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 mb-8 text-center"
            >
              <p className="text-green-400 text-sm mb-2">Future You gets</p>
              <p className="text-4xl font-bold text-green-400">
                {formatCurrency(futureValue)}
              </p>
              <p className="text-slate-400 text-sm mt-2">in 10 years at 8% avg return</p>
            </motion.div>

            {/* Pledge Button */}
            <Button
              onClick={handlePledge}
              className="w-full bg-indigo-600 hover:bg-indigo-700 py-6 text-lg"
            >
              I Pledge to Future Me
            </Button>
          </Card>
        </motion.div>

        {/* Success Dialog */}
        <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
          <DialogContent className="bg-slate-800 border-slate-700 text-center p-8">
            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  {/* Confetti-like elements */}
                  <div className="relative">
                    {['🎉', '✨', '💰', '🚀'].map((emoji, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, y: 0 }}
                        animate={{
                          opacity: [0, 1, 0],
                          y: [-20, -60],
                          x: [(i - 1.5) * 30, (i - 1.5) * 50],
                        }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        className="absolute text-2xl"
                        style={{ left: '50%', top: 0 }}
                      >
                        {emoji}
                      </motion.span>
                    ))}
                  </div>

                  <div className="text-6xl mb-6">🎊</div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Future You Thanks You!
                  </h3>
                  <p className="text-slate-400 mb-4">
                    You just invested {formatCurrency(amount)} in yourself
                  </p>
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6">
                    <p className="text-green-400 font-semibold">
                      That&apos;s {formatCurrency(futureValue)} in 10 years
                    </p>
                  </div>
                  <Button
                    onClick={handleClose}
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                  >
                    View Dashboard
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default function PledgePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </div>
    }>
      <PledgeContent />
    </Suspense>
  );
}
