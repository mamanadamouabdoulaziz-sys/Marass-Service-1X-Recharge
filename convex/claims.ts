import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
export const createClaim = mutation({
  args: {
    description: v.string(),
    email: v.string(),
    proofStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Authentication required");
    return await ctx.db.insert("claims", {
      userId,
      description: args.description,
      email: args.email,
      proofStorageId: args.proofStorageId,
      status: "pending",
      createdAt: Date.now(),
    });
  },
});
export const getUserClaims = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("claims")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});