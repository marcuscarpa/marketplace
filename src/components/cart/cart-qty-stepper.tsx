'use client';

interface CartQtyStepperProps {
  quantity: number;
  max: number;
  disabled?: boolean;
  onChange: (next: number) => void;
  labels: { decrease: string; increase: string };
  className?: string;
}

export function CartQtyStepper({
  quantity,
  max,
  disabled = false,
  onChange,
  labels,
  className = '',
}: CartQtyStepperProps) {
  return (
    <div
      className={`inline-flex items-stretch border border-[#03060733] text-[11px] uppercase tracking-[0.02em] ${className}`}
    >
      <button
        type="button"
        aria-label={labels.decrease}
        disabled={disabled || quantity <= 1}
        onClick={() => onChange(quantity - 1)}
        className="flex w-8 items-center justify-center transition-opacity hover:opacity-60 disabled:opacity-30"
      >
        −
      </button>
      <span className="flex min-w-[2.25rem] items-center justify-center border-x border-[#03060733] px-1 tabular-nums">
        {quantity}
      </span>
      <button
        type="button"
        aria-label={labels.increase}
        disabled={disabled || quantity >= max}
        onClick={() => onChange(quantity + 1)}
        className="flex w-8 items-center justify-center transition-opacity hover:opacity-60 disabled:opacity-30"
      >
        +
      </button>
    </div>
  );
}
