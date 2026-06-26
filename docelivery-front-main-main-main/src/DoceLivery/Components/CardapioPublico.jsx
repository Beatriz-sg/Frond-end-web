import React, { useState, useEffect } from 'react';
import ProductService from '../services/produtoService';
import ApiService from '../services/api';
import Styles from './CardapioPublico.module.css';
import { useCartStore } from '../context/CartContext.jsx';
import { IoCartOutline, IoCalendarOutline, IoCloseOutline, IoInformationCircleOutline, IoStorefront, IoGift } from 'react-icons/io5';
import { API_BASE_URL, API_UPLOADS_URL } from '../config/api.config';

const IMAGE_URL = API_UPLOADS_URL;

const buildImageSrc = (rawImage) => {
    if (!rawImage) return null;
    const src = String(rawImage).trim();
    if (!src) return null;
    if (src.startsWith('http') || src.startsWith('//')) return src;
    if (src.startsWith('/uploads/') || src.startsWith('/imagens/') || src.startsWith('/') || src.startsWith('uploads/') || src.startsWith('imagens/')) {
        return src.startsWith('/') ? `${API_BASE_URL}${src}` : `${API_BASE_URL}/${src}`;
    }
    return `${IMAGE_URL}/${src}`;
};

const getStoreImageSrc = (store) => {
    return buildImageSrc(store?.imagem || store?.logoUrl || store?.fotoUrl || store?.fotoLoja);
};

const getImageSrc = (produto) => {
    return buildImageSrc(produto?.imagemUrl || produto?.imagem || produto?.fotoUrl || produto?.imageUrl);
};

const CardapioPublico = ({ loja, onOpenEncomendaModal }) => {
    const [produtos, setProdutos] = useState([]);
    const [kits, setKits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [produtoDetalhe, setProdutoDetalhe] = useState(null);
    const [categoriaAtiva, setCategoriaAtiva] = useState('Todos');
    // produtoAvisoMe: holds the product the customer wants to be notified about.
    // null = modal closed. Set to a product object to open the notification modal.
    // Ready for future email/push integration: the product id and name are available here.
    const [produtoAvisoMe, setProdutoAvisoMe] = useState(null);

    const lojaLogoSrc = getStoreImageSrc(loja);
    const lojaNome = loja?.nome || loja?.nomeFantasia || loja?.nomeLoja || 'Cardápio';

    const { addItemToCart, toggleCart } = useCartStore();

    useEffect(() => {
        const fetchMenu = async () => {
            const idParaBuscar = Number(loja?.confeiteiroId) || Number(loja?.id) || Number(loja?.idConfeiteiro);

            if (!idParaBuscar) {
                setLoading(false);
                return;
            }
            try {
                setLoading(true);

                // Busca produtos simples, excluindo kits (categoriaId=12) para evitar duplicidade
                const dataProdutos = await ProductService.getProdutosDaLoja(idParaBuscar).catch(() => []);
                const produtosSemKits = Array.isArray(dataProdutos)
                    ? dataProdutos.filter(p => {
                        const catId = typeof p.categoria === 'object' ? p.categoria?.id : Number(p.categoriaId || p.categoria);
                        return catId !== 12;
                    })
                    : [];
                const produtosUnicos = produtosSemKits.reduce((acc, item) => {
                    if (!acc.some(prod => prod.id === item.id)) acc.push(item);
                    return acc;
                }, []);
                setProdutos(produtosUnicos);

                const produtosMap = new Map(produtosUnicos.map(produto => [Number(produto.id), produto]));

                // Busca kits separadamente pela rota /produtos/kit/confeiteiro/{id}
                const dataKits = await ApiService.get(`/produtos/kit/confeiteiro/${idParaBuscar}`).catch(() => []);
                const kitsComProdutos = Array.isArray(dataKits)
                    ? dataKits.map(kit => {
                        const itensOriginais = Array.isArray(kit.itens) ? kit.itens : [];
                        const produtosIds = Array.isArray(kit.produtosIds) ? kit.produtosIds : [];

                        let itensNormalizados = itensOriginais.map(item => {
                            const produtoId = Number(item?.produtoId || item?.id || item?.produto?.id);
                            const produto = produtosMap.get(produtoId) || item?.produto;
                            return {
                                ...item,
                                produto,
                                nome: item?.nome || produto?.nome
                            };
                        });

                        if (itensNormalizados.length === 0 && produtosIds.length > 0) {
                            itensNormalizados = produtosIds.map(id => {
                                const produtoId = Number(id);
                                const produto = produtosMap.get(produtoId);
                                return produto
                                    ? { produtoId, produto, nome: produto.nome }
                                    : { produtoId };
                            });
                        }

                        return {
                            ...kit,
                            itens: itensNormalizados
                        };
                    })
                    : [];
                setKits(kitsComProdutos);

            } catch (error) {
                console.error('[CardapioPublico] Erro ao carregar cardápio:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchMenu();
    }, [loja]);

    // Show all products with disponivel=true (including estoque=0 — shown as "Sem estoque")
    // Only products with disponivel=false stay hidden
    const produtosDisponiveis = produtos.filter(p => p.disponivel === true);

    // Monta lista de categorias únicas a partir dos produtos
    const categorias = ['Todos', ...new Set(
        produtosDisponiveis
            .map(p => {
                if (typeof p.categoria === 'object') return p.categoria?.nome;
                return p.categoria || 'Outros';
            })
            .filter(Boolean)
    )];

    const produtosFiltrados = categoriaAtiva === 'Todos'
        ? produtosDisponiveis
        : produtosDisponiveis.filter(p => {
            const cat = typeof p.categoria === 'object' ? p.categoria?.nome : p.categoria;
            return cat === categoriaAtiva;
        });

    const handleAdicionarAoCarrinho = (produto) => {
        addItemToCart(
            {
                id: produto.id,
                name: produto.nome,
                price: produto.preco,
                imageUrl: getImageSrc(produto),
            },
            { id: loja?.confeiteiroId || loja?.id, name: loja?.nome },
            1
        );
        toggleCart();
    };

    if (loading) {
        return (
            <div className={Styles.loadingWrapper}>
                <div className={Styles.loadingSpinner}></div>
                <p>Carregando cardápio...</p>
            </div>
        );
    }

    return (
        <div className={Styles.cardapioContainer}>

            {/* CABEÇALHO DA LOJA */}
            <div className={Styles.lojaHeader}>
                <div className={Styles.lojaHeaderContent}>
                    {lojaLogoSrc ? (
                        <img
                            src={lojaLogoSrc}
                            alt={lojaNome}
                            className={Styles.lojaLogo}
                            onError={(e) => { e.target.style.display = 'none'; }}
                        />
                    ) : (
                        <IoStorefront size={22} className={Styles.lojaIcon} />
                    )}
                    <div>
                        <h2 className={Styles.lojaNome}>{lojaNome}</h2>
                        {loja?.descricao && <p className={Styles.lojaDesc}>{loja.descricao}</p>}
                        {loja?.endereco && <p className={Styles.lojaDesc}>📍 {loja.endereco}</p>}
                    </div>
                </div>
            </div>

            {/* BOTÕES DE AÇÃO PRINCIPAL */}
            <div className={Styles.actionBar}>
                <button className={Styles.actionBtnPrimary} onClick={toggleCart}>
                    <IoCartOutline size={20} />
                    <div className={Styles.actionBtnText}>
                        <strong>Pronta Entrega</strong>
                        <small>adicione ao carrinho e receba hoje</small>
                    </div>
                </button>

                <button className={Styles.actionBtnSecondary} onClick={() => onOpenEncomendaModal(true)}>
                    <IoCalendarOutline size={20} />
                    <div className={Styles.actionBtnText}>
                        <strong>Encomendar</strong>
                        <small>agende um pedido personalizado</small>
                    </div>
                </button>
            </div>

            {/* FILTRO POR CATEGORIA */}
            {categorias.length > 1 && (
                <div className={Styles.categoriaBar}>
                    {categorias.map(cat => (
                        <button
                            key={cat}
                            className={`${Styles.categoriaBtn} ${categoriaAtiva === cat ? Styles.categoriaBtnAtivo : ''}`}
                            onClick={() => setCategoriaAtiva(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            )}

            {/* ══ SEÇÃO PRODUTOS ══ */}
            <div className={Styles.menuSection}>
                <div className={Styles.secaoHeader}>
                    <span className={Styles.secaoIcone}>🧁</span>
                    <h3 className={Styles.sectionTitle}>
                        {categoriaAtiva === 'Todos' ? 'Produtos' : categoriaAtiva}
                        <span className={Styles.countBadge}>{produtosFiltrados.length}</span>
                    </h3>
                </div>

                {produtosFiltrados.length > 0 ? (
                    <div className={Styles.grid}>
                        {produtosFiltrados.map(produto => {
                            const semEstoque = produto.estoque !== null && produto.estoque !== undefined && Number(produto.estoque) === 0;
                            return (
                            <div key={produto.id} className={`${Styles.card} ${semEstoque ? Styles.cardSemEstoque : ''}`}>
                                <div className={Styles.imageWrapper}>
                                    {getImageSrc(produto) ? (
                                        <img
                                            src={getImageSrc(produto)}
                                            alt={produto.nome}
                                            onError={(e) => { e.target.parentElement.innerHTML = '<div class="imgFallback">🧁</div>'; }}
                                        />
                                    ) : (
                                        <div className={Styles.imgFallback}>🧁</div>
                                    )}
                                    <div className={semEstoque ? Styles.semEstoqueBadge : Styles.disponibilidadeBadge}>
                                        {semEstoque ? '🚫 Sem estoque' : '✅ Disponível'}
                                    </div>
                                </div>

                                <div className={Styles.cardBody}>
                                    <div>
                                        <h4 className={Styles.produtoNome}>{produto.nome}</h4>
                                        {produto.descricao && (
                                            <p className={Styles.produtoDesc}>{produto.descricao}</p>
                                        )}
                                        {produto.categoria && (
                                            <span className={Styles.categoriaPill}>
                                                {typeof produto.categoria === 'object'
                                                    ? produto.categoria?.nome
                                                    : produto.categoria}
                                            </span>
                                        )}
                                    </div>

                                    <div className={Styles.cardFooter}>
                                        <span className={Styles.preco}>
                                            R$ {Number(produto.preco).toFixed(2)}
                                        </span>
                                        <div className={Styles.cardButtons}>
                                            <button
                                                className={Styles.btnDetalhes}
                                                onClick={() => setProdutoDetalhe(produto)}
                                                title="Ver detalhes"
                                            >
                                                <IoInformationCircleOutline size={16} />
                                                Detalhes
                                            </button>
                                            {semEstoque ? (
                                                <button
                                                    className={Styles.btnAviseme}
                                                    onClick={() => setProdutoAvisoMe(produto)}
                                                    title="Avise-me quando estiver disponível"
                                                >
                                                    🔔 Avise-me
                                                </button>
                                            ) : (
                                                <button
                                                    className={Styles.btnAdicionar}
                                                    onClick={() => handleAdicionarAoCarrinho(produto)}
                                                >
                                                    <IoCartOutline size={16} />
                                                    Adicionar
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className={Styles.emptyState}>
                        <span>🍬</span>
                        <p>Nenhum produto disponível nesta categoria.</p>
                    </div>
                )}
            </div>

            {/* ══ SEÇÃO KITS ══ */}
            <div className={Styles.menuSection}>
                <div className={Styles.secaoHeader}>
                    <span className={Styles.secaoIcone}>🎁</span>
                    <h3 className={Styles.sectionTitle}>
                        Kits & Combos
                        <span className={`${Styles.countBadge} ${Styles.countBadgeKit}`}>{kits.length}</span>
                    </h3>
                </div>

                {kits.length > 0 ? (
                    <div className={Styles.kitsGrid}>
                        {kits.map(kit => (
                            <div key={kit.id} className={Styles.kitCard}>
                                <div className={Styles.kitIconBox}>
                                    <IoGift size={28} />
                                </div>
                                <div className={Styles.kitInfo}>
                                    <h4 className={Styles.kitNome}>{kit.nome}</h4>
                                    {kit.descricao && <p className={Styles.kitDesc}>{kit.descricao}</p>}
                                    {kit.itens && kit.itens.length > 0 && (
                                        <div className={Styles.kitItens}>
                                            {kit.itens.slice(0, 3).map((item, i) => (
                                                <span key={i} className={Styles.kitItemPill}>
                                                    {item.produto?.nome || item.nome || `Item ${i + 1}`}
                                                </span>
                                            ))}
                                            {kit.itens.length > 3 && (
                                                <span className={Styles.kitItemPill}>+{kit.itens.length - 3} mais</span>
                                            )}
                                        </div>
                                    )}
                                    <div className={Styles.kitFooter}>
                                        <span className={Styles.kitPreco}>
                                            R$ {Number(kit.precoTotal || kit.preco || 0).toFixed(2)}
                                        </span>
                                        <button
                                            className={Styles.btnEncomendarKit}
                                            onClick={() => onOpenEncomendaModal(true)}
                                        >
                                            <IoCalendarOutline size={15} />
                                            Encomendar Kit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={Styles.emptyState}>
                        <span>🎁</span>
                        <p>Nenhum kit disponível nesta confeitaria.</p>
                    </div>
                )}
            </div>

            {/* MODAL AVISE-ME — produto temporariamente sem estoque */}
            {produtoAvisoMe && (
                <div
                    className={Styles.modalOverlay}
                    onClick={() => setProdutoAvisoMe(null)}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="avisome-titulo"
                >
                    <div className={Styles.avisoMeModal} onClick={e => e.stopPropagation()}>
                        <button
                            className={Styles.modalClose}
                            onClick={() => setProdutoAvisoMe(null)}
                            aria-label="Fechar"
                        >
                            <IoCloseOutline size={24} />
                        </button>

                        {/* Ícone de notificação */}
                        <div className={Styles.avisoMeIconWrapper}>
                            <span className={Styles.avisoMeIcon}>🔔</span>
                        </div>

                        <div className={Styles.avisoMeBody}>
                            <h3 id="avisome-titulo" className={Styles.avisoMeTitulo}>
                                Produto temporariamente indisponível
                            </h3>

                            <p className={Styles.avisoMeProdutoNome}>
                                {produtoAvisoMe.nome}
                            </p>

                            <p className={Styles.avisoMeTexto}>
                                Este produto está temporariamente fora de estoque.
                                Deseja ser notificado assim que ele estiver disponível novamente?
                            </p>

                            <div className={Styles.avisoMeActions}>
                                <button
                                    className={Styles.avisoMeBtnCancelar}
                                    onClick={() => setProdutoAvisoMe(null)}
                                >
                                    Cancelar
                                </button>
                                <button
                                    className={Styles.avisoMeBtnConfirmar}
                                    onClick={() => {
                                        // TODO: integrar com serviço de notificações (e-mail / push)
                                        // Dados disponíveis: produtoAvisoMe.id, produtoAvisoMe.nome, loja?.id
                                        console.info('[AvisoMe] Cliente solicitou notificação:', {
                                            produtoId: produtoAvisoMe.id,
                                            produtoNome: produtoAvisoMe.nome,
                                            lojaId: loja?.confeiteiroId || loja?.id,
                                            lojaNome: loja?.nome,
                                        });
                                        setProdutoAvisoMe(null);
                                    }}
                                >
                                    🔔 Quero ser avisado
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL DE DETALHES DO PRODUTO */}
            {produtoDetalhe && (
                <div className={Styles.modalOverlay} onClick={() => setProdutoDetalhe(null)}>
                    <div className={Styles.modal} onClick={e => e.stopPropagation()}>
                        <button className={Styles.modalClose} onClick={() => setProdutoDetalhe(null)}>
                            <IoCloseOutline size={24} />
                        </button>

                        {getImageSrc(produtoDetalhe) ? (
                            <img
                                src={getImageSrc(produtoDetalhe)}
                                alt={produtoDetalhe.nome}
                                className={Styles.modalImg}
                                onError={(e) => { e.target.style.display = 'none'; }}
                            />
                        ) : (
                            <div className={Styles.modalImgFallback}>🧁</div>
                        )}

                        <div className={Styles.modalBody}>
                            <div className={Styles.modalHeader}>
                                <h3>{produtoDetalhe.nome}</h3>
                                <span className={Styles.modalPreco}>
                                    R$ {Number(produtoDetalhe.preco).toFixed(2)}
                                </span>
                            </div>

                            {produtoDetalhe.descricao && (
                                <p className={Styles.modalDesc}>{produtoDetalhe.descricao}</p>
                            )}

                            <div className={Styles.modalInfoGrid}>
                                {produtoDetalhe.categoria && (
                                    <div className={Styles.modalInfoItem}>
                                        <span className={Styles.modalInfoLabel}>Categoria</span>
                                        <span className={Styles.modalInfoValue}>
                                            {typeof produtoDetalhe.categoria === 'object'
                                                ? produtoDetalhe.categoria?.nome
                                                : produtoDetalhe.categoria}
                                        </span>
                                    </div>
                                )}
                                {produtoDetalhe.estoque !== undefined && (
                                    <div className={Styles.modalInfoItem}>
                                        <span className={Styles.modalInfoLabel}>Estoque</span>
                                        <span className={Styles.modalInfoValue}>{produtoDetalhe.estoque} un.</span>
                                    </div>
                                )}
                                <div className={Styles.modalInfoItem}>
                                    <span className={Styles.modalInfoLabel}>Disponibilidade</span>
                                    {Number(produtoDetalhe.estoque) === 0 ? (
                                        <span className={`${Styles.modalInfoValue} ${Styles.semEstoqueText}`}>
                                            🚫 Sem estoque
                                        </span>
                                    ) : (
                                        <span className={`${Styles.modalInfoValue} ${Styles.disponivel}`}>
                                            ✅ Disponível
                                        </span>
                                    )}
                                </div>
                                <div className={Styles.modalInfoItem}>
                                    <span className={Styles.modalInfoLabel}>Loja</span>
                                    <span className={Styles.modalInfoValue}>{loja?.nome}</span>
                                </div>
                            </div>

                            <div className={Styles.modalActions}>
                                <button
                                    className={Styles.modalBtnEncomenda}
                                    onClick={() => { setProdutoDetalhe(null); onOpenEncomendaModal(true); }}
                                >
                                    <IoCalendarOutline size={18} />
                                    Encomendar
                                </button>
                                {Number(produtoDetalhe.estoque) === 0 ? (
                                    <button
                                        className={Styles.modalBtnAviseme}
                                        onClick={() => { setProdutoDetalhe(null); setProdutoAvisoMe(produtoDetalhe); }}
                                    >
                                        🔔 Avise-me quando estiver disponível
                                    </button>
                                ) : (
                                    <button
                                        className={Styles.modalBtnCarrinho}
                                        onClick={() => { handleAdicionarAoCarrinho(produtoDetalhe); setProdutoDetalhe(null); }}
                                    >
                                        <IoCartOutline size={18} />
                                        Adicionar ao Carrinho
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CardapioPublico;
