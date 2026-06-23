// src/pages/RecuperarSenha.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Styles from './Formulario.module.css';
import logoImage from '../assests/img/doce_Livre_3.jpg';

const RecuperarSenha = () => {
  // Estado para armazenar o email
  const [email, setEmail] = useState('');

  // Função para lidar com a mudança no campo de email
  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para enviar o email de recuperação de senha
    console.log('Solicitação de recuperação de senha enviada para:', email);
    alert(`Se o email ${email} estiver cadastrado, as instruções de recuperação de senha foram enviadas.`);
    // Opcional: Redirecionar para uma página de confirmação
  };

  return (
    <div className={Styles.form_container}>
      <div className={Styles.form_card}>
        {/* imagem de logo */}
        <img src={logoImage} alt="DoceLivery Logo" className={Styles.form_logo} />
        <h2>Recuperar Senha</h2>
        <p className={Styles.form_subtitle}>
          Insira seu email para receber as instruções de recuperação de senha.
        </p>
        <form onSubmit={handleSubmit}>
          <div className={Styles.form_group}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              required
            />
          </div>
          {/* Botão para enviar a solicitação de recuperação */}
          <button type="submit" className={Styles.form_button}>Enviar Instruções</button>
        </form>

        {/* Links para voltar ao login ou ir para o cadastro */}
        <p className={Styles.form_link}>
          Lembrou da senha? <Link to="/docelivery/cliente/login-cliente">Faça Login</Link>
          <br /> Não tem uma conta? <Link to="/docelivery/cliente/cadastro-cliente">Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
};

export default RecuperarSenha;