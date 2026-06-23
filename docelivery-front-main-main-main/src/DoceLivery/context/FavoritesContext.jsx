import React, { createContext, useContext, useState } from 'react';

const FavoritesContext = createContext();

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error('useFavorites deve ser usado dentro de FavoritesProvider');
    }
    return context;
};

export const FavoritesProvider = ({ children }) => {
    const [favoriteStores, setFavoriteStores] = useState([]);
    const [favoriteProducts, setFavoriteProducts] = useState([]);

    const toggleFavoriteStore = (store) => {
        setFavoriteStores(prev => {
            const exists = prev.find(s => s.id === store.id);
            if (exists) {
                return prev.filter(s => s.id !== store.id);
            }
            return [...prev, store];
        });
    };

    const toggleFavoriteProduct = (product) => {
        setFavoriteProducts(prev => {
            const exists = prev.find(p => p.id === product.id);
            if (exists) {
                return prev.filter(p => p.id !== product.id);
            }
            return [...prev, product];
        });
    };

    const isStoreFavorite = (storeId) => {
        return favoriteStores.some(store => store.id === storeId);
    };

    const isProductFavorite = (productId) => {
        return favoriteProducts.some(product => product.id === productId);
    };

    return (
        <FavoritesContext.Provider value={{
            favoriteStores,
            favoriteProducts,
            toggleFavoriteStore,
            toggleFavoriteProduct,
            isStoreFavorite,
            isProductFavorite
        }}>
            {children}
        </FavoritesContext.Provider>
    );
};