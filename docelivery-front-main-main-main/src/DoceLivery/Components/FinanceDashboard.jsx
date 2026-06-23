import React from 'react';
import SalesChart from '../Components/SalesChart'; // Importando o gráfico de vendas
import FinancialSummary from '../Components/FinancialSummary'; // Importando o resumo financeiro
import Dashboard from '../Components/Dashboard';


const FinanceDashboard = () => {
  // Dados fictícios
const salesData = [
    { month: 'Janeiro', total: 1500 },
    { month: 'Fevereiro', total: 2000 },
    { month: 'Março', total: 2500 },
    { month: 'Abril', total: 3000 },
    { month: 'Maio', total: 3500 },
];

const expensesData = [
    { month: 'Janeiro', total: 500 },
    { month: 'Fevereiro', total: 700 },
    { month: 'Março', total: 800 },
    { month: 'Abril', total: 600 },
    { month: 'Maio', total: 900 },
];

return (
    <div style={{ padding: '20px', backgroundColor: '#FFF' }}>
    {/* <h1>Dashboard Financeiro</h1> */}
    <Dashboard />
    <FinancialSummary salesData={salesData} expensesData={expensesData} />
    <SalesChart salesData={salesData} />
    </div>
);
};

export default FinanceDashboard;
