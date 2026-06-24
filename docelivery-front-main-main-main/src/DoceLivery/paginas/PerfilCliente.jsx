import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSave, faIdCard, faMapMarkerAlt, faHeart, faBan, faCamera } from '@fortawesome/free-solid-svg-icons';
import Styles from './PerfilCliente.module.css';
import ApiService from '../services/api';

const API_BASE = import.meta.env.VITE_API_URL || 'http://192.168.1.102:8080';

const buildFotoUrl = (foto) => {
  if (!foto) return null;
  if (foto.startsWith('http')) return foto;
  return `${API_BASE}/uploads/${foto}`;
};

const PREF_KEYS = ['bolos','cupcakes','brigadeiros','tortas','churros','mousses','docinhos','brownies'];
const REST_KEYS  = ['semGluten','semLactose','vegano','diabetico','semAcucar','semOvos','semNozes'];

const EMPTY_PREFS = Object.fromEntries(PREF_KEYS.map(k => [k, false]));
const EMPTY_REST  = Object.fromEntries(REST_KEYS.map(k => [k, false]));

// Mapa de normalização: variações da API → chave camelCase do front
const NORM_MAP = {
  // preferências
  bolos: 'bolos', bolo: 'bolos',
  cupcakes: 'cupcakes', cupcake: 'cupcakes',
  brigadeiros: 'brigadeiros', brigadeiro: 'brigadeiros',
  tortas: 'tortas', torta: 'tortas',
  churros: 'churros', churro: 'churros',
  mousses: 'mousses', mousse: 'mousses',
  docinhos: 'docinhos', docinho: 'docinhos',
  brownies: 'brownies', brownie: 'brownies',
  // restrições
  semgluten: 'semGluten', 'sem gluten': 'semGluten', 'sem glúten': 'semGluten',
  semlactose: 'semLactose', 'sem lactose': 'semLactose',
  vegano: 'vegano', vegana: 'vegano',
  diabetico: 'diabetico', diabético: 'diabetico',
  semacucar: 'semAcucar', 'sem açúcar': 'semAcucar', 'sem acucar': 'semAcucar',
  semovos: 'semOvos', 'sem ovos': 'semOvos',
  semnozes: 'semNozes', 'sem nozes': 'semNozes',
};

// API devolve preferencias/restricoes como array de strings — converte para obj booleano
const arrayParaObj = (arr, keys) => {
  const base = Object.fromEntries(keys.map(k => [k, false]));
  if (Array.isArray(arr)) {
    arr.forEach(v => {
      const raw = String(v).trim();
      // tenta match exato primeiro, depois normalizado
      if (raw in base) {
        base[raw] = true;
      } else {
        const normalizado = NORM_MAP[raw.toLowerCase()];
        if (normalizado && normalizado in base) base[normalizado] = true;
      }
    });
  }
  return base;
};

// Obj booleano → array de strings para enviar à API
const objParaArray = (obj) =>
  Object.entries(obj).filter(([, v]) => v).map(([k]) => k);

const PerfilCliente = () => {
  const [profileData, setProfileData] = useState({
    id: '', nome: '', apelido: '', email: '', telefone: '', cpf: '',
    dataNascimento: '', cep: '', logradouro: '', numero: '', complemento: '',
    bairro: '', cidade: '', estado: '', fotoPerfil: '',
    preferenciasDoces: { ...EMPTY_PREFS },
    restricoesAlimentares: { ...EMPTY_REST },
  });

  const [loading, setLoading] = useState(false);
  const [loadingDados, setLoadingDados] = useState(true);
  const [fotoPreview, setFotoPreview] = useState(null);
  const [fotoFile, setFotoFile] = useState(null);
  const fotoInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const carregarDados = async () => {
      setLoadingDados(true);
      try {
        const perfil = await ApiService.get('/cliente/perfil');
        const p = perfil || {};

        // Normaliza preferências e restrições vindas da API (podem ser objeto ou null)
        // API retorna as chaves como "preferencias" e "restricoes" (arrays de strings)
        const prefs = arrayParaObj(p.preferencias, PREF_KEYS);
        const rest  = arrayParaObj(p.restricoes,   REST_KEYS);

        setProfileData({
          id: p.id || localStorage.getItem('userId') || '',
          nome: p.nome || '',
          apelido: p.apelido || '',
          email: p.email || '',
          telefone: p.telefone || '',
          cpf: p.cpf || '',
          dataNascimento: p.dataNascimento ? p.dataNascimento.substring(0, 10) : '',
          cep: p.cep || '',
          logradouro: p.logradouro || p.endereco || '',
          numero: p.numero || '',
          complemento: p.complemento || '',
          bairro: p.bairro || '',
          cidade: p.cidade || '',
          estado: p.uf || p.estado || '',
          fotoPerfil: p.fotoPerfil || '',
          preferenciasDoces: prefs,
          restricoesAlimentares: rest,
        });

        const fotoUrl = buildFotoUrl(p.fotoPerfil);
        setFotoPreview(fotoUrl);
        localStorage.setItem('userName', p.nome || '');
        localStorage.setItem('userFoto', fotoUrl || '');
        window.dispatchEvent(new Event('localStorageUpdate'));

      } catch (error) {
        console.error('Erro ao carregar perfil da API, usando localStorage:', error);

        // Fallback para localStorage
        const raw = localStorage.getItem('dadosCliente') || localStorage.getItem('user');
        const u = raw ? JSON.parse(raw) : {};
        const savedPrefs = localStorage.getItem('clientProfile');
        const saved = savedPrefs ? JSON.parse(savedPrefs) : null;

        setProfileData(prev => ({
          ...prev,
          id: localStorage.getItem('userId') || '',
          nome: u.nome || localStorage.getItem('userName') || '',
          apelido: u.apelido || '',
          email: u.email || localStorage.getItem('userEmail') || '',
          telefone: u.telefone || '',
          cpf: u.cpf || '',
          dataNascimento: u.dataNascimento || '',
          cep: u.cep || '',
          logradouro: u.logradouro || u.endereco || '',
          numero: u.numero || '',
          complemento: u.complemento || '',
          bairro: u.bairro || '',
          cidade: u.cidade || '',
          estado: u.uf || u.estado || '',
          fotoPerfil: u.fotoPerfil || '',
          preferenciasDoces: arrayParaObj(saved?.preferencias, PREF_KEYS),
          restricoesAlimentares: arrayParaObj(saved?.restricoes, REST_KEYS),
        }));

        setFotoPreview(buildFotoUrl(u.fotoPerfil));
      } finally {
        setLoadingDados(false);
      }
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
      [category]: { ...prev[category], [preference]: !prev[category][preference] },
    }));
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFotoFile(file);
    setFotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Upload de foto separado via POST /api/cliente/foto
      let novaFotoPerfil = profileData.fotoPerfil;
      if (fotoFile) {
        const fd = new FormData();
        fd.append('foto', fotoFile);
        const fotoResp = await ApiService.post('/cliente/foto', fd);
        novaFotoPerfil = fotoResp.fotoPerfil || novaFotoPerfil;
      }

      // 2. PUT /api/cliente/perfil — preferencias e restricoes como arrays de strings
      const dadosParaEnviar = {
        nome: profileData.nome,
        apelido: profileData.apelido,
        email: profileData.email,
        telefone: profileData.telefone,
        cep: profileData.cep,
        logradouro: profileData.logradouro,
        numero: profileData.numero,
        complemento: profileData.complemento,
        bairro: profileData.bairro,
        cidade: profileData.cidade,
        estado: profileData.estado,
        dataNascimento: profileData.dataNascimento,
        preferencias: objParaArray(profileData.preferenciasDoces),
        restricoes: objParaArray(profileData.restricoesAlimentares),
        codStatus: true,
      };

      const p = await ApiService.put('/cliente/perfil', dadosParaEnviar);

      // 3. Atualiza estado com resposta da API
      const fotoPerfil = p.fotoPerfil || novaFotoPerfil;
      const novaFotoUrl = buildFotoUrl(fotoPerfil);

      setProfileData(prev => ({
        ...prev, ...p,
        fotoPerfil,
        estado: p.estado || prev.estado,
        preferenciasDoces: arrayParaObj(p.preferencias, PREF_KEYS),
        restricoesAlimentares: arrayParaObj(p.restricoes, REST_KEYS),
      }));
      setFotoPreview(novaFotoUrl);
      setFotoFile(null);

      // 4. Sincroniza localStorage → header reage via evento
      localStorage.setItem('userName', p.nome || profileData.nome);
      localStorage.setItem('userFoto', novaFotoUrl || '');
      localStorage.setItem('clientProfile', JSON.stringify(p));
      window.dispatchEvent(new Event('localStorageUpdate'));

      alert('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      alert('Erro ao salvar perfil. Verifique os dados ou tente novamente.');
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

          <div className={Styles.avatarWrapper} onClick={() => fotoInputRef.current?.click()}>
            {fotoPreview
              ? <img src={fotoPreview} alt="Foto de perfil" className={Styles.avatarImg} />
              : <div className={Styles.avatarCircle}>{inicialNome}</div>
            }
            <div className={Styles.avatarOverlay}>
              <FontAwesomeIcon icon={faCamera} />
            </div>
            <input
              ref={fotoInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFotoChange}
            />
          </div>

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
                  <label>Estado (UF)</label>
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
