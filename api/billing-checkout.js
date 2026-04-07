"use strict";

const { getRequestOrigin, methodNotAllowed, readJsonBody, sendJson } = require("../lib/server/http");

function getPriceIdForPlan(plan) {
  const normalized = String(plan || "").toLowerCase();
  const mapping = {
    starter: process.env.STRIPE_PRICE_STARTER || "",
    growth: process.env.STRIPE_PRICE_GROWTH || "",
    scale: process.env.STRIPE_PRICE_SCALE || ""
  };
  return mapping[normalized] || "";
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return methodNotAllowed(res, ["POST"]);
  }

  try {
    const body = await readJsonBody(req);
    const plan = body.plan || "growth";
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "";
    const priceId = getPriceIdForPlan(plan);
    const origin = getRequestOrigin(req);

    if (!stripeSecretKey || !priceId) {
      return sendJson(res, 200, {
        mode: "demo",
        message: "Stripe is not configured yet. Add STRIPE_SECRET_KEY and STRIPE_PRICE_* env vars to enable live billing.",
        plan
      });
    }

    const form = new URLSearchParams();
    form.set("mode", "subscription");
    form.set("success_url", origin + "/?checkout=success");
    form.set("cancel_url", origin + "/?checkout=cancelled");
    form.set("line_items[0][price]", priceId);
    form.set("line_items[0][quantity]", "1");

    if (body.customerEmail) {
      form.set("customer_email", body.customerEmail);
    }

    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + stripeSecretKey,
        "content-type": "application/x-www-form-urlencoded"
      },
      body: form.toString()
    });

    const payload = await response.json();
    if (!response.ok) {
      return sendJson(res, 500, {
        error: "Stripe checkout session failed",
        detail: payload && payload.error && payload.error.message ? payload.error.message : "Unexpected Stripe error"
      });
    }

    return sendJson(res, 200, {
      mode: "live",
      url: payload.url,
      id: payload.id
    });
  } catch (error) {
    return sendJson(res, 500, {
      error: "Billing checkout failed",
      detail: error && error.message ? error.message : "Unexpected server error"
    });
  }
};
