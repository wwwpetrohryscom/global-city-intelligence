"use client";

import { useSyncExternalStore } from "react";

import { getServerSnapshot, getSnapshot, subscribe, type PrivacyState } from "@/lib/analytics/store";

export function usePrivacy(): PrivacyState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useAnalyticsAuthorised(): boolean {
  return usePrivacy().authorisation.authorised;
}
