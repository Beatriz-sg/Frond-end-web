import React, { useState } from 'react';

const produtosIniciais = [
  { id: 1, nome: "Bolo de Cenoura com Brigadeiro", preco: 75.00, status: "Disponível" },
  { id: 2, nome: "Caixa de 50 Brigadeiros Gourmet", preco: 95.00, status: "Disponível" },
  { id: 3, nome: "Torta de Limão", preco: 60.00, status: "Esgotado" },
];

const Catalogo = () => {
  const [produtos, setProdutos] = useState(produtosIniciais);
  const [novoProduto, setNovoProduto] = useState({ nome: '', preco: '', status: 'Disponível' });
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNovoProduto(prev => ({ ...prev, [name]: value }));
  };

  const handleAdicionarProduto = (e) => {
    e.preventDefault();
    if (novoProduto.nome && novoProduto.preco) {
      const produto = {
        id: Date.now(),
        nome: novoProduto.nome,
        preco: parseFloat(novoProduto.preco),
        status: novoProduto.status,
      };
      setProdutos([...produtos, produto]);
      setNovoProduto({ nome: '', preco: '', status: 'Disponível' });
    }
  };

  const containerStyle = {
    padding: '20px',
    backgroundColor: '#f7f5f9',
    borderRadius: '16px',
    minHeight: '100vh',
    fontFamily: 'system-ui, sans-serif'
  };

  const formStyle = { 
    display: 'flex', 
    gap: '10px', 
    marginBottom: '20px', 
    padding: '15px', 
    backgroundColor: '#ffffff',
    border: '1px solid #f0edf4', 
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
  };

  const inputStyle = { padding: '10px', borderRadius: '6px', border: '1px solid #dee2e6', outline: 'none' };
  
  /* Botão "Adicionar" com o Degradê Rosa -> Roxo */
  const mainButtonStyle = { 
    padding: '10px 20px', 
    borderRadius: '6px', 
    border: 'none', 
    background: 'linear-gradient(135deg, #ff69b4 0%, #8a2be2 100%)', 
    color: 'white', 
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(138, 43, 226, 0.2)'
  };

  const actionButtonStyle = {
    padding: '6px 12px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    marginRight: '5px'
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ color: '#8a2be2', fontSize: '26px', fontWeight: '700', marginBottom: '4px' }}>
        Gerenciamento de Catálogo
      </h1>
      <p style={{ color: '#666', marginBottom: '25px', fontSize: '14px' }}>
        Adicione, edite ou remova produtos do seu cardápio DoceLivery.
      </p>

      <h2 style={{ fontSize: '18px', color: '#444', marginBottom: '12px' }}>Adicionar Novo Produto</h2>
      <form onSubmit={handleAdicionarProduto} style={formStyle}>
        <input
          name="nome"
          placeholder="Nome do Produto (Ex: Bolo Red Velvet)"
          value={novoProduto.nome}
          onChange={handleInputChange}
          required
          style={{ ...inputStyle, flexGrow: 2 }}
        />
        <input
          name="preco"
          type="number"
          placeholder="Preço (R$)"
          value={novoProduto.preco}
          onChange={handleInputChange}
          required
          style={{ ...inputStyle, width: '110px' }}
        />
        <select
          name="status"
          value={novoProduto.status}
          onChange={handleInputChange}
          style={inputStyle}
        >
          <option value="Disponível">Disponível</option>
          <option value="Esgotado">Esgotado</option>
        </select>
        <button type="submit" style={mainButtonStyle}>Adicionar</button>
      </form>

      <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
        <h2 style={{ fontSize: '17px', color: '#444', marginBottom: '16px' }}>Seus Produtos Atuais ({produtos.length})</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#fcfbfe', borderBottom: '2px solid #f0edf4' }}>
              <th style={{ padding: '12px 10px', color: '#555', fontSize: '14px' }}>Nome</th>
              <th style={{ padding: '12px 10px', color: '#555', fontSize: '14px' }}>Preço</th>
              <th style={{ padding: '12px 10px', color: '#555', fontSize: '14px' }}>Status</th>
              <th style={{ padding: '12px 10px', color: '#555', fontSize: '14px' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map(produto => (
              <tr key={produto.id} style={{ borderBottom: '1px solid #f5f3f8' }}>
                <td style={{ padding: '12px 10px', fontSize: '14px', color: '#333' }}>{produto.nome}</td>
                <td style={{ padding: '12px 10px', fontSize: '14px', fontWeight: '600', color: '#333' }}>
                  R$ {(produto.preco ?? 0).toFixed(2)}
                </td>
                <td style={{ padding: '12px 10px', fontSize: '13px', fontWeight: '600', color: produto.status === 'Disponível' ? '#2e7d32' : '#c62828' }}>
                  {produto.status}
                </td>
                <td style={{ padding: '12px 10px' }}>
                  <button 
                    style={{ ...actionButtonStyle, backgroundColor: '#e3f2fd', color: '#1565c0' }} 
                    onClick={() => alert(`Editar ${produto.nome}`)}
                  >
                    Editar
                  </button>
                  <button 
                    style={{ ...actionButtonStyle, backgroundColor: '#ffebee', color: '#c62828' }} 
                    onClick={() => setProdutos(produtos.filter(p => p.id !== produto.id))}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Catalogo;