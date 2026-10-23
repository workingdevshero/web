import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it, vi } from 'vitest';
import {
  POSTHOG_HOST,
  POSTHOG_KEY,
  POSTHOG_UI_HOST,
  PRODUCT,
  initAnalytics,
  posthogConfig,
} from './analytics';

const repoFile = (path: string) => fileURLToPath(new URL(`../../${path}`, import.meta.url));

describe('PostHog configuration', () => {
  it('uses the shared Working Dev\'s Hero project on US Cloud', () => {
    expect(POSTHOG_KEY).toBe('phc_zJPF68yYJU8yJnwvBG9dss3CuvZN2NbBU4cr7W5qNYKU');
    expect(POSTHOG_HOST).toBe('https://us.i.posthog.com');
    expect(POSTHOG_UI_HOST).toBe('https://us.posthog.com');
    expect(posthogConfig.api_host).toBe(POSTHOG_HOST);
    expect(posthogConfig.ui_host).toBe(POSTHOG_UI_HOST);
  });

  it('tags this site as the workingdevshero product', () => {
    expect(PRODUCT).toBe('workingdevshero');
  });

  it('runs without cookies, autocapture, or session recording', () => {
    expect(posthogConfig.defaults).toBe('2025-05-24');
    expect(posthogConfig.persistence).toBe('localStorage');
    expect(posthogConfig.person_profiles).toBe('identified_only');
    expect(posthogConfig.autocapture).toBe(false);
    expect(posthogConfig.capture_pageleave).toBe(true);
    expect(posthogConfig.disable_session_recording).toBe(true);
  });
});

describe('initAnalytics', () => {
  it('initialises the client with the key and config, then registers the product', () => {
    const client = { init: vi.fn(), register: vi.fn() };

    expect(initAnalytics(client)).toBe(true);

    expect(client.init).toHaveBeenCalledWith(POSTHOG_KEY, posthogConfig);
    expect(client.register).toHaveBeenCalledWith({ product: PRODUCT });
    expect(client.init.mock.invocationCallOrder[0]).toBeLessThan(client.register.mock.invocationCallOrder[0]);
  });

  it('does nothing when the client is already loaded', () => {
    const client = { __loaded: true, init: vi.fn(), register: vi.fn() };

    expect(initAnalytics(client)).toBe(false);

    expect(client.init).not.toHaveBeenCalled();
    expect(client.register).not.toHaveBeenCalled();
  });
});

describe('site wiring', () => {
  it('loads analytics from the base layout so every page is tracked', () => {
    const layout = readFileSync(repoFile('src/layouts/BaseLayout.astro'), 'utf8');
    expect(layout).toContain("from 'posthog-js'");
    expect(layout).toContain("from '@/lib/analytics'");
    expect(layout).toContain('initAnalytics(posthog)');
  });

  it('declares posthog-js as a runtime dependency', () => {
    const pkg = JSON.parse(readFileSync(repoFile('package.json'), 'utf8'));
    expect(pkg.dependencies['posthog-js']).toMatch(/^\^?\d+\.\d+\.\d+$/);
  });
});
