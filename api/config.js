"use strict";

const { methodNotAllowed, sendJson } = require("../lib/server/http");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    return methodNotAllowed(res, ["GET"]);
  }

  return sendJson(res, 200, {
    capabilities: {
      liveRecipes: Boolean(process.env.ANTHROPIC_API_KEY),
      liveBilling: Boolean(process.env.STRIPE_SECRET_KEY),
      liveAuth: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY)
    }
  });
};
