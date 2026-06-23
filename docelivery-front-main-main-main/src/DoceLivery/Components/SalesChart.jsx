import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS, 
    CategoryScale, 
    LinearScale,
    PointElement,
    LineElement,
    Title, 
    Tooltip, 
    Legend 
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// 🟢 Agora aceitamos "title" e "labelDataset" dinâmicos vindos de quem chama o gráfico
const SalesChart = ({ salesData, title = "Gráfico de Vendas", labelDataset = "Vendas (R$)" }) => {
    if (!salesData || salesData.length === 0) {
        return <p>Dados de vendas não disponíveis para o gráfico.</p>;
    }
    
    // Suporta 'day' (semana), 'month' (meses) ou 'name'
    const labels = salesData.map(data => data.day || data.month || data.name);

    const data = {
        labels: labels,
        datasets: [
            {
                label: labelDataset, // 🟢 Dinâmico
                data: salesData.map(data => data.total),
                fill: false,
                backgroundColor: 'rgba(139, 92, 246, 0.4)',
                borderColor: 'rgba(139, 92, 246, 1)',
                tension: 0.4,
                pointBackgroundColor: 'rgba(139, 92, 246, 1)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: {
                display: true,
                text: title, // 🟢 Agora usa o título passado pela página pai
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `Vendas: R$ ${context.parsed.y.toFixed(2)}`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                suggestedMax: 100, // 🟢 Força o topo a ser pelo menos 100 se tudo for zero, sumindo com o erro do R$ 1
                ticks: {
                    callback: function(value) {
                        return 'R$ ' + value.toFixed(0);
                    }
                }
            }
        }
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <Line data={data} options={options} />
        </div>
    );
};

export default SalesChart;