import React from 'react';

const FinancialSummary = ({ salesData, expensesData }) => {
const totalSales = salesData.reduce((acc, item) => acc + item.total, 0);
const totalExpenses = expensesData.reduce((acc, item) => acc + item.total, 0);
const profit = totalSales - totalExpenses;

return (
    <div style={{ marginBottom: '20px' }}>
    <h2>Resumo Financeiro</h2>
    <p><strong>Vendas Totais:</strong> R$ {totalSales.toFixed(2)}</p>
    <p><strong>Despesas Totais:</strong> R$ {totalExpenses.toFixed(2)}</p>
    <p><strong>Lucro:</strong> R$ {profit.toFixed(2)}</p>
    </div>
);
};

export default FinancialSummary;
