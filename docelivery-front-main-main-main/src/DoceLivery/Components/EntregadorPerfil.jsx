import React, { useState } from 'react';
import { IoPersonOutline, IoCarOutline, IoCardOutline } from 'react-icons/io5';
import Styles from './EntregadorPerfil.module.css';

const EntregadorPerfil = ({ onUserDataUpdate }) => {
  const [dadosPessoais, setDadosPessoais] = useState({
    nome: localStorage.getItem('userName') || '',
    email: localStorage.getItem('userEmail') || '',
    telefone: localStorage.getItem('userTelefone') || '',
    cpf: localStorage.getItem('userCpf') || '',
    dataNascimento: localStorage.getItem('userDataNascimento') || '',
    cnh: localStorage.getItem('userCnh') || '',
  });

  const [dadosVeiculo, setDadosVeiculo] = useState({
    tipo: localStorage.getItem('userVeiculo') || '',
    placa: localStorage.getItem('userPlacaVeiculo') || '',
    marca: '',
    modelo: '',
  });

  const handleSalvarPerfil = () => {
    localStorage.setItem('userName', dadosPessoais.nome);
    localStorage.setItem('userEmail', dadosPessoais.email);
    localStorage.setItem('userTelefone', dadosPessoais.telefone);
    localStorage.setItem('userVeiculo', dadosVeiculo.tipo);
    localStorage.setItem('userPlacaVeiculo', dadosVeiculo.placa);
    localStorage.setItem('nomeEntregador', dadosPessoais.nome);
    localStorage.setItem('veiculo', `${dadosVeiculo.marca} ${dadosVeiculo.modelo}`.trim() || dadosVeiculo.tipo);
    
    if (onUserDataUpdate) {
      onUserDataUpdate({
        nome: dadosPessoais.nome,
        veiculo: `${dadosVeiculo.marca} ${dadosVeiculo.modelo}`.trim() || dadosVeiculo.tipo
      });
    }
    
    alert('Perfil atualizado com sucesso!');
  };

  return (
    <div className={Styles.perfilContainer}>
      
      <div className={Styles.perfilHeader}>
        <h2>👤 Meu Perfil</h2>
        <p>Mantenha suas informações sempre atualizadas</p>
      </div>

      <div className={Styles.secaoCard}>
        <div className={Styles.secaoHeader}>
          <IoPersonOutline size={24} color="#8a2be2" />
          <h3>Dados Pessoais</h3>
        </div>
        
        <div className={Styles.formGrid}>
          <div className={Styles.formGroup}>
            <label>Nome Completo</label>
            <input
              type="text"
              value={dadosPessoais.nome}
              onChange={(e) => setDadosPessoais({...dadosPessoais, nome: e.target.value})}
            />
          </div>
          
          <div className={Styles.formGroup}>
            <label>E-mail</label>
            <input
              type="email"
              value={dadosPessoais.email}
              onChange={(e) => setDadosPessoais({...dadosPessoais, email: e.target.value})}
            />
          </div>
          
          <div className={Styles.formGroup}>
            <label>Telefone</label>
            <input
              type="tel"
              value={dadosPessoais.telefone}
              onChange={(e) => setDadosPessoais({...dadosPessoais, telefone: e.target.value})}
            />
          </div>
          
          <div className={Styles.formGroup}>
            <label>CPF</label>
            <input
              type="text"
              value={dadosPessoais.cpf}
              disabled
              className={Styles.disabled}
            />
          </div>

          <div className={Styles.formGroup}>
            <label>Data de Nascimento</label>
            <input
              type="date"
              value={dadosPessoais.dataNascimento}
              onChange={(e) => setDadosPessoais({...dadosPessoais, dataNascimento: e.target.value})}
            />
          </div>

          <div className={Styles.formGroup}>
            <label>CNH</label>
            <input
              type="text"
              value={dadosPessoais.cnh}
              disabled
              className={Styles.disabled}
            />
          </div>
        </div>
      </div>

      <div className={Styles.secaoCard}>
        <div className={Styles.secaoHeader}>
          <IoCarOutline size={24} color="#10b981" />
          <h3>Dados do Veículo</h3>
        </div>
        
        <div className={Styles.formGrid}>
          <div className={Styles.formGroup}>
            <label>Tipo</label>
            <select
              value={dadosVeiculo.tipo}
              onChange={(e) => setDadosVeiculo({...dadosVeiculo, tipo: e.target.value})}
            >
              <option value="Moto">Moto</option>
              <option value="Carro">Carro</option>
              <option value="Bicicleta">Bicicleta</option>
            </select>
          </div>
          
          <div className={Styles.formGroup}>
            <label>Marca</label>
            <input
              type="text"
              value={dadosVeiculo.marca}
              onChange={(e) => setDadosVeiculo({...dadosVeiculo, marca: e.target.value})}
            />
          </div>
          
          <div className={Styles.formGroup}>
            <label>Modelo</label>
            <input
              type="text"
              value={dadosVeiculo.modelo}
              onChange={(e) => setDadosVeiculo({...dadosVeiculo, modelo: e.target.value})}
            />
          </div>
          
          <div className={Styles.formGroup}>
            <label>Placa</label>
            <input
              type="text"
              value={dadosVeiculo.placa}
              onChange={(e) => setDadosVeiculo({...dadosVeiculo, placa: e.target.value})}
            />
          </div>
        </div>
      </div>

      <div className={Styles.acoes}>
        <button className={Styles.salvarBtn} onClick={handleSalvarPerfil}>
          💾 Salvar Alterações
        </button>
      </div>
    </div>
  );
};

export default EntregadorPerfil;