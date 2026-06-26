import axios from 'axios';
import ApiService from './api';
import ConfeiteiroService from './confeiteiroService';
import { API_ENDPOINTS } from './constants';
import { API_BASE_URL } from '../config/api.config';

class AuthService {
  /**
   * Salva os dados do usuário e o token no localStorage após o login.
   * @param {Object} response - Resposta vinda da API
   * @param {string} tipoDefault - Tipo de usuário caso não venha no objeto (cliente, confeiteiro, etc)
   */
  _salvarDadosUsuario(response, tipoDefault) {
    console.log("Resposta da API:", response);
    const resp = response || {};

    if (resp.token) {
      localStorage.setItem('userToken', resp.token);
    }

    const u = resp.user || resp.data || resp;

    try {
      if (u) {
        localStorage.setItem('user', JSON.stringify(u));

        const tipoFinal = (u.tipo || tipoDefault || '').toLowerCase();
        if (tipoFinal) localStorage.setItem('userType', tipoFinal);

        const nomeUsuario = u.nome || u.nomeConfeiteiro || u.userName || u.nomeLoja || u.nomeFantasia || u.loja?.nomeFantasia || '';
        if (nomeUsuario) {
          localStorage.setItem('userName', nomeUsuario);
          // Se for entregador, garante que salva na chave esperada pelo Dashboard
          if (tipoFinal === 'entregador') {
            localStorage.setItem('nomeEntregador', nomeUsuario);
          }
        }
        if (u.nomeConfeiteiro) localStorage.setItem('nomeConfeiteiro', u.nomeConfeiteiro);

        const lojaDados = u.loja || u;
        const nomeDaLoja = lojaDados?.nomeFantasia || lojaDados?.nomeConfeitaria || lojaDados?.nomeLoja || lojaDados?.nome || lojaDados?.descricao || '';
        if (nomeDaLoja) localStorage.setItem('nomeLoja', nomeDaLoja);
        if (u.nomeLoja) localStorage.setItem('nomeLoja', u.nomeLoja);
        if (u.nomeConfeitaria) localStorage.setItem('nomeLoja', u.nomeConfeitaria);
        if (u.nomeFantasia) localStorage.setItem('nomeLoja', u.nomeFantasia);

        if (u.email) localStorage.setItem('userEmail', u.email);
        if (u.cpf) localStorage.setItem('userCpf', u.cpf);

        if (u.fotoPerfil !== undefined) {
          const fotoUrl = u.fotoPerfil
            ? (u.fotoPerfil.startsWith('http') ? u.fotoPerfil : `${API_BASE}/uploads/${u.fotoPerfil}`)
            : '';
          localStorage.setItem('userFoto', fotoUrl);
        }

        if (u.telefone || u.contato) localStorage.setItem('userTelefone', u.telefone || u.contato);
        if (u.dataNascimento) localStorage.setItem('userDataNascimento', u.dataNascimento);

        if (u.endereco) localStorage.setItem('userEndereco', u.endereco);
        if (u.cep) localStorage.setItem('userCep', u.cep);
        if (u.bairro) localStorage.setItem('userBairro', u.bairro);
        if (u.cidade) localStorage.setItem('userCidade', u.cidade);
        if (u.uf || u.estado) localStorage.setItem('userUf', u.uf || u.estado);

        const id = u.id || u.idConfeiteiro || u.idCliente || u.idEntregador || u.idUsuario || u.userId || u.confeiteiroId || u.loja?.id;
        if (id) localStorage.setItem('userId', id);

        const maybeConfeiteiro = u.loja || u.confeiteiro || u;
        if (maybeConfeiteiro && (maybeConfeiteiro.nomeLoja || maybeConfeiteiro.nomeConfeitaria || maybeConfeiteiro.loja || maybeConfeiteiro.nomeFantasia || maybeConfeiteiro.nomeConfeiteiro)) {
          localStorage.setItem('dadosConfeiteiro', JSON.stringify(u));
        }

        // Campos específicos do Entregador
        if (u.cnh) localStorage.setItem('userCnh', u.cnh);
        if (u.veiculo) localStorage.setItem('userVeiculo', u.veiculo);
        if (u.placaVeiculo) localStorage.setItem('userPlacaVeiculo', u.placaVeiculo);
        if (u.cnpj) localStorage.setItem('userCnpj', u.cnpj);

        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('localStorageUpdate'));
        }
      }
    } catch (e) {
      console.warn('Não foi possível salvar dados do usuário no localStorage', e);
    }
  }

  // --- MÉTODOS DE LOGIN ---

  async loginCliente(credenciais) {
    try {
      const response = await ApiService.post(API_ENDPOINTS.AUTH.LOGIN_CLIENTE, credenciais);
      this._salvarDadosUsuario(response, 'cliente');
      try { await this.fetchClienteProfile(); } catch (e) { console.warn('Não foi possível buscar perfil após login cliente', e); }
      return response;
    } catch (error) {
      console.error("Erro detalhado no login:", error.response?.data);
      throw error;
    }
  }

  async fetchClienteProfile() {
    const perfil = await ApiService.get('/cliente/perfil');
    if (!perfil) return;
    const fotoUrl = perfil.fotoPerfil
      ? (perfil.fotoPerfil.startsWith('http') ? perfil.fotoPerfil : `${API_BASE}/uploads/${perfil.fotoPerfil}`)
      : '';
    if (perfil.nome) localStorage.setItem('userName', perfil.nome);
    localStorage.setItem('userFoto', fotoUrl);
    window.dispatchEvent(new Event('localStorageUpdate'));
    return perfil;
  }

  async loginConfeiteiro(credentials) {
    try {
      const response = await ApiService.post(API_ENDPOINTS.AUTH.LOGIN_CONFEITEIRO, credentials);
      this._salvarDadosUsuario(response, 'confeiteiro');
      const emailParaBuscar = credentials.email || response?.user?.email || response?.email || localStorage.getItem('userEmail');
      try { await this.fetchAndSaveProfile(emailParaBuscar, undefined, 'confeiteiro'); } catch (e) { console.warn('Não foi possível buscar perfil após login confeiteiro', e); }
      return response;
    } catch (error) {
      console.error('Erro no login do confeiteiro:', error.response?.data);
      throw error;
    }
  }

  async loginAdmin(email, senha) {
    const response = await ApiService.post(API_ENDPOINTS.AUTH.LOGIN_ADMIN, { email, senha });
    this._salvarDadosUsuario(response, 'admin');
    try { await this.fetchAndSaveProfile(email, undefined, 'admin'); } catch (e) { console.warn('Não foi possível buscar perfil após login admin', e); }
    return response;
  }

  async loginEntregador(email, senha) {
    const response = await ApiService.post(API_ENDPOINTS.AUTH.LOGIN_ENTREGADOR, { email, senha });
    this._salvarDadosUsuario(response, 'entregador');
    
    // CORREÇÃO: Passando o tipo 'entregador' para não disparar a rota do confeiteiro
    try { 
      await this.fetchAndSaveProfile(email, undefined, 'entregador'); 
    } catch (e) { 
      console.warn('Não foi possível buscar perfil após login entregador', e); 
    }
    return response;
  }

  // --- MÉTODOS DE CADASTRO E PERFIL ---

  // CORREÇÃO: Adicionado o parâmetro 'userType' para mapear a requisição correta
  async fetchAndSaveProfile(email, token, userType = 'confeiteiro') {
    try {
      const emailParaBuscar = email || localStorage.getItem('userEmail') || localStorage.getItem('email');
      if (!emailParaBuscar) {
        throw new Error('Email não fornecido para buscar perfil do usuário.');
      }

      // Se for entregador e seu backend ainda não tiver uma rota específica de profile (/api/entregador/profile)
      // os dados coletados no login e salvos pelo _salvarDadosUsuario já são autossuficientes.
      if (userType === 'entregador') {
        console.log("Perfil de entregador carregado através dos dados de autenticação.");
        return JSON.parse(localStorage.getItem('user'));
      }

      const authToken = token || localStorage.getItem('userToken') || localStorage.getItem('token');
      const resposta = await axios.get(
        `${API_BASE_URL}/api/confeiteiro/profile?email=${encodeURIComponent(emailParaBuscar)}`,
        {
          headers: authToken
            ? { Authorization: `Bearer ${authToken}` }
            : undefined
        }
      );

      let profileData = resposta.data;

      try {
        const hasLoja = profileData && (profileData.loja || profileData.nomeLoja || profileData.nomeFantasia || profileData.nomeConfeitaria);
        if (!hasLoja && profileData && profileData.id && userType === 'confeiteiro') {
          try {
            const detalhes = await ConfeiteiroService.getConfeiteiro(profileData.id);
            const detalhesData = detalhes.data || detalhes;
            profileData = { ...profileData, ...detalhesData };
          } catch (err) {
            console.warn('Não foi possível buscar detalhes do confeiteiro:', err);
          }
        }
      } catch (e) {
        console.warn('Erro ao verificar/mesclar dados de loja:', e);
      }

      localStorage.setItem('user', JSON.stringify(profileData));
      
      if (userType === 'confeiteiro') {
        localStorage.setItem('dadosConfeiteiro', JSON.stringify(profileData));
      }
      
      this._salvarDadosUsuario(profileData, userType);

      if (typeof window !== 'undefined') window.dispatchEvent(new Event('localStorageUpdate'));
      return profileData;

    } catch (error) {
      console.warn('Erro ao buscar perfil do usuário:', error);
      throw error;
    }
  }

  async cadastroCliente(dadosCliente) {
    return await ApiService.post(API_ENDPOINTS.AUTH.CADASTRO_CLIENTE, dadosCliente);
  }

  async cadastroConfeiteiro(dadosConfeiteiro) {
    return await ApiService.post(API_ENDPOINTS.AUTH.CADASTRO_CONFEITEIRO, dadosConfeiteiro);
  }

  async cadastroEntregador(dadosEntregador) {
    return await ApiService.post(API_ENDPOINTS.AUTH.CADASTRO_ENTREGADOR, dadosEntregador);
  }

  // --- UTILITÁRIOS ---

  logout() {
    localStorage.clear();
    window.location.href = '/';
  }

  isAuthenticated() {
    return !!localStorage.getItem('userToken');
  }

  getUserType() {
    return localStorage.getItem('userType');
  }

  getUserName() {
    return localStorage.getItem('userName');
  }

  getUserId() {
    return localStorage.getItem('userId');
  }

  getCurrentUser() {
    const type = localStorage.getItem('userType');
    return {
      id: localStorage.getItem('userId'),
      nome: localStorage.getItem('userName'),
      email: localStorage.getItem('userEmail'),
      roles: type ? [type.toUpperCase(), `ROLE_${type.toUpperCase()}`] : []
    };
  }

  async recuperarSenha(email) {
    return await ApiService.post(API_ENDPOINTS.AUTH.RECUPERAR_SENHA, { email });
  }
}

export default new AuthService();
