import { getCollection } from 'astro:content';

export async function getProjects() {
  const all = await getCollection('work');
  return all.sort((a, b) => a.data.order - b.data.order || b.data.year - a.data.year);
}

export async function getFeatured(limit = 5) {
  return (await getProjects()).filter((p) => p.data.featured).slice(0, limit);
}
