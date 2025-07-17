// src/utils/tourDetailHelpers.js
// File này chứa các hàm tiện ích, chỉ nhận đầu vào và trả về kết quả.

import { Alert } from 'react-native';

/**
 * Chuẩn bị đối tượng thông tin cơ bản của tour để hiển thị trên UI.
 * @param {object} tour - Đối tượng tour từ API.
 * @param {array} services - Danh sách dịch vụ.
 * @param {array} highlights - Danh sách điểm nổi bật.
 * @param {array} reviews - Danh sách đánh giá.
 * @returns {object} - Đối tượng đã được định dạng.
 */
export const prepareProductInfo = (tour, services, highlights, reviews) => {
  return {
    name: tour.name,
    departurePoint: tour.province,
    rating: {
      stars: tour.rating || 0,
      count: reviews.length,
      detailsText: `${reviews.length} Đánh giá`,
    },
    tags: [
      { label: 'Lịch sử', isSpecial: false },
      { label: 'Văn hóa', isSpecial: false },
      { label: 'Ẩm thực', isSpecial: true },
    ],
    summaryHighlight: {
      items: highlights.map((item) => item.location_name),
    },
    offers: services.map((service) => ({
      label: service.name || service.title,
      icon: 'pricetag-outline',
      bgColor: '#E6F0FA',
      textColor: '#1E88E5',
    })),
  };
};

/**
 * Phân tích chuỗi HTML mô tả tour thành một mảng dữ liệu có cấu trúc để dễ dàng render.
 * @param {string} htmlString - Chuỗi HTML từ API.
 * @returns {array} - Mảng các đối tượng mô tả (text, image-text).
 */
export const parseDescription = (htmlString) => {
  if (!htmlString) return [];

  const result = [];
  let idCounter = 0;
  const seenDescriptions = new Set();

  // Đoạn giới thiệu
  const introMatch = htmlString.match(/<p>(.*?)<\/p>/);
  if (introMatch) {
    result.push({ id: `desc-${idCounter++}`, type: 'text', content: introMatch[1].replace(/<[^>]*>?/gm, '') });
  }

  // Các đoạn hình ảnh và mô tả
  const figureMatches = htmlString.matchAll(/<figure class="image"><img[^>]+src="([^"]+)"[^>]*><\/figure><blockquote><p>(.*?)<\/p><\/blockquote>/g);
  for (const match of figureMatches) {
    const image = match[1];
    const content = match[2].replace(/<[^>]*>?/gm, '');
    if (!seenDescriptions.has(content)) {
      seenDescriptions.add(content);
      result.push({ id: `desc-${idCounter++}`, type: 'image-text', image, content });
    }
  }

  // Đoạn lưu ý
  const noteMatch = htmlString.match(/<h3><strong>Xin lưu ý:.*?(<ul>.*?<\/ul>)/s);
  if (noteMatch) {
    result.push({
      id: `desc-${idCounter++}`,
      type: 'text',
      content: `Xin lưu ý: Sẽ áp dụng phụ phí nếu ngày tham gia của bạn trùng với ngày lễ, thanh toán tại chỗ (Vui lòng kiểm tra chi tiết gói để tham khảo).${noteMatch[1]}`,
    });
  }

  // Nếu không có kết quả nào được phân tích, trả về một đoạn text mặc định
  if (result.length === 0) {
    result.push({ id: `desc-${idCounter++}`, type: 'text', content: htmlString.replace(/<[^>]*>?/gm, '') });
  }

  return result;
};

/**
 * Tính toán giá cuối cùng dựa trên giá gốc và voucher được chọn.
 * @param {number} price - Giá trước khi áp dụng voucher.
 * @param {object} selectedVoucher - Đối tượng voucher đã chọn.
 * @returns {number} - Giá cuối cùng.
 */
export const formatPrice = (price, selectedVoucher) => {
  const value = typeof price === 'number' ? price : parseFloat(price);
  if (isNaN(value)) return 0;

  let finalPrice = value;
  if (selectedVoucher?.voucher_id?.discount) {
    const discount = selectedVoucher.voucher_id.discount;
    const minOrderValue = selectedVoucher.voucher_id.min_order_value || 0;
    if (value >= minOrderValue) {
      finalPrice = value - (value * discount) / 100;
    } else {
      // Thông báo cho người dùng rằng voucher không đủ điều kiện
      Alert.alert('Thông báo', `Đơn hàng phải từ ${minOrderValue.toLocaleString('vi-VN')}đ để áp dụng voucher này.`);
    }
  }
  return Math.max(0, finalPrice);
};