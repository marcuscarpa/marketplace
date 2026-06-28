import type { HelpAccordionItem } from '@/components/help/help-accordion';

const BRAND = 'Sinesia Karol';
const SUPPORT_EMAIL = 'hello@sinesiakarol.com';

function usShippingTable() {
  return (
    <table>
      <thead>
        <tr>
          <th>Shipping option</th>
          <th>Delivery price</th>
          <th>Delivery timeframe</th>
          <th>Sale periods</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Ground</td>
          <td>Free for all orders.</td>
          <td>Ground delivery can be expected within 2–5 business days. Some locations may take an additional 1–2 business days. Saturday delivery may be available for residential addresses.</td>
          <td>During sale periods, deliveries may take an additional 1–2 business days.</td>
        </tr>
        <tr>
          <td>Express</td>
          <td>USD $15 on all orders.</td>
          <td>Express delivery can be expected within 1–3 business days.</td>
          <td>During sale periods, deliveries may take an additional 1–2 business days.</td>
        </tr>
        <tr>
          <td>Next Day</td>
          <td>USD $30 on all orders.</td>
          <td>Order by 12pm EST for next business day delivery by 8pm. Orders placed after 12pm EST will be delivered within 2 business days.</td>
          <td>During sale periods, order by 10am EST for next business day delivery by 8pm EST.</td>
        </tr>
        <tr>
          <td>Collect In Boutique</td>
          <td>Complimentary for all orders.</td>
          <td>Orders will be ready for collection within 1 business day.</td>
          <td>During sale periods, order processing may take an additional 1–2 days.</td>
        </tr>
      </tbody>
    </table>
  );
}

export const SHIPPING_STEPS = [
  { label: 'Create Your Order', icon: 'order' as const },
  { label: 'Process Your Order', icon: 'process' as const },
  { label: 'Ship with Courier', icon: 'courier' as const },
  { label: 'Track The Order', icon: 'track' as const },
  { label: 'Receive New Items', icon: 'receive' as const },
] as const;

export const SHIPPING_SECTIONS: HelpAccordionItem[] = [
  {
    title: 'Order Processing & Delivery Times',
    content: (
      <>
        <p>
          <strong>UNITED STATES</strong>
        </p>
        {usShippingTable()}
        <p>
          <strong>INTERNATIONAL</strong>
          <br />
          Includes only Puerto Rico.
        </p>
        <table>
          <thead>
            <tr>
              <th>Shipping option</th>
              <th>Delivery price</th>
              <th>Delivery timeframe</th>
              <th>Sale periods</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Express</td>
              <td>Free for orders over USD $500. Orders below USD $500 will be charged USD $15.</td>
              <td>Express delivery can be expected within 2–4 business days. Some locations may take an additional 1–2 business days. Signature will be required upon delivery.</td>
              <td>During sale periods, express delivery may take an additional 1–2 days.</td>
            </tr>
          </tbody>
        </table>
        <p>
          All orders are processed within 1 business day and are shipped Monday to Friday. All deliveries must be signed for. Ensure that someone will be available between 9am and 8pm to sign for the delivery.
        </p>
        <p>
          Note: The estimated delivery date provided at checkout is an estimate and may be subject to change. For more detailed delivery information, click on the tracking link in your shipment confirmation email.
        </p>
      </>
    ),
  },
  {
    title: 'Packaging Options',
    content: (
      <>
        <p>The {BRAND} Online Boutique currently offers two different packaging options for you to choose from during checkout:</p>
        <p>
          <strong>SIGNATURE</strong>
          <br />
          You can choose to ship with our signature gift box packaging for your gifting experience. Our signature Gift Boxes are currently non-recyclable. We are working to phase these out and replace them with a new 100% recyclable signature gift box.
        </p>
        <p>
          <strong>ECO</strong>
          <br />
          Alternatively, you can choose to ship with our recyclable and eco-friendly packaging option. Our eco-friendly option uses less packaging to cut down on the materials used. Our eco boxes are made of a percentage of recycled material and are fully recyclable.
        </p>
        <p>
          Note: When placing an order through Apple Pay, you will not have the option to select a packaging option. Your order will be shipped in our eco packaging option. Should you wish to change this you can reach out to our Client Services team at{' '}
          <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
        </p>
      </>
    ),
  },
  {
    title: 'Receiving Your Order — Signature Required',
    content: (
      <>
        <p>
          Once your order has been shipped a unique tracking number will be sent to your nominated email address. You can track your order by clicking on the link provided in the Shipping email.
        </p>
        <p>All deliveries must be signed for. Ensure someone will be available to sign for the delivery between 9 am and 6 pm.</p>
        <p>
          We cannot deliver to PO Box, Parcel Locker or Freight Forwarding addresses. Orders to these addresses may be subject to cancellation.
        </p>
        <p>Orders of multiple items may be shipped in more than one delivery. This will be indicated by receiving multiple shipping confirmation emails.</p>
      </>
    ),
  },
  {
    title: 'Next Day Delivery Service',
    content: (
      <>
        <p>For all US orders, the {BRAND} Online Boutique offers a Next Day delivery option at checkout.</p>
        <p>To use this service, you must place your order prior to 12pm EST, Monday to Friday, for next business day delivery by 8pm.</p>
        <p>If your order is placed after 12pm EST Monday to Friday, it will be delivered within 2 business days.</p>
        <p>All orders placed on Saturday and Sunday will be delivered the following Tuesday.</p>
      </>
    ),
  },
  {
    title: 'Collect In Boutique',
    content: (
      <p>
        We now offer a complimentary Collect In Boutique service. This service provides the option to purchase items online, and collect from a selected {BRAND} boutique, subject to item and boutique eligibility.
      </p>
    ),
  },
  {
    title: 'Delivery Partners',
    content: (
      <>
        <p>
          <strong>Ground</strong> — For delivery within the US, we use FedEx Ground and Home Delivery service.
        </p>
        <p>
          <strong>Express</strong> — For delivery within the US including Puerto Rico, we use FedEx Express Saver service.
        </p>
        <p>
          <strong>International</strong> — For delivery outside of the US excluding Puerto Rico, we use DHL Express International service.
        </p>
        <p>
          <strong>Next Day</strong> — For Next Day delivery, we use FedEx Standard Overnight. This is available for US domestic orders only.
        </p>
      </>
    ),
  },
  {
    title: 'Currency, Duties & Taxes',
    content: (
      <>
        <p>All product prices indicated, and payments made on the US Online Boutique site are in USD currency.</p>
        <p>
          For Puerto Rico, shipments are delivered on Delivery Duty Paid (DDP) basis — all applicable duties, taxes and fees are included in the total amount of the order at checkout.
        </p>
        <p>
          For United States, orders will include local taxes displayed in the total amount of the order at checkout. Sales Tax will be added to the order total at checkout where applicable.
        </p>
        <p>
          Should you wish to return an item, {BRAND} does not refund international prepaid duties and taxes paid at the time of checkout for Delivered Duties Paid (DDP) orders.
        </p>
      </>
    ),
  },
  {
    title: 'Item Availability',
    content: (
      <p>
        Occasionally stock levels are not up-to-date on the Online Boutique. If an item in your order is unavailable, you will be notified by email as soon as possible and offered a suitable replacement or a full refund.
      </p>
    ),
  },
  {
    title: 'Purchase Limit Policy',
    content: (
      <>
        <p>To provide a better experience for all clients, {BRAND} has the following purchase limits per client:</p>
        <ul>
          <li>Boutiques and Online: No more than three (3) units per style and colour regardless of Full Price or Markdown.</li>
          <li>Outlets: No more than three (3) units per style and colour.</li>
        </ul>
        <p>This policy may change at any time. {BRAND} may refuse to complete a sale transaction if purchase limits are not respected.</p>
      </>
    ),
  },
  {
    title: 'Changes To Your Order',
    content: (
      <p>
        While {BRAND} is unable to guarantee amendments or cancellation of an order once it has been placed, we encourage you to contact Client Services as soon as possible at{' '}
        <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>, and our team will always endeavour to assist where feasible.
      </p>
    ),
  },
  {
    title: 'Order Details & Payments',
    content: (
      <>
        <p>Order details are available in order confirmation emails, and in My Account for clients who were logged in when placing their order.</p>
        <p>The following payment methods are accepted on the Online Boutique: credit card (Visa, Mastercard, American Express) and PayPal.</p>
        <p>Transaction processing is based in the US; your bank may apply international transaction fees.</p>
      </>
    ),
  },
  {
    title: 'Security Checks',
    content: (
      <p>
        Our system conducts security checks on transactions at random. If your order is selected, our Client Services team will be in touch to request further information from you, which may include an electronic copy of a government-issued ID. If no response is provided within 48 hours orders may be subject to cancellation.
      </p>
    ),
  },
  {
    title: 'Sale Policy',
    content: (
      <p>
        Sale only includes select styles and excludes all new season collections. Sale prices are as marked and valid online within North America and Caribbean. {BRAND} Online does not offer sale price adjustments or any form of price matching. Sale is subject to change without notice and strictly while stocks last.
      </p>
    ),
  },
];
