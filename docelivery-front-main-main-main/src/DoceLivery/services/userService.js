import ApiService from './api';

class UserService {
  // Obter perfil do usuário
  async getUserProfile() {
    return await ApiService.get('/user/profile');
  }

  // Atualizar perfil do usuário
  async updateUserProfile(dadosUsuario) {
    return await ApiService.put('/user/profile', dadosUsuario);
  }

  // Obter endereços do cliente
  async getUserAddresses() {
    return await ApiService.get('/user/addresses');
  }

  // Adicionar endereço
  async addAddress(endereco) {
    return await ApiService.post('/user/addresses', endereco);
  }

  // Atualizar endereço
  async updateAddress(addressId, endereco) {
    return await ApiService.put(`/user/addresses/${addressId}`, endereco);
  }

  // Remover endereço
  async deleteAddress(addressId) {
    return await ApiService.delete(`/user/addresses/${addressId}`);
  }

  // Obter favoritos
  async getFavorites() {
    return await ApiService.get('/user/favorites');
  }

  // Adicionar aos favoritos
  async addToFavorites(itemId, tipo) {
    return await ApiService.post('/user/favorites', { itemId, tipo });
  }

  // Remover dos favoritos
  async removeFromFavorites(itemId, tipo) {
    return await ApiService.delete(`/user/favorites/${itemId}?tipo=${tipo}`);
  }

  // Obter todos os usuários (admin)
  async getAllUsers(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return await ApiService.get(`/admin/users?${params}`);
  }

  // Suspender/ativar usuário (admin)
  async toggleUserStatus(userId, status) {
    return await ApiService.put(`/admin/users/${userId}/status`, { status });
  }
}

export default new UserService();