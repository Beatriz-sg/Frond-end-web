import React, { createContext, useContext, useState } from 'react';

const CardapioContext = createContext();

export const useCardapio = () => {
    const context = useContext(CardapioContext);
    if (!context) {
        throw new Error('useCardapio deve ser usado dentro de CardapioProvider');
    }
    return context;
};

export const CardapioProvider = ({ children }) => {
    const [cardapios, setCardapios] = useState({
        1: { // ID da loja
            produtos: [
                { id: 1, nome: 'Bolo de Chocolate', preco: 45.00, categoria: 'bolos', imagem: 'bolo_vulcao', disponivel: true, descricao: 'Delicioso bolo de chocolate com cobertura', tempoPrep: '2 horas' },
                { id: 2, nome: 'Cupcake Red Velvet', preco: 8.50, categoria: 'cupcakes', imagem: 'red_velvet_cupcake', disponivel: true, descricao: 'Cupcake red velvet com cream cheese', tempoPrep: '30 min' },
                { id: 3, nome: 'Brigadeiro Gourmet', preco: 3.50, categoria: 'doces', imagem: 'brigadeiro_gourmet', disponivel: true, descricao: 'Brigadeiro artesanal premium', tempoPrep: '15 min' }
            ],
            combos: [
                { id: 1, nome: 'Kit Festa Infantil', preco: 120.00, produtos: [1, 2], descricao: '1 Bolo + 12 Cupcakes', tipo: 'combo', tempoPrep: '3 horas' },
                { id: 2, nome: 'Kit Aniversário', preco: 200.00, produtos: [1, 3], descricao: '1 Bolo + 50 Brigadeiros', tipo: 'kit', tempoPrep: '4 horas' }
            ]
        }
    });

    const [encomendas, setEncomendas] = useState([]);

    const updateCardapio = (lojaId, produtos, combos) => {
        setCardapios(prev => ({
            ...prev,
            [lojaId]: { produtos, combos }
        }));
    };

    const getCardapio = (lojaId) => {
        return cardapios[lojaId] || { produtos: [], combos: [] };
    };

    const adicionarEncomenda = (encomenda) => {
        const novaEncomenda = {
            ...encomenda,
            id: Date.now(),
            status: 'Pendente',
            dataCriacao: new Date().toISOString()
        };
        setEncomendas(prev => [...prev, novaEncomenda]);
        return novaEncomenda;
    };

    const getEncomendas = (lojaId) => {
        return encomendas.filter(encomenda => encomenda.lojaId === lojaId);
    };

    return (
        <CardapioContext.Provider value={{
            cardapios,
            updateCardapio,
            getCardapio,
            adicionarEncomenda,
            getEncomendas,
            encomendas
        }}>
            {children}
        </CardapioContext.Provider>
    );
};