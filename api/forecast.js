"use strict";

const { buildForecastInsights } = require("../lib/server/ai");
const { methodNotAllowed, readJsonBody, sendJson } = require("../lib/server/http");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return methodNotAllowed(res, ["POST"]);
  }

  try {
    const body = await readJsonBody(req);
    const insights = buildForecastInsights({
      foodItems: body.foodItems || [],
      marketplaceListings: body.marketplaceListings || [],
      savingsHistory: body.savingsHistory || []
    });

    return sendJson(res, 200, {
      source: "freshmind-forecast-engine",
      insights
    });
  } catch (error) {
    return sendJson(res, 500, {
      error: "Forecast generation failed",
      detail: error && error.message ? error.message : "Unexpected server error"
    });
  }
};
