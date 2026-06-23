/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';

const StoreContext = createContext();

const getInitialStoreData = () => {
    const dadosSalvos = JSON.parse(localStorage.getItem('dadosConfeiteiro') || '{}');
    const lojaSalva = dadosSalvos.loja || {};

    return {
        name: lojaSalva.nomeFantasia || dadosSalvos.nomeConfeiteira || dadosSalvos.nomeLoja || localStorage.getItem('nomeLoja') || localStorage.getItem('userName') || 'Minha Confeitaria',
        description: lojaSalva.descricao || dadosSalvos.descricaoLoja || 'Doces artesanais feitos com carinho',
        phone: lojaSalva.telefone || dadosSalvos.telefone || localStorage.getItem('userTelefone') || '(11) 99999-9999',
        email: dadosSalvos.email || localStorage.getItem('userEmail') || 'contato@minhaconfeiteria.com',
        address: lojaSalva.endereco || dadosSalvos.endereco || localStorage.getItem('userEndereco') || 'Rua das Flores, 123 - Centro',
        cidade: dadosSalvos.cidade || lojaSalva.cidade || localStorage.getItem('userCidade') || '',
        estado: dadosSalvos.estado || lojaSalva.estado || localStorage.getItem('userUf') || '',
        cnpj: lojaSalva.cnpj || dadosSalvos.cnpj || localStorage.getItem('userCnpj') || '',
        nomeConfeiteiro: dadosSalvos.nome || dadosSalvos.nomeConfeiteiro || localStorage.getItem('userName') || localStorage.getItem('nomeConfeiteiro') || 'Confeiteiro',
        workingHours: '08:00 - 18:00',
        logo: null,
        banner: null,
        specialties: ['Bolos', 'Cupcakes', 'Tortas'],
        deliveryFee: 5.00,
        minOrder: 20.00,
        isOpen: true
    };
};

export const useStore = () => {
    const context = useContext(StoreContext);
    if (!context) {
        throw new Error('useStore deve ser usado dentro de StoreProvider');
    }
    return context;
};

export const StoreProvider = ({ children }) => {
    const [storeData, setStoreData] = useState(getInitialStoreData);

    useEffect(() => {
        const handleStorageUpdate = () => setStoreData(getInitialStoreData());
        window.addEventListener('localStorageUpdate', handleStorageUpdate);
        return () => window.removeEventListener('localStorageUpdate', handleStorageUpdate);
    }, []);

    const [products, setProducts] = useState([
        {
            id: 1,
            name: 'Bolo de Chocolate',
            description: 'Delicioso bolo de chocolate com cobertura',
            price: 35.00,
            category: 'Bolos',
            image: null,
            available: true
        }
    ]);

    // 🟢 CORREÇÃO PASSO 2: Funções memorizadas com useCallback para quebrar ciclos de loops em useEffects externos
    const updateStoreData = useCallback((newData) => {
        setStoreData(prev => ({ ...prev, ...newData }));
    }, []);

    const addProduct = useCallback((product) => {
        setProducts(prev => [...prev, { ...product, id: Date.now() }]);
    }, []);

    const updateProduct = useCallback((id, updatedProduct) => {
        setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedProduct } : p));
    }, []);

    const deleteProduct = useCallback((id) => {
        setProducts(prev => prev.filter(p => p.id !== id));
    }, []);

    // 🟢 OTIMIZAÇÃO EXTRA: Memorização do objeto do valor do contexto para evitar renderizações desnecessárias
    const contextValue = useMemo(() => ({
        storeData,
        products,
        updateStoreData,
        addProduct,
        updateProduct,
        deleteProduct
    }), [storeData, products, updateStoreData, addProduct, updateProduct, deleteProduct]);

    return (
        <StoreContext.Provider value={contextValue}>
            {children}
        </StoreContext.Provider>
    );
};