import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  IoCartOutline,
  IoHeartOutline,
  IoHeart,
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoPersonOutline,
  IoLogOutOutline,
  IoSearchOutline,
  IoLocationOutline,
  IoStar,
  IoStarOutline,
  IoStarHalf,
} from "react-icons/io5";

import CartComponent from "../Components/CartComponent.jsx";
import ConfirmationModal from "../Components/ConfirmationModal.jsx";
import FavoritesList from "../Components/FavoritesList.jsx";

import { useCartStore } from "../context/CartContext.jsx";
import { useFavorites } from "../context/FavoritesContext.jsx";

import StoreService from "../services/storeService";
import ProductService from "../services/produtoService.js";
import MOCK_DATA from "../Components/MockData";
import StoreCard from "../Components/StoreCard";
import OfferItem from "../Components/OfferItem";
import Logoloja from "../assests/img/doce_Livre_3.jpg";
import Footer from "../Components/Footer.jsx";
import Styles from "../paginas/HomePage.module.css";
import { IMAGE_MAP } from "../data/imageImports.jsx";

const HomePage = () => {
  const navigate = useNavigate();

  // Hooks Globais (Carrinho e Favoritos)
  const { addItemToCart, totalItems, isCartOpen, toggleCart, isClearingCart } =
    useCartStore();
  const {
    toggleFavoriteStore,
    toggleFavoriteProduct,
    isStoreFavorite,
    isProductFavorite,
  } = useFavorites();

  // Estados dos Dados Vindos da API
  const [stores, setStores] = useState([]);
  const [offers, setOffers] = useState([]);
  const [categories, setCategories] = useState(MOCK_DATA.categories || []);

  // Estados de Controle e UI
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);
  const [currentStoreIndex, setCurrentStoreIndex] = useState(0);
  const [showFavorites, setShowFavorites] = useState(false);

  // Estados de Busca e Endereço
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStores, setFilteredStores] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState("Entrega");
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [fetchedAddress, setFetchedAddress] = useState("");
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [showAddressList, setShowAddressList] = useState(false);

  // Estados de Inteligência de Exibição
  const [topRatedStores, setTopRatedStores] = useState([]);
  const [nearbyByLocation, setNearbyByLocation] = useState([]);
  const [locationStatus, setLocationStatus] = useState("idle");

  // 1. Busca Inicial de Dados das APIs do Backend Java
  useEffect(() => {
    const fetchAPIData = async () => {
      try {
        setLoading(true);

        // Busca as Lojas cadastradas no banco via API
        const storesData = await StoreService.getStores().catch(() => null);
        // Busca os Produtos (Ofertas) cadastrados no banco via API
        const productsData = await ProductService.getProdutos().catch(
          () => null,
        );

        // Normaliza os dados das Lojas vindos do Java SQL Server
        const storesRaw =
          storesData && storesData.length
            ? storesData.map((s) => ({
                id: s.id,
                name: s.loja?.nomeFantasia || s.nome,
                categoria: s.categoria || "Doces",
                promocao: s.promocao,
                telefone: s.loja?.telefone || s.telefone || '',
                endereco: s.loja?.endereco || s.endereco || '',
                descricao: s.descricao || "",
                rating: s.avaliacao || 4.5,
                deliveryTime: s.tempoEntrega || "30-45 min",
                deliveryFee: s.taxaEntrega
                  ? `R$ ${s.taxaEntrega.toFixed(2)}`
                  : "R$ 5,00",
                logoUrl: s.loja?.fotoUrl
                  ? `http://localhost:8080/imagens/${s.loja.fotoUrl}`
                  : IMAGE_MAP["default"],
                featured: s.destaque || false,
                lat: s.lat || -23.55052, // Fallbacks caso precise de Geolocalização teste
                lng: s.lng || -46.6333,
              }))
            : [];

        // Normaliza os dados de Produtos para o componente OfferItem
        const offersRaw =
          productsData && productsData.length
            ? productsData
                .filter((p) => p.disponivel === true && (p.estoque == null || p.estoque > 0))
                .map((p) => ({
                id: p.id,
                name: p.nome,
                store: p.loja?.nomeLoja || p.nomeLoja || "Confeitaria Doce",
                price: p.preco || 0.0,
                categoryId: p.categoria?.id || null,
                imageUrl: p.imagemUrl
                  ? `http://localhost:8080/imagens/${p.imagemUrl}`
                  : IMAGE_MAP["default"],
              }))
            : [];

        setStores(storesRaw);
        setOffers(offersRaw);
        setCategories(MOCK_DATA.categories);
      } catch (error) {
        console.error("Erro ao conectar com as APIs do Spring Boot:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAPIData();
  }, []);

  // 2. Filtro e Classificação de Lojas Melhores Avaliadas (Top 5)
  useEffect(() => {
    if (stores.length === 0) return;
    const sorted = [...stores].sort((a, b) => b.rating - a.rating);
    setTopRatedStores(sorted.slice(0, 5));
  }, [stores]);

  // 3. Geolocalização Ativa (Confeitarias Próximas)
  useEffect(() => {
    if (stores.length === 0) return;
    setLocationStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const calcDist = (lat1, lng1, lat2, lng2) => {
          const R = 6371;
          const dLat = ((lat2 - lat1) * Math.PI) / 180;
          const dLng = ((lng2 - lng1) * Math.PI) / 180;
          const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos((lat1 * Math.PI) / 180) *
              Math.cos((lat2 * Math.PI) / 180) *
              Math.sin(dLng / 2) ** 2;
          return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        };
        const withDist = stores
          .map((s) => ({
            ...s,
            distKm: calcDist(latitude, longitude, s.lat, s.lng),
          }))
          .sort((a, b) => a.distKm - b.distKm);
        setNearbyByLocation(withDist.slice(0, 4));
        setLocationStatus("granted");
      },
      () => setLocationStatus("denied"),
    );
  }, [stores]);

  // 4. Carregamento de Sessão do Usuário Local
  useEffect(() => {
    const carregarUsuario = () => {
      const nome  = localStorage.getItem("userName");
      const email = localStorage.getItem("userEmail");
      const foto  = localStorage.getItem("userFoto") || null;
      const userRaw = localStorage.getItem("user");
      const userObj = userRaw ? JSON.parse(userRaw) : null;
      const nomeReal = nome || userObj?.nome || userObj?.name || null;
      setUser(nomeReal ? { name: nomeReal, email, foto } : null);
      const saved = localStorage.getItem("savedAddresses");
      if (saved) setSavedAddresses(JSON.parse(saved));
    };

    carregarUsuario();
    window.addEventListener("localStorageUpdate", carregarUsuario);
    return () =>
      window.removeEventListener("localStorageUpdate", carregarUsuario);
  }, []);

  // Auto-rotação dos Carroséis de Lojas e Ofertas
  useEffect(() => {
    if (topRatedStores.length > 0) {
      const interval = setInterval(() => {
        setCurrentStoreIndex((prev) => (prev + 1) % topRatedStores.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [topRatedStores.length]);

  useEffect(() => {
    if (offers.length > 0) {
      const interval = setInterval(() => {
        setCurrentOfferIndex((prev) => (prev + 1) % offers.length);
      }, 3500);
      return () => clearInterval(interval);
    }
  }, [offers.length]);

  // Funções de Controle de Eventos e Filtros Visuais
  const handleStoreClick = (store) => {
    localStorage.setItem("selectedStore", JSON.stringify(store));
    navigate(`/docelivery/loja/${store.id}`);
  };

  const handleCategoryFilter = async (categoryId) => {
    setSelectedCategory(categoryId);
    try {
      const productsData = await ProductService.getProdutos();
      if (!productsData) return;

      const mapped = productsData
        .filter((p) => p.disponivel === true && (p.estoque == null || p.estoque > 0))
        .map((p) => ({
        id: p.id,
        name: p.nome,
        store: p.loja?.nomeLoja || "Confeitaria Doce",
        price: p.preco || 0.0,
        categoryId: p.categoria?.id || null,
        imageUrl: p.imagemUrl
          ? `http://localhost:8080/imagens/${p.imagemUrl}`
          : IMAGE_MAP["default"],
      }));

      if (categoryId == null) {
        setOffers(mapped);
      } else {
        setOffers(mapped.filter((o) => o.categoryId === categoryId));
      }
    } catch (error) {
      console.error("Erro ao filtrar categorias na API:", error);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.trim() === "") {
      setFilteredStores(null);
    } else {
      const matchedStores = stores.filter(
        (store) =>
          store.name.toLowerCase().includes(term.toLowerCase()) ||
          store.categoria.toLowerCase().includes(term.toLowerCase()),
      );
      setFilteredStores(matchedStores);
    }
  };

  const handleOfferClick = (offer) => {
    const linkedStore = stores.find((s) => s.name === offer.store) || stores[0];
    if (linkedStore) {
      addItemToCart(offer, linkedStore, 1);
    }
  };

  const handleAddressSubmit = (address) => {
    setDeliveryAddress(address);
    if (!savedAddresses.includes(address)) {
      const newAddresses = [...savedAddresses, address];
      setSavedAddresses(newAddresses);
      localStorage.setItem("savedAddresses", JSON.stringify(newAddresses));
    }
    setShowAddressModal(false);
  };

  const renderStars = (rating) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    return [
      ...Array(full)
        .fill(null)
        .map((_, i) => <IoStar key={`f${i}`} className={Styles.star_full} />),
      ...(half ? [<IoStarHalf key="h" className={Styles.star_full} />] : []),
      ...Array(empty)
        .fill(null)
        .map((_, i) => (
          <IoStarOutline key={`e${i}`} className={Styles.star_empty} />
        )),
    ];
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/");
  };

  if (loading) {
    return (
      <div className={Styles.loading_page}>
        Buscando os melhores doces do banco de dados...
      </div>
    );
  }

  return (
    <div className={Styles.docelivery_homepage}>
      {/* 1. HEADER INTEGRADO COM IDENTIDADE VISUAL COMPLETA */}
      <header className={Styles.main_header}>
        <div
          className={Styles.header_left}
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          <img src={Logoloja} alt="Logo DoceLivery" className={Styles.logo} />
          <h1 className={Styles.brand_name}>Docelivery</h1>
        </div>

        <div className={Styles.header_center}>
          <div className={Styles.search_container}>
            <IoSearchOutline className={Styles.search_icon} size={20} />
            <input
              type="text"
              placeholder="Buscar doces, lojas..."
              value={searchTerm}
              onChange={handleSearch}
              className={Styles.search_input}
            />
          </div>
        </div>

        <div className={Styles.header_right}>
          {user ? (
            <>
              <div className={Styles.address_section}>
                <div className={Styles.address_display}>
                  <IoLocationOutline size={16} />
                  <span className={Styles.address_text}>
                    {deliveryAddress === "Entrega"
                      ? "Adicionar endereço"
                      : deliveryAddress.length > 25
                        ? `${deliveryAddress.substring(0, 25)}...`
                        : deliveryAddress}
                  </span>
                  <button
                    className={Styles.address_dropdown_btn}
                    onClick={() => setShowAddressList(!showAddressList)}
                  >
                    ▼
                  </button>
                </div>

                {showAddressList && (
                  <div className={Styles.address_dropdown}>
                    {savedAddresses.map((addr, idx) => (
                      <button
                        key={idx}
                        className={Styles.address_option}
                        onClick={() => {
                          setDeliveryAddress(addr);
                          setShowAddressList(false);
                        }}
                      >
                        {addr}
                      </button>
                    ))}
                    <button
                      className={Styles.add_address_btn}
                      onClick={() => {
                        setShowAddressModal(true);
                        setShowAddressList(false);
                      }}
                    >
                      + Adicionar novo endereço
                    </button>
                  </div>
                )}
              </div>

              <div className={Styles.user_info}>
                <IoPersonOutline size={20} />
                <span>Olá, {user.name}!</span>
              </div>

              <button
                className={Styles.perfil_btn}
                onClick={() => navigate("/docelivery/cliente/perfil")}
                title="Meu Perfil"
              >
                {user.foto
                  ? <img src={user.foto} alt="avatar" className={Styles.header_avatar} />
                  : <IoPersonOutline size={20} />}
              </button>

              <button className={Styles.cart_btn} onClick={toggleCart}>
                <IoCartOutline size={24} />
                {totalItems > 0 && (
                  <span className={Styles.cart_badge}>{totalItems}</span>
                )}
              </button>

              <button
                className={Styles.favorites_btn}
                onClick={() => setShowFavorites(true)}
              >
                <IoHeartOutline size={20} />
              </button>

              <button className={Styles.logout_btn} onClick={logout}>
                <IoLogOutOutline size={20} />
              </button>
            </>
          ) : (
            <div className={Styles.auth_buttons}>
              <button
                className={Styles.login_btn}
                onClick={() => navigate("/login")}
              >
                Entrar
              </button>
            </div>
          )}
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL EM SEÇÕES VERTICAIS (IGUAL À IMAGEM 2) */}
      <main className={Styles.main_content}>
        {/* SEÇÃO DINÂMICA: RESULTADO DA BUSCA POR INPUT */}
        {filteredStores !== null && (
          <section className={Styles.all_stores}>
            <h2>Resultados encontrados para "{searchTerm}"</h2>
            <div className={Styles.all_stores_grid}>
              {filteredStores.map((store) => (
                <div
                  key={store.id}
                  className={Styles.store_card_all}
                  onClick={() => handleStoreClick(store)}
                >
                  <img
                    src={store.logoUrl}
                    alt={store.name}
                    className={Styles.store_logo_img_all}
                  />
                  <div className={Styles.store_info_all}>
                    <h4>{store.name}</h4>
                    <div className={Styles.stars_row}>
                      {renderStars(store.rating)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SEÇÃO 2: LOJAS MAIS BEM AVALIADAS */}
        <section className={Styles.featured_stores}>
          <div className={Styles.stores_header}>
            <h2>⭐ Lojas Mais Bem Avaliadas</h2>
            <div className={Styles.carousel_controls}>
              <button
                onClick={() =>
                  setCurrentStoreIndex(
                    (p) =>
                      (p - 1 + topRatedStores.length) % topRatedStores.length,
                  )
                }
                className={Styles.carousel_btn}
              >
                <IoChevronBackOutline size={20} />
              </button>
              <button
                onClick={() =>
                  setCurrentStoreIndex((p) => (p + 1) % topRatedStores.length)
                }
                className={Styles.carousel_btn}
              >
                <IoChevronForwardOutline size={20} />
              </button>
            </div>
          </div>
          <div className={Styles.stores_carousel}>
            <div
              className={Styles.stores_track}
              style={{
                transform: `translateX(-${currentStoreIndex * 220}px)`,
                display: "flex",
                gap: "20px",
                transition: "transform 0.4s ease",
              }}
            >
              {topRatedStores.map((store) => (
                <div
                  key={store.id}
                  className={Styles.store_carousel_item}
                  style={{ position: "relative" }}
                >
                  <button
                    className={Styles.favorite_btn}
                    onClick={() => toggleFavoriteStore(store)}
                  >
                    {isStoreFavorite(store.id) ? (
                      <IoHeart size={16} color="#e11d48" />
                    ) : (
                      <IoHeartOutline size={16} />
                    )}
                  </button>
                  <div className={Styles.rating_badge}>
                    ⭐ {store.rating.toFixed(1)}
                  </div>
                  <StoreCard store={store} onClick={handleStoreClick} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SEÇÃO 3: CATEGORIAS POPULARES */}
        <section className={Styles.popular_categories}>
          <h2>Categorias Populares</h2>
          <div className={Styles.category_list}>
            {categories.map((category) => (
              <button
                key={category.id}
                className={`${Styles.category_tag} ${selectedCategory === category.id ? Styles.active : ""}`}
                onClick={() => handleCategoryFilter(category.id)}
              >
                {category.name}
              </button>
            ))}
            <button
              className={`${Styles.category_tag} ${selectedCategory === null ? Styles.active : ""}`}
              onClick={() => handleCategoryFilter(null)}
            >
              Ver Todos
            </button>
          </div>
        </section>

        {/* SEÇÃO 4: OFERTAS DOCES (PRODUTOS INTEGRADOS DO BANCO) */}
        <section className={Styles.sweet_offers}>
          <div className={Styles.offers_header}>
            <h2>Ofertas Doces</h2>
            <div className={Styles.carousel_controls}>
              <button
                onClick={() =>
                  setCurrentOfferIndex(
                    (p) => (p - 1 + offers.length) % offers.length,
                  )
                }
                className={Styles.carousel_btn}
              >
                <IoChevronBackOutline size={20} />
              </button>
              <button
                onClick={() =>
                  setCurrentOfferIndex((p) => (p + 1) % offers.length)
                }
                className={Styles.carousel_btn}
              >
                <IoChevronForwardOutline size={20} />
              </button>
            </div>
          </div>
          <div className={Styles.offers_carousel}>
            <div
              className={Styles.offers_track}
              style={{
                transform: `translateX(-${currentOfferIndex * 280}px)`,
                display: "flex",
                gap: "20px",
                transition: "transform 0.4s ease",
              }}
            >
              {offers.map((offer) => (
                <div
                  key={offer.id}
                  className={Styles.offer_wrapper}
                  style={{ position: "relative" }}
                >
                  <button
                    className={Styles.favorite_btn}
                    onClick={() => toggleFavoriteProduct(offer)}
                  >
                    {isProductFavorite(offer.id) ? (
                      <IoHeart size={20} color="#e11d48" />
                    ) : (
                      <IoHeartOutline size={20} />
                    )}
                  </button>
                  <OfferItem offer={offer} onClick={handleOfferClick} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SEÇÃO 5: CONFEITARIAS PRÓXIMAS (GEOLOCALIZAÇÃO) */}
        <section className={Styles.nearby_stores}>
          <h2>📍 Confeitarias Próximas de Você</h2>
          {locationStatus === "loading" && (
            <p className={Styles.section_subtitle}>
              Buscando sua localização GPS...
            </p>
          )}
          {locationStatus === "denied" && (
            <p className={Styles.section_subtitle}>
              🔒 Permita o acesso à localização para ver a distância exata em
              km.
            </p>
          )}

          <div className={Styles.nearby_grid}>
            {(locationStatus === "granted"
              ? nearbyByLocation
              : stores.slice(0, 4)
            ).map((store) => (
              <div key={store.id} className={Styles.store_carousel_item}>
                <button
                  className={Styles.favorite_btn}
                  onClick={() => toggleFavoriteStore(store)}
                >
                  {isStoreFavorite(store.id) ? (
                    <IoHeart size={16} color="#e11d48" />
                  ) : (
                    <IoHeartOutline size={16} />
                  )}
                </button>
                {store.distKm && (
                  <div className={Styles.distance_badge}>
                    📍 {store.distKm.toFixed(1)} km
                  </div>
                )}
                <StoreCard store={store} onClick={handleStoreClick} />
              </div>
            ))}
          </div>
        </section>

        {/* SEÇÃO 6: TODAS AS LOJAS (LISTAGEM DE RODAPÉ) */}
        <section className={Styles.all_stores}>
          <h2>Todas as Lojas</h2>
          <div className={Styles.all_stores_grid}>
            {stores.map((store) => (
              <div
                key={store.id}
                className={Styles.store_card_all}
                onClick={() => handleStoreClick(store)}
              >
                <button
                  className={Styles.favorite_btn_small}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavoriteStore(store);
                  }}
                >
                  {isStoreFavorite(store.id) ? (
                    <IoHeart size={14} color="#e11d48" />
                  ) : (
                    <IoHeartOutline size={14} />
                  )}
                </button>
                <div className={Styles.store_logo_all}>
                  <img
                    src={store.logoUrl}
                    alt={store.name}
                    className={Styles.store_logo_img_all}
                  />
                </div>
                <div className={Styles.store_info_all}>
                  <h4 className={Styles.store_name_all}>{store.name}</h4>
                  <div className={Styles.store_rating_all}>
                    <span>{store.rating}</span>
                    <div className={Styles.stars_row}>
                      {renderStars(store.rating)}
                    </div>
                  </div>
                  <div className={Styles.store_delivery_all}>
                    <span>{store.deliveryTime}</span>
                    <span className={Styles.store_fee_all}>
                      {" "}
                      • {store.deliveryFee}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* RODAPÉ E SIDEBARS FLUTUANTES */}
      <Footer />

      <aside
        className={`${Styles.cart_sidebar} ${isCartOpen ? Styles.open : ""}`}
      >
        <CartComponent />
      </aside>

      {isClearingCart && <ConfirmationModal />}

      <FavoritesList
        isOpen={showFavorites}
        onClose={() => setShowFavorites(false)}
      />

      {/* MODAL DO VIA CEP */}
      {showAddressModal && (
        <div
          className={Styles.address_modal_overlay}
          onClick={() => setShowAddressModal(false)}
        >
          <div
            className={Styles.address_modal}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Endereço de Entrega</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (fetchedAddress) {
                  handleAddressSubmit(fetchedAddress);
                  setFetchedAddress("");
                  return;
                }
                const cepValue = e.target.cep.value.replace(/\D/g, "");
                if (cepValue.length === 8) {
                  try {
                    const response = await fetch(
                      `https://viacep.com.br/ws/${cepValue}/json/`,
                    );
                    const data = await response.json();
                    if (!data.erro) {
                      setFetchedAddress(
                        `${data.logradouro}, ${data.bairro}, ${data.localidade}-${data.uf}`,
                      );
                    } else {
                      alert("CEP não encontrado!");
                    }
                  } catch {
                    alert("Erro na conexão do CEP.");
                  }
                }
              }}
            >
              <input
                type="text"
                name="cep"
                placeholder="Digite o CEP (Ex: 01001000)"
                className={Styles.address_input}
                maxLength="9"
                required
              />
              {fetchedAddress && (
                <div className={Styles.address_preview}>
                  <p>{fetchedAddress}</p>
                </div>
              )}
              <div className={Styles.address_modal_actions}>
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className={Styles.cancel_address_btn}
                >
                  Cancelar
                </button>
                <button type="submit" className={Styles.save_address_btn}>
                  {fetchedAddress ? "Confirmar" : "Buscar CEP"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
