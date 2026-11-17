/**
 * Supermog's numbers for /portfolio/supermog, read from the fleet's own records on `asOf`:
 * the run history, the pull request outcome ledger and the per-step token log, plus GitHub for
 * line counts. To refresh, replace the figures and the date together; the page derives every
 * percentage from these, so nothing else needs editing.
 */
export const supermogStats = {
  since: '2026-08-19',
  asOf: '2026-11-17',

  /** Every job a box ran: a develop round, a QA round, a rebase. */
  runs: 5357,
  activeDays: 77,
  busiestDay: { date: '2026-09-05', runs: 450 },
  repositories: 12,
  organizations: 2,

  /** The terminal fate of each pull request the fleet opened. */
  outcomes: {
    mergedClean: 591,
    mergedAfterEdits: 52,
    closedUnmerged: 21,
    reverted: 1,
  },
  medianHoursToMerge: 4.1,

  /** Across the merged pull requests. */
  linesAdded: 284_770,
  linesDeleted: 45_771,
  fileChanges: 6738,
  largestPullRequest: {
    title: 'Move to Angular 22 and Ionic 9',
    project: 'Olympia Fitness',
    linesAdded: 15_072,
    linesDeleted: 20_555,
    files: 218,
  },

  /**
   * Model spend as the agent CLIs reported it. The log began partway through, so runs before it
   * carry no cost and the true total is higher.
   */
  spend: {
    totalUsd: 10_477,
    runsWithCost: 2903,
    medianUsdPerMergedPullRequest: 6.95,
    byStep: [
      { step: 'Writing the code', usd: 4526 },
      { step: 'Verifying', usd: 2090 },
      { step: 'Addressing review', usd: 1889 },
      { step: 'Learning from review', usd: 729 },
      { step: 'Reviewing', usd: 696 },
      { step: 'Resolving conflicts', usd: 542 },
    ],
    cacheReadTokens: 24_120_000_000,
    inputTokens: 780_000_000,
    outputTokens: 140_000_000,
  },

  /** Wall-clock hours inside each kind of step, summed over every run. */
  hours: {
    developing: 692,
    verifying: 249,
    allRuns: 1234,
  },
  verification: {
    sessions: 1795,
    medianMinutes: 5.8,
    longestMinutes: 62,
  },
  longestCodingStepMinutes: 90,

  runsByBox: [
    { box: 'pi-1', hardware: 'Raspberry Pi 5, 8 GB', runs: 2543 },
    { box: 'pi-2', hardware: 'Raspberry Pi 5, 8 GB', runs: 2352 },
    { box: 'mac', hardware: 'MacBook Pro', runs: 327 },
    { box: 'sidekick', hardware: 'Minisforum MS-A2', runs: 135 },
  ],
} as const;

type Outcomes = typeof supermogStats.outcomes;

export function pullRequestTotal(outcomes: Outcomes = supermogStats.outcomes): number {
  return outcomes.mergedClean + outcomes.mergedAfterEdits + outcomes.closedUnmerged + outcomes.reverted;
}

export function mergedTotal(outcomes: Outcomes = supermogStats.outcomes): number {
  return outcomes.mergedClean + outcomes.mergedAfterEdits + outcomes.reverted;
}

/** A share of all pull requests, to one decimal place. */
export function share(count: number, outcomes: Outcomes = supermogStats.outcomes): number {
  return Math.round((count / pullRequestTotal(outcomes)) * 1000) / 10;
}

/** 284770 → "284,770". Fixed to en-US so the built page does not depend on the build machine. */
export function formatCount(value: number): string {
  return value.toLocaleString('en-US');
}

/** 24120000000 → "24.1 billion", 780000000 → "780 million". */
export function formatLarge(value: number): string {
  if (value >= 1e9) return `${Math.round(value / 1e8) / 10} billion`;
  if (value >= 1e6) return `${Math.round(value / 1e6)} million`;
  return formatCount(value);
}
