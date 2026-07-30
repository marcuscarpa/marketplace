import { LEGAL_PROSE } from '@/lib/help/legal-prose';

const SITE = 'sinesiakarol.com';

export function TermsOfUseContent({ locale }: { locale: string }) {
  if (locale === 'pt') {
    return (
      <article className={LEGAL_PROSE}>
        <p className="text-neutral-500">Última atualização: 27 de maio de 2026</p>
        <p>
          Consulte a versão em inglês em{' '}
          <a href="/en/terms-of-use">Terms of Use</a>.
        </p>
      </article>
    );
  }

  const privacyHref = '/en/privacy';
  const termsHref = '/en/terms-of-use';

  return (
    <article className={LEGAL_PROSE}>
      <p className="text-neutral-500">Last Updated: May 27, 2026</p>

      <section>
        <h2>Read Carefully</h2>
        <p>PLEASE READ THE FOLLOWING TERMS AND CONDITIONS OF USE CAREFULLY BEFORE USING THIS WEBSITE</p>
        <p>
          All users of this site agree that access to and use of this site is subject to the following terms and
          conditions and other applicable law. If you do not agree to these terms and conditions, please do not use this
          site.
        </p>
      </section>

      <section>
        <h2>Disclaimer</h2>
        <p>
          You understand that it is your responsibility to ensure that the privacy policy you create is complete,
          accurate, and meets your companies specific privacy needs. {SITE} is not liable or responsible for any privacy
          policies created using our services, and we give no representations or warranties, express or implied, that the
          privacy policies created using our service are complete, accurate or free from errors or omissions.
        </p>
      </section>

      <section>
        <h2>Return Policy</h2>
        <p>
          We want you to be completely satisfied with your purchase. If you receive a defective or compromised product,
          you may return it within 7 days of purchase. Please bring the original receipt and the product back to our
          Southampton store for review. Once verified, we will provide an exchange or store credit.
        </p>
        <p>
          All returns must be in accordance with New York State cannabis regulations. Opened products that are not
          defective cannot be returned.
        </p>
      </section>

      <section>
        <h2>Disclosure Policy</h2>
        <p>
          By submitting the form and signing up for texts and emails, you consent to receive marketing text messages
          (e.g. promos, reminders) from us at the number provided, including messages sent by autodialer. Consent is
          not a condition of purchase. Msg &amp; data rates may apply. Msg frequency varies. Unsubscribe at any time by
          replying STOP or clicking the unsubscribe link (where available).{' '}
          <a href={privacyHref}>Privacy Policy</a> &amp; <a href={termsHref}>Terms of use</a>.
        </p>
        <p>
          This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.
        </p>
      </section>

      <section>
        <h2>Family Friendly Site</h2>
        <p>
          {SITE} is a family friendly site and we DO NOT intentionally accept or allow the following types of sites into
          our program: Gambling, Adult content (porn, soft porn, sites with adult ad&apos;s), Pharmacy (Cheap drugs,
          Viagra, male/female enhancement, etc.), Hate, Link Farms or Spam Sites. If you sell any of these products and
          we find out, we will cancel your membership without hesitation. We do not need to explain our decision or
          reasons if we reject or cancel any membership.
        </p>
      </section>

      <section>
        <h2>Billing</h2>
        <p>There is a non-refundable fee taken from our third party billing system.</p>
      </section>

      <section>
        <h2>Email Opt-in Policy</h2>
        <p>
          When using our {SITE} Generator service you will be opted-in to receive weekly email updates, tips and
          suggestions we believe will help build, grow and enhance your site. You may unsubscribe at any time by clicking
          on the &quot;Unsubscribe or Modify my subscription&quot; link at the bottom of any email sent.
        </p>
      </section>

      <section>
        <h2>Copyright</h2>
        <p>
          The entire content included in this site, including but not limited to text, graphics or code is copyrighted
          as a collective work under the United States and other international copyright laws, and is the property of{' '}
          {SITE}. The collective work includes works that are licensed to {SITE}.
        </p>
        <p>
          Copyright 2026 SINESIA KAROL. ALL RIGHTS RESERVED. Permission is granted to electronically copy and print hard
          copy portions of this site for the sole purpose of placing an order with {SITE} or purchasing our products.
        </p>
        <p>
          Any other use, including but not limited to the reproduction, distribution, display or transmission of the
          content of this site is strictly prohibited, unless authorized by {SITE}. You further agree not to change or
          delete any proprietary notices from materials downloaded from the site.
        </p>
      </section>

      <section>
        <h2>Trademarks</h2>
        <p>
          All trademarks, service marks and trade names of {SITE} used in the site are trademarks or registered
          trademarks of {SITE}.
        </p>
      </section>

      <section>
        <h2>Warranty Disclaimer</h2>
        <p>
          This site and the materials and products on this site are provided &quot;as is&quot; and without warranties of
          any kind, whether express or implied. To the fullest extent permissible pursuant to applicable law, {SITE}{' '}
          disclaims all warranties, express or implied, including, but not limited to, implied warranties of
          merchantability and fitness for a particular purpose and non-infringement. {SITE} does not represent or warrant
          that the functions contained in the site will be uninterrupted or error-free, that the defects will be
          corrected, or that this site or the server that makes the site available are free of viruses or other harmful
          components. {SITE} does not make any warrantees or representations regarding the use of the materials in this
          site in terms of their correctness, accuracy, adequacy, usefulness, timeliness, reliability or otherwise.
          Some states do not permit limitations or exclusions on warranties, so the above limitations may not apply to
          you.
        </p>
      </section>

      <section>
        <h2>Limitation of Liability</h2>
        <p>
          {SITE} shall not be liable for any special or consequential damages that result from the use of, or the
          inability to use, the services and products offered on this site, or the performance of the services and
          products.
        </p>
      </section>

      <section>
        <h2>Typographical Errors</h2>
        <p>
          In the event that a {SITE} product is mistakenly listed at an incorrect price, {SITE} reserves the right to
          refuse or cancel any orders placed for product listed at the incorrect price. {SITE} reserves the right to
          refuse or cancel any such orders whether or not the order has been confirmed and your credit card charged. If
          your credit card has already been charged for the purchase and your order is cancelled, {SITE} will issue a
          credit to your credit card account in the amount of the incorrect price.
        </p>
      </section>

      <section>
        <h2>Term; Termination</h2>
        <p>
          These terms and conditions are applicable to you upon your accessing the site and/or completing the registration
          or shopping process. These terms and conditions, or any part of them, may be terminated by {SITE} without
          notice at any time, for any reason. The provisions relating to Copyrights, Trademark, Disclaimer, Limitation
          of Liability, Indemnification and Miscellaneous, shall survive any termination.
        </p>
      </section>

      <section>
        <h2>Use of Site</h2>
        <p>
          Harassment in any manner or form on the site, including via e-mail, chat, or by use of obscene or abusive
          language, is strictly forbidden. Impersonation of others, including a {SITE} or other licensed employee, host,
          or representative, as well as other members or visitors on the site is prohibited.
        </p>
        <p>
          You may not upload to, distribute, or otherwise publish through the site any content which is libelous,
          defamatory, obscene, threatening, invasive of privacy or publicity rights, abusive, illegal, or otherwise
          objectionable which may constitute or encourage a criminal offense, violate the rights of any party or which
          may otherwise give rise to liability or violate any law. You may not upload commercial content on the site or
          use the site to solicit others to join or become members of any other commercial online service or other
          organization.
        </p>
      </section>

      <section>
        <h2>Participation Disclaimer</h2>
        <p>
          {SITE} does not and cannot review all communications and materials posted to or created by users accessing the
          site, and are not in any manner responsible for the content of these communications and materials. You
          acknowledge that by providing you with the ability to view and distribute user-generated content on the site,{' '}
          {SITE} is merely acting as a passive conduit for such distribution and is not undertaking any obligation or
          liability relating to any contents or activities on the site.
        </p>
        <p>
          However, {SITE} reserves the right to block or remove communications or materials that it determines to be (a)
          abusive, defamatory, or obscene, (b) fraudulent, deceptive, or misleading, (c) in violation of a copyright,
          trademark or other intellectual property right of another or (d) offensive or otherwise unacceptable to {SITE}{' '}
          in its sole discretion.
        </p>
      </section>

      <section>
        <h2>Indemnification</h2>
        <p>
          You agree to indemnify, defend, and hold harmless {SITE}, its officers, directors, employees, agents, licensors
          and suppliers (collectively the &quot;Service Providers&quot;) from and against all losses, expenses, damages
          and costs, including reasonable attorneys&apos; fees, resulting from any violation of these terms and
          conditions or any activity related to your account (including negligent or wrongful conduct) by you or any
          other person accessing the site using your Internet account.
        </p>
      </section>

      <section>
        <h2>Third-Party Links</h2>
        <p>
          In an attempt to provide increased value to our visitors, {SITE} may link to sites operated by third parties.
          However, even if the third party is affiliated with {SITE}, {SITE} has no control over these linked sites, all
          of which have separate privacy and data collection practices, independent of {SITE}.
        </p>
        <p>
          These linked sites are only for your convenience and therefore you access them at your own risk. Nonetheless,{' '}
          {SITE} seeks to protect the integrity of its website and the links placed upon it and therefore requests any
          feedback on not only its own site, but for sites it links to as well (including if a specific link does not
          work).
        </p>
      </section>

      <section>
        <h2>Contacting Us</h2>
        <p>If there are any questions regarding this terms you may contact us.</p>
        <p>© 2026 SINESIA KAROL. All Rights Reserved.</p>
      </section>
    </article>
  );
}
