import type { H3Event } from "h3";
import { serverSupabaseUser, serverSupabaseClient } from "#supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "#types/supabase/database";

export async function requireAdmin(event: H3Event) {
  const user = await serverSupabaseUser(event);
  if (!user) {
    console.log("user not found in server!");
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
      data: {
        message: "User not authenticated",
      },
    });
  }

  if (user.app_metadata?.role !== "admin") {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden",
      data: { message: "User is not admin" },
    });
  }

  return user;
}
