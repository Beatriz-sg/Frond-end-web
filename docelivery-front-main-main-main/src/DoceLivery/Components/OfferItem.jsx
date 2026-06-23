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
    // Função para formatar o preço para BRL
    const formatPrice = (price) => {
        return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    return (
        // O elemento principal utiliza a classe do CSS Module
        <div
            className={Styles.offer_item}
            onClick={() => onClick(offer)} // Chama a função onClick passando o objeto offer
            role="button" // Melhora a acessibilidade
            tabIndex={0} // Permite focar o elemento
        >
            {/* Imagem do Produto */}
            <div className={Styles.image_container}>
                {/* A propriedade 'offer.imageUrl' já deve conter a URL correta
            (resolvida pelo IMAGE_MAP no HomePage.jsx)
            */}
                <img
                    src={offer.imageUrl}
                    alt={offer.name}
                    className={Styles.offer_image}
                    // Fallback visual se a imagem não carregar
                    onError={(e) => { e.target.src = '/images/default_placeholder.png'; } } />
            </div>

            {/* Detalhes do Produto */}
            <div className={Styles.offer_details}>
                <h4 className={Styles.offer_name}>{offer.name}</h4>
                <p className={Styles.store_name}>{offer.store}</p>
                <div className={Styles.price_info}>
                    <span className={Styles.current_price}>
                        {formatPrice(offer.price)}
                    </span>
                    {/* Exemplo de preço anterior/desconto (opcional) */}
                    {offer.oldPrice && (
                        <span className={Styles.old_price}>
                            {formatPrice(offer.oldPrice)}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );

}

export default OfferItem;