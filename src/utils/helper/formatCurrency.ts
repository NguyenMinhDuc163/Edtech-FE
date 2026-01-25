export const formatCurrency = (
  amount: number,
  currency: string = "VND"
): string => {
  if (currency === "VND") {
    return amount.toLocaleString("vi-VN") + " đ";
  }

  return `${currency} ${amount.toFixed(2)}`;
};
