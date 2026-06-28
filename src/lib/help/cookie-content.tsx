import { LEGAL_PROSE } from '@/lib/help/legal-prose';
import { CookieContentPt } from '@/lib/help/cookie-content.pt';

export function CookieContent({ locale }: { locale: string }) {
  if (locale === 'pt') return <CookieContentPt locale={locale} />;

  const privacyHref = `/${locale}/privacy`;
  const contactHref = `/${locale}/contact`;

  return (
    <article className={LEGAL_PROSE}>
      <p className="text-neutral-500">Last Updated: May 27, 2026</p>

      <section>
        <h2>Our Use of Cookies, Web Beacons and Similar Technologies</h2>
        <p>
          When you visit or interact with our sites, services, applications, tools or messaging, we or our authorized
          service providers may use cookies, web beacons, and other similar technologies to make your experience better,
          faster and safer, for advertising purposes and to allow us to continuously improve our sites, services,
          applications and tools.
        </p>
        <p>
          We hope the information below provides you with clear and comprehensive information about the technologies we
          use and the purposes for which we use them, but if you have any additional questions, or require any
          additional information, please review our{' '}
          <a href={privacyHref}>Privacy Policy</a>, Privacy Center, or{' '}
          <a href={contactHref}>contact us</a>.
        </p>
      </section>

      <section>
        <h2>Your Consent</h2>
        <p>
          By continuing to use and navigate our sites, services, applications, tools or messaging, you are agreeing to
          our use of cookies, web beacons and similar technologies as described herein and in our{' '}
          <a href={privacyHref}>Privacy Policy</a>. If you do not wish to accept these technologies in connection with
          your visit to or use of our sites, services, applications, tools or messaging, you may visit our Manage
          Settings page and see additional options below available to you to manage, control or delete our, or our
          service provider&apos;s, use of these technologies.
        </p>
      </section>

      <section>
        <h2>What Are Cookies, Web Beacons and Similar Technologies</h2>
        <p>
          These technologies are essentially small data files placed on your computer, tablet, mobile phone or other
          device (&quot;collectively, a &quot;device&quot;) that allows us to record information when you visit or
          interact with our websites, service, applications, messaging, and other tools. Though often these technologies
          are generically referred to as &quot;Cookies,&quot; each functions slightly differently, and is better
          explained below:
        </p>
        <p>
          <strong>Cookies:</strong> These are small text files (typically made up of letters and numbers) placed in the
          memory of your browser or device when you visit a website or view a message. Cookies allow a website to
          recognize a particular device or browser.
        </p>
        <p>There are several types of cookies:</p>
        <ul>
          <li>
            <strong>Session cookies</strong> expire at the end of your browser session and allow us to link your actions
            during that particular browser session.
          </li>
          <li>
            <strong>Persistent cookies</strong> are stored on your device in between browser sessions, allowing us to
            remember your preferences or actions across multiple sites.
          </li>
          <li>
            <strong>First-party cookies</strong> are those set by a website that is being visited by the user at the
            time in order to preserve your settings (e.g., while on our site).
          </li>
          <li>
            <strong>Third-party cookies</strong> are placed in your browser by a website, or domain, that is not the
            website or domain that you are currently visiting. If a user visits a website and another entity sets a
            cookie through that website this would be a third-party cookie.
          </li>
        </ul>
        <p>
          When you enter a website using cookies, you may be asked to fill out a form providing personal information;
          like your name, e-mail address, and interests. This information is packaged into a cookie and sent to your
          browser (Chrome, Firefox, etc.), which then stores the information for later use. The next time you go to the
          same website, your browser will send the cookie to the server.
        </p>
        <p>The message is sent back to the server each time the browser requests a page from the server.</p>
        <p>
          <strong>Web beacons:</strong> small files (also called &quot;pixels&quot;, &quot;image tags&quot;, or
          &quot;script tags&quot;) that may be loaded on our sites, applications, and tools, that may work in concert
          with cookies to identify our users and provide anonymized data on their behavior.
        </p>
        <p>
          <strong>Similar technologies:</strong> Technologies that store information in your browser or device utilizing
          local shared objects or local storage, such as flash cookies, HTML 5 cookies, and other web application
          software methods.
        </p>
        <p>
          These technologies can operate across all of your browsers, and in some instances may not be fully managed by
          your browser and may require management directly through your installed applications or device. We do not use
          these technologies for storing information to target advertising to you on or off our sites.
        </p>
      </section>

      <section id="cookie-types">
        <h2>What Types of Cookies, Web Beacons and Similar Technologies Do We Use and Why</h2>
        <p>
          Our cookies, web beacons and similar technologies serve various purposes, but are generally either necessary
          or essential to the functioning of our sites, services, applications, tools or messaging, help us improve the
          performance of or provide you extra functionality of the same, or help us to serve relevant and targeted
          advertisements. More specifically:
        </p>
        <h3>Strictly Necessary or Essential</h3>
        <p>
          &apos;Strictly necessary&apos; or &quot;essential&quot; cookies, web beacons and similar technologies let you
          move around the website and use essential features like secure areas and shopping baskets. Without these
          technologies, services you have asked for cannot be provided.
        </p>
        <p>
          Please note that these technologies do not gather any information about you that could be used for marketing or
          remembering where you&apos;ve been on the internet. Accepting these technologies is a condition of using our
          sites, services, applications, tools or messaging, so if you prevent these from loading we can&apos;t
          guarantee your use or how the security therein will perform during your visit.
        </p>
        <h3>Performance</h3>
        <p>
          &apos;Performance&apos; cookies, web beacons and similar technologies collect information about how you use
          our website e.g. which pages you visit, and if you experience any errors. These cookies do not collect any
          information that could identify you and is only used to help us improve how our website works, understand what
          interests our users and measure how effective our content is by providing anonymous statistics and data
          regarding how our website is used. Accepting these technologies is a condition of using our sites, services,
          applications, tools or messaging, so if you prevent these from loading we can&apos;t guarantee your use or how
          the security therein will perform during your visit.
        </p>
        <h3>Functionality</h3>
        <p>
          These cookies, web beacons or similar technologies are used to provide services or to remember settings to
          improve your visit.
        </p>
        <h3 id="advertising">Advertising</h3>
        <p>
          First or third-party cookies and web beacons may be placed by our sites, applications, or tools, in order to
          deliver content, including product related advertisements, relevant to your specific interests on our sites or
          third-party sites. These technologies allow us to understand how useful our advertisements are, and improve
          the relevancy of the content delivered to our users.
        </p>
        <p>
          We also utilize 3rd party service providers to assist us in delivering on the same functions, which means that
          our authorized service providers may also place cookies, web beacons and similar technologies on your device via
          our services (first and third party cookies). They may also collect information that helps them identify your
          device, such as IP-address, or other unique or device identifiers.
        </p>
      </section>

      <section>
        <h2>How to Manage, Control and Delete Cookies, Web Beacons and Similar Technologies</h2>
        <p>
          You may manage certain cookies, web beacons and similar technologies we place by visiting our Manage Settings
          control panel. You may also visit our &quot;Advertising Preferences&quot; link exists in the footer of our
          webpages.
        </p>
        <p>
          You may block cookies by activating the setting on your browser that allows you to refuse the setting of all
          or some cookies. However, if you use your browser settings to block all cookies (including essential cookies)
          it may limit your use of certain features or functions on our website or service. Unless you have adjusted
          your browser setting so that it will refuse cookies, our system will issue cookies as soon as you visit our
          site. Please note, as further described in our Privacy Policy, we currently do not alter our practices when we
          receive a &quot;Do Not Track&quot; signal from a visitor&apos;s browser.
        </p>
        <p>
          Internet browsers allow you to change your cookie settings. These settings are usually found in the
          &apos;options&apos; or &apos;preferences&apos; menu of your internet browser. In order to understand these
          settings, the following links may be helpful. Otherwise you should use the &apos;Help&apos; option in your
          internet browser for more details.
        </p>
        <ul>
          <li>
            <a
              href="https://support.microsoft.com/en-us/windows/manage-cookies-in-microsoft-edge-view-allow-block-delete-and-use-168dab11-0753-043d-7c16-ede5947fc64d"
              target="_blank"
              rel="noopener noreferrer"
            >
              Cookie settings in Internet Explorer
            </a>
          </li>
          <li>
            <a
              href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop"
              target="_blank"
              rel="noopener noreferrer"
            >
              Cookie settings in Firefox
            </a>
          </li>
          <li>
            <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">
              Cookie settings in Chrome
            </a>
          </li>
          <li>
            <a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer">
              Cookie settings in Safari
            </a>
          </li>
        </ul>
        <p>
          If you wish to withdraw your consent at any time, you will need to delete your cookies using your internet
          browser settings.
        </p>
      </section>

      <section>
        <h2>More Information About Cookies</h2>
        <p>
          Useful information about cookies, including information about deleting or blocking cookies, can be found at:{' '}
          <a href="http://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer">
            http://www.allaboutcookies.org
          </a>
        </p>
        <p>
          A guide to behavioral advertising and online privacy has been produced by the internet advertising industry
          which can be found at:{' '}
          <a href="http://www.youronlinechoices.eu" target="_blank" rel="noopener noreferrer">
            http://www.youronlinechoices.eu
          </a>
        </p>
        <p>
          Information on the ICC (UK) UK cookie guide can be found on the ICC website section:{' '}
          <a
            href="http://www.international-chamber.co.uk/our-expertise/digitaleconomy"
            target="_blank"
            rel="noopener noreferrer"
          >
            http://www.international-chamber.co.uk/our-expertise/digitaleconomy
          </a>
        </p>
      </section>

      <section>
        <h2>Contacting Us</h2>
        <p>
          If you require further information or have any comments or questions about this website or any aspect of our
          services please contact our Marketing Communications Team.
        </p>
      </section>
    </article>
  );
}
