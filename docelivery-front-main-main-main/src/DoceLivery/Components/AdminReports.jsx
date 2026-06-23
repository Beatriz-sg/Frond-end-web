import React, { useState } from 'react';
import { IoTrendingUp, IoPersonOutline, IoRestaurant, IoReceipt, IoStatsChart } from 'react-icons/io5';
import Styles from './AdminPanel.module.css';

const AdminReports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const reportData = {
    revenue: {
      total: 125678.90,
      growth: 15.3,
      period: 'Este mês'
    },
    orders: {
      total: 1456,
      growth: 8.7,
      period: 'Este mês'
    },
    users: {
      total: 2341,
      growth: 12.1,
      period: 'Este mês'
    },
    stores: {
      total: 89,
      growth: 5.2,
      period: 'Este mês'
    }
  };

  const topStores = [
    { name: 'Doces da Vovó', revenue: 15678.90, orders: 234 },
    { name: 'Confeitaria Delícia', revenue: 12456.50, orders: 189 },
    { name: 'Doces & Cia', revenue: 9876.30, orders: 156 },
    { name: 'Brigaderia Premium', revenue: 8765.20, orders: 134 },
    { name: 'Tortas da Casa', revenue: 7654.10, orders: 112 }
  ];

  const topProducts = [
    { name: 'Brigadeiro Gourmet', sales: 1234, revenue: 3702.00 },
    { name: 'Torta de Chocolate', sales: 567, revenue: 28350.00 },
    { name: 'Beijinho', sales: 890, revenue: 1780.00 },
    { name: 'Cupcake Decorado', sales: 456, revenue: 2280.00 },
    { name: 'Bolo de Pote', sales: 678, revenue: 3390.00 }
  ];

  return (
    <div className={Styles.adminPanel}>
      <div className={Styles.panelHeader}>
        <h2 style={{ color: '#8a2be2', margin: 0 }}>Relatórios e Análises</h2>
        <div className={Styles.filterContainer}>
          <select 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className={Styles.filterSelect}
          >
            <option value="week">Esta semana</option>
            <option value="month">Este mês</option>
            <option value="quarter">Este trimestre</option>
            <option value="year">Este ano</option>
          </select>
        </div>
      </div>

      {/* Métricas Principais */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '1.5rem', 
        marginBottom: '2rem' 
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #ff69b4 0%, #8a2be2 100%)',
          color: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <IoTrendingUp size={24} />
            <h3 style={{ margin: 0 }}>Receita Total</h3>
          </div>
          <p style={{ fontSize: '2rem', fontWeight: '700', margin: '0.5rem 0' }}>
            R$ {reportData.revenue.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p style={{ margin: 0, opacity: 0.9 }}>
            +{reportData.revenue.growth}% vs período anterior
          </p>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
          color: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <IoReceipt size={24} />
            <h3 style={{ margin: 0 }}>Pedidos</h3>
          </div>
          <p style={{ fontSize: '2rem', fontWeight: '700', margin: '0.5rem 0' }}>
            {reportData.orders.total.toLocaleString('pt-BR')}
          </p>
          <p style={{ margin: 0, opacity: 0.9 }}>
            +{reportData.orders.growth}% vs período anterior
          </p>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
          color: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <IoPersonOutline size={24} />
            <h3 style={{ margin: 0 }}>Usuários</h3>
          </div>
          <p style={{ fontSize: '2rem', fontWeight: '700', margin: '0.5rem 0' }}>
            {reportData.users.total.toLocaleString('pt-BR')}
          </p>
          <p style={{ margin: 0, opacity: 0.9 }}>
            +{reportData.users.growth}% vs período anterior
          </p>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
          color: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <IoRestaurant size={24} />
            <h3 style={{ margin: 0 }}>Lojas Ativas</h3>
          </div>
          <p style={{ fontSize: '2rem', fontWeight: '700', margin: '0.5rem 0' }}>
            {reportData.stores.total}
          </p>
          <p style={{ margin: 0, opacity: 0.9 }}>
            +{reportData.stores.growth}% vs período anterior
          </p>
        </div>
      </div>

      {/* Rankings */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Top Lojas */}
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ color: '#8a2be2', marginBottom: '1.5rem' }}>Top 5 Lojas</h3>
          {topStores.map((store, index) => (
            <div key={index} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.75rem 0',
              borderBottom: index < topStores.length - 1 ? '1px solid #f0f0f0' : 'none'
            }}>
              <div>
                <p style={{ margin: 0, fontWeight: '600', color: '#333' }}>
                  {index + 1}. {store.name}
                </p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#666' }}>
                  {store.orders} pedidos
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, fontWeight: '600', color: '#8a2be2' }}>
                  R$ {store.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Top Produtos */}
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ color: '#8a2be2', marginBottom: '1.5rem' }}>Top 5 Produtos</h3>
          {topProducts.map((product, index) => (
            <div key={index} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.75rem 0',
              borderBottom: index < topProducts.length - 1 ? '1px solid #f0f0f0' : 'none'
            }}>
              <div>
                <p style={{ margin: 0, fontWeight: '600', color: '#333' }}>
                  {index + 1}. {product.name}
                </p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#666' }}>
                  {product.sales} vendas
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, fontWeight: '600', color: '#8a2be2' }}>
                  R$ {product.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminReports;