import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProdutoForm from './ProdutoForm';
import ApiService from '../services/api';
import AuthService from '../services/authService';

const Cardapio = () => {
    const [produtos, setProdutos] = useState([]);
    const [modalAberto, setModalAberto] = useState(false);
    const [produtoParaEditar, setProdutoParaEditar] = useState(null);
    const [arrayDeIdsSelecionados, setArrayDeIdsSelecionados] = useState([]);
    const [valorTotal, setValorTotal] = useState(0);
    const [editingItem, setEditingItem] = useState(null);
    const [nomeDoKit, setNomeDoKit] = useState('');
    const [descricaoDoKit, setDescricaoDoKit] = useState('');

    // --- LIGAÇÃO 1: BUSCAR DADOS DO BACK-END ---
    const carregarProdutos = async () => {
        try {
            const idLogado = AuthService.getUserId();
            if (!idLogado) return;
            
            // Buscamos os produtos filtrados pelo confeiteiro logado
            // Note: ApiService já tem o prefixo /api na baseURL
            const response = await ApiService.get(`/produtos/store/${idLogado}`);
            setProdutos(response); // response já é o JSON no seu ApiService
        } catch (error) {
            console.error("Erro ao carregar cardápio:", error);
        }
    };

    // Executa assim que a tela abre
    useEffect(() => {
        carregarProdutos();
    }, []);

    // --- LIGAÇÃO 2: SALVAR NO BANCO ---
    const handleSalvar = async (dadosDoForm) => {
        try {
            const produtoParaEnviar = {
                nome: dadosDoForm.nome,
                preco: parseFloat(dadosDoForm.preco),
                estoque: parseInt(dadosDoForm.estoque),
                descricao: dadosDoForm.descricao,
                disponivel: dadosDoForm.disponivel ?? true
            };

            const idLogado = AuthService.getUserId();
            const data = new FormData();
            data.append("produto", JSON.stringify(produtoParaEnviar));

            // Se houver arquivo de foto vindo do ProdutoForm
            if (dadosDoForm.arquivoFoto) {
                data.append("imagem", dadosDoForm.arquivoFoto);
            }

            const token = localStorage.getItem('userToken') || localStorage.getItem('token');

            if (dadosDoForm.id) {
                await ApiService.put(`/produtos/${dadosDoForm.id}`, data);
            } else {
                await axios.post(`http://localhost:8080/api/produtos/com-foto?confeiteiroId=${idLogado}`, data, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            }

            console.log("Salvo com sucesso!");
            setModalAberto(false);
            carregarProdutos(); // Recarrega a lista para mostrar o novo/editado doce
            alert("Sucesso! O produto e a imagem foram salvos.");
        } catch (error) {
            console.error("Erro ao salvar:", error.response?.data || error.message);
            alert("Erro ao salvar o produto. Verifique a conexão com o servidor.");
        }
    };

    const toggleProduto = (id, preco) => {
        setArrayDeIdsSelecionados(prev => {
            if (prev.includes(id)) {
                // Se já está na lista, remove (desmarcou)
                setValorTotal(valor => valor - preco);
                return prev.filter(item => item !== id);
            } else {
                // Se não está, adiciona (marcou)
                setValorTotal(valor => valor + preco);
                return [...prev, id];
            }
        });
    };

    const handleSaveKit = async () => {
        if (!nomeDoKit.trim()) {
            alert("Por favor, dê um nome ao kit antes de salvar.");
            return;
        }

        try {
            const idConfeiteiroLogado = AuthService.getUserId();
            const kitPayload = {
                nome: nomeDoKit,
                descricao: descricaoDoKit,
                precoTotal: parseFloat(valorTotal.toFixed(2)),
                confeiteiroId: parseInt(idConfeiteiroLogado),
                produtosIds: arrayDeIdsSelecionados
            };

            // Enviando como Multipart para o novo endpoint
            const data = new FormData();
            data.append("kit", new Blob([JSON.stringify(kitPayload)], { type: "application/json" }));

            if (editingItem) {
                // Se houver um item sendo editado, atualiza (PUT)
                await ApiService.put(`/produtos/kit/${editingItem.id}`, data);
                alert("Kit atualizado com sucesso!");
            } else {
                // Caso contrário, cria um novo (POST)
                await ApiService.post("/produtos/kit", data);
                alert("Kit salvo com sucesso!");
            }
            
            setNomeDoKit('');
            setDescricaoDoKit('');
            setArrayDeIdsSelecionados([]);
            setValorTotal(0);
            setEditingItem(null);
        } catch (error) {
            console.error("Erro ao salvar kit:", error);
            alert("Erro ao salvar o kit. Verifique a conexão.");
        }
    };

    // Criamos a lista de produtos disponíveis filtrando os que não estão desativados
    const produtosDisponiveis = produtos.filter(p => p.disponivel !== false);

return (
    <div style={{ padding: '20px' }}>
        <h1 style={{ color: '#ff69b4', marginBottom: '20px' }}>Meu Cardápio</h1>
        
        <div style={{ 
            marginBottom: '20px', 
            padding: '15px', 
            backgroundColor: '#fff0f5', 
            borderRadius: '8px', 
            border: '1px solid #ff69b4',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <div>
                <h3 style={{ margin: 0, color: '#ff69b4' }}>Preço Sugerido: R$ {valorTotal.toFixed(2)}</h3>
                <small>{arrayDeIdsSelecionados.length} itens selecionados</small>
                
                {arrayDeIdsSelecionados.length > 0 && (
                    <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <input 
                            type="text"
                            placeholder="Nome do Kit (ex: Combo Festa)"
                            value={nomeDoKit}
                            onChange={(e) => setNomeDoKit(e.target.value)}
                            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ff69b4', outline: 'none' }}
                        />
                        <textarea 
                            placeholder="Descrição do kit..."
                            value={descricaoDoKit}
                            onChange={(e) => setDescricaoDoKit(e.target.value)}
                            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ff69b4', outline: 'none', resize: 'none' }}
                        />
                        <button 
                            onClick={handleSaveKit}
                            style={{ padding: '8px 15px', backgroundColor: '#ff69b4', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                            Salvar Kit
                        </button>
                    </div>
                )}
            </div>
            <button 
                onClick={() => { setProdutoParaEditar(null); setModalAberto(true); }}
                style={{ padding: '10px 20px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
        + Adicionar Novo Doce
    </button>
        </div>

        <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
            gap: '25px',
            marginTop: '20px' 
        }}>
            {produtosDisponiveis.map(produto => (
                <div key={produto.id} style={{
                    backgroundColor: '#fff',
                    border: 'none',
                    padding: '0',
                    borderRadius: '15px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    overflow: 'hidden',
                    transition: 'transform 0.2s',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    {/* Exibição da Imagem do Produto vinda do Backend */}
                    <div style={{ height: '180px', overflow: 'hidden', borderTopLeftRadius: '15px', borderTopRightRadius: '15px', backgroundColor: '#f0f0f0' }}>
                        <img 
                            // Idealmente, a URL base deve vir de uma configuração global
                            src={produto.imagemUrl ? `http://localhost:8080/uploads/${produto.imagemUrl}` : "/img/placeholder.png"}
                            alt={produto.nome}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => { 
                                e.target.onerror = null; 
                                e.target.src = "/img/sem-foto.png"; 
                            }}
                        />
                    </div>
                    
                    <div style={{ padding: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <h3 style={{ margin: '0 0 10px 0', color: '#333', fontSize: '1.4rem' }}>{produto.nome}</h3>
                            <input 
                                type="checkbox" 
                                checked={arrayDeIdsSelecionados.includes(produto.id)}
                                onChange={() => toggleProduto(produto.id, parseFloat(produto.preco))}
                                style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#ff69b4' }}
                                title="Selecionar para o cálculo sugerido"
                            />
                        </div>
                        
                        <p style={{ color: '#666', fontSize: '0.9rem', minHeight: '40px' }}>{produto.descricao}</p>
                        
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            marginTop: '15px'
                        }}>
                            <span style={{ 
                                fontSize: '1.2rem', 
                                fontWeight: 'bold', 
                                color: '#ff69b4' 
                            }}>
                                R$ {parseFloat(produto.preco).toFixed(2)}
                            </span>
                            
                            <button 
                                onClick={() => { setProdutoParaEditar(produto); setModalAberto(true); }}
                                style={{ 
                                    padding: '8px 15px', 
                                    backgroundColor: '#f8f9fa', 
                                    border: '1px solid #ff69b4', 
                                    color: '#ff69b4',
                                    borderRadius: '20px',
                                    cursor: 'pointer',
                                    fontWeight: '600'
                                }}
                            >
                                Editar
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {modalAberto && (
            <ProdutoForm 
                produto={produtoParaEditar} 
                onClose={() => setModalAberto(false)} 
                onSave={handleSalvar} 
            />
        )}
    </div>
    );
};

export default Cardapio;