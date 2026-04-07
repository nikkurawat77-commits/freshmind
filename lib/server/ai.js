"use strict";

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function makeId(prefix) {
  return prefix + "-" + Math.random().toString(36).slice(2, 10);
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

  return categoryValues[item && item.category] || 5;
}

function buildFallbackRecipes(items) {
  const ingredientNames = (items || []).slice(0, 5).map((item) => item.name);
  const base = ingredientNames.length ? ingredientNames : ["spinach", "bread", "yogurt"];

  return [
    {
      id: makeId("recipe"),
      emoji: "🥗",
      name: base[0] + " Power Bowl",
      ingredients: base.concat(["olive oil", "lemon", "salt"]),
      time: "15 min",
      difficulty: "Easy",
      steps: [
        "Chop the freshest ingredients into bite-sized pieces.",
        "Warm any cooked items and layer them in a bowl.",
        "Finish with lemon, olive oil, and a pinch of salt."
      ]
    },
    {
      id: makeId("recipe"),
      emoji: "🍳",
      name: base[0] + " & " + (base[1] || "Veggie") + " Skillet",
      ingredients: base.slice(0, 3).concat(["garlic", "pepper"]),
      time: "20 min",
      difficulty: "Medium",
      steps: [
        "Saute aromatics in a skillet with a little oil.",
        "Add the quickest-expiring ingredients and cook until tender.",
        "Serve hot with toast, rice, or noodles."
      ]
    },
    {
      id: makeId("recipe"),
      emoji: "🥪",
      name: "Rescue Toast with " + base[0],
      ingredients: [base[0], base[1] || "bread", "cheese", "herbs"],
      time: "12 min",
      difficulty: "Easy",
      steps: [
        "Toast bread or warm a wrap.",
        "Layer on cooked or fresh ingredients that need to be used soon.",
        "Top with herbs and serve immediately."
      ]
    }
  ];
}

function parseClaudeRecipes(text) {
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) {
    throw new Error("Claude response did not contain a JSON array.");
  }

  return JSON.parse(match[0]).map((recipe) => ({
    id: makeId("recipe"),
    emoji: recipe.emoji || "🍽️",
    name: recipe.name,
    ingredients: recipe.ingredients || [],
    steps: recipe.steps || [],
    time: recipe.time || "20 min",
    difficulty: recipe.difficulty || "Medium"
  }));
}

function buildRecipePrompt(foodItems) {
  const ingredientList = (foodItems || []).map((item) => item.name + " (" + item.qty + ")").join(", ");
  return "Based on these ingredients: " + ingredientList + ". " +
    "Suggest 3 quick recipes with steps. Return JSON array with: name, ingredients, steps (array), time, difficulty, emoji.";
}

function buildForecastInsights(input) {
  const foodItems = input.foodItems || [];
  const marketplaceListings = input.marketplaceListings || [];
  const savingsHistory = input.savingsHistory || [];
  const sortedByUrgency = foodItems.slice().sort((left, right) => getDaysUntilExpiry(left.expiry) - getDaysUntilExpiry(right.expiry));
  const urgentItems = sortedByUrgency.filter((item) => getDaysUntilExpiry(item.expiry) <= 3);
  const freshItems = foodItems.filter((item) => getDaysUntilExpiry(item.expiry) > 7);
  const expiredItems = foodItems.filter((item) => getDaysUntilExpiry(item.expiry) < 0);
  const latestSaved = savingsHistory.length ? (savingsHistory[savingsHistory.length - 1].saved || 0) : 48;
  const atRiskValue = urgentItems.reduce((sum, item) => sum + getItemValue(item), 0);
  const projectedSavings = Math.round(latestSaved * (1 + clamp(urgentItems.length * 0.04 + freshItems.length * 0.01, 0.08, 0.22)));
  const kitchenHealth = clamp(Math.round(90 - expiredItems.length * 15 - urgentItems.length * 6 + freshItems.length), 36, 98);
  const confidence = clamp(Math.round(68 + freshItems.length * 2 - expiredItems.length * 4), 52, 96);
  const rescueRate = clamp(Math.round((foodItems.length - expiredItems.length) / Math.max(foodItems.length, 1) * 100), 44, 98);
  const pricingActions = urgentItems.slice(0, 3).map((item) => ({
    item: item.name,
    suggestedPrice: Math.max(0, Math.round(getItemValue(item) * (getDaysUntilExpiry(item.expiry) <= 1 ? 0.45 : 0.65))),
    note: getDaysUntilExpiry(item.expiry) <= 1 ? "Price aggressively for same-day pickup." : "Bundle this with one slower-moving item."
  }));
  const executiveBrief = urgentItems[0]
    ? "Prioritize " + urgentItems[0].name + " in your next recipe and list one rescue bundle before end of day."
    : "Inventory looks balanced. Keep automated recipe nudges and marketplace visibility running.";
  const automations = [
    {
      title: "Expiry-first meal block",
      detail: urgentItems[0]
        ? "Feature " + urgentItems[0].name + " in a same-day recipe and notify users at lunch."
        : "Queue tomorrow morning's recipe prompt from your freshest inventory."
    },
    {
      title: "Marketplace conversion push",
      detail: marketplaceListings.length
        ? "Combine an expiring item with an active listing to improve pickup conversion."
        : "Publish one rescue bundle to create marketplace momentum."
    },
    {
      title: "Savings forecast",
      detail: "Current behavior projects approximately $" + projectedSavings + " in monthly savings."
    }
  ];

  return {
    kitchenHealth,
    confidence,
    rescueRate,
    projectedSavings,
    atRiskValue,
    urgentCount: urgentItems.length,
    executiveBrief,
    automations,
    pricingActions
  };
}

module.exports = {
  buildFallbackRecipes,
  buildForecastInsights,
  buildRecipePrompt,
  parseClaudeRecipes
};
