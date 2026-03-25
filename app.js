const tokenKey = "saveeats-token";
const themeKey = "saveeats-theme";

const scenarios = {
  bistro: {
    locationType: "restaurant",
    dayOfWeek: "friday",
    weather: "cloudy",
    footTraffic: 108,
    reservations: 64,
    eventBoost: 18,
    freshness: 81
  },
  truck: {
    locationType: "food-truck",
    dayOfWeek: "saturday",
    weather: "sunny",
    footTraffic: 144,
    reservations: 22,
    eventBoost: 34,
    freshness: 68
  },
  campus: {
    locationType: "cafe",
    dayOfWeek: "wednesday",
    weather: "rainy",
    footTraffic: 126,
    reservations: 48,
    eventBoost: 12,
    freshness: 74
  }
};

const elements = {
  body: document.body,
  landingView: document.getElementById("landingView"),
  dashboardView: document.getElementById("dashboardView"),
  logoutBtn: document.getElementById("logoutBtn"),
  themeToggle: document.getElementById("themeToggle"),
  launchAppBtn: document.getElementById("launchAppBtn"),
  heroStartBtn: document.getElementById("heroStartBtn"),
  registerTab: document.getElementById("registerTab"),
  loginTab: document.getElementById("loginTab"),
  authForm: document.getElementById("authForm"),
  businessNameField: document.getElementById("businessNameField"),
  businessName: document.getElementById("businessName"),
  email: document.getElementById("email"),
  password: document.getElementById("password"),
  authSubmit: document.getElementById("authSubmit"),
  welcomeTitle: document.getElementById("welcomeTitle"),
  welcomeText: document.getElementById("welcomeText"),
  forecastForm: document.getElementById("forecastForm"),
  locationType: document.getElementById("locationType"),
  dayOfWeek: document.getElementById("dayOfWeek"),
  weather: document.getElementById("weather"),
  footTraffic: document.getElementById("footTraffic"),
  reservations: document.getElementById("reservations"),
  eventBoost: document.getElementById("eventBoost"),
  freshness: document.getElementById("freshness"),
  footTrafficValue: document.getElementById("footTrafficValue"),
  eventBoostValue: document.getElementById("eventBoostValue"),
  freshnessValue: document.getElementById("freshnessValue"),
  headlineDemand: document.getElementById("headlineDemand"),
  headlineWaste: document.getElementById("headlineWaste"),
  foodSavedHero: document.getElementById("foodSavedHero"),
  forecastOrders: document.getElementById("forecastOrders"),
  forecastChange: document.getElementById("forecastChange"),
  confidenceScore: document.getElementById("confidenceScore"),
  confidenceSource: document.getElementById("confidenceSource"),
  wasteProbability: document.getElementById("wasteProbability"),
  wasteLabel: document.getElementById("wasteLabel"),
  barChart: document.getElementById("barChart"),
  recommendations: document.getElementById("recommendations"),
  prepList: document.getElementById("prepList"),
  overstockRisk: document.getElementById("overstockRisk"),
  stockoutRisk: document.getElementById("stockoutRisk"),
  markdownWindow: document.getElementById("markdownWindow"),
  foodSaved: document.getElementById("foodSaved"),
  importForm: document.getElementById("importForm"),
  salesCsv: document.getElementById("salesCsv"),
  importStatus: document.getElementById("importStatus"),
  historyCount: document.getElementById("historyCount"),
  lastImport: document.getElementById("lastImport"),
  historyTable: document.getElementById("historyTable"),
  currentPlan: document.getElementById("currentPlan"),
  billingCycle: document.getElementById("billingCycle"),
  billingSeats: document.getElementById("billingSeats"),
  nextInvoice: document.getElementById("nextInvoice"),
  paymentMethod: document.getElementById("paymentMethod"),
  workspaceStatus: document.getElementById("workspaceStatus"),
  billingStatus: document.getElementById("billingStatus")
};

const state = {
  mode: "register",
  theme: "light",
  billing: null
};

function getToken() {
  return localStorage.getItem(tokenKey);
}

function setToken(token) {
  localStorage.setItem(tokenKey, token);
}

function clearToken() {
  localStorage.removeItem(tokenKey);
}

function setTheme(theme) {
  state.theme = theme;
  elements.body.dataset.theme = theme;
  elements.themeToggle.textContent = theme === "light" ? "Dark mode" : "Light mode";
  localStorage.setItem(themeKey, theme);
}

function scrollToAuth() {
  document.getElementById("authSection")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function api(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  const token = getToken();

  if (!headers["Content-Type"] && options.body) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(path, { ...options, headers });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}

function setMode(mode) {
  state.mode = mode;
  const registering = mode === "register";
  elements.registerTab.classList.toggle("active", registering);
  elements.loginTab.classList.toggle("active", !registering);
  elements.businessNameField.classList.toggle("hidden", !registering);
  elements.authSubmit.textContent = registering ? "Create account" : "Login";
}

function showLanding() {
  elements.landingView.classList.remove("hidden");
  elements.dashboardView.classList.add("hidden");
  elements.logoutBtn.classList.add("hidden");
  elements.launchAppBtn.classList.remove("hidden");
}

function showDashboard() {
  elements.landingView.classList.add("hidden");
  elements.dashboardView.classList.remove("hidden");
  elements.logoutBtn.classList.remove("hidden");
  elements.launchAppBtn.classList.add("hidden");
}

function updateRangeLabels() {
  elements.footTrafficValue.textContent = `${elements.footTraffic.value} / 180`;
  elements.eventBoostValue.textContent = `${elements.eventBoost.value}%`;
  elements.freshnessValue.textContent = `${elements.freshness.value} / 100`;
}

function getFormValues() {
  return {
    locationType: elements.locationType.value,
    dayOfWeek: elements.dayOfWeek.value,
    weather: elements.weather.value,
    footTraffic: Number(elements.footTraffic.value),
    reservations: Number(elements.reservations.value),
    eventBoost: Number(elements.eventBoost.value),
    freshness: Number(elements.freshness.value)
  };
}

function getRiskLabel(probability) {
  if (probability < 14) return "Minimal";
  if (probability < 25) return "Moderate";
  return "High";
}

function getWasteLabel(wasteProbability) {
  if (wasteProbability < 10) return "Healthy inventory alignment";
  if (wasteProbability < 18) return "Manageable with smart batching";
  return "Elevated waste risk from oversupply";
}

function getWasteTier(wasteProbability) {
  if (wasteProbability < 10) return `Low · ${wasteProbability}%`;
  if (wasteProbability < 18) return `Moderate · ${wasteProbability}%`;
  return `High · ${wasteProbability}%`;
}

function renderChart(curve) {
  const maxValue = Math.max(...curve.map((entry) => entry.value), 1);
  elements.barChart.innerHTML = curve.map((entry) => `
    <div class="bar-column">
      <div class="bar" style="height:${Math.max((entry.value / maxValue) * 210, 28)}px"></div>
      <div class="bar-meta">
        <strong>${entry.value}</strong>
        <span>${entry.label}</span>
      </div>
    </div>
  `).join("");
}

function renderRecommendations(items) {
  elements.recommendations.innerHTML = items.map((item) => `
    <li>
      <strong>${item.title}</strong>
      <small>${item.detail}</small>
    </li>
  `).join("");
}

function renderPrepPlan(items) {
  elements.prepList.innerHTML = items.map((item) => `
    <div class="prep-item">
      <div>
        <strong>${item.name}</strong>
        <span class="prep-meta">${item.note}</span>
      </div>
      <div class="prep-qty">${item.quantity} portions</div>
    </div>
  `).join("");
}

function renderHistory(history) {
  elements.historyCount.textContent = history.length;
  elements.lastImport.textContent = history[0] ? history[0].date : "No records";
  elements.historyTable.innerHTML = history.slice(0, 8).map((row) => `
    <div class="history-row">
      <div>
        <strong>${row.date} · ${row.locationType}</strong>
        <span>${row.dayOfWeek}, ${row.weather}, traffic ${row.footTraffic}, reservations ${row.reservations}</span>
      </div>
      <div class="prep-qty">${row.actualOrders} orders</div>
    </div>
  `).join("");
}

function renderBilling(billing) {
  state.billing = billing;
  elements.currentPlan.textContent = billing.planLabel;
  elements.billingCycle.textContent = billing.billingCycleLabel;
  elements.billingSeats.textContent = billing.seats;
  elements.nextInvoice.textContent = billing.nextInvoiceLabel;
  elements.paymentMethod.textContent = billing.paymentMethod;
  elements.workspaceStatus.textContent = billing.status;

  document.querySelectorAll(".plan-btn").forEach((button) => {
    button.classList.toggle("active", button.dataset.plan === billing.plan);
  });
}

function renderForecast(result) {
  elements.headlineDemand.textContent = `${result.forecastOrders} covers`;
  elements.headlineWaste.textContent = getWasteTier(result.wasteProbability);
  elements.foodSavedHero.textContent = `${result.foodSavedKg} kg`;
  elements.forecastOrders.textContent = result.forecastOrders;
  elements.forecastChange.textContent = `${result.demandDelta >= 0 ? "+" : ""}${result.demandDelta}% vs baseline`;
  elements.confidenceScore.textContent = `${result.confidence}%`;
  elements.confidenceSource.textContent = result.confidenceSource;
  elements.wasteProbability.textContent = `${result.wasteProbability}%`;
  elements.wasteLabel.textContent = getWasteLabel(result.wasteProbability);
  elements.overstockRisk.textContent = getRiskLabel(result.wasteProbability);
  elements.stockoutRisk.textContent = getRiskLabel(result.stockoutProbability);
  elements.markdownWindow.textContent = result.markdownWindow;
  elements.foodSaved.textContent = `${result.foodSavedKg} kg`;

  renderChart(result.serviceCurve);
  renderRecommendations(result.recommendations);
  renderPrepPlan(result.prepPlan);
}

function applyScenario(name) {
  const scenario = scenarios[name];
  if (!scenario) return;

  elements.locationType.value = scenario.locationType;
  elements.dayOfWeek.value = scenario.dayOfWeek;
  elements.weather.value = scenario.weather;
  elements.footTraffic.value = scenario.footTraffic;
  elements.reservations.value = scenario.reservations;
  elements.eventBoost.value = scenario.eventBoost;
  elements.freshness.value = scenario.freshness;

  document.querySelectorAll(".scenario-btn").forEach((button) => {
    button.classList.toggle("active", button.dataset.scenario === name);
  });

  updateRangeLabels();
}

async function refreshDashboard(runForecast = true) {
  const dashboard = await api("/api/dashboard");
  elements.welcomeTitle.textContent = `${dashboard.business.businessName} ops center`;
  elements.welcomeText.textContent = `You have ${dashboard.history.length} historical records training the demand model. Keep service balanced, billing current, and prep aligned.`;
  renderHistory(dashboard.history);
  renderBilling(dashboard.billing);

  if (runForecast) {
    await submitForecast();
  }
}

async function submitForecast() {
  updateRangeLabels();
  const result = await api("/api/forecast", {
    method: "POST",
    body: JSON.stringify(getFormValues())
  });
  renderForecast(result);
}

async function handleAuthSubmit(event) {
  event.preventDefault();

  const payload = {
    businessName: elements.businessName.value.trim(),
    email: elements.email.value.trim(),
    password: elements.password.value
  };

  const path = state.mode === "register" ? "/api/auth/register" : "/api/auth/login";
  const data = await api(path, {
    method: "POST",
    body: JSON.stringify(payload)
  });

  setToken(data.token);
  showDashboard();
  await refreshDashboard();
}

async function importHistory(event) {
  event.preventDefault();
  elements.importStatus.textContent = "Importing sales history...";
  elements.importStatus.dataset.tone = "";

  try {
    const data = await api("/api/import-sales", {
      method: "POST",
      body: JSON.stringify({ csv: elements.salesCsv.value })
    });

    elements.importStatus.textContent = `${data.imported} records imported successfully.`;
    elements.importStatus.dataset.tone = "success";
    elements.salesCsv.value = "";
    await refreshDashboard();
  } catch (error) {
    elements.importStatus.textContent = error.message;
    elements.importStatus.dataset.tone = "error";
  }
}

async function updatePlan(plan) {
  elements.billingStatus.textContent = "Updating subscription...";
  elements.billingStatus.dataset.tone = "";

  try {
    const data = await api("/api/billing/update", {
      method: "POST",
      body: JSON.stringify({ plan })
    });
    renderBilling(data.billing);
    elements.billingStatus.textContent = `${data.billing.planLabel} plan active.`;
    elements.billingStatus.dataset.tone = "success";
  } catch (error) {
    elements.billingStatus.textContent = error.message;
    elements.billingStatus.dataset.tone = "error";
  }
}

async function bootstrap() {
  const savedTheme = localStorage.getItem(themeKey) || "light";
  setTheme(savedTheme);
  setMode("register");
  applyScenario("bistro");

  const token = getToken();
  if (!token) {
    showLanding();
    return;
  }

  try {
    showDashboard();
    await refreshDashboard();
  } catch (error) {
    clearToken();
    showLanding();
  }
}

elements.themeToggle.addEventListener("click", () => {
  setTheme(state.theme === "light" ? "dark" : "light");
});

elements.launchAppBtn.addEventListener("click", scrollToAuth);
elements.heroStartBtn.addEventListener("click", scrollToAuth);

elements.registerTab.addEventListener("click", () => setMode("register"));
elements.loginTab.addEventListener("click", () => setMode("login"));

elements.authForm.addEventListener("submit", (event) => {
  handleAuthSubmit(event).catch((error) => alert(error.message));
});

elements.logoutBtn.addEventListener("click", () => {
  clearToken();
  showLanding();
});

elements.forecastForm.addEventListener("submit", (event) => {
  event.preventDefault();
  submitForecast().catch((error) => alert(error.message));
});

elements.importForm.addEventListener("submit", (event) => {
  importHistory(event);
});

document.querySelectorAll(".scenario-btn").forEach((button) => {
  button.addEventListener("click", () => {
    applyScenario(button.dataset.scenario);
    submitForecast().catch((error) => alert(error.message));
  });
});

document.querySelectorAll(".plan-btn").forEach((button) => {
  button.addEventListener("click", () => {
    updatePlan(button.dataset.plan);
  });
});

[
  elements.locationType,
  elements.dayOfWeek,
  elements.weather,
  elements.footTraffic,
  elements.reservations,
  elements.eventBoost,
  elements.freshness
].forEach((element) => {
  ["input", "change"].forEach((eventName) => {
    element.addEventListener(eventName, updateRangeLabels);
  });
});

bootstrap();
