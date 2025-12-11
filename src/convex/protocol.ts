import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// --- Queries ---

export const getIntents = query({
  args: { status: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.status) {
      return await ctx.db
        .query("intents")
        .withIndex("by_status", (q) => q.eq("status", args.status as any))
        .order("desc")
        .take(50);
    }
    return await ctx.db.query("intents").order("desc").take(50);
  },
});

export const getMarketData = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("marketData").order("desc").take(20);
  },
});

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const intents = await ctx.db.query("intents").collect();
    const executions = await ctx.db.query("executions").collect();
    
    const totalValueSecured = intents.reduce((acc, curr) => acc + (curr.bondAmount * 100), 0); // Simulated multiplier
    const totalProfit = executions.reduce((acc, curr) => acc + curr.profit, 0);
    
    return {
      totalIntents: intents.length,
      totalExecutions: executions.length,
      totalValueSecured,
      totalProfit,
    };
  },
});

// --- Mutations ---

export const submitIntent = mutation({
  args: {
    targetUserAddress: v.string(),
    targetHealthFactor: v.number(),
    minPrice: v.number(),
    bondAmount: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new Error("Unauthorized");

    // Find the user in our database to get their ID
    const dbUser = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", user.email))
      .first();
      
    if (!dbUser) throw new Error("User not found");

    const intentId = await ctx.db.insert("intents", {
      liquidatorId: dbUser._id,
      targetUserAddress: args.targetUserAddress,
      targetHealthFactor: args.targetHealthFactor,
      minPrice: args.minPrice,
      deadline: Date.now() + 3600000, // 1 hour from now
      bondAmount: args.bondAmount,
      status: "pending",
      intentHash: Math.random().toString(36).substring(7),
    });

    return intentId;
  },
});

export const verifyIntent = mutation({
  args: { intentId: v.id("intents") },
  handler: async (ctx, args) => {
    const intent = await ctx.db.get(args.intentId);
    if (!intent) throw new Error("Intent not found");

    // Simulate verification logic
    const isValid = Math.random() > 0.1; // 90% success rate

    await ctx.db.insert("verifications", {
      intentId: args.intentId,
      proofHash: "0x" + Math.random().toString(16).substring(2),
      verifiedAt: Date.now(),
      isValid,
      verifierNode: "zkEVM-Verifier-01",
      cost: 0.03,
    });

    if (isValid) {
      await ctx.db.patch(args.intentId, { status: "verified" });
    } else {
      await ctx.db.patch(args.intentId, { status: "failed" });
    }
  },
});

export const executeIntent = mutation({
  args: { intentId: v.id("intents") },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new Error("Unauthorized");
    
    const dbUser = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", user.email))
      .first();
    if (!dbUser) throw new Error("User not found");

    const intent = await ctx.db.get(args.intentId);
    if (!intent || intent.status !== "verified") throw new Error("Intent not ready for execution");

    const profit = intent.bondAmount * 0.5 + (Math.random() * 100);

    await ctx.db.insert("executions", {
      intentId: args.intentId,
      executorId: dbUser._id,
      txHash: "0x" + Math.random().toString(16).substring(2),
      profit,
      executedAt: Date.now(),
      chain: "Polygon zkEVM",
    });

    await ctx.db.patch(args.intentId, { status: "executed" });
  },
});

// Seed data for demo
export const seedData = mutation({
  args: {},
  handler: async (ctx) => {
    // Clear existing data if needed or just add new
    // For now, let's just add some market data
    const assets = ["ETH", "BTC", "MATIC", "USDC"];
    for (const asset of assets) {
      await ctx.db.insert("marketData", {
        asset,
        price: Math.random() * 3000,
        chainId: "1101", // Polygon zkEVM
        timestamp: Date.now(),
        confidence: 0.99,
      });
    }
  },
});
