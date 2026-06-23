// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from 'react-router-dom';
import App from "./App.jsx";
import './index.css';

// 1. Única importação do Provedor do Carrinho
import { CartProviderStore } from "./DoceLivery/context/CartProviderStore.jsx";

// 2. ÚNICA importação do Provedor do Dashboard
import { DashboardProvider } from "./DoceLivery/context/DashboardContext.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <CartProviderStore>
                <DashboardProvider>
                    <App />
                </DashboardProvider>
            </CartProviderStore>
        </BrowserRouter>
    </React.StrictMode>,
);