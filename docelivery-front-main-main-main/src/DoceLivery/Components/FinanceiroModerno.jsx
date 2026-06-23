import React, { useState, useEffect } from 'react';
import { IoTrendingUp, IoTrendingDown, IoCard, IoStatsChart } from 'react-icons/io5';
// 🛠️ IMPORT AJUSTADO: Adicionado a extensão .jsx explícita para evitar problemas no ecossistema do Vite
import { useDashboard } from '../context/DashboardContext.jsx';
import SalesChart from './SalesChart';
import Styles from './FinanceiroModerno.module.css';

const FinanceiroModerno = () => {
    // Consome o contexto do dashboard
    const { dashboardData, getVendasSemanais, carregarDadosFinanceiros } = useDashboard();
    const [periodoSelecionado, setPeriodoSelecionado] = useState('mes');

    // Executa a carga com o ID do confeiteiro logado
    useEffect(() => {
        const idConfeiteiroLogado = 10005; // ID real mapeado nos logs do seu banco
        if (typeof carregarDadosFinanceiros === 'function') {
            carregarDadosFinanceiros(idConfeiteiroLogado);
        }
    }, [carregarDadosFinanceiros]);

    // ----------------------------------------------------------------
    // BLINDAGEM DE FALLBACKS (Garante valores seguros mesmo se a API falhar)
    // ----------------------------------------------------------------
    const dadosFinanceiros = {
        rendimentoMes: dashboardData?.financeiro?.vendasMes || 0,
        totalPedidos: dashboardData?.pedidos?.concluidos || dashboardData?.pedidos?.hoje || 0,
        ticketMedio: dashboardData?.financeiro?.ticketMedio || 0,
        pedidosPendentes: dashboardData?.pedidos?.pendentes || 0,
        vendasTotais: dashboardData?.financeiro?.vendasMes || 0,
        despesasTotais: dashboardData?.financeiro?.despesasTotais || 0,
        lucro: (dashboardData?.financeiro?.vendasMes || 0) - (dashboardData?.financeiro?.despesasTotais || 0),
        crescimentoMes: dashboardData?.financeiro?.crescimentoMes || 0
    };

    const dadosVendasMensais = dashboardData?.financeiro?.vendasMensais || [
        { month: 'Jan', total: 0 },
        { month: 'Fev', total: 0 },
        { month: 'Mar', total: 0 },
        { month: 'Abr', total: 0 },
        { month: 'Mai', total: 0 },
        { month: 'Jun', total: 0 }
    ];

    // Mapeia as propriedades exatas que a API de movimentações do Java entrega
    const transacoesRecentes = dashboardData?.pedidos?.recentes?.map(movimentacao => {
        const dataFormatada = movimentacao.dataLancamento 
            ? new Date(movimentacao.dataLancamento).toLocaleDateString('pt-BR')
            : new Date().toLocaleDateString('pt-BR');

        return {
            id: movimentacao.id,
            tipo: movimentacao.tipo?.toLowerCase() || 'receita',
            descricao: movimentacao.descricao || 'Movimentação sem descrição',
            valor: movimentacao.valor || 0,
            data: dataFormatada
        };
    }) || [];

    const vendasSemanaisSeguras = typeof getVendasSemanais === 'function' ? getVendasSemanais() : [];

    return (
        <div className={Styles.financeiroModerno}>
            <div className={Styles.header}>
                <div className={Styles.headerContent}>
                    <h1>Painel Financeiro</h1>
                    <p>Acompanhe suas vendas e rendimento em tempo real</p>
                </div>
                <div className={Styles.periodoSelector}>
                    <button 
                        className={`${Styles.periodoBtn} ${periodoSelecionado === 'semana' ? Styles.active : ''}`}
                        onClick={() => setPeriodoSelecionado('semana')}
                    >
                        Semana
                    </button>
                    <button 
                        className={`${Styles.periodoBtn} ${periodoSelecionado === 'mes' ? Styles.active : ''}`}
                        onClick={() => setPeriodoSelecionado('mes')}
                    >
                        Mês
                    </button>
                    <button 
                        className={`${Styles.periodoBtn} ${periodoSelecionado === 'ano' ? Styles.active : ''}`}
                        onClick={() => setPeriodoSelecionado('ano')}
                    >
                        Ano
                    </button>
                </div>
            </div>

            <div className={Styles.kpiGrid}>
                <div className={`${Styles.kpiCard} ${Styles.rendimento}`}>
                    <div className={Styles.kpiIcon}><IoTrendingUp size={24} /></div>
                    <div className={Styles.kpiContent}>
                        <h3>Rendimento do Mês</h3>
                        <span className={Styles.kpiValue}>R$ {dadosFinanceiros.rendimentoMes.toFixed(2)}</span>
                        <div className={Styles.kpiMeta}>
                            <span className={Styles.crescimento}>+{dadosFinanceiros.crescimentoMes}%</span>
                            <span>vs mês anterior</span>
                        </div>
                    </div>
                </div>

                <div className={`${Styles.kpiCard} ${Styles.pedidos}`}>
                    <div className={Styles.kpiIcon}><IoCard size={24} /></div>
                    <div className={Styles.kpiContent}>
                        <h3>Total de Pedidos</h3>
                        <span className={Styles.kpiValue}>{dadosFinanceiros.totalPedidos}</span>
                        <div className={Styles.kpiMeta}>
                            <span>{dadosFinanceiros.pedidosPendentes} pendentes</span>
                        </div>
                    </div>
                </div>

                <div className={`${Styles.kpiCard} ${Styles.ticket}`}>
                    <div className={Styles.kpiIcon}><IoStatsChart size={24} /></div>
                    <div className={Styles.kpiContent}>
                        <h3>Ticket Médio</h3>
                        <span className={Styles.kpiValue}>R$ {dadosFinanceiros.ticketMedio.toFixed(2)}</span>
                        <div className={Styles.kpiMeta}>
                            <span>por pedido</span>
                        </div>
                    </div>
                </div>

                <div className={`${Styles.kpiCard} ${Styles.lucro}`}>
                    <div className={Styles.kpiIcon}><IoTrendingUp size={24} /></div>
                    <div className={Styles.kpiContent}>
                        <h3>Lucro Líquido</h3>
                        <span className={Styles.kpiValue}>R$ {dadosFinanceiros.lucro.toFixed(2)}</span>
                        <div className={Styles.kpiMeta}>
                            <span>Margem Calculada</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className={Styles.chartsGrid}>
                <div className={Styles.chartCard}>
                    <div className={Styles.chartHeader}>
                        <h3>Vendas da Semana</h3>
                        <span>Últimos 7 dias</span>
                    </div>
                    <SalesChart 
                        salesData={vendasSemanaisSeguras} 
                        title="Vendas Semanais - Tempo Real" 
                        labelDataset="Faturamento Diário (R$)"
                    />
                </div>

                <div className={Styles.chartCard}>
                    <div className={Styles.chartHeader}>
                        <h3>Vendas Mensais</h3>
                        <span>Últimos 6 meses</span>
                    </div>
                    <SalesChart 
                        salesData={dadosVendasMensais} 
                        title="Acompanhamento Mensal Consolidado" 
                        labelDataset="Faturamento Mensal (R$)"
                    />
                </div>
            </div>

            <div className={Styles.bottomGrid}>
                <div className={Styles.resumoFinanceiro}>
                    <h3>Resumo Financeiro</h3>
                    <div className={Styles.resumoItem}>
                        <div className={Styles.resumoLabel}>
                            <IoTrendingUp className={Styles.iconReceita} />
                            <span>Vendas Totais</span>
                        </div>
                        <span className={Styles.valorReceita}>R$ {dadosFinanceiros.vendasTotais.toFixed(2)}</span>
                    </div>
                    <div className={Styles.resumoItem}>
                        <div className={Styles.resumoLabel}>
                            <IoTrendingDown className={Styles.iconDespesa} />
                            <span>Despesas Totais</span>
                        </div>
                        <span className={Styles.valorDespesa}>R$ {dadosFinanceiros.despesasTotais.toFixed(2)}</span>
                    </div>
                    <div className={`${Styles.resumoItem} ${Styles.lucroItem}`}>
                        <div className={Styles.resumoLabel}>
                            <IoStatsChart className={Styles.iconLucro} />
                            <span>Lucro Líquido</span>
                        </div>
                        <span className={Styles.valorLucro}>R$ {dadosFinanceiros.lucro.toFixed(2)}</span>
                    </div>
                </div>

                <div className={Styles.transacoesRecentes}>
                    <h3>Transações Recentes</h3>
                    <div className={Styles.transacoesList}>
                        {transacoesRecentes.length === 0 ? (
                            <p className={Styles.semTransacoes}>Nenhum pedido recente registrado.</p>
                        ) : (
                            transacoesRecentes.map(transacao => (
                                <div key={transacao.id} className={Styles.transacaoItem}>
                                    <div className={Styles.transacaoInfo}>
                                        <span className={Styles.transacaoDescricao}>{transacao.descricao}</span>
                                        <span className={Styles.transacaoData}>{transacao.data}</span>
                                    </div>
                                    <span className={`${Styles.transacaoValor} ${transacao.tipo === 'saida' ? Styles.despesa : Styles.receita}`}>
                                        {transacao.tipo === 'saida' ? '- ' : '+ '}R$ {transacao.valor.toFixed(2)}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinanceiroModerno;