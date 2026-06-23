import React, { useState, useEffect } from 'react';
import { IoCheckmarkCircleOutline, IoTimeOutline, IoLocationOutline, IoCardOutline } from 'react-icons/io5';
import OrderCompletion from './OrderCompletion';
import Styles from './OrderTracking.module.css';
import api from '../services/api'; // Garanta que o caminho para o seu interceptor axios/api está correto

// Aceita tanto `orderId` (número/string) quanto `order` (objeto completo do pedido)
const OrderTracking = ({ orderId, order: orderProp, onRatingSubmit }) => {
  const [pedido, setPedido] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [progress, setProgress] = useState(0);

  // Resolve o ID do pedido: pode vir via prop `orderId` ou via objeto `order`
  const resolvedOrderId = orderId || orderProp?.id;

  // ⏱️ Efeito de Polling: Consulta o back-end a cada 10 segundos buscando o status atualizado do banco
  useEffect(() => {
    // Se o objeto completo do pedido foi passado como prop, usa ele diretamente no estado inicial
    if (orderProp && !orderId) {
      setPedido(orderProp);
      setCarregando(false);
    }

    if (!resolvedOrderId) {
      setErro('ID do pedido não informado.');
      setCarregando(false);
      return;
    }

    const buscarDadosDoPedido = async () => {
      try {
        // CORRIGIDO: removido o prefixo /api duplicado (baseURL já inclui /api)
        const dados = await api.get(`/pedidos/${resolvedOrderId}`);
        // O interceptor de api.js já retorna response.data diretamente
        if (dados && dados.status !== 'ERRO') {
          setPedido(dados);
          setErro(null);
        } else {
          setErro('Não foi possível obter os dados válidos do pedido.');
        }
      } catch (err) {
        console.error("Erro ao buscar rastreamento do pedido:", err);
        setErro('Ocorreu um erro na comunicação com o servidor.');
      } finally {
        setCarregando(false);
      }
    };

    // Executa a busca imediatamente ao abrir a tela
    buscarDadosDoPedido();

    // Configura o intervalo para repetir a cada 10.000ms (10 segundos)
    const intervaloId = setInterval(buscarDadosDoPedido, 10000);

    // Limpa o intervalo acumulado quando o usuário sai da página
    return () => clearInterval(intervaloId);
  }, [resolvedOrderId]); // eslint-disable-line react-hooks/exhaustive-deps

  // 📊 Atualiza dinamicamente a barra de progresso baseando-se no Enum real vindo do Java
  useEffect(() => {
    if (!pedido || !pedido.status) return;

    switch (pedido.status.toUpperCase()) {
      case 'AGUARDANDO_PAGAMENTO':
        setProgress(10);
        break;
      case 'NOVO':
      case 'PAGO':
        setProgress(30);
        break;
      case 'PREPARANDO':
      case 'EM_PREPARACAO':
        setProgress(60);
        break;
      case 'SAIU_PARA_ENTREGA':
        setProgress(85);
        break;
      case 'CONCLUIDO':
      case 'ENTREGUE':
        setProgress(100);
        break;
      default:
        setProgress(0);
    }
  }, [pedido]);

  // 🏷️ Retorna a mensagem ideal de acompanhamento conforme o estado do Spring Boot
  const getStatusText = () => {
    if (!pedido || !pedido.status) return 'Processando...';

    switch (pedido.status.toUpperCase()) {
      case 'AGUARDANDO_PAGAMENTO':
        return 'Aguardando pagamento do PIX...';
      case 'NOVO':
      case 'PAGO':
        return 'Pagamento aprovado! Pedido recebido.';
      case 'PREPARANDO':
      case 'EM_PREPARACAO':
        return 'A confeitaria já está preparando seus doces! 👩‍🍳';
      case 'SAIU_PARA_ENTREGA':
        return 'O motoboy retirou seu pedido e saiu para entrega! 🛵';
      case 'CONCLUIDO':
      case 'ENTREGUE':
        return 'Seu pedido foi entregue com sucesso! 🎉';
      default:
        return `Status: ${pedido.status}`;
    }
  };

  // 🎨 Altera o ícone central conforme o ciclo de vida do pedido
  const getStatusIcon = () => {
    if (!pedido || !pedido.status) return <IoTimeOutline className={Styles.status_icon_preparing} />;

    switch (pedido.status.toUpperCase()) {
      case 'AGUARDANDO_PAGAMENTO':
        return <IoCardOutline className={Styles.status_icon_preparing} />;
      case 'SAIU_PARA_ENTREGA':
        return <IoLocationOutline className={Styles.status_icon_delivering} />;
      case 'CONCLUIDO':
      case 'ENTREGUE':
        return <IoCheckmarkCircleOutline className={Styles.status_icon_delivered} />;
      default:
        return <IoTimeOutline className={Styles.status_icon_preparing} />;
    }
  };

  if (carregando) {
    return <div className={Styles.tracking_container}><p>Carregando rastreamento do pedido...</p></div>;
  }

  if (erro || !pedido) {
    return (
      <div className={Styles.tracking_container}>
        <p className={Styles.error_message}>{erro || "Pedido inválido."}</p>
      </div>
    );
  }

  const isDelivered = pedido.status.toUpperCase() === 'CONCLUIDO' || pedido.status.toUpperCase() === 'ENTREGUE';

  return (
    <div className={Styles.tracking_container}>
      <div className={Styles.tracking_header}>
        <h2>Acompanhe seu pedido</h2>
        {/* Usando os atributos reais devolvidos pelo seu PedidoDTO (Record) */}
        <p>Pedido #{pedido.id} - {pedido.nomeCliente || 'Cliente'}</p>
      </div>

      <div className={Styles.status_section}>
        <div className={Styles.status_icon}>
          {getStatusIcon()}
        </div>
        <h3>{getStatusText()}</h3>
        
        <div className={Styles.progress_bar}>
          <div 
            className={Styles.progress_fill}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className={Styles.order_details}>
        <h4>Itens do pedido:</h4>
        {/* Fallback de array seguro (|| []) mapeado diretamente da resposta do DTO */}
        {(pedido.itens || []).map((item, index) => (
          <div key={item.id || index} className={Styles.order_item}>
            {/* Se você tiver urls de imagens nos itens mapeados do item.nomeProduto */}
            <div className={Styles.item_info}>
              <span className={Styles.item_name}>{item.nomeProduto || 'Doce'}</span>
              <span className={Styles.item_quantity}>Qtd: {item.quantidade}</span>
            </div>
            <span className={Styles.item_price}>
              R$ {((item.precoUnitario ?? 0) * (item.quantidade ?? 0)).toFixed(2)}
            </span>
          </div>
        ))}
        
        <div className={Styles.order_total}>
          <strong>Total: R$ {(pedido.total ?? 0).toFixed(2)}</strong>
        </div>
      </div>

      {isDelivered && (
        <div className={Styles.delivery_message}>
          <IoCheckmarkCircleOutline className={Styles.success_icon} />
          <p>Seu pedido foi entregue com sucesso!</p>
          <button 
            className={Styles.rate_now_btn}
            onClick={() => setShowRatingModal(true)}
          >
            Avaliar Pedido
          </button>
      
        </div>
      )}

      {showRatingModal && (
        <OrderCompletion
          order={pedido}
          onClose={() => setShowRatingModal(false)}
          onSubmitRating={(ratingData) => {
            if (typeof onRatingSubmit === 'function') {
              onRatingSubmit(ratingData);
            }
            setShowRatingModal(false);
          }}
        />
      )}
    </div>
  );
};

export default OrderTracking;