import { PRODUCT_SHIPPING_POLICY } from '@/lib/help/product-shipping-policy';

export function ShippingPolicyBlock() {
  return (
    <section
      id="shipping-policy"
      className="scroll-mt-32 border-b border-neutral-200 pb-12 mb-12 max-w-3xl mx-auto font-sans-ui text-sm leading-relaxed text-neutral-700"
    >
      <h2 className="mb-6 text-center font-serif text-xl uppercase tracking-[0.08em] text-neutral-900">
        {PRODUCT_SHIPPING_POLICY.title}
      </h2>
      <div className="space-y-4">
        {PRODUCT_SHIPPING_POLICY.paragraphs.map((paragraph) => (
          <p key={paragraph}>
            {paragraph.includes(PRODUCT_SHIPPING_POLICY.email) ? (
              <>
                {paragraph.split(PRODUCT_SHIPPING_POLICY.email)[0]}
                <a
                  href={`mailto:${PRODUCT_SHIPPING_POLICY.email}`}
                  className="underline underline-offset-2 hover:text-neutral-900"
                >
                  {PRODUCT_SHIPPING_POLICY.email}
                </a>
                {paragraph.split(PRODUCT_SHIPPING_POLICY.email)[1]}
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
