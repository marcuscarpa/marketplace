'use client';

import Link from 'next/link';
import { useEffect, useId, useMemo, useState } from 'react';

import { isUsdStore } from '@/lib/locale-currency';
import {
  buildShopPaySamplePlans,
  formatUsd,
  isShopPayEligible,
} from '@/lib/shop-pay-plans';
import type { ShopPayInstallmentsPricing } from '@/lib/shopify/types';

interface ProductPriceExtrasProps {
  locale: string;
  price: number;
  shopPay?: ShopPayInstallmentsPricing | null;
}

function ShopPayLogo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-0.5 align-middle ${className}`}>
      <span className="text-sm font-semibold lowercase text-[#5a31f4]">shop</span>
      <span className="rounded-sm bg-[#5a31f4] px-1 py-0.5 text-[10px] font-semibold uppercase leading-none text-white">
        Pay
      </span>
    </span>
  );
}

function ShopPayPlansModal({
  open,
  onClose,
  price,
  shopPay,
}: {
  open: boolean;
  onClose: () => void;
  price: number;
  shopPay?: ShopPayInstallmentsPricing | null;
}) {
  const titleId = useId();
  const plans = useMemo(() => buildShopPaySamplePlans(price, shopPay), [price, shopPay]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 w-full max-w-md rounded-sm bg-white p-6 shadow-xl"
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute right-4 top-4 text-neutral-400 transition-colors hover:text-neutral-700"
        >
          <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path d="M6.758 17.243 12.001 12m5.243-5.243L12 12m0 0L6.758 6.757M12.001 12l5.243 5.243" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="mb-5 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-[#5a31f4] text-xs font-semibold lowercase text-white">
            shop
          </span>
          <h2 id={titleId} className="text-base font-semibold text-neutral-900">
            Get it now, pay later
          </h2>
        </div>

        <p className="mb-4 text-sm text-neutral-600">
          Sample plans for {formatUsd(plans.full)} purchase
        </p>

        <div className="space-y-3 rounded-sm border border-neutral-200 p-4">
          {[plans.biweekly, plans.monthly].map((plan) => (
            <div key={plan.schedule} className="border-b border-neutral-100 pb-3 last:border-0 last:pb-0">
              <p className="text-sm font-medium text-neutral-900">
                {plan.label} {plan.schedule}
              </p>
              <p className="mt-1 text-xs text-neutral-500">
                {plan.interestLabel}: {formatUsd(plan.interestAmount)}
              </p>
              <p className="text-xs text-neutral-500">Total: {formatUsd(plan.total)}</p>
            </div>
          ))}
        </div>

        <a
          href="#product-add-to-cart"
          onClick={onClose}
          className="mt-5 flex h-11 w-full items-center justify-center bg-[#5a31f4] text-sm font-medium text-white transition-colors hover:bg-[#4c28d4]"
        >
          Continue to checkout
        </a>

        <p className="mt-3 text-[11px] leading-relaxed text-neutral-500">
          By continuing, your information will be shared with Affirm. Checking your qualification
          won&apos;t affect your credit.
        </p>

        <p className="mt-4 text-[10px] leading-relaxed text-neutral-400">
          Estimated payment amounts exclude taxes and shipping. Rates range from 0–36% APR. Payment
          options through Shop Pay Installments are subject to eligibility. See{' '}
          <a href="https://www.affirm.com/lenders" className="underline" target="_blank" rel="noreferrer">
            affirm.com/lenders
          </a>{' '}
          for details.
        </p>

        <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-neutral-500">
          <ShopPayLogo />
          <span>Installments in partnership with</span>
          <span className="font-semibold lowercase text-neutral-700">affirm</span>
        </div>
      </div>
    </div>
  );
}

export function ProductPriceExtras({ locale, price, shopPay }: ProductPriceExtrasProps) {
  const [plansOpen, setPlansOpen] = useState(false);
  const isPt = locale === 'pt';
  // Shop Pay Installments: US Shopify store only; BR store uses local checkout payments
  const showShopPay =
    isUsdStore(locale) && isShopPayEligible(price, shopPay) && shopPay?.eligible !== false;
  const plans = useMemo(() => buildShopPaySamplePlans(price, shopPay), [price, shopPay]);

  return (
    <div className="space-y-3 pt-2">
      <p className="text-[13px] text-neutral-600">
        <Link
          href={`/${locale}/shipping#shipping-policy`}
          className="underline underline-offset-2 hover:text-neutral-900"
        >
          {isPt ? 'Envio' : 'Shipping'}
        </Link>{' '}
        {isPt ? 'calculado no checkout.' : 'calculated at checkout.'}
      </p>

      {isPt && (
        <p className="text-[13px] leading-relaxed text-neutral-900">
          <span className="font-medium">Parcelamento no cartão disponível no </span>
          <a
            href="#product-add-to-cart"
            className="font-medium underline underline-offset-2 hover:text-neutral-700"
          >
            checkout
          </a>
          <span className="font-medium"> da boutique Brasil.</span>
        </p>
      )}

      {showShopPay && (
        <p className="text-[13px] leading-relaxed text-neutral-900">
          <span className="font-medium">
            4 interest-free installments, or from {plans.monthly.label}/mo with{' '}
          </span>
          <ShopPayLogo className="mx-1" />
          <button
            type="button"
            onClick={() => setPlansOpen(true)}
            className="underline underline-offset-2 hover:text-neutral-700"
          >
            View sample plans
          </button>
        </p>
      )}

      {showShopPay && (
        <ShopPayPlansModal
          open={plansOpen}
          onClose={() => setPlansOpen(false)}
          price={price}
          shopPay={shopPay}
        />
      )}
    </div>
  );
}
