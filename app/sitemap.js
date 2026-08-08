export default function sitemap() {
  const baseUrl = 'https://imageconvert.org';
  const routes = [
    '',
    '/png-to-webp',
    '/jpg-to-webp',
    '/jpeg-to-webp',
    '/webp-to-png',
    '/webp-to-jpg',
    '/png-to-jpg',
    '/jpg-to-png',
    '/gif-to-webp',
    '/heic-to-jpg',
    '/heic-to-webp',
    '/about',
    '/privacy',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: route === '' ? 1.0 : 0.8,
  }));
}
