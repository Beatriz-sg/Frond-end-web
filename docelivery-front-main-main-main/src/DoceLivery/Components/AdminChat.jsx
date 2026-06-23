import React, { useState, useEffect, useRef } from 'react';
import { IoSendOutline, IoPersonOutline, IoTimeOutline, IoCheckmarkDoneOutline } from 'react-icons/io5';
import Styles from './AdminChat.module.css';

const AdminChat = () => {
  const [activeChats, setActiveChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState(12);
  const messagesEndRef = useRef(null);

  const mockChats = [
    {
      id: 1,
      user: 'Maria Silva',
      userType: 'cliente',
      status: 'online',
      lastMessage: 'Meu pedido ainda não chegou',
      timestamp: new Date(Date.now() - 300000),
      unread: 2,
      priority: 'high',
      messages: [
        { id: 1, sender: 'user', text: 'Olá, preciso de ajuda', time: new Date(Date.now() - 600000) },
        { id: 2, sender: 'admin', text: 'Olá Maria! Como posso ajudá-la?', time: new Date(Date.now() - 580000) },
        { id: 3, sender: 'user', text: 'Meu pedido ainda não chegou', time: new Date(Date.now() - 300000) }
      ]
    },
    {
      id: 2,
      user: 'João Doces',
      userType: 'confeiteiro',
      status: 'online',
      lastMessage: 'Como altero meu cardápio?',
      timestamp: new Date(Date.now() - 900000),
      unread: 1,
      priority: 'medium',
      messages: [
        { id: 1, sender: 'user', text: 'Como altero meu cardápio?', time: new Date(Date.now() - 900000) }
      ]
    }
  ];

  useEffect(() => {
    setActiveChats(mockChats);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = () => {
    if (!message.trim() || !selectedChat) return;

    const newMessage = {
      id: Date.now(),
      sender: 'admin',
      text: message,
      time: new Date()
    };

    setActiveChats(prev => prev.map(chat => 
      chat.id === selectedChat.id 
        ? { ...chat, messages: [...chat.messages, newMessage], lastMessage: message, timestamp: new Date() }
        : chat
    ));

    setSelectedChat(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage]
    }));

    setMessage('');
    scrollToBottom();
  };

  const quickReplies = [
    'Obrigado por entrar em contato!',
    'Vou verificar isso para você.',
    'Seu pedido está sendo preparado.',
    'Posso ajudá-lo com mais alguma coisa?',
    'Problema resolvido!'
  ];

  return (
    <div className={Styles.chatContainer}>
      <div className={Styles.chatSidebar}>
        <div className={Styles.chatHeader}>
          <h3>Chat ao Vivo</h3>
          <div className={Styles.onlineIndicator}>
            <span className={Styles.onlineDot}></span>
            {onlineUsers} online
          </div>
        </div>

        <div className={Styles.chatList}>
          {activeChats.map(chat => (
            <div 
              key={chat.id}
              className={`${Styles.chatItem} ${selectedChat?.id === chat.id ? Styles.active : ''}`}
              onClick={() => setSelectedChat(chat)}
            >
              <div className={Styles.chatAvatar}>
                <IoPersonOutline size={20} />
                <span className={`${Styles.statusDot} ${Styles[chat.status]}`}></span>
              </div>
              <div className={Styles.chatInfo}>
                <div className={Styles.chatName}>
                  {chat.user}
                  <span className={Styles.userType}>
                    {chat.userType === 'cliente' ? 'C' : 'F'}
                  </span>
                </div>
                <div className={Styles.lastMessage}>{chat.lastMessage}</div>
                <div className={Styles.chatTime}>
                  {chat.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              {chat.unread > 0 && (
                <div className={Styles.unreadBadge}>{chat.unread}</div>
              )}
              {chat.priority === 'high' && (
                <div className={Styles.priorityBadge}>!</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={Styles.chatMain}>
        {selectedChat ? (
          <>
            <div className={Styles.chatMainHeader}>
              <div className={Styles.chatUserInfo}>
                <IoPersonOutline size={24} />
                <div>
                  <h4>{selectedChat.user}</h4>
                  <span>{selectedChat.userType === 'cliente' ? 'Cliente' : 'Confeiteiro'}</span>
                </div>
              </div>
              <div className={Styles.chatActions}>
                <button className={Styles.actionBtn}>Histórico</button>
                <button className={Styles.actionBtn}>Transferir</button>
              </div>
            </div>

            <div className={Styles.messagesContainer}>
              {selectedChat.messages.map(msg => (
                <div key={msg.id} className={`${Styles.message} ${Styles[msg.sender]}`}>
                  <div className={Styles.messageContent}>
                    <p>{msg.text}</p>
                    <span className={Styles.messageTime}>
                      {msg.time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      {msg.sender === 'admin' && <IoCheckmarkDoneOutline size={12} />}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className={Styles.quickReplies}>
              {quickReplies.map((reply, index) => (
                <button 
                  key={index}
                  className={Styles.quickReply}
                  onClick={() => setMessage(reply)}
                >
                  {reply}
                </button>
              ))}
            </div>

            <div className={Styles.messageInput}>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Digite sua mensagem..."
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button onClick={sendMessage} className={Styles.sendBtn}>
                <IoSendOutline size={20} />
              </button>
            </div>
          </>
        ) : (
          <div className={Styles.noChatSelected}>
            <IoPersonOutline size={64} />
            <h3>Selecione um chat para começar</h3>
            <p>Escolha uma conversa da lista para iniciar o atendimento</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChat;