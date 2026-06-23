import React from 'react';
import { Link } from 'react-router-dom';
import { IoLogoInstagram, IoLogoFacebook, IoLogoTwitter } from 'react-icons/io5';
import Styles from './Footer.module.css';

const Footer = () => {
    return (
        <footer className={Styles.footer}>
            <div className={Styles.footer_container}>
                <div className={Styles.footer_section}>
                    <h4>Docelivery</h4>
                    <p>A sua confeitaria online. Encontre os melhores doces e bolos da sua região.</p>
                </div>

                <div className={Styles.footer_section}>
                    <h4>Navegação</h4>
                    <ul>
                        <li><Link to="/">Início</Link></li>
                        <li><Link to="/docelivery/cliente/cadastro-cliente">Cadastre-se</Link></li>
                        <li><Link to="/docelivery/cliente/login-cliente">Login</Link></li>
                    </ul>
                </div>

                <div className={Styles.footer_section}>
                    <h4>Suporte</h4>
                    <ul>
                        <li><Link to="/faq">FAQ</Link></li>
                        <li><Link to="/contato">Contato</Link></li>
                        <li><Link to="/termos">Termos de Serviço</Link></li>
                    </ul>
                </div>

                <div className={Styles.footer_section}>
                    <h4>Siga-nos</h4>
                    <div className={Styles.social_icons}>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                            <IoLogoInstagram />
                        </a>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                            <IoLogoFacebook />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                            <IoLogoTwitter />
                        </a>
                    </div>
                </div>
            </div>
            <div className={Styles.footer_bottom}>
                <p>&copy; 2025 Docelivery. Todos os direitos reservados.</p>
            </div>
        </footer>
    );
};

export default Footer;