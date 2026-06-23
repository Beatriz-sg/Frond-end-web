import React, { useState } from 'react';
import { IoSearchOutline, IoPersonOutline, IoRestaurant, IoReceipt, IoCheckmarkOutline, IoCloseOutline, IoTimeOutline, IoAlertCircleOutline } from 'react-icons/io5';
import Styles from './AdminPanel.module.css';

const AdminSupport = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState(null);

  const supportTickets = [
    {
      id: '#SUP001',
      user: 'Maria Silva',
      userType: 'cliente',
      issue: 'Pedido não entregue',
      description: 'Meu pedido #1234 não foi entregue e já passou do prazo.',
      status: 'aberto',
      priority: 'high',
      createdAt: '2024-03-20T14:30:00',
      assignedTo: null,
      relatedOrder: '#1234'
    },
    {
      id: '#SUP002',
      user: 'João Doces',
      userType: 'confeiteiro',
      issue: 'Problema no dashboard',
      description: 'Não consigo acessar a seção de pedidos no meu dashboard.',
      status: 'em_andamento',
      priority: 'medium',
      createdAt: '2024-03-20T13:15:00',
      assignedTo: 'Admin',
      relatedOrder: null
    },
    {
      id: '#SUP003',
      user: 'Ana Costa',
      userType: 'cliente',
      issue: 'Cobrança incorreta',
      description: 'Fui cobrada duas vezes pelo mesmo pedido.',
      status: 'resolvido',
      priority: 'high',
      createdAt: '2024-03-20T10:45:00',
      assignedTo: 'Admin',
      relatedOrder: '#1235'
    }
  ];

  const filteredTickets = supportTickets.filter(ticket => {
    const matchesSearch = ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.issue.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || ticket.status === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleTicketAction = (ticketId, action) => {
    console.log(`Ação ${action} para ticket ${ticketId}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'aberto': return 'suspenso';
      case 'em_andamento': return 'pendente';
      case 'resolvido': return 'ativo';
      default: return 'pendente';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'aberto': return 'Aberto';
      case 'em_andamento': return 'Em Andamento';
      case 'resolvido': return 'Resolvido';
      default: return status;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#f44336';
      case 'medium': return '#FF9800';
      case 'low': return '#4CAF50';
      default: return '#666';
    }
  };

  return (
    <div className={Styles.adminPanel}>
      <div className={Styles.panelHeader}>
        <div className={Styles.searchContainer}>
          <IoSearchOutline className={Styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar tickets de suporte..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={Styles.searchInput}
          />
        </div>
        
        <div className={Styles.filterContainer}>
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            className={Styles.filterSelect}
          >
            <option value="all">Todos os tickets</option>
            <option value="aberto">Abertos</option>
            <option value="em_andamento">Em Andamento</option>
            <option value="resolvido">Resolvidos</option>
          </select>
        </div>
      </div>

      <div className={Styles.tableContainer}>
        <table className={Styles.dataTable}>
          <thead>
            <tr>
              <th>Ticket</th>
              <th>Usuário</th>
              <th>Problema</th>
              <th>Prioridade</th>
              <th>Status</th>
              <th>Criado em</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map(ticket => (
              <tr key={ticket.id}>
                <td>
                  <div className={Styles.userInfo}>
                    <div className={Styles.userAvatar}>
                      <IoAlertCircleOutline size={16} />
                    </div>
                    <div>
                      <div className={Styles.userName}>{ticket.id}</div>
                      {ticket.relatedOrder && (
                        <div className={Styles.userEmail}>Pedido: {ticket.relatedOrder}</div>
                      )}
                    </div>
                  </div>
                </td>
                <td>
                  <div>
                    <div>{ticket.user}</div>
                    <small style={{ color: '#666' }}>
                      {ticket.userType === 'cliente' ? 'Cliente' : 'Confeiteiro'}
                    </small>
                  </div>
                </td>
                <td>{ticket.issue}</td>
                <td>
                  <span style={{ 
                    color: getPriorityColor(ticket.priority),
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    fontSize: '0.8rem'
                  }}>
                    {ticket.priority === 'high' ? 'Alta' : 
                     ticket.priority === 'medium' ? 'Média' : 'Baixa'}
                  </span>
                </td>
                <td>
                  <span className={`${Styles.status} ${Styles[getStatusColor(ticket.status)]}`}>
                    {getStatusText(ticket.status)}
                  </span>
                </td>
                <td>{new Date(ticket.createdAt).toLocaleString('pt-BR')}</td>
                <td>
                  <div className={Styles.actionButtons}>
                    <button 
                      className={Styles.actionBtn}
                      onClick={() => setSelectedTicket(ticket)}
                      title="Ver detalhes"
                    >
                      <IoSearchOutline size={16} />
                    </button>
                    {ticket.status === 'aberto' && (
                      <button 
                        className={`${Styles.actionBtn} ${Styles.activate}`}
                        onClick={() => handleTicketAction(ticket.id, 'assign')}
                        title="Assumir ticket"
                      >
                        <IoPersonOutline size={16} />
                      </button>
                    )}
                    {ticket.status !== 'resolvido' && (
                      <button 
                        className={`${Styles.actionBtn} ${Styles.activate}`}
                        onClick={() => handleTicketAction(ticket.id, 'resolve')}
                        title="Resolver"
                      >
                        <IoCheckmarkOutline size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedTicket && (
        <div className={Styles.modal} onClick={() => setSelectedTicket(null)}>
          <div className={Styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3>Detalhes do Ticket {selectedTicket.id}</h3>
            <div className={Styles.userDetails}>
              <p><strong>Usuário:</strong> {selectedTicket.user} ({selectedTicket.userType})</p>
              <p><strong>Problema:</strong> {selectedTicket.issue}</p>
              <p><strong>Descrição:</strong> {selectedTicket.description}</p>
              <p><strong>Prioridade:</strong> 
                <span style={{ color: getPriorityColor(selectedTicket.priority), fontWeight: '600', marginLeft: '0.5rem' }}>
                  {selectedTicket.priority === 'high' ? 'Alta' : 
                   selectedTicket.priority === 'medium' ? 'Média' : 'Baixa'}
                </span>
              </p>
              <p><strong>Status:</strong> {getStatusText(selectedTicket.status)}</p>
              <p><strong>Criado em:</strong> {new Date(selectedTicket.createdAt).toLocaleString('pt-BR')}</p>
              {selectedTicket.assignedTo && (
                <p><strong>Responsável:</strong> {selectedTicket.assignedTo}</p>
              )}
              {selectedTicket.relatedOrder && (
                <p><strong>Pedido Relacionado:</strong> {selectedTicket.relatedOrder}</p>
              )}
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              {selectedTicket.status !== 'resolvido' && (
                <button 
                  className={Styles.closeBtn}
                  style={{ background: 'linear-gradient(135deg, #4CAF50, #45a049)' }}
                  onClick={() => {
                    handleTicketAction(selectedTicket.id, 'resolve');
                    setSelectedTicket(null);
                  }}
                >
                  Resolver Ticket
                </button>
              )}
              <button 
                className={Styles.closeBtn}
                onClick={() => setSelectedTicket(null)}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSupport;