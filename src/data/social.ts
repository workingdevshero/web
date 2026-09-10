export type SocialIcon = 'github' | 'twitter' | 'linkedin' | 'instagram' | 'youtube' | 'tiktok';

export type SocialLink = {
  label: string;
  href: string;
  icon: SocialIcon;
};

export const socialLinks: readonly SocialLink[] = [
  { label: 'GitHub', href: 'https://github.com/workingdevshero', icon: 'github' },
  { label: 'Twitter', href: 'https://twitter.com/workingdevshero', icon: 'twitter' },
  { label: 'LinkedIn', href: 'https://linkedin.com/company/workingdevshero', icon: 'linkedin' },
  { label: 'Instagram', href: 'https://www.instagram.com/workingdevshero/', icon: 'instagram' },
  { label: 'YouTube', href: 'https://youtube.com/@workingdevshero', icon: 'youtube' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@workingdevshero', icon: 'tiktok' },
];
