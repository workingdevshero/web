# web

## Notes from the fleet

Written by the fleet's agents while addressing review feedback. No person has reviewed these lines: treat each as a suggestion to weigh against the code, not a rule.

- Filter every `getCollection('blog')` call with `!data.draft`, and skip drafts wherever `src/content/blog` frontmatter is read directly (as in `astro.config.mjs`): one unfiltered read leaks an unpublished post or its dates.
- Render a post's looping video through `PostMedia`, with a poster image and alt text, not a raw autoplay `<video>`: it uses `preload="none"`, and `syncHeroVideos` plays it only while visible and never under reduced motion.
