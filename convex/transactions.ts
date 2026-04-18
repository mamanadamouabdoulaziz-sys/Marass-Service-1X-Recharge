import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
export const createTransaction = mutation({
  args: {
    type: v.union(v.literal("deposit"), v.literal("withdraw")),
    accountId: v.string(),
    amount: v.number(),
    proofStorageId: v.id("_storage"),
    destinationNumber: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Authentication required");
    return await ctx.db.insert("transactions", {
      userId,
      type: args.type,
      accountId: args.accountId,
      amount: args.amount,
      status: "pending",
      proofStorageId: args.proofStorageId,
      destinationNumber: args.destinationNumber,
      createdAt: Date.now(),
    });
  },
});
export const getUserTransactions = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("transactions")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});