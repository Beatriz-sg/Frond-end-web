import React, { useState } from 'react';
import { IoStarOutline, IoStar, IoCloseOutline } from 'react-icons/io5';
import Styles from './RatingModal.module.css';

const RatingModal = ({ isOpen, onClose, storeName, onSubmitRating }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Por favor, selecione uma avaliação');
      return;
    }
    
    onSubmitRating({
      rating,
      comment,
      storeName,
      date: new Date().toISOString().split('T')[0],
      customerName: 'Cliente' // Em uma implementação real, viria do contexto do usuário
    });
    
    setRating(0);
    setComment('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={Styles.modal_overlay} onClick={onClose}>
      <div className={Styles.modal_content} onClick={(e) => e.stopPropagation()}>
        <div className={Styles.modal_header}>
          <h3>Avaliar {storeName}</h3>
          <button className={Styles.close_btn} onClick={onClose}>
            <IoCloseOutline size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className={Styles.rating_form}>
          <div className={Styles.stars_container}>
            <p>Como foi sua experiência?</p>
            <div className={Styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={Styles.star_btn}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                >
                  {star <= (hoveredRating || rating) ? (
                    <IoStar className={Styles.star_filled} />
                  ) : (
                    <IoStarOutline className={Styles.star_empty} />
                  )}
                </button>
              ))}
            </div>
          </div>
          
          <div className={Styles.comment_container}>
            <label htmlFor="comment">Comentário (opcional)</label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Conte como foi sua experiência..."
              rows={4}
            />
          </div>
          
          <div className={Styles.modal_actions}>
            <button type="button" onClick={onClose} className={Styles.cancel_btn}>
              Cancelar
            </button>
            <button type="submit" className={Styles.submit_btn}>
              Enviar Avaliação
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RatingModal;