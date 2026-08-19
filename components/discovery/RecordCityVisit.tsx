"use client";

import { useRecordVisit } from "@/components/discovery/use-city-lists";

/**
 * Records that the visitor viewed this city, for the Recently Viewed list.
 *
 * Renders nothing. It exists so the surrounding navigation can stay a server
 * component: mounting this alongside the quick nav means every city
 * intelligence page records the SAME city identity (its slug), so opening
 * /cities/tokyo, /cities/tokyo/climate and /safety/tokyo yields one "Tokyo"
 * entry rather than three.
 *
 * Storage-only and browser-local: no network request, no analytics event.
 */
export function RecordCityVisit({ slug }: { slug: string }) {
  useRecordVisit(slug);
  return null;
}
