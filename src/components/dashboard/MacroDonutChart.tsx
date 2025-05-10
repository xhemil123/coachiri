import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface MacroDonutChartProps {
  protein: number;
  carbs: number;
  fat: number;
}

const MacroDonutChart: React.FC<MacroDonutChartProps> = ({ protein, carbs, fat }) => {
  const data = {
    labels: ['Protein', 'Carbs', 'Fat'],
    datasets: [
      {
        data: [protein, carbs, fat],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',  // primary
          'rgba(20, 184, 166, 0.8)',  // secondary
          'rgba(249, 115, 22, 0.8)',  // accent
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(20, 184, 166, 1)',
          'rgba(249, 115, 22, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.formattedValue || '';
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${label}: ${value}g (${percentage}%)`;
          }
        }
      }
    },
  };

  return (
    <div className="h-64">
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default MacroDonutChart;