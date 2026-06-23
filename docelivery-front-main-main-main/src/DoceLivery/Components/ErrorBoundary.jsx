/* eslint-disable no-unused-vars */
// 1. Crie este componente (ErrorBoundary.jsx)
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Atualiza o estado para que a próxima renderização mostre a UI de fallback
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Aqui você pode logar o erro em um serviço externo (Sentry, LogRocket, etc.)
    console.error("Erro capturado:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // IU que será mostrada em caso de erro
      return <h1>Ocorreu um erro ao carregar esta seção do painel.</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;