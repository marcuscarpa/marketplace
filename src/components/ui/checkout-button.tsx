'use client';

import { trackStartedCheckout } from '@/lib/analytics';

interface CheckoutButtonProps {
  href: string;
  label: string;
  cart: {
    totalQuantity: number;
    totalAmount: string;
    currency: string;
    itemCount: number;
  };
}

export function CheckoutButton({ href, label, cart }: CheckoutButtonProps) {
  const handleClick = () => {
    trackStartedCheckout(cart);
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className="w-full px-6 py-4 bg-black text-white font-medium rounded-lg text-center block hover:bg-gray-900 transition-colors"
    >
      {label}
    </a>
  );
}
