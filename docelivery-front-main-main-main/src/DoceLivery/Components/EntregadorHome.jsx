import React, { useState } from 'react';
import { IoCarOutline, IoWalletOutline, IoTimeOutline, IoStatsChartOutline } from 'react-icons/io5';
import Styles from './EntregadorHome.module.css';

const EntregadorHome = ({ statusEntregador, setStatusEntregador }) => {
  const [estatisticas] = useState({
    entregasHoje: 12,
    ganhosDia: 85.50,
    tempoOnline: '4h 32min',
    avaliacaoMedia: 4.8
  });

  const toggleStatus = () => {
    if (statusEntregador === 'offline') {
      setStatusEntregador('disponivel');
    } else if (statusEntregador === 'disponivel') {
      setStatusEntregador('ocupado');
    } else {
      // Finalizando entrega — notifica o cliente via localStorage
      localStorage.setItem('deliveryCompleted', JSON.stringify({
        timestamp: Date.now(),
        storeName: localStorage.getItem('currentStoreName') || 'Confeitaria',
        orderId: localStorage.getItem('currentOrderId') || '#0000'
      }));
      setStatusEntregador('offline');
    }
  };

  const getStatusConfig = () => {
    switch (statusEntregador) {
      case 'disponivel':
        return { color: '#10b981', text: 'Disponível', action: 'Simular Entrega' };
      case 'ocupado':
        return { color: '#f59e0b', text: 'Em Entrega', action: 'Finalizar Entrega' };
      default:
        return { color: '#ef4444', text: 'Offline', action: 'Ficar Online' };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className={Styles.homeContainer}>
      
      {/* Status Control */}
      <div className={Styles.statusCard}>
        <div className={Styles.statusHeader}>
          <div className={Styles.statusInfo}>
            <h2>Status: {statusConfig.text}</h2>
            <p>{statusEntregador === 'offline' ? 'Clique para ficar online' : 'Você está conectado'}</p>
          </div>
          <div className={Styles.statusIndicator} style={{ backgroundColor: statusConfig.color }}>
            <div className={Styles.statusDot}></div>
          </div>
        </div>
        <button 
          className={Styles.statusToggle}
          onClick={toggleStatus}
          style={{ backgroundColor: statusConfig.color }}
        >
          {statusConfig.action}
        </button>
      </div>

      {/* Estatísticas */}
      <div className={Styles.statsGrid}>
        <div className={Styles.statCard}>
          <IoWalletOutline size={24} color="#10b981" />
          <div>
            <h3>R$ {estatisticas.ganhosDia.toFixed(2)}</h3>
            <p>Ganhos Hoje</p>
          </div>
        </div>
        
        <div className={Styles.statCard}>
          <IoCarOutline size={24} color="#3b82f6" />
          <div>
            <h3>{estatisticas.entregasHoje}</h3>
            <p>Entregas Hoje</p>
          </div>
        </div>
        
        <div className={Styles.statCard}>
          <IoTimeOutline size={24} color="#8b5cf6" />
          <div>
            <h3>{estatisticas.tempoOnline}</h3>
            <p>Tempo Online</p>
          </div>
        </div>
        
        <div className={Styles.statCard}>
          <IoStatsChartOutline size={24} color="#f59e0b" />
          <div>
            <h3>{estatisticas.avaliacaoMedia}</h3>
            <p>Avaliação</p>
          </div>
        </div>
      </div>

      {/* Dicas */}
      <div className={Styles.dicasCard}>
        <h4>💡 Dica do Dia</h4>
        <p>Mantenha-se online durante os horários de pico (12h-14h e 19h-21h) para maximizar seus ganhos!</p>
      </div>
    </div>
  );
};

export default EntregadorHome;