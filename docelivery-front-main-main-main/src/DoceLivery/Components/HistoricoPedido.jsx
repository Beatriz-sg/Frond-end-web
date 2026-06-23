import React, { useState, useEffect } from 'react';
import { IoClose, IoCheckmarkCircle, IoTimeOutline, IoRestaurant, IoCarOutline, IoHome, IoPersonOutline, IoStarOutline } from 'react-icons/io5';
import historicoService from '../services/historicoService';
import Styles from './HistoricoPedido.module.css';

const HistoricoPedido = ({ pedido, onClose }) => {
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarHistorico();
  }, [pedido.id]);

  const carregarHistorico = async () => {
    try {
      setLoading(true);
      // Por enquanto usando dados simulados, depois substituir pela API
      const historicoData = historicoService.gerarHistoricoSimulado(pedido);
      setHistorico(historicoData);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
      // Fallback para histórico simulado
      setHistorico(gerarHistoricoFallback(pedido));
    } finally {
      setLoading(false);
    }
  };

  // Função de fallback caso o serviço falhe
  const gerarHistoricoFallback = (pedido) => {
    const baseHistorico = [
      {
        id: 1,
        titulo: 'Pedido Recebido',
        descricao: 'Pedido foi recebido e está aguardando confirmação',
        data: '2024-01-10 14:30',
        status: 'concluido',
        icone: <IoCheckmarkCircle size={20} />,
        detalhes: `Cliente: ${pedido.cliente}\nProduto: ${pedido.produto}\nValor: R$ ${(pedido.valor ?? 0).toFixed(2)}`
      },
      {
        id: 2,
        titulo: 'Pedido Confirmado',
        descricao: 'Pedido foi confirmado e adicionado à fila de produção',
        data: '2024-01-10 14:35',
        status: 'concluido',
        icone: <IoCheckmarkCircle size={20} />,
        detalhes: 'Tempo estimado de preparo: 2-3 horas'
      }
    ];

    const statusAtual = pedido.status.toLowerCase();
    
    if (statusAtual === 'em preparo' || statusAtual === 'concluído') {
      baseHistorico.push({
        id: 3,
        titulo: 'Iniciado Preparo',
        descricao: 'Confeiteiro iniciou a preparação do produto',
        data: '2024-01-10 15:00',
        status: 'concluido',
        icone: <IoRestaurant size={20} />,
        detalhes: 'Ingredientes separados e processo iniciado'
      });
    }

    if (statusAtual === 'concluído') {
      baseHistorico.push(
        {
          id: 4,
          titulo: 'Preparo Concluído',
          descricao: 'Produto finalizado e pronto para entrega',
          data: '2024-01-10 17:30',
          status: 'concluido',
          icone: <IoCheckmarkCircle size={20} />,
          detalhes: 'Produto embalado e etiquetado'
        },
        {
          id: 5,
          titulo: 'Saiu para Entrega',
          descricao: 'Produto saiu para entrega ao cliente',
          data: '2024-01-10 18:00',
          status: 'concluido',
          icone: <IoCarOutline size={20} />,
          detalhes: 'Entregador: João Silva\nPrevisão: 30-45 minutos'
        },
        {
          id: 6,
          titulo: 'Entrega Concluída',
          descricao: 'Produto entregue com sucesso ao cliente',
          data: '2024-01-10 18:25',
          status: 'concluido',
          icone: <IoHome size={20} />,
          detalhes: 'Cliente confirmou o recebimento'
        }
      );
    } else if (statusAtual === 'em preparo') {
      baseHistorico.push({
        id: 4,
        titulo: 'Em Preparo',
        descricao: 'Produto está sendo preparado',
        data: '2024-01-10 16:15',
        status: 'atual',
        icone: <IoTimeOutline size={20} />,
        detalhes: 'Tempo restante estimado: 1 hora'
      });
    } else if (statusAtual === 'pendente') {
      baseHistorico.push({
        id: 3,
        titulo: 'Aguardando Preparo',
        descricao: 'Pedido está na fila aguardando início do preparo',
        data: '2024-01-10 14:40',
        status: 'atual',
        icone: <IoTimeOutline size={20} />,
        detalhes: 'Posição na fila: 2º'
      });
    }

    return baseHistorico;
  };

  const getIconePorTipo = (tipo) => {
    switch (tipo) {
      case 'recebido':
      case 'confirmado':
        return <IoCheckmarkCircle size={20} />;
      case 'preparo_iniciado':
      case 'em_preparo':
        return <IoRestaurant size={20} />;
      case 'preparo_concluido':
        return <IoCheckmarkCircle size={20} />;
      case 'saiu_entrega':
        return <IoCarOutline size={20} />;
      case 'entregue':
        return <IoHome size={20} />;
      case 'aguardando':
        return <IoTimeOutline size={20} />;
      default:
        return <IoCheckmarkCircle size={20} />;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'concluido': return Styles.concluido;
      case 'atual': return Styles.atual;
      case 'pendente': return Styles.pendente;
      default: return '';
    }
  };

  return (
    <div className={Styles.modalOverlay}>
      <div className={Styles.modal}>
        <div className={Styles.modalHeader}>
          <div>
            <h2>Histórico do Pedido #{pedido.id}</h2>
            <p>{pedido.cliente} - {pedido.produto}</p>
          </div>
          <button className={Styles.closeBtn} onClick={onClose}>
            <IoClose size={24} />
          </button>
        </div>

        <div className={Styles.modalContent}>
          {loading ? (
            <div className={Styles.loading}>
              <div className={Styles.spinner}></div>
              <p>Carregando histórico...</p>
            </div>
          ) : (
            <div className={Styles.timeline}>
              {historico.map((item, index) => (
                <div key={item.id} className={`${Styles.timelineItem} ${getStatusClass(item.status)}`}>
                  <div className={Styles.timelineIcon}>
                    {item.icone || getIconePorTipo(item.tipo)}
                  </div>
                  <div className={Styles.timelineContent}>
                    <div className={Styles.timelineHeader}>
                      <h3>{item.titulo}</h3>
                      <span className={Styles.timelineDate}>{item.data}</span>
                    </div>
                    <p className={Styles.timelineDesc}>{item.descricao}</p>
                    {item.detalhes && (
                      <div className={Styles.timelineDetails}>
                        {typeof item.detalhes === 'string' ? (
                          item.detalhes.split('\n').map((linha, i) => (
                            <div key={i}>{linha}</div>
                          ))
                        ) : (
                          Object.entries(item.detalhes).map(([chave, valor]) => (
                            <div key={chave}>
                              <strong>{chave.charAt(0).toUpperCase() + chave.slice(1).replace(/([A-Z])/g, ' $1')}:</strong> {valor}
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                  {index < historico.length - 1 && <div className={Styles.timelineLine}></div>}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={Styles.modalFooter}>
          <div className={Styles.pedidoInfo}>
            <div className={Styles.infoItem}>
              <strong>Status Atual:</strong>
              <span className={`${Styles.statusBadge} ${Styles[pedido.status.toLowerCase().replace(' ', '')]}`}>
                {pedido.status}
              </span>
            </div>
            <div className={Styles.infoItem}>
              <strong>Valor Total:</strong>
              <span>R$ {(pedido.valor ?? 0).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoricoPedido;