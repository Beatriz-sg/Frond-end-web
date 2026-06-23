// src/components/Header.jsx
import React, { useState, useEffect } from 'react';
import Styles from '../Components/Header.module.css';
import doceLivre from '../assests/img/doce_Livre_3.jpg';
import icon from '../assests/img/menu_white_36dp.svg';
import Home from '../paginas/Home';
import Lojas from '../paginas/Lojas';
import Footer from './Footer';
import AuthService from '../services/authService';
// Importar imagens das páginas antigas
import meninaEntregadora from '../assests/img/menina_entregadora1.png';
import avatar from '../assests/img/avatar.png';
import Loja1 from '../assests/img/ChatGPT Image_19.png';
import Loja2 from '../assests/img/ChatGPT Image_20.png';
import Loja3 from '../assests/img/ChatGPT_Image-3.png';
import entregador1 from '../assests/img/entregador_1.png';
import entregador2 from '../assests/img/entregador_2.png';

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAuth, setIsAuth] = useState(false);
    const [userName, setUserName] = useState('');
    const [userType, setUserType] = useState('');

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    useEffect(() => {
        const checkAuth = () => {
            setIsAuth(AuthService.isAuthenticated());
            setUserName(AuthService.getUserName() || '');
            setUserType(AuthService.getUserType() || '');
        };

        checkAuth();
        window.addEventListener('localStorageUpdate', checkAuth);
        return () => window.removeEventListener('localStorageUpdate', checkAuth);
    }, []);

    const handleLogout = () => {
        AuthService.logout();
    };

    const painelLink = () => {
        if (!isAuth) return '/docelivery/cliente/login-cliente';
        switch ((userType || '').toLowerCase()) {
            case 'confeiteiro':
                return '/docelivery/confeiteiro/Confeiteiro-Dashboard';
            case 'entregador':
                return '/docelivery/entregador/pagina-entregador';
            case 'admin':
                return '/docelivery/admin/dashboard';
            default:
                return '/docelivery/cliente/Home-Page';
        }
    };

    return (
        <>
            <div className={Styles.container}>
        <header className={Styles.header}>
            <nav className={Styles.nav_bar}>
                <div className={Styles.logo}>
                
                    <a href="/" style={{ cursor: 'pointer' }}>
                        <img className={Styles.logo_img}
                                src={doceLivre}
                                width="150px"
                                height="150px"
                                alt="Doce Livre Logo"
                            />
                    </a>
                </div>

                <div className={Styles.nav_list}>
                    <ul>
                        <li className={Styles.nav_item}><a href="/" className={Styles.nav_link}>Home</a></li>
                        <li className={Styles.nav_item}><a href="/docelivery/cliente/Home-Page" target="_blank" rel="noopener noreferrer" className={Styles.nav_link}>Cliente</a></li>
                        <li className={Styles.nav_item}><a href="/docelivery/confeiteiro/Confeiteiro-Dashboard" target="_blank" rel="noopener noreferrer" className={Styles.nav_link}>Confeiteiro(a)</a></li>
                        <li className={Styles.nav_item}><a href="/docelivery/entregador/pagina-entregador" target="_blank" rel="noopener noreferrer" className={Styles.nav_link}>Entregador</a></li>
                        {/* <li className={Styles.nav_item}><a href="#" className={Styles.nav_link}>Contato</a></li> */}
                    </ul>
                </div>

                <div className={Styles.login_button}>
                    {isAuth ? (
                        <>
                            <span style={{ marginRight: '10px' }}>Olá, {userName}</span>
                            <a href={painelLink()} className={Styles.painelBtn}>Painel</a>
                            <button onClick={handleLogout} style={{ marginLeft: '8px' }}>Sair</button>
                        </>
                    ) : (
                        <button>
                            <a href="/docelivery/cliente/login-cliente">Login</a>
                        </button>
                    )}
                </div>

                <div className={Styles.mobile_menu_icon}>
                    <button onClick={toggleMenu}>
                        <img className={icon} src={icon} alt="Menu Icon" />
                    </button>
                </div>
            </nav>

            <div className={`${Styles.mobile_menu} ${isMenuOpen ? Styles.open : ''}`}>
                <ul>
                    <li className={Styles.nav_item}><a href="/" className={Styles.nav_link}>Home</a></li>
                    <li className={Styles.nav_item}><a href="/docelivery/cliente/Home-Page" target="_blank" rel="noopener noreferrer" className={Styles.nav_link}>Cliente</a></li>
                    <li className={Styles.nav_item}><a href="/docelivery/confeiteiro/Confeiteiro-Dashboard" target="_blank" rel="noopener noreferrer" className={Styles.nav_link}>Confeiteiro(a)</a></li>
                    <li className={Styles.nav_item}><a href="/docelivery/entregador/pagina-entregador" target="_blank" rel="noopener noreferrer" className={Styles.nav_link}>Entregador</a></li>
                </ul>
                <div className={Styles.login_button}>
                    {isAuth ? (
                        <>
                            <span style={{ marginRight: '10px' }}>Olá, {userName}</span>
                            <a href={painelLink()} className={Styles.painelBtn}>Painel</a>
                            <button onClick={handleLogout} style={{ marginLeft: '8px' }}>Sair</button>
                        </>
                    ) : (
                        <button>
                            <a href="/docelivery/cliente/login-cliente">Login</a>
                        </button>
                    )}
                </div>
            </div>
        </header>

        <Home />
        <Lojas />
        
        {/* Seção de Parceiros com imagens */}
        <section className={Styles.parceiros_section}>
            <div className={Styles.parceiros_container}>
                <h2 className={Styles.parceiros_titulo}>Seja nosso parceiro</h2>
                <p className={Styles.parceiros_subtitulo}>Faça parte da nossa rede e aumente sua renda</p>
                
                <div className={Styles.parceiros_grid}>
                    {/* Card Confeiteiro */}
                    <div className={Styles.parceiro_card}>
                        <div className={Styles.card_header}>
                            <div className={Styles.confeiteiro_hero}>
                                <img src={avatar} alt="Confeiteiro" className={Styles.confeiteiro_main} />
                            </div>
                        </div>
                        <div className={Styles.card_content}>
                            <h3>Confeiteiro(a)</h3>
                            <p>Cadastre sua confeitaria e venda seus doces para toda a cidade</p>
                            <ul className={Styles.beneficios}>
                                <li>Aumente suas vendas</li>
                                <li>Gerencie seus pedidos</li>
                                <li>Controle financeiro</li>
                                <li>Dashboard completo</li>
                            </ul>
                            <a href="/docelivery/confeiteiro/cadastro" className={Styles.cta_button}>
                                Quero ser parceiro
                            </a>
                        </div>
                    </div>
                    
                    {/* Card Entregador */}
                    <div className={Styles.parceiro_card}>
                        <div className={Styles.card_header}>
                            <div className={Styles.entregador_hero}>
                                <img src={meninaEntregadora} alt="Entregadora" className={Styles.entregadora_main} />
                            </div>
                        </div>
                        <div className={Styles.card_content}>
                            <h3>Entregador</h3>
                            <p>Trabalhe conosco e tenha flexibilidade de horários</p>
                            
                            <div className={Styles.testimonials}>
                                <div className={Styles.testimonial}>
                                    <img src={entregador1} alt="Entregador" className={Styles.entregador_avatar} />
                                    <div>
                                        <strong>Zé Entregador</strong>
                                        <span>★★★★★</span>
                                        <p>"Renda extra incrível!"</p>
                                    </div>
                                </div>
                                <div className={Styles.testimonial}>
                                    <img src={entregador2} alt="Entregador" className={Styles.entregador_avatar} />
                                    <div>
                                        <strong>Riky Delivery</strong>
                                        <span>★★★★★</span>
                                        <p>"Experiência incrível!"</p>
                                    </div>
                                </div>
                            </div>
                            
                            <a href="/docelivery/entregador/cadastro-entregador" className={Styles.cta_button}>
                                Junte-se a nós
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        
        <Footer />

        </div>
        </>

    );
}

export default Header;