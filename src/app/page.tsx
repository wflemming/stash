'use client';

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <main className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center max-w-3xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full"
          >
            <span className="text-indigo-400 text-sm font-medium">
              Social saving for homebodies
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
          >
            <span className="bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
              Stash
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-slate-400 mb-12 max-w-2xl"
          >
            Stay in. Stack up. See what&apos;s trending tonight and stash the savings.
          </motion.p>

          {/* Value Prop */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 mb-12 w-full max-w-md"
          >
            <div className="text-slate-400 text-sm mb-2">Tonight&apos;s trending stay-in saves you</div>
            <div className="text-4xl font-bold text-green-400 mb-2">$127</div>
            <div className="text-slate-500 text-sm">that becomes $274 in 10 years</div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link href="/onboarding">
              <Button
                size="lg"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 text-lg rounded-full"
              >
                Start Stashing
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

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-32 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto"
        >
          {[
            {
              step: "1",
              title: "Browse Tonight",
              description: "See what's trending for staying in. Movies, recipes, games, vibes.",
              emoji: "🔥",
            },
            {
              step: "2",
              title: "Stay In",
              description: "Skip the bar. Do something better. You're not missing out.",
              emoji: "🏠",
            },
            {
              step: "3",
              title: "Stack Up",
              description: "Auto-stash the savings. Watch your money grow while you chill.",
              emoji: "💰",
            },
          ].map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + index * 0.1 }}
              className="text-center p-6"
            >
              <div className="text-4xl mb-4">{item.emoji}</div>
              <div className="text-indigo-400 text-sm font-medium mb-2">Step {item.step}</div>
              <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-slate-400">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-24 text-center"
        >
          <p className="text-slate-500 text-sm mb-4">Trending tonight</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Movie marathon 🎬",
              "Homemade pizza 🍕",
              "Game night 🎮",
              "Wine & book 📚",
              "Cozy cooking 🍳",
            ].map((trend) => (
              <span
                key={trend}
                className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-full text-sm text-slate-300"
              >
                {trend}
              </span>
            ))}
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-12 text-center text-slate-500 text-sm">
        <p>Built with AI by Wheeler Flemming</p>
      </footer>
    </div>
  );
}
