import React, { useState } from 'react';
import { FaMoneyBillWave, FaClock, FaCalendarAlt, FaMotorcycle, FaRoute, FaChartLine, FaHeadset, FaUser } from 'react-icons/fa';
import { IoWalletOutline, IoStatsChartOutline, IoCarOutline, IoHelpCircleOutline } from 'react-icons/io5';
import Style from './EntregadorArea.module.css';
import entregadorImage from '../assests/img/entregador_livre.png';

const EntregadorArea = () => {
    const [secaoAtiva, setSecaoAtiva] = useState('inicio');
    const [ganhos] = useState({
        hoje: 85.50,
        semana: 567.30,
        mes: 2340.80,
        entregas: 12
    });

    const FeatureCard = ({ icon, title, description, onClick, isActive }) => (
        <div 
            className={`${Style.featureCard} ${isActive ? Style.active : ''}`}
            onClick={onClick}
        >
            <div className={Style.cardIcon}>{icon}</div>
            <h4 className={Style.cardTitle}>{title}</h4>
            <p className={Style.cardDescription}>{description}</p>
        </div>
    );

    const renderConteudo = () => {
        switch (secaoAtiva) {
            case 'ganhos':
                return (
                    <div className={Style.ganhosSection}>
                        <h2>💰 Seus Ganhos</h2>
                        <div className={Style.ganhosGrid}>
                            <div className={Style.ganhosCard}>
                                <h3>R$ {ganhos.hoje.toFixed(2)}</h3>
                                <p>Ganhos Hoje</p>
                                <small>{ganhos.entregas} entregas</small>
                            </div>
                            <div className={Style.ganhosCard}>
                                <h3>R$ {ganhos.semana.toFixed(2)}</h3>
                                <p>Esta Semana</p>
                                <small>78 entregas</small>
                            </div>
                            <div className={Style.ganhosCard}>
                                <h3>R$ {ganhos.mes.toFixed(2)}</h3>
                                <p>Este Mês</p>
                                <small>312 entregas</small>
                            </div>
                        </div>
                        <div className={Style.dicasGanhos}>
                            <h4>💡 Dicas para Aumentar Ganhos</h4>
                            <ul>
                                <li>🕐 Trabalhe nos horários de pico (12h-14h e 19h-21h)</li>
                                <li>📍 Fique em áreas com alta demanda</li>
                                <li>⭐ Mantenha boa avaliação (4.8+ estrelas)</li>
                                <li>🚀 Complete metas diárias para bônus</li>
                            </ul>
                        </div>
                    </div>
                );
            case 'vantagens':
                return (
                    <div className={Style.vantagensSection}>
                        <h2>🎯 Vantagens da Plataforma</h2>
                        <div className={Style.vantagensList}>
                            <div className={Style.vantagemItem}>
                                <FaMoneyBillWave size={30} color="#10b981" />
                                <div>
                                    <h4>Pagamentos Semanais</h4>
                                    <p>Receba seus ganhos toda segunda-feira via PIX ou transferência bancária</p>
                                </div>
                            </div>
                            <div className={Style.vantagemItem}>
                                <FaClock size={30} color="#3b82f6" />
                                <div>
                                    <h4>Flexibilidade Total</h4>
                                    <p>Trabalhe quando quiser, onde quiser. Você define seus horários</p>
                                </div>
                            </div>
                            <div className={Style.vantagemItem}>
                                <FaChartLine size={30} color="#8b5cf6" />
                                <div>
                                    <h4>Bônus por Performance</h4>
                                    <p>Ganhe até 20% a mais completando metas diárias e semanais</p>
                                </div>
                            </div>
                            <div className={Style.vantagemItem}>
                                <FaRoute size={30} color="#f59e0b" />
                                <div>
                                    <h4>Rotas Otimizadas</h4>
                                    <p>Sistema inteligente que calcula as melhores rotas para economizar tempo</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'suporte':
                return (
                    <div className={Style.suporteSection}>
                        <h2>🆘 Central de Suporte</h2>
                        <div className={Style.suporteGrid}>
                            <div className={Style.suporteCard}>
                                <h4>📞 Telefone</h4>
                                <p>(11) 4000-1234</p>
                                <small>Seg-Dom: 6h às 24h</small>
                            </div>
                            <div className={Style.suporteCard}>
                                <h4>💬 Chat Online</h4>
                                <p>Suporte em tempo real</p>
                                <small>Disponível 24/7</small>
                            </div>
                            <div className={Style.suporteCard}>
                                <h4>📧 E-mail</h4>
                                <p>entregador@docelivery.com</p>
                                <small>Resposta em até 2h</small>
                            </div>
                        </div>
                        <div className={Style.faqSection}>
                            <h4>❓ Perguntas Frequentes</h4>
                            <div className={Style.faqItem}>
                                <strong>Como recebo meus pagamentos?</strong>
                                <p>Pagamentos são processados semanalmente, toda segunda-feira.</p>
                            </div>
                            <div className={Style.faqItem}>
                                <strong>Posso trabalhar em outros horários?</strong>
                                <p>Sim! Você tem total flexibilidade de horários.</p>
                            </div>
                            <div className={Style.faqItem}>
                                <strong>Como funciona a avaliação?</strong>
                                <p>Clientes avaliam de 1 a 5 estrelas. Mantenha média alta.</p>
                            </div>
                        </div>
                    </div>
                );
            default:
                return (
                    <>
                        <section className={Style.headlineSection}>
                            <div className={Style.headlineContent}>
                                <h1 className={Style.titulo_principal}>
                                    Bem-vindo(a) ao Time DoceLivery!
                                </h1>
                                <p className={Style.chamada}>
                                    Junte-se à nossa equipe e seja a conexão entre doces deliciosos e clientes felizes.
                                </p>
                                <a href="#cadastro" className={Style.ctaButton}>
                                    Comece a Entregar Hoje!
                                </a>
                            </div>
                            <img
                                className={Style.doce_entregador}
                                src={entregadorImage}
                                width="350px"
                                alt="Entregador de doces"
                            />
                        </section>
                        
                        <section id="cadastro" className={Style.ctaSection}>
                            <FaMotorcycle className={Style.ctaIcon} />
                            <h2>Pronto para Começar?</h2>
                            <p>O processo é simples e rápido. Preencha o formulário e inicie sua jornada como entregador(a)!</p>
                            <a href="/cadastro-entregador" className={Style.ctaButtonFinal}>
                                Quero me Cadastrar
                            </a>
                        </section>
                    </>
                );
        }
    };

    return (
        <main className={Style.entregador_main}>
            {/* Menu de Navegação */}
            <section className={Style.menuSection}>
                <div className={Style.menuGrid}>
                    <FeatureCard
                        icon={<FaMotorcycle />}
                        title="Início"
                        description="Informações gerais sobre a plataforma"
                        onClick={() => setSecaoAtiva('inicio')}
                        isActive={secaoAtiva === 'inicio'}
                    />
                    <FeatureCard
                        icon={<IoWalletOutline />}
                        title="Meus Ganhos"
                        description="Visualize seus ganhos e histórico financeiro"
                        onClick={() => setSecaoAtiva('ganhos')}
                        isActive={secaoAtiva === 'ganhos'}
                    />
                    <FeatureCard
                        icon={<FaChartLine />}
                        title="Vantagens"
                        description="Conheça todos os benefícios da plataforma"
                        onClick={() => setSecaoAtiva('vantagens')}
                        isActive={secaoAtiva === 'vantagens'}
                    />
                    <FeatureCard
                        icon={<IoHelpCircleOutline />}
                        title="Suporte"
                        description="Central de ajuda e atendimento ao entregador"
                        onClick={() => setSecaoAtiva('suporte')}
                        isActive={secaoAtiva === 'suporte'}
                    />
                </div>
            </section>

            {/* Conteúdo Dinâmico */}
            <section className={Style.conteudoSection}>
                {renderConteudo()}
            </section>
        </main>
    );
};

export default EntregadorArea;