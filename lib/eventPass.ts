"use client";

/**
 * Helper to register a user for an event and immediately generate their Event Pass.
 * Saves to both localStorage and Clerk user metadata with zero backend needed.
 */
export function getRegisteredEventIds(user?: any): string[] {
  if (typeof window === "undefined" || !user || !user.id) return [];
  try {
    const fromClerk = (user?.unsafeMetadata?.registeredEventIds as string[]) || [];
    const userKey = `cj_registered_event_ids_${user.id}`;
    const local = JSON.parse(
      localStorage.getItem(userKey) ||
      localStorage.getItem("cj_registered_event_ids_v2") ||
      "[]"
    );
    return Array.from(new Set([...(Array.isArray(local) ? local : []), ...fromClerk]));
  } catch {
    return [];
  }
}

export function isEventRegistered(eventId: string, user?: any): boolean {
  if (!eventId || !user || !user.id) return false;
  const list = getRegisteredEventIds(user);
  return list.includes(eventId);
}

export async function registerForEvent(eventId: string, user?: any): Promise<string[]> {
  if (!eventId || typeof window === "undefined") return [];

  // Strictly enforce authentication: no registration without sign in / sign up
  if (!user || !user.id) {
    console.warn("User must be signed in to register for an event.");
    return [];
  }

  const userKey = `cj_registered_event_ids_${user.id}`;
  const current = getRegisteredEventIds(user);
  const next = Array.from(new Set([...current, eventId]));

  // 1. Save to user-specific localStorage
  try {
    localStorage.setItem(userKey, JSON.stringify(next));
    localStorage.setItem("cj_registered_event_ids_v2", JSON.stringify(next));
  } catch (err) {
    console.error("Failed to save registered event to localStorage:", err);
  }

  // 2. Save to Clerk user metadata
  if (user && typeof user.update === "function") {
    try {
      await user.update({
        unsafeMetadata: {
          ...(user.unsafeMetadata || {}),
          registeredEventIds: next,
        },
      });
    } catch (err) {
      console.error("Failed to sync registered event to Clerk metadata:", err);
    }
  }

  // 3. Notify listeners across components
  try {
    window.dispatchEvent(
      new CustomEvent("cj:event-registered", {
        detail: { eventId, allIds: next },
      })
    );
  } catch {
    // Ignore in non-browser environments
  }

  return next;
}
