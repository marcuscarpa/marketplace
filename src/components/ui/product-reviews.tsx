interface ProductReviewsProps {
  averageRating?: number;
  totalReviews?: number;
}

export function ProductReviews({ averageRating, totalReviews }: ProductReviewsProps) {
  if (averageRating === undefined || totalReviews === undefined) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 text-sm text-neutral-500">
      <span className="text-yellow-500">{'★'.repeat(Math.round(averageRating))}</span>
      <span>({totalReviews} reviews)</span>
    </div>
  );
}
