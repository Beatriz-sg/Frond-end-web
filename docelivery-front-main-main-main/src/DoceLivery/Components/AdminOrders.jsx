import React, { useState } from 'react';
import { IoSearchOutline, IoReceipt, IoEyeOutline } from 'react-icons/io5';
import Styles from './AdminPanel.module.css';

const AdminOrders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const mockOrders = [
    {
      id: '#1234',
      customer: 'Maria Silva',
      store: 'Doces da Vovó',
      status: 'entregue',
      total: 45.90,
      date: '2024-03-20T14:30:00',
      items: [
        { name: 'Brigadeiro Gourmet', quantity: 12, price: 2.50 },
        { name: 'Beijinho', quantity: 6, price: 2.00 }
      ]
    },
    {
      id: '#1235',
      customer: 'João Santos',
      store: 'Confeitaria Delícia',
      status: 'preparando',
      total: 78.50,
      date: '2024-03-20T15:45:00',
      items: [
        { name: 'Torta de Chocolate', quantity: 1, price: 78.50 }
      ]
    },
    {
      id: '#1236',
      customer: 'Ana Costa',
      store: 'Doces & Cia',
      status: 'cancelado',
      total: 32.00,
      date: '2024-03-20T16:20:00',
      items: [
        { name: 'Cupcake', quantity: 8, price: 4.00 }
      ]
    }
  ];

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.store.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'entregue': return 'ativo';
      case 'preparando': return 'pendente';
      case 'cancelado': return 'suspenso';
      default: return 'pendente';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'entregue': return 'Entregue';
      case 'preparando': return 'Preparando';
      case 'cancelado': return 'Cancelado';
      default: return status;
    }
  };

  return (
    <div className={Styles.adminPanel}>
      <div className={Styles.panelHeader}>
        <div className={Styles.searchContainer}>
          <IoSearchOutline className={Styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar pedidos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={Styles.searchInput}
          />
        </div>
        
        <div className={Styles.filterContainer}>
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className={Styles.filterSelect}
          >
            <option value="all">Todos os pedidos</option>
            <option value="preparando">Preparando</option>
            <option value="entregue">Entregues</option>
            <option value="cancelado">Cancelados</option>
          </select>
        </div>
      </div>

      <div className={Styles.tableContainer}>
        <table className={Styles.dataTable}>
          <thead>
            <tr>
              <th>Pedido</th>
              <th>Cliente</th>
              <th>Loja</th>
              <th>Status</th>
              <th>Total</th>
              <th>Data/Hora</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.id}>
                <td>
                  <div className={Styles.userInfo}>
                    <div className={Styles.userAvatar}>
                      <IoReceipt size={16} />
                    </div>
                    <div>
                      <div className={Styles.userName}>{order.id}</div>
                    </div>
                  </div>
                </td>
                <td>{order.customer}</td>
                <td>{order.store}</td>
                <td>
                  <span className={`${Styles.status} ${Styles[getStatusColor(order.status)]}`}>
                    {getStatusText(order.status)}
                  </span>
                </td>
                <td>R$ {(order.total ?? 0).toFixed(2)}</td>
                <td>{new Date(order.date).toLocaleString('pt-BR')}</td>
                <td>
                  <div className={Styles.actionButtons}>
                    <button 
                      className={Styles.actionBtn}
                      onClick={() => setSelectedOrder(order)}
                      title="Ver detalhes"
                    >
                      <IoEyeOutline size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div className={Styles.modal} onClick={() => setSelectedOrder(null)}>
          <div className={Styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3>Detalhes do Pedido {selectedOrder.id}</h3>
            <div className={Styles.userDetails}>
              <p><strong>Cliente:</strong> {selectedOrder.customer}</p>
              <p><strong>Loja:</strong> {selectedOrder.store}</p>
              <p><strong>Status:</strong> {getStatusText(selectedOrder.status)}</p>
              <p><strong>Data/Hora:</strong> {new Date(selectedOrder.date).toLocaleString('pt-BR')}</p>
              <p><strong>Total:</strong> R$ {(selectedOrder.total ?? 0).toFixed(2)}</p>
              
              <h4 style={{ color: '#8a2be2', marginTop: '1.5rem', marginBottom: '1rem' }}>Itens do Pedido:</h4>
              {selectedOrder.items.map((item, index) => (
                <div key={index} style={{ 
                  background: 'rgba(138, 43, 226, 0.05)', 
                  padding: '0.75rem', 
                  borderRadius: '8px', 
                  marginBottom: '0.5rem' 
                }}>
                  <p style={{ margin: '0.25rem 0' }}>
                    <strong>{item.name}</strong>
                  </p>
                  <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#666' }}>
                    Quantidade: {item.quantity} | Preço unitário: R$ {(item.price ?? 0).toFixed(2)}
                  </p>
                  <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', fontWeight: '600' }}>
                    Subtotal: R$ {((item.quantity ?? 0) * (item.price ?? 0)).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            <button 
              className={Styles.closeBtn}
              onClick={() => setSelectedOrder(null)}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;