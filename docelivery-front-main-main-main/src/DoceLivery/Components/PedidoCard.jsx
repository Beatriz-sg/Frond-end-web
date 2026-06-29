import React from 'react';

const PedidoCard = ({ pedido, onAtualizarStatus }) => {
    if (!pedido) return null;

    const { id, status, cliente, valorPedido, itens, numeroPedido, agendado, dataEntregaAgendada } = pedido;

    const statusChave = status ? status.toUpperCase() : 'NOVO';

    // Alinhado com StatusPedido enum: NOVO, PREPARANDO, SAIU_PARA_ENTREGA,
    // ENTREGUE, CANCELADO, AGENDADO, CONCLUIDO
    const statusColors = {
        NOVO: '#007bff',
        AGENDADO: '#17a2b8',
        PREPARANDO: '#ffc107',
        SAIU_PARA_ENTREGA: '#6f42c1',
        ENTREGUE: '#28a745',
        CONCLUIDO: '#28a745',
        CANCELADO: '#dc3545',
    };

    const statusTexto = {
        NOVO: 'Novo Pedido',
        AGENDADO: 'Agendado',
        PREPARANDO: 'Em Preparação',
        SAIU_PARA_ENTREGA: 'Saiu para Entrega',
        ENTREGUE: 'Entregue',
        CONCLUIDO: 'Concluído',
        CANCELADO: 'Cancelado',
    };

    const getAcoes = () => {
        switch (statusChave) {
            case 'NOVO':
            case 'AGENDADO':
                return (
                    <>
                        <button
                            onClick={() => onAtualizarStatus(id, 'PREPARANDO')}
                            style={{ padding: '8px 12px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '8px', fontWeight: 'bold' }}
                        >
                            Aceitar / Iniciar
                        </button>
                        <button
                            onClick={() => onAtualizarStatus(id, 'CANCELADO')}
                            style={{ padding: '8px 12px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                            Recusar
                        </button>
                    </>
                );
            case 'PREPARANDO':
                // Envia diretamente para SAIU_PARA_ENTREGA — disponibiliza ao entregador no app mobile
                return (
                    <button
                        onClick={() => onAtualizarStatus(id, 'SAIU_PARA_ENTREGA')}
                        style={{ padding: '8px 12px', backgroundColor: '#6f42c1', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '100%', fontWeight: 'bold' }}
                    >
                        Pronto para Entrega 🛵
                    </button>
                );
            default:
                return <span style={{ color: '#6c757d', fontStyle: 'italic' }}>Pedido finalizado</span>;
        }
    };

    return (
        <div style={{
            border: `2px solid ${statusColors[statusChave] || '#ccc'}`,
            borderRadius: '12px',
            padding: '15px',
            backgroundColor: '#fff',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            position: 'relative'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h4 style={{ margin: 0, color: '#333' }}>{numeroPedido || `Pedido #${id}`}</h4>
                <span style={{
                    backgroundColor: statusColors[statusChave] || '#6c757d',
                    color: '#fff',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                }}>
                    {statusTexto[statusChave] || statusChave}
                </span>
            </div>

            <div style={{ fontSize: '14px', color: '#555' }}>
                <p style={{ margin: '5px 0' }}><strong>Cliente:</strong> {cliente?.nome || 'Cliente não identificado'}</p>

                {agendado && dataEntregaAgendada && (
                    <p style={{ margin: '5px 0', color: '#d63384' }}>
                        <strong>Entrega:</strong> {new Date(dataEntregaAgendada).toLocaleString('pt-BR')}
                    </p>
                )}

                <div style={{ margin: '10px 0', borderTop: '1px dashed #eee', paddingTop: '10px' }}>
                    <strong>Itens:</strong>
                    <ul style={{ paddingLeft: '20px', margin: '5px 0' }}>
                        {itens?.map((item, index) => (
                            <li key={index}>
                                {item.quantidade}x {item.nomeProduto || item.produto?.nome || 'Doce'}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <h3 style={{ margin: '15px 0', color: '#ff69b4', textAlign: 'right' }}>
                Total: R$ {Number(valorPedido ?? 0).toFixed(2)}
            </h3>

            <div style={{ borderTop: '1px solid #eee', paddingTop: '12px', display: 'flex', justifyContent: 'center' }}>
                {getAcoes()}
            </div>
        </div>
    );
};

export default PedidoCard;