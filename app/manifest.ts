import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Coding Junction',
    short_name: 'Coding Junction',
    description: 'The official tech community of University Institute of Technology, Burdwan.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/CodingJunction_withoutText_neonBackground.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/CodingJunction_withoutText_neonBackground.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
