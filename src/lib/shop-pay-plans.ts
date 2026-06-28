import type { ShopPayInstallmentsPricing } from '@/lib/shopify/types';

export interface ShopPayPlan {
  label: string;
  schedule: string;
  interestLabel: string;
  interestAmount: number;
  total: number;
}

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

/** ponytail: monthly plan uses Shopify-style 15% APR sample when API omits monthly terms */
export function buildShopPaySamplePlans(
  price: number,
  shopPay?: ShopPayInstallmentsPricing | null
): { full: number; biweekly: ShopPayPlan; monthly: ShopPayPlan } {
  const full = shopPay?.fullPrice?.amount ? Number(shopPay.fullPrice.amount) : price;
  const count = shopPay?.installmentsCount?.count ?? 4;
  const biweeklyAmount = shopPay?.pricePerTerm?.amount
    ? Number(shopPay.pricePerTerm.amount)
    : full / count;

  const monthlyTotal = full * 1.08323;
  const monthlyAmount = monthlyTotal / 12;
  const monthlyInterest = monthlyTotal - full;

  return {
    full,
    biweekly: {
      label: formatUsd(biweeklyAmount),
      schedule: `every 2 weeks for 8 weeks`,
      interestLabel: 'Interest (0% APR)',
      interestAmount: 0,
      total: full,
    },
    monthly: {
      label: formatUsd(monthlyAmount),
      schedule: 'every month for 12 months',
      interestLabel: 'Interest (15% APR)',
      interestAmount: monthlyInterest,
      total: monthlyTotal,
    },
  };
}

export function isShopPayEligible(
  price: number,
  shopPay?: ShopPayInstallmentsPricing | null
): boolean {
  if (shopPay?.eligible === false) return false;
  return price >= 50 && price <= 3000;
}
