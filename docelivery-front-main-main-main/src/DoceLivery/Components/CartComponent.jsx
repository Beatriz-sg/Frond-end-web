import React, { useState } from 'react';
import { useCartStore } from "../context/CartContext.jsx";
import Styles from "./CartComponent.module.css";
import { IoCloseCircleOutline, IoTrashOutline, IoAddCircleOutline, IoRemoveCircleOutline } from 'react-icons/io5';

const CartComponent = () => {
    // ESTADOS PARA O AGENDAMENTO E ENVIO
    const [isAgendado, setIsAgendado] = useState(false);
    const [dataAgendamento, setDataAgendamento] = useState("");

    const formatPrice = (value) => {
        const safeValue = value || 0;
        return safeValue.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        });
    };

    const {
        cartItems,
        activeStore,
        removeItemFromCart,
        removeAllOfItem,
        addItemToCart,
        clearCart,
        toggleCart,
    } = useCartStore();
    
    const totalPrice = (cartItems || []).reduce((acc, item) => {
        const price = item.price || 0;
        const quantity = item.quantity || 0;
        return acc + (price * quantity);
    }, 0);
    
    const totalFormatado = formatPrice(totalPrice);
    const storeName = activeStore ? activeStore.name : "Carrinho Vazio";

    const handleAddItem = (item) => {
        addItemToCart(item, null, 1);
    };

    // Salva os dados do carrinho e redireciona para a página de pagamento
    // A criação do pedido acontece lá após a escolha do método de pagamento
    const handleFinalizarCompra = () => {
        if (cartItems.length === 0) return;

        const checkoutData = {
            cartItems,
            activeStore,
            subtotal: totalPrice,
            deliveryFee: 5.00,
            agendado: isAgendado,
            dataEntregaAgendada: isAgendado ? dataAgendamento : null,
        };

        localStorage.setItem('checkoutData', JSON.stringify(checkoutData));
        toggleCart();
        window.location.href = '/docelivery/cliente/pagamento';
    };

    return (
        <>
            <div className={Styles.cart_container}>
                <button className={Styles.close_btn} onClick={toggleCart} aria-label="Fechar Carrinho">
                    <IoCloseCircleOutline size={28} />
                </button>
                
                <h3 className={Styles.cart_title}>{storeName}</h3>

                <div className={Styles.item_list}>
                    {(cartItems || []).length === 0 ? (
                        <div className={Styles.empty_cart}>
                            <div className={Styles.empty_cart_icon}>🛒</div>
                            <p>Seu carrinho está vazio.<br/>Comece a adicionar delícias!</p>
                        </div>
                    ) : (
                        cartItems.map(item => (
                            <div key={item.id} className={Styles.cart_item}>
                                <img 
                                    src={item.imageUrl || item.image} 
                                    alt={item.name || item.title}
                                    className={Styles.item_image}
                                />
                                <div className={Styles.item_info}>
                                    <div className={Styles.item_name}>{item.name || item.title}</div>
                                    <div className={Styles.item_controls}>
                                        <button onClick={() => removeItemFromCart(item.id)} aria-label="Remover um">
                                            <IoRemoveCircleOutline size={20} />
                                        </button>
                                        <span className={Styles.item_quantity}>{item.quantity}</span>
                                        <button onClick={() => handleAddItem(item)} aria-label="Adicionar um">
                                            <IoAddCircleOutline size={20} />
                                        </button>
                                    </div>
                                    <div className={Styles.item_price}>
                                        {formatPrice(item.price * item.quantity)}
                                    </div>
                                </div>
                                <button onClick={() => removeAllOfItem(item.id)} className={Styles.remove_btn} aria-label="Excluir item">
                                    <IoTrashOutline size={20} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            
                {(cartItems || []).length > 0 && (
                    <>
                        {/* SEÇÃO DE AGENDAMENTO */}
                        <div className={Styles.agendamento_section}>
                            <label className={Styles.checkbox_label}>
                                <input 
                                    type="checkbox" 
                                    checked={isAgendado}
                                    onChange={(e) => setIsAgendado(e.target.checked)}
                                />
                                Encomendar para outra data?
                            </label>

                            {isAgendado && (
                                <input 
                                    type="datetime-local"
                                    className={Styles.date_input}
                                    value={dataAgendamento}
                                    onChange={(e) => setDataAgendamento(e.target.value)}
                                />
                            )}
                        </div>

                        <div className={Styles.cart_summary}>
                            <span>Total: {totalFormatado}</span>
                        </div>

                        <button 
                            className={Styles.checkout_btn}
                            onClick={handleFinalizarCompra}
                        >
                            Ir para Pagamento
                        </button>
                    </>
                )}
            </div>
        </>
    );
};

export default CartComponent;