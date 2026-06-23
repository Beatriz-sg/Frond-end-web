/* eslint-disable react-refresh/only-export-components */
import React, { useState, useCallback, useMemo, useContext } from 'react';
import axios from 'axios';
import { DashboardContext } from './dashboardContextInstance'; // Importa o objeto Context do novo arquivo

export const DashboardProvider = ({ children }) => {
    // Estado inicial zerado/vazio
    const [dashboardData, setDashboardData] = useState({
        pedidos: {
            hoje: 0,
            pendentes: 0,
            emPreparo: 0,
            concluidos: 0,
            recentes: []
        },
        financeiro: {
            vendasHoje: 0,
            vendasSemana: 0,
            vendasMes: 0,
            ticketMedio: 0,
            produtoMaisVendido: '',
            despesasTotais: 0,
            crescimentoMes: 0
        },
        // Guardará os dados dinâmicos da semana vindo da API
        vendasSemana: [], 
        cardapio: {
            totalProdutos: 0,
            produtosAtivos: 0,
            produtosInativos: 0,
            categorias: [],
            produtosBaixoEstoque: 0
        },
        agendamentos: {
            hoje: 0,
            semana: 0,
            proximos: []
        }
    });

    const updatePedidos = useCallback((newData) => {
        setDashboardData(prev => ({
            ...prev,
            pedidos: { ...prev.pedidos, ...newData }
        }));
    }, []);

    const updateFinanceiro = useCallback((newData) => {
        setDashboardData(prev => ({
            ...prev,
            financeiro: { ...prev.financeiro, ...newData }
        }));
    }, []);

    const updateCardapio = useCallback((newData) => {
        setDashboardData(prev => ({
            ...prev,
            cardapio: { ...prev.cardapio, ...newData }
        }));
    }, []);

    const updateAgendamentos = useCallback((newData) => {
        setDashboardData(prev => ({
            ...prev,
            agendamentos: { ...prev.agendamentos, ...newData }
        }));
    }, []);

    const adicionarVenda = useCallback((valor) => {
        setDashboardData(prev => ({
            ...prev,
            financeiro: {
                ...prev.financeiro,
                vendasHoje: prev.financeiro.vendasHoje + valor,
                vendasMes: prev.financeiro.vendasMes + valor
            },
            pedidos: {
                ...prev.pedidos,
                hoje: prev.pedidos.hoje + 1
            }
        }));
    }, []);

    // 🟢 Retorna diretamente os dados da lista mapeados pela API do Java
    const getVendasSemanais = useCallback(() => {
        if (!dashboardData.vendasSemana || dashboardData.vendasSemana.length === 0) {
            const diasNomes = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'];
            return diasNomes.map(dia => ({ day: dia, total: 0 }));
        }
        return dashboardData.vendasSemana;
    }, [dashboardData.vendasSemana]);

    // Integração real com os Endpoints do Módulo Financeiro
    const carregarDadosFinanceiros = useCallback(async (confeiteiroId) => {
        try {
            // Obtém o token JWT salvo no localStorage para autenticação
            const token = localStorage.getItem('token') || localStorage.getItem('userToken');
            
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };

            // 1. Procura o resumo dos cards (faturamento, lucro, ticket médio)
            const respostaResumo = await axios.get(`http://localhost:8080/api/financeiro/resumo/${confeiteiroId}?meses=1`, config);
            
            // 2. Procura os dados formatados para o gráfico semanal
            const respostaGraficoSemana = await axios.get(`http://localhost:8080/api/financeiro/vendas-semana/${confeiteiroId}`, config);
            
            // 3. Procura o histórico para a tabela de transações
            const respostaFluxo = await axios.get(`http://localhost:8080/api/financeiro/fluxo-caixa/${confeiteiroId}`, config);

            // Atualiza o estado de forma segura usando o espalhamento (...)
            setDashboardData(prev => ({
                ...prev,
                financeiro: {
                    ...prev.financeiro, // 🟢 Garante que dados antigos (como vendasHoje) não sumam
                    vendasMes: respostaResumo.data.faturamentoBruto || 0,
                    ticketMedio: respostaResumo.data.ticketMedio || 0,
                    despesasTotais: respostaResumo.data.custosOperacionais || 0,
                    lucro: respostaResumo.data.lucroLiquido || 0 // Agora injetado com segurança
                },
                pedidos: {
                    ...prev.pedidos, // 🟢 Preserva o restante das chaves de pedidos
                    concluidos: respostaResumo.data.totalPedidos || 0,
                    recentes: respostaFluxo.data || []
                },
                vendasSemana: respostaGraficoSemana.data || [] // Salva a lista vinda do Java
            }));

        } catch (erro) {
            console.error("Erro ao carregar dados do financeiro da API:", erro);
        }
    }, []);

    // 🟢 OTIMIZAÇÃO CRÍTICA: useMemo evita que as páginas re-renderizem se o estado não mudou
    const contextValue = useMemo(() => ({
        dashboardData,
        updatePedidos,
        updateFinanceiro,
        updateCardapio,
        updateAgendamentos,
        adicionarVenda,
        getVendasSemanais,
        carregarDadosFinanceiros
    }), [
        dashboardData,
        updatePedidos,
        updateFinanceiro,
        updateCardapio,
        updateAgendamentos,
        adicionarVenda,
        getVendasSemanais,
        carregarDadosFinanceiros
    ]);

    return (
        <DashboardContext.Provider value={contextValue}>
            {children}
        </DashboardContext.Provider>
    );
};

// 🚨 HOOK CUSTOMIZADO CRIADO AQUI:
export const useDashboard = () => {
    const context = useContext(DashboardContext);
    if (!context) {
        throw new Error('useDashboard deve ser usado dentro de um DashboardProvider');
    }
    return context;
};
