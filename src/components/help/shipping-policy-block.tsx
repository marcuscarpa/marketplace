import { getProductShippingPolicy } from '@/lib/help/product-shipping-policy';

export function ShippingPolicyBlock({ locale }: { locale: string }) {
  const policy = getProductShippingPolicy(locale);

  return (
    <section
      id="shipping-policy"
      className="scroll-mt-32 border-b border-neutral-200 pb-12 mb-12 max-w-3xl mx-auto font-sans-ui text-sm leading-relaxed text-neutral-700"
    >
      <h2 className="mb-6 text-center font-serif text-xl uppercase tracking-[0.08em] text-neutral-900">
        {policy.title}
      </h2>
      <div className="space-y-4">
        {policy.paragraphs.map((paragraph) => (
          <p key={paragraph}>
            {paragraph.includes(policy.email) ? (
              <>
                {paragraph.split(policy.email)[0]}
                <a
                  href={`mailto:${policy.email}`}
                  className="underline underline-offset-2 hover:text-neutral-900"
                >
                  {policy.email}
                </a>
                {paragraph.split(policy.email)[1]}
              </>
            ) : (
              paragraph
            )}
          </p>
        ))}
      </div>
    </section>
  );
}
