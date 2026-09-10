export type BioLink = {
  title: string;
  href: string;
  description?: string;
  external?: boolean;
  icon: 'discord' | 'bolt' | 'mail' | 'youtube' | 'instagram' | 'tiktok' | 'blog';
};

export const featuredLinks: readonly BioLink[] = [
  {
    title: 'Join Discord',
    href: '/discord',
    description: 'The squad hangs out here',
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

export const watchLinks: readonly BioLink[] = [
  {
    title: 'YouTube',
    href: 'https://youtube.com/@workingdevshero',
    description: 'Builds, walkthroughs, and the rooftop',
    external: true,
    icon: 'youtube',
  },
  {
    title: 'Instagram',
    href: 'https://www.instagram.com/workingdevshero/',
    description: 'Photos and reels from the rooftop',
    external: true,
    icon: 'instagram',
  },
  {
    title: 'TikTok',
    href: 'https://www.tiktok.com/@workingdevshero',
    description: 'Shorts from the squad',
    external: true,
    icon: 'tiktok',
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
