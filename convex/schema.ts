import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";
const applicationTables = {
  files: defineTable({
    userId: v.id("users"),
    storageId: v.id("_storage"),
    filename: v.string(),
    mimeType: v.string(),
    size: v.number(),
    description: v.optional(v.string()),
    uploadedAt: v.number(),
  })
    .index("by_userId_uploadedAt", ["userId", "uploadedAt"])
    .index("by_userId_storageId", ["userId", "storageId"]),
  transactions: defineTable({
    userId: v.id("users"),
    type: v.union(v.literal("deposit"), v.literal("withdraw")),
    accountId: v.string(), // ID Compte DemoBet or Withdrawal Code
    amount: v.number(),
    status: v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected")),
    proofStorageId: v.id("_storage"),
    destinationNumber: v.optional(v.string()), // Only for withdrawals
    createdAt: v.number(),
  }).index("by_userId", ["userId"]),
  claims: defineTable({
    userId: v.id("users"),
    description: v.string(),
    email: v.string(),
    proofStorageId: v.optional(v.id("_storage")),
    status: v.union(v.literal("pending"), v.literal("resolved"), v.literal("rejected")),
    createdAt: v.number(),
  }).index("by_userId", ["userId"]),
};
export default defineSchema({
  ...authTables,
  ...applicationTables,
});