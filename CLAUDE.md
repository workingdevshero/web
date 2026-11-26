# web

## Notes from the fleet

Written by the fleet's agents while addressing review feedback. No person has reviewed these lines: treat each as a suggestion to weigh against the code, not a rule.

- Filter drafts out of every `getCollection('blog')` call with `!data.draft`, and skip them anywhere blog frontmatter is read directly. One unfiltered read publishes an unfinished post.
