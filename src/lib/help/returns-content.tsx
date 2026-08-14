import { LEGAL_PROSE } from '@/lib/help/legal-prose';
import { ReturnsContentPt } from '@/lib/help/returns-content.pt';
import { CONTACT_EMAIL, CONTACT_PHONES } from '@/lib/help/contact-info';

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
        <h2>ORDER CANCELLATIONS</h2>
        <p>
          Orders that you submit online are processed immediately and may not be cancelled. You need to wait until you
          receive the merchandise to return it.
        </p>
      </section>

      <section>
        <h2>RETURNS</h2>
        <p>Once an item of merchandise is delivered to you:</p>
        <ul>
          <li>Returns made within 7 days of delivery are eligible for a full refund.</li>
          <li>Returns made between 8 and 30 days will receive store credit.</li>
          <li>To qualify, items must be unused, undamaged, and in their original packaging.</li>
          <li>Final sale items, gift cards, and worn or damaged goods cannot be returned, refunded, or exchanged.</li>
        </ul>
      </section>

      <section>
        <h2>SHIPPING</h2>
        <p>
          To initiate a return, please email us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. We require
          a receipt or proof of purchase to accompany your return.
        </p>
        <p>All returned merchandise should be sent to us at:</p>
        <address className="space-y-1">
          <p>Sinesia Karol</p>
          <p>Attn: RETURNS (Order #_____)</p>
          <p>135 Spring Street</p>
          <p>Newport, Rhode Island 02840</p>
          <p>
            <a href={CONTACT_PHONES.us.href}>{CONTACT_PHONES.us.display}</a>
          </p>
        </address>
        <p>
          For items that are manufactured by another party and resold by Us, please do not send such items back to the
          manufacturer.
        </p>
        <p>
          You are responsible for paying for all shipping costs for your returned item. Shipping costs are
          non-refundable. If you receive a refund, the cost of any returned shipping will be deducted from your refund.
          You should consider using a trackable shipping service or purchasing shipping insurance for items of value.
        </p>
        <p>Depending on where you live, the time it may take for your exchanged product to reach you may vary.</p>
      </section>

      <section>
        <h2>REFUNDS AND EXCHANGES</h2>
        <p>
          After We have received your valid return, we will send you an email to notify you that We have received your
          returned item and notify you of the acceptance or rejection of your return.
        </p>
        <p>
          If your return is accepted by Us, we will provide one of the following within a reasonable time: an exchange
          of merchandise for the item returned, a non-transferable merchandise credit, a credit to the payment card or
          original method of payment used to pay for the item, or another remedy that we determine in good faith is
          appropriate in the circumstances.
        </p>
        <p>
          We only replace items if they are defective or damaged upon arrival. If you need to make an exchange for such
          items, please send an email to <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and we will reply with
          instructions on how to proceed.
        </p>
      </section>

      <section>
        <h2>LATE OR MISSING REFUNDS (if applicable)</h2>
        <p>If you haven’t received a refund yet, first check your bank account again.</p>
        <p>Then contact your credit card company, it may take some time before your refund is officially posted.</p>
        <p>Next contact your bank. There is often some processing time before a refund is posted.</p>
        <p>
          If you’ve done all of this and you still have not received your refund yet, please contact us at{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </section>

      <section>
        <h2>GENERAL</h2>
        <p>
          If you do not comply with any of the above conditions, we reserve the right to refuse the return or exchange,
          or to impose different or additional conditions.
        </p>
      </section>
    </article>
  );
}
