import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ProductDetailsLuxury } from '@/components/luxury/product-details-luxury';
import { ProductViewTracker } from '@/components/ui/product-view-tracker';
import { isVideo360Enabled } from '@/lib/feature-flags';
import { getProductByHandle } from '@/lib/shopify/loader';
import { getPageRecommendations } from '@/lib/shopify/product-recommendations';

interface ProductPageProps {
  params: Promise<{ locale: string; handle: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { handle, locale } = await params;
  const product = await getProductByHandle(handle, locale);
  if (!product) return { title: 'Product Not Found' };
  return {
    title: `${product.title} | Luxury Store`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.title,
      description: product.description.slice(0, 160),
      images: product.images.nodes[0] ? [{ url: product.images.nodes[0].url }] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { locale, handle } = await params;
  const product = await getProductByHandle(handle, locale);

  if (!product) {
    notFound();
  }

  const flagContext = { locale, region: locale === 'pt' ? 'BR' : 'US' };
  const [showVideo360, recommendations] = await Promise.all([
    isVideo360Enabled(flagContext),
    getPageRecommendations(product, locale, 4),
  ]);

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <a href={`/${locale}`} className="hover:text-gray-900 transition-colors">
            Home
          </a>
          <span>/</span>
          <a href={`/${locale}/collections/all`} className="hover:text-gray-900 transition-colors">
            Products
          </a>
          <span>/</span>
          <span className="text-gray-900">{product.title}</span>
        </nav>

        <ProductDetailsLuxury
          product={product}
          locale={locale}
          recommendations={recommendations}
        />

        <ProductViewTracker
          product={{
            id: product.id,
            title: product.title,
            handle: product.handle,
            price: product.priceRange.minVariantPrice.amount,
            currency: product.priceRange.minVariantPrice.currencyCode,
            image: product.images.nodes[0]?.url,
          }}
        />

        {showVideo360 && product.luxury.video360Url && (
          <div className="mt-12 p-6 bg-gray-50 rounded-xl">
            <h3 className="text-lg font-medium text-gray-900 mb-4">360° View</h3>
            <div className="aspect-video rounded-lg overflow-hidden bg-black">
              <video
                src={product.luxury.video360Url}
                controls
                loop
                muted
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        )}

        {product.luxury.certificateHash && (
          <div className="mt-12 p-6 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900">Authentication Certificate</h3>
            </div>
            <p className="text-sm text-gray-600 font-mono">
              Certificate Hash: {product.luxury.certificateHash}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              This item has been verified and authenticated by our expert team.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
