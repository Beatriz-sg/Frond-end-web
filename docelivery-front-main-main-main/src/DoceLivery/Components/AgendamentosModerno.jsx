import { useState, useEffect, useCallback } from 'react';
import { IoCalendar, IoTime, IoLocation, IoNotifications, IoAdd, IoEye, IoAlert, IoClose } from 'react-icons/io5';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/pt-br';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import OrderService from '../services/orderService';
import AuthService from '../services/authService';
import Styles from './AgendamentosModerno.module.css';

// Configura o moment para usar o idioma e fuso horário local
moment.locale('pt-br');
const localizer = momentLocalizer(moment);

const AgendamentosModerno = () => {
    // const [mesAtual, setMesAtual] = useState(new Date());
    // const [diaSelecionado, setDiaSelecionado] = useState(null);
    const [alertas] = useState([]);
    const [showAlertas, setShowAlertas] = useState(false);
    const [showNovaEncomenda, setShowNovaEncomenda] = useState(false);
    const confeiteiroId = AuthService.getUserId();

    // Estado da API real
    const [encomendasReal, setEncomendasReal] = useState([]);

    const [novaEncomenda, setNovaEncomenda] = useState({
        clienteNome: '',
        produtoId: '',
        data: '',
        horario: '',
        valor: '',
        status: 'AGENDADO' // Ajustado para Enum do Java
    });

    const carregarAgendamentosDoBanco = useCallback(async () => {
        try {
            const dados = await OrderService.getFilaTrabalho(confeiteiroId);
            const agendados = (dados || []).filter(p => p.agendado === true);
            setEncomendasReal(agendados);
        } catch (error) {
            console.error(error);
        }
    }, [confeiteiroId]);

    useEffect(() => {
        carregarAgendamentosDoBanco();
    }, [carregarAgendamentosDoBanco]);

    // CORRIGIDO: Envia o cadastro manual para o banco de dados real
    const handleNovaEncomenda = async () => {
        if (!novaEncomenda.clienteNome || !novaEncomenda.data || !novaEncomenda.horario) {
            alert('Preencha os campos obrigatórios!');
            return;
        }

        try {
            const payloadPedido = {
                cliente: { nome: novaEncomenda.clienteNome },
                agendado: true,
                status: "AGENDADO",
                dataEntregaAgendada: `${novaEncomenda.data}T${novaEncomenda.horario}:00`,
                valorPedido: parseFloat(novaEncomenda.valor || 0),
                loja: { id: confeiteiroId },
                itens: [
                    {
                        produto: { id: parseInt(novaEncomenda.produtoId || 1) },
                        quantity: 1
                    }
                ]
            };

            await OrderService.createOrder(payloadPedido);
            
            alert('Encomenda agendada com sucesso!');
            setShowNovaEncomenda(false);
            setNovaEncomenda({ clienteNome: '', produtoId: '', data: '', horario: '', valor: '', status: 'AGENDADO' });
            carregarAgendamentosDoBanco(); 
        } catch (error) {
            console.error("Erro ao salvar encomenda:", error);
            alert('Erro ao salvar no servidor. Verifique os dados.');
        }
    };

    const events = encomendasReal.map(pedido => ({
        title: `Encomenda: ${pedido.cliente?.nome || 'WhatsApp'}`,
        start: new Date(pedido.dataEntregaAgendada),
        end: new Date(pedido.dataEntregaAgendada),
        allDay: false
    }));

    return (
        <div className={Styles.container}>
            {/* Header */}
            <div className={Styles.header}>
                <div className={Styles.headerContent}>
                    <h1>Gestão de Encomendas</h1>
                    <p>Calendário de produção e entregas futuras</p>
                </div>
                <div className={Styles.headerActions}>
                    <button className={`${Styles.alertasBtn} ${alertas.length > 0 ? Styles.hasAlertas : ''}`} onClick={() => setShowAlertas(!showAlertas)}>
                        <IoNotifications size={20} />
                        {alertas.length > 0 && <span className={Styles.alertaBadge}>{alertas.length}</span>}
                    </button>
                    <button className={Styles.addBtn} onClick={() => setShowNovaEncomenda(true)}>
                        <IoAdd size={20} /> Nova Encomenda
                    </button>
                </div>
            </div>

            {/* Calendário de Produção Visual */}
            <div className={Styles.calendarioContainer}>
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: '100%' }}
                    culture="pt-br"
                    views={['month', 'week', 'day']}
                    messages={{
                        next: 'Próximo',
                        previous: 'Anterior',
                        today: 'Hoje',
                        month: 'Mês',
                        week: 'Semana',
                        day: 'Dia',
                        agenda: 'Agenda',
                        date: 'Data',
                        time: 'Hora',
                        event: 'Evento',
                        noEventsInRange: 'Nenhum evento no período.'
                    }}
                />
            </div>

            {/* Listagem Simplificada */}
            <div className={Styles.detalhesContainer}>
                <h3>Próximas Entregas</h3>
                <div className={Styles.encomendasList}>
                    {encomendasReal.length > 0 ? encomendasReal.map(enc => (
                        <div key={enc.id} className={Styles.encomendaCard}>
                            <div className={Styles.encomendaHeader}>
                                <h4>{enc.cliente?.nome || 'Cliente Balcão'}</h4>
                                <span className={Styles.valor}>R$ {enc.valorPedido?.toFixed(2)}</span>
                            </div>
                            <div className={Styles.detalhes}>
                                <span className={Styles.detalheItem}><IoTime /> {new Date(enc.dataEntregaAgendada).toLocaleString('pt-BR')}</span>
                                <span className={Styles.statusBadge} style={{backgroundColor: '#8a2be2'}}>{enc.status}</span>
                            </div>
                        </div>
                    )) : <p className={Styles.semEncomendas}>Nenhuma encomenda para exibir.</p>}
                </div>
            </div>

            {/* Modal de Nova Encomenda */}
            {showNovaEncomenda && (
                <div className={Styles.modalOverlay}>
                    <div className={Styles.modal}>
                        <div className={Styles.modalHeader}>
                            <h2>Agendar Nova Encomenda</h2>
                            <button onClick={() => setShowNovaEncomenda(false)}><IoClose size={24} /></button>
                        </div>
                        
                        <div className={Styles.modalBody}>
                            <div className={Styles.formGroup}>
                                <label>Nome do Cliente</label>
                                <input 
                                    type="text" 
                                    placeholder="Ex: Maria Souza"
                                    value={novaEncomenda.clienteNome}
                                    onChange={(e) => setNovaEncomenda({...novaEncomenda, clienteNome: e.target.value})}
                                />
                            </div>
                            <div className={Styles.formRow}>
                                <div className={Styles.formGroup}>
                                    <label>ID do Produto</label>
                                    <input 
                                        type="number" 
                                        placeholder="ID do doce"
                                        value={novaEncomenda.produtoId}
                                        onChange={(e) => setNovaEncomenda({...novaEncomenda, produtoId: e.target.value})}
                                    />
                                </div>
                                <div className={Styles.formGroup}>
                                    <label>Valor (R$)</label>
                                    <input 
                                        type="number" 
                                        placeholder="0.00"
                                        value={novaEncomenda.valor}
                                        onChange={(e) => setNovaEncomenda({...novaEncomenda, valor: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className={Styles.formRow}>
                                <div className={Styles.formGroup}>
                                    <label>Data da Entrega</label>
                                    <input 
                                        type="date"
                                        value={novaEncomenda.data}
                                        onChange={(e) => setNovaEncomenda({...novaEncomenda, data: e.target.value})}
                                    />
                                </div>
                                <div className={Styles.formGroup}>
                                    <label>Horário</label>
                                    <input 
                                        type="time"
                                        value={novaEncomenda.horario}
                                        onChange={(e) => setNovaEncomenda({...novaEncomenda, horario: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>
                        
                        <div className={Styles.modalActions}>
                            <button className={Styles.cancelBtn} onClick={() => setShowNovaEncomenda(false)}>Cancelar</button>
                            <button className={Styles.confirmBtn} onClick={handleNovaEncomenda}>Agendar Encomenda</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AgendamentosModerno;