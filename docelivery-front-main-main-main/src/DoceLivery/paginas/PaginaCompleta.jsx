import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Style from './PaginaCompleta.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faStar, faArrowRight, faShoppingBag, faTruck, faUsers, faBars, faTimes, faPhone } from '@fortawesome/free-solid-svg-icons';
import doceLivre from '../assests/img/doce_Livre_3.jpg';
import avatar from '../assests/img/avatar.png';
import meninaEntregadora from '../assests/img/menina_entregadora1.png';
import entregador_1 from '../assests/img/entregador_1.png';

import { IMAGE_MAP } from '../data/imageImports.jsx';
import Footer from '../Components/Footer.jsx';

const lojasData = [
  { id: 1, nome: "Doce Mimi", endereco: "Rua das Flores, 123", imagem: IMAGE_MAP['doce_mimi'] },
  { id: 2, nome: "Doce Paladar", endereco: "Av. Principal, 456", imagem: IMAGE_MAP['doce_paladar'] },
  { id: 3, nome: "Doce Sabor", endereco: "Shopping Central, Loja 10", imagem: IMAGE_MAP['doce_sabor'] },
  { id: 4, nome: "Doce Sonho", endereco: "Praça da Matriz, 78", imagem: IMAGE_MAP['doce_sonho'] },
  { id: 5, nome: "Fábrica dos Doces", endereco: "Beco da Arte, 05", imagem: IMAGE_MAP['fabrica_dos_doces'] },
  { id: 6, nome: "Maier Confeitaria", endereco: "Rua Gastronômica, 901", imagem: IMAGE_MAP['maier_confeitaria'] },
  { id: 7, nome: "Olivia Confeitaria", endereco: "Av. das Américas, 234", imagem: IMAGE_MAP['olivia_confeitaria'] },
  { id: 8, nome: "Só Delícia", endereco: "Rua dos Sonhos, 567", imagem: IMAGE_MAP['so_delicia'] },
];

function PaginaCompleta() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentLojaIndex, setCurrentLojaIndex] = useState(0);

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLojaIndex(prev =>
        prev < lojasData.length - 4 ? prev + 1 : 0
      );
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={Style.container}>
      {/* HEADER MODERNO */}
      <header className={Style.header}>
        <div className={Style.headerContainer}>
          <div className={Style.logo} onClick={() => window.location.href = '/'} style={{ cursor: 'pointer' }}>
            <img src={doceLivre} alt="DoceLivery" />
            <span>DoceLivery</span>
          </div>
          
          <nav className={`${Style.nav} ${isMenuOpen ? Style.navOpen : ''}`}>
            <a href="#hero">Início</a>
            <a href="#lojas">Lojas</a>
            <a href="#parceiros">Parceiros</a>
            <a href="/docelivery/home/apresentacao-projeto" target="_blank" rel="noopener noreferrer">Sobre</a>
          </nav>
          
          <div className={Style.headerActions}>
            <button className={Style.loginBtn}>
              <a href="/docelivery/cliente/login-cliente" target="_blank" rel="noopener noreferrer">Entrar</a>
            </button>
            <button className={Style.signupBtn}>
              <a href="/docelivery/cliente/cadastro-cliente" target="_blank" rel="noopener noreferrer">Cadastrar</a>
            </button>
          </div>
          
          <button 
            className={Style.menuToggle}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
          </button>
        </div>
      </header>

      {/* SEÇÃO LOJAS EM DESTAQUE - PRIMEIRA */}
      <section className={Style.lojasDestaque} id="lojas">
        <div className={Style.lojasHeader}>
          <div className={Style.lojasTitle}>
            <FontAwesomeIcon icon={faShoppingBag} className={Style.lojasIcon} />
            <h2>🏪 Descubra as Melhores Confeitarias</h2>
          </div>
            <div className={Style.carouselControls}>
            <button 
              onClick={() => setCurrentLojaIndex(prev => prev > 0 ? prev - 1 : lojasData.length - 4)}
              className={Style.carouselBtn}
            >
              <FontAwesomeIcon icon={faArrowRight} style={{transform: 'rotate(180deg)'}} />
            </button>
            <button 
              onClick={() => setCurrentLojaIndex(prev => prev < lojasData.length - 4 ? prev + 1 : 0)}
              className={Style.carouselBtn}
            >
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
        </div>
        <div className={Style.lojasCarousel}>
          <div 
            className={Style.lojasTrack}
            style={{ transform: `translateX(-${currentLojaIndex * 300}px)` }}
          >
            {lojasData.map((loja) => (
              <div key={loja.id} className={Style.lojaCarouselItem}>
                <button className={Style.favoriteBtn}>
                  <FontAwesomeIcon icon={faHeart} />
                </button>
                <div className={Style.lojaCard} onClick={() => window.location.href = `/docelivery/loja/${loja.id}`}>
                  <div className={Style.cardImage}>
                    <img 
                      src={loja.imagem || '/placeholder-image.jpg'} 
                      alt={loja.nomeFantasia || loja.nome || loja.name}
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbTwvdGV4dD48L3N2Zz4=';
                      }}
                    />
                  </div>
                  <div className={Style.cardContent}>
                    <h3>{loja.nomeFantasia || loja.nome || loja.name}</h3>
                    <div className={Style.cardRating}>
                      <span>4.8</span>
                      <span>⭐</span>
                    </div>
                    <div className={Style.cardDelivery}>
                      <span>25-35 min</span>
                      <span> • R$ 3,99</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HERO SECTION MODERNO */}
      <section className={Style.heroModerno} id="hero">
        <div className={Style.heroContainer}>
          <div className={Style.heroContent}>
            <div className={Style.heroMain}>
              <div className={Style.heroText}>
                <div className={Style.heroTag}>🍰 Delivery de Doces</div>
                <h1>
                  Seus doces favoritos <br/>
                  <span className={Style.highlight}>entregues com carinho</span>
                </h1>
                <p>Conectamos você aos melhores confeiteiros da sua região. Sabor artesanal, qualidade garantida e entrega rápida direto na sua porta.</p>
                
                <div className={Style.heroActions}>
                  <Link to="/docelivery/cliente/home-page" className={Style.primaryBtn} target="_blank" rel="noopener noreferrer">
                      <FontAwesomeIcon icon={faShoppingBag} />
                      Explorar Lojas
                  </Link>
                </div>
              </div>
              
              <div className={Style.heroImage}>
                <div className={Style.imageContainer}>
                  <div className={Style.avatarWrapper}>
                    <img src={avatar} alt="Doce Livery" className={Style.mainAvatar} />
                    <div className={Style.avatarGlow}></div>
                    <div className={Style.floatingElements}>
                      <div className={Style.floatingDoce}>🍰</div>
                      <div className={Style.floatingDoce}>🧁</div>
                      <div className={Style.floatingDoce}>🍪</div>
                    </div>
                  </div>
                  <div className={Style.floatingCard}>
                    <FontAwesomeIcon icon={faHeart} />
                    <span>Mais de 50 tipos de doces</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={Style.heroStats}>
              <div className={Style.statCard}>
                <div className={Style.statIcon}>
                  <FontAwesomeIcon icon={faShoppingBag} />
                </div>
                <div className={Style.statInfo}>
                  <strong>500+</strong>
                  <span>Confeitarias Parceiras</span>
                </div>
              </div>
              <div className={Style.statCard}>
                <div className={Style.statIcon}>
                  <FontAwesomeIcon icon={faUsers} />
                </div>
                <div className={Style.statInfo}>
                  <strong>10k+</strong>
                  <span>Clientes Satisfeitos</span>
                </div>
              </div>
              <div className={Style.statCard}>
                <div className={Style.statIcon}>
                  <FontAwesomeIcon icon={faTruck} />
                </div>
                <div className={Style.statInfo}>
                  <strong>200+</strong>
                  <span>Entregadores Ativos</span>
                </div>
              </div>
              <div className={Style.statCard}>
                <div className={Style.statIcon}>
                  <FontAwesomeIcon icon={faStar} />
                </div>
                <div className={Style.statInfo}>
                  <strong>4.9</strong>
                  <span>Avaliação Média</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO PARCEIROS MODERNA */}
      <section className={Style.parceirosModerno} id="parceiros">
        <div className={Style.container}>
          <div className={Style.sectionHeader}>
            <div className={Style.headerTag}>💼 Oportunidades</div>
            <h2>Faça parte da nossa <span className={Style.highlight}>comunidade</span></h2>
            <p>Transforme sua paixão em renda. Junte-se a milhares de parceiros que já fazem sucesso conosco.</p>
          </div>
          
          <div className={Style.parceiroGrid}>
            <div className={Style.parceiroCardModerno}>
              <div className={Style.cardHeader}>
                <div className={Style.cardBadge}>Para Confeiteiros</div>
                <div className={Style.cardIconModerno}>
                  <img src={avatar} alt="Confeiteiro" />
                </div>
              </div>
              
              <div className={Style.cardBody}>
                <h3>🍰 Transforme sua Paixão em Negócio</h3>
                <p>Cadastre sua confeitaria e alcance milhares de clientes apaixonados por doces artesanais</p>
                
                <div className={Style.beneficiosModerno}>
                  <div className={Style.beneficioItem}>
                    <FontAwesomeIcon icon={faShoppingBag} />
                    <span>Dashboard Completo</span>
                  </div>
                  <div className={Style.beneficioItem}>
                    <FontAwesomeIcon icon={faUsers} />
                    <span>Gestão de Pedidos</span>
                  </div>
                  <div className={Style.beneficioItem}>
                    <FontAwesomeIcon icon={faStar} />
                    <span>Relatórios Detalhados</span>
                  </div>
                  <div className={Style.beneficioItem}>
                    <FontAwesomeIcon icon={faPhone} />
                    <span>Suporte 24/7</span>
                  </div>
                </div>
                
                <div className={Style.cardStats}>
                  <div className={Style.statMini}>
                    <strong>R$ 2.500</strong>
                    <span>Renda média mensal</span>
                  </div>
                  <div className={Style.statMini}>
                    <strong>95%</strong>
                    <span>Satisfação dos parceiros</span>
                  </div>
                </div>
                
                <a href="/docelivery/confeiteiro/login-confeiteiro" target="_blank" rel="noopener noreferrer" className={Style.parceiroBtnModerno}>
                  <FontAwesomeIcon icon={faArrowRight} />
                  Começar Agora
                </a>
              </div>
            </div>
            
            <div className={Style.parceiroCardModerno}>
              <div className={Style.cardHeader}>
                <div className={Style.cardBadge}>Para Entregadores</div>
                <div className={Style.cardIconModerno}>
                  <img src={meninaEntregadora} alt="Entregadora" />
                </div>
              </div>
              
              <div className={Style.cardBody}>
                <h3>🚚 Ganhe Dinheiro com Flexibilidade</h3>
                <p>Faça parte da nossa equipe de entregadores e tenha uma renda extra com total flexibilidade</p>
                
                <div className={Style.beneficiosModerno}>
                  <div className={Style.beneficioItem}>
                    <FontAwesomeIcon icon={faTruck} />
                    <span>Horários Flexíveis</span>
                  </div>
                  <div className={Style.beneficioItem}>
                    <FontAwesomeIcon icon={faUsers} />
                    <span>Pagamento Semanal</span>
                  </div>
                  <div className={Style.beneficioItem}>
                    <FontAwesomeIcon icon={faShoppingBag} />
                    <span>App Exclusivo</span>
                  </div>
                  <div className={Style.beneficioItem}>
                    <FontAwesomeIcon icon={faStar} />
                    <span>Bonificações Extras</span>
                  </div>
                </div>
                
                <div className={Style.testimonialModerno}>
                  <div className={Style.testimonialContent}>
                    <img src={entregador_1} alt="Zé Entregador" />
                    <div>
                      <div className={Style.testimonialStars}>
                        {[...Array(5)].map((_, i) => (
                          <FontAwesomeIcon key={i} icon={faStar} />
                        ))}
                      </div>
                      <p>"Renda extra incrível! Trabalho quando quero."</p>
                      <strong>Zé Entregador</strong>
                    </div>
                  </div>
                </div>
                
                <a href="/docelivery/entregador/login-entregador" target="_blank" rel="noopener noreferrer" className={Style.parceiroBtnModerno}>
                  <FontAwesomeIcon icon={faArrowRight} />
                  Junte-se a Nós
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* SEÇÃO SOBRE - PADRÃO HERO */}
      <section className={Style.sobreModerno} id="sobre">
        <div className={Style.heroContainer}>
          <div className={Style.sobreContent}>
            <div className={Style.sobreMain}>
              <div className={Style.sobreText}>
                <div className={Style.sobreTag}>✨ Nossa Diferença</div>
                <h2>Por que escolher a <span className={Style.highlight}>Doce Livery?</span></h2>
                <p>Mais que uma plataforma de delivery. Somos uma comunidade que conecta pessoas através do amor pelos doces artesanais.</p>
                
                <div className={Style.sobreActions}>
                  <button className={Style.secondaryBtn}>
                    <a href="/docelivery/home/apresentacao-projeto" target="_blank" rel="noopener noreferrer">
                      <FontAwesomeIcon icon={faArrowRight} />
                      Como Funciona
                    </a>
                  </button>
                </div>
              </div>
              
              <div className={Style.sobreImage}>
                <div className={Style.imageContainer}>
                  <div className={Style.avatarWrapper}>
                    <img src={doceLivre} alt="Doce Livery" className={Style.mainAvatar} />
                    <div className={Style.avatarGlow}></div>
                  </div>

                </div>
              </div>
            </div>
            
            <div className={Style.sobreStats}>
              <div className={Style.sobreStatCard}>
                <div className={Style.sobreStatIcon}>
                  <FontAwesomeIcon icon={faShoppingBag} />
                </div>
                <div className={Style.sobreStatInfo}>
                  <strong>500+</strong>
                  <span>Tipos de Doces</span>
                </div>
              </div>
              <div className={Style.sobreStatCard}>
                <div className={Style.sobreStatIcon}>
                  <FontAwesomeIcon icon={faTruck} />
                </div>
                <div className={Style.sobreStatInfo}>
                  <strong>25min</strong>
                  <span>Entrega Média</span>
                </div>
              </div>
              <div className={Style.sobreStatCard}>
                <div className={Style.sobreStatIcon}>
                  <FontAwesomeIcon icon={faUsers} />
                </div>
                <div className={Style.sobreStatInfo}>
                  <strong>10k+</strong>
                  <span>Clientes Felizes</span>
                </div>
              </div>
              <div className={Style.sobreStatCard}>
                <div className={Style.sobreStatIcon}>
                  <FontAwesomeIcon icon={faStar} />
                </div>
                <div className={Style.sobreStatInfo}>
                  <strong>4.9</strong>
                  <span>Avaliação Média</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER PADRÃO DO PROJETO */}
      <Footer />
    </div>
  );
}

export default PaginaCompleta;