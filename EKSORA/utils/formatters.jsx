// File: utils/formatters.js

/**
 * Định dạng một số thành chuỗi tiền tệ Việt Nam (VND).
 * @param {number} price - Số tiền cần định dạng.
 * @returns {string} Chuỗi đã định dạng, ví dụ: "50.000 ₫".
 */
export const formatPrice = (price) => {
  const value = typeof price === 'number' ? price : 0;
  return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};