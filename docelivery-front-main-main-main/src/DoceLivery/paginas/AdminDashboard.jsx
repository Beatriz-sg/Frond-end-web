import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoHome, IoPersonOutline, IoRestaurant, IoReceipt, IoStatsChart, IoLogOut, IoMenu, IoNotifications, IoChatbubbleEllipsesOutline, IoAnalyticsOutline } from 'react-icons/io5';
import Styles from './ConfeiteiroDashboard.module.css';
import AdminHome from '../Components/AdminHome';
import AdminUsers from '../Components/AdminUsers';
import AdminStores from '../Components/AdminStores';
import AdminOrders from '../Components/AdminOrders';
import AdminReports from '../Components/AdminReports';
import AdminSupport from '../Components/AdminSupport';
import AdminChat from '../Components/AdminChat';
import AdminAnalytics from '../Components/AdminAnalytics';

const AdminDashboard = () => {
  const [secaoAtiva, setSecaoAtiva] = useState('home');
  const [showNotifications, setShowNotifications] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [adminData, setAdminData] = useState({ nome: 'Administrador' });
  const [adminNivel, setAdminNivel] = useState(localStorage.getItem('adminNivel') || 'SUPORTE');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userType');
    localStorage.removeItem('adminName');
    navigate('/');
  };

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    const userType = localStorage.getItem('userType');
    
    if (!token || userType !== 'admin') {
      navigate('/docelivery/admin/login');
    } else {
      const adminName = localStorage.getItem('adminName') || 'Administrador';
      setAdminData({ nome: adminName });
    }
  }, [navigate]);

  const menuItems = [
    { 
      id: 'home', 
      nome: 'Dashboard', 
      icone: <IoHome size={20} />,
      titulo: 'Painel Administrativo',
      descricao: 'Visão geral do sistema'
    },
    { 
      id: 'users', 
      nome: 'Usuários', 
      icone: <IoPersonOutline size={20} />,
      titulo: 'Gerenciar Usuários',
      descricao: 'Clientes e confeiteiros cadastrados'
    },
    { 
      id: 'stores', 
      nome: 'Lojas', 
      icone: <IoRestaurant size={20} />,
      titulo: 'Gerenciar Lojas',
      descricao: 'Confeitarias e seus produtos'
    },
    { 
      id: 'orders', 
      nome: 'Pedidos', 
      icone: <IoReceipt size={20} />,
      titulo: 'Todos os Pedidos',
      descricao: 'Monitorar pedidos do sistema'
    },
    { 
      id: 'reports', 
      nome: 'Relatórios', 
      icone: <IoStatsChart size={20} />,
      titulo: 'Relatórios e Análises',
      descricao: 'Estatísticas e métricas do sistema'
    },
    { 
      id: 'support', 
      nome: 'Suporte', 
      icone: <IoNotifications size={20} />,
      titulo: 'Central de Suporte',
      descricao: 'Gerenciar tickets e atendimento'
    },
    { 
      id: 'chat', 
      nome: 'Chat ao Vivo', 
      icone: <IoChatbubbleEllipsesOutline size={20} />,
      titulo: 'Atendimento em Tempo Real',
      descricao: 'Chat direto com clientes e confeiteiros'
    },
    { 
      id: 'analytics', 
      nome: 'Analytics', 
      icone: <IoAnalyticsOutline size={20} />,
      titulo: 'Análise de Atendimento',
      descricao: 'Métricas e performance do suporte'
    }
  ];

  // Filtra os itens do menu com base no nível de acesso
  const menuItemsFiltered = menuItems.filter(item => {
    if (item.id === 'analytics' && adminNivel !== 'MASTER') return false;
    return true;
  });

  const renderConteudo = () => {
    switch (secaoAtiva) {
      case 'users':
        return <AdminUsers adminNivel={adminNivel} />;
      case 'stores':
        return <AdminStores adminNivel={adminNivel} />;
      case 'orders':
        return <AdminOrders adminNivel={adminNivel} />;
      case 'reports':
        return <AdminReports adminNivel={adminNivel} />;
      case 'support':
        return <AdminSupport adminNivel={adminNivel} />;
      case 'chat':
        return <AdminChat adminNivel={adminNivel} />;
      case 'analytics':
        return <AdminAnalytics adminNivel={adminNivel} />;
      case 'home':
      default:
        return <AdminHome adminNivel={adminNivel} />;
    }
  };

  return (
    <div className={Styles.dashboardContainer}>
      <aside className={`${Styles.sidebar} ${sidebarOpen ? Styles.open : Styles.closed}`}>
        <div className={Styles.sidebarHeader}>
          <h2>Admin Panel</h2>
          <span>Docelivery</span>
        </div>
        
        <nav className={Styles.sidebarNav}>
          {menuItemsFiltered.map((item) => (
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

      <div className={Styles.mainArea}>
        <header className={Styles.header}>
          <div className={Styles.headerLeft}>
            <button 
              className={Styles.menuToggle}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <IoMenu size={24} />
            </button>
            <div>
              <h1>{menuItemsFiltered.find(item => item.id === secaoAtiva)?.titulo || 'Dashboard'}</h1>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#666', fontWeight: '400' }}>
                {menuItemsFiltered.find(item => item.id === secaoAtiva)?.descricao || 'Painel administrativo'}
              </p>
            </div>
          </div>
          
          <div className={Styles.headerRight}>
            <button 
              className={Styles.notificationBtn}
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <IoNotifications size={20} />
              <span className={Styles.notificationBadge}>5</span>
            </button>
            
            <div className={Styles.userProfile}>
              <div style={{ textAlign: 'right', marginRight: '10px' }}>
                <div style={{ fontWeight: '600', color: '#8a2be2', fontSize: '0.9rem' }}>
                  {adminData.nome}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#666' }}>
                  Administrador
                </div>
              </div>
              <div className={Styles.avatar}>
                {adminData.nome.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

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
              <span>Novo usuário cadastrado</span>
              <small>5 min atrás</small>
            </div>
            <div className={Styles.notificationItem}>
              <span>Pedido #1234 aguardando aprovação</span>
              <small>10 min atrás</small>
            </div>
            <div className={Styles.notificationItem}>
              <span>Nova loja solicitou cadastro</span>
              <small>30 min atrás</small>
            </div>
            <div className={Styles.notificationItem}>
              <span>Ticket de suporte aberto</span>
              <small>1 hora atrás</small>
            </div>
            <div className={Styles.notificationItem}>
              <span>Relatório mensal disponível</span>
              <small>2 horas atrás</small>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;