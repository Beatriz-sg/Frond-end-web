import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderTracking from '../Components/OrderTracking';
import Styles from './OrderStatus.module.css';

const OrderStatus = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    // Recuperar dados do pedido do localStorage
    const orderData = localStorage.getItem('currentOrder');
    if (orderData) {
      const parsedOrder = JSON.parse(orderData);
      setOrder(parsedOrder);
    } else {
      // Se não houver dados, redirecionar para home
      navigate('/docelivery/cliente/Home-Page');
    }
  }, [navigate]);

  const handleRatingSubmit = (ratingData) => {
    setRatings(prev => [...prev, ratingData]);
    console.log('Avaliação recebida:', ratingData);
    
    // Salvar no localStorage (em uma implementação real, enviaria para API)
    const existingRatings = JSON.parse(localStorage.getItem('storeRatings') || '[]');
    localStorage.setItem('storeRatings', JSON.stringify([...existingRatings, ratingData]));
    
    // Redirecionar para página inicial após avaliação
    setTimeout(() => {
      navigate('/docelivery/cliente/Home-Page');
    }, 2000);
  };

  if (!order) {
    return (
      <div className={Styles.loading}>
        <p>Carregando pedido...</p>
      </div>
    );
  }

  return (
    <div className={Styles.order_status_page}>
      <div className={Styles.header}>
        <button 
          className={Styles.back_btn}
          onClick={() => navigate('/docelivery/cliente/Home-Page')}
        >
          ← Voltar
        </button>
        <h1>Status do Pedido</h1>
      </div>
      
      <OrderTracking 
        order={order}
        onRatingSubmit={handleRatingSubmit}
      />
    </div>
  );
};

export default OrderStatus;