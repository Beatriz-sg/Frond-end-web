import React, { createContext, useContext, useEffect, useState } from 'react';

const LojaContext = createContext();

export const useLoja = () => {
    const context = useContext(LojaContext);
    if (!context) {
        throw new Error('useLoja deve ser usado dentro de LojaProvider');
    }
    return context;
};

const getInitialDadosLoja = () => {
    const saved = localStorage.getItem('dadosLoja');
    if (saved) {
        const parsed = JSON.parse(saved);
        // Se o id salvo for o placeholder antigo (1), ignora e reconstrói dos dados reais
        if (parsed.id && parsed.id !== 1) return parsed;
    }
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const cadastro = JSON.parse(localStorage.getItem('dadosConfeiteiro') || '{}');
    const lojaSalva = user.loja || cadastro.loja || {};
    return {
        id: lojaSalva.id || null, // ID real da loja vindo da API
        nome: lojaSalva.nomeFantasia || cadastro.nomeConfeitaria || cadastro.nomeLoja || localStorage.getItem('nomeLoja') || '',
        endereco: lojaSalva.endereco || cadastro.endereco || '',
        telefone: lojaSalva.telefone || cadastro.telefone || '',
        descricao: lojaSalva.descricao || cadastro.descricao || '',
        imagem: lojaSalva.fotoUrl || lojaSalva.imagem || null,
        cnpj: lojaSalva.cnpj || '',
        avaliacao: 4.8,
        totalAvaliacoes: 127,
        horarioFuncionamento: lojaSalva.horarioFuncionamento || {
            segunda: '8:00 - 18:00',
            terca: '8:00 - 18:00',
            quarta: '8:00 - 18:00',
            quinta: '8:00 - 18:00',
            sexta: '8:00 - 18:00',
            sabado: '8:00 - 16:00',
            domingo: 'Fechado'
        }
    };
};

export const LojaProvider = ({ children }) => {
    const [dadosLoja, setDadosLoja] = useState(getInitialDadosLoja);

    useEffect(() => {
        const handleStorageUpdate = () => setDadosLoja(getInitialDadosLoja());
        window.addEventListener('localStorageUpdate', handleStorageUpdate);
        return () => window.removeEventListener('localStorageUpdate', handleStorageUpdate);
    }, []);

    const atualizarDadosLoja = (novosDados) => {
        setDadosLoja(prev => {
            // Preserva o id real da loja se o novo dado não trouxer um
            const updated = { ...prev, ...novosDados, id: novosDados.id || prev.id };
            localStorage.setItem('dadosLoja', JSON.stringify(updated));
            return updated;
        });
    };

    const atualizarHorarioFuncionamento = (novoHorario) => {
        setDadosLoja(prev => {
            const updated = {
                ...prev,
                horarioFuncionamento: { ...prev.horarioFuncionamento, ...novoHorario }
            };
            localStorage.setItem('dadosLoja', JSON.stringify(updated));
            return updated;
        });
    };

    return (
        <LojaContext.Provider value={{
            dadosLoja,
            atualizarDadosLoja,
            atualizarHorarioFuncionamento
        }}>
            {children}
        </LojaContext.Provider>
    );
};