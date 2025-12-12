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

export const getUserReputation = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return null;

    const executions = await ctx.db
      .query("executions")
      .withIndex("by_executor", (q) => q.eq("executorId", args.userId))
      .collect();

    const totalProfit = executions.reduce((acc, curr) => acc + curr.profit, 0);
    const avgProfit = executions.length > 0 ? totalProfit / executions.length : 0;

    return {
      reputationScore: user.reputationScore || 0,
      totalLiquidations: user.totalLiquidations || 0,
      successfulLiquidations: user.successfulLiquidations || 0,
      totalProfit: user.totalProfit || 0,
      badges: user.badges || [],
      avgProfit,
      recentExecutions: executions.slice(0, 10),
    };
  },
});

export const getAnalytics = query({
  args: { days: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const days = args.days || 7;
    const analytics = await ctx.db.query("analytics").order("desc").take(days);
    return analytics;
  },
});

export const getBotConfig = query({
  args: {},
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) return null;

    const dbUser = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", user.email))
      .first();
    
    if (!dbUser) return null;

    const config = await ctx.db
      .query("botConfigs")
      .withIndex("by_user", (q) => q.eq("userId", dbUser._id))
      .first();

    return config;
  },
});

export const getInsurancePoolStats = query({
  args: {},
  handler: async (ctx) => {
    const activeStakes = await ctx.db
      .query("insuranceStakes")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();

    const totalStaked = activeStakes.reduce((acc, curr) => acc + curr.amount, 0);
    const totalRewards = activeStakes.reduce((acc, curr) => acc + curr.rewardsEarned, 0);

    return {
      totalStaked,
      totalRewards,
      activeStakers: activeStakes.length,
      apy: 12.5, // Mock APY
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

    // Calculate AI risk score (mock implementation)
    const aiRiskScore = Math.floor(70 + Math.random() * 30); // 70-100
    const predictedProfit = args.minPrice * (0.05 + Math.random() * 0.05);
    const gasEstimate = 150000 + Math.floor(Math.random() * 50000);
    const optimalExecutionTime = Date.now() + Math.floor(Math.random() * 3600000);

    const intentId = await ctx.db.insert("intents", {
      liquidatorId: dbUser._id,
      targetUserAddress: args.targetUserAddress,
      targetHealthFactor: args.targetHealthFactor,
      minPrice: args.minPrice,
      deadline: Date.now() + 3600000,
      bondAmount: args.bondAmount,
      status: "pending",
      intentHash: "0x" + Math.random().toString(16).substring(2, 18),
      aiRiskScore,
      predictedProfit,
      gasEstimate,
      optimalExecutionTime,
    });

    return intentId;
  },
});

export const verifyIntent = mutation({
  args: { intentId: v.id("intents") },
  handler: async (ctx, args) => {
    const intent = await ctx.db.get(args.intentId);
    if (!intent) throw new Error("Intent not found");

    const isValid = Math.random() > 0.05;
    const verificationTime = 3.5 + Math.random() * 2;

    await ctx.db.insert("verifications", {
      intentId: args.intentId,
      proofHash: "0x" + Math.random().toString(16).substring(2, 66),
      verifiedAt: Date.now(),
      isValid,
      verifierNode: "zkEVM-Verifier-01",
      cost: 0.025 + Math.random() * 0.015,
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

    const liquidationBonus = intent.bondAmount * 100 * (0.05 + Math.random() * 0.05);
    const profit = liquidationBonus - (intent.bondAmount * 0.1);
    const gasUsed = 180000 + Math.floor(Math.random() * 50000);
    const gasCost = gasUsed * 0.00000003; // Mock gas cost

    await ctx.db.insert("executions", {
      intentId: args.intentId,
      executorId: dbUser._id,
      txHash: "0x" + Math.random().toString(16).substring(2, 66),
      profit,
      executedAt: Date.now(),
      chain: Math.random() > 0.5 ? "Polygon zkEVM" : "Polygon PoS",
      gasUsed,
      gasCost,
    });

    await ctx.db.patch(args.intentId, { status: "executed" });

    // Update user reputation
    const currentTotal = dbUser.totalLiquidations || 0;
    const currentSuccess = dbUser.successfulLiquidations || 0;
    const currentProfit = dbUser.totalProfit || 0;
    const currentScore = dbUser.reputationScore || 0;

    await ctx.db.patch(dbUser._id, {
      totalLiquidations: currentTotal + 1,
      successfulLiquidations: currentSuccess + 1,
      totalProfit: currentProfit + profit,
      reputationScore: currentScore + 10,
    });
  },
});

export const runSimulation = mutation({
  args: {
    targetAddress: v.string(),
    targetHealthFactor: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new Error("Unauthorized");

    const dbUser = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", user.email))
      .first();
    if (!dbUser) throw new Error("User not found");

    // Simulate liquidation
    const success = Math.random() > 0.2; // 80% success rate
    const estimatedProfit = success ? 100 + Math.random() * 500 : 0;
    const estimatedGas = 150000 + Math.floor(Math.random() * 100000);

    await ctx.db.insert("simulations", {
      userId: dbUser._id,
      targetAddress: args.targetAddress,
      targetHealthFactor: args.targetHealthFactor,
      estimatedProfit,
      estimatedGas,
      simulatedAt: Date.now(),
      success,
      errorMessage: success ? undefined : "Insufficient collateral",
    });

    return { success, estimatedProfit, estimatedGas };
  },
});

export const updateBotConfig = mutation({
  args: {
    isActive: v.boolean(),
    minHealthFactor: v.number(),
    maxHealthFactor: v.number(),
    minProfitThreshold: v.number(),
    targetChains: v.array(v.string()),
    autoExecute: v.boolean(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new Error("Unauthorized");

    const dbUser = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", user.email))
      .first();
    if (!dbUser) throw new Error("User not found");

    const existing = await ctx.db
      .query("botConfigs")
      .withIndex("by_user", (q) => q.eq("userId", dbUser._id))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, args);
    } else {
      await ctx.db.insert("botConfigs", {
        userId: dbUser._id,
        ...args,
      });
    }
  },
});

export const stakeInsurance = mutation({
  args: { amount: v.number() },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new Error("Unauthorized");

    const dbUser = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", user.email))
      .first();
    if (!dbUser) throw new Error("User not found");

    await ctx.db.insert("insuranceStakes", {
      userId: dbUser._id,
      amount: args.amount,
      stakedAt: Date.now(),
      rewardsEarned: 0,
      isActive: true,
    });
  },
});

// Enhanced seed data
export const seedData = mutation({
  args: {},
  handler: async (ctx) => {
    // Seed market data
    const assets = [
      { name: "ETH", basePrice: 3200 },
      { name: "BTC", basePrice: 65000 },
      { name: "MATIC", basePrice: 0.85 },
      { name: "USDC", basePrice: 1.0 },
      { name: "AAVE", basePrice: 180 },
      { name: "UNI", basePrice: 12.5 },
    ];

    const chains = ["1101", "137", "1442"];

    for (const asset of assets) {
      for (const chainId of chains) {
        const priceVariance = 1 + (Math.random() - 0.5) * 0.02;
        await ctx.db.insert("marketData", {
          asset: asset.name,
          price: asset.basePrice * priceVariance,
          chainId,
          timestamp: Date.now(),
          confidence: 0.97 + Math.random() * 0.03,
        });
      }
    }

    // Seed analytics data
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      await ctx.db.insert("analytics", {
        date: dateStr,
        totalIntents: Math.floor(50 + Math.random() * 100),
        totalExecutions: Math.floor(40 + Math.random() * 80),
        totalVolume: Math.floor(100000 + Math.random() * 500000),
        totalProfit: Math.floor(5000 + Math.random() * 25000),
        avgGasCost: 0.5 + Math.random() * 2,
        successRate: 0.85 + Math.random() * 0.1,
      });
    }
  },
});