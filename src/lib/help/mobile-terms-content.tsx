import { LEGAL_PROSE_SIMPLE } from '@/lib/help/legal-prose';
import { MobileTermsContentPt } from '@/lib/help/mobile-terms-content.pt';
import { CONTACT_PHONES } from '@/lib/help/contact-info';

const BRAND = 'SINESIA KAROL';
const SUPPORT_EMAIL = 'admin@sinesiakarol.com';
const SENDING_NUMBER = CONTACT_PHONES.us.display;

export function MobileTermsContent({ locale }: { locale: string }) {
  if (locale === 'pt') return <MobileTermsContentPt locale={locale} />;

  const privacyHref = `/${locale}/privacy`;

  return (
    <article className={LEGAL_PROSE_SIMPLE}>
      <p className="text-neutral-500">Last updated: May 27, 2026</p>

      <p>
        The {BRAND} mobile message service (the &quot;Service&quot;) is operated by {BRAND} (&quot;{BRAND}&quot;,
        &quot;we&quot;, or &quot;us&quot;). Your use of the Service constitutes your agreement to these terms and
        conditions (&quot;Mobile Terms&quot;). We may modify or cancel the Service or any of its features without
        notice. To the extent permitted by applicable law, we may also modify these Mobile Terms at any time and your
        continued use of the Service following the effective date of any such changes shall constitute your acceptance
        of such changes.
      </p>

      <p>
        By consenting to {BRAND}&apos;s SMS/text messaging service, you agree to receive recurring SMS/text messages
        from and on behalf of {BRAND} through your wireless provider to the mobile number you provided, even if your
        mobile number is registered on any state or federal Do Not Call list. Text messages may be sent using an
        automatic telephone dialing system or other technology. Service-related messages may include updates, alerts,
        and information (e.g., order updates, account alerts, etc.). Promotional messages may include promotions,
        specials, and other marketing offers (e.g., cart reminders).
      </p>

      <p>
        You understand that you do not have to sign up for this program in order to make any purchases, and your consent
        is not a condition of any purchase with {BRAND}. Your participation in this program is completely voluntary.
      </p>

      <p>
        We do not charge for the Service, but you are responsible for all charges and fees associated with text
        messaging imposed by your wireless provider. Message frequency varies. Message and data rates may apply. Check
        your mobile plan and contact your wireless provider for details. You are solely responsible for all charges
        related to SMS/text messages, including charges from your wireless provider.
      </p>

      <p>
        You may opt-out of the Service at any time. Text the single keyword command STOP to {SENDING_NUMBER} or click
        the unsubscribe link (where available) in any text message to cancel. You&apos;ll receive a one-time opt-out
        confirmation text message. No further messages will be sent to your mobile device, unless initiated by you. If
        you have subscribed to other {BRAND} mobile message programs and wish to cancel, except where applicable law
        requires otherwise, you will need to opt out separately from those programs by following the instructions
        provided in their respective mobile terms.
      </p>

      <p>
        For Service support or assistance, text HELP to {SENDING_NUMBER} or email{' '}
        <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
      </p>

      <p>
        We may change any short code or telephone number we use to operate the Service at any time and will notify you
        of these changes. You acknowledge that any messages, including any STOP or HELP requests, you send to a short
        code or telephone number we have changed may not be received and we will not be responsible for honoring
        requests made in such messages.
      </p>

      <p>
        The wireless carriers supported by the Service are not liable for delayed or undelivered messages. You agree to
        provide us with a valid mobile number. If you get a new mobile number, you will need to sign up for the program
        with your new number.
      </p>

      <p>
        To the extent permitted by applicable law, you agree that we will not be liable for failed, delayed, or
        misdirected delivery of any information sent through the Service, any errors in such information, and/or any
        action you may or may not take in reliance on the information or Service.
      </p>

      <p>
        We respect your right to privacy. To see how we collect and use your personal information, please see our{' '}
        <a href={privacyHref}>Privacy Notice</a>.
      </p>
    </article>
  );
}
