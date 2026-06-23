import api from './api'; // Importando a instância que você acabou de mandar

class PaymentService {
  async processarPagamento(dadosPagamento) {
    // Curto, direto e batendo na rota certa!
    return api.post('/pagamentos/processar', dadosPagamento);
  }
}

export default new PaymentService();