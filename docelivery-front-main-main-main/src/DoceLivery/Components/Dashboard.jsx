// Dashboard.js


import React from 'react';

// Dados simulados para o Dashboard
const dadosFicticios = {
  vendasMensais: 4520.50,
  pedidosMes: 85,
  rendimentoMedio: 53.18,
  pedidosPendentes: 5,
};

const Dashboard = () => {
  const { vendasMensais, pedidosMes, rendimentoMedio, pedidosPendentes } = dadosFicticios;
  
  const cardStyle = {
    padding: '20px',
    margin: '10px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    backgroundColor: '#FFFAFA', // Cor mais suave
    flexBasis: '22%',
    textAlign: 'center'
  };

  return (
    <div>
      <h1 style={{ color: '#8A2BE2' }}>Bem-vindo ao Painel DoceLivery!</h1>
      <p>Aqui você acompanha suas vendas e rendimento.</p>

      <h2 style={{ borderBottom: '2px solid #EEE', paddingBottom: '10px', marginTop: '30px' }}>Resumo Rápido</h2>
      
      {/* Cards de Resumo */}
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        
        <div style={{ ...cardStyle, backgroundColor: '#E6E6FA' }}>
          <h3>Rendimento do Mês</h3>
          <p style={{ fontSize: '1.8em', fontWeight: 'bold', color: '#8A2BE2' }}>R$ {vendasMensais.toFixed(2)}</p>
        </div>

        <div style={cardStyle}>
          <h3>Total de Pedidos</h3>
          <p style={{ fontSize: '1.8em', fontWeight: 'bold' }}>{pedidosMes}</p>
        </div>

        <div style={cardStyle}>
          <h3>Rendimento Médio</h3>
          <p style={{ fontSize: '1.8em', fontWeight: 'bold' }}>R$ {rendimentoMedio.toFixed(2)}</p>
        </div>

        <div style={{ ...cardStyle, backgroundColor: '#FADADD', color: '#D2691E' }}> 
          <h3>Pendentes</h3>
          <p style={{ fontSize: '1.8em', fontWeight: 'bold' }}>{pedidosPendentes}</p>
        </div>
      </div>
      
      <h2 style={{ borderBottom: '2px solid #EEE', paddingBottom: '10px', marginTop: '30px' }}>Análise de Vendas</h2>
      <div style={{ minHeight: '200px', border: '1px dashed #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Aqui seria a integração com bibliotecas de gráficos (Ex: Recharts, Chart.js) */}
        <p>📊 Gráfico de Linha: Vendas dos Últimos 7 Dias</p>
      </div>

    </div>
  );
};

export default Dashboard;