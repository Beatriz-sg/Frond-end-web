import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoHome, IoCarOutline, IoWalletOutline, IoStatsChartOutline, IoSettingsOutline, IoLogOut, IoNotifications, IoMenu, IoHelpCircleOutline } from 'react-icons/io5';
import Styles from './PaginaEntregador.module.css';
import EntregadorHome from '../Components/EntregadorHome';
import EntregadorGanhos from '../Components/EntregadorGanhos';
import EntregadorEntregas from '../Components/EntregadorEntregas';
import EntregadorSuporte from '../Components/EntregadorSuporte';
import EntregadorPerfil from '../Components/EntregadorPerfil';


const PaginaEntregador = () => {
  const [secaoAtiva, setSecaoAtiva] = useState('home');
  const [showNotifications, setShowNotifications] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userData, setUserData] = useState({ nome: '', veiculo: '' });
  const [statusEntregador, setStatusEntregador] = useState('offline');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userType');
    localStorage.removeItem('nomeEntregador');
    navigate('/');
  };

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    const userType = localStorage.getItem('userType');
    
    if (!token || userType !== 'entregador') {
      navigate('/docelivery/entregador/login-entregador');
    } else {
      const nomeEntregador = localStorage.getItem('nomeEntregador') || 'João Silva';
      const veiculo = localStorage.getItem('veiculo') || 'Moto Honda CG 160';
      setUserData({ nome: nomeEntregador, veiculo });
    }
  }, [navigate]);

  const menuItems = [
    { 
      id: 'home', 
      nome: 'Dashboard', 
      icone: <IoHome size={20} />,
      titulo: 'Painel Principal',
      descricao: 'Visão geral das suas entregas e ganhos'
    },
    { 
      id: 'entregas', 
      nome: 'Entregas', 
      icone: <IoCarOutline size={20} />,
      titulo: 'Minhas Entregas',
      descricao: 'Histórico e status das entregas realizadas'
    },
    { 
      id: 'ganhos', 
      nome: 'Ganhos', 
      icone: <IoWalletOutline size={20} />,
      titulo: 'Controle Financeiro',
      descricao: 'Acompanhe seus ganhos e pagamentos'
    },
    { 
      id: 'relatorios', 
      nome: 'Relatórios', 
      icone: <IoStatsChartOutline size={20} />,
      titulo: 'Relatórios e Estatísticas',
      descricao: 'Performance e métricas detalhadas'
    },
    { 
      id: 'suporte', 
      nome: 'Suporte', 
      icone: <IoHelpCircleOutline size={20} />,
      titulo: 'Central de Ajuda',
      descricao: 'Tire suas dúvidas e obtenha suporte'
    },
    { 
      id: 'perfil', 
      nome: 'Perfil', 
      icone: <IoSettingsOutline size={20} />,
      titulo: 'Configurações do Perfil',
      descricao: 'Edite suas informações pessoais'
    }
  ];

  const renderConteudo = () => {
    switch (secaoAtiva) {
      case 'home':
        return <EntregadorHome statusEntregador={statusEntregador} setStatusEntregador={setStatusEntregador} />;
      case 'entregas':
        return <EntregadorEntregas />;
      case 'ganhos':
        return <EntregadorGanhos />;
      case 'relatorios':
        return <EntregadorGanhos showRelatorios={true} />;
      case 'suporte':
        return <EntregadorSuporte />;
      case 'perfil':
        return <EntregadorPerfil onUserDataUpdate={setUserData} />;
      default:
        return <EntregadorHome statusEntregador={statusEntregador} setStatusEntregador={setStatusEntregador} />;
    }
  };

  const getStatusColor = () => {
    switch (statusEntregador) {
      case 'disponivel': return '#10b981';
      case 'ocupado': return '#f59e0b';
      default: return '#ef4444';
    }
  };

  const getStatusText = () => {
    switch (statusEntregador) {
      case 'disponivel': return 'Disponível';
      case 'ocupado': return 'Em Entrega';
      default: return 'Offline';
    }
  };

  return (
    <div className={Styles.dashboardContainer}>
      
      {/* Sidebar */}
      <aside className={`${Styles.sidebar} ${sidebarOpen ? Styles.open : Styles.closed}`}>
        <div className={Styles.sidebarHeader}>
          <h2>Docelivery</h2>
          <span>Entregador</span>
        </div>
        
        <nav className={Styles.sidebarNav}>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setSecaoAtiva(item.id)}
              className={`${Styles.navItem} ${secaoAtiva === item.id ? Styles.active : ''}`}
            >
              {item.icone}
              <span>{item.nome}</span>
            </button>
          ))}
        </nav>
        
        <div className={Styles.sidebarFooter}>
          <button className={Styles.logoutBtn} onClick={handleLogout}>
            <IoLogOut size={20} />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Área Principal */}
      <div className={Styles.mainArea}>
        
        {/* Header */}
        <header className={Styles.header}>
          <div className={Styles.headerLeft}>
            <button 
              className={Styles.menuToggle}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <IoMenu size={24} />
            </button>
            <div>
              <h1>{menuItems.find(item => item.id === secaoAtiva)?.titulo || 'Dashboard'}</h1>
              <p>{menuItems.find(item => item.id === secaoAtiva)?.descricao || 'Painel de controle'}</p>
            </div>
          </div>
          
          <div className={Styles.headerRight}>
            <div className={Styles.statusEntregador}>
              <span className={Styles.statusLabel}>Status:</span>
              <div 
                className={Styles.statusIndicator}
                style={{ backgroundColor: getStatusColor() }}
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
              <span className={Styles.notificationBadge}>3</span>
            </button>
            
            <div className={Styles.userProfile}>
              <div className={Styles.userInfo}>
                <div className={Styles.userName}>{userData.nome}</div>
                <div className={Styles.userVehicle}>{userData.veiculo}</div>
              </div>
              <div className={Styles.avatar}>
                {userData.nome.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Conteúdo Principal */}
        <main className={Styles.content}>
          <div className={Styles.contentWrapper}>
            {renderConteudo()}
          </div>
        </main>
      </div>
      
      {/* Overlay e Notificações */}
      {showNotifications && (
        <>
          <div className={Styles.notificationsOverlay} onClick={() => setShowNotifications(false)} />
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
          </div>
        </>
      )}
    </div>
  );
};

export default PaginaEntregador;