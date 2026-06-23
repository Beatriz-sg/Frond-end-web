import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CardapioPublico from '../Components/CardapioPublico';
import ConfeiteiroService from '../services/confeiteiroService';
import { IoArrowBack, IoStar, IoLocation, IoTime, IoCall, IoCalendarOutline } from 'react-icons/io5';
import Styles from './LojaIndividual.module.css';
import { IMAGE_MAP } from '../data/imageImports';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const IMAGE_URL = `${API_BASE_URL}/uploads`;

const LojaIndividual = () => {
    const { lojaId } = useParams();
    const navigate = useNavigate();
    const [loja, setLoja] = useState(null);
    const [showEncomendaModal, setShowEncomendaModal] = useState(false);
    const [encomendaData, setEncomendaData] = useState({
        produto: '',
        descricao: '',
        dataEntrega: '',
        observacoes: ''
    });

    // FUNÇÃO CORRETIVA: Centraliza o mapeamento e remove a duplicação de fallbacks
    const mapearDadosLoja = useCallback((dadosBrutos) => {
        const info = dadosBrutos?.loja || dadosBrutos || {};
        const rawImagem = info.imagem || info.imagemUrl || info.logoUrl || info.fotoUrl;

        // confeiteiroId: ID do usuário confeiteiro (dono da loja)
        // Pode vir como dadosBrutos.id (quando é um ConfeiteiroDTO)
        // ou como info.confeiteiroId / info.confeiteiro.id (quando é um LojaDTO)
        const confeiteiroId = dadosBrutos?.id 
            || info?.confeiteiroId 
            || info?.confeiteiro?.id 
            || Number(lojaId);

        return {
            id: info.id || null,              // ID real da entidade Loja
            confeiteiroId,                     // ID do confeiteiro — usado para buscar produtos
            nome: info.nomeFantasia || info.nomeLoja || info.nome || dadosBrutos?.nome || 'Confeitaria',
            telefone: info.telefone || dadosBrutos?.telefone || '',
            endereco: info.endereco || (info.logradouro ? `${info.logradouro}, ${info.numero}` : ''),
            descricao: info.descricao || dadosBrutos?.descricao || '',
            avaliacao: dadosBrutos?.avaliacao || '5.0',
            totalAvaliacoes: dadosBrutos?.totalAvaliacoes || '0',
            imagem: rawImagem
                ? (String(rawImagem).startsWith('http') || String(rawImagem).startsWith('/src') || String(rawImagem).startsWith('data:')
                    ? rawImagem
                    : `${IMAGE_URL}/${rawImagem}`)
                : IMAGE_MAP['brigadeiro'],
            horarioFuncionamento: info.horarioFuncionamento || {
                segunda: '08:00 - 18:00', terca: '08:00 - 18:00',
                quarta: '08:00 - 18:00', quinta: '08:00 - 18:00',
                sexta: '08:00 - 18:00', sabado: '08:00 - 16:00',
                domingo: 'Fechado'
            }
        };
    }, [lojaId]);

    useEffect(() => {
        // Mapear dados e carregar loja movidos para dentro do efeito ou protegidos
        // Seguindo instrução de mover ou usar useCallback
        const carregarLoja = async () => {
            try {
                const response = await ConfeiteiroService.getConfeiteiro(lojaId);
                const dados = response.data || response;
                
                // Aplica o mapeador unificado com os dados da API
                setLoja(mapearDadosLoja(dados));
            } catch (error) {
                console.error('Erro ao carregar loja da API, tentando localStorage:', error);
                
                const stored = localStorage.getItem('selectedStore');
                if (stored) {
                    const storedData = JSON.parse(stored);
                    // Aplica o MESMO mapeador unificado com os dados do LocalStorage
                    setLoja(mapearDadosLoja(storedData));
                }
            }
        };
        
        if (lojaId) carregarLoja();
    }, [lojaId, mapearDadosLoja]);

    const handleVoltar = () => {
        navigate('/docelivery/cliente/Home-Page');
    };
    
    const handleEncomendaSubmit = async (e) => {
        e.preventDefault();
        try {
            // Aqui simulamos o envio da solicitação para a API de pedidos
            console.log("Solicitando encomenda para loja:", loja.id, encomendaData);
            
            alert(`Pedido de encomenda enviado para ${loja.nome}!\nAguarde a confirmação da confeitaria.`);
            
            setShowEncomendaModal(false);
            setEncomendaData({ produto: '', descricao: '', dataEntrega: '', observacoes: '' });
        } catch (error) {
            console.error(error);
            alert("Erro ao processar solicitação de encomenda.");
        }
    };

    if (!loja) {
        return <div className={Styles.loading}>Carregando...</div>;
    }

    return (
        <div className={Styles.lojaIndividual}>
            <div className={Styles.header}>
                <button className={Styles.voltarBtn} onClick={handleVoltar}>
                    <IoArrowBack size={24} />
                </button>
                <h1>Loja</h1>
            </div>

            <div className={Styles.lojaHeader}>
                <div className={Styles.lojaImagem}>
                    <img 
                        src={loja.imagem} 
                        alt={loja.nome}
                        onError={(e) => e.target.src = IMAGE_MAP['brigadeiro']}
                    />
                </div>
                <div className={Styles.lojaInfo}>
                    <h2>{loja.nome}</h2>
                    <div className={Styles.avaliacao}>
                        <IoStar className={Styles.starIcon} />
                        <span>{loja.avaliacao}</span>
                        <span className={Styles.totalAvaliacoes}>({loja.totalAvaliacoes} avaliações)</span>
                    </div>
                    <div className={Styles.endereco}>
                        <IoLocation size={16} />
                        <span>{loja.endereco}</span>
                    </div>
                    <div className={Styles.telefone}>
                        <IoCall size={16} />
                        <span>{loja.telefone}</span>
                    </div>
                    <p className={Styles.descricaoText}>{loja.descricao}</p>
                </div>
            </div>

            <div className={Styles.horarioSection}>
                <h3>
                    <IoTime size={20} />
                    Horário de Funcionamento
                </h3>
                <div className={Styles.horarioGrid}>
                    {Object.entries(loja.horarioFuncionamento).map(([dia, horario]) => (
                        <div key={dia} className={Styles.horarioItem}>
                            <span className={Styles.dia}>{dia}</span>
                            <span className={Styles.horario}>{horario}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className={Styles.cardapioSection}>
                <CardapioPublico loja={loja} onOpenEncomendaModal={() => setShowEncomendaModal(true)} />
            </div>
            
            {showEncomendaModal && (
                <div className={Styles.modalOverlay} onClick={() => setShowEncomendaModal(false)}>
                    <div className={Styles.encomendaModal} style={{ borderTop: '6px solid #8a2be2' }} onClick={(e) => e.stopPropagation()}>
                        <h3 style={{ color: '#8a2be2', fontWeight: '700' }}>Solicitar Encomenda</h3>
                        <p style={{ fontSize: '12px', color: '#666', textAlign: 'center', marginBottom: '20px' }}>Você está solicitando um pedido personalizado para <strong>{loja.nome}</strong></p>
                        <form onSubmit={handleEncomendaSubmit}>
                            <div className={Styles.formGroup}>
                                <label>Produto/Tipo de Doce:</label>
                                <input
                                    type="text"
                                    value={encomendaData.produto}
                                    onChange={(e) => setEncomendaData({...encomendaData, produto: e.target.value})}
                                    placeholder="Ex: Bolo de chocolate, Brigadeiros..."
                                    required
                                />
                            </div>
                            <div className={Styles.formGroup}>
                                <label>Descrição/Detalhes:</label>
                                <textarea
                                    value={encomendaData.descricao}
                                    onChange={(e) => setEncomendaData({...encomendaData, descricao: e.target.value})}
                                    placeholder="Descreva detalhes como tamanho, sabor, decoração..."
                                    rows="3"
                                    required
                                />
                            </div>
                            <div className={Styles.formGroup}>
                                <label>Data de Entrega:</label>
                                <input
                                    type="date"
                                    value={encomendaData.dataEntrega}
                                    onChange={(e) => setEncomendaData({...encomendaData, dataEntrega: e.target.value})}
                                    min={new Date().toISOString().split('T')[0]}
                                    required
                                />
                            </div>
                            <div className={Styles.formGroup}>
                                <label>Observações:</label>
                                <textarea
                                    value={encomendaData.observacoes}
                                    onChange={(e) => setEncomendaData({...encomendaData, observacoes: e.target.value})}
                                    placeholder="Observações adicionais..."
                                    rows="2"
                                />
                            </div>
                            <div className={Styles.modalActions}>
                                <button type="button" onClick={() => setShowEncomendaModal(false)} className={Styles.cancelBtn}>
                                    Cancelar
                                </button>
                                <button type="submit" className={Styles.submitBtn}>
                                    Solicitar Encomenda
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LojaIndividual;