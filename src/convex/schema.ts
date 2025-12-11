import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
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
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
    }).index("email", ["email"]), // index for the email. do not remove or modify

    // Liquidation Intent Registry
    intents: defineTable({
      liquidatorId: v.id("users"),
      targetUserAddress: v.string(),
      targetHealthFactor: v.number(),
      minPrice: v.number(),
      deadline: v.number(), // block number or timestamp
      bondAmount: v.number(), // in POL
      status: v.union(
        v.literal("pending"),
        v.literal("verified"),
        v.literal("executed"),
        v.literal("failed")
      ),
      intentHash: v.string(),
    }).index("by_status", ["status"])
      .index("by_liquidator", ["liquidatorId"]),

    // ZK Liquidation Verifier
    verifications: defineTable({
      intentId: v.id("intents"),
      proofHash: v.string(),
      verifiedAt: v.number(),
      isValid: v.boolean(),
      verifierNode: v.string(),
      cost: v.number(),
    }).index("by_intent", ["intentId"]),

    // AggLayer Liquidation Executor
    executions: defineTable({
      intentId: v.id("intents"),
      executorId: v.id("users"),
      txHash: v.string(),
      profit: v.number(),
      executedAt: v.number(),
      chain: v.string(),
    }).index("by_intent", ["intentId"]),

    // Cross-Chain Risk Oracle
    marketData: defineTable({
      asset: v.string(),
      price: v.number(),
      chainId: v.string(),
      timestamp: v.number(),
      confidence: v.number(),
    }).index("by_asset", ["asset"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;