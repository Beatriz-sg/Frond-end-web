import React from 'react';

function Sidebar({ setSecaoAtiva, secaoAtiva, loja }) {
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

    const buildImageSrc = (rawImage) => {
        if (!rawImage) return null;
        const src = String(rawImage).trim();
        if (!src) return null;
        if (src.startsWith('http') || src.startsWith('//')) return src;
        if (src.startsWith('/uploads/') || src.startsWith('/imagens/') || src.startsWith('/') || src.startsWith('uploads/') || src.startsWith('imagens/')) {
            return src.startsWith('/') ? `${API_BASE_URL}${src}` : `${API_BASE_URL}/${src}`;
        }
        return `${API_BASE_URL}/uploads/${src}`;
    };

    const logoSrc = buildImageSrc(loja?.imagem || loja?.logoUrl || loja?.fotoUrl || loja?.fotoLoja);
    const storeTitle = loja?.nome || loja?.nomeFantasia || loja?.nomeLoja || 'Confeiteiro Painel';

    const links = [
        { id: 'home', nome: 'Início', icone: '🏠' },
        { id: 'pedidos', nome: 'Pedidos', icone: '📦' },
        { id: 'cardapio', nome: 'Cardápio', icone: '🍰' },
        { id: 'finance', nome: 'Finance', icone: '💰' },
        { id: 'agendamento', nome: 'Agendamento', icone: '📅' },
        { id: 'perfil', nome: 'Perfil da Loja', icone: '⚙️' },
    ];

    return (
        <nav style={{
            width: '250px',
            background: 'linear-gradient(135deg, #ff69b4 0%, #8a2be2 100%)',
            backdropFilter: 'blur(10px)',
            padding: '20px',
            boxShadow: '2px 0 15px rgba(0, 0, 0, 0.1)',
            borderRadius: '0 15px 15px 0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            {/* SEÇÃO DO LOGOTIPO DA CONFEITARIA */}
            <div style={{ marginBottom: '15px', marginTop: '10px', textAlign: 'center' }}>
                <img 
                    src={logoSrc || "https://placehold.co/80/ff69b4/white?text=Doce"} 
                    alt={storeTitle}
                    style={{
                        width: '85px',
                        height: '85px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '3px solid white',
                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)'
                    }}
                    onError={(e) => {
                        e.target.src = "https://placehold.co/80/ff69b4/white?text=Doce";
                    }}
                />
            </div>

            <h2 style={{ 
                marginBottom: '30px', 
                color: 'white',
                fontWeight: '800',
                fontSize: '1.3em',
                textAlign: 'center',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'
            }}>
                {loja?.nome || "Confeiteiro Painel"}
            </h2>

            <ul style={{ padding: 0, margin: 0, width: '100%' }}>
                {links.map((link) => (
                    <li
                        key={link.id}
                        onClick={() => setSecaoAtiva(link.id)}
                        style={{
                            padding: '15px 12px',
                            cursor: 'pointer',
                            marginBottom: '8px',
                            borderRadius: '15px',
                            background: secaoAtiva === link.id 
                                ? 'rgba(255, 255, 255, 0.2)' 
                                : 'transparent',
                            backdropFilter: 'blur(5px)',
                            fontWeight: secaoAtiva === link.id ? '700' : '600',
                            color: 'white',
                            listStyle: 'none',
                            transition: 'all 0.3s ease',
                            border: secaoAtiva === link.id 
                                ? '2px solid white' 
                                : '2px solid rgba(255, 255, 255, 0.2)',
                            fontSize: '0.95em',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}
                        onMouseEnter={(e) => {
                            if (secaoAtiva !== link.id) {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                                e.currentTarget.style.transform = 'translateX(5px)';
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (secaoAtiva !== link.id) {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.transform = 'translateX(0)';
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                            }
                        }}
                    >
                        <span style={{ fontSize: '1.2em' }}>{link.icone}</span>
                        <span>{link.nome}</span>
                    </li>
                ))}
            </ul>

            <button style={{ 
                marginTop: '40px', 
                padding: '12px 15px', 
                width: '100%', 
                background: 'linear-gradient(135deg, #ff4444 0%, #cc0000 100%)', 
                color: 'white', 
                border: 'none', 
                borderRadius: '15px', 
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.95em',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(5px)',
                boxShadow: '0 4px 15px rgba(255, 68, 68, 0.3)'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #ff1111 0%, #990000 100%)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 68, 68, 0.4)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #ff4444 0%, #cc0000 100%)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 68, 68, 0.3)';
            }}>
                🚪 Sair
            </button>
        </nav>
    );
}

export default Sidebar;