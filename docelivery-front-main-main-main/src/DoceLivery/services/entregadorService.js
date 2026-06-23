import ApiService from './api';

class EntregadorService {
  // Obter todos os entregadores
  async getEntregadores() {
    return await ApiService.get('/entregadores');
  }

  // Obter um entregador específico pelo ID
  async getEntregador(id) {
    return await ApiService.get(`/entregadores/${id}`);
  }

  // Criar um novo entregador
  async createEntregador(dadosEntregador) {
    return await ApiService.post('/entregadores', dadosEntregador);
  }

  // Atualizar um entregador existente
  async updateEntregador(id, dadosEntregador) {
    return await ApiService.put(`/entregadores/${id}`, dadosEntregador);
  }

  // Deletar um entregador
  async deleteEntregador(id) {
    return await ApiService.delete(`/entregadores/${id}`);
  }

  // Obter entregas atribuídas a um entregador
  async getEntregasAtribuidas(id) {
    return await ApiService.get(`/entregadores/${id}/entregas`);
  }
}

export default new EntregadorService();