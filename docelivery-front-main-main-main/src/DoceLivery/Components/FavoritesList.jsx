import React, { useState } from 'react';
import { IoClose, IoHeart, IoStorefront, IoGift, IoChevronForwardOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { useCartStore } from '../context/CartContext';
import Styles from './FavoritesList.module.css';

const FavoritesList = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState('stores');
    const { favoriteStores, favoriteProducts, toggleFavoriteStore, toggleFavoriteProduct } = useFavorites();
    const { addItemToCart } = useCartStore();
    const navigate = useNavigate();

    const handleStoreClick = (store) => {
        localStorage.setItem('selectedStore', JSON.stringify(store));
        onClose();
        navigate(`/docelivery/loja/${store.id}`);
    };

    const handleAddToCart = (product) => {
        const stores = JSON.parse(localStorage.getItem('stores') || '[]');
        const store = stores.find(s => s.name === product.store);
        if (store) {
            addItemToCart(product, store, 1);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={Styles.favorites_overlay} onClick={onClose}>
            <div className={Styles.favorites_modal} onClick={(e) => e.stopPropagation()}>
                <div className={Styles.favorites_header}>
                    <h2><IoHeart /> Meus Favoritos</h2>
                    <button className={Styles.close_btn} onClick={onClose}>
                        <IoClose />
                    </button>
                </div>

                <div className={Styles.tabs}>
                    <button 
                        className={`${Styles.tab} ${activeTab === 'stores' ? Styles.active : ''}`}
                        onClick={() => setActiveTab('stores')}
                    >
                        <IoStorefront /> Lojas ({favoriteStores.length})
                    </button>
                    <button 
                        className={`${Styles.tab} ${activeTab === 'products' ? Styles.active : ''}`}
                        onClick={() => setActiveTab('products')}
                    >
                        <IoGift /> Produtos ({favoriteProducts.length})
                    </button>
                </div>

                <div className={Styles.favorites_content}>
                    {activeTab === 'stores' && (
                        <div className={Styles.stores_list}>
                            {favoriteStores.length === 0 ? (
                                <p className={Styles.empty_message}>Nenhuma loja favorita ainda</p>
                            ) : (
                                favoriteStores.map(store => (
                                    <div key={store.id} className={Styles.favorite_item} onClick={() => handleStoreClick(store)} style={{ cursor: 'pointer' }}>
                                        <img src={store.logoUrl} alt={store.name} className={Styles.store_logo} />
                                        <div className={Styles.item_info}>
                                            <h4>{store.name}</h4>
                                            <p>{store.rating} ⭐ • {store.deliveryTime}</p>
                                        </div>
                                        <div className={Styles.item_actions}>
                                            <IoChevronForwardOutline className={Styles.enter_icon} />
                                            <button
                                                className={Styles.remove_btn}
                                                onClick={(e) => { e.stopPropagation(); toggleFavoriteStore(store); }}
                                            >
                                                <IoHeart />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'products' && (
                        <div className={Styles.products_list}>
                            {favoriteProducts.length === 0 ? (
                                <p className={Styles.empty_message}>Nenhum produto favorito ainda</p>
                            ) : (
                                favoriteProducts.map(product => (
                                    <div key={product.id} className={Styles.favorite_item}>
                                        <img src={product.imageUrl} alt={product.name} className={Styles.product_image} />
                                        <div className={Styles.item_info}>
                                            <h4>{product.name}</h4>
                                            <p>{product.store}</p>
                                            <span className={Styles.price}>R$ {(product.price ?? 0).toFixed(2)}</span>
                                        </div>
                                        <div className={Styles.item_actions}>
                                            <button 
                                                className={Styles.add_cart_btn}
                                                onClick={() => handleAddToCart(product)}
                                            >
                                                Adicionar
                                            </button>
                                            <button 
                                                className={Styles.remove_btn}
                                                onClick={() => toggleFavoriteProduct(product)}
                                            >
                                                <IoHeart />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FavoritesList;