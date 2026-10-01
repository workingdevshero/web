import { DISCORD_INVITE_URL } from './discord';

export type BioLink = {
  title: string;
  href: string;
  description?: string;
  external?: boolean;
  icon: 'discord' | 'bolt' | 'mail' | 'blog' | 'music';
};

export const featuredLinks: readonly BioLink[] = [
  {
    title: 'Listen to Heroic Lofi',
    href: 'https://youtu.be/Lq1RZYq4caM',
    description: '47 minutes of lo-fi to code to',
    external: true,
    icon: 'music',
  },
  {
    title: 'Join Discord',
    href: DISCORD_INVITE_URL,
    description: 'The squad hangs out here',
    external: true,
    icon: 'discord',
  },
  {
    title: 'Automate It',
    href: 'https://automate.it.com',
    description: 'Social media on autopilot. No slop allowed.',
    external: true,
    icon: 'bolt',
  },
];

export function latestPublishedPosts<T extends { data: { pubDate: Date; draft?: boolean } }>(
  posts: readonly T[],
  count = 3,
): T[] {
  return [...posts]
    .filter((post) => !post.data.draft)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
    .slice(0, count);
}
