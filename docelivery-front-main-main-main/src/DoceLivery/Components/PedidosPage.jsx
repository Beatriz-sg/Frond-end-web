import React, { useState, useEffect, useCallback } from 'react';
import OrderService from '../services/orderService';
import AuthService from '../services/authService';
import PedidoCard from './PedidoCard';
import Styles from './PedidosPage.module.css';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { API_WS_URL } from '../config/api.config';

const PedidosPage = () => {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const confeiteiroId = AuthService.getUserId();

    const carregarPedidos = useCallback(async () => {
        try {
            setLoading(true);
            const dados = await OrderService.getFilaTrabalho(confeiteiroId);
            setPedidos(dados || []);
        } catch (error) {
            console.error("Erro ao carregar pedidos:", error);
            alert("Erro ao conectar com o servidor.");
        } finally {
            setLoading(false);
        }
    }, [confeiteiroId]);

    useEffect(() => {
        carregarPedidos();
    }, [carregarPedidos]);

    useEffect(() => {
        if (!confeiteiroId) return;

        // Abre conexão com o endpoint do seu WebSocketConfig Java
        const socket = new SockJS(API_WS_URL);
        const stompClient = Stomp.over(socket);

        // Desativa os logs repetitivos do Stomp no console (opcional, deixa o console mais limpo)
        stompClient.debug = null; 

        stompClient.connect({}, () => {
            console.log(`✅ Conectado ao canal de tempo real do Confeiteiro: ${confeiteiroId}`);

            // Se inscreve exatamente no canal configurado no seu PedidoService Java
            stompClient.subscribe(`/topico/confeiteiro/${confeiteiroId}/pedidos`, (notificacao) => {
                const pedidoWebSocket = JSON.parse(notificacao.body);

                setPedidos((filaAtual) => {
                    // Verifica se o pedido recebido já está aparecendo na tela
                    const existeNaTela = filaAtual.some(p => p.id === pedidoWebSocket.id);

                    if (existeNaTela) {
                        // Se o pedido mudou para um status finalizador, removemos ele da fila ativa
                        if (pedidoWebSocket.status === 'ENTREGUE' || pedidoWebSocket.status === 'CANCELADO') {
                            return filaAtual.filter(p => p.id !== pedidoWebSocket.id);
                        }
                        // Se foi apenas uma mudança interna (ex: NOVO -> PREPARANDO), atualiza o card
                        return filaAtual.map(p => p.id === pedidoWebSocket.id ? pedidoWebSocket : p);
                    } else {
                        // CORRIGIDO: Mudado de 'PENDENTE' para 'NOVO' para aceitar o Enum do seu Java
                        if (pedidoWebSocket.status === 'NOVO') {
                            // Toca um alerta sonoro de cozinha (Link de áudio público de um 'ping')
                            new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-600.wav').play().catch(() => {});
                            // Coloca o novo pedido no topo da lista
                            return [pedidoWebSocket, ...filaAtual];
                        }
                        return filaAtual;
                    }
                });
            });
        }, (error) => {
            console.error("❌ Erro na conexão do WebSocket, tentando reconectar em 5s...", error);
        });

        // IMPORTANTE: Limpa a conexão caso o confeiteiro saia dessa página
        return () => {
            // 🚨 Só desconecta se o stompClient existir E estiver conectado de fato
            if (stompClient && stompClient.connected) {
            stompClient.disconnect(() => {
                console.log("WebSocket desconectado com sucesso!");
            });
            }
        };
    }, [confeiteiroId]);

    const atualizarStatusPedido = async (pedidoId, novoStatus) => {
        try {
            // Usa OrderService.atualizarStatus — chama PATCH /pedidos/{id}/status?novoStatus=X
            await OrderService.atualizarStatus(pedidoId, novoStatus);
            carregarPedidos();
        } catch (error) {
            console.error("Erro ao atualizar status do pedido:", error);
            throw error;
        }
    };

    const handleStatusChange = async (pedidoId, novoStatus) => {
        try {
            await atualizarStatusPedido(pedidoId, novoStatus);
        } catch (error) {
            console.error("Erro ao atualizar status:", error);
            alert("Erro ao atualizar status.");
        }
    };

    if (loading) return <p>Carregando pedidos...</p>;

    return (
        <div className={Styles.pedidosPage}>
            <div className={Styles.pageHeader}>
                <h2>Fila de Produção Real-Time 🔴</h2>
                <button onClick={carregarPedidos} className={Styles.refreshBtn}>Atualizar Lista</button>
            </div>

            <div className={Styles.pedidosGrid}>
                {pedidos.length > 0 ? (
                    pedidos.map(pedido => (
                        <PedidoCard 
                            key={pedido.id} 
                            pedido={pedido} 
                            onAtualizarStatus={handleStatusChange} 
                        />
                    ))
                ) : (
                    <p>Não há pedidos pendentes no momento.</p>
                )}
            </div>
        </div>
    );
};

export default PedidosPage;