export function parseNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function formatCurrency(amount?: number | null) {
  if (amount === null || amount === undefined) return '-';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatDate(value: Date | string) {
  const date = typeof value === 'string' ? new Date(value) : value;
  return date.toISOString().split('T')[0];
}

export function sumLineItems(items: {qtyPerBox: number; boxCount: number}[]) {
  return items.reduce(
    (acc, item) => {
      acc.totalBoxes += item.boxCount;
      acc.totalQuantity += item.qtyPerBox * item.boxCount;
      return acc;
    },
    {totalBoxes: 0, totalQuantity: 0}
  );
}
