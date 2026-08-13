import { getProductShippingPolicy } from '@/lib/help/product-shipping-policy';

export function ShippingPolicyBlock({ locale }: { locale: string }) {
  const policy = getProductShippingPolicy(locale);

  return (
    <section
      id="shipping-policy"
      className="scroll-mt-32 max-w-3xl font-sans-ui text-sm leading-relaxed text-neutral-700"
    >
      <div className="space-y-4">
        {policy.blocks.map((block, index) => {
          if (block.type === 'address') {
            return (
              <p key={index} className="m-0 whitespace-pre-line">
                {block.content}
              </p>
            );
          }

          return (
            <p key={index}>
              {block.content.includes(policy.email) ? (
                <>
                  {block.content.split(policy.email)[0]}
                  <a
                    href={`mailto:${policy.email}`}
                    className="underline underline-offset-2 hover:text-neutral-900"
                  >
                    {policy.email}
                  </a>
                  {block.content.split(policy.email)[1]}
                </>
              ) : (
                block.content
              )}
            </p>
          );
        })}
      </div>
    </section>
  );
}
