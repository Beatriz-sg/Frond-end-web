import ApiService from './api';
import { API_ENDPOINTS } from './constants';

class OrderService {
  async createOrder(dadosPedido) {
    return await ApiService.post(API_ENDPOINTS.ORDERS.CREATE, dadosPedido);
  }

  async getStoreOrders(lojaId) {
    return await ApiService.get(API_ENDPOINTS.ORDERS.STORE(lojaId));
  }

  async updateOrderStatus(orderId, status) {
    return await ApiService.patch(API_ENDPOINTS.ORDERS.STATUS(orderId), status, {
      headers: { "Content-Type": "text/plain" }
    });
  }

  async getOrderById(orderId) {
    return await ApiService.get(API_ENDPOINTS.ORDERS.BY_ID(orderId));
  }

  async getFilaTrabalho(confeiteiroId) {
    return await ApiService.get(API_ENDPOINTS.ORDERS.FILA(confeiteiroId));
  }

  async atualizarStatus(pedidoId, novoStatus) {
    // PATCH /api/pedidos/{id}/status?novoStatus=X — alinhado com PedidoController
    return await ApiService.patch(
      `${API_ENDPOINTS.ORDERS.STATUS(pedidoId)}?novoStatus=${novoStatus.toUpperCase()}`
    );
  }

  async getTodosPedidos(confeiteiroId) {
    return await ApiService.get(API_ENDPOINTS.ORDERS.HISTORICO(confeiteiroId));
  }
}

export default new OrderService()