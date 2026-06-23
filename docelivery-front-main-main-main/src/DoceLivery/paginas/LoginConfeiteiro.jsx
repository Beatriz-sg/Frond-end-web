import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Styles from './Formulario.module.css';
import logoImage from '../assests/img/doce_Livre_3.jpg';
import authService from '../services/authService';

const LoginConfeiteiro = () => {
  const [formData, setFormData] = useState({ email: '', senha: '' });
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);
    try {
      await authService.loginConfeiteiro(formData);
      // Se chegou aqui, o 200 OK aconteceu!
      navigate('/docelivery/confeiteiro/Confeiteiro-Dashboard');
    } catch (err) {
      setErro("Verifique suas credenciais.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={Styles.form_container}>
      <div className={Styles.form_card}>
        <img src={logoImage} alt="DoceLivery Logo" className={Styles.form_logo} />
        <h2>Login Confeiteiro</h2>
        <form onSubmit={handleSubmit}>
          <div className={Styles.form_group}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className={Styles.form_group}>
            <label htmlFor="senha">Senha</label>
            <input
              type="password"
              id="senha"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              required
            />
          </div>
          {erro && <p style={{ color: 'red', marginBottom: '8px' }}>{erro}</p>}
          <button type="submit" className={Styles.form_button} disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <p className={Styles.form_link}>
          Não tem uma conta? <Link to="/docelivery/confeiteiro/cadastro">Cadastre-se</Link>
          <br /> Esqueceu sua senha? <Link to="/docelivery/cliente/recuperar-senha">Clique aqui</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginConfeiteiro;