import React, { useState, useEffect } from 'react';
import { IoPersonOutline, IoRestaurant, IoReceipt, IoTrendingUp, IoWarningOutline, IoCheckmarkCircleOutline, IoTimeOutline, IoStatsChartOutline, IoNotificationsOutline, IoAlertCircleOutline } from 'react-icons/io5';
import Styles from './DashboardHome.module.css';

const AdminHome = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [systemHealth, setSystemHealth] = useState('excellent');
  
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  
  const stats = [
    {
      title: 'Total de Usuários',
      value: '1,234',
      icon: <IoPersonOutline size={24} />,
      color: '#ff69b4',
      change: '+12%'
    },
    {
      title: 'Lojas Ativas',
      value: '89',
      icon: <IoRestaurant size={24} />,
      color: '#8a2be2',
      change: '+5%'
    },
    {
      title: 'Pedidos Hoje',
      value: '156',
      icon: <IoReceipt size={24} />,
      color: '#4CAF50',
      change: '+23%'
    },
    {
      title: 'Receita Total',
      value: 'R$ 45.678',
      icon: <IoTrendingUp size={24} />,
      color: '#FF9800',
      change: '+18%'
    }
  ];

  const recentActivities = [
    { type: 'user', message: 'Novo cliente cadastrado: Maria Silva', time: '2 min atrás', priority: 'low' },
    { type: 'store', message: 'Loja "Doces da Vovó" aprovada', time: '15 min atrás', priority: 'medium' },
    { type: 'order', message: 'Pedido #1234 finalizado com sucesso', time: '30 min atrás', priority: 'low' },
    { type: 'support', message: 'Ticket de suporte #567 resolvido', time: '1h atrás', priority: 'high' },
    { type: 'user', message: 'Confeiteiro "João Doces" cadastrado', time: '2h atrás', priority: 'low' },
    { type: 'alert', message: 'Sistema de pagamento com lentidão', time: '3h atrás', priority: 'high' },
    { type: 'order', message: '15 novos pedidos nas últimas 2 horas', time: '4h atrás', priority: 'medium' }
  ];
  
  const systemAlerts = [
    { type: 'warning', message: '3 lojas pendentes de aprovação', action: 'Revisar lojas', urgent: true },
    { type: 'error', message: '2 tickets de alta prioridade não atendidos', action: 'Ver tickets', urgent: true },
    { type: 'info', message: '5 novos usuários aguardando aprovação', action: 'Aprovar', urgent: false },
    { type: 'success', message: 'Sistema funcionando normalmente', action: null, urgent: false }
  ];
  
  const quickStats = {
    ordersToday: 156,
    newUsersToday: 23,
    pendingStores: 3,
    activeSupport: 2,
    systemUptime: '99.9%',
    avgResponseTime: '1.2s'
  };

  return (
    <div className={Styles.dashboardHome}>
      {/* Header com informações em tempo real */}
      <div className={Styles.dashboardHeader}>
        <div className={Styles.timeInfo}>
          <h2>Painel Administrativo</h2>
          <p>{currentTime.toLocaleString('pt-BR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</p>
        </div>
        <div className={Styles.systemStatus}>
          <div className={`${Styles.statusIndicator} ${Styles[systemHealth]}`}>
            <IoCheckmarkCircleOutline size={20} />
            <span>Sistema Online</span>
          </div>
        </div>
      </div>
      
      {/* Alertas do Sistema */}
      <div className={Styles.alertsSection}>
        <h3>Alertas do Sistema</h3>
        <div className={Styles.alertsGrid}>
          {systemAlerts.map((alert, index) => (
            <div key={index} className={`${Styles.alertCard} ${Styles[alert.type]}`}>
              <div className={Styles.alertIcon}>
                {alert.type === 'warning' && <IoWarningOutline size={20} />}
                {alert.type === 'error' && <IoAlertCircleOutline size={20} />}
                {alert.type === 'info' && <IoNotificationsOutline size={20} />}
                {alert.type === 'success' && <IoCheckmarkCircleOutline size={20} />}
              </div>
              <div className={Styles.alertContent}>
                <p>{alert.message}</p>
                {alert.action && (
                  <button className={Styles.alertAction}>{alert.action}</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Estatísticas Rápidas */}
      <div className={Styles.quickStatsGrid}>
        <div className={Styles.quickStat}>
          <IoReceipt size={24} color="#4CAF50" />
          <div>
            <span className={Styles.statNumber}>{quickStats.ordersToday}</span>
            <span className={Styles.statLabel}>Pedidos Hoje</span>
          </div>
        </div>
        <div className={Styles.quickStat}>
          <IoPersonOutline size={24} color="#2196F3" />
          <div>
            <span className={Styles.statNumber}>{quickStats.newUsersToday}</span>
            <span className={Styles.statLabel}>Novos Usuários</span>
          </div>
        </div>
        <div className={Styles.quickStat}>
          <IoRestaurant size={24} color="#FF9800" />
          <div>
            <span className={Styles.statNumber}>{quickStats.pendingStores}</span>
            <span className={Styles.statLabel}>Lojas Pendentes</span>
          </div>
        </div>
        <div className={Styles.quickStat}>
          <IoAlertCircleOutline size={24} color="#f44336" />
          <div>
            <span className={Styles.statNumber}>{quickStats.activeSupport}</span>
            <span className={Styles.statLabel}>Suporte Ativo</span>
          </div>
        </div>
        <div className={Styles.quickStat}>
          <IoStatsChartOutline size={24} color="#8a2be2" />
          <div>
            <span className={Styles.statNumber}>{quickStats.systemUptime}</span>
            <span className={Styles.statLabel}>Uptime</span>
          </div>
        </div>
        <div className={Styles.quickStat}>
          <IoTimeOutline size={24} color="#ff69b4" />
          <div>
            <span className={Styles.statNumber}>{quickStats.avgResponseTime}</span>
            <span className={Styles.statLabel}>Tempo Resposta</span>
          </div>
        </div>
      </div>
      
      <div className={Styles.statsGrid}>
        {stats.map((stat, index) => (
          <div key={index} className={Styles.statCard}>
            <div className={Styles.statIcon} style={{ color: stat.color }}>
              {stat.icon}
            </div>
            <div className={Styles.statContent}>
              <h3>{stat.value}</h3>
              <p>{stat.title}</p>
              <span className={Styles.statChange} style={{ color: stat.color }}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className={Styles.recentSection}>
        <h2>Atividades Recentes</h2>
        <div className={Styles.activityList}>
          {recentActivities.map((activity, index) => (
            <div key={index} className={Styles.activityItem}>
              <div className={`${Styles.activityIcon} ${Styles[activity.type]} ${Styles[activity.priority]}`}>
                {activity.type === 'user' && <IoPersonOutline size={16} />}
                {activity.type === 'store' && <IoRestaurant size={16} />}
                {activity.type === 'order' && <IoReceipt size={16} />}
                {activity.type === 'support' && <IoTrendingUp size={16} />}
                {activity.type === 'alert' && <IoWarningOutline size={16} />}
              </div>
              <div className={Styles.activityContent}>
                <p className={activity.priority === 'high' ? Styles.highPriority : ''}>{activity.message}</p>
                <small>{activity.time}</small>
                {activity.priority === 'high' && (
                  <span className={Styles.priorityBadge}>URGENTE</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={Styles.quickActions}>
        <h2>Ações Rápidas</h2>
        <div className={Styles.actionButtons}>
          <button className={Styles.actionBtn}>
            <IoPersonOutline size={20} />
            <span>Gerenciar Usuários</span>
          </button>
          <button className={Styles.actionBtn}>
            <IoRestaurant size={20} />
            <span>Aprovar Lojas</span>
          </button>
          <button className={Styles.actionBtn}>
            <IoReceipt size={20} />
            <span>Ver Pedidos</span>
          </button>
          <button className={Styles.actionBtn}>
            <IoTrendingUp size={20} />
            <span>Relatórios</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;