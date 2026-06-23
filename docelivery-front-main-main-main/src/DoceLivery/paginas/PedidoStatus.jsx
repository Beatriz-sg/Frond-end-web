import React, { useState, useEffect } from 'react';
import { IoArrowBack, IoCheckmarkCircle, IoTimeOutline } from 'react-icons/io5';
import Styles from './PedidoStatus.module.css';

const PedidoStatus = () => {
    const [orderData, setOrderData] = useState(null);

    useEffect(() => {
        const currentOrder = JSON.parse(localStorage.getItem('currentOrder') || '{}');
        setOrderData(currentOrder);
    }, []);

    if (!orderData || !orderData.id) {
        return (
            <div className={Styles.container}>
                <div className={Styles.header}>
                    <button onClick={() => window.location.href = '/docelivery/cliente/Home-Page'}>
                        <IoArrowBack size={24} />
                    </button>
                    <h2>Pedido não encontrado</h2>
                </div>
            </div>
        );
    }

    return (
        <div className={Styles.container}>
            <div className={Styles.header}>
                <button onClick={() => window.location.href = '/docelivery/cliente/Home-Page'}>
                    <IoArrowBack size={24} />
                </button>
                <h2>Status do Pedido</h2>
            </div>

            <div className={Styles.orderInfo}>
                <div className={Styles.statusIcon}>
                    <IoCheckmarkCircle size={48} color="#10b981" />
                </div>
                <h3>Pedido Confirmado!</h3>
                <p>Pedido #{orderData.id}</p>
                <p>{orderData.storeName}</p>
            </div>

            <div className={Styles.orderDetails}>
                <h4>Itens do Pedido</h4>
                {orderData.items?.map(item => (
                    <div key={item.id} className={Styles.orderItem}>
                        <span>{item.quantity}x {item.name}</span>
                        <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                ))}
                
                <div className={Styles.total}>
                    <strong>Total: R$ {orderData.total?.toFixed(2)}</strong>
                </div>
            </div>

            <div className={Styles.statusTimeline}>
                <div className={Styles.timelineItem}>
                    <IoCheckmarkCircle size={20} color="#10b981" />
                    <span>Pedido confirmado</span>
                </div>
                <div className={Styles.timelineItem}>
                    <IoTimeOutline size={20} color="#f59e0b" />
                    <span>Aguardando confirmação da loja</span>
                </div>
            </div>

            <button 
                className={Styles.backBtn}
                onClick={() => window.location.href = '/docelivery/cliente/Home-Page'}
            >
                Voltar ao Início
            </button>
        </div>
    );
};

export default PedidoStatus;