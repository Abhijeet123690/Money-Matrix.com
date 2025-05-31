import { useEffect, useRef, useState } from 'react';
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
import { Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function ChartSection({ data }) {
  const [chartData, setChartData] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!data || !data['Time Series (Daily)']) {
      setChartData(null);
      return;
    }

    try {
      const series = data['Time Series (Daily)'];
      const dates = Object.keys(series).reverse().slice(0, 30); // Last 30 days
      const closingPrices = dates.map(date => parseFloat(series[date]['4. close']));

      setChartData({
        labels: dates,
        datasets: [
          {
            label: 'Closing Price',
            data: closingPrices,
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.3,
            pointRadius: 3,
            pointBackgroundColor: 'rgb(59, 130, 246)',
            fill: true
          }
        ]
      });
    } catch (error) {
      console.error('Error processing chart data:', error);
      setChartData(null);
    }
  }, [data]);

  if (!chartData) {
    return (
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
        <h3 className="text-xl font-semibold mb-4">Price Chart</h3>
        <div className="h-64 flex items-center justify-center text-gray-500">
          {data ? 'Error loading chart data' : 'Select a stock to view chart'}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
      <h3 className="text-xl font-semibold mb-4">Price Chart (30 Days)</h3>
      <div className="h-64">
        <Line
          ref={chartRef}
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(30, 41, 59, 0.9)',
                titleColor: '#93c5fd',
                bodyColor: '#f8fafc',
                borderColor: '#1e293b',
                borderWidth: 1,
                padding: 12,
                callbacks: {
                  label: (context) => `$${context.parsed.y.toFixed(2)}`
                }
              }
            },
            scales: {
              x: {
                grid: {
                  display: false
                },
                ticks: {
                  color: '#94a3b8',
                  maxRotation: 0,
                  autoSkip: true,
                  maxTicksLimit: 10
                }
              },
              y: {
                grid: {
                  color: 'rgba(148, 163, 184, 0.1)'
                },
                ticks: {
                  color: '#94a3b8',
                  callback: (value) => `$${value}`
                }
              }
            }
          }}
        />
      </div>
    </div>
  );
}
