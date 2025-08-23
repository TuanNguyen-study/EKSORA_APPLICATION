// services/orderService.ts
import { fetchWithRetry, getBaseURL } from './networkService';

export interface Order {
  id: string;
  tourName: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  status: 'pending' | 'paid' | 'cancelled';
  paymentStatus: string;
  bookingDate: string;
  participants: number;
}

export interface OrderResponse {
  success: boolean;
  data?: Order[];
  message?: string;
}

export class OrderService {
  private static instance: OrderService;
  
  public static getInstance(): OrderService {
    if (!OrderService.instance) {
      OrderService.instance = new OrderService();
    }
    return OrderService.instance;
  }

  async getUserOrders(userId: string, status?: string): Promise<OrderResponse> {
    try {
      const baseURL = getBaseURL();
      let url = `${baseURL}/api/bookings/user/${userId}`;
      
      if (status) {
        url += `?status=${status}`;
      }

      const response = await fetchWithRetry(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return {
        success: true,
        data: response.data || response,
      };
    } catch (error) {
      console.error('Lỗi khi lấy danh sách đơn hàng:', error);
      return {
        success: false,
        message: 'Không thể lấy thông tin đơn hàng. Vui lòng thử lại sau.',
      };
    }
  }

  formatOrderForDisplay(orders: Order[], statusFilter?: string): string {
    if (!orders || orders.length === 0) {
      if (statusFilter) {
        const statusText = this.getStatusText(statusFilter);
        return `Bạn không có đơn hàng nào ${statusText}.`;
      }
      return 'Bạn chưa có đơn hàng nào.';
    }

    let response = '';
    
    if (statusFilter) {
      const statusText = this.getStatusText(statusFilter);
      response = `Dưới đây là các đơn hàng ${statusText} của bạn:\n\n`;
    } else {
      response = 'Dưới đây là tất cả đơn hàng của bạn:\n\n';
    }

    orders.forEach((order, index) => {
      response += `${index + 1}. **${order.tourName}**\n`;
      response += `   - Mã đơn: ${order.id}\n`;
      response += `   - Ngày đi: ${new Date(order.startDate).toLocaleDateString('vi-VN')}\n`;
      response += `   - Số người: ${order.participants}\n`;
      response += `   - Tổng tiền: ${order.totalAmount?.toLocaleString('vi-VN')}đ\n`;
      response += `   - Trạng thái: ${this.getVietnameseStatus(order.status)}\n`;
      response += `   - Ngày đặt: ${new Date(order.bookingDate).toLocaleDateString('vi-VN')}\n\n`;
    });

    return response;
  }

  private getStatusText(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'chưa thanh toán';
      case 'paid':
        return 'đã thanh toán';
      case 'cancelled':
        return 'đã hủy';
      default:
        return status;
    }
  }

  private getVietnameseStatus(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'Chờ thanh toán';
      case 'paid':
        return 'Đã thanh toán';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  }

  detectOrderIntent(message: string): { intent: string; status?: string } {
    const lowerMessage = message.toLowerCase();
    
    // Check for order-related intents
    if (lowerMessage.includes('đơn hàng') || lowerMessage.includes('booking') || lowerMessage.includes('chuyến đi')) {
      if (lowerMessage.includes('chưa thanh toán') || lowerMessage.includes('pending')) {
        return { intent: 'get_orders', status: 'pending' };
      }
      if (lowerMessage.includes('đã thanh toán') || lowerMessage.includes('paid')) {
        return { intent: 'get_orders', status: 'paid' };
      }
      if (lowerMessage.includes('đã hủy') || lowerMessage.includes('cancelled') || lowerMessage.includes('hủy')) {
        return { intent: 'get_orders', status: 'cancelled' };
      }
      return { intent: 'get_orders' };
    }
    
    return { intent: 'unknown' };
  }
}
