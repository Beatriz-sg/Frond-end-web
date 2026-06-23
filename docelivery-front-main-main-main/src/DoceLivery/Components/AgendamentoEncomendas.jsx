import React, { useState, useEffect, useMemo } from 'react';
import OrderService from '../services/orderService';
import AuthService from '../services/authService';

// Função para formatar a data como DD/MM/YYYY
const formatarData = (dataStr) => {
  if (!dataStr) return '';
  const data = new Date(dataStr);
  return data.toLocaleDateString('pt-BR');
};

const AgendamentoEncomendas = () => {
  // CORRIGIDO: Agora buscamos os dados reais do banco
  const [encomendas, setEncomendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const confeiteiroId = AuthService.getUserId();

  // Estado para armazenar a data selecionada no filtro (padrão: hoje no formato YYYY-MM-DD)
  const [dataSelecionada, setDataSelecionada] = useState(
    new Date().toISOString().split('T')[0]
  );

  // EFECT REAL: Carrega as encomendas agendadas do backend
  useEffect(() => {
    const carregarAgendamentosDoBanco = async () => {
      try {
        setLoading(true);
        // Busca os pedidos do confeiteiro
        const dados = await OrderService.getFilaTrabalho(confeiteiroId);
        // Filtra apenas os que possuem status AGENDADO ou que são agendamentos futuros
        const apenasAgendados = (dados || []).filter(p => p.agendado === true);
        setEncomendas(apenasAgendados);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    carregarAgendamentosDoBanco();
  }, [confeiteiroId]); // Adicionado confeiteiroId para garantir que a agenda carregue o ID correto

  // Filtra as encomendas para exibir apenas as da data selecionada
  const encomendasDoDia = useMemo(() => {
    return encomendas.filter(encomenda => {
      if (!encomenda.dataEntregaAgendada) return false;
      // Extrai apenas a parte YYYY-MM-DD da data do Java
      const dataJava = encomenda.dataEntregaAgendada.split('T')[0];
      return dataJava === dataSelecionada;
    });
  }, [encomendas, dataSelecionada]);

  if (loading) return <p style={{ padding: '20px' }}>Carregando agenda...</p>;

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
      <h2 style={{ textAlign: 'center', color: '#ff69b4' }}>📅 Agenda de Encomendas</h2>
      
      {/* 1. Seleção de Data */}
      <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <label htmlFor="data-filtro" style={{ fontWeight: 'bold', color: '#555' }}>Escolha uma data para ver as entregas:</label>
        <input 
          id="data-filtro"
          type="date" 
          value={dataSelecionada}
          onChange={(e) => setDataSelecionada(e.target.value)}
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '16px' }}
        />
      </div>

      <h3 style={{ borderBottom: '20px', paddingBottom: '5px', color: '#333' }}>
        Encomendas para o dia: {formatarData(dataSelecionada)}
      </h3>

      {/* 2. Lista de Encomendas do Dia Filtrado */}
      {encomendasDoDia.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {encomendasDoDia.map(encomenda => (
            <div 
              key={encomenda.id} 
              style={{ padding: '15px', borderLeft: '5px solid #ff69b4', backgroundColor: '#fff', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
            >
              <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>
                {encomenda.itens?.map(item => `${item.quantidade}x ${item.produto?.nome}`).join(', ') || 'Doce'}
              </p>
              <p style={{ margin: '0 0 5px 0' }}><strong>Cliente:</strong> {encomenda.cliente?.nome || 'Não informado'}</p>
              <p style={{ margin: '0 0 5px 0' }}><strong>Horário:</strong> {encomenda.dataEntregaAgendada ? encomenda.dataEntregaAgendada.split('T')[1]?.slice(0,5) : '--:--'}</p>
              <p style={{ margin: '0' }}><strong>Total:</strong> R$ {encomenda.valorPedido?.toFixed(2)}</p>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ padding: '20px', backgroundColor: '#fff3cd', border: '1px solid #ffeeba', borderRadius: '4px', color: '#856404' }}>
          🎉 Nenhuma encomenda agendada para esta data.
        </p>
      )}
      
      {/* 3. Área para Adicionar Nova Encomenda (Simulado) */}
      <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
        <button 
          onClick={() => alert("Redirecionar para o formulário de pedido manual criado no controller")}
          style={{ width: '100%', padding: '12px', backgroundColor: '#ff69b4', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          ➕ Registrar Pedido Manual (Balcão/WhatsApp)
        </button>
      </div>
    </div>
  );
};

export default AgendamentoEncomendas;