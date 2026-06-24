import ApiService from './api';
import { API_ENDPOINTS } from './constants';

class ProdutoService {
  
  /**
   * Busca todos os produtos cadastrados no sistema (Ofertas Gerais)
   */
  async getProdutos() {
    return await ApiService.get('/produtos');
  }

  /**
   * Busca produtos por ID do confeiteiro/loja
   */
  async getProdutosDaLoja(id) {
    return await ApiService.get(API_ENDPOINTS.PRODUTO.BY_STORE(id));
  }

  /**
   * Cria um novo produto no backend
   */
  async criarProduto(dados, imagem, confeiteiroId) {
    // ✅ Validação 1: Dados obrigatórios
    if (!dados || typeof dados !== 'object') {
      throw new Error('❌ Dados do produto são obrigatórios e devem ser um objeto');
    }

    if (!dados.nome || dados.nome.trim() === '') {
      throw new Error('❌ Nome do produto é obrigatório');
    }

    if (!dados.preco || dados.preco <= 0) {
      throw new Error('❌ Preço deve ser maior que 0');
    }

    if (!dados.categoriaId || dados.categoriaId <= 0) {
      throw new Error('❌ Categoria ID é obrigatório e deve ser um número válido');
    }

    if (!confeiteiroId || confeiteiroId <= 0) {
      throw new Error('❌ ID do confeiteiro é obrigatório');
    }

    // ✅ Fallback seguro: garante que o ID nunca vai como undefined na URL
    const idConfeiteiroFinal = parseInt(confeiteiroId) || 10005;

    // ✅ Validação 2: Tipo de dados
    if (typeof dados.preco === 'string') {
      dados.preco = parseFloat(dados.preco);
    }
    if (typeof dados.estoque === 'string') {
      dados.estoque = parseInt(dados.estoque) || 0;
    }

    // ✅ Construção do FormData (Multipart)
    const formData = new FormData();

    const produtoDTO = {
      nome: dados.nome,
      descricao: dados.descricao || '',
      preco: dados.preco,
      estoque: dados.estoque || 0,
      categoriaId: parseInt(dados.categoriaId),
      disponivel: dados.disponivel !== undefined ? dados.disponivel : true
    };

    formData.append(
      "produto",
      new Blob([JSON.stringify(produtoDTO)], { type: 'application/json' })
    );

    if (imagem && imagem instanceof File) {
      formData.append("imagem", imagem);
    }

    console.log('📦 ProdutoService.criarProduto():');
    console.log('   Confeiteiro ID:', idConfeiteiroFinal);
    console.log('   Dados Enviados no DTO:', produtoDTO);
    console.log('   Imagem:', imagem ? `${imagem.name} (${imagem.size} bytes)` : 'nenhuma');

    return await ApiService.post(
      `${API_ENDPOINTS.PRODUTO.BASE}?confeiteiroId=${idConfeiteiroFinal}`,
      formData,
      {
        headers: {
          'Content-Type': undefined
        }
      }
    );
  }

  /**
   * Atualiza um produto existente no backend
   */
  async atualizarProduto(id, dados, imagem) {
    if (!id || id <= 0) {
      throw new Error('❌ ID do produto é obrigatório');
    }

    if (!dados || typeof dados !== 'object') {
      throw new Error('❌ Dados do produto são obrigatórios');
    }

    const formData = new FormData();

    const produtoDTO = {
      nome: dados.nome,
      descricao: dados.descricao,
      preco: typeof dados.preco === 'string' ? parseFloat(dados.preco) : dados.preco,
      estoque: typeof dados.estoque === 'string' ? parseInt(dados.estoque) || 0 : dados.estoque,
      categoriaId: dados.categoriaId ? parseInt(dados.categoriaId) : null
    };

    formData.append(
      "produto",
      new Blob([JSON.stringify(produtoDTO)], { type: 'application/json' })
    );

    if (imagem && imagem instanceof File) {
      formData.append("imagem", imagem);
    }

    console.log('📦 ProdutoService.atualizarProduto():');
    console.log('   ID:', id);
    console.log('   Dados Enviados no DTO:', produtoDTO);
    console.log('   Imagem:', imagem ? `${imagem.name} (${imagem.size} bytes)` : 'nenhuma');

    // ✅ PUT limpando headers padrão
    return await ApiService.put(API_ENDPOINTS.PRODUTO.BY_ID(id), formData, {
      headers: {
        'Content-Type': undefined
      }
    });
  }
  async deletarProduto(id) {
    return await ApiService.delete(API_ENDPOINTS.PRODUTO.BY_ID(id));
  }
  async desativarProduto(id) {
    return await ApiService.put(
      `${API_ENDPOINTS.PRODUTO.BASE}/${id}/desativar`
    );
  }
}

// Exportando a instância da classe para coincidir com a chamada da HomePage
export default new ProdutoService();