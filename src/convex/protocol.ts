import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Helper to upsert today's analytics record
async function upsertTodayAnalytics(
  ctx: any,
  updates: {
    intentsDelta?: number;
    executionsDelta?: number;
    volumeDelta?: number;
    profitDelta?: number;
    gasCostSample?: number;
  }
) {
  const today = new Date().toISOString().split("T")[0];
  const existing = await ctx.db
    .query("analytics")
    .withIndex("by_date", (q: any) => q.eq("date", today))
    .first();

  if (existing) {
    await ctx.db.patch(existing._id, {
      totalIntents: existing.totalIntents + (updates.intentsDelta || 0),
      totalExecutions: existing.totalExecutions + (updates.executionsDelta || 0),
      totalVolume: existing.totalVolume + (updates.volumeDelta || 0),
      totalProfit: existing.totalProfit + (updates.profitDelta || 0),
      avgGasCost: updates.gasCostSample !== undefined
        ? (existing.avgGasCost + updates.gasCostSample) / 2
        : existing.avgGasCost,
      successRate: existing.totalExecutions > 0
        ? existing.totalExecutions / Math.max(existing.totalIntents, 1)
        : existing.successRate,
    });
  } else {
    await ctx.db.insert("analytics", {
      date: today,
      totalIntents: updates.intentsDelta || 0,
      totalExecutions: updates.executionsDelta || 0,
      totalVolume: updates.volumeDelta || 0,
      totalProfit: updates.profitDelta || 0,
      avgGasCost: updates.gasCostSample || 0,
      successRate: 0,
    });
  }
}

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
    const intents = await ctx.db.query("intents").take(500);
    const executions = await ctx.db.query("executions").take(500);
    
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
      .take(100);

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
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const config = await ctx.db
      .query("botConfigs")
      .withIndex("by_user", (q) => q.eq("userId", userId))
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
      .take(200);

    const totalStaked = activeStakes.reduce((acc, curr) => acc + curr.amount, 0);
    const totalRewards = activeStakes.reduce((acc, curr) => acc + curr.rewardsEarned, 0);

    return {
      totalStaked,
      totalRewards,
      activeStakers: activeStakes.length,
      apy: 12.5,
    };
  },
});

// Wave 6: Protocol Adapters
export const getProtocolAdapters = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("protocolAdapters").take(20);
  },
});

// Wave 6: Audit Findings
export const getAuditFindings = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("auditFindings").order("desc").take(50);
  },
});

// Wave 6: Batch Liquidations
export const getBatchLiquidations = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("batchLiquidations").order("desc").take(20);
  },
});

// Check if seed data already exists
export const isSeedDataPresent = query({
  args: {},
  handler: async (ctx) => {
    const marketData = await ctx.db.query("marketData").take(1);
    return marketData.length > 0;
  },
});

// --- Mutations ---

export const submitIntent = mutation({
  args: {
    targetUserAddress: v.string(),
    targetHealthFactor: v.number(),
    minPrice: v.number(),
    bondAmount: v.number(),
    walletAddress: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let userId = await getAuthUserId(ctx);

    if (!userId && args.walletAddress) {
      const existingUser = await ctx.db
        .query("users")
        .withIndex("by_wallet", (q) => q.eq("walletAddress", args.walletAddress!))
        .first();

      if (existingUser) {
        userId = existingUser._id;
      } else {
        userId = await ctx.db.insert("users", {
          walletAddress: args.walletAddress,
          name: `${args.walletAddress.substring(0, 6)}...${args.walletAddress.substring(38)}`,
          reputationScore: 0,
          totalLiquidations: 0,
          successfulLiquidations: 0,
          totalProfit: 0,
          badges: [],
        });
      }
    }

    if (!userId) throw new Error("Unauthorized: Please connect your wallet or sign in");

    if (!args.targetUserAddress.startsWith("0x") || args.targetUserAddress.length !== 42) {
      throw new Error("Invalid target user address format");
    }
    if (args.targetHealthFactor <= 0 || args.targetHealthFactor >= 1.0) {
      throw new Error("Target health factor must be between 0 and 1.0 for liquidatable positions");
    }
    if (args.minPrice <= 0) {
      throw new Error("Min price must be positive");
    }
    if (args.bondAmount < 0.1) {
      throw new Error("Bond amount must be at least 0.1 MATIC");
    }

    const dbUser = await ctx.db.get(userId);
    if (!dbUser) throw new Error("User not found");

    const pendingIntents = await ctx.db
      .query("intents")
      .withIndex("by_liquidator", (q) => q.eq("liquidatorId", userId!))
      .take(20);
    
    const activePending = pendingIntents.filter(i => i.status === "pending");
    if (activePending.length >= 10) {
      throw new Error("Maximum 10 pending intents allowed. Execute or cancel existing intents first.");
    }

    const aiRiskScore = Math.floor(70 + Math.random() * 30);
    const predictedProfit = args.minPrice * (0.05 + Math.random() * 0.05);
    const gasEstimate = 150000 + Math.floor(Math.random() * 50000);
    const optimalExecutionTime = Date.now() + Math.floor(Math.random() * 3600000);

    // Generate a valid 32-byte (64 hex char) intentHash
    const generateBytes32 = () => {
      const parts = Array.from({ length: 8 }, () =>
        Math.floor(Math.random() * 0xffffffff).toString(16).padStart(8, "0")
      );
      return "0x" + parts.join("");
    };

    const intentId = await ctx.db.insert("intents", {
      liquidatorId: userId,
      targetUserAddress: args.targetUserAddress,
      targetHealthFactor: args.targetHealthFactor,
      minPrice: args.minPrice,
      deadline: Date.now() + 86400000,
      bondAmount: args.bondAmount,
      status: "pending",
      intentHash: generateBytes32(),
      aiRiskScore,
      predictedProfit,
      gasEstimate,
      optimalExecutionTime,
    });

    // Track real analytics
    await upsertTodayAnalytics(ctx, {
      intentsDelta: 1,
      volumeDelta: args.minPrice,
    });

    return intentId;
  },
});

export const updateIntentHash = mutation({
  args: {
    intentId: v.id("intents"),
    intentHash: v.string(),
    walletAddress: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let userId = await getAuthUserId(ctx);

    if (!userId && args.walletAddress) {
      const existingUser = await ctx.db
        .query("users")
        .withIndex("by_wallet", (q) => q.eq("walletAddress", args.walletAddress!))
        .first();
      if (existingUser) userId = existingUser._id;
    }

    if (!userId) throw new Error("Unauthorized");

    const intent = await ctx.db.get(args.intentId);
    if (!intent) throw new Error("Intent not found");

    await ctx.db.patch(args.intentId, { intentHash: args.intentHash });
  },
});

export const verifyIntent = mutation({
  args: { 
    intentId: v.id("intents"),
    walletAddress: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let userId = await getAuthUserId(ctx);

    if (!userId && args.walletAddress) {
      const existingUser = await ctx.db
        .query("users")
        .withIndex("by_wallet", (q) => q.eq("walletAddress", args.walletAddress!))
        .first();
      if (existingUser) userId = existingUser._id;
    }

    if (!userId) throw new Error("Unauthorized");

    const intent = await ctx.db.get(args.intentId);
    if (!intent) throw new Error("Intent not found");
    if (intent.status !== "pending") throw new Error("Intent is not in pending state");

    if (Date.now() > intent.deadline) {
      await ctx.db.patch(args.intentId, { status: "failed" });
      throw new Error("Intent deadline has passed");
    }

    const isValid = Math.random() > 0.05;

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
  args: { 
    intentId: v.id("intents"),
    walletAddress: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let userId = await getAuthUserId(ctx);

    if (!userId && args.walletAddress) {
      const existingUser = await ctx.db
        .query("users")
        .withIndex("by_wallet", (q) => q.eq("walletAddress", args.walletAddress!))
        .first();
      if (existingUser) userId = existingUser._id;
    }

    if (!userId) throw new Error("Unauthorized");

    const dbUser = await ctx.db.get(userId);
    if (!dbUser) throw new Error("User not found");

    const intent = await ctx.db.get(args.intentId);
    if (!intent) throw new Error("Intent not found");
    if (intent.status !== "verified") throw new Error("Intent not ready for execution — must be verified first");

    const existingExecution = await ctx.db
      .query("executions")
      .withIndex("by_intent", (q) => q.eq("intentId", args.intentId))
      .first();
    if (existingExecution) throw new Error("Intent has already been executed");

    const liquidationBonus = intent.bondAmount * 100 * (0.05 + Math.random() * 0.05);
    const profit = liquidationBonus - (intent.bondAmount * 0.1);
    const gasUsed = 180000 + Math.floor(Math.random() * 50000);
    const gasCost = gasUsed * 0.00000003;

    await ctx.db.insert("executions", {
      intentId: args.intentId,
      executorId: userId,
      txHash: "0x" + Math.random().toString(16).substring(2, 66),
      profit,
      executedAt: Date.now(),
      chain: Math.random() > 0.5 ? "Polygon zkEVM" : "Polygon PoS",
      gasUsed,
      gasCost,
    });

    await ctx.db.patch(args.intentId, { status: "executed" });

    const currentTotal = dbUser.totalLiquidations || 0;
    const currentSuccess = dbUser.successfulLiquidations || 0;
    const currentProfit = dbUser.totalProfit || 0;
    const currentScore = dbUser.reputationScore || 0;

    await ctx.db.patch(userId, {
      totalLiquidations: currentTotal + 1,
      successfulLiquidations: currentSuccess + 1,
      totalProfit: currentProfit + profit,
      reputationScore: currentScore + 10,
    });

    // Track real analytics
    await upsertTodayAnalytics(ctx, {
      executionsDelta: 1,
      volumeDelta: intent.minPrice,
      profitDelta: profit,
      gasCostSample: gasCost,
    });
  },
});

export const runSimulation = mutation({
  args: {
    targetAddress: v.string(),
    targetHealthFactor: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    if (!args.targetAddress.startsWith("0x") || args.targetAddress.length !== 42) {
      throw new Error("Invalid target address format");
    }
    if (args.targetHealthFactor <= 0 || args.targetHealthFactor > 2) {
      throw new Error("Health factor must be between 0 and 2");
    }

    const success = Math.random() > 0.2;
    const estimatedProfit = success ? 100 + Math.random() * 500 : 0;
    const estimatedGas = 150000 + Math.floor(Math.random() * 100000);

    await ctx.db.insert("simulations", {
      userId,
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
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    if (args.minHealthFactor >= args.maxHealthFactor) {
      throw new Error("Min health factor must be less than max health factor");
    }
    if (args.minHealthFactor <= 0 || args.maxHealthFactor > 2) {
      throw new Error("Health factors must be between 0 and 2");
    }
    if (args.minProfitThreshold < 0) {
      throw new Error("Profit threshold cannot be negative");
    }
    if (args.targetChains.length === 0) {
      throw new Error("At least one target chain must be selected");
    }

    const existing = await ctx.db
      .query("botConfigs")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, args);
    } else {
      await ctx.db.insert("botConfigs", {
        userId,
        ...args,
      });
    }
  },
});

export const stakeInsurance = mutation({
  args: { amount: v.number() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    if (args.amount <= 0) throw new Error("Stake amount must be positive");
    if (args.amount > 10000) throw new Error("Maximum stake is 10,000 MATIC per transaction");

    await ctx.db.insert("insuranceStakes", {
      userId,
      amount: args.amount,
      stakedAt: Date.now(),
      rewardsEarned: 0,
      isActive: true,
    });
  },
});

// Wave 6: Execute Batch Liquidation
export const executeBatchLiquidation = mutation({
  args: {
    intentIds: v.array(v.string()),
    chain: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    if (args.intentIds.length === 0) throw new Error("No intents provided");
    if (args.intentIds.length > 50) throw new Error("Maximum 50 intents per batch");

    const positionCount = args.intentIds.length;
    const totalProfit = positionCount * (150 + Math.random() * 300);
    const totalGasUsed = positionCount * 180000 * 0.72;
    const gasSavingPercent = 28 + Math.random() * 5;

    await ctx.db.insert("batchLiquidations", {
      executorId: userId,
      intentIds: args.intentIds,
      totalProfit,
      totalGasUsed,
      gasSavingPercent,
      txHash: "0x" + Math.random().toString(16).substring(2, 66),
      chain: args.chain,
      executedAt: Date.now(),
      positionCount,
      status: "completed",
    });

    return { totalProfit, gasSavingPercent, positionCount };
  },
});

// Seed adapters separately (idempotent)
export const seedAdapters = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("protocolAdapters").take(1);
    if (existing.length > 0) {
      throw new Error("Adapters already seeded.");
    }

    const adapters = [
      {
        name: "Aave V3",
        protocol: "aave",
        network: "Polygon Amoy",
        contractAddress: "0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951",
        status: "live" as const,
        tvl: 4200000,
        liquidationsExecuted: 847,
        avgGasSaving: 31,
        lastUpdated: Date.now(),
      },
      {
        name: "Compound V3",
        protocol: "compound",
        network: "Polygon Amoy",
        contractAddress: "0xF25212E676D1F7F89Cd72fFEe66158f541246445",
        status: "testing" as const,
        tvl: 0,
        liquidationsExecuted: 12,
        avgGasSaving: 28,
        lastUpdated: Date.now(),
      },
      {
        name: "Morpho Blue",
        protocol: "morpho",
        network: "Polygon Amoy",
        contractAddress: "0x0000000000000000000000000000000000000000",
        status: "planned" as const,
        tvl: 0,
        liquidationsExecuted: 0,
        avgGasSaving: 0,
        lastUpdated: Date.now(),
      },
    ];

    for (const adapter of adapters) {
      await ctx.db.insert("protocolAdapters", adapter);
    }
  },
});

export const refreshAnalytics = mutation({
  args: {},
  handler: async (ctx) => {
    // Delete all existing analytics
    const existing = await ctx.db.query("analytics").take(500);
    for (const record of existing) {
      await ctx.db.delete(record._id);
    }

    // Re-seed with current dates
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

// Clear all analytics (for switching to real data)
export const clearAnalytics = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("analytics").take(500);
    for (const record of existing) {
      await ctx.db.delete(record._id);
    }
  },
});

// Enhanced seed data with Wave 6 data — guarded against duplicate seeding
export const seedData = mutation({
  args: {},
  handler: async (ctx) => {
    const existingMarketData = await ctx.db.query("marketData").take(1);
    if (existingMarketData.length > 0) {
      throw new Error("Data already seeded. Clear the database first to re-seed.");
    }

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

    // Wave 6: Seed Protocol Adapters
    const adapters = [
      {
        name: "Aave V3",
        protocol: "aave",
        network: "Polygon Amoy",
        contractAddress: "0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951",
        status: "live" as const,
        tvl: 4200000,
        liquidationsExecuted: 847,
        avgGasSaving: 31,
        lastUpdated: Date.now(),
      },
      {
        name: "Compound V3",
        protocol: "compound",
        network: "Polygon Amoy",
        contractAddress: "0xF25212E676D1F7F89Cd72fFEe66158f541246445",
        status: "testing" as const,
        tvl: 0,
        liquidationsExecuted: 12,
        avgGasSaving: 28,
        lastUpdated: Date.now(),
      },
      {
        name: "Morpho Blue",
        protocol: "morpho",
        network: "Polygon Amoy",
        contractAddress: "0x0000000000000000000000000000000000000000",
        status: "planned" as const,
        tvl: 0,
        liquidationsExecuted: 0,
        avgGasSaving: 0,
        lastUpdated: Date.now(),
      },
    ];

    for (const adapter of adapters) {
      await ctx.db.insert("protocolAdapters", adapter);
    }

    // Wave 6: Seed Audit Findings
    const findings = [
      {
        title: "Reentrancy Guard Missing in executeIntent",
        severity: "high" as const,
        category: "reentrancy",
        description: "The executeIntent function lacked a reentrancy guard, potentially allowing recursive calls during token transfers. Fixed with OpenZeppelin ReentrancyGuard.",
        status: "resolved" as const,
        contract: "LiquidationExecutor",
        resolvedAt: Date.now() - 86400000 * 3,
        createdAt: Date.now() - 86400000 * 10,
      },
      {
        title: "Oracle Price Staleness Check",
        severity: "medium" as const,
        category: "oracle",
        description: "Price feeds now enforce a maximum staleness window of 60 seconds. Stale prices revert with STALE_PRICE error.",
        status: "resolved" as const,
        contract: "RiskOracle",
        resolvedAt: Date.now() - 86400000 * 1,
        createdAt: Date.now() - 86400000 * 7,
      },
      {
        title: "Bond Slashing Logic Edge Case",
        severity: "medium" as const,
        category: "logic",
        description: "Edge case where bond slashing can be bypassed if intent deadline passes before verification completes. Deadline check added to verifyIntent.",
        status: "in-progress" as const,
        contract: "IntentRegistry",
        createdAt: Date.now() - 86400000 * 5,
      },
      {
        title: "Access Control on Admin Functions",
        severity: "high" as const,
        category: "access-control",
        description: "Admin functions in LiquidationExecutor should use a multi-sig pattern rather than single owner. Gnosis Safe integration in progress.",
        status: "in-progress" as const,
        contract: "LiquidationExecutor",
        createdAt: Date.now() - 86400000 * 4,
      },
      {
        title: "Integer Overflow in Profit Calculation",
        severity: "low" as const,
        category: "arithmetic",
        description: "Profit calculation upgraded to Solidity 0.8.20 with built-in overflow protection. SafeMath removed as redundant.",
        status: "resolved" as const,
        contract: "LiquidationExecutor",
        resolvedAt: Date.now() - 86400000 * 2,
        createdAt: Date.now() - 86400000 * 8,
      },
      {
        title: "Gas Limit Estimation for Batch Operations",
        severity: "info" as const,
        category: "gas",
        description: "Batch liquidation gas estimates now include a 20% buffer to prevent out-of-gas failures on large batches.",
        status: "acknowledged" as const,
        contract: "BatchExecutor",
        createdAt: Date.now() - 86400000 * 2,
      },
      {
        title: "Double Execution Prevention",
        severity: "high" as const,
        category: "logic",
        description: "Added execution existence check before processing to prevent the same intent from being executed twice in a race condition.",
        status: "resolved" as const,
        contract: "LiquidationExecutor",
        resolvedAt: Date.now() - 86400000 * 1,
        createdAt: Date.now() - 86400000 * 6,
      },
      {
        title: "Input Validation on Intent Submission",
        severity: "medium" as const,
        category: "validation",
        description: "Added strict input validation: address format check, health factor range (0-1.0), minimum bond amount (0.1 MATIC), and rate limiting (max 10 pending intents per user).",
        status: "resolved" as const,
        contract: "IntentRegistry",
        resolvedAt: Date.now(),
        createdAt: Date.now() - 86400000 * 2,
      },
    ];

    for (const finding of findings) {
      await ctx.db.insert("auditFindings", finding);
    }
  },
});