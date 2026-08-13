import { LEGAL_PROSE } from '@/lib/help/legal-prose';
import { ReturnsContentPt } from '@/lib/help/returns-content.pt';
import { CONTACT_EMAIL, CONTACT_PHONES } from '@/lib/help/contact-info';

export function ReturnsContent({ locale }: { locale: string }) {
  if (locale === 'pt') return <ReturnsContentPt locale={locale} />;

  const termsHref = `/${locale}/terms`;

  return (
    <article className={LEGAL_PROSE}>
      <p>
        All terms defined below shall have the meanings set forth in our <a href={termsHref}>Terms and Conditions</a>.
      </p>

      <section>
        <h2>Order Cancellation</h2>
        <p>
          Orders placed online are processed immediately and cannot be cancelled. You must wait until you receive the
          merchandise before you can return it.
        </p>
      </section>

      <section>
        <h2>Returns</h2>
        <p>
          Once the merchandise is delivered to you, you may return it within 7 days of delivery for a full refund. All
          returns made after 7 days will result in the issuance of store credit. To be eligible for a return, the
          merchandise must be unused, in the same condition as received, and in its original packaging. Our return
          policy does not apply to the following products: discounted or final sale items, gift cards, and used or
          damaged products. These items are not eligible for return, refund, or exchange.
        </p>
      </section>

      <section>
        <h2>Shipping</h2>
        <p>
          To initiate a return, please email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. We require a
          receipt or proof of purchase with the return.
        </p>
        <p>All returned merchandise must be sent to:</p>
        <address className="space-y-1">
          <p>Sinesia Karol</p>
          <p>Attn: RETURNS (Order No. ___)</p>
          <p>135 Spring Street</p>
          <p>Newport, Rhode Island 02840</p>
          <p>
            <a href={CONTACT_PHONES.us.href}>{CONTACT_PHONES.us.display}</a>
          </p>
        </address>
        <p>
          For items manufactured by third parties and resold by us, please do not send the item back to the
          manufacturer.
        </p>
        <p>
          You are responsible for paying all shipping costs for the returned item. Shipping costs are non-refundable. If
          you receive a refund, the cost of return shipping will be deducted from the refund amount. We recommend using
          a trackable shipping service or purchasing shipping insurance for valuable items.
        </p>
        <p>Depending on where you live, the time it takes for an exchanged product to reach you may vary.</p>
      </section>

      <section>
        <h2>Refunds and Exchanges</h2>
        <p>
          Upon receipt of your valid return, we will send you an email notifying you that we have received the returned
          item and informing you of the acceptance or rejection of the return. If your return is accepted, we will
          arrange for one of the following options within a reasonable timeframe: an exchange for the returned item,
          non-transferable store credit, a credit to your card or the original payment method used for the purchase, a
          check, or another solution we determine, in good faith, to be appropriate for the circumstances.
        </p>
        <p>
          We replace items only if they are defective or damaged upon receipt. If you need to exchange items in this
          condition, please email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>, and we will reply with
          instructions on how to proceed.
        </p>
      </section>

      <section>
        <h2>Late or Missing Refunds (if applicable)</h2>
        <p>If you have not yet received your refund, please check your bank account again.</p>
        <p>Next, contact your credit card company; it may take some time before the refund is officially posted.</p>
        <p>Then, contact your bank. There is often a processing time before a refund is actually posted to your account.</p>
        <p>
          If you have completed all these steps and still have not received your refund, please contact us at{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </section>

      <section>
        <h2>General Provisions</h2>
        <p>
          If you fail to comply with any of the conditions above, we reserve the right to refuse the return or exchange,
          or to impose different or additional conditions.
        </p>
      </section>
    </article>
  );
}
