import React, { useState } from 'react';
import { IoStar, IoPersonOutline, IoTimeOutline, IoSendOutline } from 'react-icons/io5';
import Styles from './ReviewsList.module.css';

const ReviewsList = ({ storeId, storeName }) => {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      customerName: 'Maria Silva',
      rating: 5,
      comment: 'Doces deliciosos! Entrega rápida e tudo chegou perfeito.',
      date: '2024-01-15',
      storeResponse: null
    },
    {
      id: 2,
      customerName: 'João Santos',
      rating: 4,
      comment: 'Muito bom, só achei um pouco caro.',
      date: '2024-01-14',
      storeResponse: {
        message: 'Obrigado pelo feedback! Estamos sempre buscando o melhor custo-benefício.',
        date: '2024-01-14'
      }
    }
  ]);

  const [responseText, setResponseText] = useState({});
  const [showResponseForm, setShowResponseForm] = useState({});

  const handleStoreResponse = (reviewId) => {
    if (!responseText[reviewId]?.trim()) return;

    setReviews(prev => prev.map(review => 
      review.id === reviewId 
        ? {
            ...review,
            storeResponse: {
              message: responseText[reviewId],
              date: new Date().toISOString().split('T')[0]
            }
          }
        : review
    ));

    setResponseText(prev => ({ ...prev, [reviewId]: '' }));
    setShowResponseForm(prev => ({ ...prev, [reviewId]: false }));
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <IoStar 
        key={index} 
        className={index < rating ? Styles.star_filled : Styles.star_empty} 
      />
    ));
  };

  return (
    <div className={Styles.reviews_container}>
      <h3>Avaliações de {storeName}</h3>
      
      {reviews.length === 0 ? (
        <p className={Styles.no_reviews}>Ainda não há avaliações para esta loja.</p>
      ) : (
        <div className={Styles.reviews_list}>
          {reviews.map(review => (
            <div key={review.id} className={Styles.review_item}>
              <div className={Styles.review_header}>
                <div className={Styles.customer_info}>
                  <IoPersonOutline size={20} />
                  <span className={Styles.customer_name}>{review.customerName}</span>
                </div>
                <div className={Styles.review_meta}>
                  <div className={Styles.rating}>
                    {renderStars(review.rating)}
                  </div>
                  <div className={Styles.date}>
                    <IoTimeOutline size={16} />
                    <span>{new Date(review.date).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </div>
              
              <div className={Styles.review_content}>
                <p>{review.comment}</p>
              </div>
              
              {review.storeResponse && (
                <div className={Styles.store_response}>
                  <div className={Styles.response_header}>
                    <strong>Resposta da loja:</strong>
                    <span className={Styles.response_date}>
                      {new Date(review.storeResponse.date).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <p>{review.storeResponse.message}</p>
                </div>
              )}
              
              {!review.storeResponse && (
                <div className={Styles.response_section}>
                  {!showResponseForm[review.id] ? (
                    <button 
                      className={Styles.respond_btn}
                      onClick={() => setShowResponseForm(prev => ({ ...prev, [review.id]: true }))}
                    >
                      Responder avaliação
                    </button>
                  ) : (
                    <div className={Styles.response_form}>
                      <textarea
                        value={responseText[review.id] || ''}
                        onChange={(e) => setResponseText(prev => ({ ...prev, [review.id]: e.target.value }))}
                        placeholder="Digite sua resposta..."
                        rows={3}
                      />
                      <div className={Styles.response_actions}>
                        <button 
                          className={Styles.cancel_response}
                          onClick={() => setShowResponseForm(prev => ({ ...prev, [review.id]: false }))}
                        >
                          Cancelar
                        </button>
                        <button 
                          className={Styles.send_response}
                          onClick={() => handleStoreResponse(review.id)}
                        >
                          <IoSendOutline size={16} />
                          Enviar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsList;