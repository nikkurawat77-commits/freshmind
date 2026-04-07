"use strict";

const { buildFallbackRecipes, buildRecipePrompt, parseClaudeRecipes } = require("../lib/server/ai");
const { methodNotAllowed, readJsonBody, sendJson } = require("../lib/server/http");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return methodNotAllowed(res, ["POST"]);
  }

  try {
    const body = await readJsonBody(req);
    const foodItems = body.foodItems || [];

    if (!Array.isArray(foodItems) || !foodItems.length) {
      return sendJson(res, 400, { error: "foodItems array is required" });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return sendJson(res, 200, {
        source: "fallback",
        message: "ANTHROPIC_API_KEY is not configured. Using the built-in rescue recipe engine.",
        recipes: buildFallbackRecipes(foodItems)
      });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "anthropic-version": "2023-06-01",
        "x-api-key": apiKey
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: buildRecipePrompt(foodItems)
          }
        ]
      })
    });

    if (!response.ok) {
      const fallbackRecipes = buildFallbackRecipes(foodItems);
      return sendJson(res, 200, {
        source: "fallback",
        message: "Anthropic request failed with status " + response.status + ". Using fallback recipe engine.",
        recipes: fallbackRecipes
      });
    }

    const data = await response.json();
    const text = (data.content || []).map((entry) => entry.text || "").join("\n");
    const recipes = parseClaudeRecipes(text);

    return sendJson(res, 200, {
      source: "anthropic",
      recipes
    });
  } catch (error) {
    return sendJson(res, 500, {
      error: "Recipe generation failed",
      detail: error && error.message ? error.message : "Unexpected server error"
    });
  }
};
