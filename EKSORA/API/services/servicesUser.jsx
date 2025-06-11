import AxiosInstance from "./AxiosInstance";

// API hiển thị user
export const getUser = async () => {
  try {
    const response = await AxiosInstance.get(`/api/profile`);

    if (response && response.data) {
      return response.data;
    } else {
      throw new Error("Dữ liệu trả về không hợp lệ");
    }
  } catch (error) {
    console.error("Lỗi khi hiển thị User:", error.message || error);
    throw error; 
  }
};
