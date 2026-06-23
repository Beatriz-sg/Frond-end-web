import ApiService from './api';

class StoreService {
  // Obter todas as lojas
  async getStores() {
    return await ApiService.get('/stores');
  }

  // Obter loja por ID
  async getStoreById(id) {
    return await ApiService.get(`/stores/${id}`);
  }

  // Obter lojas em destaque
  async getFeaturedStores() {
    return await ApiService.get('/stores/featured');
  }

  // Obter lojas próximas
  async getNearbyStores(lat, lng, radius = 10) {
    return await ApiService.get(`/stores/nearby?lat=${lat}&lng=${lng}&radius=${radius}`);
  }

  // Buscar lojas
  async searchStores(query) {
    return await ApiService.get(`/stores/search?q=${encodeURIComponent(query)}`);
  }

  // Obter cardápio da loja
  async getStoreMenu(storeId) {
    return await ApiService.get(`/stores/${storeId}/menu`);
  }

  // Atualizar dados da loja (confeiteiro)
  async updateStore(storeId, dadosLoja) {
    return await ApiService.put(`/stores/${storeId}`, dadosLoja);
  }

  // Atualizar horário de funcionamento
  async updateBusinessHours(storeId, horarios) {
    return await ApiService.put(`/stores/${storeId}/hours`, horarios);
  }

  // Obter avaliações da loja
  async getStoreReviews(storeId) {
    return await ApiService.get(`/stores/${storeId}/reviews`);
  }

  // Adicionar avaliação
  async addReview(storeId, avaliacao) {
    return await ApiService.post(`/stores/${storeId}/reviews`, avaliacao);
  }
}

export default new StoreService();