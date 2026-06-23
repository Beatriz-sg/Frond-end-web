export const API_ENDPOINTS = {
  AUTH: {
    LOGIN_CLIENTE: '/auth/login',
    LOGIN_CONFEITEIRO: '/auth/confeiteiro/login',
    LOGIN_ADMIN: '/auth/admin/login',
    LOGIN_ENTREGADOR: '/auth/entregador/login',
    CADASTRO_CLIENTE: '/auth/cliente/cadastro',
    CADASTRO_CONFEITEIRO: '/auth/confeiteiro/cadastro',
    CADASTRO_ENTREGADOR: '/auth/entregador/cadastro',
    RECUPERAR_SENHA: '/auth/recuperar-senha',
  },
  STORES: {
    LIST: '/stores',
    FEATURED: '/stores/featured',
    NEARBY: '/stores/nearby',
    SEARCH: '/stores/search',
    BY_ID: (id) => `/stores/${id}`,
    MENU: (id) => `/stores/${id}/menu`,
    REVIEWS: (id) => `/stores/${id}/reviews`,
    HOURS: (id) => `/stores/${id}/hours`,
  },
  ORDERS: {
    CREATE: '/pedidos',
    CLIENT: (id) => `/pedidos/cliente/${id}`,
    STORE: (id) => `/pedidos/loja/${id}`,
    BY_ID: (id) => `/pedidos/${id}`,
    STATUS: (id) => `/pedidos/${id}/status`,
    FILA: (id) => `/pedidos/confeiteiro/${id}/fila`,
    HISTORICO: (id) => `/pedidos/confeiteiro/${id}/historico`,
  },
  PRODUTO: {
    BASE: '/produtos',
    LIST: '/produtos',
    BY_STORE: (id) => `/produtos/store/${id}`,
    BY_ID: (id) => `/produtos/${id}`,
    OFFERS: '/produtos/offers',
    CATEGORIES: '/produtos/categories',
    SEARCH: '/produtos/search',
  },
  USER: {
    PROFILE: '/user/profile',
    ADDRESSES: '/user/addresses',
    FAVORITES: '/user/favorites',
  }
};

export const ORDER_STATUS = {
  PENDING: 'PENDENTE',
  SCHEDULED: 'AGENDADO',
  PREPARING: 'PREPARANDO',
  READY: 'PRONTO',
  DELIVERING: 'SAIU_PARA_ENTREGA',
  DELIVERED: 'ENTREGUE',
  CANCELLED: 'CANCELADO'
};

export const USER_TYPES = {
  CLIENTE: 'cliente',
  CONFEITEIRO: 'confeiteiro',
  ADMIN: 'admin'
};

export const PAYMENT_METHODS = {
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  PIX: 'pix',
  CASH: 'cash'
};