import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

const schema = defineSchema(
  {
    ...authTables,

    users: defineTable({
      name: v.optional(v.string()),
      image: v.optional(v.string()),
      email: v.optional(v.string()),
      emailVerificationTime: v.optional(v.number()),
      isAnonymous: v.optional(v.boolean()),
      role: v.optional(roleValidator),
      reputationScore: v.optional(v.number()),
      totalLiquidations: v.optional(v.number()),
      successfulLiquidations: v.optional(v.number()),
      totalProfit: v.optional(v.number()),
      badges: v.optional(v.array(v.string())),
      walletAddress: v.optional(v.string()),
    }).index("email", ["email"])
      .index("by_wallet", ["walletAddress"]),

    intents: defineTable({
      liquidatorId: v.id("users"),
      targetUserAddress: v.string(),
      targetHealthFactor: v.number(),
      minPrice: v.number(),
      deadline: v.number(),
      bondAmount: v.number(),
      status: v.union(
        v.literal("pending"),
        v.literal("verified"),
        v.literal("executed"),
        v.literal("failed")
      ),
      intentHash: v.string(),
      aiRiskScore: v.optional(v.number()),
      predictedProfit: v.optional(v.number()),
      gasEstimate: v.optional(v.number()),
      optimalExecutionTime: v.optional(v.number()),
    }).index("by_status", ["status"])
      .index("by_liquidator", ["liquidatorId"])
      .index("by_risk_score", ["aiRiskScore"]),

    verifications: defineTable({
      intentId: v.id("intents"),
      proofHash: v.string(),
      verifiedAt: v.number(),
      isValid: v.boolean(),
      verifierNode: v.string(),
      cost: v.number(),
    }).index("by_intent", ["intentId"]),

    executions: defineTable({
      intentId: v.id("intents"),
      executorId: v.id("users"),
      txHash: v.string(),
      profit: v.number(),
      executedAt: v.number(),
      chain: v.string(),
      gasUsed: v.optional(v.number()),
      gasCost: v.optional(v.number()),
    }).index("by_intent", ["intentId"])
      .index("by_executor", ["executorId"]),

    marketData: defineTable({
      asset: v.string(),
      price: v.number(),
      chainId: v.string(),
      timestamp: v.number(),
      confidence: v.number(),
    }).index("by_asset", ["asset"]),

    simulations: defineTable({
      userId: v.id("users"),
      targetAddress: v.string(),
      targetHealthFactor: v.number(),
      estimatedProfit: v.number(),
      estimatedGas: v.number(),
      simulatedAt: v.number(),
      success: v.boolean(),
      errorMessage: v.optional(v.string()),
    }).index("by_user", ["userId"]),

    botConfigs: defineTable({
      userId: v.id("users"),
      isActive: v.boolean(),
      minHealthFactor: v.number(),
      maxHealthFactor: v.number(),
      minProfitThreshold: v.number(),
      targetChains: v.array(v.string()),
      autoExecute: v.boolean(),
      notificationEmail: v.optional(v.string()),
    }).index("by_user", ["userId"])
      .index("by_active", ["isActive"]),

    insuranceStakes: defineTable({
      userId: v.id("users"),
      amount: v.number(),
      stakedAt: v.number(),
      unstakedAt: v.optional(v.number()),
      rewardsEarned: v.number(),
      isActive: v.boolean(),
    }).index("by_user", ["userId"])
      .index("by_active", ["isActive"]),

    analytics: defineTable({
      date: v.string(),
      totalIntents: v.number(),
      totalExecutions: v.number(),
      totalVolume: v.number(),
      totalProfit: v.number(),
      avgGasCost: v.number(),
      successRate: v.number(),
    }).index("by_date", ["date"]),

    // Wave 6: Protocol Adapters
    protocolAdapters: defineTable({
      name: v.string(), // "Aave V3", "Compound V3", "Morpho Blue"
      protocol: v.string(), // "aave", "compound", "morpho"
      network: v.string(),
      contractAddress: v.string(),
      status: v.union(
        v.literal("live"),
        v.literal("testing"),
        v.literal("planned")
      ),
      tvl: v.optional(v.number()),
      liquidationsExecuted: v.optional(v.number()),
      avgGasSaving: v.optional(v.number()),
      lastUpdated: v.number(),
    }).index("by_protocol", ["protocol"])
      .index("by_status", ["status"]),

    // Wave 6: Security Audit Findings
    auditFindings: defineTable({
      title: v.string(),
      severity: v.union(
        v.literal("critical"),
        v.literal("high"),
        v.literal("medium"),
        v.literal("low"),
        v.literal("info")
      ),
      category: v.string(), // "reentrancy", "oracle", "access-control", etc.
      description: v.string(),
      status: v.union(
        v.literal("open"),
        v.literal("in-progress"),
        v.literal("resolved"),
        v.literal("acknowledged")
      ),
      contract: v.string(),
      resolvedAt: v.optional(v.number()),
      createdAt: v.number(),
    }).index("by_severity", ["severity"])
      .index("by_status", ["status"]),

    // Wave 6: Batch Liquidations
    batchLiquidations: defineTable({
      executorId: v.id("users"),
      intentIds: v.array(v.string()),
      totalProfit: v.number(),
      totalGasUsed: v.number(),
      gasSavingPercent: v.number(),
      txHash: v.string(),
      chain: v.string(),
      executedAt: v.number(),
      positionCount: v.number(),
      status: v.union(
        v.literal("pending"),
        v.literal("executing"),
        v.literal("completed"),
        v.literal("failed")
      ),
    }).index("by_executor", ["executorId"])
      .index("by_status", ["status"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;