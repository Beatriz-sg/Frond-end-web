import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Styles from './Formulario.module.css';
import logoImage from '../assests/img/doce_Livre_3.jpg';
import AuthService from '../services/authService';

const LoginCliente = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagemErro, setMensagemErro] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMensagemErro('');
    setLoading(true);
    
    try {
      await AuthService.loginCliente({ email, senha });
      // Redireciona para o dashboard ou home do cliente
      navigate('/docelivery/cliente/Home-Page'); 
    } catch (err) {
      setMensagemErro("Usuário ou senha inválidos. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={Styles.form_container}>
      <div className={Styles.form_card}>
        <img src={logoImage} alt="DoceLivery Logo" className={Styles.form_logo} />
        <h2>Login Cliente</h2>
        <form onSubmit={handleLogin}>
          <div className={Styles.form_group}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={Styles.form_group}>
            <label htmlFor="senha">Senha</label>
            <input
              type="password"
              id="senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>
          {mensagemErro && <p style={{ color: 'red', marginBottom: '10px', fontSize: '14px' }}>{mensagemErro}</p>}
          <button type="submit" className={Styles.form_button} disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <p className={Styles.form_link}>
          Não tem uma conta? <Link to="/docelivery/cliente/cadastro-cliente">Cadastre-se</Link>
          <br /> Esqueceu sua senha? <Link to="/docelivery/cliente/recuperar-senha">Clique aqui</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginCliente;