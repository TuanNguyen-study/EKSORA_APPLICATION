// services/chatHandler.ts
import { OrderService } from '../screens/orderService';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface ChatResponse {
  message: string;
  suggestions?: string[];
}

export class ChatHandler {
  private orderService: OrderService;

  constructor() {
    this.orderService = OrderService.getInstance();
  }

  async processMessage(message: string, userId: string): Promise<ChatResponse> {
    const { intent, status } = this.orderService.detectOrderIntent(message);

    if (intent === 'get_orders') {
      return await this.handleOrderQuery(userId, status);
    }

    // Default response for non-order queries
    return {
      message: 'Xin lỗi, tôi không hiểu câu hỏi của bạn. Bạn có thể hỏi về các đơn hàng của mình như:\n- "Xem đơn hàng chưa thanh toán"\n- "Đơn hàng đã thanh toán"\n- "Đơn hàng đã hủy"\n- "Tất cả đơn hàng"',
      suggestions: [
        'Đơn hàng chưa thanh toán',
        'Đơn hàng đã thanh toán',
        'Đơn hàng đã hủy',
        'Tất cả đơn hàng'
      ]
    };
  }

  private async handleOrderQuery(userId: string, status?: string): Promise<ChatResponse> {
    try {
      const response = await this.orderService.getUserOrders(userId, status);
      
      if (!response.success) {
        return {
          message: response.message || 'Đã có lỗi xảy ra khi lấy thông tin đơn hàng.',
          suggestions: ['Thử lại', 'Liên hệ hỗ trợ']
        };
      }

      if (!response.data || response.data.length === 0) {
        const statusText = status ? this.getStatusText(status) : '';
        return {
          message: `Bạn không có đơn hàng nào ${statusText || ''}.`,
          suggestions: status ? ['Xem tất cả đơn hàng'] : ['Đặt tour mới']
        };
      }

      const formattedResponse = this.formatOrderResponse(response.data, status);
      
      return {
        message: formattedResponse,
        suggestions: [
          'Xem chi tiết đơn hàng',
          'Hủy đơn hàng',
          'Đặt tour mới'
        ]
      };
    } catch (error) {
      console.error('Error handling order query:', error);
      return {
        message: 'Xin lỗi, có lỗi xảy ra khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.',
        suggestions: ['Thử lại', 'Liên hệ hỗ trợ']
      };
    }
  }

  private formatOrderResponse(orders: any[], statusFilter?: string): string {
    if (!orders || orders.length === 0) {
      return 'Không tìm thấy đơn hàng nào.';
    }

    let response = '';
    
    if (statusFilter) {
      const statusText = this.getStatusText(statusFilter);
      response = `Dưới đây là các đơn hàng ${statusText} của bạn:\n\n`;
    } else {
      response = 'Dưới đây là tất cả đơn hàng của bạn:\n\n';
    }

    orders.forEach((order, index) => {
      response += `${index + 1}. **${order.tourName || 'Tour không xác định'}**\n`;
      response += `   - Mã đơn: ${order.id}\n`;
      response += `   - Ngày đi: ${new Date(order.startDate).toLocaleDateString('vi-VN')}\n`;
      response += `   - Tổng tiền: ${order.totalAmount?.toLocaleString('vi-VN')}đ\n`;
      response += `   - Trạng thái: ${this.getVietnameseStatus(order.status)}\n\n`;
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

  private getWelcomeMessage(): ChatResponse {
    return {
      message: 'Xin chào! Tôi có thể giúp bạn xem thông tin các đơn hàng của bạn. Bạn muốn xem:\n- Đơn hàng chưa thanh toán\n- Đơn hàng đã thanh toán\n- Đơn hàng đã hủy\n- Hay tất cả đơn hàng?',
      suggestions: [
        'Đơn hàng chưa thanh toán',
        'Đơn hàng đã thanh toán',
        'Đơn hàng đã hủy',
        'Tất cả đơn hàng'
      ]
    };
  }
}
