// src/DoceLivery/Components/CartItem.jsx
import React from 'react';
import { useCartStore } from "../context/CartContext";
import Styles from "../Components/CartComponent.module.css";
 
const CartItem = ({ item, activeStore, formatPrice }) => {
    const { addItemToCart, removeItemFromCart, removeAllOfItem } = useCartStore();
 
    return (
        <div className={Styles.cart_item}>
            <span className={Styles.item_name}>{item.name}</span>
            <div className={Styles.item_controls}>
                <button
                    onClick={() => removeItemFromCart(item.id)}
                    disabled={item.quantity <= 1}
                >-</button>
                <span className={Styles.item_quantity}>{item.quantity}</span>
                <button onClick={() => addItemToCart(item, activeStore, 1)}>+</button>
            </div>
            <span className={Styles.item_price}>{formatPrice(item.price * item.quantity)}</span>
            <button onClick={() => removeAllOfItem(item.id)} className={Styles.remove_btn}>X</button>
        </div>
    );
};
 
export default CartItem;
 
// Você usaria ele no CartComponent assim:
// {cartItems.map(item => (
//     <CartItem key={item.id} item={item} activeStore={activeStore} formatPrice={formatPrice} />
// ))}