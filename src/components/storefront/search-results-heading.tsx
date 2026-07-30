import { m } from '@/lib/i18n';

interface SearchResultsHeadingProps {
  locale: string;
  query: string;
  totalCount: number;
}

export function SearchResultsHeading({ locale, query, totalCount }: SearchResultsHeadingProps) {
  const copy = m(locale).search;

  return (
    <header className="mb-8 lg:mb-10">
      <p className="mb-3 font-sans-ui text-[11px] font-normal uppercase leading-[140%] tracking-[0.08em] text-ink/60">
        {copy.resultsForCount(totalCount)}
      </p>
      <h1 className="font-serif text-[clamp(2rem,3.33vw,3rem)] font-normal leading-none tracking-[-0.04em] text-ink">
        {copy.resultsTitle}{' '}
        <span className="bg-[#EFDEDA] px-1">&ldquo;{query}&rdquo;</span>
      </h1>
    </header>
  );
}
