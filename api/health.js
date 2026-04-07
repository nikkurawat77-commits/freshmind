"use strict";

const { sendJson, methodNotAllowed } = require("../lib/server/http");
const { getSupabaseConfig } = require("../lib/server/supabase");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    return methodNotAllowed(res, ["GET"]);
  }

  const supabase = getSupabaseConfig();
  const checks = {
    app: "ok",
    serverTime: new Date().toISOString(),
    capabilities: {
      liveRecipes: Boolean(process.env.ANTHROPIC_API_KEY),
      liveBilling: Boolean(process.env.STRIPE_SECRET_KEY),
      liveAuth: supabase.hasAuth,
      liveWorkspace: supabase.hasWorkspacePersistence
    }
  };

  return sendJson(res, 200, checks);
};
