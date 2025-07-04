// src/data/mockData.js

export const cartData = [
  {
    id: '1',
    image: 'https://i.ibb.co/6PSpR1y/bus-image.png',
    title: 'Vé Xe Buýt 2 Tầng Ngắm Cảnh Ở Thành Phố Hồ Chí Minh từ City Sightseeing',
    description: 'Tuyến Tour Thành Phố - 1 Vòng Ban Ngày - Không',
    date: '5/7/2025',
    quantity: '1 x Người lớn',
    discountPercent: 5,
    price: 130863,
    originalPrice: 137750, // (price / (1 - discountPercent/100))
  },
  // Bạn có thể thêm các sản phẩm khác vào đây
  // {
  //   id: '2',
  //   image: '...',
  //   title: 'Một sản phẩm khác',
  //   ...
  // }
];

export const suggestedData = [
  {
    id: 's1',
    image: 'https://i.ibb.co/hK2J2pD/bitexco.jpg',
    title: 'Vé Saigon Skydeck Tại Bitexco Financial To...',
    rating: 4.7,
    reviews: 5612,
    price: 240000,
  },
  {
    id: 's2',
    image: 'https://i.ibb.co/Y7pQzMv/landmark81.jpg',
    title: 'Vé Đài Quan Sát Landmark 81 SkyView',
    rating: 4.6,
    reviews: 1143,
    price: 450000,
  },
];