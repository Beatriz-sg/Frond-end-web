import React, { useState } from 'react';
import { IoHelpCircleOutline, IoCallOutline, IoChatbubbleOutline, IoMailOutline } from 'react-icons/io5';
import Styles from './EntregadorSuporte.module.css';

const EntregadorSuporte = () => {
  const [ticketAberto, setTicketAberto] = useState(false);
  const [mensagem, setMensagem] = useState('');

  const handleEnviarTicket = () => {
    if (mensagem.trim()) {
      setTicketAberto(true);
      setMensagem('');
    }
  };

  return (
    <div className={Styles.suporteContainer}>
      
      <div className={Styles.suporteHeader}>
        <h2>🆘 Central de Ajuda</h2>
        <p>Estamos aqui para ajudar você! Escolha a melhor forma de contato.</p>
      </div>

      <div className={Styles.contatoCards}>
        <div className={Styles.contatoCard}>
          <IoChatbubbleOutline size={24} color="#10b981" />
          <div>
            <h3>Chat Online</h3>
            <p>Suporte em tempo real</p>
            <small>Disponível 24/7</small>
          </div>
        </div>
        
        <div className={Styles.contatoCard}>
          <IoCallOutline size={24} color="#3b82f6" />
          <div>
            <h3>Telefone</h3>
            <p>(11) 4000-1234</p>
            <small>Seg-Dom: 6h às 24h</small>
          </div>
        </div>
        
        <div className={Styles.contatoCard}>
          <IoMailOutline size={24} color="#8b5cf6" />
          <div>
            <h3>E-mail</h3>
            <p>entregador@docelivery.com</p>
            <small>Resposta em até 2h</small>
          </div>
        </div>
      </div>

      <div className={Styles.ticketCard}>
        <h3>🎫 Abrir Chamado</h3>
        <p>Descreva seu problema ou dúvida e nossa equipe entrará em contato.</p>
        
        {!ticketAberto ? (
          <div className={Styles.ticketForm}>
            <textarea
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              placeholder="Descreva sua dúvida ou problema..."
              rows="4"
            />
            <button 
              className={Styles.enviarBtn}
              onClick={handleEnviarTicket}
              disabled={!mensagem.trim()}
            >
              Enviar Chamado
            </button>
          </div>
        ) : (
          <div className={Styles.ticketSucesso}>
            <div className={Styles.sucessoIcon}>✅</div>
            <h4>Chamado Enviado!</h4>
            <p>Protocolo: #SUP-2024-001</p>
            <small>Nossa equipe entrará em contato em até 30 minutos.</small>
          </div>
        )}
      </div>
    </div>
  );
};

export default EntregadorSuporte;