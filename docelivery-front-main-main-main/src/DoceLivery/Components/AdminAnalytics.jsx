import React, { useState } from 'react';
import { IoTrendingUp, IoPersonOutline, IoRestaurant, IoReceipt, IoTimeOutline, IoStarOutline, IoAlertCircleOutline, IoCheckmarkCircleOutline } from 'react-icons/io5';
import Styles from './AdminAnalytics.module.css';

const AdminAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('today');

  const customerSatisfaction = {
    overall: 4.7,
    responseTime: '2.3 min',
    resolutionRate: '94%',
    totalReviews: 1247
  };

  const supportMetrics = {
    activeTickets: 12,
    resolvedToday: 45,
    avgResolutionTime: '15 min',
    customerSatisfaction: 4.8,
    firstContactResolution: '87%'
  };

  const commonIssues = [
    { issue: 'Pedido não entregue', count: 23, trend: 'up', severity: 'high' },
    { issue: 'Problema no pagamento', count: 18, trend: 'down', severity: 'medium' },
    { issue: 'Dúvidas sobre cardápio', count: 15, trend: 'stable', severity: 'low' },
    { issue: 'Alteração de pedido', count: 12, trend: 'up', severity: 'medium' },
    { issue: 'Problema técnico', count: 8, trend: 'down', severity: 'high' }
  ];

  const performanceData = {
    responseTime: [
      { hour: '08:00', time: 1.2 },
      { hour: '10:00', time: 2.1 },
      { hour: '12:00', time: 3.5 },
      { hour: '14:00', time: 2.8 },
      { hour: '16:00', time: 1.9 },
      { hour: '18:00', time: 2.3 },
      { hour: '20:00', time: 1.7 }
    ]
  };

  const agentPerformance = [
    { name: 'Admin Principal', tickets: 28, satisfaction: 4.9, avgTime: '12 min' },
    { name: 'Suporte 1', tickets: 22, satisfaction: 4.7, avgTime: '15 min' },
    { name: 'Suporte 2', tickets: 19, satisfaction: 4.6, avgTime: '18 min' }
  ];

  return (
    <div className={Styles.analyticsContainer}>
      <div className={Styles.analyticsHeader}>
        <h2>Analytics de Atendimento</h2>
        <select 
          value={selectedPeriod} 
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className={Styles.periodSelect}
        >
          <option value="today">Hoje</option>
          <option value="week">Esta semana</option>
          <option value="month">Este mês</option>
        </select>
      </div>

      {/* Métricas Principais */}
      <div className={Styles.metricsGrid}>
        <div className={Styles.metricCard}>
          <div className={Styles.metricIcon} style={{ background: 'linear-gradient(135deg, #4CAF50, #45a049)' }}>
            <IoCheckmarkCircleOutline size={24} />
          </div>
          <div className={Styles.metricContent}>
            <h3>{supportMetrics.resolvedToday}</h3>
            <p>Tickets Resolvidos Hoje</p>
            <span className={Styles.metricChange}>+12% vs ontem</span>
          </div>
        </div>

        <div className={Styles.metricCard}>
          <div className={Styles.metricIcon} style={{ background: 'linear-gradient(135deg, #FF9800, #F57C00)' }}>
            <IoTimeOutline size={24} />
          </div>
          <div className={Styles.metricContent}>
            <h3>{supportMetrics.avgResolutionTime}</h3>
            <p>Tempo Médio de Resolução</p>
            <span className={Styles.metricChange}>-8% vs ontem</span>
          </div>
        </div>

        <div className={Styles.metricCard}>
          <div className={Styles.metricIcon} style={{ background: 'linear-gradient(135deg, #2196F3, #1976D2)' }}>
            <IoStarOutline size={24} />
          </div>
          <div className={Styles.metricContent}>
            <h3>{supportMetrics.customerSatisfaction}</h3>
            <p>Satisfação do Cliente</p>
            <span className={Styles.metricChange}>+0.2 vs ontem</span>
          </div>
        </div>

        <div className={Styles.metricCard}>
          <div className={Styles.metricIcon} style={{ background: 'linear-gradient(135deg, #9C27B0, #7B1FA2)' }}>
            <IoAlertCircleOutline size={24} />
          </div>
          <div className={Styles.metricContent}>
            <h3>{supportMetrics.activeTickets}</h3>
            <p>Tickets Ativos</p>
            <span className={Styles.metricChange}>-3 vs ontem</span>
          </div>
        </div>
      </div>

      {/* Problemas Mais Comuns */}
      <div className={Styles.issuesSection}>
        <h3>Problemas Mais Comuns</h3>
        <div className={Styles.issuesList}>
          {commonIssues.map((issue, index) => (
            <div key={index} className={Styles.issueItem}>
              <div className={Styles.issueInfo}>
                <div className={Styles.issueName}>{issue.issue}</div>
                <div className={Styles.issueCount}>{issue.count} ocorrências</div>
              </div>
              <div className={Styles.issueMetrics}>
                <span className={`${Styles.severity} ${Styles[issue.severity]}`}>
                  {issue.severity === 'high' ? 'Alta' : issue.severity === 'medium' ? 'Média' : 'Baixa'}
                </span>
                <span className={`${Styles.trend} ${Styles[issue.trend]}`}>
                  {issue.trend === 'up' ? '↗' : issue.trend === 'down' ? '↘' : '→'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance dos Agentes */}
      <div className={Styles.agentSection}>
        <h3>Performance da Equipe</h3>
        <div className={Styles.agentGrid}>
          {agentPerformance.map((agent, index) => (
            <div key={index} className={Styles.agentCard}>
              <div className={Styles.agentAvatar}>
                <IoPersonOutline size={24} />
              </div>
              <div className={Styles.agentInfo}>
                <h4>{agent.name}</h4>
                <div className={Styles.agentStats}>
                  <div className={Styles.agentStat}>
                    <span className={Styles.statValue}>{agent.tickets}</span>
                    <span className={Styles.statLabel}>Tickets</span>
                  </div>
                  <div className={Styles.agentStat}>
                    <span className={Styles.statValue}>{agent.satisfaction}</span>
                    <span className={Styles.statLabel}>Satisfação</span>
                  </div>
                  <div className={Styles.agentStat}>
                    <span className={Styles.statValue}>{agent.avgTime}</span>
                    <span className={Styles.statLabel}>Tempo Médio</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gráfico de Tempo de Resposta */}
      <div className={Styles.chartSection}>
        <h3>Tempo de Resposta por Horário</h3>
        <div className={Styles.chartContainer}>
          {performanceData.responseTime.map((data, index) => (
            <div key={index} className={Styles.chartBar}>
              <div 
                className={Styles.bar}
                style={{ height: `${(data.time / 4) * 100}%` }}
              ></div>
              <span className={Styles.barLabel}>{data.hour}</span>
              <span className={Styles.barValue}>{data.time}min</span>
            </div>
          ))}
        </div>
      </div>

      {/* Resumo de Satisfação */}
      <div className={Styles.satisfactionSummary}>
        <h3>Resumo de Satisfação do Cliente</h3>
        <div className={Styles.satisfactionGrid}>
          <div className={Styles.satisfactionItem}>
            <div className={Styles.satisfactionScore}>{customerSatisfaction.overall}</div>
            <div className={Styles.satisfactionLabel}>Avaliação Geral</div>
            <div className={Styles.satisfactionStars}>
              {'★'.repeat(Math.floor(customerSatisfaction.overall))}
            </div>
          </div>
          <div className={Styles.satisfactionItem}>
            <div className={Styles.satisfactionScore}>{customerSatisfaction.responseTime}</div>
            <div className={Styles.satisfactionLabel}>Tempo de Resposta</div>
          </div>
          <div className={Styles.satisfactionItem}>
            <div className={Styles.satisfactionScore}>{customerSatisfaction.resolutionRate}</div>
            <div className={Styles.satisfactionLabel}>Taxa de Resolução</div>
          </div>
          <div className={Styles.satisfactionItem}>
            <div className={Styles.satisfactionScore}>{customerSatisfaction.totalReviews}</div>
            <div className={Styles.satisfactionLabel}>Total de Avaliações</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;