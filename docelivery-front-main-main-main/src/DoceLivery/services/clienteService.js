import ApiService from './api';

class ClienteService {
  // Ajustado para bater com o @RequestMapping("/api") + "cliente" do Java
  // Nota: Verifique se o seu ApiService já coloca o "/api" automaticamente.
  // Se sim, use apenas '/cliente'. Se não, use '/api/cliente'.
  resource = '/cliente';

  // Obter todos os clientes
  async getClientes() {
    return await ApiService.get(this.resource);
  }

  // Obter um cliente específico pelo ID
  async getCliente(id) {
    return await ApiService.get(`${this.resource}/${id}`);
  }

  // Criar um novo cliente
  async createCliente(dadosCliente) {
    return await ApiService.post(this.resource, dadosCliente);
  }

  // Atualizar um cliente existente (CORRIGIDO)
  async updateCliente(id, dadosCliente) {
    // Aqui mudamos para bater com o @PutMapping("cliente/atualizar/{id}")
    return await ApiService.put(`${this.resource}/atualizar/${id}`, dadosCliente);
  }

  // Deletar um cliente
  async deleteCliente(id) {
    return await ApiService.delete(`${this.resource}/${id}`);
  }
}

export default new ClienteService();