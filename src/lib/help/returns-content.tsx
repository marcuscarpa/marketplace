import { LEGAL_PROSE } from '@/lib/help/legal-prose';
import { ReturnsContentPt } from '@/lib/help/returns-content.pt';

const EMAIL = 'business@sinesiakarol.com';
const PHONE = '401-847-1087';

export function ReturnsContent({ locale }: { locale: string }) {
  if (locale === 'pt') return <ReturnsContentPt locale={locale} />;

  const termsHref = `/${locale}/terms`;

  return (
    <article className={LEGAL_PROSE}>
      <p>
        All defined terms used below shall have the meanings set forth in our{' '}
        <a href={termsHref}>Terms and Conditions</a>.
      </p>

      <section>
        <h2>Order Cancellations</h2>
        <p>
          Orders that you submit online are processed immediately and may not be cancelled. You need to wait until you
          receive the merchandise in order to return it.
        </p>
      </section>

      <section>
        <h2>Returns</h2>
        <p>
          Once an item of merchandise is delivered to you, you can return that item within 7 days of delivery for a full
          refund. All returns made after 7 days will be issued a store credit. To be eligible for a return, your
          merchandise must be unused and in the same condition that you received it and must be in the original
          packaging. Our return policy does not apply to the following goods: discounted or final sale items, gift
          cards, and worn or damaged goods. These items are not eligible for return, refund or exchange.
        </p>
      </section>

      <section>
        <h2>Shipping</h2>
        <p>
          To initiate a return, please email us at <a href={`mailto:${EMAIL}`}>{EMAIL}</a>. We require a receipt or
          proof of purchase to accompany your return.
        </p>
        <p>All returned merchandise should be sent to us at:</p>
        <address className="space-y-1">
          <p>Sinesia Karol</p>
          <p>Attn: RETURNS (Order #_____)</p>
          <p>135 Spring Street</p>
          <p>Newport, Rhode Island 02840</p>
          <p>
            <a href={`tel:${PHONE.replace(/-/g, '')}`}>{PHONE}</a>
          </p>
        </address>
        <p>
          For items that are manufactured by another party and resold by Us, please do not send such item back to the
          manufacturer.
        </p>
        <p>
          You are responsible for paying for all shipping costs for your returned item. Shipping costs are
          non-refundable. If you receive a refund, the cost of any returned shipping will be deducted from your refund.
          You should consider using a trackable shipping service or purchasing shipping insurance for items of value.
        </p>
        <p>Depending on where you live, the time it may take for your exchanged product to reach you, may vary.</p>
      </section>

      <section>
        <h2>Refunds and Exchanges</h2>
        <p>
          After We have received your valid return, We will send you an email to notify you that We have received your
          returned item and notify you of the acceptance or rejection of your return.
        </p>
        <p>
          If your return is accepted by Us, We will provide one of the following within a reasonable time: an exchange of
          merchandise for the item returned, a non-transferable merchandise credit, a credit to the payment card or
          original method of payment used to pay for the item, a check, or another remedy that we determine in good
          faith is appropriate in the circumstances.
        </p>
        <p>
          We only replace items if they are defective or damaged upon arrival. If you need to make an exchange for such
          items, please send an email to <a href={`mailto:${EMAIL}`}>{EMAIL}</a> and we will reply with instructions on
          how to proceed.
        </p>
      </section>

      <section>
        <h2>Late or Missing Refunds (if applicable)</h2>
        <p>If you haven&apos;t received a refund yet, first check your bank account again.</p>
        <p>Then contact your credit card company, it may take some time before your refund is officially posted.</p>
        <p>Next contact your bank. There is often some processing time before a refund is posted.</p>
        <p>
          If you&apos;ve done all of this and you still have not received your refund yet, please contact us at{' '}
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
        </p>
      </section>

      <section>
        <h2>General</h2>
        <p>
          If you do not comply with any of the above conditions, We reserve the right to refuse the return or exchange,
          or to impose different or additional conditions.
        </p>
      </section>
    </article>
  );
}
