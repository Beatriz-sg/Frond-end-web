import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Styles from './ConfeiteiroDashboard.module.css';
import { IoHome, IoReceipt, IoRestaurant, IoStatsChart, IoCalendar, IoSettings, IoLogOut, IoNotifications, IoMenu } from 'react-icons/io5';
import { useLoja } from '../context/LojaContext';
import AuthService from '../services/authService';
import PedidosPage from "../Components/PedidosPage";
import CardapioManager from "../Components/CardapioManager";
import DashboardHome from "../Components/DashboardHome";
import FinanceiroModerno from '../Components/FinanceiroModerno';
import AgendamentosModerno from '../Components/AgendamentosModerno';
import PerfilLoja from '../Components/PerfilLoja';
import AppLogo from '../assests/img/doce_Livre_3.jpg';

const ConfeiteiroDashboard = () => {
  const [secaoAtiva, setSecaoAtiva] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [storeOpen, setStoreOpen] = useState(true);
  
  const navigate = useNavigate();
  const { dadosLoja, atualizarDadosLoja } = useLoja();

  const perfilBuscado = useRef(false);

  const [userData, setUserData] = useState({
    nome: 'Confeiteiro',
    loja: { nomeFantasia: 'Minha Confeitaria', descricao: '', telefone: '', endereco: '' },
    email: '',
    fotoLoja: ''
  });

  const [businessHours, setBusinessHours] = useState({
    monday: { open: '08:00', close: '18:00', isOpen: true },
    tuesday: { open: '08:00', close: '18:00', isOpen: true },
    wednesday: { open: '08:00', close: '18:00', isOpen: true },
    thursday: { open: '08:00', close: '18:00', isOpen: true },
    friday: { open: '08:00', close: '18:00', isOpen: true },
    saturday: { open: '08:00', close: '16:00', isOpen: true },
    sunday: { open: '08:00', close: '14:00', isOpen: false }
  });

  const extrairDadosUsuario = useCallback(() => {
    const rawStorage = localStorage.getItem('user');
    if (!rawStorage) return { nome: 'Confeiteiro', loja: 'Minha Confeitaria', email: '', fotoLoja: '' };
    
    try {
      const parsed = JSON.parse(rawStorage);
      console.log("Dados do usuário logado:", parsed);
      const dadosReais = parsed.user || parsed.data || parsed;

      const nomeConfeiteiro = dadosReais.nome || dadosReais.nomeConfeiteiro || dadosReais.name || parsed.nome || 'Confeiteiro';
      
      const nomeDaLoja = 
        dadosReais.loja?.nomeFantasia || 
        parsed.loja?.nomeFantasia || 
        dadosReais.nomeLoja || 
        dadosReais.nomeFantasia ||
        dadosReais.nomeConfeitaria ||
        parsed.nomeLoja || 
        'Minha Confeitaria';

      const foto = dadosReais.loja?.fotoUrl || dadosReais.fotoUrl || dadosReais.fotoLoja || parsed.fotoLoja || '';

      return {
        nome: nomeConfeiteiro,
        loja: nomeDaLoja,
        email: dadosReais.email || parsed.email || '',
        fotoLoja: foto
      };
    } catch (error) {
      console.error("Erro ao extrair dados do usuário:", error);
      return { nome: 'Confeiteiro', loja: 'Minha Confeitaria', email: '', fotoLoja: '' };
    }
  }, []);

  const perfilUnificado = useMemo(() => {
    const nomeLoja = dadosLoja?.nomeFantasia || 
                     (typeof userData.loja === 'object' ? userData.loja?.nomeFantasia : userData.loja) || 
                     'Minha Confeitaria';
    return {
      nome: userData.nome,
      email: userData.email,
      loja: String(nomeLoja),
      fotoLoja: dadosLoja?.imagem || userData.fotoLoja || AppLogo
    };
  }, [userData, dadosLoja]);

  const handleLogout = () => {
    try {
      localStorage.clear();
      window.dispatchEvent(new Event('localStorageUpdate'));
    } catch (e) {
      console.warn('Erro limpando localStorage durante logout', e);
    }
    navigate('/docelivery/confeiteiro/cadastro');
  };

  useEffect(() => {
    const token = localStorage.getItem('userToken') || localStorage.getItem('token');
    const userEmail = localStorage.getItem('userEmail');

    if (!token && !userEmail) {
      navigate('/docelivery/confeiteiro/login-confeiteiro');
      return;
    }

    setUserData(extrairDadosUsuario());

    const handleSync = () => {
      setUserData(extrairDadosUsuario());
    };

    window.addEventListener('localStorageUpdate', handleSync);
    window.addEventListener('storage', handleSync);

    const refreshProfile = async () => {
      if (perfilBuscado.current) return;

      if (token && userEmail) {
        try {
          perfilBuscado.current = true;
          const profile = await AuthService.fetchAndSaveProfile(userEmail, token);
          setUserData(extrairDadosUsuario());

          if (profile && atualizarDadosLoja) {
            const lojaInfo = profile.loja || profile;
            atualizarDadosLoja({
              id: lojaInfo.id || null,
              nome: lojaInfo.nomeFantasia || lojaInfo.nomeLoja || '',
              descricao: lojaInfo.descricao || '',
              cnpj: lojaInfo.cnpj || '',
              telefone: lojaInfo.telefone || '',
              endereco: lojaInfo.endereco || '',
              imagem: lojaInfo.fotoUrl || lojaInfo.imagem || '',
              horarioFuncionamento: lojaInfo.horarioFuncionamento || null
            });
          }
        } catch (error) {
          console.warn('Não foi possível atualizar perfil do confeiteiro no dashboard:', error);
          perfilBuscado.current = false;
        }
      }
    };

    refreshProfile();
    
    const savedBusinessHours = localStorage.getItem('businessHours');
    if (savedBusinessHours) {
      try { setBusinessHours(JSON.parse(savedBusinessHours)); } catch (e) { console.error(e); }
    }

    return () => {
      window.removeEventListener('localStorageUpdate', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, [navigate, atualizarDadosLoja, extrairDadosUsuario]);

  useEffect(() => {
    const verificarStatusLoja = () => {
      const now = new Date();
      const diasSemana = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const currentDay = diasSemana[now.getDay()];
      const currentTime = now.toTimeString().slice(0, 5);
      
      const todayHours = businessHours[currentDay];
      if (!todayHours || !todayHours.isOpen) {
        setStoreOpen(false);
        return;
      }
      
      const aberto = currentTime >= todayHours.open && currentTime <= todayHours.close;
      setStoreOpen(aberto);
    };

    verificarStatusLoja();
    const interval = setInterval(verificarStatusLoja, 60000);

    return () => clearInterval(interval);
  }, [businessHours]);

  const menuItems = [
    { id: 'home', nome: 'Dashboard', icone: <IoHome size={20} />, titulo: 'Painel Principal', descricao: 'Visão geral do seu negócio' },
    { id: 'pedidos', nome: 'Pedidos', icone: <IoReceipt size={20} />, titulo: 'Gerenciar Pedidos', descricao: 'Acompanhe todos os pedidos da sua confeitaria' },
    { id: 'cardapio', nome: 'Cardápio', icone: <IoRestaurant size={20} />, titulo: 'Gerenciar Cardápio', descricao: 'Adicione e edite seus produtos' },
    { id: 'finance', nome: 'Financeiro', icone: <IoStatsChart size={20} />, titulo: 'Controle Financeiro', descricao: 'Acompanhe receitas, despesas e lucros' },
    { id: 'agendamento', nome: 'Agendamentos', icone: <IoCalendar size={20} />, titulo: 'Agenda de Encomendas', descricao: 'Organize suas encomendas e prazos' },
    { id: 'perfil', nome: 'Perfil da Loja', icone: <IoSettings size={20} />, titulo: 'Configurações da Loja', descricao: 'Edite informações e configurações' },
    { id: 'horarios', nome: 'Horários', icone: <IoCalendar size={20} />, titulo: 'Horário de Funcionamento', descricao: 'Configure os horários de abertura e fechamento' },
  ];

  const renderConteudo = () => {
    switch (secaoAtiva) {
      case 'pedidos': return <PedidosPage />;
      case 'cardapio': return <CardapioManager />;
      case 'home': return <DashboardHome userData={perfilUnificado} />;
      case 'finance': return <FinanceiroModerno />;
      case 'agendamento': return <AgendamentosModerno />;
      case 'perfil': return <PerfilLoja />;
      case 'horarios':
        return (
          <div className={Styles.horariosContainer}>
            <h2>Horário de Funcionamento</h2>
            <p>Configure os horários de abertura e fechamento da sua loja. O status será updated automaticamente.</p>
            <div className={Styles.horariosGrid}>
              {Object.entries(businessHours).map(([day, hours]) => {
                const dayNames = {
                  monday: 'Segunda-feira', tuesday: 'Terça-feira', wednesday: 'Quarta-feira',
                  thursday: 'Quinta-feira', friday: 'Sexta-feira', saturday: 'Sábado', sunday: 'Domingo'
                };
                return (
                  <div key={day} className={Styles.horarioCard}>
                    <div className={Styles.dayHeader}>
                      <h3>{dayNames[day]}</h3>
                      <label className={Styles.switchContainer}>
                        <input
                          type="checkbox"
                          checked={hours.isOpen}
                          onChange={(e) => {
                            const newHours = { ...businessHours, [day]: { ...hours, isOpen: e.target.checked } };
                            setBusinessHours(newHours);
                            localStorage.setItem('businessHours', JSON.stringify(newHours));
                          }}
                        />
                        <span className={Styles.slider}></span>
                      </label>
                    </div>
                    {hours.isOpen && (
                      <div className={Styles.timeInputs}>
                        <div className={Styles.timeGroup}>
                          <label>Abertura:</label>
                          <input
                            type="time"
                            value={hours.open}
                            onChange={(e) => {
                              const newHours = { ...businessHours, [day]: { ...hours, open: e.target.value } };
                              setBusinessHours(newHours);
                              localStorage.setItem('businessHours', JSON.stringify(newHours));
                            }}
                          />
                        </div>
                        <div className={Styles.timeGroup}>
                          <label>Fechamento:</label>
                          <input
                            type="time"
                            value={hours.close}
                            onChange={(e) => {
                              const newHours = { ...businessHours, [day]: { ...hours, close: e.target.value } };
                              setBusinessHours(newHours);
                              localStorage.setItem('businessHours', JSON.stringify(newHours));
                            }}
                          />
                        </div>
                      </div>
                    )}
                    {!hours.isOpen && <p className={Styles.closedDay}>Fechado</p>}
                  </div>
                );
              })}
            </div>
            <div className={Styles.currentStatus}>
              <h3>Status Atual:</h3>
              <div className={`${Styles.statusIndicator} ${storeOpen ? Styles.open : Styles.closed}`}>
                {storeOpen ? '🟢 Loja Aberta' : '🔴 Loja Fechada'}
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className={Styles.emptyState}>
            <h2>Seção em Desenvolvimento</h2>
            <p>Esta funcionalidade estará disponível em breve.</p>
          </div>
        );
    }
  };

  return (
    <div className={Styles.dashboardContainer}>
      <aside className={`${Styles.sidebar} ${sidebarOpen ? Styles.open : Styles.closed}`}>
        <div className={Styles.sidebarHeader}>
          <img 
            src={
              perfilUnificado.fotoLoja && perfilUnificado.fotoLoja !== AppLogo
                ? (String(perfilUnificado.fotoLoja).startsWith('http') 
                    ? perfilUnificado.fotoLoja 
                    : `http://localhost:8080/uploads/${perfilUnificado.fotoLoja}`)
                : AppLogo
            } 
            alt="Logo da loja" 
            className={Styles.sidebarLogo}
            onError={(e) => { e.target.src = AppLogo; }}
          />
          <div className={Styles.sidebarBrand}>
            <h2>Docelivery</h2>
            <span>{perfilUnificado.loja}</span>
          </div>
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

      <div className={Styles.mainArea}>
        <header className={Styles.header}>
          <div className={Styles.headerLeft}>
            <button className={Styles.menuToggle} onClick={() => setSidebarOpen(!sidebarOpen)}>
              <IoMenu size={24} />
            </button>
            <div>
              <h1>{menuItems.find(item => item.id === secaoAtiva)?.titulo || 'Dashboard'}</h1>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#666', fontWeight: '400' }}>
                {menuItems.find(item => item.id === secaoAtiva)?.descricao || 'Painel de controle'}
              </p>
            </div>
          </div>
        </header>
        <main className={Styles.content}>
          {renderConteudo()}
        </main>
      </div>
    </div>
  );
};

export default ConfeiteiroDashboard;