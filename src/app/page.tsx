'use client';

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <main className="container mx-auto px-6 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center max-w-3xl mx-auto"
        >
          {/* Logo */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-4"
          >
            <span className="bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
              JOFO
            </span>
          </motion.h1>

          {/* One-liner */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl text-slate-300 mb-2 font-medium"
          >
            Sacrifice tonight. Stack tomorrow.
          </motion.p>

          {/* Explainer */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-base md:text-lg text-slate-500 mb-10 max-w-xl"
          >
            Joy of Financing Out.
            Skip the $150 night out, invest it, watch it become $324 in 10 years.
          </motion.p>

          {/* Visual Value Prop */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 md:p-8 mb-10 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-left">
                <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">Tonight</div>
                <div className="text-2xl md:text-3xl font-bold text-white">$127</div>
                <div className="text-slate-400 text-sm">sacrificed</div>
              </div>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="text-3xl text-indigo-400"
              >
                →
              </motion.div>
              <div className="text-right">
                <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">10 Years</div>
                <div className="text-2xl md:text-3xl font-bold text-green-400">$274</div>
                <div className="text-slate-400 text-sm">for Future You</div>
              </div>
            </div>
            <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 0.8, duration: 1.5 }}
                className="h-full bg-gradient-to-r from-indigo-500 to-green-500"
              />
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-3 mb-16"
          >
            <Link href="/tonight">
              <Button
                size="lg"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 text-lg rounded-full"
              >
                What&apos;s Tonight?
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                size="lg"
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-6 text-lg rounded-full"
              >
                View Demo
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* How it works - compact */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <div className="text-center mb-8">
            <span className="text-slate-500 text-sm uppercase tracking-wider">How it works</span>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                emoji: "🎯",
                title: "Pick a vibe",
                description: "40+ stay-in activities. Movie night, cooking, games.",
              },
              {
                emoji: "💸",
                title: "Sacrifice it",
                description: "Skip going out. Pledge the savings to Future You.",
              },
              {
                emoji: "📈",
                title: "Watch it grow",
                description: "Compound interest does the work. $100 → $216 in 10yr.",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                className="bg-slate-800/30 border border-slate-800 rounded-xl p-5 text-center"
              >
                <div className="text-3xl mb-3">{item.emoji}</div>
                <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                <p className="text-slate-400 text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tech Stack Badge - for portfolio */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex flex-wrap justify-center gap-2">
            {["Next.js 16", "React 19", "TypeScript", "Tailwind", "Framer Motion"].map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 bg-slate-800/50 border border-slate-700/50 rounded-full text-xs text-slate-400"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 text-center border-t border-slate-800/50">
        <p className="text-slate-500 text-sm">
          Built by{" "}
          <a href="https://wheelerflemming.com" className="text-indigo-400 hover:text-indigo-300">
            Wheeler Flemming
          </a>
          {" "}with Claude AI
        </p>
      </footer>
    </div>
  );
}
