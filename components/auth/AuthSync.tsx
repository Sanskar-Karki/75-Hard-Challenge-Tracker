"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { use75Hard } from "@/hooks/use-75hard";

export function AuthSync() {
  const { isSignedIn, user, isLoaded } = useUser();
  const { fetchChallenge } = use75Hard();

  // Unified Cloud Sync: Fetches from Supabase on every login/refresh
  useEffect(() => {
    if (isLoaded && isSignedIn && user?.id) {
      console.log("🏙️ Initializing Cloud-Native Sync...");
      fetchChallenge(user.id);
    }
  }, [isLoaded, isSignedIn, user?.id, fetchChallenge]);

  return null;
}
