// src/DoceLivery/Components/StoreCard.jsx

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faStar, faStarHalfAlt, faTruck } from '@fortawesome/free-solid-svg-icons'; 

// Importa o CSS Module específico do componente para isolamento de estilos
import styles from './StoreCard.module.css';


/**
 * Componente que exibe um card de loja/confeitaria.
 * @param {object} props
 * @param {object} props.store - O objeto da loja (com id, name, rating, logoUrl, etc.)
 * @param {function} props.onClick - Função de callback ao clicar na loja
 * @param {boolean} [props.isListStyle=false] - Indica se é estilo lista (lojas próximas)
 */
const StoreCard = ({ store, onClick, isListStyle = false }) => {
    
    // Função para verificar se a loja está aberta baseado no horário
    const checkIfStoreIsOpen = () => {
        const savedBusinessHours = localStorage.getItem('businessHours');
        if (!savedBusinessHours) return true; // Default: aberta se não há horários configurados
        
        const businessHours = JSON.parse(savedBusinessHours);
        const now = new Date();
        const currentDay = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][now.getDay()];
        const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
        
        const todayHours = businessHours[currentDay];
        if (!todayHours || !todayHours.isOpen) return false;
        
        return currentTime >= todayHours.open && currentTime <= todayHours.close;
    };
    
    const isStoreOpen = checkIfStoreIsOpen();
    
    // Função utilitária para gerar as estrelas de rating
    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        const stars = [];

        for (let i = 0; i < fullStars; i++)
            stars.push(<FontAwesomeIcon key={`full-${i}`} icon={faStar} className={styles.star_full} />);

        if (hasHalfStar)
            stars.push(<FontAwesomeIcon key="half" icon={faStarHalfAlt} className={styles.star_full} />);

        for (let i = 0; i < emptyStars; i++)
            stars.push(<FontAwesomeIcon key={`empty-${i}`} icon={faStar} className={styles.star_empty} />);

        return stars;
    };

    return (
        <div 
            className={`${styles.store_card} ${isListStyle ? styles.list_style : ''}`}
            onClick={() => onClick(store)}
            role="button"
            tabIndex={0}
        >
            {/* 1. Logo da Loja */}
            <div className={styles.logo_container}>
                <img 
                    src={store.logoUrl} 
                    alt={`Logo da ${store.name}`} 
                    className={styles.store_logo}
                    // Fallback visual se a imagem não carregar
                    onError={(e) => { e.target.src = '/images/default_store.png'; }}
                />
            </div>

            {/* 2. Detalhes (Nome, Rating, Tempo) */}
            <div className={styles.store_details}>
                <div className={styles.store_header}>
                    <h3 className={styles.store_name}>{store.name}</h3>
                    <div className={`${styles.store_status} ${isStoreOpen ? styles.open : styles.closed}`}>
                        <div className={styles.status_dot}></div>
                        <span className={styles.status_text}>
                            {isStoreOpen ? 'Aberta' : 'Fechada'}
                        </span>
                    </div>
                </div>
                
                {/* Linha de Rating */}
                <div className={styles.rating_info}>
                    <span className={styles.rating_value}>{store.rating}</span>
                    <div className={styles.stars_container}>
                        {renderStars(store.rating)}
                    </div>
                </div>

                {/* Linha de Entrega e Taxa */}
                <div className={styles.delivery_info}>
                    <FontAwesomeIcon icon={faTruck} className={styles.delivery_icon} />
                    <span className={styles.delivery_time}>{store.deliveryTime}</span>
                    <span className={styles.fee}> • {store.deliveryFee || store.fee}</span>
                </div>
            </div>

            {/* 3. Ícone de Favorito (Opcional) */}
            <div className={styles.favorite_icon}>
                {/* Aqui você pode adicionar lógica para favoritar */}
                <FontAwesomeIcon icon={faHeart} />
            </div>
        </div>
    );
};

export default StoreCard;