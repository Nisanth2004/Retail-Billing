// src/utils/taxUtils.js

// Calculate subtotal of a single item
export const calculateItemSubtotal = (item) => {
  const price = Number(item.price || 0);
  const qty = Number(item.quantity || 0);
  return price * qty;
};

// Calculate CGST amount per item
export const calculateItemCGST = (item) => {
  const sub = calculateItemSubtotal(item);
  return (sub * Number(item.cgstRate || 0)) / 100;
};

// Calculate SGST amount per item
export const calculateItemSGST = (item) => {
  const sub = calculateItemSubtotal(item);
  return (sub * Number(item.sgstRate || 0)) / 100;
};

// Calculate totals for the entire order
export const calculateOrderTotals = (items) => {
  let subtotal = 0;
  let cgstTotal = 0;
  let sgstTotal = 0;

  items.forEach((item) => {
    subtotal += calculateItemSubtotal(item);
    cgstTotal += calculateItemCGST(item);
    sgstTotal += calculateItemSGST(item);
  });

  const totalGST = cgstTotal + sgstTotal;
  const grandTotal = subtotal + totalGST;

  return {
    subtotal,
    cgstTotal,
    sgstTotal,
    totalGST,
    grandTotal,
  };
};
