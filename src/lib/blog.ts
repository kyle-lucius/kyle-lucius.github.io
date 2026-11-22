import { getCollection } from 'astro:content';

export async function getBlogPosts() {
  const posts = await getCollection('blog', ({ data }) => import.meta.env.DEV || !data.draft);
  return posts.sort((left, right) =>
    right.data.date.localeCompare(left.data.date) || left.id.localeCompare(right.id),
  );
}
