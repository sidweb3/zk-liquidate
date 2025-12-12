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
    
    const totalValueSecured = intents.reduce((acc, curr) => acc + (curr.bondAmount * 100), 0);
    const totalProfit = executions.reduce((acc, curr) => acc + curr.profit, 0);
    
    return {
      totalIntents: intents.length,
      totalExecutions: executions.length,
      totalValueSecured,
      totalProfit,
    };
  },
});

export const getRecentActivity = query({
  args: {},
  handler: async (ctx) => {
    const recentIntents = await ctx.db.query("intents").order("desc").take(5);
    const recentExecutions = await ctx.db.query("executions").order("desc").take(5);
    
    return {
      intents: recentIntents,
      executions: recentExecutions,
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
      deadline: Date.now() + 3600000,
      bondAmount: args.bondAmount,
      status: "pending",
      intentHash: "0x" + Math.random().toString(16).substring(2, 18),
    });

    return intentId;
  },
});

export const verifyIntent = mutation({
  args: { intentId: v.id("intents") },
  handler: async (ctx, args) => {
    const intent = await ctx.db.get(args.intentId);
    if (!intent) throw new Error("Intent not found");

    // Simulate verification with 95% success rate
    const isValid = Math.random() > 0.05;
    const verificationTime = 3.5 + Math.random() * 2; // 3.5-5.5 seconds

    await ctx.db.insert("verifications", {
      intentId: args.intentId,
      proofHash: "0x" + Math.random().toString(16).substring(2, 66),
      verifiedAt: Date.now(),
      isValid,
      verifierNode: "zkEVM-Verifier-01",
      cost: 0.025 + Math.random() * 0.015, // $0.025-$0.04
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

    // More realistic profit calculation: 5-10% of bond + liquidation bonus
    const liquidationBonus = intent.bondAmount * 100 * (0.05 + Math.random() * 0.05);
    const profit = liquidationBonus - (intent.bondAmount * 0.1); // Subtract gas costs

    await ctx.db.insert("executions", {
      intentId: args.intentId,
      executorId: dbUser._id,
      txHash: "0x" + Math.random().toString(16).substring(2, 66),
      profit,
      executedAt: Date.now(),
      chain: Math.random() > 0.5 ? "Polygon zkEVM" : "Polygon PoS",
    });

    await ctx.db.patch(args.intentId, { status: "executed" });
  },
});

// Enhanced seed data with more realistic values
export const seedData = mutation({
  args: {},
  handler: async (ctx) => {
    // Seed market data for multiple assets
    const assets = [
      { name: "ETH", basePrice: 3200 },
      { name: "BTC", basePrice: 65000 },
      { name: "MATIC", basePrice: 0.85 },
      { name: "USDC", basePrice: 1.0 },
      { name: "AAVE", basePrice: 180 },
      { name: "UNI", basePrice: 12.5 },
    ];

    const chains = ["1101", "137", "1442"]; // zkEVM, PoS, CDK testnet

    for (const asset of assets) {
      for (const chainId of chains) {
        // Add slight price variance per chain
        const priceVariance = 1 + (Math.random() - 0.5) * 0.02; // ±1%
        await ctx.db.insert("marketData", {
          asset: asset.name,
          price: asset.basePrice * priceVariance,
          chainId,
          timestamp: Date.now(),
          confidence: 0.97 + Math.random() * 0.03, // 97-100%
        });
      }
    }
  },
});