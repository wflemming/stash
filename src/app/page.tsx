'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { getTrendingActivities, type JomoActivity } from "@/data/jomo-activities";

// Mock activity feed data - simulates real-time social proof
const mockActivityFeed = [
  { id: 1, name: "Sarah K.", activity: "Movie Marathon", savings: 85, timeAgo: "2m ago", emoji: "🎬" },
  { id: 2, name: "Mike T.", activity: "Home Cocktail Lab", savings: 120, timeAgo: "5m ago", emoji: "🍹" },
  { id: 3, name: "Emma R.", activity: "Game Night", savings: 150, timeAgo: "8m ago", emoji: "🎲" },
  { id: 4, name: "Alex M.", activity: "Spa Night", savings: 100, timeAgo: "12m ago", emoji: "🧖" },
  { id: 5, name: "Jordan L.", activity: "Living Room Karaoke", savings: 130, timeAgo: "15m ago", emoji: "🎤" },
  { id: 6, name: "Taylor W.", activity: "Blanket Burrito Reading", savings: 75, timeAgo: "18m ago", emoji: "📚" },
  { id: 7, name: "Casey N.", activity: "Vinyl & Vibes", savings: 70, timeAgo: "22m ago", emoji: "🎵" },
  { id: 8, name: "Riley B.", activity: "Murder Mystery Dinner", savings: 200, timeAgo: "25m ago", emoji: "🔍" },
];

// Animated counter component
function AnimatedCounter({
  from,
  to,
  duration = 2,
  prefix = "$",
  suffix = "",
  delay = 0
}: {
  from: number;
  to: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  delay?: number;
}) {
  const [count, setCount] = useState(from);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    const timeout = setTimeout(() => {
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / (duration * 1000), 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(from + (to - from) * easeOut));

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }, delay * 1000);

    return () => clearTimeout(timeout);
  }, [isInView, from, to, duration, delay]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

// Live activity feed item with staggered animation
function ActivityFeedItem({
  item,
  index
}: {
  item: typeof mockActivityFeed[0];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="flex items-center gap-3 bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-full px-4 py-2 whitespace-nowrap"
    >
      <span className="text-lg">{item.emoji}</span>
      <span className="text-slate-300 text-sm">
        <span className="text-white font-medium">{item.name}</span> chose{" "}
        <span className="text-indigo-400">{item.activity}</span>
      </span>
      <span className="text-green-400 text-sm font-semibold">+${item.savings}</span>
    </motion.div>
  );
}

// How it works step with scroll animation
function HowItWorksStep({
  step,
  index,
  isActive
}: {
  step: { icon: string; title: string; description: string; visual: React.ReactNode };
  index: number;
  isActive: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ delay: index * 0.2, duration: 0.6 }}
      className={`relative transition-all duration-500 ${isActive ? 'scale-105' : 'scale-100 opacity-70'}`}
    >
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Step number */}
        <div className="flex-shrink-0">
          <motion.div
            animate={{
              scale: isActive ? 1.1 : 1,
              boxShadow: isActive ? '0 0 40px rgba(99, 102, 241, 0.4)' : '0 0 0px rgba(99, 102, 241, 0)'
            }}
            className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center"
          >
            <span className="text-4xl">{step.icon}</span>
          </motion.div>
        </div>

        {/* Content */}
        <div className="flex-1 text-center md:text-left">
          <div className="text-indigo-400 text-sm font-medium mb-2">Step {index + 1}</div>
          <h3 className="text-2xl font-bold text-white mb-2">{step.title}</h3>
          <p className="text-slate-400 text-lg leading-relaxed">{step.description}</p>
        </div>

        {/* Visual */}
        <div className="flex-shrink-0 w-full md:w-64">
          {step.visual}
        </div>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);

  const [activeStep, setActiveStep] = useState(0);
  const [liveCount, setLiveCount] = useState(2847);
  const trendingActivities = getTrendingActivities();

  // Simulate live counter updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount(prev => prev + Math.floor(Math.random() * 3));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Auto-cycle through steps
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const howItWorksSteps = [
    {
      icon: "🎯",
      title: "Pick your vibe",
      description: "Browse 40+ curated stay-in activities. Movie marathon? Home spa? Cocktail experiments? Find your perfect cozy night.",
      visual: (
        <div className="grid grid-cols-2 gap-2">
          {trendingActivities.slice(0, 4).map((activity, i) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3 text-center"
            >
              <div className="text-2xl mb-1">{activity.emoji}</div>
              <div className="text-xs text-slate-400 truncate">{activity.name}</div>
            </motion.div>
          ))}
        </div>
      ),
    },
    {
      icon: "💰",
      title: "Stash the night out",
      description: "That $127 bar tab? Skip it. That Uber surge + overpriced drinks combo? Hard pass. Your future self is watching.",
      visual: (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-slate-500 text-xs">Tonight's stash</div>
            <div className="text-green-400 text-sm font-semibold">+$127</div>
          </div>
          <div className="space-y-2">
            {[
              { label: "Uber to downtown", amount: 24 },
              { label: "Cover charge", amount: 20 },
              { label: "Drinks (4)", amount: 56 },
              { label: "Late night food", amount: 18 },
              { label: "Uber home", amount: 32 },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex justify-between text-xs"
              >
                <span className="text-slate-500 line-through">{item.label}</span>
                <span className="text-slate-600 line-through">${item.amount}</span>
              </motion.div>
            ))}
          </div>
        </div>
      ),
    },
    {
      icon: "📈",
      title: "Watch it compound",
      description: "That $127 becomes $274 in 10 years. Do it every Saturday? You're looking at $70K+ for Future You. Math is beautiful.",
      visual: (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
          <div className="text-center mb-3">
            <div className="text-slate-500 text-xs mb-1">10-year projection</div>
            <div className="text-3xl font-bold text-green-400">$70,847</div>
          </div>
          <div className="h-16 flex items-end justify-between gap-1">
            {[12, 18, 25, 32, 41, 52, 64, 78, 94, 100].map((height, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                whileInView={{ height: `${height}%` }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 + i * 0.05, duration: 0.4 }}
                className="flex-1 bg-gradient-to-t from-indigo-600 to-green-500 rounded-t"
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-slate-600">
            <span>Yr 1</span>
            <span>Yr 10</span>
          </div>
        </div>
      ),
    },
  ];

  const stats = [
    { value: 127, label: "Average saved per night", prefix: "$" },
    { value: 847, label: "Nights stayed in this week", prefix: "" },
    { value: 2.1, label: "Times return in 10 years", prefix: "", suffix: "x" },
    { value: 94, label: "Users hit monthly goal", prefix: "", suffix: "%" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-x-hidden">
      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-screen flex flex-col justify-center"
      >
        {/* Ambient background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          />
        </div>

        <main className="container mx-auto px-6 py-16 md:py-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center text-center max-w-4xl mx-auto"
          >
            {/* Live counter badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 bg-green-400 rounded-full"
                />
                <span className="text-green-400 text-sm font-medium">
                  {liveCount.toLocaleString()} people staying in tonight
                </span>
              </div>
            </motion.div>

            {/* Main headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
            >
              <span className="bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
                JOFO
              </span>
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-2xl md:text-3xl text-slate-300 mb-4 font-medium"
            >
              Stash tonight. Stack tomorrow.
            </motion.p>

            {/* Explainer */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-lg md:text-xl text-slate-500 mb-12 max-w-2xl"
            >
              <span className="text-indigo-400 font-medium">Joy of Financing Out.</span>{" "}
              Turn every night in into a deposit for Future You.
              The social app that makes staying home feel like winning.
            </motion.p>

            {/* Animated value prop card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="w-full max-w-lg mb-12"
            >
              <div className="relative bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-3xl p-8 overflow-hidden">
                {/* Animated gradient border */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-conic from-indigo-500 via-purple-500 to-indigo-500 opacity-20 blur-xl"
                />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-left">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="text-slate-500 text-xs uppercase tracking-wider mb-2"
                      >
                        Tonight&apos;s sacrifice
                      </motion.div>
                      <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.9, type: "spring" }}
                        className="text-4xl md:text-5xl font-bold text-white"
                      >
                        $127
                      </motion.div>
                      <div className="text-slate-400 text-sm mt-1">skipped</div>
                    </div>

                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 1.1 }}
                      className="flex flex-col items-center"
                    >
                      <motion.div
                        animate={{ x: [0, 8, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        className="text-4xl text-indigo-400"
                      >
                        &rarr;
                      </motion.div>
                      <div className="text-slate-600 text-xs mt-1">10 years</div>
                    </motion.div>

                    <div className="text-right">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2 }}
                        className="text-slate-500 text-xs uppercase tracking-wider mb-2"
                      >
                        Future You gets
                      </motion.div>
                      <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 1.3, type: "spring" }}
                        className="text-4xl md:text-5xl font-bold text-green-400"
                      >
                        $274
                      </motion.div>
                      <div className="text-green-400/60 text-sm mt-1">+116% gain</div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ delay: 1.4, duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-green-500"
                    />
                  </div>

                  {/* Compound interest note */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.6 }}
                    className="mt-4 text-center"
                  >
                    <span className="text-slate-500 text-sm">
                      8% average market return, compounded annually
                    </span>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/tonight">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-10 py-7 text-lg rounded-full shadow-lg shadow-indigo-500/25 transition-all hover:shadow-xl hover:shadow-indigo-500/30"
                >
                  Start Stacking Tonight
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:border-slate-500 px-10 py-7 text-lg rounded-full"
                >
                  See the Math
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </main>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="flex flex-col items-center text-slate-500"
          >
            <span className="text-sm mb-2">Scroll to explore</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Social Proof Strip - Live Activity Feed */}
      <section className="py-8 border-y border-slate-800/50 bg-slate-900/50 backdrop-blur-sm overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-6">
            <span className="text-slate-500 text-sm uppercase tracking-wider">Live Activity</span>
          </div>

          {/* Scrolling feed */}
          <div className="relative">
            <motion.div
              animate={{ x: [0, -1500] }}
              transition={{
                duration: 30,
                repeat: Infinity,
                ease: "linear",
                repeatType: "loop"
              }}
              className="flex gap-4"
            >
              {[...mockActivityFeed, ...mockActivityFeed].map((item, index) => (
                <ActivityFeedItem key={`${item.id}-${index}`} item={item} index={0} />
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works - Enhanced */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-indigo-400 text-sm uppercase tracking-wider font-medium">How it works</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-4">
              Three steps to a richer future
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              JOFO turns FOMO into JOMO (Joy of Missing Out) by making every night in count toward your financial goals.
            </p>
          </motion.div>

          <div className="space-y-16 max-w-4xl mx-auto">
            {howItWorksSteps.map((step, index) => (
              <HowItWorksStep
                key={step.title}
                step={step}
                index={index}
                isActive={activeStep === index}
              />
            ))}
          </div>

          {/* Step indicators */}
          <div className="flex justify-center gap-3 mt-12">
            {howItWorksSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveStep(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  activeStep === index
                    ? 'bg-indigo-500 w-8'
                    : 'bg-slate-700 hover:bg-slate-600'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Activity Preview - Social Feed Style */}
      <section className="py-24 bg-slate-900/50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-indigo-400 text-sm uppercase tracking-wider font-medium">Tonight&apos;s vibes</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-4">
              What are people doing tonight?
            </h2>
            <p className="text-slate-400 text-lg">
              Real people, real savings, real cozy vibes
            </p>
          </motion.div>

          {/* Activity cards grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {mockActivityFeed.slice(0, 6).map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-slate-800/30 border-slate-700/50 hover:border-indigo-500/30 transition-all hover:bg-slate-800/50">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium">
                          {item.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-white font-medium">{item.name}</div>
                          <div className="text-slate-500 text-sm">{item.timeAgo}</div>
                        </div>
                      </div>
                      <span className="text-3xl">{item.emoji}</span>
                    </div>

                    <p className="text-slate-300 mb-4">
                      Chose <span className="text-indigo-400 font-medium">{item.activity}</span> over going out tonight
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                      <div className="text-slate-500 text-sm">Saved for Future Me</div>
                      <div className="text-green-400 font-bold text-lg">${item.savings}</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* View more link */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <Link href="/tonight">
              <Button variant="ghost" className="text-indigo-400 hover:text-indigo-300">
                Browse all 40+ activities &rarr;
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-green-400 text-sm uppercase tracking-wider font-medium">The numbers</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-4">
              JOFO by the numbers
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-green-400 mb-2">
                  <AnimatedCounter
                    from={0}
                    to={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix || ""}
                    delay={0.5 + index * 0.2}
                  />
                </div>
                <div className="text-slate-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Big stat callout */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mt-16 max-w-2xl mx-auto"
          >
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 rounded-3xl p-8 md:p-12 text-center">
              <div className="text-slate-400 mb-4">Average JOFO user saves</div>
              <div className="text-6xl md:text-7xl font-bold mb-4">
                <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  <AnimatedCounter from={0} to={847} prefix="$" delay={0.8} />
                </span>
              </div>
              <div className="text-slate-400 text-lg">per month for their future self</div>
              <div className="mt-6 pt-6 border-t border-slate-700/50">
                <div className="text-slate-500 text-sm">
                  That&apos;s <span className="text-indigo-400 font-medium">$10,164/year</span> or{" "}
                  <span className="text-green-400 font-medium">$219,847 in 10 years</span> at 8% returns
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-3xl"
          />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="text-6xl mb-8"
            >
              &#127881;
            </motion.div>

            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Ready to meet your{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Future You
              </span>
              ?
            </h2>

            <p className="text-xl text-slate-400 mb-10 max-w-xl mx-auto">
              Every night in is a deposit. Every stash is an investment.
              Start building your future tonight.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/tonight">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-12 py-8 text-xl rounded-full shadow-lg shadow-indigo-500/25 transition-all hover:shadow-xl hover:shadow-indigo-500/30 hover:scale-105"
                >
                  What&apos;s Tonight?
                </Button>
              </Link>
            </div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mt-12 flex flex-wrap justify-center gap-6 text-slate-500 text-sm"
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>2-minute setup</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Free forever</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Tech Stack Badge - for portfolio */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-12 text-center border-t border-slate-800/50"
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

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 text-center border-t border-slate-800/50">
        <p className="text-slate-500 text-sm">
          Built by{" "}
          <a href="https://wheelerflemming.com" className="text-indigo-400 hover:text-indigo-300 transition-colors">
            Wheeler Flemming
          </a>
          {" "}with Claude AI
        </p>
      </footer>
    </div>
  );
}
