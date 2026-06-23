import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    IoArrowBack, IoCheckmarkCircle, IoStorefront, IoTime,
    IoLocationSharp, IoPencil, IoTicket, IoInformationCircle,
    IoChevronDown, IoChevronUp, IoClose
} from 'react-icons/io5';
import { FaCreditCard, FaMoneyBillWave } from 'react-icons/fa';
import { SiPix } from 'react-icons/si';
import { useCartStore } from '../context/CartContext';
import { useDashboard } from '../context/DashboardContext';
import OrderService from '../services/orderService';
import PaymentService from '../services/paymentService';
import AuthService from '../services/authService';
import Styles from './Pagamento.module.css';

// ─── Cupons válidos (mock — conectar à API depois) ───────────────────────────
const CUPONS_VALIDOS = {
    'DOCE10': { desconto: 0.10, label: '10% de desconto', tipo: 'percentual' },
    'FRETE0': { desconto: 5.00, label: 'Frete grátis', tipo: 'fixo_frete' },
    'PRIMEIRA': { desconto: 0.15, label: '15% no primeiro pedido', tipo: 'percentual' },
};

const PAYMENT_METHODS = [
    { id: 'PIX',      label: 'Pix',               icon: <SiPix size={20} />,          desc: 'Aprovação imediata' },
    { id: 'CREDITO',  label: 'Crédito',           icon: <FaCreditCard size={20} />,   desc: 'Até 12x sem juros' },
    { id: 'DEBITO',   label: 'Débito',            icon: <FaCreditCard size={20} />,   desc: 'Débito à vista' },
    { id: 'DINHEIRO', label: 'Dinheiro',          icon: <FaMoneyBillWave size={20} />,desc: 'Pagar na entrega' },
];

// ─── Componente de seção colapsável ──────────────────────────────────────────
const Section = ({ icon, title, badge, children, defaultOpen = true }) => {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <section className={Styles.card}>
            <button className={Styles.sectionToggle} onClick={() => setOpen(o => !o)} type="button">
                <span className={Styles.sectionToggleLeft}>
                    <span className={Styles.sectionIcon}>{icon}</span>
                    <span className={Styles.sectionTitle}>{title}</span>
                    {badge && <span className={Styles.badge}>{badge}</span>}
                </span>
                {open ? <IoChevronUp size={18} /> : <IoChevronDown size={18} />}
            </button>
            {open && <div className={Styles.sectionBody}>{children}</div>}
        </section>
    );
};

// ─── Componente principal ─────────────────────────────────────────────────────
const Pagamento = () => {
    const navigate = useNavigate();
    const { cartItems, activeStore, clearCart } = useCartStore();
    const { adicionarVenda } = useDashboard();

    // Dados do checkout
    const checkoutData = useMemo(() => JSON.parse(localStorage.getItem('checkoutData') || '{}'), []);
    const itens = useMemo(
        () => cartItems.length > 0 ? cartItems : (checkoutData.cartItems || []),
        [cartItems, checkoutData]
    );
    const loja    = activeStore || checkoutData.activeStore || null;
    const deliveryFeeBase = parseFloat(checkoutData.deliveryFee ?? 5.00);

    // Endereço do cliente
    const clienteLocal = useMemo(() => {
        const u = JSON.parse(localStorage.getItem('user') || '{}');
        const d = JSON.parse(localStorage.getItem('dadosCliente') || '{}');
        return {
            nome:      u.nome || d.nome || localStorage.getItem('userName') || 'Cliente',
            endereco:  u.endereco || d.logradouro || d.endereco || '',
            numero:    d.numero || '',
            bairro:    u.bairro || d.bairro || '',
            cidade:    u.cidade || d.cidade || '',
            uf:        u.uf || d.estado || '',
            cep:       u.cep || d.cep || '',
        };
    }, []);

    // ── Estados ───────────────────────────────────────────────────────────────
    const [metodo,          setMetodo]          = useState('');
    const [isProcessing,    setIsProcessing]    = useState(false);
    const [pedidoConcluido, setPedidoConcluido] = useState(false);

    // Entrega
    const [editandoEndereco, setEditandoEndereco] = useState(false);
    const [endereco, setEndereco] = useState({
        logradouro:  clienteLocal.endereco,
        numero:      clienteLocal.numero,
        complemento: '',
        bairro:      clienteLocal.bairro,
        cidade:      clienteLocal.cidade,
        uf:          clienteLocal.uf,
        cep:         clienteLocal.cep,
    });
    const [cepLoading, setCepLoading] = useState(false);

    // Cupom
    const [cupomInput,   setCupomInput]   = useState('');
    const [cupomAplicado, setCupomAplicado] = useState(null);
    const [cupomErro,    setCupomErro]    = useState('');

    // Info adicionais
    const [obsGeral,    setObsGeral]    = useState('');
    const [semContato,  setSemContato]  = useState(false);
    const [agendado,    setAgendado]    = useState(false);
    const [dataAgend,   setDataAgend]   = useState('');

    // Cartão (formulário)
    const [cardData, setCardData] = useState({ numero: '', nome: '', validade: '', cvv: '' });
    const [troco,    setTroco]    = useState('');
    const [parcelas, setParcelas] = useState('1');

    // ── Cálculos ──────────────────────────────────────────────────────────────
    const subtotal = useMemo(() =>
        itens.reduce((a, i) => a + (parseFloat(i.price) || 0) * (parseInt(i.quantity) || 1), 0),
    [itens]);

    const descontoCupom = useMemo(() => {
        if (!cupomAplicado) return 0;
        if (cupomAplicado.tipo === 'percentual') return subtotal * cupomAplicado.desconto;
        if (cupomAplicado.tipo === 'fixo_frete') return Math.min(deliveryFeeBase, cupomAplicado.desconto);
        return 0;
    }, [cupomAplicado, subtotal, deliveryFeeBase]);

    const frete = cupomAplicado?.tipo === 'fixo_frete'
        ? Math.max(0, deliveryFeeBase - descontoCupom)
        : deliveryFeeBase;

    const totalDesc = cupomAplicado?.tipo === 'percentual' ? descontoCupom : 0;
    const total     = subtotal - totalDesc + frete;

    // ── Handlers de endereço ──────────────────────────────────────────────────
    const handleCepChange = async (val) => {
        const digits = val.replace(/\D/g, '');
        const fmt = digits.slice(0, 8).replace(/(\d{5})(\d{1,3})$/, '$1-$2');
        setEndereco(p => ({ ...p, cep: fmt }));
        if (digits.length === 8) {
            setCepLoading(true);
            try {
                const r = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
                const d = await r.json();
                if (!d.erro) setEndereco(p => ({
                    ...p, logradouro: d.logradouro || '', bairro: d.bairro || '',
                    cidade: d.localidade || '', uf: d.uf || ''
                }));
            } finally { setCepLoading(false); }
        }
    };

    const enderecoFormatado = [
        endereco.logradouro, endereco.numero, endereco.complemento,
        endereco.bairro, endereco.cidade, endereco.uf
    ].filter(Boolean).join(', ');

    // ── Handler cupom ─────────────────────────────────────────────────────────
    const aplicarCupom = () => {
        const c = CUPONS_VALIDOS[cupomInput.toUpperCase().trim()];
        if (c) { setCupomAplicado({ ...c, codigo: cupomInput.toUpperCase().trim() }); setCupomErro(''); }
        else { setCupomErro('Cupom inválido ou expirado.'); setCupomAplicado(null); }
    };

    const removerCupom = () => { setCupomAplicado(null); setCupomInput(''); setCupomErro(''); };

    // ── Mascaras cartão ───────────────────────────────────────────────────────
    const maskCard   = v => v.replace(/\D/g,'').slice(0,16).replace(/(\d{4})/g,'$1 ').trim();
    const maskExpiry = v => v.replace(/\D/g,'').slice(0,4).replace(/(\d{2})(\d)/,'$1/$2');

    // ── Confirmar pedido ──────────────────────────────────────────────────────
    const handleConfirmar = async () => {
        if (!metodo) { alert('Selecione a forma de pagamento.'); return; }
        if ((metodo === 'CREDITO' || metodo === 'DEBITO') &&
            (!cardData.numero || !cardData.nome || !cardData.validade || !cardData.cvv)) {
            alert('Preencha todos os dados do cartão.'); return;
        }
        setIsProcessing(true);
        try {
            const usuario = AuthService.getCurrentUser();
            
            // 1. Envia o pedido para salvar na sua tabela local inicial via OrderService
            const novoPedido = {
                cliente:              { id: usuario?.id },
                loja:                 { id: Number(loja?.id || 4) },
                valorPedido:          total,
                formaPagamento:       metodo,
                status:               'NOVO',
                agendado:             agendado,
                dataEntregaAgendada:  agendado ? dataAgend : null,
                observacao:           obsGeral,
                enderecoEntrega:      enderecoFormatado,
                cupom:                cupomAplicado?.codigo || null,
                itens: itens.map(item => ({
                    produto:        { id: item.id },
                    quantidade:     item.quantity,
                    precoUnitario:  item.price
                }))
            };
            
            const res = await OrderService.createOrder(novoPedido);
            const pedidoSalvo = res?.data || res;

            const dadosPagamentoDTO = {
                id:              pedidoSalvo.id || null, // Repassa o ID gerado pelo banco para o webhook usar depois
                clienteId:       Number(usuario?.id || 1), // 🧠 IDs enviados evitam o erro de id nulo!
                lojaId:          Number(loja?.id || 2),    // 🧠 IDs enviados evitam o erro de id nulo!
                nomeCliente:     usuario?.nome || clienteLocal.nome,
                telefoneCliente: usuario?.telefone || "",
                enderecoEntrega: enderecoFormatado,
                status:          "NOVO",
                total:           total, // O Java espera a propriedade com o nome 'total' (Record do PedidoDTO)
                
                // Dados adicionais que o Mercado Pago vai ler de dentro do DTO se necessário
                email:           'TESTUSER8634487054543614069@testuser.com', // 🟢 Sua conta de teste do MP ativa!
                tokenCartao:     (metodo === 'CREDITO' || metodo === 'DEBITO') ? cardData.numero : null,
                metodo:          metodo.toLowerCase(),

                itens: itens.map(item => ({
                    produtoId:     item.id,
                    nomeProduto:   item.name || item.title,
                    quantidade:    parseInt(item.quantity) || 1,
                    precoUnitario: parseFloat(item.price) || 0
                }))
            };

            // 3. Dispara a requisição passando o DTO unificado completo
            console.log("Processando o pagamento via " + metodo, dadosPagamentoDTO);
            const respostaPagamento = await PaymentService.processarPagamento(dadosPagamentoDTO);
            console.log('Resposta do pagamento recebida:', respostaPagamento);

            // 4. Executa as limpezas de estado e redirecionamentos originais do seu fluxo
            localStorage.setItem('currentOrder', JSON.stringify(pedidoSalvo));
            adicionarVenda(total);
            clearCart();
            localStorage.removeItem('checkoutData');
            setPedidoConcluido(true);
        } catch (err) {
            console.error("Erro detalhado no checkout:", err);
            alert('Erro ao processar pedido. Verifique os dados e tente novamente.');
        } finally {
            setIsProcessing(false);
        }
    };

    // ── Tela de sucesso ───────────────────────────────────────────────────────
    if (pedidoConcluido) return (
        <div className={Styles.container}>
            <div className={Styles.successWrap}>
                <div className={Styles.successIcon}><IoCheckmarkCircle size={76} /></div>
                <h2>Pedido Confirmado! 🧁</h2>
                <p>Seu pedido foi enviado para a confeitaria e está sendo preparado com carinho.</p>
                <div className={Styles.successMeta}>
                    <span><IoStorefront size={15}/> {loja?.name || 'Confeitaria'}</span>
                    <span><IoTime size={15}/> 30–50 min</span>
                    <span><IoLocationSharp size={15}/> {endereco.bairro || 'Endereço'}</span>
                </div>
                <div className={Styles.successTotal}>
                    Total pago: <strong>R$ {total.toFixed(2)}</strong>
                </div>
                <button className={Styles.btnPrimary} onClick={() => navigate('/docelivery/cliente/pedido-status')}>
                    Acompanhar Pedido
                </button>
                <button className={Styles.btnSecondary} onClick={() => navigate('/docelivery/cliente/lojas')}>
                    Voltar às Lojas
                </button>
            </div>
        </div>
    );

    // ── Render principal ──────────────────────────────────────────────────────
    return (
        <div className={Styles.container}>

            {/* ── Header ── */}
            <div className={Styles.header}>
                <button className={Styles.backBtn} onClick={() => window.history.back()}>
                    <IoArrowBack size={22}/>
                </button>
                <div>
                    <h1>Finalizar Pedido</h1>
                    <span className={Styles.headerSub}>{loja?.name || 'Confirme seu pedido'}</span>
                </div>
            </div>

            <div className={Styles.content}>

                {/* ═══════════════════════════════════════════════════
                    1. INFORMAÇÕES DE ENTREGA
                ═══════════════════════════════════════════════════ */}
                <Section icon={<IoLocationSharp size={18}/>} title="Entrega" defaultOpen={true}>
                    <div className={Styles.tempoEstimado}>
                        <IoTime size={16}/>
                        <span>Tempo estimado: <strong>30 – 50 min</strong></span>
                    </div>

                    {!editandoEndereco ? (
                        <div className={Styles.enderecoBox}>
                            <div className={Styles.enderecoTexto}>
                                <strong>{clienteLocal.nome}</strong>
                                <span>{enderecoFormatado || 'Endereço não cadastrado'}</span>
                                {endereco.cep && <span className={Styles.cepTag}>CEP {endereco.cep}</span>}
                            </div>
                            <button className={Styles.editBtn} onClick={() => setEditandoEndereco(true)}>
                                <IoPencil size={15}/> Alterar
                            </button>
                        </div>
                    ) : (
                        <div className={Styles.enderecoForm}>
                            <div className={Styles.formRow}>
                                <div className={Styles.formGroup}>
                                    <label>CEP</label>
                                    <input
                                        className={Styles.input}
                                        value={endereco.cep}
                                        onChange={e => handleCepChange(e.target.value)}
                                        placeholder="00000-000"
                                        maxLength={9}
                                    />
                                    {cepLoading && <small className={Styles.hint}>Buscando...</small>}
                                </div>
                                <div className={Styles.formGroup}>
                                    <label>Estado</label>
                                    <input className={Styles.input} value={endereco.uf}
                                        onChange={e => setEndereco(p => ({...p, uf: e.target.value}))}
                                        placeholder="UF" maxLength={2}/>
                                </div>
                            </div>
                            <div className={Styles.formGroup}>
                                <label>Logradouro</label>
                                <input className={Styles.input} value={endereco.logradouro}
                                    onChange={e => setEndereco(p => ({...p, logradouro: e.target.value}))}
                                    placeholder="Rua, Avenida..."/>
                            </div>
                            <div className={Styles.formRow}>
                                <div className={Styles.formGroup}>
                                    <label>Número</label>
                                    <input className={Styles.input} value={endereco.numero}
                                        onChange={e => setEndereco(p => ({...p, numero: e.target.value}))}
                                        placeholder="123"/>
                                </div>
                                <div className={Styles.formGroup}>
                                    <label>Complemento</label>
                                    <input className={Styles.input} value={endereco.complemento}
                                        onChange={e => setEndereco(p => ({...p, complemento: e.target.value}))}
                                        placeholder="Apto, bloco..."/>
                                </div>
                            </div>
                            <div className={Styles.formRow}>
                                <div className={Styles.formGroup}>
                                    <label>Bairro</label>
                                    <input className={Styles.input} value={endereco.bairro}
                                        onChange={e => setEndereco(p => ({...p, bairro: e.target.value}))}
                                        placeholder="Bairro"/>
                                </div>
                                <div className={Styles.formGroup}>
                                    <label>Cidade</label>
                                    <input className={Styles.input} value={endereco.cidade}
                                        onChange={e => setEndereco(p => ({...p, cidade: e.target.value}))}
                                        placeholder="Cidade"/>
                                </div>
                            </div>
                            <button className={Styles.btnSalvarEnd}
                                onClick={() => setEditandoEndereco(false)}>
                                Confirmar Endereço
                            </button>
                        </div>
                    )}
                </Section>

                {/* ═══════════════════════════════════════════════════
                    2. CUPOM DE DESCONTO
                ═══════════════════════════════════════════════════ */}
                <Section icon={<IoTicket size={18}/>} title="Cupom de Desconto" defaultOpen={false}>
                    {cupomAplicado ? (
                        <div className={Styles.cupomAplicado}>
                            <div className={Styles.cupomInfo}>
                                <IoTicket size={20}/>
                                <div>
                                    <strong>{cupomAplicado.codigo}</strong>
                                    <span>{cupomAplicado.label}</span>
                                </div>
                            </div>
                            <button className={Styles.cupomRemover} onClick={removerCupom}>
                                <IoClose size={18}/>
                            </button>
                        </div>
                    ) : (
                        <div className={Styles.cupomBox}>
                            <input
                                className={`${Styles.input} ${cupomErro ? Styles.inputErro : ''}`}
                                placeholder="Digite seu cupom"
                                value={cupomInput}
                                onChange={e => { setCupomInput(e.target.value.toUpperCase()); setCupomErro(''); }}
                                onKeyDown={e => e.key === 'Enter' && aplicarCupom()}
                            />
                            <button className={Styles.btnAplicar} onClick={aplicarCupom}>Aplicar</button>
                        </div>
                    )}
                    {cupomErro && <p className={Styles.erroMsg}>{cupomErro}</p>}
                    <p className={Styles.hint}>Tente: DOCE10 · FRETE0 · PRIMEIRA</p>
                </Section>

                {/* ═══════════════════════════════════════════════════
                    3. RESUMO DO PEDIDO
                ═══════════════════════════════════════════════════ */}
                <Section icon={<IoStorefront size={18}/>} title="Resumo do Pedido"
                    badge={`${itens.length} ${itens.length === 1 ? 'item' : 'itens'}`}>

                    <ul className={Styles.itemList}>
                        {itens.map((item, i) => (
                            <li key={item.id || i} className={Styles.item}>
                                <div className={Styles.itemLeft}>
                                    {(item.imageUrl || item.image) &&
                                        <img src={item.imageUrl || item.image}
                                            alt={item.name} className={Styles.itemImg}/>}
                                    <div>
                                        <span className={Styles.itemName}>{item.name || item.title}</span>
                                        <span className={Styles.itemQty}>
                                            {item.quantity}x R$ {parseFloat(item.price).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                                <span className={Styles.itemTotal}>
                                    R$ {(item.price * item.quantity).toFixed(2)}
                                </span>
                            </li>
                        ))}
                    </ul>

                    <div className={Styles.divider}/>
                    <div className={Styles.totals}>
                        <div className={Styles.totalRow}><span>Subtotal</span><span>R$ {subtotal.toFixed(2)}</span></div>
                        <div className={Styles.totalRow}><span>Taxa de entrega</span><span>R$ {frete.toFixed(2)}</span></div>
                        {totalDesc > 0 && (
                            <div className={`${Styles.totalRow} ${Styles.desconto}`}>
                                <span>Desconto ({cupomAplicado?.codigo})</span>
                                <span>- R$ {totalDesc.toFixed(2)}</span>
                            </div>
                        )}
                        <div className={`${Styles.totalRow} ${Styles.totalFinal}`}>
                            <span>Total</span><span>R$ {total.toFixed(2)}</span>
                        </div>
                    </div>
                </Section>

                {/* ═══════════════════════════════════════════════════
                    4. INFORMAÇÕES ADICIONAIS
                ═══════════════════════════════════════════════════ */}
                <Section icon={<IoInformationCircle size={18}/>} title="Informações Adicionais" defaultOpen={false}>
                    <div className={Styles.formGroup}>
                        <label>Observações do pedido</label>
                        <textarea
                            className={Styles.textarea}
                            rows={3}
                            placeholder="Ex: Sem açúcar, alergia a nozes, deixar na portaria..."
                            value={obsGeral}
                            onChange={e => setObsGeral(e.target.value)}
                        />
                    </div>
                    <label className={Styles.checkRow}>
                        <input type="checkbox" checked={semContato}
                            onChange={e => setSemContato(e.target.checked)}/>
                        <span>Não ligar na entrega</span>
                    </label>
                    <label className={Styles.checkRow}>
                        <input type="checkbox" checked={agendado}
                            onChange={e => setAgendado(e.target.checked)}/>
                        <span>Agendar para outra data</span>
                    </label>
                    {agendado && (
                        <input
                            type="datetime-local"
                            className={Styles.input}
                            style={{ marginTop: 8 }}
                            value={dataAgend}
                            onChange={e => setDataAgend(e.target.value)}
                        />
                    )}
                </Section>

                {/* ═══════════════════════════════════════════════════
                    5. PAGAMENTO
                ═══════════════════════════════════════════════════ */}
                <Section icon={<FaCreditCard size={16}/>} title="Pagamento">

                    {/* Grade de métodos */}
                    <div className={Styles.methodGrid}>
                        {PAYMENT_METHODS.map(m => (
                            <button
                                key={m.id} type="button"
                                className={`${Styles.methodBtn} ${metodo === m.id ? Styles.methodSelected : ''}`}
                                onClick={() => setMetodo(m.id)}
                            >
                                <span className={Styles.methodIcon}>{m.icon}</span>
                                <span className={Styles.methodLabel}>{m.label}</span>
                                <span className={Styles.methodDesc}>{m.desc}</span>
                                {metodo === m.id && <span className={Styles.methodCheck}>✓</span>}
                            </button>
                        ))}
                    </div>

                    {/* ── Formulário Cartão ── */}
                    {(metodo === 'CREDITO' || metodo === 'DEBITO') && (
                        <div className={Styles.cardForm}>
                            <div className={Styles.cardPreview}>
                                <div className={Styles.cardPreviewTop}>
                                    <span className={Styles.cardBrand}>
                                        {metodo === 'CREDITO' ? '💳 Crédito' : '💳 Débito'}
                                    </span>
                                    <FaCreditCard size={28} style={{ color: 'rgba(255,255,255,0.7)' }}/>
                                </div>
                                <div className={Styles.cardNumber}>
                                    {cardData.numero || '**** **** **** ****'}
                                </div>
                                <div className={Styles.cardBottom}>
                                    <span>{cardData.nome || 'NOME NO CARTÃO'}</span>
                                    <span>{cardData.validade || 'MM/AA'}</span>
                                </div>
                            </div>

                            <div className={Styles.formGroup}>
                                <label>Número do cartão</label>
                                <input
                                    className={Styles.input}
                                    placeholder="0000 0000 0000 0000"
                                    value={cardData.numero}
                                    onChange={e => setCardData(p => ({...p, numero: maskCard(e.target.value)}))}
                                    maxLength={19}
                                />
                            </div>
                            <div className={Styles.formGroup}>
                                <label>Nome impresso no cartão</label>
                                <input
                                    className={Styles.input}
                                    placeholder="NOME SOBRENOME"
                                    value={cardData.nome}
                                    onChange={e => setCardData(p => ({...p, nome: e.target.value.toUpperCase()}))}
                                />
                            </div>
                            <div className={Styles.formRow}>
                                <div className={Styles.formGroup}>
                                    <label>Validade</label>
                                    <input
                                        className={Styles.input}
                                        placeholder="MM/AA"
                                        value={cardData.validade}
                                        onChange={e => setCardData(p => ({...p, validade: maskExpiry(e.target.value)}))}
                                        maxLength={5}
                                    />
                                </div>
                                <div className={Styles.formGroup}>
                                    <label>CVV</label>
                                    <input
                                        className={Styles.input}
                                        placeholder="123"
                                        value={cardData.cvv}
                                        onChange={e => setCardData(p => ({...p, cvv: e.target.value.replace(/\D/g,'').slice(0,4)}))}
                                        maxLength={4}
                                        type="password"
                                    />
                                </div>
                            </div>
                            {metodo === 'CREDITO' && (
                                <div className={Styles.formGroup}>
                                    <label>Parcelas</label>
                                    <select className={Styles.input} value={parcelas}
                                        onChange={e => setParcelas(e.target.value)}>
                                        {[1,2,3,4,5,6,8,10,12].map(n => (
                                            <option key={n} value={n}>
                                                {n}x de R$ {(total / n).toFixed(2)}{n === 1 ? ' (sem juros)' : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── PIX ── */}
                    {metodo === 'PIX' && (
                        <div className={Styles.pixBox}>
                            <div className={Styles.qrCode}>📱</div>
                            <p><strong>Chave PIX:</strong> pagamentos@docelivery.com.br</p>
                            <p className={Styles.hint}>O QR Code será gerado após confirmar o pedido</p>
                        </div>
                    )}

                    {/* ── Dinheiro ── */}
                    {metodo === 'DINHEIRO' && (
                        <div className={Styles.dinheiroBox}>
                            <div className={Styles.formGroup}>
                                <label>Precisa de troco para quanto?</label>
                                <div className={Styles.trocoRow}>
                                    <span className={Styles.currencySign}>R$</span>
                                    <input
                                        className={Styles.input}
                                        type="number"
                                        placeholder="0,00"
                                        value={troco}
                                        onChange={e => setTroco(e.target.value)}
                                        min={total}
                                    />
                                </div>
                                {troco && parseFloat(troco) >= total && (
                                    <small className={Styles.trocoInfo}>
                                        Troco: R$ {(parseFloat(troco) - total).toFixed(2)}
                                    </small>
                                )}
                            </div>
                        </div>
                    )}
                </Section>

            </div>{/* fim .content */}

            {/* ── Rodapé fixo ── */}
            <div className={Styles.footer}>
                <div className={Styles.footerSummary}>
                    <div className={Styles.footerRow}>
                        <span>Subtotal</span><span>R$ {subtotal.toFixed(2)}</span>
                    </div>
                    {totalDesc > 0 && (
                        <div className={`${Styles.footerRow} ${Styles.footerDesconto}`}>
                            <span>Desconto</span><span>- R$ {totalDesc.toFixed(2)}</span>
                        </div>
                    )}
                    <div className={`${Styles.footerRow} ${Styles.footerTotal}`}>
                        <span>Total</span><strong>R$ {total.toFixed(2)}</strong>
                    </div>
                </div>
                <button
                    className={Styles.btnConfirm}
                    onClick={handleConfirmar}
                    disabled={!metodo || isProcessing}
                >
                    {isProcessing
                        ? <span className={Styles.spinner}/>
                        : `Confirmar Pedido · R$ ${total.toFixed(2)}`}
                </button>
            </div>

        </div>
    );
};

export default Pagamento;