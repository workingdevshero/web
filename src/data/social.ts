export type SocialIcon = 'github' | 'twitter' | 'linkedin' | 'instagram' | 'threads' | 'facebook' | 'youtube' | 'tiktok';

export type SocialLink = {
  label: string;
  href: string;
  icon: SocialIcon;
};

export const socialLinks: readonly SocialLink[] = [
  { label: 'GitHub', href: 'https://github.com/workingdevshero', icon: 'github' },
  { label: 'X', href: 'https://x.com/workingdevshero', icon: 'twitter' },
  { label: 'LinkedIn', href: 'https://linkedin.com/company/workingdevshero', icon: 'linkedin' },
  { label: 'Instagram', href: 'https://www.instagram.com/workingdevshero/', icon: 'instagram' },
  { label: 'Threads', href: 'https://www.threads.com/@workingdevshero', icon: 'threads' },
  { label: 'Facebook', href: 'https://www.facebook.com/workingdevshero', icon: 'facebook' },
  { label: 'YouTube', href: 'https://youtube.com/@workingdevshero', icon: 'youtube' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@workingdevshero', icon: 'tiktok' },
];
