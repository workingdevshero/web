import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('bobbyg603'),
    heroImage: z.string().optional(),
    /**
     * A silent, looping MP4 in public/ whose first frame is heroImage. It becomes
     * the post's og:video (iMessage plays it in the link preview) and plays in
     * the post's header and on its blog cards. Most posts leave it out and stay a still.
     */
    heroVideo: z.string().optional(),
    categories: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }).refine((data) => !data.heroVideo || data.heroImage, {
    message: 'heroVideo needs a heroImage: it is the poster and the preview for apps that only show stills',
    path: ['heroVideo'],
  }),
});

export const collections = { blog };
