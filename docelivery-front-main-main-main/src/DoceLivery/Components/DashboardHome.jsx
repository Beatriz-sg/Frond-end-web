import React, { useState, useEffect, useRef, useMemo } from 'react';
import Styles from '../Components/DashboardHome.module.css';
import { FaBoxOpen, FaChartLine, FaCalendarAlt, FaShoppingCart, FaExclamationTriangle, FaClock, FaEdit } from 'react-icons/fa';
import { useStore } from '../context/StoreContext';
import OrderService from '../services/orderService';
import AuthService from '../services/authService';
import ConfeiteiroService from '../services/confeiteiroService'; 
import SalesChart from './SalesChart';
import VendasTempoReal from '../Components/VendasTempoReal';
import { API_UPLOADS_URL } from '../config/api.config';

const DashboardHome = ({ editMode, userData }) => {
    const { storeData, updateStoreData } = useStore();
    const [editingField, setEditingField] = useState(null);
    
    const [pedidosBanco, setPedidosBanco] = useState([]);
    const [loading, setLoading] = useState(true);
    const [confeiteiroId, setConfeiteiroId] = useState(null);

    const requisicaoFeita = useRef(false);

    const [displayStoreData, setDisplayStoreData] = useState({
        nomeConfeiteiro: '',
        name: '', 
        description: '', 
        email: '',
        phone: '',
        address: '',
        fotoUrl: ''
    });

    useEffect(() => {
        const id = AuthService.getUserId();
        if (id) {
            setConfeiteiroId(id);
        } else {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!confeiteiroId || requisicaoFeita.current) return;

        const buscarDadosDashboard = async () => {
            try {
                setLoading(true);
                requisicaoFeita.current = true; 
                
                console.log("Buscando dados integrados para o confeiteiro ID:", confeiteiroId);
                
                const [dadosPedidos, dadosConfeiteiro] = await Promise.all([
                    OrderService.getFilaTrabalho(confeiteiroId).catch(() => []),
                    ConfeiteiroService.getConfeiteiro(confeiteiroId).catch(() => null)
                ]);

                setPedidosBanco(dadosPedidos || []);

                if (dadosConfeiteiro) {
                    console.log("Dados do Confeiteiro retornados do Banco:", dadosConfeiteiro);
                    
                    const lojaReal = dadosConfeiteiro.loja;

                    setDisplayStoreData({
                        nomeConfeiteiro: dadosConfeiteiro.nome || 'Confeiteiro',
                        name: lojaReal?.nomeFantasia || '',
                        description: lojaReal?.descricao || '',
                        email: dadosConfeiteiro.email || '',
                        phone: lojaReal?.telefone || dadosConfeiteiro.telefone || '',
                        address: lojaReal?.endereco || dadosConfeiteiro.endereco || '',
                        fotoUrl: lojaReal?.fotoUrl || lojaReal?.imagem || ''
                    });

                    if (!lojaReal || !lojaReal.id) {
                        console.warn('Loja ainda não cadastrada. O confeiteiro precisa preencher o Perfil da Loja.');
                    }

                } else {
                    const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
                    const savedDados = JSON.parse(localStorage.getItem('dadosConfeiteiro') || '{}');
                    const lojaObjeto = storeData || savedDados.loja || savedUser.loja || {};

                    setDisplayStoreData({
                        nomeConfeiteiro: userData?.nome || savedUser.nome || 'Confeiteiro',
                        name: typeof userData?.loja === 'string' ? userData.loja : (lojaObjeto.name || 'Preencha o nome da sua Confeitaria'),
                        description: lojaObjeto.description || 'Clique em editar para adicionar uma descrição.',
                        email: userData?.email || savedUser.email || '',
                        phone: lojaObjeto.phone || savedUser.telefone || '',
                        address: userData?.endereco || lojaObjeto.address || 'Endereço não cadastrado'
                    });
                } 

            } catch (error) {
                console.error("Erro crítico ao alimentar o painel com a API:", error);
                requisicaoFeita.current = false; 
            } finally {
                setLoading(false);
            }
        };

        buscarDadosDashboard();
    }, [confeiteiroId]); 

    const kpisCalculados = useMemo(() => {
        const novosEPendentes = pedidosBanco.filter(p => p.status === 'NOVO' || p.status === 'PENDENTE');
        const agendadosProximos = pedidosBanco.filter(p => p.agendado === true || p.status === 'AGENDADO');
        
        const totalVendasHoje = pedidosBanco
            .filter(p => p.status !== 'CANCELADO')
            .reduce((acc, p) => acc + (p.valorPedido || 0), 0);

        const ticketMedio = pedidosBanco.length > 0 ? (totalVendasHoje / pedidosBanco.length) : 0;

        return {
            pedidosHoje: pedidosBanco.length,
            pedidosPendentesCount: novosEPendentes.length,
            vendasHojeValor: totalVendasHoje,
            ticketMedioValor: ticketMedio,
            agendamentosContagem: agendadosProximos.length,
            listaRecentes: pedidosBanco.slice(0, 5),
            listaAgendados: agendadosProximos.slice(0, 3)
        };
    }, [pedidosBanco]);

    const dadosGraficoVendas = useMemo(() => [
        { name: 'Seg', vendas: kpisCalculados.vendasHojeValor * 0.1 },
        { name: 'Ter', vendas: kpisCalculados.vendasHojeValor * 0.3 },
        { name: 'Qua', vendas: kpisCalculados.vendasHojeValor * 0.2 },
        { name: 'Qui', vendas: kpisCalculados.vendasHojeValor * 0.4 },
        { name: 'Sex', vendas: kpisCalculados.vendasHojeValor * 0.6 },
        { name: 'Sáb', vendas: kpisCalculados.vendasHojeValor * 0.9 },
        { name: 'Dom', vendas: kpisCalculados.vendasHojeValor }
    ], [kpisCalculados.vendasHojeValor]);

    const handleEdit = async (field, value) => {
        const novosDadosVisuais = { ...displayStoreData, [field]: value };
        setDisplayStoreData(novosDadosVisuais);
        
        if (updateStoreData) {
            updateStoreData({ [field]: value });
        }

        try {
            if (confeiteiroId) {
                const dadosParaAtualizar = {
                    nome: field === 'nomeConfeiteiro' ? value : displayStoreData.nomeConfeiteiro,
                    nomeLoja: field === 'name' ? value : displayStoreData.name,
                    descricao: field === 'description' ? value : displayStoreData.description,
                    telefone: field === 'phone' ? value : displayStoreData.phone,
                    logradouro: field === 'address' ? value : displayStoreData.address,
                    email: displayStoreData.email,
                };

                console.log("Enviando dados inline atualizados para o Service:", dadosParaAtualizar);
                await ConfeiteiroService.atualizarPerfil(dadosParaAtualizar);
                console.log("Banco de dados updated!");
            }
        } catch (err) {
            console.error("Erro ao salvar edição em tempo real no banco:", err);
        }
        
        setEditingField(null);
    };

    const EditableField = ({ field, value, type = 'text', className = '' }) => {
        const isEditing = editingField === field;
        if (!editMode) return <span className={className}>{value}</span>;
        
        if (isEditing) {
            return (
                <input
                    type={type}
                    defaultValue={value}
                    onBlur={(e) => handleEdit(field, e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleEdit(field, e.target.value)}
                    autoFocus
                    className={`${Styles.editInput} ${className}`}
                />
            );
        }
        
        return (
            <span className={`${className} ${Styles.editable}`} onClick={() => setEditingField(field)}>
                {value} <FaEdit size={12} className={Styles.editIcon} />
            </span>
        );
    };

    if (loading) return <p style={{ padding: '20px' }}>Sincronizando painel com banco de dados...</p>;

    return (
        <div className={Styles.dashboardHome}>
            <div className={Styles.welcomeSection}>
                <h1>Bem-vindo de volta, {displayStoreData.nomeConfeiteiro}!</h1>
                {!displayStoreData.name ? (
                    <div style={{ background: '#fff3cd', border: '1px solid #ffc107', borderRadius: '8px', padding: '12px 16px', marginBottom: '12px', color: '#856404' }}>
                        ⚠️ Sua loja ainda não foi configurada. Vá em <strong>Perfil da Loja</strong> para preencher o nome, CNPJ e foto.
                    </div>
                ) : (
                    <p>Gerencie seus kits... da loja <strong>{displayStoreData.name}</strong></p>
                )}
                <div className={Styles.storeInfo}>
                    {displayStoreData.fotoUrl && (
                        <img 
                            src={
                        String(displayStoreData.fotoUrl).startsWith('http')
                                    ? displayStoreData.fotoUrl
                                    : `${API_UPLOADS_URL}/${displayStoreData.fotoUrl}`
                            }
                            alt="Foto da loja"
                            style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', marginBottom: '10px' }}
                            onError={(e) => { e.target.style.display = 'none'; }}
                        />
                    )}
                    <h3>
                        <EditableField
                            field="name"
                            value={displayStoreData.name}
                            className={Styles.storeName}
                        />
                    </h3>
                    {displayStoreData.email && <p style={{ margin: '2px 0', fontSize: '0.9rem', color: '#666' }}>📧 {displayStoreData.email}</p>}
                    {displayStoreData.phone && <p style={{ margin: '2px 0', fontSize: '0.9rem', color: '#666' }}>📞 {displayStoreData.phone}</p>}
                    {displayStoreData.address && <p style={{ margin: '2px 0', fontSize: '0.9rem', color: '#666' }}>📍 {displayStoreData.address}</p>}
                </div>
            </div>
            
            <div className={Styles.kpiGrid}>
                <div className={Styles.kpiCard + ' ' + Styles.pedidosCard}>
                    <div className={Styles.cardContent}>
                        <h3>Pedidos na Fila</h3>
                        <span className={Styles.kpiValue}>{kpisCalculados.pedidosHoje}</span>
                        <small>{kpisCalculados.pedidosPendentesCount} pendentes</small>
                    </div>
                    <div className={Styles.cardIcon}><FaBoxOpen /></div>
                </div>
                
                <div className={Styles.kpiCard + ' ' + Styles.vendasCard}>
                    <div className={Styles.cardContent}>
                        <h3>Faturamento Bruto</h3>
                        <span className={Styles.kpiValue}>R$ {kpisCalculados.vendasHojeValor.toFixed(2)}</span>
                        <small>Ticket médio: R$ {kpisCalculados.ticketMedioValor.toFixed(2)}</small>
                    </div>
                    <div className={Styles.cardIcon}><FaChartLine /></div>
                </div>
                
                <div className={Styles.kpiCard + ' ' + Styles.clientesCard}>
                    <div className={Styles.cardContent}>
                        <h3>Produtos em Uso</h3>
                        <span className={Styles.kpiValue}>{pedidosBanco.length > 0 ? 'Ativo' : '0'}</span>
                        <small>Sincronizado via HTTP</small>
                    </div>
                    <div className={Styles.cardIcon}><FaShoppingCart /></div>
                </div>
                
                <div className={Styles.kpiCard + ' ' + Styles.agendamentosCard}>
                    <div className={Styles.cardContent}>
                        <h3>Agendamentos</h3>
                        <span className={Styles.kpiValue}>{kpisCalculados.agendamentosContagem}</span>
                        <small>Pedidos agendados no banco</small>
                    </div>
                    <div className={Styles.cardIcon}><FaCalendarAlt /></div>
                </div>
            </div>
            
            <div className={Styles.chartSection}>
                <SalesChart salesData={dadosGraficoVendas} />
                <VendasTempoReal />
            </div>

            <div className={Styles.dashboardGrid}>
                <div className={Styles.recentActivity}>
                    <h3>Pedidos Recentes (API)</h3>
                    <ul className={Styles.pedidosList}>
                        {kpisCalculados.listaRecentes.map(pedido => (
                            <li key={pedido.id} className={Styles.pedidoItem}>
                                <div className={Styles.pedidoInfo}>
                                    <strong>#{pedido.id}</strong> - {pedido.cliente?.nome || 'Cliente Balcão'}
                                    <span className={Styles.produto}>
                                        {pedido.itens?.map(i => `${i.quantidade}x ${i.produto?.nome}`).join(', ') || 'Doce Variado'}
                                    </span>
                                </div>
                                <div className={Styles.pedidoMeta}>
                                    <span className={Styles.valor}>R$ {pedido.valorPedido?.toFixed(2)}</span>
                                    <span className={`${Styles.statusTag} ${Styles[pedido.status || 'NOVO']}`}>{pedido.status}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                
                <div className={Styles.upcomingEvents}>
                    <h3>Próximos Agendamentos</h3>
                    <div className={Styles.eventsList}>
                        {kpisCalculados.listaAgendados.map(evento => (
                            <div key={evento.id} className={Styles.eventItem}>
                                <div className={Styles.eventDate}>
                                    <FaClock size={16} />
                                    {evento.dataEntregaAgendada ? new Date(evento.dataEntregaAgendada).toLocaleDateString('pt-BR') : 'Sem data'}
                                </div>
                                <div className={Styles.eventInfo}>
                                    <strong>{evento.cliente?.nome || 'Agendado Manual'}</strong>
                                    <span>{evento.itens?.map(i => i.produto?.nome).join(', ') || 'Encomenda'}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className={Styles.financialSummary}>
                    <h3>Resumo Financeiro</h3>
                    <div className={Styles.financialItem}>
                        <span>Total Líquido Estimado:</span>
                        <strong>R$ {(kpisCalculados.vendasHojeValor * 0.7).toFixed(2)}</strong>
                    </div>
                    <div className={Styles.financialItem}>
                        <span>Faturamento Bruto Total:</span>
                        <strong>R$ {kpisCalculados.vendasHojeValor.toFixed(2)}</strong>
                    </div>
                </div>
                
                <div className={Styles.alerts}>
                    <h3>Alertas Ativos</h3>
                    <div className={Styles.alertItem}>
                        <FaExclamationTriangle className={Styles.alertIcon} />
                        <span>{kpisCalculados.pedidosPendentesCount} novos pedidos aguardando aceite</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;