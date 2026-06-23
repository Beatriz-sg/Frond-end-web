// src/DoceLivery/Context/CartProviderStore.jsx

import React, { useState, useMemo } from 'react';
import { CartContextStore } from "./CartContext.jsx";

export const CartProviderStore = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [activeStore, setActiveStore] = useState(null);
    const [isClearingCart, setIsClearingCart] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    
// 1. LÓGICA DE ADICIONAR (Você já deve ter esta no provedor)
// Esta função precisa ser capaz de verificar se a loja é diferente para disparar o modal.
const addItemToCart = (itemToAdd, newStore, quantity = 1) => {
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
    };


const removeItemFromCart = (itemId) => {
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
    };

    const removeAllOfItem = (itemId) => {
        const newItems = cartItems.filter(item => item.id !== itemId);
        setCartItems(newItems);
        
        if (newItems.length === 0) {
            setActiveStore(null);
        }
    };

    const clearCart = () => {
        setCartItems([]);
        setActiveStore(null);
        setIsClearingCart(false);
    };

    const confirmClearCart = () => {
        if (isClearingCart) {
            clearCart();
            const { newItem, newStore } = isClearingCart;
            setActiveStore(newStore);
            setCartItems([{ ...newItem, storeId: newStore.id }]);
            setIsClearingCart(false);
        }
    };

    const cancelClearCart = () => {
        setIsClearingCart(false);
    };

    const toggleCart = () => {
        setIsCartOpen(!isCartOpen);
    };

    const finalizarPedido = (onVendaFinalizada) => {
        if (cartItems.length > 0) {
            const valorTotal = totalPrice;
            clearCart();
            if (onVendaFinalizada) {
                onVendaFinalizada(valorTotal);
            }
            return true;
        }
        return false;
    };

    const totalItems = useMemo(() => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    }, [cartItems]);

    const totalPrice = useMemo(() => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    }, [cartItems]);

    const contextValue = {
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
    };

    return (
        <CartContextStore.Provider value={contextValue}>
            {children}
        </CartContextStore.Provider>
    );
};