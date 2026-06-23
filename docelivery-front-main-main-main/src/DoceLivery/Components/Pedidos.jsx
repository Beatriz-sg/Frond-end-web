import React, { useState, useEffect, useCallback } from 'react';
import OrderService from '../services/orderService';
import AuthService from '../services/authService';
import PedidoCard from './PedidoCard';

// CORRIGIDO:IDs alterados para corresponder exatamente aos Enums retornados pela API Java
const abas = [
    { id: 'NOVO', nome: 'Novos' },
    { id: 'PREPARANDO', nome: 'Em Preparação' },
    { id: 'PRONTO', nome: 'Prontos' },
    { id: 'ENTREGUE', nome: 'Histórico' },
];

const Pedidos = () => {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    // CORRIGIDO:Filtro inicial alterado para o novo ID padrão da primeira aba
    const [filtro, setFiltro] = useState('NOVO');
    const confeiteiroId = AuthService.getUserId();

    useEffect(() => {
        carregarPedidos();
    }, [carregarPedidos]);

    const carregarPedidos = useCallback(async () => {
        try {
            setLoading(true);
            const dados = await OrderService.getFilaTrabalho(confeiteiroId);
            setPedidos(dados || []);
        } catch (error) {
            console.error('Erro ao carregar pedidos:', error);
        } finally {
            setLoading(false);
        }
    }, [confeiteiroId]);

    const handleAtualizarStatus = async (id, novoStatus) => {
        try {
            await OrderService.atualizarStatus(id, novoStatus);
            carregarPedidos();
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
            alert('Erro ao atualizar status.');
        }
    };

    const pedidosFiltrados = pedidos.filter(p => p.status?.toUpperCase() === filtro);

    return (
        <div>
            <div style={{ marginBottom: '20px', borderBottom: '1px solid #ccc' }}>
                {abas.map(aba => (
                    <button
                        key={aba.id}
                        onClick={() => setFiltro(aba.id)}
                        style={{
                            padding: '10px 15px',
                            marginRight: '10px',
                            border: 'none',
                            backgroundColor: filtro === aba.id ? '#ff69b4' : '#eee',
                            color: filtro === aba.id ? '#fff' : '#333',
                            cursor: 'pointer',
                            borderRadius: '4px 4px 0 0',
                            fontWeight: 'bold'
                        }}
                    >
                        {aba.nome} ({pedidos.filter(p => p.status?.toUpperCase() === aba.id).length})
                    </button>
                ))}
            </div>

            {loading ? (
                <p>Carregando pedidos...</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {pedidosFiltrados.length > 0 ? (
                        pedidosFiltrados.map(pedido => (
                            <PedidoCard
                                key={pedido.id}
                                pedido={pedido}
                                onAtualizarStatus={handleAtualizarStatus}
                            />
                        ))
                    ) : (
                        <p>Nenhum pedido encontrado.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Pedidos;