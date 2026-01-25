export function calculateDiscountedPrice(
  originalPrice: number,
  discountPercent?: number
): number {
  if (!originalPrice || originalPrice <= 0) return 0;
  if (!discountPercent || discountPercent <= 0) return originalPrice;

  return Math.round(originalPrice * (1 - discountPercent / 100));
}
