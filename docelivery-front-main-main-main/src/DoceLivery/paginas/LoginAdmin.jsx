import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoPersonOutline, IoLockClosedOutline, IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import Styles from './Formulario.module.css';

const LoginAdmin = () => {
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Credenciais do administrador
    const adminCredentials = {
      email: 'admin@docelivery.com',
      senha: 'admin123'
    };

    if (formData.email === adminCredentials.email && formData.senha === adminCredentials.senha) {
      localStorage.setItem('userToken', 'admin-token-123');
      localStorage.setItem('userType', 'admin');
      localStorage.setItem('adminName', 'Administrador');
      window.open('/docelivery/admin/dashboard', '_blank');
      navigate('/');
    } else {
      alert('Credenciais inválidas!');
    }
    
    setLoading(false);
  };

  return (
    <div className={Styles.container}>
      <div className={Styles.formContainer}>
        <div className={Styles.header}>
          <h1>Acesso Administrativo</h1>
          <p>Faça login para acessar o painel de administração</p>
        </div>

        <form onSubmit={handleSubmit} className={Styles.form}>
          <div className={Styles.inputGroup}>
            <IoPersonOutline className={Styles.inputIcon} />
            <input
              type="email"
              name="email"
              placeholder="Email do administrador"
              value={formData.email}
              onChange={handleChange}
              className={Styles.input}
              required
            />
          </div>

          <div className={Styles.inputGroup}>
            <IoLockClosedOutline className={Styles.inputIcon} />
            <input
              type={showPassword ? 'text' : 'password'}
              name="senha"
              placeholder="Senha"
              value={formData.senha}
              onChange={handleChange}
              className={Styles.input}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={Styles.passwordToggle}
            >
              {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
            </button>
          </div>

          <button 
            type="submit" 
            className={Styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar como Admin'}
          </button>
        </form>

        <div className={Styles.loginInfo}>
          <p><strong>Credenciais de teste:</strong></p>
          <p>Email: admin@docelivery.com</p>
          <p>Senha: admin123</p>
        </div>
      </div>
    </div>
  );
};

export default LoginAdmin;