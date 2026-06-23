import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Styles from './Formulario.module.css';
import logoImage from '../assests/img/doce_Livre_3.jpg';

const STEPS = ['Dados Pessoais', 'Confeitaria', 'Acesso'];

const CadastroConfeiteiro = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [cepLoading, setCepLoading] = useState(false);
    const [cepErro, setCepErro] = useState('');
    const [erro, setErro] = useState('');
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        nome: '', cpf: '', dataNascimento: '', telefone: '',
        nomeConfeitaria: '', cnpj: '',
        cep: '', logradouro: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '',
        email: '', senha: '', confirmarSenha: '',
    });

    const applyMask = (name, value) => {
        const digits = value.replace(/\D/g, '');
        if (name === 'cpf') {
            return digits.slice(0, 11)
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        }
        if (name === 'cnpj') {
            return digits.slice(0, 14)
                .replace(/(\d{2})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1/$2')
                .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
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
        const masked = ['cpf', 'cnpj', 'telefone'].includes(name) ? applyMask(name, value) : value;
        setFormData(prev => ({ ...prev, [name]: masked }));
    };

    const handleCepChange = async (e) => {
        const digits = e.target.value.replace(/\D/g, '');
        const cep = digits;
        const cepFormatado = digits.slice(0, 8).replace(/(\d{5})(\d{1,3})$/, '$1-$2');
        setFormData(prev => ({ ...prev, cep: cepFormatado }));
        setCepErro('');
        if (cep.length === 8) {
            setCepLoading(true);
            try {
                const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
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

    const nextStep = (e) => { e.preventDefault(); setStep(s => s + 1); };
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
            const dadosConfeiteiro = {
                nome: formData.nome,
                email: formData.email,
                senha: formData.senha,
                telefone: formData.telefone,
                cpf: formData.cpf,
                tipoUsuario: 'CONFEITEIRO',
                dataNascimento: formData.dataNascimento,
                cep: formData.cep.replace(/\D/g, ''),
                endereco: `${formData.logradouro}, ${formData.numero}${formData.complemento ? ', ' + formData.complemento : ''}`,
                bairro: formData.bairro,
                cidade: formData.cidade,
                estado: formData.estado,
                categoria: 'Bolos e Doces',
                loja: {
                    nomeFantasia: formData.nomeConfeitaria,
                    cnpj: formData.cnpj.replace(/\D/g, ''),
                    telefone: formData.telefone.replace(/\D/g, ''),
                    endereco: `${formData.logradouro}, ${formData.numero}${formData.complemento ? ', ' + formData.complemento : ''}`,
                    descricao: formData.descricaoLoja || ''
                }
            };

            const formPayload = new FormData();
            formPayload.append('dados', new Blob([JSON.stringify(dadosConfeiteiro)], { type: 'application/json' }));
            if (formData.foto) {
                formPayload.append('foto', formData.foto);
            }

            const response = await fetch('http://localhost:8080/api/auth/cadastro/confeiteiro', {
                method: 'POST',
                body: formPayload,
            });

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                setErro(typeof data === 'string' ? data : 'Erro ao cadastrar. Tente novamente.');
                return;
            }

            // Salva o objeto retornado pela API (contém o ID do banco)
            localStorage.setItem('dadosConfeiteiro', JSON.stringify(data));
            alert('Cadastro realizado com sucesso!');
            navigate('/docelivery/confeiteiro/login-confeiteiro');
        } catch {
            setErro('Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={Styles.form_container}>
            <div className={Styles.form_card}>
                <img src={logoImage} alt="DoceLivery Logo" className={Styles.form_logo} />
                <h2>Cadastro de Confeiteiro</h2>

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
                            <h3>Dados Pessoais</h3>
                            <div className={Styles.form_group}>
                                <label>Nome Completo</label>
                                <input type="text" name="nome" value={formData.nome} onChange={handleChange} required />
                            </div>
                            <div className={Styles.form_row}>
                                <div className={Styles.form_group}>
                                    <label>CPF</label>
                                    <input type="text" name="cpf" value={formData.cpf} onChange={handleChange} placeholder="000.000.000-00" maxLength={14} required />
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
                            <h3>Dados da Confeitaria</h3>
                            <div className={Styles.form_group}>
                                <label>Nome da Confeitaria</label>
                                <input type="text" name="nomeConfeitaria" value={formData.nomeConfeitaria} onChange={handleChange} required />
                            </div>
                            <div className={Styles.form_group}>
                                <label>CNPJ (opcional)</label>
                                <input type="text" name="cnpj" value={formData.cnpj} onChange={handleChange} placeholder="00.000.000/0000-00" maxLength={18} />
                            </div>
                            <h3>Endereço</h3>
                            <div className={Styles.form_row}>
                                <div className={Styles.form_group}>
                                    <label>CEP</label>
                                    <input type="text" name="cep" value={formData.cep} onChange={handleCepChange} placeholder="00000-000" maxLength={9} required />
                                    {cepLoading && <small style={{ color: '#c71585' }}>Buscando CEP...</small>}
                                    {cepErro && <small style={{ color: 'red' }}>{cepErro}</small>}
                                </div>
                                <div className={Styles.form_group}>
                                    <label>Estado</label>
                                    <input type="text" name="estado" value={formData.estado} onChange={handleChange} placeholder="UF" maxLength={2} required />
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
                                <input type="password" name="senha" value={formData.senha} onChange={handleChange} minLength={6} required />
                            </div>
                            <div className={Styles.form_group}>
                                <label>Confirme a Senha</label>
                                <input type="password" name="confirmarSenha" value={formData.confirmarSenha} onChange={handleChange} minLength={6} required />
                            </div>
                            {erro && <p style={{ color: 'red', marginBottom: '8px' }}>{erro}</p>}
                        </>
                    )}

                    <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                        {step > 0 && (
                            <button type="button" onClick={prevStep} className={Styles.form_button} style={{ background: '#aaa' }}>
                                Voltar
                            </button>
                        )}
                        <button type="submit" className={Styles.form_button} disabled={loading}>
                            {step === STEPS.length - 1 ? (loading ? 'Cadastrando...' : 'Cadastrar') : 'Próximo'}
                        </button>
                    </div>
                </form>

                <p className={Styles.form_link}>
                    Já tem uma conta? <Link to="/docelivery/confeiteiro/login-confeiteiro">Faça login</Link>
                </p>
            </div>
        </div>
    );
};

export default CadastroConfeiteiro;
