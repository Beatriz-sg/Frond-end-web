import ApiService from './api';

class HistoricoService {
  // Obter histórico completo de um pedido
  async getHistoricoPedido(pedidoId) {
    return await ApiService.get(`/pedidos/${pedidoId}/historico`);
  }

  // Adicionar nova entrada no histórico
  async adicionarHistorico(pedidoId, dadosHistorico) {
    return await ApiService.post(`/pedidos/${pedidoId}/historico`, dadosHistorico);
  }

  // Atualizar status do pedido e adicionar ao histórico
  async atualizarStatusPedido(pedidoId, novoStatus, observacoes = '') {
    return await ApiService.put(`/pedidos/${pedidoId}/status`, {
      status: novoStatus,
      observacoes,
      timestamp: new Date().toISOString()
    });
  }

  // Obter timeline de entrega
  async getTimelineEntrega(pedidoId) {
    return await ApiService.get(`/pedidos/${pedidoId}/timeline`);
  }

  // Marcar pedido como entregue
  async marcarComoEntregue(pedidoId, dadosEntrega) {
    return await ApiService.post(`/pedidos/${pedidoId}/entrega`, {
      ...dadosEntrega,
      dataEntrega: new Date().toISOString()
    });
  }

  // Gerar histórico simulado (para desenvolvimento)
  gerarHistoricoSimulado(pedido) {
    const baseHistorico = [
      {
        id: 1,
        titulo: 'Pedido Recebido',
        descricao: 'Pedido foi recebido e está aguardando confirmação',
        data: this.formatarData(new Date(Date.now() - 4 * 60 * 60 * 1000)), // 4 horas atrás
        status: 'concluido',
        tipo: 'recebido',
        detalhes: {
          cliente: pedido.cliente,
          produto: pedido.produto,
          valor: pedido.valor,
          canal: 'App Mobile'
        }
      },
      {
        id: 2,
        titulo: 'Pedido Confirmado',
        descricao: 'Pedido foi confirmado e adicionado à fila de produção',
        data: this.formatarData(new Date(Date.now() - 3.5 * 60 * 60 * 1000)), // 3.5 horas atrás
        status: 'concluido',
        tipo: 'confirmado',
        detalhes: {
          tempoEstimado: '2-3 horas',
          posicaoFila: 1
        }
      }
    ];

    const statusAtual = pedido.status.toLowerCase();
    
    if (statusAtual === 'em preparo' || statusAtual === 'concluído') {
      baseHistorico.push({
        id: 3,
        titulo: 'Iniciado Preparo',
        descricao: 'Confeiteiro iniciou a preparação do produto',
        data: this.formatarData(new Date(Date.now() - 3 * 60 * 60 * 1000)), // 3 horas atrás
        status: 'concluido',
        tipo: 'preparo_iniciado',
        detalhes: {
          confeiteiro: 'Maria Silva',
          ingredientes: 'Separados e verificados',
          tempoEstimado: '2 horas'
        }
      });
    }

    if (statusAtual === 'concluído') {
      baseHistorico.push(
        {
          id: 4,
          titulo: 'Preparo Concluído',
          descricao: 'Produto finalizado e pronto para entrega',
          data: this.formatarData(new Date(Date.now() - 1 * 60 * 60 * 1000)), // 1 hora atrás
          status: 'concluido',
          tipo: 'preparo_concluido',
          detalhes: {
            qualidade: 'Aprovado',
            embalagem: 'Realizada',
            temperatura: 'Adequada'
          }
        },
        {
          id: 5,
          titulo: 'Saiu para Entrega',
          descricao: 'Produto saiu para entrega ao cliente',
          data: this.formatarData(new Date(Date.now() - 30 * 60 * 1000)), // 30 min atrás
          status: 'concluido',
          tipo: 'saiu_entrega',
          detalhes: {
            entregador: 'João Silva',
            veiculo: 'Moto - ABC-1234',
            previsao: '30-45 minutos',
            rota: 'Otimizada'
          }
        },
        {
          id: 6,
          titulo: 'Entrega Concluída',
          descricao: 'Produto entregue com sucesso ao cliente',
          data: this.formatarData(new Date(Date.now() - 5 * 60 * 1000)), // 5 min atrás
          status: 'concluido',
          tipo: 'entregue',
          detalhes: {
            recebedor: pedido.cliente,
            avaliacao: '5 estrelas',
            observacoes: 'Cliente muito satisfeito'
          }
        }
      );
    } else if (statusAtual === 'em preparo') {
      baseHistorico.push({
        id: 4,
        titulo: 'Em Preparo',
        descricao: 'Produto está sendo preparado no momento',
        data: this.formatarData(new Date(Date.now() - 15 * 60 * 1000)), // 15 min atrás
        status: 'atual',
        tipo: 'em_preparo',
        detalhes: {
          progresso: '75%',
          etapaAtual: 'Decoração final',
          tempoRestante: '30 minutos'
        }
      });
    } else if (statusAtual === 'pendente') {
      baseHistorico.push({
        id: 3,
        titulo: 'Aguardando Preparo',
        descricao: 'Pedido está na fila aguardando início do preparo',
        data: this.formatarData(new Date(Date.now() - 10 * 60 * 1000)), // 10 min atrás
        status: 'atual',
        tipo: 'aguardando',
        detalhes: {
          posicaoFila: '2º lugar',
          tempoEstimado: '45 minutos',
          ingredientesDisponiveis: 'Sim'
        }
      });
    }

    return baseHistorico;
  }

  formatarData(data) {
    return data.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Obter estatísticas de tempo médio por etapa
  async getEstatisticasTempo() {
    return await ApiService.get('/pedidos/estatisticas/tempo');
  }

  // Obter pedidos com atraso
  async getPedidosComAtraso() {
    return await ApiService.get('/pedidos/atrasados');
  }
}

export default new HistoricoService();