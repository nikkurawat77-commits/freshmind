const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { URL } = require("url");

const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".ico": "image/x-icon"
};

const menuMix = {
  restaurant: [
    { name: "Herb Rice Bowls", share: 0.29 },
    { name: "Grilled Chicken Plates", share: 0.24 },
    { name: "Seasonal Salad Kits", share: 0.18 },
    { name: "Roasted Veg Sides", share: 0.16 },
    { name: "Dessert Portions", share: 0.13 }
  ],
  "food-truck": [
    { name: "Loaded Taco Trays", share: 0.31 },
    { name: "Burrito Wraps", share: 0.24 },
    { name: "Street Corn Cups", share: 0.17 },
    { name: "Fresh Salsa Batches", share: 0.16 },
    { name: "Churro Packs", share: 0.12 }
  ],
  cafe: [
    { name: "Breakfast Sandwiches", share: 0.26 },
    { name: "Coffee Drinks", share: 0.28 },
    { name: "Grab-and-go Salads", share: 0.16 },
    { name: "Pastry Trays", share: 0.19 },
    { name: "Yogurt Cups", share: 0.11 }
  ]
};

const chartLabels = ["11 AM", "1 PM", "3 PM", "5 PM", "7 PM", "9 PM"];
const billingPlans = {
  starter: {
    plan: "starter",
    planLabel: "Starter",
    billingCycle: "monthly",
    billingCycleLabel: "Monthly",
    seats: 3,
    monthlyPrice: 29,
    nextInvoiceLabel: "$29 on Apr 24",
    paymentMethod: "Visa ending in 4242",
    status: "Trial active"
  },
  growth: {
    plan: "growth",
    planLabel: "Growth",
    billingCycle: "monthly",
    billingCycleLabel: "Monthly",
    seats: 8,
    monthlyPrice: 79,
    nextInvoiceLabel: "$79 on Apr 24",
    paymentMethod: "Visa ending in 4242",
    status: "Active"
  },
  scale: {
    plan: "scale",
    planLabel: "Scale",
    billingCycle: "monthly",
    billingCycleLabel: "Monthly",
    seats: 18,
    monthlyPrice: 149,
    nextInvoiceLabel: "$149 on Apr 24",
    paymentMethod: "Visa ending in 4242",
    status: "Active"
  }
};

ensureDb();

function ensureDb() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ users: [], sessions: [], salesHistory: [] }, null, 2));
  }
}

function readDb() {
  const db = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
  let changed = false;

  db.users = (db.users || []).map((user) => {
    const nextUser = ensureUserBilling(user);
    if (JSON.stringify(nextUser) !== JSON.stringify(user)) {
      changed = true;
    }
    return nextUser;
  });

  db.sessions = db.sessions || [];
  db.salesHistory = db.salesHistory || [];

  if (changed) {
    writeDb(db);
  }

  return db;
}

function writeDb(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function sendText(res, statusCode, message) {
  res.writeHead(statusCode, { "Content-Type": "text/plain; charset=utf-8" });
  res.end(message);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 2_000_000) {
        reject(new Error("Payload too large"));
      }
    });
    req.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(new Error("Invalid JSON body"));
      }
    });
    req.on("error", reject);
  });
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.pbkdf2Sync(password, salt, 120000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  const [salt, originalHash] = stored.split(":");
  const hash = crypto.pbkdf2Sync(password, salt, 120000, 64, "sha512").toString("hex");
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(originalHash));
}

function createToken() {
  return crypto.randomBytes(32).toString("hex");
}

function getAuthUser(req) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (!token) return null;

  const db = readDb();
  const session = db.sessions.find((item) => item.token === token);
  if (!session) return null;

  const user = db.users.find((item) => item.id === session.userId);
  if (!user) return null;

  return { db, user };
}

function ensureUserBilling(user) {
  if (user.billing && billingPlans[user.billing.plan]) {
    const defaults = billingPlans[user.billing.plan];
    return {
      ...user,
      billing: {
        ...defaults,
        ...user.billing
      }
    };
  }

  return {
    ...user,
    billing: { ...billingPlans.starter }
  };
}

function createDemoHistory() {
  return [
    ["2026-03-10", "restaurant", "tuesday", "cloudy", 96, 41, 8, 83, 118],
    ["2026-03-11", "restaurant", "wednesday", "sunny", 102, 44, 12, 81, 129],
    ["2026-03-12", "restaurant", "thursday", "cloudy", 110, 52, 16, 80, 141],
    ["2026-03-13", "restaurant", "friday", "cloudy", 116, 65, 18, 82, 152],
    ["2026-03-14", "food-truck", "saturday", "sunny", 149, 28, 30, 69, 167],
    ["2026-03-15", "cafe", "sunday", "rainy", 112, 39, 10, 75, 106],
    ["2026-03-17", "cafe", "tuesday", "cloudy", 121, 46, 11, 78, 123],
    ["2026-03-18", "restaurant", "wednesday", "sunny", 107, 49, 14, 84, 138],
    ["2026-03-19", "restaurant", "thursday", "cloudy", 112, 54, 10, 82, 141],
    ["2026-03-20", "restaurant", "friday", "sunny", 124, 70, 22, 79, 169],
    ["2026-03-21", "food-truck", "saturday", "sunny", 156, 31, 34, 66, 176],
    ["2026-03-22", "cafe", "sunday", "rainy", 118, 42, 9, 74, 111]
  ].map(([date, locationType, dayOfWeek, weather, footTraffic, reservations, eventBoost, freshness, actualOrders]) => ({
    date,
    locationType,
    dayOfWeek,
    weather,
    footTraffic,
    reservations,
    eventBoost,
    freshness,
    actualOrders
  }));
}

function parseCsv(csv) {
  const trimmed = String(csv || "").trim();
  if (!trimmed) {
    throw new Error("CSV input is empty");
  }

  return trimmed.split(/\r?\n/).map((line) => {
    const parts = line.split(",").map((item) => item.trim());
    if (parts.length !== 9) {
      throw new Error("Each row must contain 9 comma-separated values");
    }

    const [date, locationType, dayOfWeek, weather, footTraffic, reservations, eventBoost, freshness, actualOrders] = parts;
    const row = {
      date,
      locationType,
      dayOfWeek,
      weather,
      footTraffic: Number(footTraffic),
      reservations: Number(reservations),
      eventBoost: Number(eventBoost),
      freshness: Number(freshness),
      actualOrders: Number(actualOrders)
    };

    if (Object.values(row).some((value) => value === "" || Number.isNaN(value))) {
      throw new Error("CSV rows contain missing or invalid values");
    }

    return row;
  });
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function mean(values) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function baselineModel(input) {
  const locationBase = { restaurant: 92, "food-truck": 76, cafe: 88 };
  const dayWeights = {
    monday: -8, tuesday: -4, wednesday: 2, thursday: 8, friday: 18, saturday: 22, sunday: 10
  };
  const weatherImpact = { sunny: 10, cloudy: 4, rainy: -8, stormy: -18 };

  return Math.round(clamp(
    locationBase[input.locationType]
      + dayWeights[input.dayOfWeek]
      + weatherImpact[input.weather]
      + (input.footTraffic - 100) * 0.58
      + input.reservations * 0.36
      + input.eventBoost * 0.72
      - (100 - input.freshness) * 0.18,
    40,
    280
  ));
}

function similarityScore(a, b) {
  let score = 0;
  if (a.locationType === b.locationType) score += 22;
  if (a.dayOfWeek === b.dayOfWeek) score += 18;
  if (a.weather === b.weather) score += 14;
  score += Math.max(0, 20 - Math.abs(a.footTraffic - b.footTraffic) * 0.25);
  score += Math.max(0, 14 - Math.abs(a.reservations - b.reservations) * 0.35);
  score += Math.max(0, 10 - Math.abs(a.eventBoost - b.eventBoost) * 0.4);
  score += Math.max(0, 8 - Math.abs(a.freshness - b.freshness) * 0.2);
  return score;
}

function buildServiceCurve(totalOrders, locationType) {
  const ratiosByLocation = {
    restaurant: [0.12, 0.18, 0.11, 0.17, 0.24, 0.18],
    "food-truck": [0.14, 0.2, 0.15, 0.17, 0.2, 0.14],
    cafe: [0.22, 0.2, 0.14, 0.15, 0.17, 0.12]
  };

  return ratiosByLocation[locationType].map((ratio, index) => ({
    label: chartLabels[index],
    value: Math.round(totalOrders * ratio)
  }));
}

function buildPrepPlan(locationType, forecastOrders, wasteProbability) {
  const wasteBuffer = wasteProbability > 18 ? 0.92 : wasteProbability > 12 ? 0.97 : 1.03;
  return menuMix[locationType].map((item) => ({
    name: item.name,
    quantity: Math.round(forecastOrders * item.share * wasteBuffer),
    note: wasteProbability > 18 ? "Tight batch cooking recommended" : "Standard prep window"
  }));
}

function buildRecommendations(input, forecastOrders, wasteProbability, stockoutProbability) {
  const items = [];

  if (forecastOrders > 150) {
    items.push({
      title: "Increase prep cadence before peak window",
      detail: "Demand is above baseline. Start a half-batch 45 minutes earlier to avoid late stockouts."
    });
  } else {
    items.push({
      title: "Keep prep in smaller rolling batches",
      detail: "Forecast is stable enough for controlled replenishment instead of full upfront production."
    });
  }

  if (wasteProbability >= 18) {
    items.push({
      title: "Trigger discounting for perishable items",
      detail: "Open bundle pricing during the final 90 minutes to convert aging inventory before spoilage."
    });
  } else {
    items.push({
      title: "Hold markdowns unless sell-through slows",
      detail: "Current inventory and demand are aligned. Protect margin unless evening traffic drops."
    });
  }

  if (input.weather === "rainy" || input.weather === "stormy") {
    items.push({
      title: "Shift labor toward delivery and pickup",
      detail: "Weather drag lowers walk-ins but usually raises remote orders. Keep pack station staffed."
    });
  } else if (input.eventBoost > 20) {
    items.push({
      title: "Stage a surge-ready line setup",
      detail: "Local events can compress demand into short bursts. Pre-portion fast movers near the line."
    });
  } else {
    items.push({
      title: "Maintain standard front-of-house staffing",
      detail: "No major volatility signals detected. Focus team effort on sell-through and waste logging."
    });
  }

  if (stockoutProbability > 24) {
    items.push({
      title: "Set low-stock alerts for top sellers",
      detail: "The current plan risks stockouts on best sellers. Notify staff when remaining portions hit 20%."
    });
  }

  return items;
}

function markdownWindow(wasteProbability, locationType) {
  if (wasteProbability < 10) return locationType === "cafe" ? "After 6:30 PM" : "After 8:15 PM";
  if (wasteProbability < 18) return locationType === "food-truck" ? "After 7:00 PM" : "After 7:45 PM";
  return "Start 90 minutes before close";
}

function forecastForUser(history, input) {
  const baseline = baselineModel(input);
  const neighbors = history
    .map((row) => ({ ...row, score: similarityScore(row, input) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  const weightedActual = neighbors.length
    ? neighbors.reduce((sum, row) => sum + row.actualOrders * row.score, 0) / neighbors.reduce((sum, row) => sum + row.score, 0)
    : baseline;

  const locationRows = history.filter((row) => row.locationType === input.locationType);
  const locationAverage = locationRows.length ? mean(locationRows.map((row) => row.actualOrders)) : baseline;
  const forecastOrders = Math.round(clamp(baseline * 0.42 + weightedActual * 0.43 + locationAverage * 0.15, 40, 280));
  const demandDelta = Math.round(((forecastOrders - baseline) / Math.max(1, baseline)) * 100);
  const confidence = Math.round(clamp(64 + neighbors.length * 4 + (history.length > 20 ? 5 : 0) + (neighbors[0]?.score || 0) * 0.12, 62, 97));
  const demandSpread = neighbors.length ? mean(neighbors.map((row) => Math.abs(row.actualOrders - weightedActual))) : 18;
  const wasteProbability = Math.round(clamp(
    8
      + Math.max(0, input.freshness - 78) * 0.38
      + Math.max(0, baseline - forecastOrders) * 0.1
      + (input.weather === "rainy" ? 4 : 0)
      + (input.weather === "stormy" ? 8 : 0)
      - Math.max(0, input.eventBoost - 10) * 0.16
      + Math.max(0, demandSpread - 10) * 0.2,
    4,
    38
  ));
  const stockoutProbability = Math.round(clamp(
    10
      + Math.max(0, forecastOrders - baseline) * 0.14
      + Math.max(0, input.eventBoost - 24) * 0.4
      + (input.locationType === "food-truck" ? 5 : 0)
      + Math.max(0, 74 - input.freshness) * 0.12,
    6,
    42
  ));
  const foodSavedKg = (wasteProbability < 12 ? 18.4 : wasteProbability < 20 ? 12.8 : 7.2).toFixed(1);

  return {
    forecastOrders,
    demandDelta,
    confidence,
    confidenceSource: `${neighbors.length} nearest historical matches across ${history.length} records`,
    wasteProbability,
    stockoutProbability,
    serviceCurve: buildServiceCurve(forecastOrders, input.locationType),
    prepPlan: buildPrepPlan(input.locationType, forecastOrders, wasteProbability),
    recommendations: buildRecommendations(input, forecastOrders, wasteProbability, stockoutProbability),
    markdownWindow: markdownWindow(wasteProbability, input.locationType),
    foodSavedKg
  };
}

function sanitizeUser(user) {
  return {
    id: user.id,
    businessName: user.businessName,
    email: user.email
  };
}

function serveStaticFile(res, pathname) {
  const filePath = pathname === "/" ? path.join(__dirname, "index.html") : path.join(__dirname, pathname);
  const resolvedPath = path.resolve(filePath);

  if (!resolvedPath.startsWith(__dirname)) {
    sendText(res, 403, "Forbidden");
    return;
  }

  fs.readFile(resolvedPath, (error, buffer) => {
    if (error) {
      if (error.code === "ENOENT") {
        sendJson(res, 404, { error: "Not found" });
        return;
      }

      sendText(res, 500, "Server error");
      return;
    }

    res.writeHead(200, {
      "Content-Type": MIME_TYPES[path.extname(resolvedPath)] || "application/octet-stream"
    });
    res.end(buffer);
  });
}

const server = http.createServer(async (req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = requestUrl.pathname;

  try {
    if (req.method === "POST" && pathname === "/api/auth/register") {
      const body = await readBody(req);
      const { businessName, email, password } = body;

      if (!businessName || !email || !password || password.length < 6) {
        sendJson(res, 400, { error: "Business name, email, and password are required. Password must be at least 6 characters." });
        return;
      }

      const db = readDb();
      const existing = db.users.find((user) => user.email === email.toLowerCase());
      if (existing) {
        sendJson(res, 409, { error: "Email is already registered" });
        return;
      }

      const user = {
        id: crypto.randomUUID(),
        businessName,
        email: email.toLowerCase(),
        passwordHash: hashPassword(password),
        createdAt: new Date().toISOString(),
        billing: { ...billingPlans.starter }
      };

      db.users.push(user);
      db.salesHistory.push(...createDemoHistory().map((row) => ({ ...row, id: crypto.randomUUID(), userId: user.id })));

      const token = createToken();
      db.sessions.push({ token, userId: user.id, createdAt: new Date().toISOString() });
      writeDb(db);

      sendJson(res, 201, { token, business: sanitizeUser(user) });
      return;
    }

    if (req.method === "POST" && pathname === "/api/auth/login") {
      const body = await readBody(req);
      const db = readDb();
      const user = db.users.find((item) => item.email === String(body.email || "").toLowerCase());

      if (!user || !verifyPassword(body.password || "", user.passwordHash)) {
        sendJson(res, 401, { error: "Invalid email or password" });
        return;
      }

      const token = createToken();
      db.sessions.push({ token, userId: user.id, createdAt: new Date().toISOString() });
      writeDb(db);

      sendJson(res, 200, { token, business: sanitizeUser(user) });
      return;
    }

    if (pathname.startsWith("/api/")) {
      const auth = getAuthUser(req);
      if (!auth) {
        sendJson(res, 401, { error: "Unauthorized" });
        return;
      }

      if (req.method === "GET" && pathname === "/api/dashboard") {
        const history = auth.db.salesHistory
          .filter((row) => row.userId === auth.user.id)
          .sort((a, b) => b.date.localeCompare(a.date));

        sendJson(res, 200, {
          business: sanitizeUser(auth.user),
          history,
          billing: auth.user.billing
        });
        return;
      }

      if (req.method === "POST" && pathname === "/api/forecast") {
        const body = await readBody(req);
        const history = auth.db.salesHistory.filter((row) => row.userId === auth.user.id);
        sendJson(res, 200, forecastForUser(history, body));
        return;
      }

      if (req.method === "POST" && pathname === "/api/import-sales") {
        const body = await readBody(req);
        const rows = parseCsv(body.csv);
        auth.db.salesHistory.push(...rows.map((row) => ({
          ...row,
          id: crypto.randomUUID(),
          userId: auth.user.id
        })));
        writeDb(auth.db);
        sendJson(res, 201, { imported: rows.length });
        return;
      }

      if (req.method === "POST" && pathname === "/api/billing/update") {
        const body = await readBody(req);
        const nextPlan = billingPlans[body.plan];

        if (!nextPlan) {
          sendJson(res, 400, { error: "Unknown subscription plan" });
          return;
        }

        const userIndex = auth.db.users.findIndex((user) => user.id === auth.user.id);
        if (userIndex === -1) {
          sendJson(res, 404, { error: "User not found" });
          return;
        }

        auth.db.users[userIndex] = {
          ...auth.db.users[userIndex],
          billing: {
            ...nextPlan
          }
        };

        writeDb(auth.db);
        sendJson(res, 200, { billing: auth.db.users[userIndex].billing });
        return;
      }

      sendJson(res, 404, { error: "Not found" });
      return;
    }

    if (req.method === "GET") {
      serveStaticFile(res, pathname);
      return;
    }

    sendJson(res, 404, { error: "Not found" });
  } catch (error) {
    sendJson(res, 500, { error: error.message || "Internal server error" });
  }
});

server.listen(PORT, () => {
  console.log(`SaveEats running at http://localhost:${PORT}`);
});
