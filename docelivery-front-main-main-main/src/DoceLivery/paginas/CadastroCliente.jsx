import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Styles from './Formulario.module.css';
import logoImage from '../assests/img/doce_Livre_3.jpg';
import authService from '../services/authService';
import { isValidCpf } from '../utils/cpf';

const STEPS = ['Dados Pessoais', 'Endereço', 'Acesso'];

const CadastroCliente = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [cepLoading, setCepLoading] = useState(false);
    const [cepErro, setCepErro] = useState('');
    const [cpfErro, setCpfErro] = useState('');
    const [erro, setErro] = useState('');
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        nome: '',
        apelido: '',
        cpf: '',
        dataNascimento: '',
        telefone: '',
        cep: '',
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
        email: '',
        senha: '',
        confirmarSenha: '',
    });

    const applyMask = (name, value) => {
        const digits = value.replace(/\D/g, '');
        if (name === 'cpf') {
            return digits.slice(0, 11)
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        }
        if (name === 'telefone') {
            return digits.slice(0, 11)
                .replace(/(\d{2})(\d)/, '($1) $2')
                .replace(/(\d{5})(\d{1,4})$/, '$1-$2');
        }
        return value;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const masked = ['cpf', 'telefone'].includes(name) ? applyMask(name, value) : value;
        setFormData(prev => ({ ...prev, [name]: masked }));

        // Real-time CPF validation — triggers as soon as 11 digits are entered
        if (name === 'cpf') {
            const digits = masked.replace(/\D/g, '');
            if (digits.length === 11) {
                setCpfErro(isValidCpf(masked) ? '' : 'CPF inválido.');
            } else {
                setCpfErro('');
            }
        }
    };

    const handleCepChange = async (e) => {
        const digits = e.target.value.replace(/\D/g, '');
        const cepFormatado = digits.slice(0, 8).replace(/(\d{5})(\d{1,3})$/, '$1-$2');
        setFormData(prev => ({ ...prev, cep: cepFormatado }));
        setCepErro('');

        if (digits.length === 8) {
            setCepLoading(true);
            try {
                const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
                const data = await res.json();
                if (data.erro) {
                    setCepErro('CEP não encontrado.');
                } else {
                    setFormData(prev => ({
                        ...prev,
                        logradouro: data.logradouro || '',
                        bairro: data.bairro || '',
                        cidade: data.localidade || '',
                        estado: data.uf || '',
                    }));
                }
            } catch {
                setCepErro('Erro ao buscar CEP.');
            } finally {
                setCepLoading(false);
            }
        }
    };

    const nextStep = (e) => {
        e.preventDefault();
        // Block step 0 → 1 if CPF is invalid
        if (step === 0 && !isValidCpf(formData.cpf)) {
            setCpfErro('CPF inválido.');
            return;
        }
        setStep(s => s + 1);
    };

    const prevStep = () => setStep(s => s - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro('');

        if (formData.senha !== formData.confirmarSenha) {
            setErro('As senhas não coincidem.');
            return;
        }

        setLoading(true);
        try {
            // CORREÇÃO PRINCIPAL: Limpando máscaras para o Banco de Dados
            const dadosParaEnviar = {
                nome: formData.nome,
                apelido: formData.apelido,
                cpf: formData.cpf.replace(/\D/g, ''), // Envia apenas números (11 dígitos)
                cep: formData.cep.replace(/\D/g, ''), // Envia apenas números (8 dígitos)
                // Mantendo a concatenação para a coluna String 'endereco' do seu Usuario.java
                endereco: `${formData.logradouro}, ${formData.numero}${formData.complemento ? ' - ' + formData.complemento : ''}`,
                bairro: formData.bairro,
                cidade: formData.cidade,
                uf: formData.estado, 
                telefone: formData.telefone.replace(/\D/g, ''), // Envia apenas números
                email: formData.email,
                senha: formData.senha,
                dataNascimento: formData.dataNascimento,
                codStatus: true 
            };

            await authService.cadastroCliente(dadosParaEnviar);
            alert('Cadastro realizado com sucesso!');
            navigate('/docelivery/cliente/login-cliente');
        } catch (error) {
            console.error("Erro na API:", error);
            // Surface the exact message returned by the API (HTTP 400/409)
            const apiMsg = error?.response?.data?.error
                || error?.response?.data?.message
                || error?.response?.data;
            setErro(typeof apiMsg === 'string' ? apiMsg : 'Erro ao cadastrar. Verifique se o CPF ou Email já existem.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={Styles.form_container}>
            <div className={Styles.form_card}>
                <img src={logoImage} alt="DoceLivery Logo" className={Styles.form_logo} />
                <h2>Cadastre-se como Cliente</h2>

                {/* Progress Bar */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
                    {STEPS.map((label, i) => (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                            <div style={{
                                width: '32px', height: '32px', borderRadius: '50%',
                                background: i <= step ? '#c71585' : '#e0e0e0',
                                color: i <= step ? '#fff' : '#999',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: 'bold', fontSize: '0.85rem', transition: 'all 0.3s'
                            }}>{i + 1}</div>
                            <span style={{ fontSize: '0.7rem', color: i === step ? '#c71585' : '#999' }}>{label}</span>
                        </div>
                    ))}
                </div>

                <form onSubmit={step === STEPS.length - 1 ? handleSubmit : nextStep}>
                    {step === 0 && (
                        <>
                            <h3 className={Styles.form_card?.h3}>Dados Pessoais</h3>
                            <div className={Styles.form_group}>
                                <label>Nome Completo</label>
                                <input type="text" name="nome" value={formData.nome} onChange={handleChange} required />
                            </div>
                            <div className={Styles.form_group}>
                                <label>Apelido</label>
                                <input type="text" name="apelido" value={formData.apelido} onChange={handleChange} />
                            </div>
                            <div className={Styles.form_row}>
                                <div className={Styles.form_group}>
                                    <label>CPF</label>
                                    <input type="text" name="cpf" value={formData.cpf} onChange={handleChange} placeholder="000.000.000-00" maxLength={14} required />
                                    {cpfErro && <small style={{ color: 'red' }}>{cpfErro}</small>}
                                </div>
                                <div className={Styles.form_group}>
                                    <label>Data de Nascimento</label>
                                    <input type="date" name="dataNascimento" value={formData.dataNascimento} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className={Styles.form_group}>
                                <label>Telefone</label>
                                <input type="tel" name="telefone" value={formData.telefone} onChange={handleChange} placeholder="(XX) XXXXX-XXXX" maxLength={15} required />
                            </div>
                        </>
                    )}

                    {step === 1 && (
                        <>
                            <h3>Endereço</h3>
                            <div className={Styles.form_row}>
                                <div className={Styles.form_group}>
                                    <label>CEP</label>
                                    <input type="text" name="cep" value={formData.cep} onChange={handleCepChange} placeholder="00000-000" maxLength={9} required />
                                    {cepLoading && <small style={{ color: '#c71585' }}>Buscando CEP...</small>}
                                    {cepErro && <small style={{ color: 'red' }}>{cepErro}</small>}
                                </div>
                                <div className={Styles.form_group}>
                                    <label>Estado (UF)</label>
                                    <input type="text" name="estado" value={formData.estado} onChange={handleChange} placeholder="Ex: SP" maxLength={2} required />
                                </div>
                            </div>
                            <div className={Styles.form_group}>
                                <label>Logradouro</label>
                                <input type="text" name="logradouro" value={formData.logradouro} onChange={handleChange} placeholder="Rua, Avenida..." required />
                            </div>
                            <div className={Styles.form_row}>
                                <div className={Styles.form_group}>
                                    <label>Número</label>
                                    <input type="text" name="numero" value={formData.numero} onChange={handleChange} required />
                                </div>
                                <div className={Styles.form_group}>
                                    <label>Complemento</label>
                                    <input type="text" name="complemento" value={formData.complemento} onChange={handleChange} placeholder="Apto, Bloco..." />
                                </div>
                            </div>
                            <div className={Styles.form_row}>
                                <div className={Styles.form_group}>
                                    <label>Bairro</label>
                                    <input type="text" name="bairro" value={formData.bairro} onChange={handleChange} required />
                                </div>
                                <div className={Styles.form_group}>
                                    <label>Cidade</label>
                                    <input type="text" name="cidade" value={formData.cidade} onChange={handleChange} required />
                                </div>
                            </div>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <h3>Dados de Acesso</h3>
                            <div className={Styles.form_group}>
                                <label>Email</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                            </div>
                            <div className={Styles.form_group}>
                                <label>Senha</label>
                                <input type="password" name="senha" value={formData.senha} onChange={handleChange} required />
                            </div>
                            <div className={Styles.form_group}>
                                <label>Confirme a Senha</label>
                                <input type="password" name="confirmarSenha" value={formData.confirmarSenha} onChange={handleChange} required />
                            </div>
                            {erro && <p style={{ color: 'red', marginBottom: '8px', fontSize: '0.9rem' }}>{erro}</p>}
                        </>
                    )}

                    <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                        {step > 0 && (
                            <button type="button" onClick={prevStep} className={Styles.form_button}
                                style={{ background: '#aaa' }}>
                                Voltar
                            </button>
                        )}
                        <button type="submit" className={Styles.form_button} disabled={loading}>
                            {step === STEPS.length - 1 ? (loading ? 'Cadastrando...' : 'Finalizar Cadastro') : 'Próximo'}
                        </button>
                    </div>
                </form>

                <p className={Styles.form_link}>
                    Já tem uma conta? <Link to="/docelivery/cliente/login-cliente">Faça login</Link>
                </p>
            </div>
        </div>
    );
};

export default CadastroCliente;