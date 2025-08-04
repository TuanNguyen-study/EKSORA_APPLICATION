// File: utils/validators.js

// =================================================================
// HÀM ĐỊNH DẠNG (FORMATTERS)
// Nhiệm vụ: Tự động sửa và chuẩn hóa đầu vào của người dùng.
// =================================================================

/**
 * Chuẩn hóa tên: viết hoa chữ cái đầu mỗi từ, xóa khoảng trắng thừa.
 * Ví dụ: "  nGuyễn  vĂn   a " -> "Nguyễn Văn A"
 */
export const formatName = (name) => {
  if (!name) return '';
  return name
    .trim()
    .replace(/\s+/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Chuẩn hóa số điện thoại: chỉ giữ lại các chữ số và chuẩn hóa định dạng.
 * Ví dụ: "+84-901-234-567" -> "0901234567"
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  // Xóa tất cả ký tự không phải số
  let cleaned = phone.replace(/\D/g, '');
  // Nếu bắt đầu bằng +84, thay bằng 0
  if (cleaned.startsWith('84')) {
    cleaned = '0' + cleaned.slice(2);
  }
  return cleaned;
};

/**
 * Chuẩn hóa email: xóa khoảng trắng và chuyển thành chữ thường.
 */
export const formatEmail = (email) => {
  if (!email) return '';
  return email.replace(/\s/g, '').toLowerCase();
};

// =================================================================
// HÀM KIỂM TRA (VALIDATORS)
// Nhiệm vụ: Kiểm tra dữ liệu có hợp lệ theo quy tắc hay không.
// Trả về `null` nếu hợp lệ, trả về `chuỗi lỗi` nếu không hợp lệ.
// =================================================================

/**
 * Kiểm tra tên có hợp lệ không.
 */
export const validateName = (name, fieldName = 'Tên') => {
  if (!name || name.trim() === '') {
    return `Vui lòng nhập ${fieldName.toLowerCase()}.`;
  }
  // Regex cho phép chữ cái và khoảng trắng, hỗ trợ tiếng Việt
  const nameRegex = /^[a-zA-Z\sàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđĐ]+$/;
  if (!nameRegex.test(name)) {
    return `${fieldName} chỉ được chứa chữ cái.`;
  }
  return null;
};

/**
 * Kiểm tra số điện thoại Việt Nam (10 số).
 */
export const validatePhoneNumber = (phone) => {
  if (!phone) {
    return 'Vui lòng nhập số điện thoại.';
  }
  // Kiểm tra xem chuỗi chỉ chứa số
  if (!/^\d+$/.test(phone)) {
    return 'Số điện thoại chỉ được chứa các chữ số.';
  }
  // Regex cho các đầu số di động 10 số của Việt Nam
  const phoneRegex = /^(0[35789])([0-9]{8})$/;
  if (!phoneRegex.test(phone)) {
    return 'Số điện thoại không hợp lệ (10 số, bắt đầu bằng 03, 05, 07, 08, 09).';
  }
  return null;
};

/**
 * Kiểm tra email hợp lệ (có đuôi @gmail.com).
 */
export const validateEmail = (email) => {
  if (!email) {
    return 'Vui lòng nhập địa chỉ email.';
  }

  const lowerCaseEmail = email.toLowerCase();
  
  // Regex kiểm tra định dạng email cơ bản
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(lowerCaseEmail)) {
    return 'Địa chỉ email không hợp lệ.';
  }

  // Quy tắc riêng: chỉ chấp nhận email của Gmail
  if (!lowerCaseEmail.endsWith('@gmail.com')) {
    return 'Hiện tại hệ thống chỉ hỗ trợ email có đuôi @gmail.com.';
  }

  return null;
};

/**
 * Kiểm tra mật khẩu mạnh.
 */
export const validatePassword = (password) => {
  if (!password) {
    return 'Mật khẩu không được để trống.';
  }
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
  if (!passwordRegex.test(password)) {
    return 'Mật khẩu phải dài ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.';
  }
  return null;
};

/**
 * Kiểm tra mật khẩu xác nhận có khớp với mật khẩu gốc không.
 */
export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) {
    return 'Vui lòng xác nhận mật khẩu.';
  }
  if (password !== confirmPassword) {
    return 'Mật khẩu xác nhận không khớp.';
  }
  return null;
};

/**
 * Kiểm tra ngày sinh hợp lệ (người dùng phải đủ 18 tuổi).
 */
export const validateBirthDate = (dateString) => {
  if (!dateString) {
    return 'Vui lòng chọn ngày sinh.';
  }

  const birthDate = new Date(dateString);
  if (isNaN(birthDate.getTime())) {
    return 'Ngày sinh không hợp lệ.';
  }

  const today = new Date();
  const minAgeDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

  if (birthDate > today) {
    return 'Ngày sinh không thể ở tương lai.';
  }

  if (birthDate > minAgeDate) {
    return 'Bạn phải đủ 18 tuổi để đăng ký.';
  }

  return null;
};

/**
 * Kiểm tra một trường bất kỳ có bị bỏ trống hay không.
 */
export const validateRequired = (value, fieldName) => {
  if (!value || !value.trim()) {
    return `${fieldName} không được để trống.`;
  }
  return null;
};