import Image from 'next/image';

import { HelpPageLayout } from '@/components/help/help-page-layout';
import { SITE_IMAGES } from '@/lib/catalog/data';
import { m } from '@/lib/i18n';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const h = m(locale).home;
  return {
    title: locale === 'pt' ? `${h.aboutTitle} | Sinesia Karol` : `${h.aboutTitle} | Sinesia Karol`,
    description: h.aboutBody,
  };
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  const h = m(locale).home;
  const nav = m(locale).nav;

  return (
    <HelpPageLayout
      locale={locale}
      currentSlug="about"
      breadcrumbLabel={nav.about}
      title={h.aboutTitle}
      subtitle={h.aboutBody}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-md">
        <Image
          src={SITE_IMAGES.about}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 720px"
          className="object-cover object-center"
        />
      </div>
      <div className="mt-10 space-y-4 font-sans-ui text-base leading-relaxed text-neutral-700">
        <p>{h.aboutBody}</p>
        <p>
          {locale === 'pt'
            ? 'Cada peça reflete a nossa dedicação ao artesanato, materiais selecionados e um design que transcende tendências.'
            : 'Every piece reflects our dedication to craft, considered materials, and design that outlasts trends.'}
        </p>
      </div>
    </HelpPageLayout>
  );
}
