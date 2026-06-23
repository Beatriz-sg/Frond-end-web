import React, { useState, useEffect } from "react";
import { IoSave, IoTime, IoImage, IoLocation } from "react-icons/io5";
import { useLoja } from "../context/LojaContext";
import ImageUploader from "./ImageUploader";
import Styles from "./PerfilLoja.module.css";
import confeiteiroService from "../services/confeiteiroService";
import api from "../services/api";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const PerfilLoja = () => {
  const { dadosLoja, atualizarDadosLoja, atualizarHorarioFuncionamento } =
    useLoja();

  // eslint-disable-next-line no-unused-vars
  const [lojaIdReal, setLojaIdReal] = useState(null);

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    cnpj: "",
    cep: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    descricao: "",
    imagem: "",
  });

  const [horarios, setHorarios] = useState({
    segunda: "",
    terca: "",
    quarta: "",
    quinta: "",
    sexta: "",
    sabado: "",
    domingo: "",
  });
  const [cepLoading, setCepLoading] = useState(false);

  // Carrega os dados reais vindos do banco de dados ao montar o componente
  useEffect(() => {
    const carregarPerfilAPI = async () => {
      const idUsuario = localStorage.getItem("userId");
      if (!idUsuario) return;

      try {
        // 🟢 Agora recebe o ConfeiteiroDTO mapeado e limpo do Spring Boot
        const usuario = await confeiteiroService.getConfeiteiro(idUsuario);

        if (usuario) {
          // Captura do ID real da loja (pode ser null se ainda não foi criada)
          const loja = usuario.loja || {};

          if (loja.id) {
            setLojaIdReal(loja.id);
          }

          // Tratamento seguro do endereço splitado da loja
          const enderecoPartes = loja.endereco ? loja.endereco.split(",") : [];
          const logradouroBase = enderecoPartes[0] || "";
          let numeroBase = enderecoPartes[1]
            ? enderecoPartes[1].split("-")[0].trim()
            : "";
          let complementoBase =
            enderecoPartes[1] && enderecoPartes[1].split("-")[1]
              ? enderecoPartes[1].split("-")[1].trim()
              : "";

          // Endereço do confeiteiro como fallback quando loja ainda não tem endereço
          const enderecoFallbackPartes = usuario.endereco
            ? usuario.endereco.split(",")
            : [];
          const logradouroFallback = enderecoFallbackPartes[0]?.trim() || "";
          const numeroFallback =
            enderecoFallbackPartes[1]?.split("-")[0]?.trim() || "";

          setFormData({
            nome: loja.nomeFantasia || "",
            email: usuario.email || "",
            telefone: loja.telefone || usuario.telefone || "",
            cnpj: loja.cnpj || "",
            cep: usuario.cep || "",
            logradouro: logradouroBase || logradouroFallback,
            numero: numeroBase || numeroFallback,
            complemento: complementoBase || "",
            bairro: usuario.bairro || "",
            cidade: usuario.cidade || "",
            estado: usuario.uf || "",
            descricao: loja.descricao || "",
            imagem: loja.fotoUrl || loja.imagem || "",
          });

          if (loja.horarioFuncionamento) {
            setHorarios(loja.horarioFuncionamento);
          } else if (dadosLoja?.horarioFuncionamento) {
            setHorarios(dadosLoja.horarioFuncionamento);
          }

          // Atualiza o cabeçalho do Dashboard com os dados reais da API
          if (atualizarDadosLoja) {
            atualizarDadosLoja({
              id: loja.id || null,
              nome: loja.nomeFantasia || "",
              descricao: loja.descricao || "",
              cnpj: loja.cnpj || "",
              telefone: loja.telefone || usuario.telefone || "",
              endereco: loja.endereco || usuario.endereco || "",
              imagem: loja.fotoUrl || loja.imagem || "",
            });
          }
        }
      } catch (error) {
        console.error(
          "Erro ao carregar perfil da API, tentando dados do contexto local:",
          error,
        );
        if (dadosLoja) {
          setFormData({
            nome: dadosLoja.nomeFantasia || dadosLoja.nome || "",
            email: dadosLoja.email || localStorage.getItem("userEmail") || "",
            telefone:
              dadosLoja.telefone || localStorage.getItem("userTelefone") || "",
            cnpj: dadosLoja.cnpj || localStorage.getItem("userCnpj") || "",
            cep: dadosLoja.cep || localStorage.getItem("userCep") || "",
            logradouro: dadosLoja.logradouro || "",
            numero: dadosLoja.numero || "",
            complemento: dadosLoja.complemento || "",
            bairro:
              dadosLoja.bairro || localStorage.getItem("userBairro") || "",
            cidade:
              dadosLoja.cidade || localStorage.getItem("userCidade") || "",
            estado: dadosLoja.estado || localStorage.getItem("userUf") || "",
            descricao: dadosLoja.descricao || "",
            imagem: dadosLoja.imagem || "",
          });
        }
      }
    };

    carregarPerfilAPI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyMask = (name, value) => {
    const digits = value.replace(/\D/g, "");
    if (name === "telefone") {
      return digits
        .slice(0, 11)
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d{1,4})$/, "$1-$2");
    }
    if (name === "cnpj") {
      return digits
        .slice(0, 14)
        .replace(/(\d{2})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1/$2")
        .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
    }
    if (name === "cep") {
      return digits.slice(0, 8).replace(/(\d{5})(\d{1,3})$/, "$1-$2");
    }
    return value;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const masked = ["telefone", "cnpj", "cep"].includes(name)
      ? applyMask(name, value)
      : value;
    setFormData((prev) => ({ ...prev, [name]: masked }));

    if (name === "cep") {
      const digits = value.replace(/\D/g, "");
      if (digits.length === 8) {
        setCepLoading(true);
        fetch(`https://viacep.com.br/ws/${digits}/json/`)
          .then((r) => r.json())
          .then((data) => {
            if (!data.erro) {
              setFormData((prev) => ({
                ...prev,
                logradouro: data.logradouro || "",
                bairro: data.bairro || "",
                city: data.localidade || "", // Mantendo mapeamentos originais
                cidade: data.localidade || "",
                estado: data.uf || "",
              }));
            }
          })
          .catch((err) => console.error("Erro ao buscar CEP", err))
          .finally(() => setCepLoading(false));
      }
    }
  };

  const handleHorarioChange = (dia, valor) => {
    setHorarios((prev) => ({ ...prev, [dia]: valor }));
  };

  const tratarSalvar = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem("userId");
    const idParaAtualizar = lojaIdReal || userId;

    if (!idParaAtualizar) {
      alert("Não foi possível identificar o usuário. Faça login novamente.");
      return;
    }

    const cnpjLimpo = formData.cnpj ? formData.cnpj.replace(/\D/g, "") : "";
    if (!cnpjLimpo) {
      alert("Por favor, preencha o CNPJ da sua confeitaria.");
      return;
    }

    const dadosDaLoja = {
      nomeFantasia: formData.nome,
      cnpj: cnpjLimpo,
      telefone: formData.telefone ? formData.telefone.replace(/\D/g, "") : null,
      descricao: formData.descricao || "",
      endereco: `${formData.logradouro}, ${formData.numero}${formData.complemento ? " - " + formData.complemento : ""}`,
      confeiteiro: {
        id: Number(userId),
      },
    };

    // Monta o FormData para suportar upload de imagem (multipart/form-data

    try {
      const multipartData = new FormData();

      multipartData.append(
        "dados",
        new Blob([JSON.stringify(dadosDaLoja)], { type: "application/json" }),
      );

      if (formData.imagem instanceof File) {
        multipartData.append("imagem", formData.imagem);
      }

      const resposta = await api.put(
        `/confeiteiro/loja/atualizar/${idParaAtualizar}`,
        multipartData,
      );

      const lojaAtualizada = resposta?.loja || resposta || {};

      atualizarDadosLoja({
        id: lojaAtualizada.id || lojaIdReal,
        nome: lojaAtualizada.nomeFantasia || formData.nome,
        descricao: lojaAtualizada.descricao || formData.descricao,
        cnpj: lojaAtualizada.cnpj || formData.cnpj,
        telefone: lojaAtualizada.telefone || formData.telefone,
        endereco:
          lojaAtualizada.endereco ||
          `${formData.logradouro}, ${formData.numero}`,
      });

      atualizarHorarioFuncionamento(horarios);

      if (lojaAtualizada.id) {
        setLojaIdReal(lojaAtualizada.id);
      }

      localStorage.setItem("nomeLoja", formData.nome);

      alert("Perfil da loja atualizado com sucesso!");
    } catch (erro) {
      console.error("Erro:", erro);
      alert("Erro ao atualizar perfil.");
    }
  };
  const diasSemana = [
    { key: "segunda", label: "Segunda-feira" },
    { key: "terca", label: "Terça-feira" },
    { key: "quarta", label: "Quarta-feira" },
    { key: "quinta", label: "Quinta-feira" },
    { key: "sexta", label: "Sexta-feira" },
    { key: "sabado", label: "Sábado" },
    { key: "domingo", label: "Domingo" },
  ];

  return (
    <div className={Styles.perfilContainer}>
      <div className={Styles.header}>
        <h1>Perfil da Loja</h1>
        <p>Gerencie as informações da sua confeitaria</p>
      </div>

      <form onSubmit={tratarSalvar} className={Styles.perfilForm}>
        <div className={Styles.section}>
          <h2>
            <IoLocation size={20} />
            Informações Básicas
          </h2>

          <div className={Styles.formRow}>
            <div className={Styles.formGroup}>
              <label>Nome da Loja *</label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Nome da sua confeitaria"
                required
              />
            </div>
            <div className={Styles.formGroup}>
              <label>CNPJ *</label>
              <input
                type="text"
                name="cnpj"
                value={formData.cnpj}
                onChange={handleChange}
                placeholder="00.000.000/0000-00"
                maxLength={18}
                required
              />
            </div>
          </div>

          <div className={Styles.formRow}>
            <div className={Styles.formGroup}>
              <label>E-mail *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="contato@confeitaria.com"
                required
              />
            </div>
            <div className={Styles.formGroup}>
              <label>Telefone *</label>
              <input
                type="tel"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                placeholder="(00) 00000-0000"
                maxLength={15}
                required
              />
            </div>
          </div>

          <div className={Styles.formRow}>
            <div className={Styles.formGroup}>
              <label>CEP *</label>
              <input
                type="text"
                name="cep"
                value={formData.cep}
                onChange={handleChange}
                placeholder="00000-000"
                maxLength={9}
                required
              />
              {cepLoading && (
                <small style={{ color: "#c71585" }}>Buscando CEP...</small>
              )}
            </div>
            <div className={Styles.formGroup}>
              <label>Estado</label>
              <input
                type="text"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                placeholder="UF"
                maxLength={2}
              />
            </div>
          </div>

          <div className={Styles.formGroup}>
            <label>Logradouro *</label>
            <input
              type="text"
              name="logradouro"
              value={formData.logradouro}
              onChange={handleChange}
              placeholder="Rua, Avenida..."
              required
            />
          </div>

          <div className={Styles.formRow}>
            <div className={Styles.formGroup}>
              <label>Número *</label>
              <input
                type="text"
                name="numero"
                value={formData.numero}
                onChange={handleChange}
                placeholder="123"
                required
              />
            </div>
            <div className={Styles.formGroup}>
              <label>Complemento</label>
              <input
                type="text"
                name="complemento"
                value={formData.complemento}
                onChange={handleChange}
                placeholder="Apto, Bloco..."
              />
            </div>
          </div>

          <div className={Styles.formRow}>
            <div className={Styles.formGroup}>
              <label>Bairro *</label>
              <input
                type="text"
                name="bairro"
                value={formData.bairro}
                onChange={handleChange}
                placeholder="Bairro"
                required
              />
            </div>
            <div className={Styles.formGroup}>
              <label>Cidade *</label>
              <input
                type="text"
                name="cidade"
                value={formData.cidade}
                onChange={handleChange}
                placeholder="Cidade"
                required
              />
            </div>
          </div>

          <div className={Styles.formGroup}>
            <label>Descrição da Loja</label>
            <textarea
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              rows="4"
              placeholder="Conte sobre sua confeitaria, especialidades e diferenciais..."
            />
          </div>
        </div>

        <div className={Styles.section}>
          <h2>
            <IoImage size={20} />
            Imagem da Loja
          </h2>
          <ImageUploader
            onImageSelect={(file) =>
              setFormData((prev) => ({
                ...prev,
                imagem: file,
              }))
            }
            currentImage={formData.imagem}
          />
        </div>

        <div className={Styles.section}>
          <h2>
            <IoTime size={20} />
            Horário de Funcionamento
          </h2>

          <div className={Styles.horariosGrid}>
            {diasSemana.map((dia) => (
              <div key={dia.key} className={Styles.horarioItem}>
                <label>{dia.label}</label>
                <input
                  type="text"
                  value={horarios[dia.key] || ""}
                  onChange={(e) => handleHorarioChange(dia.key, e.target.value)}
                  placeholder="8:00 - 18:00 ou Fechado"
                />
              </div>
            ))}
          </div>
        </div>

        <div className={Styles.formActions}>
          <button type="submit" className={Styles.saveButton}>
            <IoSave size={20} />
            Salvar Alterações
          </button>
        </div>
      </form>
    </div>
  );
};

export default PerfilLoja;
