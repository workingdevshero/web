import type { PostHogConfig } from 'posthog-js';

/**
 * PostHog web analytics for workingdevshero.com.
 *
 * One PostHog project is shared by every Working Dev's Hero site, so each
 * site registers a `product` super property and dashboards filter on it
 * (or on `$host`). The project key is a public, write-only token and is
 * meant to ship in the page source.
 */
export const POSTHOG_KEY = 'phc_zJPF68yYJU8yJnwvBG9dss3CuvZN2NbBU4cr7W5qNYKU';

/** US Cloud ingest endpoint. The site is static assets only, so no proxy. */
export const POSTHOG_HOST = 'https://us.i.posthog.com';

/** Where toolbar and dashboard links point. */
export const POSTHOG_UI_HOST = 'https://us.posthog.com';

/** Super property that tells the shared project which site sent the event. */
export const PRODUCT = 'workingdevshero';

export const posthogConfig = {
  api_host: POSTHOG_HOST,
  ui_host: POSTHOG_UI_HOST,
  // PostHog's 2025-05-24 defaults: pageviews on history changes, profiles only
  // for identified users, and the other current best-practice flags.
  defaults: '2025-05-24',
  // No cookies: everything lives in localStorage, so no consent banner.
  persistence: 'localStorage',
  // Anonymous visitors never get a person profile.
  person_profiles: 'identified_only',
  // Pageviews and explicit events only; no click/form autocapture.
  autocapture: false,
  capture_pageleave: true,
  disable_session_recording: true,
} satisfies Partial<PostHogConfig>;

/** The slice of the posthog-js client that init needs. Injected for tests. */
export interface AnalyticsClient {
  __loaded?: boolean;
  init(token: string, config: Partial<PostHogConfig>): unknown;
  register(properties: Record<string, string>): void;
}

/**
 * Initialise PostHog once per page load and tag every event with the product.
 * Returns false when the client was already loaded (for example, when a
 * script runs twice in dev with HMR).
 */
export function initAnalytics(client: AnalyticsClient): boolean {
  if (client.__loaded) return false;
  client.init(POSTHOG_KEY, posthogConfig);
  client.register({ product: PRODUCT });
  return true;
}
