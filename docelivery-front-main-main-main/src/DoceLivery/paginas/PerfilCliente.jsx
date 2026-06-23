import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSave, faIdCard, faMapMarkerAlt, faHeart, faBan } from '@fortawesome/free-solid-svg-icons';
import Styles from './PerfilCliente.module.css';
import ApiService from '../services/api';

const PerfilCliente = () => {
  const [profileData, setProfileData] = useState({
    id: '',
    nome: '',
    apelido: '',
    email: '',
    telefone: '',
    cpf: '',
    dataNascimento: '',
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    preferenciasDoces: {
      bolos: false, cupcakes: false, brigadeiros: false, tortas: false,
      churros: false, mousses: false, docinhos: false, brownies: false
    },
    restricoesAlimentares: {
      semGluten: false, semLactose: false, vegano: false, diabetico: false,
      semAcucar: false, semOvos: false, semNozes: false
    }
  });

  const [loading, setLoading] = useState(false);
  const [loadingDados, setLoadingDados] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const carregarDados = async () => {
      const id = localStorage.getItem('userId');
      
      // 1. Carga inicial de dados locais (LocalStorage)
      const dadosLogin = localStorage.getItem('dadosCliente');
      const usuarioLocal = dadosLogin ? JSON.parse(dadosLogin) : {};
      const preferenciasSalvas = localStorage.getItem('clientProfile') ? JSON.parse(localStorage.getItem('clientProfile')) : null;

      setProfileData(prev => ({
        ...prev,
        id: id || '',
        nome: usuarioLocal.nome || localStorage.getItem('userName') || '',
        apelido: usuarioLocal.apelido || localStorage.getItem('userApelido') || '',
        email: usuarioLocal.email || localStorage.getItem('userEmail') || '',
        telefone: usuarioLocal.telefone || '',
        cpf: usuarioLocal.cpf || '',
        dataNascimento: usuarioLocal.dataNascimento || '',
        cep: usuarioLocal.cep || '',
        logradouro: usuarioLocal.logradouro || '',
        numero: usuarioLocal.numero || '',
        complemento: usuarioLocal.complemento || '',
        bairro: usuarioLocal.bairro || '',
        cidade: usuarioLocal.cidade || '',
        estado: usuarioLocal.uf || usuarioLocal.estado || '',
        preferenciasDoces: preferenciasSalvas?.preferenciasDoces || prev.preferenciasDoces,
        restricoesAlimentares: preferenciasSalvas?.restricoesAlimentares || prev.restricoesAlimentares,
      }));

      // 2. Busca dados frescos no Backend (Removido - Usar dados locais do login)
      // Se precisar buscar dados do servidor, verificar se a rota /api/user/profile existe no backend
      // Por enquanto, usando dados do localStorage que já foram preenchidos durante o login
      setLoadingDados(false);
    };

    carregarDados();
  }, []);

  const applyMask = (name, value) => {
    const digits = value.replace(/\D/g, '');
    if (name === 'telefone') {
      return digits.slice(0, 11)
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d{1,4})$/, '$1-$2');
    }
    if (name === 'cpf') {
      return digits.slice(0, 11)
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    if (name === 'cep') {
        return digits.slice(0, 8).replace(/(\d{5})(\d{1,3})$/, '$1-$2');
    }
    return value;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Tratamento especial para CEP e Busca Automática
    if (name === 'cep') {
      const maskedCep = applyMask('cep', value);
      const digits = value.replace(/\D/g, '');
      setProfileData(prev => ({ ...prev, cep: maskedCep }));
      
      if (digits.length === 8) {
        fetch(`https://viacep.com.br/ws/${digits}/json/`)
          .then(r => r.json())
          .then(d => {
            if (!d.erro) {
              setProfileData(prev => ({
                ...prev,
                logradouro: d.logradouro || '',
                bairro: d.bairro || '',
                cidade: d.localidade || '',
                estado: d.uf || '',
              }));
            }
          });
      }
      return;
    }

    const maskedValue = ['telefone', 'cpf'].includes(name) ? applyMask(name, value) : value;
    setProfileData(prev => ({ ...prev, [name]: maskedValue }));
  };

  const handlePreferenceChange = (category, preference) => {
    setProfileData(prev => ({
      ...prev,
      [category]: { ...prev[category], [preference]: !prev[category][preference] }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const idUsuario = profileData.id || localStorage.getItem('userId');
      
      const dadosParaEnviar = {
        id: idUsuario,
        nome: profileData.nome,
        apelido: profileData.apelido,
        cpf: profileData.cpf,
        email: profileData.email,
        telefone: profileData.telefone,
        cep: profileData.cep,
        // Concatena endereço para o padrão do Banco Java (Limite 100 caracteres)
        endereco: `${profileData.logradouro}, ${profileData.numero}${profileData.complemento ? ' - ' + profileData.complemento : ''}`.substring(0, 100),
        bairro: profileData.bairro,
        cidade: profileData.cidade,
        uf: profileData.estado,
        dataNascimento: profileData.dataNascimento,
        codStatus: true
      };

      // Chamada PUT para o backend
      await ApiService.put(`/atualizar/${idUsuario}`, dadosParaEnviar);

      // Sincroniza LocalStorage
      localStorage.setItem('clientProfile', JSON.stringify(profileData));
      localStorage.setItem('userName', profileData.nome);
      localStorage.setItem('userApelido', profileData.apelido);
      localStorage.setItem('dadosCliente', JSON.stringify(profileData));

      alert('Perfil atualizado com sucesso!');
      navigate('/docelivery/cliente/Home-Page');

    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      alert('Erro ao salvar perfil. Verifique os dados ou tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const labelsDoces = {
    bolos: '🎂 Bolos', cupcakes: '🧁 Cupcakes', brigadeiros: '🍫 Brigadeiros',
    tortas: '🥧 Tortas', churros: '🥨 Churros', mousses: '🍮 Mousses',
    docinhos: '🍬 Docinhos', brownies: '🍩 Brownies',
  };

  const labelsRestricoes = {
    semGluten: 'Sem Glúten', semLactose: 'Sem Lactose', vegano: 'Vegano',
    diabetico: 'Diabético', semAcucar: 'Sem Açúcar', semOvos: 'Sem Ovos', semNozes: 'Sem Nozes',
  };

  if (loadingDados) {
    return (
      <div className={Styles.loadingContainer}>
        <div className={Styles.loadingCard}>
          <p>Carregando dados do perfil...</p>
        </div>
      </div>
    );
  }

  const inicialNome = profileData.nome ? profileData.nome.charAt(0).toUpperCase() : '?';

  return (
    <div className={Styles.container}>
      <div className={Styles.card}>
        <div className={Styles.cardHeader}>
          <button className={Styles.backBtn} onClick={() => navigate('/docelivery/cliente/Home-Page')}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <div className={Styles.avatarCircle}>{inicialNome}</div>
          <div className={Styles.headerInfo}>
            <h2>{profileData.nome || 'Meu Perfil'}</h2>
            <p>{profileData.email}</p>
          </div>
        </div>

        <div className={Styles.body}>
          <form onSubmit={handleSubmit}>
            <div className={Styles.section}>
              <h3 className={Styles.sectionTitle}>
                <FontAwesomeIcon icon={faIdCard} /> Dados Pessoais
              </h3>
              <div className={Styles.formGroup}>
                <label>Nome Completo</label>
                <input type="text" name="nome" value={profileData.nome} onChange={handleChange} required />
              </div>
              <div className={Styles.formGroup}>
                <label>Apelido</label>
                <input type="text" name="apelido" value={profileData.apelido} onChange={handleChange} />
              </div>
              <div className={Styles.formRow}>
                <div className={Styles.formGroup}>
                  <label>CPF</label>
                  <input type="text" name="cpf" value={profileData.cpf} disabled placeholder="000.000.000-00" />
                </div>
                <div className={Styles.formGroup}>
                  <label>Data de Nascimento</label>
                  <input type="date" name="dataNascimento" value={profileData.dataNascimento} onChange={handleChange} />
                </div>
              </div>
              <div className={Styles.formRow}>
                <div className={Styles.formGroup}>
                  <label>Email</label>
                  <input type="email" name="email" value={profileData.email} onChange={handleChange} required />
                </div>
                <div className={Styles.formGroup}>
                  <label>Telefone</label>
                  <input type="tel" name="telefone" value={profileData.telefone} onChange={handleChange} placeholder="(11) 99999-9999" maxLength={15} />
                </div>
              </div>
            </div>

            <div className={Styles.section}>
              <h3 className={Styles.sectionTitle}>
                <FontAwesomeIcon icon={faMapMarkerAlt} /> Endereço
              </h3>
              <div className={Styles.formRow}>
                <div className={Styles.formGroup}>
                  <label>CEP</label>
                  <input type="text" name="cep" value={profileData.cep} onChange={handleChange} placeholder="00000-000" maxLength={9} />
                </div>
                <div className={Styles.formGroup}>
                  <label>Estado</label>
                  <input type="text" name="estado" value={profileData.estado} onChange={handleChange} placeholder="UF" maxLength={2} />
                </div>
              </div>
              <div className={Styles.formGroup}>
                <label>Logradouro</label>
                <input type="text" name="logradouro" value={profileData.logradouro} onChange={handleChange} placeholder="Rua, Avenida..." />
              </div>
              <div className={Styles.formRow}>
                <div className={Styles.formGroup}>
                  <label>Número</label>
                  <input type="text" name="numero" value={profileData.numero} onChange={handleChange} placeholder="123" />
                </div>
                <div className={Styles.formGroup}>
                  <label>Complemento</label>
                  <input type="text" name="complemento" value={profileData.complemento} onChange={handleChange} placeholder="Apto, Bloco..." />
                </div>
              </div>
              <div className={Styles.formRow}>
                <div className={Styles.formGroup}>
                  <label>Bairro</label>
                  <input type="text" name="bairro" value={profileData.bairro} onChange={handleChange} placeholder="Bairro" />
                </div>
                <div className={Styles.formGroup}>
                  <label>Cidade</label>
                  <input type="text" name="cidade" value={profileData.cidade} onChange={handleChange} placeholder="Cidade" />
                </div>
              </div>
            </div>

            <div className={Styles.section}>
              <h3 className={Styles.sectionTitle}>
                <FontAwesomeIcon icon={faHeart} /> Minhas Preferências
              </h3>
              <div className={Styles.prefsGrid}>
                {Object.entries(profileData.preferenciasDoces).map(([key, value]) => (
                  <label key={key} className={`${Styles.prefItem} ${value ? Styles.active : ''}`}>
                    <input type="checkbox" checked={value} onChange={() => handlePreferenceChange('preferenciasDoces', key)} />
                    <span>{labelsDoces[key]}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className={Styles.section}>
              <h3 className={Styles.sectionTitle}>
                <FontAwesomeIcon icon={faBan} /> Restrições Alimentares
              </h3>
              <div className={Styles.prefsGrid}>
                {Object.entries(profileData.restricoesAlimentares).map(([key, value]) => (
                  <label key={key} className={`${Styles.prefItem} ${value ? Styles.active : ''}`}>
                    <input type="checkbox" checked={value} onChange={() => handlePreferenceChange('restricoesAlimentares', key)} />
                    <span>{labelsRestricoes[key]}</span>
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" className={Styles.saveBtn} disabled={loading}>
              <FontAwesomeIcon icon={faSave} />
              {loading ? 'Salvando...' : 'Salvar Perfil'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PerfilCliente;