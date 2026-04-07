import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  AnimatePresence,
  LayoutGroup,
  animate,
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useTransform
} from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  BellRing,
  ChefHat,
  ChevronRight,
  CircleDollarSign,
  Compass,
  CookingPot,
  Eye,
  EyeOff,
  Globe,
  Heart,
  Home,
  LayoutGrid,
  Leaf,
  LogOut,
  Menu,
  Package2,
  PartyPopper,
  Refrigerator,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Trash2,
  Upload,
  User2,
  X
} from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

const PIE_COLORS = ["#10B981", "#34D399", "#F59E0B", "#F97316", "#EF4444"];

const TESTIMONIALS = [
  {
    name: "Nina Patel",
    role: "Founder, FreshMart Kitchen Lab",
    quote:
      "FreshMind made our kitchen data instantly investor-friendly. The product feels premium, and the workflow is actually useful."
  },
  {
    name: "Marcus Hale",
    role: "Operations Manager, GreenKitchen",
    quote:
      "The expiry alerts and AI recipes gave our team a real reason to check the dashboard every day instead of guessing what to use first."
  },
  {
    name: "Laila Nguyen",
    role: "Owner, EcoEats Studio",
    quote:
      "We used FreshMind to pitch our zero-waste kitchen model. The marketplace and savings tracker told the business story in seconds."
  }
];

const PARTNERS = ["FreshMart", "GreenKitchen", "EcoEats", "WasteNot", "FoodFirst"];

const HERO_STATS = [
  { value: 40, suffix: "%", label: "Reduction in Food Waste" },
  { value: 200, prefix: "$", label: "Avg Monthly Savings" },
  { value: 50000, suffix: "+", label: "Happy Users" },
  { value: 2000000, suffix: "+", label: "Meals Tracked" }
];

const HOW_IT_WORKS = [
  {
    icon: Upload,
    title: "Upload your food or scan your fridge",
    description: "Snap a photo, type items manually, or build your fridge inventory in seconds."
  },
  {
    icon: Sparkles,
    title: "AI suggests recipes and tracks expiry",
    description: "FreshMind surfaces the next best recipes and flags what needs attention before it goes bad."
  },
  {
    icon: CircleDollarSign,
    title: "Save money, cut waste, and earn rewards",
    description: "Track progress over time and turn better kitchen habits into measurable financial wins."
  }
];

const FEATURE_CARDS = [
  {
    icon: ChefHat,
    title: "AI Recipe Suggestions",
    description: "Claude-powered recipe ideas built from your real ingredients and pantry state."
  },
  {
    icon: BellRing,
    title: "Expiry Date Alerts",
    description: "Color-coded reminders and action prompts before ingredients become waste."
  },
  {
    icon: CircleDollarSign,
    title: "Savings Tracker",
    description: "See how much money you saved and what you prevented from being thrown out."
  },
  {
    icon: ShoppingBag,
    title: "Leftover Marketplace",
    description: "List extra meals or ingredients and connect them with nearby pickup demand."
  },
  {
    icon: Compass,
    title: "Nearby Restaurants",
    description: "Browse surplus deals from local kitchens and discover rescue-first dining options."
  },
  {
    icon: LayoutGrid,
    title: "Waste Analytics",
    description: "Charts, breakdowns, and milestone tracking for a clearer view of progress."
  }
];

const SCREEN_PREVIEWS = [
  {
    tag: "Dashboard",
    title: "Live fridge and savings overview",
    description: "The command center for waste risk, active ingredients, and money saved."
  },
  {
    tag: "Recipe AI",
    title: "Claude-backed recipe recommendations",
    description: "Interactive recipe cards with steps, timing, and save/share actions."
  },
  {
    tag: "Expiry Alerts",
    title: "A timeline that tells you what to use first",
    description: "Prioritize expiring food, donate it, or list it in the marketplace before it is lost."
  }
];

const NAV_TABS = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "food", label: "My Food", icon: Refrigerator },
  { id: "recipes", label: "Recipes", icon: ChefHat },
  { id: "marketplace", label: "Marketplace", icon: ShoppingBag },
  { id: "alerts", label: "Alerts", icon: BellRing }
];

function isoFromDays(offset) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + offset);
  return date.toISOString().split("T")[0];
}

function makeId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function demoUser() {
  return {
    name: "Avery Chen",
    email: "demo@freshmind.app",
    password: "demo123",
    joined: "2026-04-07"
  };
}

function seedFoodItems() {
  return [
    { id: makeId("food"), name: "Spinach", category: "Vegetables", qty: "2 bags", expiry: isoFromDays(1), addedDate: isoFromDays(-2), reminder: true },
    { id: makeId("food"), name: "Greek Yogurt", category: "Dairy", qty: "1 tub", expiry: isoFromDays(3), addedDate: isoFromDays(-4), reminder: false },
    { id: makeId("food"), name: "Chicken Breast", category: "Meat", qty: "4 pieces", expiry: isoFromDays(5), addedDate: isoFromDays(-1), reminder: true },
    { id: makeId("food"), name: "Bell Peppers", category: "Vegetables", qty: "6 units", expiry: isoFromDays(8), addedDate: isoFromDays(-1), reminder: false },
    { id: makeId("food"), name: "Sourdough Bread", category: "Bakery", qty: "1 loaf", expiry: isoFromDays(0), addedDate: isoFromDays(-3), reminder: true },
    { id: makeId("food"), name: "Blueberries", category: "Fruit", qty: "2 boxes", expiry: isoFromDays(-1), addedDate: isoFromDays(-5), reminder: false }
  ];
}

function seedSavedRecipes() {
  return [
    {
      id: makeId("recipe"),
      name: "Lemon Spinach Pasta",
      emoji: "🍝",
      time: "18 min",
      difficulty: "Easy",
      ingredients: ["Spinach", "Pasta", "Lemon", "Garlic"],
      steps: [
        "Boil pasta until al dente.",
        "Saute garlic and spinach in olive oil.",
        "Toss everything with pasta water and lemon juice."
      ]
    }
  ];
}

function seedListings() {
  return [
    { id: makeId("listing"), name: "Family Pasta Pack", seller: "Nina's Kitchen", price: 8, distance: "1.2 km", expiry: "Today", pickup: "6:30 PM - 8:00 PM", isFree: false, saved: true },
    { id: makeId("listing"), name: "Fresh Produce Box", seller: "Green Basket", price: 0, distance: "0.8 km", expiry: "Today", pickup: "4:00 PM - 7:00 PM", isFree: true, saved: false },
    { id: makeId("listing"), name: "Bakery Rescue Bag", seller: "Bread & Bloom", price: 5, distance: "2.9 km", expiry: "Tomorrow", pickup: "8:00 PM - 9:30 PM", isFree: false, saved: false }
  ];
}

function seedRestaurantDeals() {
  return [
    { id: makeId("deal"), name: "Fork & Flame", cuisine: "Mediterranean", deal: "50% off after 9pm", distance: 1.4, rating: 4.8, discount: 50 },
    { id: makeId("deal"), name: "The Green Table", cuisine: "Vegan", deal: "Free rescue dessert with dinner", distance: 2.1, rating: 4.7, discount: 25 },
    { id: makeId("deal"), name: "Urban Bento", cuisine: "Japanese", deal: "30% off surplus rice bowls", distance: 3.2, rating: 4.6, discount: 30 },
    { id: makeId("deal"), name: "Spice Yard", cuisine: "Indian", deal: "2 rescue meals for $12", distance: 4.4, rating: 4.9, discount: 35 }
  ];
}

function seedSavingsHistory() {
  return [
    { month: "Jan", saved: 90, wasted: 120 },
    { month: "Feb", saved: 110, wasted: 110 },
    { month: "Mar", saved: 145, wasted: 92 },
    { month: "Apr", saved: 162, wasted: 74 },
    { month: "May", saved: 188, wasted: 68 },
    { month: "Jun", saved: 214, wasted: 49 }
  ];
}

function seedWasteBreakdown() {
  return [
    { name: "Vegetables", value: 38 },
    { name: "Dairy", value: 22 },
    { name: "Meat", value: 16 },
    { name: "Bakery", value: 14 },
    { name: "Fruit", value: 10 }
  ];
}

function useLocalStorageState(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = window.localStorage.getItem(key);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return typeof initialValue === "function" ? initialValue() : initialValue;
      }
    }
    return typeof initialValue === "function" ? initialValue() : initialValue;
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

function getExpiryDetails(expiryDate) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  const diffDays = Math.round((expiry.getTime() - now.getTime()) / 86400000);

  if (diffDays < 0) return { label: "Expired", tone: "bg-slate-800/90 text-slate-200 border-slate-600/60", badge: "Expired", icon: "⚫" };
  if (diffDays <= 1) return { label: "Expiring Today/Tomorrow", tone: "bg-red-500/10 text-red-200 border-red-400/30", badge: "Expiring", icon: "🔴" };
  if (diffDays <= 7) return { label: "Use Soon", tone: "bg-amber-500/10 text-amber-100 border-amber-400/30", badge: "Use Soon", icon: "🟡" };
  return { label: "Fresh", tone: "bg-emerald-500/10 text-emerald-100 border-emerald-400/30", badge: "Fresh", icon: "🟢" };
}

function formatJoinDate(dateString) {
  return new Date(dateString).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function buildFallbackRecipes(items) {
  const ingredientNames = items.slice(0, 5).map((item) => item.name);
  const base = ingredientNames.length ? ingredientNames : ["spinach", "bread", "yogurt"];

  return [
    { id: makeId("recipe"), emoji: "🥗", name: `${base[0]} Power Bowl`, ingredients: [...base, "olive oil", "lemon", "salt"], time: "15 min", difficulty: "Easy", steps: ["Chop the freshest ingredients into bite-sized pieces.", "Warm any cooked items and layer them in a bowl.", "Finish with lemon, olive oil, and a pinch of salt."] },
    { id: makeId("recipe"), emoji: "🍳", name: `${base[0]} & ${base[1] || "Veggie"} Skillet`, ingredients: [...base.slice(0, 3), "garlic", "pepper"], time: "20 min", difficulty: "Medium", steps: ["Saute aromatics in a skillet with a little oil.", "Add the quickest-expiring ingredients and cook until tender.", "Serve hot with toast, rice, or noodles."] },
    { id: makeId("recipe"), emoji: "🥪", name: `Rescue Toast with ${base[0]}`, ingredients: [base[0], base[1] || "bread", "cheese", "herbs"], time: "12 min", difficulty: "Easy", steps: ["Toast bread or warm a wrap.", "Layer on cooked or fresh ingredients that need to be used soon.", "Top with herbs and serve immediately."] }
  ];
}

function parseClaudeRecipes(text) {
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) throw new Error("Claude response did not contain a JSON array.");
  const parsed = JSON.parse(match[0]);
  return parsed.map((recipe) => ({
    id: makeId("recipe"),
    emoji: recipe.emoji || "🍽️",
    name: recipe.name,
    ingredients: recipe.ingredients || [],
    steps: recipe.steps || [],
    time: recipe.time || "20 min",
    difficulty: recipe.difficulty || "Medium"
  }));
}

async function fetchClaudeRecipes(items) {
  const ingredientList = items.map((item) => `${item.name} (${item.qty})`).join(", ");
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY || window.__ANTHROPIC_API_KEY || "";
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "anthropic-version": "2023-06-01",
      ...(apiKey ? { "x-api-key": apiKey } : {})
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content:
            `Based on these ingredients: ${ingredientList}. ` +
            'Suggest 3 quick recipes with steps. Return JSON array with: name, ingredients, steps (array), time, difficulty, emoji.'
        }
      ]
    })
  });

  if (!response.ok) throw new Error(`Claude request failed with status ${response.status}`);
  const data = await response.json();
  const text = data?.content?.map((entry) => entry.text || "").join("\n") || "";
  return parseClaudeRecipes(text);
}

function AnimatedCounter({ value, prefix = "", suffix = "", decimals = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const motionValue = useMotionValue(0);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return undefined;
    const controls = animate(motionValue, value, {
      duration: 1.4,
      ease: "easeOut",
      onUpdate: (latest) => setDisplay(Number(latest.toFixed(decimals)))
    });
    return () => controls.stop();
  }, [decimals, inView, motionValue, value]);

  return (
    <span ref={ref} className="font-mono text-3xl font-bold text-white sm:text-4xl">
      {prefix}
      {decimals ? display.toFixed(decimals) : Math.round(display).toLocaleString()}
      {suffix}
    </span>
  );
}

function GlowButton({ children, className = "", ...props }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 px-5 py-3 font-medium transition ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}

function SectionShell({ children, className = "", id }) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.65, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

function MeshBackground() {
  const dots = Array.from({ length: 18 }, (_, index) => ({
    id: index,
    left: `${(index * 7) % 100}%`,
    top: `${(index * 13) % 100}%`,
    delay: index * 0.22
  }));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div animate={{ x: [0, 32, -20, 0], y: [0, -24, 28, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} className="absolute left-[-12%] top-[-10%] h-80 w-80 rounded-full bg-primary/30 blur-3xl" />
      <motion.div animate={{ x: [0, -18, 26, 0], y: [0, 24, -18, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} className="absolute right-[-8%] top-[20%] h-96 w-96 rounded-full bg-amber-400/20 blur-3xl" />
      <motion.div animate={{ scale: [1, 1.08, 1], opacity: [0.2, 0.35, 0.2] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-[-8%] left-[30%] h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
      {dots.map((dot) => (
        <motion.span key={dot.id} initial={{ opacity: 0.1, scale: 0.8 }} animate={{ opacity: [0.1, 0.5, 0.1], scale: [0.8, 1.15, 0.8] }} transition={{ duration: 4 + dot.id * 0.18, repeat: Infinity, ease: "easeInOut", delay: dot.delay }} className="absolute h-1.5 w-1.5 rounded-full bg-white/40" style={{ left: dot.left, top: dot.top }} />
      ))}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_30%),linear-gradient(135deg,rgba(16,185,129,0.08),transparent_40%)]" />
    </div>
  );
}

function HeroVisual() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-6, 6]);

  return (
    <motion.div ref={ref} style={{ y }} className="relative mx-auto w-full max-w-2xl">
      <motion.div style={{ rotate }} className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-5 shadow-soft backdrop-blur-xl">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-400/80" />
            <span className="h-3 w-3 rounded-full bg-amber-400/80" />
            <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
          </div>
          <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200">Live dashboard</span>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[28px] border border-white/10 bg-slate-950/50 p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Kitchen Snapshot</p>
                <h3 className="mt-2 font-display text-2xl text-white">Waste risk under control</h3>
              </div>
              <Leaf className="text-primary" />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ["Items in fridge", "24"],
                ["Saved this month", "$47"],
                ["Waste avoided", "2.1 kg"]
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs text-slate-400">{label}</p>
                  <p className="mt-2 font-mono text-2xl font-bold text-white">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 space-y-3">
              {[
                ["Spinach", "Use within 24 hours", "92%"],
                ["Greek Yogurt", "Good for breakfast bowls", "81%"],
                ["Sourdough Bread", "Perfect for toast recipe", "77%"]
              ].map(([name, note, value]) => (
                <div key={name} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <div>
                    <p className="font-medium text-white">{name}</p>
                    <p className="text-sm text-slate-400">{note}</p>
                  </div>
                  <span className="text-sm font-semibold text-emerald-300">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="rounded-[28px] border border-white/10 bg-gradient-to-br from-emerald-500/20 via-white/5 to-amber-400/10 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-400">AI Recipes</p>
                  <h4 className="mt-2 font-display text-xl text-white">Veggie Stir Fry Bowl</h4>
                </div>
                <ChefHat className="text-amber-300" />
              </div>
              <p className="mt-4 text-sm text-slate-300">Quick rescue recipe using spinach, peppers, and yogurt sauce.</p>
            </motion.div>

            <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }} className="rounded-[28px] border border-white/10 bg-white/5 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Expiry Alerts</p>
                  <h4 className="mt-2 font-display text-xl text-white">3 items expiring soon</h4>
                </div>
                <AlertTriangle className="text-red-300" />
              </div>
              <div className="mt-4 space-y-2">
                {["Spinach", "Sourdough Bread", "Blueberries"].map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-slate-300">
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Toasts({ toasts, dismissToast }) {
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[80] flex w-full max-w-sm flex-col gap-3">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div key={toast.id} initial={{ opacity: 0, y: -24, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -18, scale: 0.96 }} className="pointer-events-auto rounded-2xl border border-white/10 bg-slate-950/80 p-4 shadow-soft backdrop-blur-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-white">{toast.title}</p>
                <p className="mt-1 text-sm text-slate-400">{toast.message}</p>
              </div>
              <button type="button" onClick={() => dismissToast(toast.id)} className="rounded-full border border-white/10 p-1 text-slate-300 transition hover:text-white">
                <X size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function LandingPage({ onGetStarted, onTryDemo, onDownload, onOpenAuth }) {
  const heroWords = "Save Money & Reduce Food Waste with AI-Powered Kitchen Tracking".split(" ");
  const [newsletter, setNewsletter] = useState("");
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTestimonialIndex((current) => (current + 1) % TESTIMONIALS.length);
    }, 4200);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <motion.div
      key="landing"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="relative min-h-screen overflow-hidden"
    >
      <MeshBackground />
      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-4 rounded-[28px] border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-amber-300 text-slate-950">
              <Leaf size={22} />
            </div>
            <div>
              <p className="font-display text-xl font-bold text-white">FreshMind</p>
              <p className="text-sm text-slate-400">AI kitchen intelligence</p>
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
            <a href="#how-it-works" className="transition hover:text-white">How it works</a>
            <a href="#features" className="transition hover:text-white">Features</a>
            <a href="#testimonials" className="transition hover:text-white">Testimonials</a>
            <a href="#footer" className="transition hover:text-white">Contact</a>
          </nav>

          <div className="flex items-center gap-3">
            <GlowButton onClick={onOpenAuth} className="bg-transparent text-white hover:border-white/20">
              Sign in
            </GlowButton>
            <GlowButton onClick={onGetStarted} className="border-primary/40 bg-primary/20 text-white shadow-glow">
              Get Started
            </GlowButton>
          </div>
        </motion.header>

        <section className="grid min-h-[calc(100vh-8rem)] items-center gap-14 pb-16 pt-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-200">
              <Sparkles size={16} />
              Built for modern kitchens, food lovers, and zero-waste habits
            </motion.p>

            <div className="max-w-3xl font-display text-5xl font-extrabold leading-[0.95] tracking-tight text-white sm:text-6xl xl:text-7xl">
              {heroWords.map((word, index) => (
                <motion.span key={`${word}-${index}`} initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * index, duration: 0.45, ease: "easeOut" }} className="mr-4 inline-block">
                  {word}
                </motion.span>
              ))}
            </div>

            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              Track expiry dates, get AI recipe suggestions, and join the fight against food waste all in one place.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="mt-8 flex flex-wrap items-center gap-4">
              <GlowButton onClick={onGetStarted} className="border-primary/30 bg-primary/20 text-white shadow-glow">
                <ArrowRight size={18} />
                Get Started
              </GlowButton>
              <GlowButton onClick={onTryDemo} className="bg-white/5 text-white">
                <PartyPopper size={18} />
                Try Demo
              </GlowButton>
              <GlowButton onClick={onDownload} className="bg-white/5 text-white">
                <span className="text-base">📱</span>
                Download App
              </GlowButton>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                ["AI Recipe Guidance", "Turn fridge chaos into quick recipes."],
                ["Expiry Intelligence", "Know what to use today and what stays fresh."],
                ["Savings Visibility", "See how much waste you prevented every month."]
              ].map(([title, body]) => (
                <div key={title} className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
                  <p className="font-medium text-white">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{body}</p>
                </div>
              ))}
            </motion.div>
          </div>

          <HeroVisual />
        </section>

        <SectionShell className="rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-8">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {HERO_STATS.map((stat) => (
              <div key={stat.label} className="rounded-[28px] border border-white/10 bg-slate-950/30 p-5">
                <AnimatedCounter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                <p className="mt-3 text-sm text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </SectionShell>

        <SectionShell id="how-it-works" className="mt-24">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.35em] text-emerald-300">How it works</p>
            <h2 className="mt-4 font-display text-4xl font-bold text-white sm:text-5xl">A simple flow that turns food tracking into action.</h2>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {HOW_IT_WORKS.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.article key={step.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ delay: index * 0.12, duration: 0.5 }} className="rounded-[30px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300">
                    <Icon size={24} />
                  </div>
                  <p className="mt-6 text-sm uppercase tracking-[0.28em] text-slate-400">Step {index + 1}</p>
                  <h3 className="mt-3 font-display text-2xl text-white">{step.title}</h3>
                  <p className="mt-4 text-base leading-7 text-slate-400">{step.description}</p>
                </motion.article>
              );
            })}
          </div>
        </SectionShell>

        <SectionShell className="mt-24">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <p className="text-sm uppercase tracking-[0.35em] text-emerald-300">App screens</p>
              <h2 className="mt-4 font-display text-4xl font-bold text-white sm:text-5xl">Every important surface is already investor-ready.</h2>
            </div>
            <p className="max-w-xl text-base leading-7 text-slate-400">Dashboard analytics, AI recipes, and expiry alerts arrive with a polished visual language and motion-led storytelling.</p>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {SCREEN_PREVIEWS.map((screen, index) => (
              <motion.div key={screen.tag} initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ delay: index * 0.1, duration: 0.55 }} className="rounded-[34px] border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-5 backdrop-blur-xl">
                <div className="mx-auto flex min-h-[420px] max-w-[280px] flex-col overflow-hidden rounded-[34px] border border-white/10 bg-slate-950/70 p-4 shadow-soft">
                  <div className="mx-auto mb-4 h-1.5 w-16 rounded-full bg-white/10" />
                  <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-emerald-200">{screen.tag}</span>
                  <div className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-4">
                    <p className="font-display text-2xl text-white">{screen.title}</p>
                    <p className="mt-4 text-sm leading-6 text-slate-400">{screen.description}</p>
                  </div>
                  <div className="mt-4 grid gap-3">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                        <div className="h-2 rounded-full bg-white/10" />
                        <div className="mt-3 h-2 w-2/3 rounded-full bg-white/10" />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </SectionShell>

        <SectionShell id="features" className="mt-24">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.35em] text-emerald-300">Features</p>
            <h2 className="mt-4 font-display text-4xl font-bold text-white sm:text-5xl">A product surface designed around real food decisions.</h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {FEATURE_CARDS.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.article key={feature.title} whileHover={{ scale: 1.02, y: -6, rotateX: 4, rotateY: -4 }} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ delay: index * 0.06, duration: 0.45 }} style={{ transformPerspective: 1200 }} className="rounded-[30px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
                    <Icon size={24} />
                  </div>
                  <h3 className="mt-5 font-display text-2xl text-white">{feature.title}</h3>
                  <p className="mt-4 text-base leading-7 text-slate-400">{feature.description}</p>
                </motion.article>
              );
            })}
          </div>
        </SectionShell>

        <SectionShell id="testimonials" className="mt-24">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <p className="text-sm uppercase tracking-[0.35em] text-emerald-300">Testimonials</p>
              <h2 className="mt-4 font-display text-4xl font-bold text-white sm:text-5xl">Teams describe FreshMind like a product they actually want to keep open.</h2>
            </div>
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, index) => (
                <button key={index} type="button" onClick={() => setTestimonialIndex(index)} className={`h-2.5 w-10 rounded-full transition ${testimonialIndex === index ? "bg-emerald-300" : "bg-white/15"}`} />
              ))}
            </div>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[34px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <AnimatePresence mode="wait">
                <motion.div key={testimonialIndex} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: 0.35 }}>
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-amber-300 font-display text-2xl font-bold text-slate-950">
                      {TESTIMONIALS[testimonialIndex].name.split(" ").map((item) => item[0]).join("")}
                    </div>
                    <div>
                      <p className="font-display text-2xl text-white">{TESTIMONIALS[testimonialIndex].name}</p>
                      <p className="text-sm text-slate-400">{TESTIMONIALS[testimonialIndex].role}</p>
                    </div>
                  </div>
                  <p className="mt-8 text-2xl leading-10 text-slate-100">“{TESTIMONIALS[testimonialIndex].quote}”</p>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="grid gap-5">
              {TESTIMONIALS.map((testimonial) => (
                <div key={testimonial.name} className="rounded-[30px] border border-white/10 bg-slate-950/40 p-5">
                  <p className="font-medium text-white">{testimonial.name}</p>
                  <p className="mt-1 text-sm text-slate-400">{testimonial.role}</p>
                </div>
              ))}
            </div>
          </div>
        </SectionShell>

        <SectionShell className="mt-24 rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Trusted by</p>
              <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">Styled like a category leader from day one.</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {PARTNERS.map((partner) => (
                <motion.div key={partner} whileHover={{ scale: 1.04 }} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-slate-300 transition hover:text-white">
                  <ShieldCheck size={18} />
                  <span className="font-medium">{partner}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </SectionShell>

        <footer id="footer" className="mt-24 rounded-[32px] border border-white/10 bg-slate-950/50 p-6 backdrop-blur-xl sm:p-8">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr_0.8fr]">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-amber-300 text-slate-950">
                  <Leaf size={22} />
                </div>
                <div>
                  <p className="font-display text-2xl font-bold text-white">FreshMind</p>
                  <p className="text-sm text-slate-400">AI-powered kitchen tracking</p>
                </div>
              </div>
              <p className="mt-5 max-w-md text-base leading-7 text-slate-400">Built for people who want fewer forgotten ingredients, better meals, and a more intelligent kitchen.</p>
            </div>

            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Navigation</p>
              <div className="mt-4 grid gap-3 text-slate-300">
                {["Product", "Recipes", "Marketplace", "Alerts", "Contact"].map((item) => (
                  <a key={item} href="#" className="transition hover:text-white">{item}</a>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Newsletter</p>
              <div className="mt-4 flex flex-col gap-3">
                <input value={newsletter} onChange={(event) => setNewsletter(event.target.value)} placeholder="Enter your email" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-400/20" />
                <GlowButton onClick={() => setNewsletter("")} className="w-full justify-center bg-primary/20 text-white">
                  Join Newsletter
                </GlowButton>
                <div className="flex gap-3 text-slate-400">
                  {[Globe, Sparkles, Leaf].map((Icon, index) => (
                    <div key={index} className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                      <Icon size={18} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </motion.div>
  );
}

function AuthPage({ authMode, setAuthMode, onBack, onAuthSubmit, onTryDemo, onGoogle, errorMessage }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  useEffect(() => {
    if (errorMessage) setShakeKey((value) => value + 1);
  }, [errorMessage]);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function submit(event) {
    event.preventDefault();
    onAuthSubmit(form);
  }

  return (
    <motion.div key="auth" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.4 }} className="relative min-h-screen overflow-hidden">
      <MeshBackground />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="flex flex-col justify-center">
            <button type="button" onClick={onBack} className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white">
              <ChevronRight className="rotate-180" size={16} />
              Back to landing
            </button>
            <p className="text-sm uppercase tracking-[0.35em] text-emerald-300">FreshMind Access</p>
            <h1 className="mt-4 font-display text-5xl font-bold text-white sm:text-6xl">Build a smarter kitchen routine in minutes.</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">Login or create your account to unlock AI recipe suggestions, savings analytics, marketplace tools, and expiry alerts.</p>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                ["24 items", "Tracked instantly"],
                ["3 alerts", "Ready this morning"],
                ["$47 saved", "This month"]
              ].map(([value, label]) => (
                <div key={value} className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
                  <p className="font-mono text-2xl font-bold text-white">{value}</p>
                  <p className="mt-2 text-sm text-slate-400">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <motion.div key={shakeKey} animate={errorMessage ? { x: [0, -10, 10, -8, 8, 0] } : { x: 0 }} transition={{ duration: 0.45 }} className="rounded-[36px] border border-white/10 bg-white/10 p-6 shadow-soft backdrop-blur-2xl sm:p-8">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Authentication</p>
                <h2 className="mt-2 font-display text-3xl text-white">{authMode === "login" ? "Welcome back" : "Create your account"}</h2>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
                <User2 size={22} />
              </div>
            </div>

            <LayoutGroup>
              <div className="relative mb-8 flex rounded-2xl border border-white/10 bg-slate-950/60 p-1">
                {["login", "signup"].map((mode) => (
                  <button key={mode} type="button" onClick={() => setAuthMode(mode)} className={`relative z-10 flex-1 rounded-2xl px-4 py-3 text-sm font-medium capitalize transition ${authMode === mode ? "text-white" : "text-slate-400"}`}>
                    {authMode === mode && <motion.span layoutId="auth-pill" className="absolute inset-0 rounded-2xl bg-emerald-400/15" transition={{ type: "spring", stiffness: 320, damping: 28 }} />}
                    <span className="relative z-10">{mode}</span>
                  </button>
                ))}
              </div>
            </LayoutGroup>

            <form onSubmit={submit} className="space-y-5">
              <AnimatePresence initial={false}>
                {authMode === "signup" ? (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                    <label className="block text-sm text-slate-300">
                      <span className="mb-2 block">Name</span>
                      <motion.input whileFocus={{ scale: 1.01 }} value={form.name} onChange={(event) => updateField("name", event.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-400/20" placeholder="Your full name" />
                    </label>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <label className="block text-sm text-slate-300">
                <span className="mb-2 block">Email</span>
                <motion.input whileFocus={{ scale: 1.01 }} value={form.email} onChange={(event) => updateField("email", event.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-400/20" type="email" placeholder="you@freshmind.app" />
              </label>

              <label className="block text-sm text-slate-300">
                <span className="mb-2 block">Password</span>
                <div className="relative">
                  <motion.input whileFocus={{ scale: 1.01 }} value={form.password} onChange={(event) => updateField("password", event.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 pr-12 text-white outline-none transition focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-400/20" type={showPassword ? "text" : "password"} placeholder="At least 6 characters" />
                  <button type="button" onClick={() => setShowPassword((current) => !current)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/10 p-2 text-slate-400 transition hover:text-white">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </label>

              {errorMessage ? <p className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">{errorMessage}</p> : null}

              <GlowButton type="submit" className="w-full justify-center bg-primary/20 text-white shadow-glow">
                {authMode === "login" ? "Login to Dashboard" : "Create FreshMind Account"}
              </GlowButton>

              <GlowButton type="button" onClick={onGoogle} className="w-full justify-center bg-white/5 text-white">
                <Globe size={18} />
                Continue with Google
              </GlowButton>

              <button type="button" onClick={onTryDemo} className="w-full rounded-2xl border border-dashed border-emerald-400/30 bg-emerald-400/5 px-4 py-3 text-sm font-medium text-emerald-200 transition hover:bg-emerald-400/10">
                Try Demo Account
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

function DashboardHome({ currentUser, foodItems, savingsHistory, wasteBreakdown, savedRecipes }) {
  const expiringSoon = foodItems.filter((item) => {
    const details = getExpiryDetails(item.expiry);
    return details.badge === "Use Soon" || details.badge === "Expiring";
  }).length;
  const totalSavings = savingsHistory[savingsHistory.length - 1]?.saved || 0;
  const totalWasteAvoided = (
    foodItems.reduce((sum, item) => sum + (getExpiryDetails(item.expiry).badge === "Expired" ? 0.12 : 0.35), 0) + 0.7
  ).toFixed(1);

  return (
    <motion.div key="dashboard-home" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.35 }} className="space-y-6">
      <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-emerald-500/20 via-white/5 to-amber-400/10 p-6 backdrop-blur-xl lg:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-200">Overview</p>
            <h1 className="mt-3 font-display text-4xl font-bold text-white">Good morning, {currentUser.name}! You have {expiringSoon} items expiring soon 🚨</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">FreshMind is tracking your kitchen health, surfacing waste risk, and highlighting recipe opportunities before ingredients are lost.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-950/40 px-5 py-4">
            <p className="text-sm text-slate-400">Member since</p>
            <p className="mt-2 font-mono text-xl text-white">{formatJoinDate(currentUser.joined)}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Items in fridge", value: foodItems.length, icon: Refrigerator },
          { label: "Money saved this month", value: `$${totalSavings}`, icon: CircleDollarSign },
          { label: "Waste avoided", value: `${totalWasteAvoided} kg`, icon: Leaf },
          { label: "Recipes tried", value: savedRecipes.length + 7, icon: ChefHat }
        ].map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="rounded-[30px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">{card.label}</span>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
                  <Icon size={20} />
                </div>
              </div>
              <p className="mt-5 font-mono text-3xl font-bold text-white">{card.value}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl lg:p-6">
          <div className="mb-5">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Savings Over Time</p>
            <h2 className="mt-2 font-display text-2xl text-white">Your six-month progress</h2>
          </div>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={savingsHistory}>
                <XAxis dataKey="month" stroke="#94A3B8" tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#111827", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 18 }} />
                <Line type="monotone" dataKey="saved" stroke="#10B981" strokeWidth={3} dot={{ fill: "#10B981" }} />
                <Line type="monotone" dataKey="wasted" stroke="#F59E0B" strokeWidth={3} dot={{ fill: "#F59E0B" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl lg:p-6">
          <div className="mb-5">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Waste Breakdown</p>
            <h2 className="mt-2 font-display text-2xl text-white">Where you lose the most value</h2>
          </div>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={wasteBreakdown} dataKey="value" innerRadius={72} outerRadius={110} paddingAngle={4}>
                  {wasteBreakdown.map((entry, index) => (
                    <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#111827", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 18 }} />
                <Legend wrapperStyle={{ color: "#94A3B8" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl lg:p-6">
          <div className="mb-5">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Savings Tracker</p>
            <h2 className="mt-2 font-display text-2xl text-white">Saved vs. would have wasted</h2>
          </div>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={savingsHistory}>
                <XAxis dataKey="month" stroke="#94A3B8" tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#111827", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 18 }} />
                <Legend wrapperStyle={{ color: "#94A3B8" }} />
                <Bar dataKey="saved" fill="#10B981" radius={[12, 12, 0, 0]} />
                <Bar dataKey="wasted" fill="#F59E0B" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[32px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl lg:p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Milestones</p>
            <div className="mt-5 flex flex-wrap gap-3">
              {["Saved $50!", "Zero Waste Week!", "Recipe Hero", "Market Donor"].map((badge) => (
                <motion.div key={badge} whileHover={{ scale: 1.04 }} className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
                  {badge}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-slate-950/80 to-emerald-500/10 p-5 backdrop-blur-xl lg:p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Shareable Savings Card</p>
            <div className="mt-4 rounded-[30px] border border-white/10 bg-white/5 p-5">
              <p className="font-display text-3xl text-white">FreshMind Impact</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div><p className="text-sm text-slate-400">Monthly savings</p><p className="mt-1 font-mono text-2xl text-white">${totalSavings}</p></div>
                <div><p className="text-sm text-slate-400">Meals rescued</p><p className="mt-1 font-mono text-2xl text-white">24</p></div>
                <div><p className="text-sm text-slate-400">Waste avoided</p><p className="mt-1 font-mono text-2xl text-white">{totalWasteAvoided} kg</p></div>
                <div><p className="text-sm text-slate-400">Saved recipes</p><p className="mt-1 font-mono text-2xl text-white">{savedRecipes.length}</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function MyFoodPage({ foodItems, setFoodItems, addToast }) {
  const [filter, setFilter] = useState("all");
  const [form, setForm] = useState({ name: "", category: "Vegetables", qty: "", expiry: isoFromDays(5) });

  function addItem(event) {
    event.preventDefault();
    if (!form.name.trim() || !form.qty.trim() || !form.expiry) {
      addToast("Missing details", "Add a name, quantity, and expiry date.");
      return;
    }
    setFoodItems((current) => [
      { id: makeId("food"), name: form.name.trim(), category: form.category, qty: form.qty.trim(), expiry: form.expiry, addedDate: isoFromDays(0), reminder: false },
      ...current
    ]);
    setForm({ name: "", category: "Vegetables", qty: "", expiry: isoFromDays(5) });
    addToast("Food added", "Your fridge tracker has been updated.");
  }

  function removeItem(itemId) {
    setFoodItems((current) => current.filter((item) => item.id !== itemId));
    addToast("Item removed", "The food item was deleted from your tracker.");
  }

  const filteredItems = foodItems.filter((item) => {
    const details = getExpiryDetails(item.expiry);
    if (filter === "all") return true;
    if (filter === "fresh") return details.badge === "Fresh";
    if (filter === "expiring") return details.badge === "Use Soon" || details.badge === "Expiring";
    if (filter === "expired") return details.badge === "Expired";
    return true;
  });

  return (
    <motion.div key="food-page" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }} className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl lg:p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Add Food Item</p>
          <h2 className="mt-2 font-display text-2xl text-white">Keep your fridge current</h2>
          <form onSubmit={addItem} className="mt-6 space-y-4">
            <input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} placeholder="Food name" className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-400/20" />
            <select value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-400/20">
              {["Vegetables", "Fruit", "Dairy", "Meat", "Bakery", "Pantry"].map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
            <input value={form.qty} onChange={(event) => setForm((current) => ({ ...current, qty: event.target.value }))} placeholder="Quantity" className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-400/20" />
            <input type="date" value={form.expiry} onChange={(event) => setForm((current) => ({ ...current, expiry: event.target.value }))} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-400/20" />
            <GlowButton type="submit" className="w-full justify-center bg-primary/20 text-white shadow-glow">
              <Package2 size={18} />
              Add to Fridge
            </GlowButton>
          </form>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl lg:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Filter Items</p>
              <h2 className="mt-2 font-display text-2xl text-white">Track freshness at a glance</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                ["all", "All"],
                ["fresh", "Fresh"],
                ["expiring", "Expiring"],
                ["expired", "Expired"]
              ].map(([value, label]) => (
                <button key={value} type="button" onClick={() => setFilter(value)} className={`rounded-full px-4 py-2 text-sm transition ${filter === value ? "bg-emerald-400/15 text-emerald-200" : "border border-white/10 bg-white/5 text-slate-400"}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            <AnimatePresence>
              {filteredItems.map((item) => {
                const details = getExpiryDetails(item.expiry);
                return (
                  <motion.div key={item.id} layout drag="x" dragConstraints={{ left: 0, right: 0 }} onDragEnd={(_, info) => { if (info.offset.x < -120 && window.confirm(`Delete ${item.name}?`)) removeItem(item.id); }} whileHover={{ scale: 1.01 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -80 }} className={`rounded-[28px] border p-5 ${details.tone}`}>
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{details.icon}</span>
                          <p className="font-display text-2xl text-white">{item.name}</p>
                        </div>
                        <p className="mt-2 text-sm text-slate-300">{item.category} · {item.qty} · Expires {item.expiry}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs uppercase tracking-[0.28em] text-white/80">{details.badge}</span>
                        <button type="button" onClick={() => { if (window.confirm(`Delete ${item.name}?`)) removeItem(item.id); }} className="rounded-full border border-white/10 p-3 text-slate-200 transition hover:bg-white/10">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function RecipesPage({ foodItems, recipeSuggestions, setRecipeSuggestions, savedRecipes, setSavedRecipes, addToast }) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState("");
  const [loading, setLoading] = useState(false);
  const [recipeError, setRecipeError] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [sourceLabel, setSourceLabel] = useState("");

  async function suggestRecipes() {
    if (!foodItems.length) {
      setRecipeError("Add at least one food item before requesting recipes.");
      return;
    }

    setRecipeError("");
    setLoading(true);
    try {
      const recipes = await fetchClaudeRecipes(foodItems);
      setRecipeSuggestions(recipes);
      setSourceLabel("Live Claude response");
      addToast("AI recipes ready", "Claude returned three recipe suggestions.");
    } catch {
      const fallback = buildFallbackRecipes(foodItems);
      setRecipeSuggestions(fallback);
      setRecipeError("Live Claude API is unavailable right now, so FreshMind generated smart fallback recipes.");
      setSourceLabel("Fallback recipe engine");
    } finally {
      setLoading(false);
    }
  }

  function saveRecipe(recipe) {
    if (savedRecipes.some((item) => item.name === recipe.name)) {
      addToast("Already saved", `${recipe.name} is already in your saved recipes.`);
      return;
    }
    setSavedRecipes((current) => [recipe, ...current]);
    addToast("Recipe saved", `${recipe.name} was added to your recipe collection.`);
  }

  async function shareRecipe(recipe) {
    const shareText = `${recipe.emoji} ${recipe.name} - ${recipe.time} - ${recipe.ingredients.join(", ")}`;
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(shareText);
      addToast("Copied to clipboard", `${recipe.name} is ready to share.`);
      return;
    }
    addToast("Share ready", shareText);
  }

  return (
    <motion.div key="recipes-page" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }} className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[0.88fr_1.12fr]">
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl lg:p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">AI Recipe Suggestions</p>
          <h2 className="mt-2 font-display text-2xl text-white">Upload a photo of your food or fridge</h2>

          <motion.div onDragEnter={() => setDragActive(true)} onDragLeave={() => setDragActive(false)} className={`mt-6 rounded-[28px] border border-dashed p-8 text-center transition ${dragActive ? "border-emerald-400/50 bg-emerald-400/10" : "border-white/10 bg-slate-950/40"}`}>
            <motion.div animate={loading ? { rotate: 360 } : { rotate: 0 }} transition={loading ? { duration: 1.2, repeat: Infinity, ease: "linear" } : undefined} className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-400/10 text-emerald-300">
              {loading ? <CookingPot size={26} /> : <Upload size={26} />}
            </motion.div>
            <p className="mt-5 text-lg font-medium text-white">Drag and drop or browse an image</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">FreshMind can also work directly from your current fridge inventory.</p>
            <label className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition hover:bg-white/10">
              <Upload size={16} />
              Choose File
              <input type="file" className="hidden" onChange={(event) => setUploadedFile(event.target.files?.[0]?.name || "")} />
            </label>
            {uploadedFile ? <p className="mt-3 text-sm text-emerald-200">Uploaded: {uploadedFile}</p> : null}
          </motion.div>

          <div className="mt-6 flex flex-wrap gap-3">
            <GlowButton onClick={suggestRecipes} className="bg-primary/20 text-white shadow-glow">
              <Sparkles size={18} />
              Suggest Recipes
            </GlowButton>
            <GlowButton onClick={() => setRecipeSuggestions(buildFallbackRecipes(foodItems))} className="bg-white/5 text-white">
              <ChefHat size={18} />
              Use Smart Fallback
            </GlowButton>
          </div>

          {recipeError ? <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-5 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">{recipeError}</motion.div> : null}
        </div>

        <div className="rounded-[32px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl lg:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Recipe Output</p>
              <h2 className="mt-2 font-display text-2xl text-white">Beautiful, structured recipe cards</h2>
            </div>
            {sourceLabel ? <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs uppercase tracking-[0.28em] text-emerald-200">{sourceLabel}</span> : null}
          </div>

          <div className="mt-6 grid gap-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <motion.div key={index} animate={{ opacity: [0.45, 0.8, 0.45] }} transition={{ duration: 1.2, repeat: Infinity, delay: index * 0.15 }} className="rounded-[28px] border border-white/10 bg-slate-950/40 p-5">
                  <div className="h-5 w-40 rounded-full bg-white/10" />
                  <div className="mt-4 h-4 w-56 rounded-full bg-white/10" />
                  <div className="mt-3 h-24 rounded-3xl bg-white/5" />
                </motion.div>
              ))
            ) : recipeSuggestions.length ? (
              recipeSuggestions.map((recipe) => (
                <motion.article key={recipe.id} layout whileHover={{ scale: 1.01, y: -4 }} className="rounded-[28px] border border-white/10 bg-slate-950/45 p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-3xl">{recipe.emoji}</p>
                      <h3 className="mt-3 font-display text-2xl text-white">{recipe.name}</h3>
                      <p className="mt-2 text-sm text-slate-400">{recipe.time} · {recipe.difficulty}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <GlowButton onClick={() => saveRecipe(recipe)} className="bg-primary/15 text-white">
                        <Heart size={16} />
                        Save Recipe
                      </GlowButton>
                      <GlowButton onClick={() => shareRecipe(recipe)} className="bg-white/5 text-white">
                        <ArrowRight size={16} />
                        Share
                      </GlowButton>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {recipe.ingredients.map((ingredient) => (
                      <span key={ingredient} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                        {ingredient}
                      </span>
                    ))}
                  </div>

                  <button type="button" onClick={() => setExpanded((current) => (current === recipe.id ? null : recipe.id))} className="mt-5 text-sm font-medium text-emerald-200 transition hover:text-white">
                    {expanded === recipe.id ? "Hide steps" : "Show steps"}
                  </button>

                  <AnimatePresence initial={false}>
                    {expanded === recipe.id ? (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                        <div className="mt-4 space-y-3 rounded-3xl border border-white/10 bg-white/5 p-4">
                          {recipe.steps.map((step, index) => (
                            <div key={step} className="flex gap-3 text-sm text-slate-300">
                              <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400/15 text-xs text-emerald-200">{index + 1}</span>
                              <p className="leading-6">{step}</p>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </motion.article>
              ))
            ) : (
              <div className="rounded-[28px] border border-white/10 bg-slate-950/40 p-6 text-slate-400">Generate recipes from your current food list to see AI output here.</div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function AlertsPage({ foodItems, setFoodItems, setMarketplaceListings, addToast }) {
  const alerts = [...foodItems].sort((a, b) => new Date(a.expiry) - new Date(b.expiry));

  function toggleReminder(itemId) {
    setFoodItems((current) => current.map((item) => (item.id === itemId ? { ...item, reminder: !item.reminder } : item)));
  }

  function markAsUsed(itemId) {
    setFoodItems((current) => current.filter((item) => item.id !== itemId));
    addToast("Marked as used", "Great job preventing extra food waste.");
  }

  function donateToMarketplace(item) {
    setMarketplaceListings((current) => [
      { id: makeId("listing"), name: `${item.name} Bundle`, seller: "You", price: 0, distance: "0.5 km", expiry: "Today", pickup: "Tonight", isFree: true, saved: false },
      ...current
    ]);
    setFoodItems((current) => current.filter((entry) => entry.id !== item.id));
    addToast("Donated to marketplace", `${item.name} is now listed for local pickup.`);
  }

  return (
    <motion.div key="alerts-page" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }} className="space-y-6">
      <div className="rounded-[32px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl lg:p-6">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Expiry Alerts</p>
        <h2 className="mt-2 font-display text-2xl text-white">A timeline of what needs attention next</h2>
        <div className="mt-8 space-y-4">
          {alerts.map((item, index) => {
            const details = getExpiryDetails(item.expiry);
            return (
              <motion.div key={item.id} initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.06 }} className="grid gap-4 rounded-[28px] border border-white/10 bg-slate-950/45 p-5 lg:grid-cols-[auto_1fr_auto]">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-xl">{details.icon}</div>
                <div>
                  <p className="font-display text-2xl text-white">{item.name}</p>
                  <p className="mt-2 text-sm text-slate-400">{item.qty} · {item.category} · Expires {item.expiry}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <button type="button" onClick={() => toggleReminder(item.id)} className={`rounded-full px-4 py-2 text-sm transition ${item.reminder ? "bg-emerald-400/15 text-emerald-200" : "border border-white/10 bg-white/5 text-slate-400"}`}>
                      {item.reminder ? "Reminder On" : "Set Reminder"}
                    </button>
                    <span className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.28em] ${details.tone}`}>{details.label}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 lg:flex-col">
                  <GlowButton onClick={() => markAsUsed(item.id)} className="bg-primary/15 text-white">Mark as Used</GlowButton>
                  <GlowButton onClick={() => donateToMarketplace(item)} className="bg-white/5 text-white">Donate to Marketplace</GlowButton>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

function MarketplacePage({ marketplaceListings, setMarketplaceListings, restaurantDeals, addToast }) {
  const [listingFilter, setListingFilter] = useState("all");
  const [restaurantFilters, setRestaurantFilters] = useState({ distance: "all", cuisine: "all", discount: "all" });
  const [listingForm, setListingForm] = useState({ name: "", quantity: "", price: "", pickup: "", photo: "" });

  function addListing(event) {
    event.preventDefault();
    if (!listingForm.name.trim() || !listingForm.quantity.trim() || !listingForm.pickup.trim()) {
      addToast("Listing incomplete", "Add a name, quantity, and pickup time.");
      return;
    }
    const priceNumber = Number(listingForm.price || 0);
    setMarketplaceListings((current) => [
      { id: makeId("listing"), name: listingForm.name.trim(), seller: "You", price: priceNumber, distance: "0.7 km", expiry: "Today", pickup: listingForm.pickup.trim(), isFree: priceNumber === 0, saved: false },
      ...current
    ]);
    setListingForm({ name: "", quantity: "", price: "", pickup: "", photo: "" });
    addToast("Listing published", "Your food is now live in the marketplace.");
  }

  const filteredListings = marketplaceListings.filter((listing) => {
    if (listingFilter === "free") return listing.isFree;
    if (listingFilter === "paid") return !listing.isFree;
    if (listingFilter === "nearby") return Number.parseFloat(listing.distance) <= 1.5;
    if (listingFilter === "today") return listing.expiry === "Today";
    return true;
  });

  const filteredDeals = restaurantDeals.filter((deal) => {
    const distanceMatch = restaurantFilters.distance === "all" || (restaurantFilters.distance === "under2" && deal.distance <= 2) || (restaurantFilters.distance === "under5" && deal.distance <= 5);
    const cuisineMatch = restaurantFilters.cuisine === "all" || deal.cuisine === restaurantFilters.cuisine;
    const discountMatch = restaurantFilters.discount === "all" || (restaurantFilters.discount === "30" && deal.discount >= 30) || (restaurantFilters.discount === "50" && deal.discount >= 50);
    return distanceMatch && cuisineMatch && discountMatch;
  });

  return (
    <motion.div key="marketplace-page" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }} className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[0.88fr_1.12fr]">
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl lg:p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">List My Food</p>
          <h2 className="mt-2 font-display text-2xl text-white">Sell or share your extra food</h2>
          <form onSubmit={addListing} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">Photo</span>
              <input type="file" onChange={(event) => setListingForm((current) => ({ ...current, photo: event.target.files?.[0]?.name || "" }))} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none" />
            </label>
            <input value={listingForm.name} onChange={(event) => setListingForm((current) => ({ ...current, name: event.target.value }))} placeholder="Food name" className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none" />
            <input value={listingForm.quantity} onChange={(event) => setListingForm((current) => ({ ...current, quantity: event.target.value }))} placeholder="Quantity" className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none" />
            <input value={listingForm.price} onChange={(event) => setListingForm((current) => ({ ...current, price: event.target.value }))} placeholder="Price (0 for free)" className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none" />
            <input value={listingForm.pickup} onChange={(event) => setListingForm((current) => ({ ...current, pickup: event.target.value }))} placeholder="Pickup time" className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none" />
            <GlowButton type="submit" className="w-full justify-center bg-primary/20 text-white shadow-glow">
              <ShoppingBag size={18} />
              Publish Listing
            </GlowButton>
          </form>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl lg:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Leftover Marketplace</p>
              <h2 className="mt-2 font-display text-2xl text-white">Browse local rescue listings</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                ["all", "All"],
                ["free", "Free"],
                ["paid", "Paid"],
                ["nearby", "Nearby"],
                ["today", "Expiring Today"]
              ].map(([value, label]) => (
                <button key={value} type="button" onClick={() => setListingFilter(value)} className={`rounded-full px-4 py-2 text-sm transition ${listingFilter === value ? "bg-emerald-400/15 text-emerald-200" : "border border-white/10 bg-white/5 text-slate-400"}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            {filteredListings.map((listing) => (
              <motion.article key={listing.id} whileHover={{ scale: 1.01, y: -4 }} className="rounded-[28px] border border-white/10 bg-slate-950/45 p-5">
                <div className="grid gap-4 md:grid-cols-[140px_1fr_auto]">
                  <div className="rounded-[24px] bg-gradient-to-br from-emerald-400/20 to-amber-400/15 p-4">
                    <div className="flex h-full min-h-[110px] items-center justify-center rounded-[20px] border border-white/10 bg-slate-950/35 text-slate-200">
                      <Package2 />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-display text-2xl text-white">{listing.name}</h3>
                    <p className="mt-2 text-sm text-slate-400">{listing.seller} · {listing.distance} · Expires {listing.expiry}</p>
                    <p className="mt-3 text-lg font-semibold text-emerald-200">{listing.isFree ? "Free" : `$${listing.price}`}</p>
                    <p className="mt-1 text-sm text-slate-400">Pickup: {listing.pickup}</p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <GlowButton onClick={() => addToast("Contact started", `Message sent to ${listing.seller}.`)} className="bg-primary/15 text-white">Contact Seller</GlowButton>
                    <GlowButton onClick={() => setMarketplaceListings((current) => current.map((item) => item.id === listing.id ? { ...item, saved: !item.saved } : item))} className="bg-white/5 text-white">
                      <Heart size={16} className={listing.saved ? "fill-current text-rose-300" : ""} />
                      Save Listing
                    </GlowButton>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl lg:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Nearby Restaurants</p>
              <h2 className="mt-2 font-display text-2xl text-white">Surplus food deals around you</h2>
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              <select value={restaurantFilters.distance} onChange={(event) => setRestaurantFilters((current) => ({ ...current, distance: event.target.value }))} className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none">
                <option value="all">Distance</option>
                <option value="under2">Under 2 km</option>
                <option value="under5">Under 5 km</option>
              </select>
              <select value={restaurantFilters.cuisine} onChange={(event) => setRestaurantFilters((current) => ({ ...current, cuisine: event.target.value }))} className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none">
                <option value="all">Cuisine</option>
                <option value="Mediterranean">Mediterranean</option>
                <option value="Vegan">Vegan</option>
                <option value="Japanese">Japanese</option>
                <option value="Indian">Indian</option>
              </select>
              <select value={restaurantFilters.discount} onChange={(event) => setRestaurantFilters((current) => ({ ...current, discount: event.target.value }))} className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none">
                <option value="all">Discount</option>
                <option value="30">30%+</option>
                <option value="50">50%+</option>
              </select>
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            {filteredDeals.map((deal) => (
              <motion.article key={deal.id} whileHover={{ scale: 1.01, y: -4 }} className="rounded-[28px] border border-white/10 bg-slate-950/45 p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h3 className="font-display text-2xl text-white">{deal.name}</h3>
                    <p className="mt-2 text-sm text-slate-400">{deal.cuisine} · {deal.distance} km away</p>
                    <p className="mt-3 text-emerald-200">{deal.deal}</p>
                    <div className="mt-3 flex items-center gap-1 text-amber-300">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star key={index} size={14} className={index < Math.round(deal.rating) ? "fill-current" : ""} />
                      ))}
                      <span className="ml-2 text-sm text-slate-400">{deal.rating}</span>
                    </div>
                  </div>
                  <GlowButton onClick={() => addToast("Deal opened", `${deal.name} is ready to explore.`)} className="bg-primary/15 text-white">View Deal</GlowButton>
                </div>
              </motion.article>
            ))}
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl lg:p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Map Preview</p>
          <h2 className="mt-2 font-display text-2xl text-white">Pulsing deal map</h2>
          <div className="relative mt-6 h-[420px] overflow-hidden rounded-[30px] border border-white/10 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.1),transparent_45%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))]">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:40px_40px]" />
            {[
              { left: "26%", top: "38%" },
              { left: "58%", top: "48%" },
              { left: "72%", top: "28%" },
              { left: "42%", top: "70%" }
            ].map((dot, index) => (
              <motion.div key={index} className="absolute" style={{ left: dot.left, top: dot.top }} animate={{ scale: [1, 1.25, 1], opacity: [0.45, 1, 0.45] }} transition={{ duration: 2.4, repeat: Infinity, delay: index * 0.3 }}>
                <div className="relative">
                  <span className="absolute inset-[-14px] rounded-full border border-emerald-400/35" />
                  <span className="relative flex h-4 w-4 rounded-full bg-emerald-300" />
                </div>
              </motion.div>
            ))}
            <div className="absolute bottom-5 left-5 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-300 backdrop-blur-xl">4 active rescue deals nearby</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function DashboardShell({
  currentUser,
  currentTab,
  setCurrentTab,
  onLogout,
  foodItems,
  setFoodItems,
  recipeSuggestions,
  setRecipeSuggestions,
  savedRecipes,
  setSavedRecipes,
  marketplaceListings,
  setMarketplaceListings,
  restaurantDeals,
  savingsHistory,
  wasteBreakdown,
  addToast
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setDrawerOpen(false);
  }, [currentTab]);

  return (
    <motion.div key="dashboard" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: 0.35 }} className="relative min-h-screen overflow-hidden">
      <MeshBackground />
      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <header className="rounded-[30px] border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-amber-300 text-slate-950">
                <Leaf size={22} />
              </div>
              <div>
                <p className="font-display text-xl font-bold text-white">FreshMind</p>
                <p className="text-sm text-slate-400">Kitchen command center</p>
              </div>
            </div>

            <nav className="hidden items-center gap-2 lg:flex">
              {NAV_TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button key={tab.id} type="button" onClick={() => setCurrentTab(tab.id)} className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition ${currentTab === tab.id ? "bg-emerald-400/15 text-emerald-200" : "text-slate-400 hover:text-white"}`}>
                    <Icon size={16} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>

            <div className="hidden items-center gap-3 lg:flex">
              <div className="flex items-center gap-3 rounded-full border border-white/10 bg-slate-950/40 px-3 py-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-200">
                  {currentUser.name.split(" ").map((item) => item[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm text-white">{currentUser.name}</p>
                  <p className="text-xs text-slate-400">{currentUser.email}</p>
                </div>
              </div>
              <GlowButton onClick={onLogout} className="bg-white/5 text-white">
                <LogOut size={16} />
                Logout
              </GlowButton>
            </div>

            <button type="button" onClick={() => setDrawerOpen(true)} className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200 lg:hidden">
              <Menu size={20} />
            </button>
          </div>
        </header>

        <AnimatePresence>
          {drawerOpen ? (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDrawerOpen(false)} className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden" />
              <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 280, damping: 28 }} className="fixed right-0 top-0 z-50 h-full w-[88vw] max-w-sm border-l border-white/10 bg-slate-950/90 p-6 backdrop-blur-2xl lg:hidden">
                <div className="flex items-center justify-between">
                  <p className="font-display text-2xl text-white">Menu</p>
                  <button type="button" onClick={() => setDrawerOpen(false)} className="rounded-full border border-white/10 p-2 text-slate-300">
                    <X size={18} />
                  </button>
                </div>
                <div className="mt-8 space-y-3">
                  {NAV_TABS.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button key={tab.id} type="button" onClick={() => setCurrentTab(tab.id)} className={`flex w-full items-center gap-3 rounded-2xl px-4 py-4 text-left ${currentTab === tab.id ? "bg-emerald-400/10 text-white" : "bg-white/5 text-slate-300"}`}>
                        <Icon size={18} />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-4">
                  <p className="text-white">{currentUser.name}</p>
                  <p className="mt-1 text-sm text-slate-400">{currentUser.email}</p>
                </div>
                <GlowButton onClick={onLogout} className="mt-6 w-full justify-center bg-white/5 text-white">
                  <LogOut size={16} />
                  Logout
                </GlowButton>
              </motion.aside>
            </>
          ) : null}
        </AnimatePresence>

        <main className="mt-8">
          <AnimatePresence mode="wait">
            {currentTab === "dashboard" ? <DashboardHome key="dashboard-tab" currentUser={currentUser} foodItems={foodItems} savingsHistory={savingsHistory} wasteBreakdown={wasteBreakdown} savedRecipes={savedRecipes} /> : null}
            {currentTab === "food" ? <MyFoodPage key="food-tab" foodItems={foodItems} setFoodItems={setFoodItems} addToast={addToast} /> : null}
            {currentTab === "recipes" ? <RecipesPage key="recipes-tab" foodItems={foodItems} recipeSuggestions={recipeSuggestions} setRecipeSuggestions={setRecipeSuggestions} savedRecipes={savedRecipes} setSavedRecipes={setSavedRecipes} addToast={addToast} /> : null}
            {currentTab === "marketplace" ? <MarketplacePage key="marketplace-tab" marketplaceListings={marketplaceListings} setMarketplaceListings={setMarketplaceListings} restaurantDeals={restaurantDeals} addToast={addToast} /> : null}
            {currentTab === "alerts" ? <AlertsPage key="alerts-tab" foodItems={foodItems} setFoodItems={setFoodItems} setMarketplaceListings={setMarketplaceListings} addToast={addToast} /> : null}
          </AnimatePresence>
        </main>
      </div>
    </motion.div>
  );
}

function App() {
  const [users, setUsers] = useLocalStorageState("freshmind-users", () => [demoUser()]);
  const [currentUser, setCurrentUser] = useLocalStorageState("freshmind-current-user", null);
  const [foodItems, setFoodItems] = useLocalStorageState("freshmind-food-items", seedFoodItems);
  const [savedRecipes, setSavedRecipes] = useLocalStorageState("freshmind-saved-recipes", seedSavedRecipes);
  const [marketplaceListings, setMarketplaceListings] = useLocalStorageState("freshmind-marketplace-listings", seedListings);
  const [restaurantDeals] = useLocalStorageState("freshmind-restaurant-deals", seedRestaurantDeals);
  const [savingsHistory] = useLocalStorageState("freshmind-savings-history", seedSavingsHistory);
  const [wasteBreakdown] = useLocalStorageState("freshmind-waste-breakdown", seedWasteBreakdown);
  const [recipeSuggestions, setRecipeSuggestions] = useLocalStorageState("freshmind-recipe-suggestions", []);
  const [page, setPage] = useState(() => (currentUser ? "dashboard" : "landing"));
  const [authMode, setAuthMode] = useState("signup");
  const [authError, setAuthError] = useState("");
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    if (currentUser && page !== "dashboard") setPage("dashboard");
  }, [currentUser, page]);

  function addToast(title, message) {
    const id = makeId("toast");
    setToasts((current) => [...current, { id, title, message }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 3400);
  }

  function dismissToast(id) {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }

  function openAuth(mode = "signup") {
    setAuthMode(mode);
    setAuthError("");
    setPage("auth");
  }

  function loginAs(user) {
    setCurrentUser({ name: user.name, email: user.email, joined: user.joined || isoFromDays(0) });
    setCurrentTab("dashboard");
    setPage("dashboard");
    setAuthError("");
  }

  function handleDemo() {
    loginAs(demoUser());
    addToast("Demo loaded", "You are now inside the FreshMind demo account.");
  }

  function handleAuthSubmit(form) {
    const email = form.email.trim().toLowerCase();
    const password = form.password.trim();
    const name = form.name.trim();

    if (!email || !password || (authMode === "signup" && !name)) {
      setAuthError("Please complete every required field.");
      return;
    }
    if (password.length < 6) {
      setAuthError("Passwords must be at least 6 characters long.");
      return;
    }

    if (authMode === "signup") {
      if (users.some((user) => user.email === email)) {
        setAuthError("An account with that email already exists.");
        return;
      }
      const nextUser = { name, email, password, joined: isoFromDays(0) };
      setUsers((current) => [...current, nextUser]);
      loginAs(nextUser);
      addToast("Account created", "Welcome to FreshMind.");
      return;
    }

    const existingUser = users.find((user) => user.email === email && user.password === password);
    if (!existingUser) {
      setAuthError("Incorrect email or password.");
      return;
    }

    loginAs(existingUser);
    addToast("Welcome back", "Your dashboard is ready.");
  }

  function handleGoogle() {
    addToast("Google sign-in", "This is a polished UI placeholder for OAuth.");
  }

  function handleLogout() {
    setCurrentUser(null);
    setPage("landing");
    setCurrentTab("dashboard");
    addToast("Logged out", "Your FreshMind session has been cleared.");
  }

  function handleDownload() {
    addToast("Mobile app coming soon", "FreshMind for iOS and Android is on the roadmap.");
  }

  const activeView = useMemo(() => {
    if (page === "dashboard" && currentUser) {
      return (
        <DashboardShell
          currentUser={currentUser}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          onLogout={handleLogout}
          foodItems={foodItems}
          setFoodItems={setFoodItems}
          recipeSuggestions={recipeSuggestions}
          setRecipeSuggestions={setRecipeSuggestions}
          savedRecipes={savedRecipes}
          setSavedRecipes={setSavedRecipes}
          marketplaceListings={marketplaceListings}
          setMarketplaceListings={setMarketplaceListings}
          restaurantDeals={restaurantDeals}
          savingsHistory={savingsHistory}
          wasteBreakdown={wasteBreakdown}
          addToast={addToast}
        />
      );
    }

    if (page === "auth") {
      return <AuthPage authMode={authMode} setAuthMode={setAuthMode} onBack={() => setPage("landing")} onAuthSubmit={handleAuthSubmit} onTryDemo={handleDemo} onGoogle={handleGoogle} errorMessage={authError} />;
    }

    return <LandingPage onGetStarted={() => openAuth("signup")} onTryDemo={handleDemo} onDownload={handleDownload} onOpenAuth={() => openAuth("login")} />;
  }, [authError, authMode, currentTab, currentUser, foodItems, marketplaceListings, page, recipeSuggestions, restaurantDeals, savedRecipes, savingsHistory, wasteBreakdown]);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-ink text-white">
      <Toasts toasts={toasts} dismissToast={dismissToast} />
      <AnimatePresence mode="wait">{activeView}</AnimatePresence>
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
