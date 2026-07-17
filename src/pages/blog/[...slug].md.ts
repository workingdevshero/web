import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { renderPostMarkdown, toAgentPost } from '@/utils/agentContent';

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

export const GET: APIRoute = ({ props, site }) => {
  return new Response(renderPostMarkdown(site!.href, toAgentPost(props.post)), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
