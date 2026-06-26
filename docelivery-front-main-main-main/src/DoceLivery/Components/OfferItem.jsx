// components/OfferItem.jsx
import React from 'react';
// import Styles from '../paginas/HomePage.module.css'; // Ajuste o caminho conforme necessário
import Styles from '../Components/OfferItem.module.css'; // Importa o CSS Module específico para OfferItem
/**
 * Componente que exibe um item de oferta de produto.
 * @param {object} props
 * @param {object} props.offer - O objeto de oferta (com id, name, price, imageUrl, etc.)
 * @param {function} props.onClick - Função de callback ao clicar na oferta
 */
function OfferItem({ offer, onClick }) {
    const formatPrice = (price) => {
        return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    return (
        <div
            className={Styles.offer_item}
            onClick={() => onClick(offer)}
            role="button"
            tabIndex={0}
        >
            {/* Imagem do Produto */}
            <div className={Styles.image_container}>
                <img
                    src={offer.imageUrl}
                    alt={offer.name}
                    className={Styles.offer_image}
                    onError={(e) => { e.target.src = '/images/default_placeholder.png'; }}
                />
                {/* Badge de desconto — exibido apenas quando há originalPrice */}
                {offer.discount > 0 && (
                    <span className={Styles.discount_badge}>
                        🔥 {offer.discount}% OFF
                    </span>
                )}
            </div>

            {/* Detalhes do Produto */}
            <div className={Styles.offer_details}>
                <h4 className={Styles.offer_name}>{offer.name}</h4>
                <p className={Styles.store_name}>{offer.store}</p>
                <div className={Styles.price_info}>
                    {/* Preço promocional em destaque */}
                    <span className={Styles.current_price}>
                        {formatPrice(offer.price)}
                    </span>
                    {/* Preço original com strikethrough — usa oldPrice (legado) ou originalPrice */}
                    {(offer.originalPrice || offer.oldPrice) && (
                        <span className={Styles.old_price}>
                            {formatPrice(offer.originalPrice || offer.oldPrice)}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

export default OfferItem;