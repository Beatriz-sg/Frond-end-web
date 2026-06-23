// src/Confeiteiro/components/Header.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HeaderConfeiteiro = ({ nomeLoja }) => {
  const [usuarioLogado, setUsuarioLogado] = useState({
    nome: 'Confeiteiro',
    notificacoes: 0
  });

  useEffect(() => {
    const fetchUsuarioLogado = async () => {
      const rawUser = localStorage.getItem('user') || localStorage.getItem('dadosUsuario') || localStorage.getItem('dadosConfeiteiro');
      if (!rawUser) return;

      try {
        const usuario = JSON.parse(rawUser);
        const email = usuario.email || usuario.userEmail || usuario.emailUsuario || localStorage.getItem('userEmail');
        const authToken = localStorage.getItem('userToken') || localStorage.getItem('token');
        if (!email) return;

        const resposta = await axios.get(
          `http://localhost:8080/api/confeiteiro/profile?email=${encodeURIComponent(email)}`,
          {
            headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined
          }
        );
        const perfil = resposta.data || resposta;

        setUsuarioLogado({
          nome: perfil.nome || perfil.nomeConfeiteiro || usuario.nome || usuario.userName || 'Confeiteiro',
          notificacoes: perfil.notificacoes ?? 0
        });
      } catch (error) {
        console.error('Erro ao carregar perfil do usuário:', error);
        try {
          const usuario = JSON.parse(rawUser);
          setUsuarioLogado(prev => ({
            ...prev,
            nome: usuario.nome || usuario.userName || prev.nome
          }));
        } catch {
          // Ignorar erro de parse secundário
        }
      }
    };

    fetchUsuarioLogado();
  }, []);

  return (
    <header style={{
    padding: '20px 30px',
    backgroundColor: '#fff',
    boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
    }}>

      {/* Nome da Loja ou Título da Página */}
    <h2 style={{ margin: 0, color: '#ff69b4' }}>
        {nomeLoja || 'Dashboard do Confeiteiro'}
    </h2>

      {/* Perfil e Notificações */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>

        {/* Ícone de Notificação */}
        <div style={{ position: 'relative', cursor: 'pointer' }}>
        🔔
        {usuarioLogado.notificacoes > 0 && (
            <span style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            backgroundColor: 'red',
            color: 'white',
            borderRadius: '50%',
            padding: '2px 6px',
            fontSize: '0.7em'
            }}>
            {usuarioLogado.notificacoes}
            </span>
          )} {/* <--- A tag <span> e o bloco condicional foram fechados aqui */}
        </div> {/* <--- A tag <div> do Ícone de Notificação foi fechada aqui */}

        {/* Nome do Usuário */}
        <span style={{ fontWeight: 'bold' }}>
        Olá, {usuarioLogado.nome.split(' ')[0]}
        </span>
      </div> {/* <--- A tag <div> de Perfil e Notificações foi fechada aqui */}
    </header>
);
};

export default HeaderConfeiteiro;