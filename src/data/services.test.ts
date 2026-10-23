import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const repoFile = (path: string) => fileURLToPath(new URL(`../../${path}`, import.meta.url));

const fullStackCopy = [
  'src/pages/services/full-stack.astro',
  'src/pages/services/index.astro',
  'src/components/home/ServicesPreview.astro',
].map((path) => [path, readFileSync(repoFile(path), 'utf8')] as const);

describe('Full-Stack Development copy', () => {
  it.each(fullStackCopy)('%s covers web, mobile, and desktop like the Google Business Profile', (_path, source) => {
    expect(source).toContain('End-to-end web, mobile, and desktop application development');
  });

  it.each(fullStackCopy)('%s does not list technologies we do not offer', (_path, source) => {
    for (const tech of ['Go)', 'Vue', 'Flutter', 'GCP', 'Azure']) {
      expect(source).not.toContain(tech);
    }
  });

  it('lists desktop app development as a feature', () => {
    const page = readFileSync(repoFile('src/pages/services/full-stack.astro'), 'utf8');
    expect(page).toContain("'Desktop app development'");
  });
});
