import React, { useState } from 'react';
import { IoSearchOutline, IoRestaurant, IoEyeOutline, IoCheckmarkOutline, IoBanOutline } from 'react-icons/io5';
import Styles from './AdminPanel.module.css';

const AdminStores = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedStore, setSelectedStore] = useState(null);

  const mockStores = [
    {
      id: 1,
      name: 'Doces da Vovó',
      owner: 'Maria Santos',
      email: 'maria@docesvovo.com',
      status: 'ativo',
      joinDate: '2024-01-20',
      products: 45,
      orders: 234,
      rating: 4.8,
      phone: '(11) 99999-9999'
    },
    {
      id: 2,
      name: 'Confeitaria Delícia',
      owner: 'João Silva',
      email: 'joao@delicia.com',
      status: 'pendente',
      joinDate: '2024-03-15',
      products: 12,
      orders: 0,
      rating: 0,
      phone: '(11) 88888-8888'
    },
    {
      id: 3,
      name: 'Doces & Cia',
      owner: 'Ana Costa',
      email: 'ana@docescia.com',
      status: 'suspenso',
      joinDate: '2024-02-10',
      products: 28,
      orders: 89,
      rating: 4.2,
      phone: '(11) 77777-7777'
    }
  ];

  const filteredStores = mockStores.filter(store => {
    const matchesSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         store.owner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || store.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleStoreAction = (storeId, action) => {
    console.log(`Ação ${action} para loja ${storeId}`);
  };

  return (
    <div className={Styles.adminPanel}>
      <div className={Styles.panelHeader}>
        <div className={Styles.searchContainer}>
          <IoSearchOutline className={Styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar lojas..."
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
            <option value="all">Todas as lojas</option>
            <option value="ativo">Ativas</option>
            <option value="pendente">Pendentes</option>
            <option value="suspenso">Suspensas</option>
          </select>
        </div>
      </div>

      <div className={Styles.tableContainer}>
        <table className={Styles.dataTable}>
          <thead>
            <tr>
              <th>Loja</th>
              <th>Proprietário</th>
              <th>Status</th>
              <th>Produtos</th>
              <th>Pedidos</th>
              <th>Avaliação</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredStores.map(store => (
              <tr key={store.id}>
                <td>
                  <div className={Styles.userInfo}>
                    <div className={Styles.userAvatar}>
                      <IoRestaurant size={16} />
                    </div>
                    <div>
                      <div className={Styles.userName}>{store.name}</div>
                      <div className={Styles.userEmail}>{store.email}</div>
                    </div>
                  </div>
                </td>
                <td>{store.owner}</td>
                <td>
                  <span className={`${Styles.status} ${Styles[store.status]}`}>
                    {store.status === 'ativo' ? 'Ativa' : 
                     store.status === 'pendente' ? 'Pendente' : 'Suspensa'}
                  </span>
                </td>
                <td>{store.products}</td>
                <td>{store.orders}</td>
                <td>{store.rating > 0 ? `${store.rating} ⭐` : 'N/A'}</td>
                <td>
                  <div className={Styles.actionButtons}>
                    <button 
                      className={Styles.actionBtn}
                      onClick={() => setSelectedStore(store)}
                      title="Ver detalhes"
                    >
                      <IoEyeOutline size={16} />
                    </button>
                    {store.status === 'pendente' && (
                      <button 
                        className={`${Styles.actionBtn} ${Styles.activate}`}
                        onClick={() => handleStoreAction(store.id, 'approve')}
                        title="Aprovar"
                      >
                        <IoCheckmarkOutline size={16} />
                      </button>
                    )}
                    {store.status === 'ativo' && (
                      <button 
                        className={`${Styles.actionBtn} ${Styles.suspend}`}
                        onClick={() => handleStoreAction(store.id, 'suspend')}
                        title="Suspender"
                      >
                        <IoBanOutline size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedStore && (
        <div className={Styles.modal} onClick={() => setSelectedStore(null)}>
          <div className={Styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3>Detalhes da Loja</h3>
            <div className={Styles.userDetails}>
              <p><strong>Nome:</strong> {selectedStore.name}</p>
              <p><strong>Proprietário:</strong> {selectedStore.owner}</p>
              <p><strong>Email:</strong> {selectedStore.email}</p>
              <p><strong>Telefone:</strong> {selectedStore.phone}</p>
              <p><strong>Status:</strong> {selectedStore.status}</p>
              <p><strong>Data de Cadastro:</strong> {new Date(selectedStore.joinDate).toLocaleDateString('pt-BR')}</p>
              <p><strong>Total de Produtos:</strong> {selectedStore.products}</p>
              <p><strong>Total de Pedidos:</strong> {selectedStore.orders}</p>
              <p><strong>Avaliação:</strong> {selectedStore.rating > 0 ? `${selectedStore.rating} ⭐` : 'Sem avaliações'}</p>
            </div>
            <button 
              className={Styles.closeBtn}
              onClick={() => setSelectedStore(null)}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStores;