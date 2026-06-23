import React, { useState } from 'react';
import { IoStar, IoStarOutline, IoCheckmarkCircleOutline } from 'react-icons/io5';
import Styles from './OrderCompletion.module.css';

const OrderCompletion = ({ order, onClose, onSubmitRating }) => {
  const [storeRating, setStoreRating] = useState(0);
  const [storeComment, setStoreComment] = useState('');
  const [deliveryRating, setDeliveryRating] = useState(0);
  const [deliveryComment, setDeliveryComment] = useState('');
  const [hoveredStoreRating, setHoveredStoreRating] = useState(0);
  const [hoveredDeliveryRating, setHoveredDeliveryRating] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (storeRating === 0) {
      alert('Por favor, avalie a loja');
      return;
    }
    if (deliveryRating === 0) {
      alert('Por favor, avalie a entrega');
      return;
    }

    const ratingData = {
      orderId: order?.id || 'N/A',
      storeName: order?.storeName || 'Loja',
      storeRating,
      storeComment,
      deliveryRating,
      deliveryComment,
      date: new Date().toISOString().split('T')[0],
      customerName: 'Cliente'
    };

    onSubmitRating(ratingData);
    onClose();
  };

  const renderStars = (rating, hoveredRating, onRate, onHover, onLeave) =>
    [1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        className={Styles.star_btn}
        onMouseEnter={() => onHover(star)}
        onMouseLeave={() => onLeave(0)}
        onClick={() => onRate(star)}
      >
        {star <= (hoveredRating || rating)
          ? <IoStar className={Styles.star_filled} />
          : <IoStarOutline className={Styles.star_empty} />}
      </button>
    ));

  return (
    <div className={Styles.completion_overlay}>
      <div className={Styles.completion_modal}>
        <div className={Styles.completion_header}>
          <IoCheckmarkCircleOutline className={Styles.success_icon} />
          <h2>Pedido Entregue! 🎉</h2>
          <p>Seu pedido {order?.id ? `#${order.id}` : ''} foi entregue com sucesso</p>
        </div>

        <form onSubmit={handleSubmit} className={Styles.rating_form}>

          {/* Avaliação da Loja */}
          <div className={Styles.rating_section}>
            <h3>🏪 Avalie a loja: {order?.storeName || 'Confeitaria'}</h3>
            <div className={Styles.stars}>
              {renderStars(storeRating, hoveredStoreRating, setStoreRating, setHoveredStoreRating, setHoveredStoreRating)}
            </div>
            <textarea
              value={storeComment}
              onChange={(e) => setStoreComment(e.target.value)}
              placeholder="Como foi a qualidade dos doces? (opcional)"
              className={Styles.comment_textarea}
              rows={2}
            />
          </div>

          {/* Avaliação da Entrega */}
          <div className={`${Styles.rating_section} ${Styles.delivery_section}`}>
            <h3>🚴 Avalie a entrega</h3>
            <div className={Styles.stars}>
              {renderStars(deliveryRating, hoveredDeliveryRating, setDeliveryRating, setHoveredDeliveryRating, setHoveredDeliveryRating)}
            </div>
            <textarea
              value={deliveryComment}
              onChange={(e) => setDeliveryComment(e.target.value)}
              placeholder="Como foi a entrega? Pontualidade, cuidado... (opcional)"
              className={Styles.comment_textarea}
              rows={2}
            />
          </div>

          <div className={Styles.form_actions}>
            <button type="button" onClick={onClose} className={Styles.skip_btn}>
              Pular
            </button>
            <button type="submit" className={Styles.submit_btn}>
              Enviar Avaliações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderCompletion;