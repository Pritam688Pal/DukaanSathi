export const toMinor = (amount: number) => Math.round((amount + Number.EPSILON) * 100);
export const stockStatus = (quantity: number, reorderLevel: number): 'out' | 'low' | 'in' => quantity <= 0 ? 'out' : quantity <= reorderLevel ? 'low' : 'in';
export const expiryStatus = (expiry: Date | undefined, today = new Date(), withinDays = 30): 'none' | 'expired' | 'soon' | 'ok' => {
  if (!expiry) return 'none';
  const end = new Date(today); end.setDate(end.getDate() + withinDays);
  if (expiry < today) return 'expired';
  if (expiry <= end) return 'soon';
  return 'ok';
};
export const saleProfit = (revenue: number, cost: number, discount = 0) => revenue - cost - discount;
