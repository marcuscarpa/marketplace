import { getProductShippingPolicy } from '@/lib/help/product-shipping-policy';

export function ShippingPolicyBlock({ locale }: { locale: string }) {
  const policy = getProductShippingPolicy(locale);

  return (
    <section
      id="shipping-policy"
      className="scroll-mt-32 max-w-3xl font-sans-ui text-sm leading-relaxed text-neutral-700"
    >
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
