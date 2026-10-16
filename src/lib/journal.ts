import { getCollection } from 'astro:content';

// Every public surface uses this same filter, including individual article routes.
export async function publishedPosts() {
  return (
    await getCollection(
      'journal',
      ({ data }) => !data.draft && data.date <= new Date(),
    )
  ).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}
