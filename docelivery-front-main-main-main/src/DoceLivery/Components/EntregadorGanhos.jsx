import React, { useState } from 'react';
import { IoWalletOutline, IoTrendingUpOutline, IoCalendarOutline, IoStatsChartOutline } from 'react-icons/io5';
import Styles from './EntregadorGanhos.module.css';

const EntregadorGanhos = ({ showRelatorios = false }) => {
  const [periodoSelecionado, setPeriodoSelecionado] = useState('hoje');
  
  const ganhos = {
    hoje: { valor: 85.50, entregas: 12, media: 7.13 },
    semana: { valor: 567.30, entregas: 78, media: 7.27 },
    mes: { valor: 2340.80, entregas: 312, media: 7.50 }
  };

  const historico = [
    { data: '14/01/2024', entregas: 12, valor: 85.50, tempo: '4h 32min' },
    { data: '13/01/2024', entregas: 15, valor: 102.30, tempo: '5h 15min' },
    { data: '12/01/2024', entregas: 8, valor: 67.20, tempo: '3h 45min' },
    { data: '11/01/2024', entregas: 14, valor: 95.80, tempo: '4h 50min' },
    { data: '10/01/2024', entregas: 11, valor: 78.90, tempo: '4h 10min' }
  ];

  const dadosAtual = ganhos[periodoSelecionado];

  return (
    <div className={Styles.ganhosContainer}>
      
      {/* Header */}
      <div className={Styles.ganhosHeader}>
        <h2>{showRelatorios ? '📊 Relatórios e Estatísticas' : '💰 Controle de Ganhos'}</h2>
        <div className={Styles.periodoSelector}>
          <button 
            className={periodoSelecionado === 'hoje' ? Styles.active : ''}
            onClick={() => setPeriodoSelecionado('hoje')}
          >
            Hoje
          </button>
          <button 
            className={periodoSelecionado === 'semana' ? Styles.active : ''}
            onClick={() => setPeriodoSelecionado('semana')}
          >
            Semana
          </button>
          <button 
            className={periodoSelecionado === 'mes' ? Styles.active : ''}
            onClick={() => setPeriodoSelecionado('mes')}
          >
            Mês
          </button>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className={Styles.resumoCards}>
        <div className={Styles.resumoCard}>
          <div className={Styles.cardIcon}>
            <IoWalletOutline size={24} color="#10b981" />
          </div>
          <div className={Styles.cardContent}>
            <h3>R$ {dadosAtual.valor.toFixed(2)}</h3>
            <p>Total de Ganhos</p>
            <small>+12% vs período anterior</small>
          </div>
        </div>
        
        <div className={Styles.resumoCard}>
          <div className={Styles.cardIcon}>
            <IoStatsChartOutline size={24} color="#3b82f6" />
          </div>
          <div className={Styles.cardContent}>
            <h3>{dadosAtual.entregas}</h3>
            <p>Entregas Realizadas</p>
            <small>Meta: {Math.ceil(dadosAtual.entregas * 1.2)}</small>
          </div>
        </div>
        
        <div className={Styles.resumoCard}>
          <div className={Styles.cardIcon}>
            <IoTrendingUpOutline size={24} color="#8b5cf6" />
          </div>
          <div className={Styles.cardContent}>
            <h3>R$ {dadosAtual.media.toFixed(2)}</h3>
            <p>Média por Entrega</p>
            <small>Acima da média geral</small>
          </div>
        </div>
      </div>

      {/* Gráfico Simulado */}
      <div className={Styles.graficoCard}>
        <h3>📈 Evolução dos Ganhos</h3>
        <div className={Styles.graficoSimulado}>
          <div className={Styles.barras}>
            <div className={Styles.barra} style={{ height: '60%' }}>
              <span>Seg</span>
            </div>
            <div className={Styles.barra} style={{ height: '80%' }}>
              <span>Ter</span>
            </div>
            <div className={Styles.barra} style={{ height: '45%' }}>
              <span>Qua</span>
            </div>
            <div className={Styles.barra} style={{ height: '90%' }}>
              <span>Qui</span>
            </div>
            <div className={Styles.barra} style={{ height: '75%' }}>
              <span>Sex</span>
            </div>
            <div className={Styles.barra} style={{ height: '95%' }}>
              <span>Sáb</span>
            </div>
            <div className={Styles.barra} style={{ height: '70%' }}>
              <span>Dom</span>
            </div>
          </div>
        </div>
      </div>

      {/* Histórico */}
      <div className={Styles.historicoCard}>
        <h3>📋 Histórico Detalhado</h3>
        <div className={Styles.historicoTable}>
          <div className={Styles.tableHeader}>
            <span>Data</span>
            <span>Entregas</span>
            <span>Ganhos</span>
            <span>Tempo</span>
          </div>
          {historico.map((item, index) => (
            <div key={index} className={Styles.tableRow}>
              <span>{item.data}</span>
              <span>{item.entregas}</span>
              <span>R$ {item.valor.toFixed(2)}</span>
              <span>{item.tempo}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Metas e Conquistas */}
      <div className={Styles.metasCard}>
        <h3>🎯 Metas e Conquistas</h3>
        <div className={Styles.metasGrid}>
          <div className={Styles.metaItem}>
            <div className={Styles.metaProgress}>
              <div className={Styles.progressBar} style={{ width: '80%' }}></div>
            </div>
            <div className={Styles.metaInfo}>
              <strong>Meta Diária</strong>
              <span>12/15 entregas</span>
            </div>
          </div>
          
          <div className={Styles.metaItem}>
            <div className={Styles.metaProgress}>
              <div className={Styles.progressBar} style={{ width: '65%' }}></div>
            </div>
            <div className={Styles.metaInfo}>
              <strong>Meta Semanal</strong>
              <span>R$ 567/R$ 800</span>
            </div>
          </div>
          
          <div className={Styles.metaItem}>
            <div className={Styles.metaProgress}>
              <div className={Styles.progressBar} style={{ width: '90%' }}></div>
            </div>
            <div className={Styles.metaInfo}>
              <strong>Avaliação</strong>
              <span>4.8/5.0 ⭐</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dicas Financeiras */}
      <div className={Styles.dicasFinanceiras}>
        <h4>💡 Dicas para Aumentar os Ganhos</h4>
        <ul>
          <li>🕐 Trabalhe nos horários de pico (12h-14h e 19h-21h)</li>
          <li>📍 Fique em áreas com alta demanda</li>
          <li>⭐ Mantenha uma boa avaliação para receber mais pedidos</li>
          <li>🚀 Complete as metas diárias para ganhar bônus</li>
        </ul>
      </div>
    </div>
  );
};

export default EntregadorGanhos;