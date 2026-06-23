import React, { useState } from 'react';
import { IoSearchOutline, IoPersonOutline, IoRestaurant, IoEyeOutline, IoBanOutline, IoCheckmarkOutline } from 'react-icons/io5';
import Styles from './AdminPanel.module.css';

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);

  const mockUsers = [
    {
      id: 1,
      name: 'Maria Silva',
      email: 'maria@email.com',
      type: 'cliente',
      status: 'ativo',
      joinDate: '2024-01-15',
      orders: 23,
      phone: '(11) 99999-9999'
    },
    {
      id: 2,
      name: 'João Doces',
      email: 'joao@docesjoao.com',
      type: 'confeiteiro',
      status: 'ativo',
      joinDate: '2024-02-10',
      orders: 156,
      phone: '(11) 88888-8888',
      storeName: 'Doces do João'
    },
    {
      id: 3,
      name: 'Ana Costa',
      email: 'ana@email.com',
      type: 'cliente',
      status: 'suspenso',
      joinDate: '2024-03-05',
      orders: 5,
      phone: '(11) 77777-7777'
    }
  ];

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || user.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleUserAction = (userId, action) => {
    console.log(`Ação ${action} para usuário ${userId}`);
    // Implementar ações reais aqui
  };

  return (
    <div className={Styles.adminPanel}>
      <div className={Styles.panelHeader}>
        <div className={Styles.searchContainer}>
          <IoSearchOutline className={Styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar usuários..."
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
            <option value="all">Todos os usuários</option>
            <option value="cliente">Clientes</option>
            <option value="confeiteiro">Confeiteiros</option>
          </select>
        </div>
      </div>

      <div className={Styles.tableContainer}>
        <table className={Styles.dataTable}>
          <thead>
            <tr>
              <th>Usuário</th>
              <th>Tipo</th>
              <th>Status</th>
              <th>Data de Cadastro</th>
              <th>Pedidos</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>
                  <div className={Styles.userInfo}>
                    <div className={Styles.userAvatar}>
                      {user.type === 'confeiteiro' ? 
                        <IoRestaurant size={16} /> : 
                        <IoPersonOutline size={16} />
                      }
                    </div>
                    <div>
                      <div className={Styles.userName}>{user.name}</div>
                      <div className={Styles.userEmail}>{user.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`${Styles.userType} ${Styles[user.type]}`}>
                    {user.type === 'cliente' ? 'Cliente' : 'Confeiteiro'}
                  </span>
                </td>
                <td>
                  <span className={`${Styles.status} ${Styles[user.status]}`}>
                    {user.status === 'ativo' ? 'Ativo' : 'Suspenso'}
                  </span>
                </td>
                <td>{new Date(user.joinDate).toLocaleDateString('pt-BR')}</td>
                <td>{user.orders}</td>
                <td>
                  <div className={Styles.actionButtons}>
                    <button 
                      className={Styles.actionBtn}
                      onClick={() => setSelectedUser(user)}
                      title="Ver detalhes"
                    >
                      <IoEyeOutline size={16} />
                    </button>
                    {user.status === 'ativo' ? (
                      <button 
                        className={`${Styles.actionBtn} ${Styles.suspend}`}
                        onClick={() => handleUserAction(user.id, 'suspend')}
                        title="Suspender"
                      >
                        <IoBanOutline size={16} />
                      </button>
                    ) : (
                      <button 
                        className={`${Styles.actionBtn} ${Styles.activate}`}
                        onClick={() => handleUserAction(user.id, 'activate')}
                        title="Ativar"
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

      {selectedUser && (
        <div className={Styles.modal} onClick={() => setSelectedUser(null)}>
          <div className={Styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3>Detalhes do Usuário</h3>
            <div className={Styles.userDetails}>
              <p><strong>Nome:</strong> {selectedUser.name}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Telefone:</strong> {selectedUser.phone}</p>
              <p><strong>Tipo:</strong> {selectedUser.type}</p>
              <p><strong>Status:</strong> {selectedUser.status}</p>
              <p><strong>Data de Cadastro:</strong> {new Date(selectedUser.joinDate).toLocaleDateString('pt-BR')}</p>
              <p><strong>Total de Pedidos:</strong> {selectedUser.orders}</p>
              {selectedUser.storeName && (
                <p><strong>Nome da Loja:</strong> {selectedUser.storeName}</p>
              )}
            </div>
            <button 
              className={Styles.closeBtn}
              onClick={() => setSelectedUser(null)}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;