import React, { useState } from 'react';
import { IoCheckmarkCircleOutline, IoTimeOutline, IoCloseCircleOutline } from 'react-icons/io5';
import Styles from './EntregadorEntregas.module.css';

const EntregadorEntregas = () => {
  const [filtroStatus, setFiltroStatus] = useState('todas');

  const entregas = [
    { id: '#2847', cliente: 'Maria Silva', endereco: 'Rua das Flores, 123', produto: 'Bolo de Chocolate', valor: 45.90, status: 'concluida', data: '14/01 - 14:30', avaliacao: 5 },
    { id: '#2846', cliente: 'João Santos', endereco: 'Av. Principal, 456', produto: '12 Brigadeiros', valor: 24.00, status: 'concluida', data: '14/01 - 13:45', avaliacao: 4 },
    { id: '#2845', cliente: 'Ana Costa', endereco: 'Rua do Centro, 789', produto: 'Torta de Morango', valor: 67.50, status: 'cancelada', data: '14/01 - 12:20', avaliacao: null }
  ];

  const entregasFiltradas = entregas.filter(entrega => 
    filtroStatus === 'todas' || entrega.status === filtroStatus
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case 'concluida': return <IoCheckmarkCircleOutline size={20} color="#10b981" />;
      case 'cancelada': return <IoCloseCircleOutline size={20} color="#ef4444" />;
      default: return <IoTimeOutline size={20} color="#f59e0b" />;
    }
  };

  const renderAvaliacoes = (avaliacao) => {
    if (!avaliacao) return <span className={Styles.semAvaliacao}>-</span>;
    return '⭐'.repeat(avaliacao);
  };

  return (
    <div className={Styles.entregasContainer}>
      
      <div className={Styles.entregasHeader}>
        <h2>🚚 Histórico de Entregas</h2>
        <div className={Styles.filtros}>
          <button 
            className={filtroStatus === 'todas' ? Styles.active : ''}
            onClick={() => setFiltroStatus('todas')}
          >
            Todas ({entregas.length})
          </button>
          <button 
            className={filtroStatus === 'concluida' ? Styles.active : ''}
            onClick={() => setFiltroStatus('concluida')}
          >
            Concluídas ({entregas.filter(e => e.status === 'concluida').length})
          </button>
        </div>
      </div>

      <div className={Styles.entregasList}>
        {entregasFiltradas.map(entrega => (
          <div key={entrega.id} className={Styles.entregaCard}>
            <div className={Styles.entregaHeader}>
              <div className={Styles.entregaId}>
                <strong>{entrega.id}</strong>
                <span className={Styles.entregaData}>{entrega.data}</span>
              </div>
              <div className={Styles.entregaStatus}>
                {getStatusIcon(entrega.status)}
                <span>{entrega.status === 'concluida' ? 'Concluída' : 'Cancelada'}</span>
              </div>
            </div>
            
            <div className={Styles.entregaContent}>
              <div className={Styles.clienteInfo}>
                <h4>{entrega.cliente}</h4>
                <p>{entrega.endereco}</p>
              </div>
              
              <div className={Styles.pedidoInfo}>
                <p>{entrega.produto}</p>
                <div className={Styles.entregaMeta}>
                  <span className={Styles.valor}>R$ {entrega.valor.toFixed(2)}</span>
                  <span className={Styles.avaliacao}>
                    {renderAvaliacoes(entrega.avaliacao)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EntregadorEntregas;