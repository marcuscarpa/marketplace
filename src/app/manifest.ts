import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Sinesia Karol - Designer Swimwear & Bikini Collection',
    short_name: 'Sinesia Karol',
    description:
      'Shop designer swimwear and bikini collections at Sinesia Karol — luxury Brazilian bikinis, resortwear, one pieces and beach dresses.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    orientation: 'portrait-primary',
    categories: ['shopping', 'fashion', 'lifestyle'],
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
