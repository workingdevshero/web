import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { renderLlmsFullTxt, toAgentPost } from '@/utils/agentContent';

export const GET: APIRoute = async ({ site }) => {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return new Response(renderLlmsFullTxt(site!.href, posts.map(toAgentPost)), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
