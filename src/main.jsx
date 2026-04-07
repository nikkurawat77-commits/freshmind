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
  { id: "insights", label: "AI Studio", icon: Sparkles },
  { id: "food", label: "My Food", icon: Refrigerator },
  { id: "recipes", label: "Recipes", icon: ChefHat },
  { id: "marketplace", label: "Marketplace", icon: ShoppingBag },
  { id: "alerts", label: "Alerts", icon: BellRing }
];

const BILLING_PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: "$19",
    blurb: "For individuals building better kitchen habits.",
    features: ["1 workspace", "Recipe AI", "Expiry reminders"]
  },
  {
    id: "growth",
    name: "Growth",
    price: "$49",
    blurb: "For growing teams that want automated rescue flows.",
    features: ["5 seats", "AI Studio", "Marketplace optimizer"]
  },
  {
    id: "scale",
    name: "Scale",
    price: "$129",
    blurb: "For multi-location operators and advanced reporting.",
    features: ["Unlimited seats", "API access", "Priority forecasting"]
  }
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

function seedWorkspaceProfile() {
  return {
    teamName: "FreshMind Labs",
    plan: "Growth",
    seats: 5,
    aiCreditsUsed: 1840,
    aiCreditsLimit: 5000,
    automationRuns: 18,
    trialEnds: "2026-05-12",
    monthlyGoal: 250
  };
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getDaysUntilExpiry(expiryDate) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  return Math.round((expiry.getTime() - now.getTime()) / 86400000);
}

function getItemValue(item) {
  const categoryValues = {
    Vegetables: 5,
    Fruit: 4,
    Dairy: 6,
    Meat: 11,
    Bakery: 3,
    Pantry: 4
  };
  return categoryValues[item?.category] || 5;
}

function getSuggestedMarketplacePrice(item) {
  const quantityMatch = `${item?.qty || item?.quantity || "1"}`.match(/\d+/);
  const quantityMultiplier = clamp(Number(quantityMatch?.[0] || 1), 1, 4) * 0.35;
  const days = item?.expiry ? getDaysUntilExpiry(item.expiry) : 1;
  const freshnessMultiplier = days <= 1 ? 0.45 : days <= 3 ? 0.58 : 0.74;
  const suggested = Math.round(getItemValue(item) * (1 + quantityMultiplier) * freshnessMultiplier);
  return Math.max(0, suggested);
}

function buildAiOperatingSystem(foodItems, marketplaceListings, savingsHistory, savedRecipes) {
  const sortedByUrgency = [...foodItems].sort((left, right) => getDaysUntilExpiry(left.expiry) - getDaysUntilExpiry(right.expiry));
  const urgentItems = sortedByUrgency.filter((item) => getDaysUntilExpiry(item.expiry) <= 3);
  const freshItems = foodItems.filter((item) => getDaysUntilExpiry(item.expiry) > 7);
  const expiredItems = foodItems.filter((item) => getDaysUntilExpiry(item.expiry) < 0);
  const atRiskValue = urgentItems.reduce((sum, item) => sum + getItemValue(item), 0);
  const latestSaved = savingsHistory[savingsHistory.length - 1]?.saved || 0;
  const projectedSaved = Math.round(latestSaved * 1.18);
  const rescueValue = Math.round(atRiskValue * 1.45);
  const healthScore = clamp(Math.round(88 - expiredItems.length * 18 - urgentItems.length * 7 + freshItems.length * 1.2), 34, 98);
  const usageRate = clamp(Math.round((foodItems.length / Math.max(foodItems.length + expiredItems.length, 1)) * 100), 42, 97);
  const aiConfidence = clamp(Math.round(72 + freshItems.length * 2 - expiredItems.length * 3), 51, 96);
  const marketplaceOpportunities = sortedByUrgency.slice(0, 3).map((item) => ({
    name: item.name,
    suggestedPrice: getSuggestedMarketplacePrice(item),
    urgencyLabel: getDaysUntilExpiry(item.expiry) <= 1 ? "List in the next 2 hours" : "Bundle before tomorrow",
    rationale: `${item.category} inventory with ${Math.max(getDaysUntilExpiry(item.expiry), 0)} day${getDaysUntilExpiry(item.expiry) === 1 ? "" : "s"} left`
  }));
  const weeklyPlan = sortedByUrgency.slice(0, 4).map((item, index) => ({
    id: item.id,
    day: ["Today", "Tomorrow", "Thursday", "Friday"][index] || `Day ${index + 1}`,
    title: `${item.name} rescue plan`,
    detail: `Use ${item.name.toLowerCase()} in a quick ${item.category.toLowerCase()}-first meal before ${item.expiry}.`,
    impact: `$${Math.max(4, getItemValue(item) + index)} saved`
  }));
  const demandCurve = Array.from({ length: 7 }, (_, index) => ({
    day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index],
    value: clamp(Math.round(32 + freshItems.length * 3 + urgentItems.length * 6 - index * 2 + (index % 2 === 0 ? 5 : -3)), 18, 92)
  }));
  const smartActions = [
    {
      title: "Launch an expiry-first recipe block",
      detail: urgentItems[0]
        ? `Feature ${urgentItems[0].name} in the next meal plan and push a same-day notification to reduce waste.`
        : "You have healthy inventory coverage today. Queue a recipe campaign for tomorrow morning.",
      impact: `$${Math.max(18, Math.round(atRiskValue * 0.7))} protected`
    },
    {
      title: "Bundle low-margin inventory",
      detail: marketplaceListings.length
        ? "Pair your existing marketplace listings with one expiring item to improve pickup conversion."
        : "Create your first rescue bundle so nearby buyers can pick up extras before close.",
      impact: `${Math.max(1, urgentItems.length)} bundle${urgentItems.length === 1 ? "" : "s"} recommended`
    },
    {
      title: "Forecast next week's savings",
      detail: `FreshMind expects your current rhythm to reach $${projectedSaved} in monthly savings if rescue actions stay on pace.`,
      impact: `${aiConfidence}% AI confidence`
    }
  ];

  return {
    healthScore,
    usageRate,
    aiConfidence,
    atRiskCount: urgentItems.length,
    atRiskValue,
    rescueValue,
    projectedSaved,
    smartActions,
    weeklyPlan,
    marketplaceOpportunities,
    demandCurve,
    automationCoverage: clamp(Math.round((savedRecipes.length + marketplaceListings.length + freshItems.length) * 3.2), 18, 94)
  };
}

function useLocalStorageState(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return typeof initialValue === "function" ? initialValue() : initialValue;
        }
      }
    } catch {
      return typeof initialValue === "function" ? initialValue() : initialValue;
    }
    return typeof initialValue === "function" ? initialValue() : initialValue;
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore storage write failures in locked-down browsers/private mode.
    }
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
  const response = await fetch("/api/recipes", {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({ foodItems: items })
  });

  if (!response.ok) throw new Error(`Recipe API failed with status ${response.status}`);
  const data = await response.json();
  return data;
}

async function fetchForecastInsights(payload) {
  const response = await fetch("/api/forecast", {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) throw new Error(`Forecast API failed with status ${response.status}`);
  return response.json();
}

async function createBillingCheckout(plan, customerEmail) {
  const response = await fetch("/api/billing-checkout", {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({ plan, customerEmail })
  });

  if (!response.ok) throw new Error(`Billing API failed with status ${response.status}`);
  return response.json();
}

async function fetchRuntimeConfig() {
  const response = await fetch("/api/config");
  if (!response.ok) throw new Error(`Config API failed with status ${response.status}`);
  return response.json();
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

function DashboardHome({ currentUser, foodItems, savingsHistory, wasteBreakdown, savedRecipes, marketplaceListings, workspaceProfile }) {
  const expiringSoon = foodItems.filter((item) => {
    const details = getExpiryDetails(item.expiry);
    return details.badge === "Use Soon" || details.badge === "Expiring";
  }).length;
  const totalSavings = savingsHistory[savingsHistory.length - 1]?.saved || 0;
  const totalWasteAvoided = (
    foodItems.reduce((sum, item) => sum + (getExpiryDetails(item.expiry).badge === "Expired" ? 0.12 : 0.35), 0) + 0.7
  ).toFixed(1);
  const aiOps = buildAiOperatingSystem(foodItems, marketplaceListings, savingsHistory, savedRecipes);

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
        <div className="mt-6 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[28px] border border-white/10 bg-slate-950/45 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-slate-400">AI Command Center</p>
                <h2 className="mt-2 font-display text-2xl text-white">Live operating signals for your workspace</h2>
              </div>
              <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-xs uppercase tracking-[0.28em] text-emerald-200">
                {aiOps.aiConfidence}% confidence
              </span>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                ["Kitchen health", `${aiOps.healthScore}%`],
                ["Automation coverage", `${aiOps.automationCoverage}%`],
                ["Projected monthly savings", `$${aiOps.projectedSaved}`]
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs text-slate-400">{label}</p>
                  <p className="mt-2 font-mono text-2xl text-white">{value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-slate-950/45 p-5">
            <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Workspace</p>
            <h2 className="mt-2 font-display text-2xl text-white">{workspaceProfile.teamName}</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-slate-400">Plan</p>
                <p className="mt-2 text-lg text-white">{workspaceProfile.plan}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-slate-400">Seats</p>
                <p className="mt-2 text-lg text-white">{workspaceProfile.seats} active</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-slate-400">AI credits</p>
                <p className="mt-2 text-lg text-white">{workspaceProfile.aiCreditsUsed} / {workspaceProfile.aiCreditsLimit}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-slate-400">Automation runs</p>
                <p className="mt-2 text-lg text-white">{workspaceProfile.automationRuns} this month</p>
              </div>
            </div>
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
            <SimpleLineChart data={savingsHistory} />
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl lg:p-6">
          <div className="mb-5">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Waste Breakdown</p>
            <h2 className="mt-2 font-display text-2xl text-white">Where you lose the most value</h2>
          </div>
          <div className="h-[320px]">
            <SimpleDonutChart data={wasteBreakdown} />
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
            <SimpleBarChart data={savingsHistory} />
          </div>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-300">
            <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />Saved</span>
            <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-amber-400" />Would have wasted</span>
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

      <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl lg:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">AI Priorities</p>
              <h2 className="mt-2 font-display text-2xl text-white">What FreshMind recommends next</h2>
            </div>
            <span className="rounded-full border border-white/10 bg-slate-950/50 px-3 py-1 text-xs uppercase tracking-[0.28em] text-slate-300">
              ${aiOps.rescueValue} rescue value
            </span>
          </div>
          <div className="mt-6 grid gap-4">
            {aiOps.smartActions.map((action) => (
              <motion.div key={action.title} whileHover={{ y: -3, scale: 1.01 }} className="rounded-[26px] border border-white/10 bg-slate-950/45 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-display text-2xl text-white">{action.title}</p>
                    <p className="mt-3 text-sm leading-7 text-slate-400">{action.detail}</p>
                  </div>
                  <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-xs uppercase tracking-[0.28em] text-emerald-200">
                    {action.impact}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl lg:p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Predicted Demand</p>
          <h2 className="mt-2 font-display text-2xl text-white">Seven-day activity curve</h2>
          <div className="mt-6">
            <DemandBars data={aiOps.demandCurve} />
          </div>
          <div className="mt-6 rounded-[28px] border border-white/10 bg-slate-950/45 p-5">
            <p className="text-sm text-slate-400">Monthly goal</p>
            <p className="mt-2 font-mono text-3xl text-white">${workspaceProfile.monthlyGoal}</p>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              FreshMind projects ${aiOps.projectedSaved} this month based on your current ingredient mix, rescue pace, and saved recipe usage.
            </p>
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
  const aiPlaybook = buildAiOperatingSystem(foodItems, [], [{ month: "Now", saved: 48, wasted: 22 }], savedRecipes);

  async function suggestRecipes() {
    if (!foodItems.length) {
      setRecipeError("Add at least one food item before requesting recipes.");
      return;
    }

    setRecipeError("");
    setLoading(true);
    try {
      const payload = await fetchClaudeRecipes(foodItems);
      setRecipeSuggestions(payload.recipes || []);
      setSourceLabel(payload.source === "anthropic" ? "Server AI response" : "Fallback recipe engine");
      if (payload.message) {
        setRecipeError(payload.message);
      }
      addToast(
        "AI recipes ready",
        payload.source === "anthropic"
          ? "FreshMind generated recipes through the server AI endpoint."
          : "FreshMind used the built-in rescue recipe engine."
      );
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

          <div className="mt-6 rounded-[28px] border border-white/10 bg-slate-950/45 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-slate-400">AI Meal Plan</p>
                <h3 className="mt-2 font-display text-2xl text-white">Inventory-first prep sequence</h3>
              </div>
              <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-xs uppercase tracking-[0.28em] text-emerald-200">
                {aiPlaybook.atRiskCount} urgent items
              </span>
            </div>
            <div className="mt-5 space-y-3">
              {aiPlaybook.weeklyPlan.slice(0, 3).map((item) => (
                <div key={item.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-medium text-white">{item.title}</p>
                    <span className="text-xs uppercase tracking-[0.24em] text-slate-400">{item.day}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
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

function MarketplacePage({ foodItems, marketplaceListings, setMarketplaceListings, restaurantDeals, addToast }) {
  const [listingFilter, setListingFilter] = useState("all");
  const [restaurantFilters, setRestaurantFilters] = useState({ distance: "all", cuisine: "all", discount: "all" });
  const [listingForm, setListingForm] = useState({ name: "", quantity: "", price: "", pickup: "", photo: "" });
  const referenceFood = foodItems.find((item) => item.name.toLowerCase() === listingForm.name.trim().toLowerCase());
  const suggestedPrice = listingForm.name.trim()
    ? getSuggestedMarketplacePrice({
        name: listingForm.name,
        qty: listingForm.quantity || referenceFood?.qty || "1",
        category: referenceFood?.category || "Pantry",
        expiry: referenceFood?.expiry || isoFromDays(1)
      })
    : 0;

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
            <div className="rounded-[26px] border border-emerald-400/20 bg-emerald-400/10 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-emerald-200">AI pricing guidance</p>
                  <p className="mt-2 text-sm leading-6 text-slate-200">
                    {listingForm.name.trim()
                      ? `FreshMind suggests ${suggestedPrice === 0 ? "listing this free" : `pricing this around $${suggestedPrice}`} for faster same-day pickup.`
                      : "Start typing an item name to get pricing guidance based on freshness and category value."}
                  </p>
                </div>
                <span className="rounded-full border border-white/10 bg-slate-950/40 px-3 py-1 text-sm text-white">
                  {listingForm.name.trim() ? `$${suggestedPrice}` : "AI"}
                </span>
              </div>
            </div>
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

function AIStudioPage({ currentUser, foodItems, marketplaceListings, savingsHistory, savedRecipes, workspaceProfile, setRecipeSuggestions, addToast }) {
  const aiOps = buildAiOperatingSystem(foodItems, marketplaceListings, savingsHistory, savedRecipes);
  const [serverInsights, setServerInsights] = useState(null);
  const [serverSource, setServerSource] = useState("Loading");
  const [billingLoading, setBillingLoading] = useState("");
  const [capabilities, setCapabilities] = useState({
    liveRecipes: false,
    liveBilling: false,
    liveAuth: false
  });

  useEffect(() => {
    let cancelled = false;

    async function loadServerSignals() {
      try {
        const [forecastPayload, configPayload] = await Promise.all([
          fetchForecastInsights({ foodItems, marketplaceListings, savingsHistory }),
          fetchRuntimeConfig()
        ]);

        if (cancelled) {
          return;
        }

        setServerInsights(forecastPayload.insights);
        setServerSource(forecastPayload.source || "freshmind-forecast-engine");
        setCapabilities(configPayload.capabilities || capabilities);
      } catch {
        if (!cancelled) {
          setServerSource("local-fallback");
        }
      }
    }

    loadServerSignals();
    return () => {
      cancelled = true;
    };
  }, [foodItems, marketplaceListings, savingsHistory]);

  async function handlePlanCheckout(planId) {
    setBillingLoading(planId);
    try {
      const result = await createBillingCheckout(planId, currentUser.email);
      if (result.mode === "live" && result.url) {
        window.location.href = result.url;
        return;
      }
      addToast("Billing not configured", result.message || "Stripe environment variables are still missing.");
    } catch {
      addToast("Billing error", "FreshMind could not start checkout right now.");
    } finally {
      setBillingLoading("");
    }
  }

  return (
    <motion.div key="ai-studio-page" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }} className="space-y-6">
      <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-cyan-400/10 via-white/5 to-emerald-500/10 p-6 backdrop-blur-xl lg:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-200">AI Studio</p>
            <h1 className="mt-3 font-display text-4xl font-bold text-white lg:text-5xl">A SaaS-style command layer for recipes, pricing, rescue actions, and savings forecasts.</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
              FreshMind now behaves more like an operating system than a static tracker, with model-shaped guidance across inventory, marketplace timing, and waste reduction.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["Health score", `${aiOps.healthScore}%`],
              ["AI confidence", `${aiOps.aiConfidence}%`],
              ["Credits available", `${workspaceProfile.aiCreditsLimit - workspaceProfile.aiCreditsUsed}`]
            ].map(([label, value]) => (
              <div key={label} className="rounded-[26px] border border-white/10 bg-slate-950/45 p-4">
                <p className="text-xs text-slate-400">{label}</p>
                <p className="mt-2 font-mono text-2xl text-white">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl lg:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Smart Actions</p>
              <h2 className="mt-2 font-display text-2xl text-white">Priority queue generated from live inventory</h2>
            </div>
            <GlowButton onClick={() => { setRecipeSuggestions(buildFallbackRecipes(foodItems)); addToast("AI rescue flow ready", "FreshMind generated a fresh recipe batch from your current inventory."); }} className="bg-primary/20 text-white shadow-glow">
              <Sparkles size={18} />
              Run Rescue Flow
            </GlowButton>
          </div>
          <div className="mt-6 grid gap-4">
            {aiOps.smartActions.map((action, index) => (
              <motion.div key={action.title} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }} className="rounded-[28px] border border-white/10 bg-slate-950/45 p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="font-display text-2xl text-white">{action.title}</p>
                    <p className="mt-3 text-sm leading-7 text-slate-400">{action.detail}</p>
                  </div>
                  <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-xs uppercase tracking-[0.28em] text-emerald-200">{action.impact}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl lg:p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Demand Forecast</p>
          <h2 className="mt-2 font-display text-2xl text-white">Operational activity for the next 7 days</h2>
          <div className="mt-6">
            <DemandBars data={aiOps.demandCurve} />
          </div>
          <div className="mt-6 rounded-[28px] border border-white/10 bg-slate-950/45 p-5">
            <p className="text-sm text-slate-400">Suggested operating mode</p>
            <p className="mt-2 font-display text-2xl text-white">{aiOps.atRiskCount >= 3 ? "Aggressive rescue mode" : "Steady optimization mode"}</p>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              {aiOps.atRiskCount >= 3
                ? "You have enough near-expiry inventory to justify an urgent recipe push and at least one marketplace bundle."
                : "Inventory looks balanced. Keep notifications and recipe prompts on schedule to maintain savings momentum."}
            </p>
          </div>
          <div className="mt-4 rounded-[28px] border border-cyan-400/20 bg-cyan-400/10 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-cyan-200">Backend intelligence</p>
                <p className="mt-2 font-display text-2xl text-white">
                  {serverInsights ? serverInsights.executiveBrief : "Generating an operational brief from the API layer..."}
                </p>
              </div>
              <span className="rounded-full border border-white/10 bg-slate-950/40 px-3 py-1 text-xs uppercase tracking-[0.28em] text-slate-200">
                {serverSource}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl lg:p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Weekly AI Plan</p>
          <h2 className="mt-2 font-display text-2xl text-white">What to cook, list, or protect next</h2>
          <div className="mt-6 space-y-4">
            {aiOps.weeklyPlan.map((item) => (
              <div key={item.id} className="rounded-[26px] border border-white/10 bg-slate-950/45 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-emerald-200">{item.day}</p>
                    <p className="mt-2 font-display text-2xl text-white">{item.title}</p>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.28em] text-slate-300">{item.impact}</span>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-400">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl lg:p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Marketplace Optimizer</p>
          <h2 className="mt-2 font-display text-2xl text-white">AI pricing recommendations for fast pickup</h2>
          <div className="mt-6 grid gap-4">
            {aiOps.marketplaceOpportunities.map((item) => (
              <motion.div key={item.name} whileHover={{ scale: 1.01, y: -4 }} className="rounded-[28px] border border-white/10 bg-slate-950/45 p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="font-display text-2xl text-white">{item.name}</p>
                    <p className="mt-2 text-sm text-slate-400">{item.rationale}</p>
                    <p className="mt-3 text-sm text-emerald-200">{item.urgencyLabel}</p>
                  </div>
                  <div className="rounded-[24px] border border-emerald-400/20 bg-emerald-400/10 px-5 py-4 text-center">
                    <p className="text-xs uppercase tracking-[0.28em] text-emerald-200">Suggested price</p>
                    <p className="mt-2 font-mono text-3xl text-white">${item.suggestedPrice}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-[32px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl lg:p-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Billing</p>
            <h2 className="mt-2 font-display text-2xl text-white">Upgrade FreshMind like a real SaaS product</h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              Server-side billing is now wired through `/api/billing-checkout`. Add Stripe env vars to switch from demo mode to live checkout instantly.
            </p>
          </div>
          <div className="rounded-full border border-white/10 bg-slate-950/45 px-4 py-2 text-sm text-slate-200">
            Billing: {capabilities.liveBilling ? "Live" : "Demo-ready"}
          </div>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-3">
          {BILLING_PLANS.map((plan) => (
            <motion.div key={plan.id} whileHover={{ y: -4, scale: 1.01 }} className={`rounded-[28px] border p-5 ${plan.id === "growth" ? "border-emerald-400/30 bg-emerald-400/10" : "border-white/10 bg-slate-950/45"}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-display text-2xl text-white">{plan.name}</p>
                  <p className="mt-2 font-mono text-3xl text-white">{plan.price}<span className="text-sm text-slate-400">/mo</span></p>
                </div>
                {plan.id === "growth" ? <span className="rounded-full border border-emerald-400/25 bg-emerald-400/15 px-3 py-1 text-xs uppercase tracking-[0.28em] text-emerald-200">Popular</span> : null}
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-400">{plan.blurb}</p>
              <div className="mt-5 space-y-2">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3 text-sm text-slate-200">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    {feature}
                  </div>
                ))}
              </div>
              <GlowButton onClick={() => handlePlanCheckout(plan.id)} className="mt-6 w-full justify-center bg-white/5 text-white">
                {billingLoading === plan.id ? "Starting checkout..." : `Choose ${plan.name}`}
              </GlowButton>
            </motion.div>
          ))}
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
  workspaceProfile,
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
                <p className="text-sm text-slate-400">{workspaceProfile.teamName} workspace</p>
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
              <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-200">
                {workspaceProfile.plan} plan
              </div>
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
            {currentTab === "dashboard" ? <DashboardHome key="dashboard-tab" currentUser={currentUser} foodItems={foodItems} savingsHistory={savingsHistory} wasteBreakdown={wasteBreakdown} savedRecipes={savedRecipes} marketplaceListings={marketplaceListings} workspaceProfile={workspaceProfile} /> : null}
            {currentTab === "insights" ? <AIStudioPage key="insights-tab" currentUser={currentUser} foodItems={foodItems} marketplaceListings={marketplaceListings} savingsHistory={savingsHistory} savedRecipes={savedRecipes} workspaceProfile={workspaceProfile} setRecipeSuggestions={setRecipeSuggestions} addToast={addToast} /> : null}
            {currentTab === "food" ? <MyFoodPage key="food-tab" foodItems={foodItems} setFoodItems={setFoodItems} addToast={addToast} /> : null}
            {currentTab === "recipes" ? <RecipesPage key="recipes-tab" foodItems={foodItems} recipeSuggestions={recipeSuggestions} setRecipeSuggestions={setRecipeSuggestions} savedRecipes={savedRecipes} setSavedRecipes={setSavedRecipes} addToast={addToast} /> : null}
            {currentTab === "marketplace" ? <MarketplacePage key="marketplace-tab" foodItems={foodItems} marketplaceListings={marketplaceListings} setMarketplaceListings={setMarketplaceListings} restaurantDeals={restaurantDeals} addToast={addToast} /> : null}
            {currentTab === "alerts" ? <AlertsPage key="alerts-tab" foodItems={foodItems} setFoodItems={setFoodItems} setMarketplaceListings={setMarketplaceListings} addToast={addToast} /> : null}
          </AnimatePresence>
        </main>
      </div>
    </motion.div>
  );
}

function DemandBars({ data }) {
  const maxValue = Math.max(...data.map((point) => point.value), 1);

  return (
    <div className="flex h-[220px] items-end gap-3">
      {data.map((point) => (
        <div key={point.day} className="flex flex-1 flex-col items-center gap-3">
          <div className="flex h-full w-full items-end justify-center">
            <div
              className="w-full rounded-t-[20px] bg-gradient-to-t from-emerald-400 to-cyan-300 shadow-[0_12px_30px_rgba(16,185,129,0.2)]"
              style={{ height: `${(point.value / maxValue) * 100}%` }}
            />
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-400">{point.day}</p>
            <p className="mt-1 font-mono text-sm text-white">{point.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function SimpleLineChart({ data }) {
  const width = 520;
  const height = 260;
  const padding = 24;
  const chartHeight = height - padding * 2;
  const chartWidth = width - padding * 2;
  const maxValue = Math.max(...data.flatMap((point) => [point.saved, point.wasted]), 1);

  function buildPath(key) {
    return data.map((point, index) => {
      const x = padding + (index / Math.max(data.length - 1, 1)) * chartWidth;
      const y = height - padding - (point[key] / maxValue) * chartHeight;
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    }).join(" ");
  }

  return (
    <div className="flex h-full flex-col justify-between">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full overflow-visible">
        {[0, 1, 2, 3].map((step) => {
          const y = padding + (step / 3) * chartHeight;
          return <line key={step} x1={padding} y1={y} x2={width - padding} y2={y} stroke="rgba(148,163,184,0.16)" strokeWidth="1" />;
        })}
        <path d={buildPath("saved")} fill="none" stroke="#10B981" strokeWidth="4" strokeLinecap="round" />
        <path d={buildPath("wasted")} fill="none" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
        {data.map((point, index) => {
          const x = padding + (index / Math.max(data.length - 1, 1)) * chartWidth;
          const savedY = height - padding - (point.saved / maxValue) * chartHeight;
          const wastedY = height - padding - (point.wasted / maxValue) * chartHeight;
          return (
            <g key={point.month}>
              <circle cx={x} cy={savedY} r="4.5" fill="#10B981" />
              <circle cx={x} cy={wastedY} r="4.5" fill="#F59E0B" />
            </g>
          );
        })}
      </svg>
      <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
        {data.map((point) => (
          <span key={point.month}>{point.month}</span>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-300">
        <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />Saved</span>
        <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-amber-400" />Would have wasted</span>
      </div>
    </div>
  );
}

function SimpleDonutChart({ data }) {
  const size = 240;
  const strokeWidth = 34;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = data.reduce((sum, item) => sum + item.value, 0) || 1;
  let offset = 0;

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6">
      <div className="relative h-[240px] w-[240px]">
        <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full -rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={strokeWidth} />
          {data.map((entry, index) => {
            const length = (entry.value / total) * circumference;
            const dashOffset = circumference - offset;
            offset += length;
            return (
              <circle
                key={entry.name}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={PIE_COLORS[index % PIE_COLORS.length]}
                strokeWidth={strokeWidth}
                strokeDasharray={`${length} ${circumference - length}`}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-sm uppercase tracking-[0.28em] text-slate-400">Tracked</span>
          <span className="mt-2 font-mono text-3xl text-white">{total}%</span>
        </div>
      </div>
      <div className="grid w-full gap-3">
        {data.map((entry, index) => (
          <div key={entry.name} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm">
            <span className="inline-flex items-center gap-3 text-slate-200">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }} />
              {entry.name}
            </span>
            <span className="font-mono text-white">{entry.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SimpleBarChart({ data }) {
  const maxValue = Math.max(...data.flatMap((point) => [point.saved, point.wasted]), 1);

  return (
    <div className="flex h-full items-end gap-4 overflow-hidden pt-6">
      {data.map((point) => (
        <div key={point.month} className="flex flex-1 flex-col items-center gap-3">
          <div className="flex h-full w-full items-end justify-center gap-2">
            <div className="w-full max-w-6 rounded-t-2xl bg-emerald-400/90" style={{ height: `${(point.saved / maxValue) * 100}%` }} />
            <div className="w-full max-w-6 rounded-t-2xl bg-amber-400/90" style={{ height: `${(point.wasted / maxValue) * 100}%` }} />
          </div>
          <span className="text-xs text-slate-400">{point.month}</span>
        </div>
      ))}
    </div>
  );
}

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      message: error?.message || "Unexpected application error"
    };
  }

  componentDidCatch(error) {
    console.error("FreshMind runtime error:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-ink px-4 text-white">
          <div className="w-full max-w-2xl rounded-[32px] border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.3em] text-amber-300">FreshMind Recovery</p>
            <h1 className="mt-4 font-display text-4xl text-white">The app hit a runtime error.</h1>
            <p className="mt-4 text-base leading-7 text-slate-300">
              Refresh the page once. If it still happens, clear this site&apos;s storage and reopen FreshMind.
            </p>
            <p className="mt-6 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 font-mono text-sm text-amber-100">
              {this.state.message}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <GlowButton onClick={() => window.location.reload()} className="bg-primary/20 text-white shadow-glow">
                Reload App
              </GlowButton>
              <GlowButton
                onClick={() => {
                  try {
                    window.localStorage.clear();
                  } catch {
                    // Ignore storage errors and still reload.
                  }
                  window.location.reload();
                }}
                className="bg-white/5 text-white"
              >
                Reset Local Data
              </GlowButton>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
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
  const [workspaceProfile] = useLocalStorageState("freshmind-workspace-profile", seedWorkspaceProfile);
  const [recipeSuggestions, setRecipeSuggestions] = useLocalStorageState("freshmind-recipe-suggestions", []);
  const [page, setPage] = useState(() => (currentUser ? "dashboard" : "landing"));
  const [authMode, setAuthMode] = useState("signup");
  const [authError, setAuthError] = useState("");
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    if (currentUser && page !== "dashboard") setPage("dashboard");
  }, [currentUser, page]);

  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    const checkoutStatus = search.get("checkout");
    if (!checkoutStatus) {
      return;
    }

    if (checkoutStatus === "success") {
      addToast("Checkout complete", "Your billing flow finished successfully.");
    }

    if (checkoutStatus === "cancelled") {
      addToast("Checkout cancelled", "You can restart billing whenever you are ready.");
    }

    search.delete("checkout");
    const nextUrl = search.toString() ? `${window.location.pathname}?${search.toString()}` : window.location.pathname;
    window.history.replaceState({}, "", nextUrl);
  }, []);

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
          workspaceProfile={workspaceProfile}
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
  }, [authError, authMode, currentTab, currentUser, foodItems, marketplaceListings, page, recipeSuggestions, restaurantDeals, savedRecipes, savingsHistory, wasteBreakdown, workspaceProfile]);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-ink text-white">
      <Toasts toasts={toasts} dismissToast={dismissToast} />
      <AnimatePresence mode="wait">{activeView}</AnimatePresence>
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  </React.StrictMode>
);
