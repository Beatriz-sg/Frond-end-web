import React from 'react';
import { useCartStore } from "../context/CartContext";
import Styles from "./ConfirmationModal.module.css";

const ConfirmationModal = () => {
    const {
        isClearingCart,
        activeStore,
        confirmClearCart,
        cancelClearCart
    } = useCartStore();

    // Lógica OK: Só renderiza se isClearingCart for um objeto com dados (true)
    if (!isClearingCart) {
        return null;
    }

    // Lógica OK: Desestrutura os dados necessários
    const { newItem, newStore } = isClearingCart;
    
    // VERIFICAÇÃO DE SEGURANÇA: Se activeStore não existir (carrinho vazio), 
    // algo deu errado no addItemToCart, mas é bom verificar.
    if (!activeStore) {
        // Isso não deve acontecer, mas evita erro de runtime
        return null;
    }

    const handleCancel = () => {
        cancelClearCart();
    };

    const handleConfirm = () => {
        confirmClearCart();
    };

    return (
        <div className={Styles.modal_overlay}>
            <div className={Styles.modal_content}>
                <h3 className={Styles.modal_title}>Atenção: Mudar de Loja?</h3>
                
                <p className={Styles.modal_message}>
                    Seu carrinho atual contém itens de <strong>{activeStore.name}</strong>.
                </p>
                <p className={Styles.modal_message}>
                    Se você continuar, o carrinho será <strong>limpo</strong> e <strong>{newItem.name}</strong> de <strong>{newStore.name}</strong> será adicionado.
                </p>

                <div className={Styles.modal_actions}>
                    <button 
                        className={Styles.cancel_btn} 
                        onClick={handleCancel}
                    >
                        Manter Itens Atuais
                    </button>
                    <button
                        className={Styles.confirm_btn} 
                        onClick={handleConfirm}
                    >
                        Limpar e Adicionar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;