import React, { useState, useEffect } from 'react';
import { IoNotifications, IoMenu, IoCarOutline, IoStatsChart, IoWallet, IoPersonOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import Styles from './HeaderEntregador.module.css';

const HeaderEntregador = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [userData, setUserData] = useState({ nome: 'Entregador', veiculo: 'Moto' });
  const [statusEntrega, setStatusEntrega] = useState('disponivel'); // disponivel, ocupado, offline
  const [ganhosDia, setGanhosDia] = useState(85.50);
  const [entregasHoje, setEntregasHoje] = useState(12);
  const navigate = useNavigate();

  useEffect(() => {
    const nomeEntregador = localStorage.getItem('nomeEntregador') || 'João Silva';
    const veiculo = localStorage.getItem('veiculo') || 'Moto Honda CG 160';
    setUserData({ nome: nomeEntregador, veiculo });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userType');
    localStorage.removeItem('nomeEntregador');
    navigate('/docelivery/entregador/login');
  };

  const getStatusColor = () => {
    switch (statusEntrega) {
      case 'disponivel': return '#10b981';
      case 'ocupado': return '#f59e0b';
      case 'offline': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusText = () => {
    switch (statusEntrega) {
      case 'disponivel': return 'Disponível';
      case 'ocupado': return 'Em Entrega';
      case 'offline': return 'Offline';
      default: return 'Indefinido';
    }
  };

  return (
    <header className={Styles.header}>
      <div className={Styles.headerLeft}>
        <div className={Styles.logo}>
          <IoCarOutline size={28} color="#8a2be2" />
          <span>Docelivery</span>
        </div>
        <div>
          <h1>Painel do Entregador</h1>
          <p>Gerencie suas entregas e ganhos</p>
        </div>
      </div>
      
      <div className={Styles.headerRight}>
        <div className={Styles.statsQuick}>
          <div className={Styles.statItem}>
            <IoWallet size={16} />
            <span>R$ {ganhosDia.toFixed(2)}</span>
            <small>Hoje</small>
          </div>
          <div className={Styles.statItem}>
            <IoStatsChart size={16} />
            <span>{entregasHoje}</span>
            <small>Entregas</small>
          </div>
        </div>

        <div className={Styles.statusEntrega}>
          <span className={Styles.statusLabel}>Status:</span>
          <div 
            className={Styles.statusIndicator}
            style={{ backgroundColor: getStatusColor() }}
            onClick={() => {
              const nextStatus = statusEntrega === 'disponivel' ? 'offline' : 'disponivel';
              setStatusEntrega(nextStatus);
            }}
          >
            <div className={Styles.statusDot}></div>
            <span>{getStatusText()}</span>
          </div>
        </div>
        
        <button 
          className={Styles.notificationBtn}
          onClick={() => setShowNotifications(!showNotifications)}
        >
          <IoNotifications size={20} />
          <span className={Styles.notificationBadge}>5</span>
        </button>
        
        <div className={Styles.userProfile}>
          <div className={Styles.userInfo}>
            <div className={Styles.userName}>{userData.nome}</div>
            <div className={Styles.userVehicle}>{userData.veiculo}</div>
          </div>
          <div className={Styles.avatar}>
            <IoPersonOutline size={20} />
          </div>
        </div>
      </div>

      {showNotifications && (
        <div className={Styles.notificationsDropdown}>
          <h3>Notificações</h3>
          <div className={Styles.notificationItem}>
            <span>Nova entrega disponível</span>
            <small>2 min atrás</small>
          </div>
          <div className={Styles.notificationItem}>
            <span>Entrega concluída com sucesso</span>
            <small>15 min atrás</small>
          </div>
          <div className={Styles.notificationItem}>
            <span>Pagamento processado</span>
            <small>1 hora atrás</small>
          </div>
          <div className={Styles.notificationItem}>
            <span>Meta diária atingida!</span>
            <small>2 horas atrás</small>
          </div>
          <div className={Styles.notificationItem}>
            <span>Avaliação 5 estrelas recebida</span>
            <small>3 horas atrás</small>
          </div>
        </div>
      )}
    </header>
  );
};

export default HeaderEntregador;