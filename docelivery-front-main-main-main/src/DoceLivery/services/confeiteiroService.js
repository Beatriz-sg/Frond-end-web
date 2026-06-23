// src/services/confeiteiroService.js

import ApiService from './api';
import AuthService from './authService';

/**
 * Atualiza o perfil da loja enviando JSON (Cenário A)
 */
export const atualizarPerfilLoja = async (idLoja, dadosLoja) => {
  return await ApiService.put(`/confeiteiro/loja/atualizar/${idLoja}`, dadosLoja);
};

class ConfeiteiroService {
  // Nome alterado para plural para evitar duplicidade com a busca por ID
  async getConfeiteiros() {
    return await ApiService.get('/confeiteiro');
  }

  // Obter uma confeiteira específica pelo ID (Usado no useEffect do Dashboard)
  async getConfeiteiro(id) {
    return await ApiService.get(`/confeiteiro/${id}`);
  }

  // Criar uma nova confeiteira
  async createConfeiteiro(dadosConfeiteiro) {
    return await ApiService.post('/confeiteiro', dadosConfeiteiro);
  }

  // Atualizar uma confeiteira existente
  async updateConfeiteiro(id, dadosConfeiteiro) {
    return await ApiService.put(`/confeiteiro/${id}`, dadosConfeiteiro);
  }

  // Método da classe para compatibilidade com o PerfilLoja.jsx
  async atualizarPerfilLoja(idLoja, dadosLoja) {
    return await ApiService.put(`/confeiteiro/loja/atualizar/${idLoja}`, dadosLoja);
  }

  // Atualizar perfil do confeiteiro logado
  async atualizarPerfil(dados) {
    const id = AuthService.getUserId();

    if (!id) throw new Error('Usuário não autenticado.');

    // Captura o nome da loja de forma flexível de acordo com quem chama
    const nomeDaLojaMapeado = dados.nomeLoja || dados.name || dados.nomeFantasia;

    const payload = {
      id,
      nome: dados.nome,                 // Nome da pessoa (Confeiteiro)
      email: dados.email,
      nomeFantasia: nomeDaLojaMapeado,  // Nome da Loja/Confeitaria para a Entidade Loja no Java
      descricao: dados.descricao,
      cnpj: dados.cnpj,
      telefone: dados.telefone,
      endereco: dados.logradouro || dados.address || dados.endereco, 
      bairro: dados.bairro,
      cidade: dados.cidade,
      uf: dados.estado || dados.uf,
      cep: dados.cep,
    };

    console.log('ID que estou enviando:', id);
    console.log('Dados que estou enviando para o banco:', payload);

    const formData = new FormData();
    formData.append('dados', new Blob([JSON.stringify(payload)], { type: 'application/json' }));
    if (dados.imagem && dados.imagem instanceof File) {
      formData.append('imagem', dados.imagem);
    }

    const response = await ApiService.put(`/confeiteiro/atualizar/${id}`, formData);

    // Sincroniza chaves individuais no localStorage
    if (nomeDaLojaMapeado) localStorage.setItem('nomeLoja', nomeDaLojaMapeado);
    if (dados.nome) localStorage.setItem('nomeConfeiteiro', dados.nome); 
    if (dados.telefone) localStorage.setItem('userTelefone', dados.telefone);
    if (dados.email) localStorage.setItem('userEmail', dados.email);
    if (dados.cnpj) localStorage.setItem('userCnpj', dados.cnpj);
    if (dados.cep) localStorage.setItem('userCep', dados.cep);
    if (dados.bairro) localStorage.setItem('userBairro', dados.bairro);
    if (dados.cidade) localStorage.setItem('userCidade', dados.cidade);
    if (dados.estado) localStorage.setItem('userUf', dados.estado);

    // Sincroniza o objeto unificado local preventivo
    const updatedDadosConfeiteiro = JSON.parse(localStorage.getItem('dadosConfeiteiro') || '{}');
    const updatedLoja = {
      ...(updatedDadosConfeiteiro.loja || {}),
      nomeFantasia: nomeDaLojaMapeado || updatedDadosConfeiteiro.loja?.nomeFantasia,
      descricao: dados.descricao,
      cnpj: dados.cnpj,
      telefone: dados.telefone,
      endereco: dados.logradouro || dados.address || dados.endereco,
      bairro: dados.bairro,
      cidade: dados.cidade,
      uf: dados.estado || dados.uf,
      cep: dados.cep,
    };
    
    localStorage.setItem('dadosConfeiteiro', JSON.stringify({ 
      ...updatedDadosConfeiteiro, 
      nome: dados.nome || updatedDadosConfeiteiro.nome,
      loja: updatedLoja 
    }));

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('localStorageUpdate'));
    }

    return response;
  }

  // Deletar uma confeiteira
  async deleteConfeiteiro(id) {
    return await ApiService.delete(`/confeiteiro/${id}`);
  }

  // Obter pedidos atribuídos a uma confeiteira
  async getPedidosAtribuidos(id) {
    return await ApiService.get(`/confeiteiro/${id}/pedidos`);
  }
}

export default new ConfeiteiroService();