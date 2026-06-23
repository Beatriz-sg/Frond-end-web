/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

export const CartContextStore = createContext(null);

export const CartProviderStore = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [activeStore, setActiveStore] = useState(null);
    const [isClearingCart, setIsClearingCart] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const addItemToCart = useCallback((itemToAdd, newStore, quantity = 1) => {
        if (cartItems.length > 0 && activeStore && newStore && activeStore.id !== newStore.id) {
            setIsClearingCart({ newItem: { ...itemToAdd, quantity }, newStore });
            return;
        }

        const existingItemIndex = cartItems.findIndex(item => item.id === itemToAdd.id);
        let newItems;
        
        if (existingItemIndex > -1) {
            newItems = cartItems.map((item, index) =>
                index === existingItemIndex ? { ...item, quantity: item.quantity + quantity } : item
            );
        } else {
            const storeId = newStore ? newStore.id : (activeStore ? activeStore.id : null);
            const newItem = { ...itemToAdd, quantity, storeId };
            newItems = [...cartItems, newItem];
        }
        
        if (cartItems.length === 0 && newStore) {
            setActiveStore(newStore);
        }
        
        setCartItems(newItems);
    }, [cartItems, activeStore]);

    const removeItemFromCart = useCallback((itemId) => {
        const existingItem = cartItems.find(item => item.id === itemId);
        if (!existingItem) return;

        let newItems;
        if (existingItem.quantity > 1) {
            newItems = cartItems.map(item =>
                item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item
            );
        } else {
            newItems = cartItems.filter(item => item.id !== itemId);
        }
        
        setCartItems(newItems);
        
        if (newItems.length === 0) {
            setActiveStore(null);
        }
    }, [cartItems]);

    const removeAllOfItem = useCallback((itemId) => {
        const newItems = cartItems.filter(item => item.id !== itemId);
        setCartItems(newItems);
        
        if (newItems.length === 0) {
            setActiveStore(null);
        }
    }, [cartItems]);

    const clearCart = useCallback(() => {
        setCartItems([]);
        setActiveStore(null);
        setIsClearingCart(false);
    }, []);

    const confirmClearCart = useCallback(() => {
        if (isClearingCart) {
            const { newItem, newStore } = isClearingCart;
            setActiveStore(newStore);
            setCartItems([{ ...newItem, storeId: newStore.id }]);
            setIsClearingCart(false);
        }
    }, [isClearingCart]);

    const cancelClearCart = useCallback(() => {
        setIsClearingCart(false);
    }, []);

    const toggleCart = useCallback(() => {
        setIsCartOpen(prev => !prev);
    }, []);

    // 🚀 ATUALIZAÇÃO REQUISITADA: A função agora executa o callback primeiro 
    // e só limpa o carrinho local DEPOIS que o componente salvar na API.
    const finalizarPedido = useCallback((onVendaFinalizada) => {
        if (cartItems.length > 0) {
            const valorTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
            
            // Se o componente passou uma função de sucesso (com o Axios), executa ela antes de limpar
            if (onVendaFinalizada) {
                onVendaFinalizada(valorTotal);
            }
            
            // Limpa o estado local de forma segura após o disparo
            setCartItems([]);
            setActiveStore(null);
            setIsClearingCart(false);
            return true;
        }
        return false;
    }, [cartItems]);

    const totalItems = useMemo(() => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    }, [cartItems]);

    const totalPrice = useMemo(() => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    }, [cartItems]);

    const contextValue = useMemo(() => ({
        cartItems,
        activeStore,
        isClearingCart,
        isCartOpen,
        totalItems,
        totalPrice,
        addItemToCart,
        removeItemFromCart,
        removeAllOfItem,
        clearCart,
        confirmClearCart,
        cancelClearCart,
        toggleCart,
        finalizarPedido
    }), [
        cartItems, activeStore, isClearingCart, isCartOpen, totalItems, totalPrice,
        addItemToCart, removeItemFromCart, removeAllOfItem, clearCart, confirmClearCart,
        cancelClearCart, toggleCart, finalizarPedido
    ]);

    return (
        <CartContextStore.Provider value={contextValue}>
            {children}
        </CartContextStore.Provider>
    );
};

export const useCartStore = () => {
    const context = useContext(CartContextStore);
    if (!context) {
        throw new Error('useCartStore deve ser usado dentro de um CartProviderStore');
    }
    return context;
};