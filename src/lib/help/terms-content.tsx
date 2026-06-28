const COMPANY = 'Sinesia Karol, LLC.';
const EMAIL = 'business@sinesiakarol.com';

const prose =
  'space-y-6 font-sans-ui text-sm leading-relaxed text-neutral-700 [&_a]:underline [&_a]:underline-offset-2 [&_h2]:text-[11px] [&_h2]:font-medium [&_h2]:uppercase [&_h2]:tracking-[0.14em] [&_h2]:text-neutral-900 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5 [&_section]:space-y-3';

export function TermsContent({ locale }: { locale: string }) {
  void locale;

  return (
    <article className={prose}>
      <p className="text-neutral-500">Last Updated: May 27, 2026</p>

      <section>
        <h2>Terms of Use {COMPANY}</h2>
        <p>
          {COMPANY} provides services to you subject to the terms and conditions included in this Terms of Use and other
          customer services pages which we have prepared to help make your shopping experience with {COMPANY} as enjoyable
          and problem-free as possible. Please read them carefully. By visiting or using this web site, you acknowledge
          that you have read and understood, and agree to be bound by, Terms of Use. You also agree to comply with all
          applicable laws and regulations, including United States Copyright and Trademark laws. If you do not agree to
          these terms, please do not use {COMPANY} web site.
        </p>
      </section>

      <section>
        <h2>Privacy</h2>
        <p>
          The information you give to us stays at {COMPANY} We maintain strict security over the information you provide
          to us and use it only in the following ways:
        </p>
        <ol>
          <li>To send you information you request and to update you on the status of that request.</li>
          <li>To monitor the traffic on our site to help us design the best, most efficient site we can.</li>
          <li>
            To occasionally send you free promotional materials. Other than credit card information which we do not
            process, we maintain your information in-house at {COMPANY} If you want to remove your information from our
            database, email us at <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          </li>
          <li>
            International customers – we will only email you once you have opted in at checkout or applied for our
            newsletter on the site. The web server logs your IP address in standard server logs to help diagnose problems
            with our server and to administer our website. By using our website and giving us your information, you agree
            that we may collect and use this information. Any changes to our privacy policy will be posted on our site.
          </li>
        </ol>
      </section>

      <section>
        <h2>Ownership and Copyright</h2>
        <p>
          {COMPANY} web site is owned and operated by {COMPANY} Unless otherwise noted, all design and content included
          on this web site, including text, graphics, logos, icons, images, artwork, audio and video clips and software
          is the property of {COMPANY} (or is used under license to {COMPANY} and is protected by United States and
          international copyright laws.
        </p>
      </section>

      <section>
        <h2>Eligibility to Use and/or Register on the Site</h2>
        <p>
          The Site, Service and Community are not intended for Users under the age of 13, and only persons of the age
          of 18 or older may register on the Site. {COMPANY} does not knowingly collect personally identifiable
          information from Users under the age of 13. Such Users are expressly prohibited from using the Service, from
          submitting their personally identifiable information to us, and from registering as a Member.
        </p>
        <p>
          Users agree not to impersonate other persons, not to provide false information and not to rely on the identity
          or identification of other Users displayed on the Site because {COMPANY} does not employ any means to verify
          the true identity of registered users.
        </p>
      </section>

      <section>
        <h2>Electronic Communications</h2>
        <p>
          You agree that all agreements, notices, disclosures, and other communications that we provide to you
          electronically satisfy any legal requirement that such communications be in writing.
        </p>
      </section>
    </article>
  );
}
