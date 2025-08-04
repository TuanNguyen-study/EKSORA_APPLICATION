// File: utils/validators.js

// --- HÀM ĐỊNH DẠNG (FORMATTERS) ---
export const formatName = (name) => {
  if (!name) return '';
  return name
    .trim()
    .replace(/\s+/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  return phone.replace(/\D/g, '').slice(0, 10);
};

export const formatEmail = (email) => {
  if (!email) return '';
  return email.replace(/\s/g, '').toLowerCase();
};


// --- HÀM KIỂM TRA (VALIDATORS) ---
export const validateName = (name, fieldName = 'Tên') => {
  if (!name || name.trim() === '') {
    return `Vui lòng nhập ${fieldName.toLowerCase()}.`;
  }
  const nameRegex = /^[a-zA-Z\sàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđĐ]+$/;
  if (!nameRegex.test(name)) {
    return `${fieldName} chỉ được chứa chữ cái.`;
  }
  return null;
};

export const validatePhoneNumber = (phone) => {
  if (!phone) {
    return 'Vui lòng nhập số điện thoại.';
  }
  const phoneRegex = /^(0[35789])([0-9]{8})$/;
  if (!phoneRegex.test(phone)) {
    return 'Số điện thoại không hợp lệ (10 số, bắt đầu bằng 03, 05, 07, 08, 09).';
  }
  return null;
};

export const validateEmail = (email) => {
  if (!email) {
    return 'Vui lòng nhập địa chỉ email.';
  }

  // Chuyển email về chữ thường để kiểm tra không phân biệt hoa/thường (ví dụ: @GMAIL.COM)
  const lowerCaseEmail = email.toLowerCase();

  // 1. Kiểm tra định dạng email cơ bản
  //    (ví dụ: kiểm tra có ký tự @, có dấu chấm sau @, không có khoảng trắng...)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(lowerCaseEmail)) {
    return 'Địa chỉ email không hợp lệ.';
  }

  // 2. Sau khi đã có định dạng đúng, kiểm tra xem có phải là đuôi @gmail.com không
  if (!lowerCaseEmail.endsWith('@gmail.com')) {
    return 'Email phải có đuôi là @gmail.com.';
  }

  return null; // Hợp lệ nếu vượt qua tất cả các kiểm tra
};

/**
 * Kiểm tra mật khẩu:
 * - Không được để trống.
 * - Ít nhất 8 ký tự.
 * - Chứa ít nhất 1 chữ hoa.
 * - Chứa ít nhất 1 ký tự đặc biệt.
 * @param {string} password - Mật khẩu cần kiểm tra.
 * @returns {string|null} - Thông báo lỗi hoặc null nếu hợp lệ.
 */
export const validatePassword = (password) => {
  if (!password) {
    return 'Mật khẩu không được để trống.';
  }
  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,}$/;
  if (!passwordRegex.test(password)) {
    return 'Mật khẩu phải có ít nhất 6 ký tự, 1 chữ hoa và 1 ký tự đặc biệt.';
  }
  return null;
};

/**
 * Kiểm tra một trường bất kỳ có bị bỏ trống hay không.
 * @param {string} value - Giá trị của trường cần kiểm tra.
 * @param {string} fieldName - Tên của trường (ví dụ: 'Địa chỉ').
 * @returns {string|null} - Thông báo lỗi hoặc null nếu hợp lệ.
 */
export const validateRequired = (value, fieldName) => {
  if (!value || !value.trim()) {
    return `${fieldName} không được để trống.`;
  }
  return null;
};