import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './index.css';

// Importação das Páginas
import PaginaEntregador from './DoceLivery/paginas/PaginaEntregador';
import CadastroConfeiteiro from './DoceLivery/paginas/CadastroConfeiteiro';
import ConfeiteiroDashboard from './DoceLivery/paginas/ConfeiteiroDashboard';
import CadastroEntregador from './DoceLivery/paginas/CadastroEntregador';
import ApresentacaoProjeto from './DoceLivery/paginas/ApresentacaoProjeto';
import HomePage from './DoceLivery/paginas/HomePage';
import CadastroCliente from './DoceLivery/paginas/CadastroCliente';
import LoginEntregador from './DoceLivery/paginas/LoginEntregador';
import LoginCliente from './DoceLivery/paginas/LoginCliente';
import LoginConfeiteiro from './DoceLivery/paginas/LoginConfeiteiro';
import RecuperarSenha from './DoceLivery/paginas/RecuperarSenha';
import Pagamento from './DoceLivery/paginas/Pagamento';
import LojaIndividual from './DoceLivery/paginas/LojaIndividual';
import PaginaCompleta from './DoceLivery/paginas/PaginaCompleta';
import PerfilCliente from './DoceLivery/paginas/PerfilCliente';
import OrderStatus from './DoceLivery/paginas/OrderStatus';
import LoginAdmin from './DoceLivery/paginas/LoginAdmin';
import AdminDashboard from './DoceLivery/paginas/AdminDashboard';
import AdminChat from './DoceLivery/Components/AdminChat';
import Agenda from './DoceLivery/Components/Agenda';
import CalendarioEncomendas from './DoceLivery/Components/CalendarioEncomendas';

// NOVA IMPORTAÇÃO: Adicionando o componente da tela de Dashboard do Entregador
import EntregadorDashboard from './DoceLivery/paginas/EntregadorDashboard'; 

// Importação dos Contextos
import { CartProviderStore } from './DoceLivery/context/CartProviderStore';
import { FavoritesProvider } from './DoceLivery/context/FavoritesContext';
import { StoreProvider } from './DoceLivery/context/StoreContext';
import { DashboardProvider } from './DoceLivery/context/DashboardContext';
import { CardapioProvider } from './DoceLivery/context/CardapioContext';
import { LojaProvider } from './DoceLivery/context/LojaContext';

function App() {
  return (
    <DashboardProvider>
      <StoreProvider>
        <LojaProvider>
          <CardapioProvider>
            <FavoritesProvider>
              <CartProviderStore>
                <Routes>
                  {/* Rota Raiz - Conforme ORGANIZACAO_FINAL.md, o Header é o entry point principal */}
                  <Route path="/" element={<PaginaCompleta />} /> 

                  <Route path="/docelivery/cliente/Home-Page" element={<HomePage />} />
                  
                  {/* Outras rotas permanecem iguais */}
                  <Route path="/docelivery/confeiteiro/Confeiteiro-Dashboard" element={<ConfeiteiroDashboard />} />
                  
                  {/* INCLUSÃO DA ROTA DE CADASTRO DO CONFEITEIRO */}
                  <Route path="/docelivery/confeiteiro/cadastro" element={<CadastroConfeiteiro />} />

                  {/* Rotas do Entregador */}
                  <Route path="/docelivery/entregador/pagina-entregador" element={<PaginaEntregador />} />
                  <Route path="/docelivery/entregador/cadastro-entregador" element={<CadastroEntregador />} />
                  <Route path="/docelivery/entregador/login-entregador" element={<LoginEntregador />} />
                  
                  {/* NOVA ROTA CONFIGURADA: Link direto para o Dashboard do Entregador */}
                  {/* Altere de /dashboard para /home */}
                  <Route path="/docelivery/entregador/home" element={<EntregadorDashboard />} />

                  {/* Demais Rotas do Sistema */}
                  <Route path="/docelivery/home/apresentacao-projeto" element={<ApresentacaoProjeto />} />
                  <Route path="/docelivery/cliente/cadastro-cliente" element={<CadastroCliente />} />
                  <Route path="/docelivery/cliente/login-cliente" element={<LoginCliente />} />
                  <Route path="/docelivery/confeiteiro/login-confeiteiro" element={<LoginConfeiteiro />} />
                  <Route path="/docelivery/cliente/recuperar-senha" element={<RecuperarSenha />} />
                  <Route path="/docelivery/cliente/pagamento" element={<Pagamento />} />
                  <Route path="/docelivery/cliente/perfil" element={<PerfilCliente />} />
                  <Route path="/docelivery/cliente/pedido-status" element={<OrderStatus />} />
                  <Route path="/docelivery/loja/:lojaId" element={<LojaIndividual />} />
                  <Route path="/docelivery/admin/login" element={<LoginAdmin />} />
                  <Route path="/docelivery/admin/dashboard" element={<AdminDashboard />} />
                  
                  {/* Novas Rotas Localizadas */}
                  <Route path="/docelivery/admin/chat" element={<AdminChat />} />
                  <Route path="/docelivery/confeiteiro/agenda" element={<Agenda />} />
                  <Route path="/docelivery/confeiteiro/calendario" element={<CalendarioEncomendas />} />

                  {/* Rota de Erro 404 - Caso o usuário digite algo errado */}
                  <Route path="*" element={<div>Página não encontrada (404)</div>} />
                </Routes>
              </CartProviderStore>
            </FavoritesProvider>
          </CardapioProvider>
        </LojaProvider>
      </StoreProvider>
    </DashboardProvider>
  );
}

export default App;