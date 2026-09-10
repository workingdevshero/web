import { DISCORD_INVITE_URL } from './discord';

export type BioLink = {
  title: string;
  href: string;
  description?: string;
  external?: boolean;
  icon: 'discord' | 'bolt' | 'mail' | 'globe' | 'work' | 'blog';
};

export const featuredLinks: readonly BioLink[] = [
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
  {
    title: 'Newsletter',
    href: '/newsletter',
    description: 'Join the Hero Squad — weekly AI that ships',
    icon: 'mail',
  },
];

export const siteLinks: readonly BioLink[] = [
  {
    title: 'Website',
    href: '/',
    description: 'AI-powered software that ships',
    icon: 'globe',
  },
  {
    title: 'Portfolio',
    href: '/portfolio',
    description: 'What the squad has shipped',
    icon: 'work',
  },
  {
    title: 'Blog',
    href: '/blog',
    description: 'Notes from the squad',
    icon: 'blog',
  },
];

export const productLinks: readonly BioLink[] = [
  { title: 'Chart Splat', href: 'https://chartsplat.com', external: true, icon: 'blog' },
  { title: 'Agent Shell Toolkit', href: 'https://wdh.sh', external: true, icon: 'blog' },
  { title: 'Hey Bible', href: '/portfolio/hey-bible', icon: 'blog' },
  { title: 'Shop', href: '/shop', icon: 'blog' },
];
