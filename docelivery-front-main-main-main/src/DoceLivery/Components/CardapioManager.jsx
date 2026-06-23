import React, { useState, useEffect, useCallback } from "react";
import ApiService from "../services/api";
import AuthService from "../services/authService";
import ProdutoService from "../services/produtoService";
import KitService from "../services/kitService";
import Styles from "./CardapioManager.module.css";
import {
  IoAdd,
  IoCreate,
  IoTrash,
  IoCloudUpload,
  IoClose,
  IoFastFood,
  IoPricetag,
  IoCube,
  IoList,
  IoDocumentText,
  IoGrid,
  IoSearch,
  IoFilter,
  IoGift,
} from "react-icons/io5";
import { IMAGE_MAP } from "../data/imageImports";
import ImageUploader from "./ImageUploader";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const IMAGE_URL = `${API_BASE_URL}/uploads`;

const buildImageSrc = (rawImage) => {
  if (!rawImage) return null;
  const src = String(rawImage).trim();
  if (!src) return null;
  if (src.startsWith("http") || src.startsWith("//")) return src;
  if (
    src.startsWith("/uploads/") ||
    src.startsWith("/imagens/") ||
    src.startsWith("/")
  ) {
    return `${API_BASE_URL}${src}`;
  }
  return `${IMAGE_URL}/${src}`;
};

const getProdutoImageSrc = (produto) => {
  const raw =
    produto?.imagemUrl ||
    produto?.imagem ||
    produto?.fotoUrl ||
    produto?.imageUrl;
  const src = buildImageSrc(raw);
  if (src) return src;
  return (
    IMAGE_MAP[produto?.imagem] ||
    IMAGE_MAP[produto?.imagemUrl] ||
    IMAGE_MAP["brigadeiro"]
  );
};

const CardapioManager = () => {
  const [produtosDisponiveis, setProdutosDisponiveis] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [arquivoImagem, setArquivoImagem] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Novos estados para o layout atualizado
  const [viewMode, setViewMode] = useState("grid");
  const [busca, setBusca] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("todos");
  const [modalType, setModalType] = useState("produto");
  const [combos, setCombos] = useState([]);
  const [buscaProdutoKit, setBuscaProdutoKit] = useState("");

  const confeiteiroId = AuthService.getUserId();

  const [formData, setFormData] = useState({
    nome: "",
    preco: "",
    estoque: "0",
    categoryId: null,
    categoria: "",
    descricao: "",
    disponivel: true,
    imagem: "",
    imagemCustom: null,
    produtos: [],
  });

  const imagensDisponiveis = Object.keys(IMAGE_MAP);

  const normalizeCategoryKey = (value = "") =>
    value
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-");

  const categoryMap = {
    bolos: { id: 1, nome: "Bolos", icone: "🎂" },
    cupcakes: { id: 2, nome: "Cupcakes", icone: "🧁" },
    doces: { id: 3, nome: "Doces", icone: "🍬" },
    tortas: { id: 4, nome: "Tortas", icone: "🥧" },
    churros: { id: 5, nome: "Churros", icone: "🥖" },
    brigadeiros: { id: 6, nome: "Brigadeiros", icone: "🟤" },
    brownies: { id: 7, nome: "Brownies", icone: "🍫" },
    cookies: { id: 8, nome: "Cookies", icone: "🍪" },
    "paes-de-mel": { id: 9, nome: "Pães de Mel", icone: "🍯" },
    bebidas: { id: 10, nome: "Bebidas", icone: "🥤" },
    "doces-finos": { id: 11, nome: "Doces Finos", icone: "💎" },
    "kit-festa": { id: 12, nome: "Kit Festa", icone: "🎁" },
    "copo-da-felicidade": { id: 13, nome: "Copo da Felicidade", icone: "🍨" },
  };

  const categorias = ["todos", ...Object.keys(categoryMap)];

  const getCategoryKeyById = (id) => {
    const numericId = Number(id);
    if (Number.isNaN(numericId)) return "";
    return (
      Object.entries(categoryMap).find(
        ([, value]) => value.id === numericId,
      )?.[0] || ""
    );
  };

  const getCategoryInfo = (categoriaInput) => {
    if (categoriaInput == null) return null;

    if (typeof categoriaInput === "object") {
      return (
        categoryMap[
          normalizeCategoryKey(categoriaInput.descricao || categoriaInput.nome)
        ] || null
      );
    }
    const stringValue = categoriaInput.toString();
    const maybeId = Number(stringValue);
    if (!Number.isNaN(maybeId) && stringValue.trim() !== "") {
      return (
        Object.values(categoryMap).find((cat) => cat.id === maybeId) || null
      );
    }
    return categoryMap[normalizeCategoryKey(stringValue)] || null;
  };

  const getKitSelectedProductIds = (kitItem) => {
    if (!kitItem) return [];
    if (Array.isArray(kitItem.produtosIds) && kitItem.produtosIds.length > 0) {
      return kitItem.produtosIds.map((id) => Number(id)).filter(Boolean);
    }
    if (Array.isArray(kitItem.itens) && kitItem.itens.length > 0) {
      return kitItem.itens
        .map((item) => Number(item?.produtoId || item?.id || item?.produto?.id))
        .filter(Boolean);
    }
    return [];
  };

  const carregarProdutos = useCallback(async () => {
    if (!confeiteiroId) return;
    try {
      const data = await ProdutoService.getProdutosDaLoja(confeiteiroId);
      // Filtra kits da lista de produtos (categoriaId 12 = Kit Festa) para evitar duplicidade
      const apenasP = Array.isArray(data)
        ? data.filter((p) => {
            const catId =
              typeof p.categoria === "object"
                ? p.categoria?.id
                : Number(p.categoriaId || p.categoria);
            return catId !== 12;
          })
        : [];
      setProdutosDisponiveis(apenasP);

      const kitsData = await ApiService.get(
        `/produtos/kit/confeiteiro/${confeiteiroId}`,
      ).catch(() => []);
      setCombos(Array.isArray(kitsData) ? kitsData : []);
    } catch (error) {
      console.error("Erro ao carregar dados do cardápio:", error);
    }
  }, [confeiteiroId]);

  useEffect(() => {
    carregarProdutos();
  }, [carregarProdutos]);

  const handleOpenModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    setBuscaProdutoKit("");
    if (item) {
      // Protege quando item.categoria pode ser um objeto { id, nome }
      const categoriaNome =
        typeof item.categoria === "object"
          ? item.categoria?.descricao
          : item.categoria;
      const categoriaKey =
        normalizeCategoryKey(categoriaNome || "") ||
        getCategoryKeyById(item.categoriaId);
      const selecionados = getKitSelectedProductIds(item);
      setFormData({
        nome: item.nome || "",
        preco: item.preco ?? "",
        estoque: item.estoque ?? "0",
        categoryId: item.categoriaId || categoryMap[categoriaKey]?.id || null,
        categoria: categoriaKey,
        descricao: item.descricao || "",
        disponivel: item.disponivel ?? true,
        imagem: item.imagem || "",
        imagemCustom: null,
        produtos: selecionados,
      });
      setPreviewUrl(getProdutoImageSrc(item));
    } else {
      setFormData({
        nome: "",
        preco: "",
        estoque: "0",
        categoryId: null,
        categoria: "",
        descricao: "",
        disponivel: true,
        imagem: "",
        imagemCustom: null,
        produtos: [],
      });
      setPreviewUrl(null);
      setArquivoImagem(null);
    }
    setShowModal(true);
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm(`Deseja realmente excluir este ${type}?`)) return;
    try {
      if (type === "produto") {
        await ProdutoService.deletarProduto(id);
      } else {
        await KitService.deleteKit(id);
      }
      alert("Excluído com sucesso!");
      carregarProdutos();
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir item.");
    }
  };

  const toggleDisponibilidade = async (id) => {
    const produto = produtosDisponiveis.find((p) => p.id === id);
    if (!produto) return;
    try {
      // Extrai nome da categoria (pode ser string, objeto ou ID) e mapeia para ID
      const categoriaNome =
        typeof produto.categoria === "object"
          ? produto.categoria?.descricao
          : produto.categoria;
      const mappedCategoriaId = getCategoryInfo(categoriaNome)?.id || null;

      const atualizado = {
        nome: produto.nome,
        preco: parseFloat(produto.preco) || 0,
        estoque: parseInt(produto.estoque) || 0,
        descricao: produto.descricao || "",
        disponivel: !produto.disponivel,
        categoriaId: mappedCategoriaId,
      };

      await ProdutoService.atualizarProduto(id, atualizado, null);
      carregarProdutos();
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar disponibilidade.");
    }
  };

  const produtosFiltrados = produtosDisponiveis.filter((p) => {
    const matchBusca = p.nome.toLowerCase().includes(busca.toLowerCase());
    const categoriaNome =
      typeof p.categoria === "object" ? p.categoria?.nome : p.categoria;
    const categoriaKey = normalizeCategoryKey(categoriaNome || "");
    const matchCategoria =
      filtroCategoria === "todos" || categoriaKey === filtroCategoria;
    return matchBusca && matchCategoria;
  });

  const getLoggedUser = () => {
    const rawUser =
      localStorage.getItem("user") ||
      localStorage.getItem("dadosUsuario") ||
      localStorage.getItem("dadosConfeiteiro");
    if (!rawUser) return {};
    try {
      return JSON.parse(rawUser);
    } catch (error) {
      console.warn(
        "Não foi possível parsear o usuário logado do localStorage:",
        error,
      );
      return {};
    }
  };

  const handleSaveKit = async (e) => {
    if (e?.preventDefault) e.preventDefault();

    const usuarioLogado = getLoggedUser();
    const logadoConfeiteiroId = usuarioLogado.id || parseInt(confeiteiroId, 10);

    if (!logadoConfeiteiroId) {
      alert("ID do confeiteiro não encontrado.");
      return;
    }

    const produtosSelecionados = produtosDisponiveis.filter((produto) =>
      formData.produtos.includes(produto.id),
    );
    if (produtosSelecionados.length === 0) {
      alert("Selecione ao menos um produto para montar o kit.");
      return;
    }

    const dadosDoKit = {
      nome: formData.nome,
      descricao: formData.descricao,
      preco: parseFloat(formData.preco) || 0,
      confeiteiroId: parseInt(logadoConfeiteiroId, 10),
      categoriaId: 12,
      itens: produtosSelecionados.map((produto) => ({
        produtoId: produto.id,
        quantidade: 1,
      })),
    };

    // Usa nome diferente para não sobrescrever o estado formData
    const multipart = new FormData();
    if (arquivoImagem) multipart.append("imagem", arquivoImagem);
    multipart.append(
      "kit",
      new Blob([JSON.stringify(dadosDoKit)], { type: "application/json" }),
    );

    try {
      await ApiService.post("/produtos/kit", multipart);
      alert("Kit cadastrado com sucesso!");
      setShowModal(false);
      carregarProdutos();
    } catch (error) {
      console.error("Erro ao salvar o kit:", error);
      alert("Erro ao salvar o kit. Verifique o console.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArquivoImagem(file);
      setPreviewUrl(URL.createObjectURL(file));
      setFormData({ ...formData, imagemCustom: URL.createObjectURL(file) });
    }
  };

  const handleSave = async () => {
    if (modalType === "combo") return handleSaveKit();

    try {
      // ✅ PASSO 1: Validações básicas
      if (!formData.nome || !formData.nome.trim()) {
        alert("❌ Nome do produto é obrigatório.");
        return;
      }

      if (!formData.preco || parseFloat(formData.preco) <= 0) {
        alert("❌ Preço deve ser maior que R$ 0,00.");
        return;
      }

      // ✅ PASSO 2: Validação de categoria (CRÍTICO)
      if (!formData.categoria || formData.categoria === "") {
        alert(
          "❌ Categoria é obrigatória. Selecione uma categoria para o produto.",
        );
        return;
      }

      // ✅ PASSO 3: Mapear nome da categoria para ID numérico usando o categoryMap enriquecido
      const categoriaInfo = getCategoryInfo(formData.categoria);
      if (!categoriaInfo) {
        alert(
          `❌ Categoria inválida: "${formData.categoria}". Verifique a configuração.`,
        );
        console.error("Erro de mapeamento - categoria:", {
          categoriaSelecionada: formData.categoria,
          categoryMapCompleto: categoryMap,
        });
        return;
      }
      const mappedId = categoriaInfo.id;

      // ✅ PASSO 4: Construir objeto exatamente como o backend espera
      // O backend espera um DTO com essas propriedades exatas
      const produtoParaEnviar = {
        nome: formData.nome.trim(),
        preco: parseFloat(formData.preco),
        estoque: parseInt(formData.estoque) || 0,
        descricao: formData.descricao || "",
        disponivel:
          formData.disponivel === undefined ? true : formData.disponivel,
        categoriaId: mappedId, // 🔴 IMPORTANTE: Enviar como NÚMERO, não como string ou objeto
      };

      // ✅ PASSO 5: Log detalhado para debug
      console.group("📦 CardapioManager.handleSave() - Iniciando envio");
      console.log("Modo:", editingItem ? "EDIÇÃO" : "CRIAÇÃO");
      console.log("Produto para enviar:", produtoParaEnviar);
      console.log(
        "Imagem:",
        arquivoImagem
          ? `${arquivoImagem.name} (${arquivoImagem.size} bytes)`
          : "nenhuma",
      );
      console.log("Confeiteiro ID:", confeiteiroId);
      console.groupEnd();

      // ✅ PASSO 6: Chamar o serviço com os dados validados
      if (editingItem) {
        console.log(`🔄 Atualizando produto ID ${editingItem.id}...`);
        await ProdutoService.atualizarProduto(
          editingItem.id,
          produtoParaEnviar,
          arquivoImagem,
        );
        alert("✅ Produto atualizado com sucesso!");
      } else {
        console.log(
          `➕ Criando novo produto para confeiteiro ${confeiteiroId}...`,
        );
        await ProdutoService.criarProduto(
          produtoParaEnviar,
          arquivoImagem,
          confeiteiroId,
        );
        alert("✅ Produto criado com sucesso!");
      }

      // ✅ PASSO 7: Limpar UI e recarregar
      setShowModal(false);
      setArquivoImagem(null);
      setPreviewUrl(null);
      carregarProdutos();
    } catch (error) {
      console.error("❌ Erro ao salvar produto:", error);
      console.log("Detalhes do erro:", {
        mensagem: error.message,
        stack: error.stack,
        response: error.response?.data,
      });
      alert(`❌ Erro ao salvar produto: ${error.message || "Tente novamente"}`);
    }
  };

  return (
    <div className={Styles.cardapioManager}>
      <div className={Styles.header}>
        <div className={Styles.headerLeft}>
          <h2>Gerenciar Cardápio</h2>
          <p>Adicione, edite e organize seus produtos</p>
        </div>
        <div className={Styles.headerActions}>
          <div className={Styles.viewToggle}>
            <button
              className={`${Styles.toggleBtn} ${viewMode === "grid" ? Styles.active : ""}`}
              onClick={() => setViewMode("grid")}
            >
              <IoGrid size={20} />
            </button>
            <button
              className={`${Styles.toggleBtn} ${viewMode === "list" ? Styles.active : ""}`}
              onClick={() => setViewMode("list")}
            >
              <IoList size={20} />
            </button>
          </div>
          <button
            className={Styles.addBtn}
            onClick={() => handleOpenModal("produto")}
          >
            <IoAdd size={20} />
            Produto
          </button>
          <button
            className={Styles.addBtn}
            onClick={() => handleOpenModal("combo")}
          >
            <IoGift size={20} />
            Kit Festa
          </button>
        </div>
      </div>

      <div className={Styles.filters}>
        <div className={Styles.searchBox}>
          <IoSearch size={20} />
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
        <div className={Styles.categoryFilter}>
          <IoFilter size={20} />
          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
          >
            <option value="todos">Todas Categorias</option>
            {categorias
              .filter((c) => c !== "todos")
              .map((cat) => (
                <option
                  key={cat}
                  value={cat}
                >{`${categoryMap[cat].icone} ${categoryMap[cat].nome}`}</option>
              ))}
          </select>
        </div>
      </div>

      {/* ══ SEÇÃO: PRODUTOS ══ */}
      <div className={Styles.secaoHeader}>
        <span className={Styles.secaoIcone}>🧁</span>
        <h3>Produtos</h3>
        <span className={Styles.secaoBadge}>{produtosFiltrados.length}</span>
      </div>

      <div
        className={`${Styles.produtosGrid} ${viewMode === "list" ? Styles.listView : ""}`}
      >
        {produtosFiltrados.length > 0 ? (
          produtosFiltrados.map((produto) => (
            <div
              key={produto.id}
              className={`${Styles.produtoCard} ${!produto.disponivel ? Styles.indisponivel : ""}`}
            >
              <div className={Styles.produtoImagem}>
                <img
                  src={produto.imagemCustom || getProdutoImageSrc(produto)}
                  alt={produto.nome}
                />
                {!produto.disponivel && (
                  <div className={Styles.indisponivelOverlay}>Indisponível</div>
                )}
              </div>
              <div className={Styles.produtoInfo}>
                <h3>{produto.nome}</h3>
                <p>{produto.descricao}</p>
                <div className={Styles.produtoMeta}>
                  <span className={Styles.preco}>
                    R$ {Number(produto.preco || 0).toFixed(2)}
                  </span>
                  <span className={Styles.categoria}>
                    {getCategoryInfo(produto.categoria || produto.categoriaId)
                      ? `${getCategoryInfo(produto.categoria || produto.categoriaId).icone} ${getCategoryInfo(produto.categoria || produto.categoriaId).nome}`
                      : "Sem Categoria"}
                  </span>
                </div>
              </div>
              <div className={Styles.produtoActions}>
                <button
                  className={Styles.toggleBtn}
                  onClick={() => toggleDisponibilidade(produto.id)}
                >
                  {produto.disponivel ? "Desativar" : "Ativar"}
                </button>
                <button
                  className={Styles.editBtn}
                  onClick={() => handleOpenModal("produto", produto)}
                >
                  <IoCreate size={16} />
                </button>
                <button
                  className={Styles.deleteBtn}
                  onClick={() => handleDelete(produto.id, "produto")}
                >
                  <IoTrash size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className={Styles.emptyMessage}>Nenhum produto cadastrado.</p>
        )}
      </div>

      {/* ══ SEÇÃO: KITS ══ */}
      <div className={Styles.secaoHeader} style={{ marginTop: 16 }}>
        <span className={Styles.secaoIcone}>🎁</span>
        <h3>Kits & Combos</h3>
        <span className={`${Styles.secaoBadge} ${Styles.secaoBadgeKit}`}>
          {combos.length}
        </span>
      </div>

      {combos.length > 0 ? (
        <section className={Styles.kitsSection}>
          <div className={Styles.combosGrid}>
            {combos.map((combo) => (
              <div key={combo.id} className={Styles.comboCard}>
                <div className={Styles.kitIconWrapper}>
                  <IoGift size={24} />
                </div>
                <div className={Styles.comboInfo}>
                  <h4>{combo.nome}</h4>
                  <p>{combo.descricao}</p>
                  {getKitSelectedProductIds(combo).length > 0 && (
                    <p className={Styles.comboProdutos}>
                      <strong>Produtos:</strong>{" "}
                      {getKitSelectedProductIds(combo)
                        .map(
                          (id) =>
                            produtosDisponiveis.find(
                              (p) => Number(p.id) === Number(id),
                            )?.nome,
                        )
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  )}
                  <span className={Styles.comboPreco}>
                    R$ {Number(combo.precoTotal || 0).toFixed(2)}
                  </span>
                </div>
                <div className={Styles.comboActions}>
                  <button onClick={() => handleOpenModal("combo", combo)}>
                    <IoCreate size={16} />
                  </button>
                  <button onClick={() => handleDelete(combo.id, "combo")}>
                    <IoTrash size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <div className={Styles.emptyKits}>
          <span>🎁</span>
          <p>
            Nenhum kit cadastrado ainda. Clique em <strong>Kit Festa</strong>{" "}
            para criar.
          </p>
        </div>
      )}

      {showModal && (
        <div className={Styles.modalOverlay}>
          <div className={Styles.modal}>
            <div className={Styles.modalHeader}>
              <div>
                <h3>
                  {editingItem ? "✏️ Editar cadastro" : "➕ Novo cadastro"}
                </h3>
                <p className={Styles.modalSubtitle}>
                  Use imagens e informações claras para destacar seus produtos
                  no delivery.
                </p>
              </div>
              <button onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div className={Styles.modalContent}>
              {/* ===== SEÇÃO DE CADASTRO ===== */}
              <div className={Styles.formSection}>
                <div className={Styles.formSectionTitle}>
                  📋 Cadastro do produto
                </div>
                <div className={Styles.formGroup}>
                  <label>Nome *</label>
                  <input
                    type="text"
                    placeholder={
                      modalType === "produto"
                        ? "Ex: Brigadeiro Gourmet"
                        : "Ex: Combo Família - 50 Doces"
                    }
                    value={formData.nome}
                    onChange={(e) =>
                      setFormData({ ...formData, nome: e.target.value })
                    }
                  />
                </div>

                <div className={Styles.twoColumnGrid}>
                  <div className={Styles.formGroup}>
                    <label>Preço Final (R$) *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.preco}
                      onChange={(e) =>
                        setFormData({ ...formData, preco: e.target.value })
                      }
                      placeholder="0.00"
                    />
                  </div>

                  {modalType === "produto" ? (
                    <div className={Styles.formGroup}>
                      <label>Categoria *</label>
                      <select
                        value={formData.categoria}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            categoria: e.target.value,
                          })
                        }
                        style={{
                          borderColor: formData.categoria
                            ? "#D1D5DB"
                            : "#EF4444",
                        }}
                      >
                        <option value="">Selecione...</option>
                        {categorias
                          .filter((c) => c !== "todos")
                          .map((cat) => (
                            <option key={cat} value={cat}>
                              {`${categoryMap[cat].icone} ${categoryMap[cat].nome}`}
                            </option>
                          ))}
                      </select>
                    </div>
                  ) : (
                    <div className={Styles.formGroup}>
                      <label>Estoque</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.estoque}
                        onChange={(e) =>
                          setFormData({ ...formData, estoque: e.target.value })
                        }
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* ===== SEÇÃO DE IMAGEM ===== */}
              <div className={Styles.formSection}>
                <div className={Styles.formSectionTitle}>
                  🖼️ Adiciomar Imagem
                </div>
                <div
                  onClick={() =>
                    document.getElementById("file-upload-modal").click()
                  }
                  className={Styles.imagePreviewContainer}
                >
                  <div className={Styles.imagePreviewBox}>
                    {previewUrl ? (
                      <img src={previewUrl} alt="Preview" />
                    ) : (
                      <IoCloudUpload size={40} color="#7C3AED" />
                    )}
                  </div>
                  <div>
                    <div className={Styles.uploadLabel}>
                      Arraste ou clique para adicionar imagem
                    </div>
                    <div className={Styles.uploadHint}>
                      PNG, JPG, WEBP (máx. 5MB)
                    </div>
                  </div>
                </div>
                <input
                  id="file-upload-modal"
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  style={{ display: "none" }}
                />
                <div className={Styles.imageUploadActions}>
                  <div className={Styles.uploadGuidance}>
                    ou escolha uma imagem padrão para usar no cardápio de
                    delivery
                  </div>
                </div>

                {modalType === "produto" && (
                  <div
                    className={Styles.formGroup}
                    style={{ marginTop: "16px" }}
                  >
                    <label>Ou selecione uma imagem padrão</label>
                    <select
                      value={formData.imagem}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          imagem: e.target.value,
                          imagemCustom: null,
                        })
                      }
                    >
                      <option value="">Selecione uma imagem...</option>
                      {imagensDisponiveis.map((img) => (
                        <option key={img} value={img}>
                          {img.replace(/_/g, " ")}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* ===== SEÇÃO DE DESCRIÇÃO ===== */}
              <div className={Styles.formSection}>
                <div className={Styles.formSectionTitle}>📝 Descrição</div>
                <div className={Styles.formGroup}>
                  <label>Descrição para cardápio</label>
                  <textarea
                    value={formData.descricao}
                    onChange={(e) =>
                      setFormData({ ...formData, descricao: e.target.value })
                    }
                    placeholder={
                      modalType === "produto"
                        ? "Descreva o produto, ingredientes principais, tamanho..."
                        : "Detalhes sobre o que vem no kit, quantidade, serviço..."
                    }
                  />
                </div>
              </div>

              {/* ===== SEÇÃO DE DISPONIBILIDADE (Produtos) ===== */}
              {modalType === "produto" && (
                <div className={Styles.formSection}>
                  <div className={Styles.formSectionTitle}>⚙️ Configuração</div>
                  <div className={Styles.twoColumnGrid}>
                    <div className={Styles.formGroup}>
                      <label>Estoque</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.estoque}
                        onChange={(e) =>
                          setFormData({ ...formData, estoque: e.target.value })
                        }
                      />
                    </div>
                    <div className={Styles.formGroup}>
                      <div className={Styles.checkboxGroup}>
                        <input
                          type="checkbox"
                          id="disponivel-check"
                          checked={formData.disponivel}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              disponivel: e.target.checked,
                            })
                          }
                        />
                        <label htmlFor="disponivel-check">
                          Disponível para venda
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ===== SEÇÃO DE SELEÇÃO DE PRODUTOS (Kits) ===== */}
              {modalType === "combo" && (
                <div className={Styles.formSection}>
                  <div className={Styles.formSectionTitle}>
                    🎁 Selecione os Produtos
                  </div>
                  <div className={Styles.formGroup}>
                    <div className={Styles.kitFestaSearch}>
                      <IoSearch size={18} />
                      <input
                        type="text"
                        placeholder="Filtrar meus produtos..."
                        value={buscaProdutoKit}
                        onChange={(e) => setBuscaProdutoKit(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className={Styles.kitFestaBuilder}>
                    {produtosDisponiveis
                      .filter((p) =>
                        p.nome
                          .toLowerCase()
                          .includes(buscaProdutoKit.toLowerCase()),
                      )
                      .map((produto) => (
                        <div
                          key={produto.id}
                          className={`${Styles.kitFestaItem} ${formData.produtos.includes(produto.id) ? Styles.selected : ""}`}
                          onClick={() => {
                            const isSelected = formData.produtos.includes(
                              produto.id,
                            );
                            const novosProdutos = isSelected
                              ? formData.produtos.filter(
                                  (id) => id !== produto.id,
                                )
                              : [...formData.produtos, produto.id];
                            setFormData({
                              ...formData,
                              produtos: novosProdutos,
                            });
                          }}
                        >
                          <div className={Styles.kitFestaItemImage}>
                            <img
                              src={getProdutoImageSrc(produto)}
                              alt={produto.nome}
                            />
                          </div>
                          <div className={Styles.kitFestaItemInfo}>
                            <span className={Styles.itemName}>
                              {produto.nome}
                            </span>
                            <span className={Styles.itemPrice}>
                              R$ {Number(produto.preco).toFixed(2)}
                            </span>
                          </div>
                          <div className={Styles.kitFestaCheckbox}>
                            <input
                              type="checkbox"
                              checked={formData.produtos.includes(produto.id)}
                              readOnly
                            />
                          </div>
                        </div>
                      ))}
                  </div>

                  <div className={Styles.totalInfo}>
                    💰 Total dos itens: R${" "}
                    {produtosDisponiveis
                      .filter((p) => formData.produtos.includes(p.id))
                      .reduce((acc, curr) => acc + Number(curr.preco), 0)
                      .toFixed(2)}
                  </div>
                </div>
              )}
            </div>

            <div className={Styles.modalActions}>
              <button
                className={Styles.cancelBtn}
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
              <button className={Styles.saveBtn} onClick={handleSave}>
                Salvar Produto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardapioManager;
