import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Luxury Store - Global Luxury E-Commerce',
    short_name: 'Luxury Store',
    description: 'Curated high-end luxury items authenticated via blockchain.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    orientation: 'portrait-primary',
    categories: ['shopping', 'lifestyle'],
    icons: [
      {
        src: '/Favicon_sinesia.ico',
        sizes: '48x48',
        type: 'image/x-icon',
        purpose: 'any',
      },
    ],
  };
}
