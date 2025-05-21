import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { getBills } from '../services/billsService';
import { formatCurrency } from '../utils/formatters';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const ChartComponent = ({ type, className = '' }) => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const data = await getBills();
        setBills(data);
      } catch (error) {
        console.error('Error fetching bills:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, []);

  if (loading) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse ${className}`}>
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="h-64 bg-gray-200 rounded w-full"></div>
      </div>
    );
  }

  const renderCategoryChart = () => {
    const categoryData = bills.reduce((acc, bill) => {
      if (!acc[bill.category]) {
        acc[bill.category] = 0;
      }
      acc[bill.category] += bill.value;
      return acc;
    }, {});
    
    const categories = Object.keys(categoryData);
    const values = Object.values(categoryData);
    
    const data = {
      labels: categories,
      datasets: [
        {
          data: values,
          backgroundColor: [
            '#A78BFA', // purple
            '#60A5FA', // blue
            '#34D399', // green
            '#FBBF24', // amber
            '#F87171', // red
            '#FB923C', // orange
            '#22D3EE', // cyan
          ],
          borderWidth: 1,
        },
      ],
    };
    
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Gastos por Categoria</h3>
        <div className="h-64">
          <Doughnut 
            data={data} 
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      const value = context.raw;
                      return `${formatCurrency(value)}`;
                    }
                  }
                }
              }
            }}
          />
        </div>
      </div>
    );
  };

  const renderMonthlyChart = () => {
    // Create monthly data for recurring bills
    const recurringBills = bills.filter(bill => bill.isRecurring);
    
    const data = {
      labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
      datasets: [
        {
          label: 'Gastos Mensais',
          data: Array(6).fill(recurringBills.reduce((sum, bill) => sum + bill.value, 0)),
          backgroundColor: 'rgba(37, 99, 235, 0.2)',
          borderColor: 'rgb(37, 99, 235)',
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    };
    
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Previsão de Gastos</h3>
        <div className="h-64">
          <Bar 
            data={data} 
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      const value = context.raw;
                      return `${formatCurrency(value)}`;
                    }
                  }
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: function(value) {
                      return `R$ ${value}`;
                    }
                  }
                }
              }
            }}
          />
        </div>
      </div>
    );
  };

  const renderTimelineChart = () => {
    // Sort bills by next payment date
    const sortedBills = [...bills].sort((a, b) => 
      new Date(a.nextPayment).getTime() - new Date(b.nextPayment).getTime()
    );
    
    // Get the next 6 bills or all if fewer
    const upcomingBills = sortedBills.slice(0, 6);
    
    const data = {
      labels: upcomingBills.map(bill => {
        const date = new Date(bill.nextPayment);
        return `${date.getDate()}/${date.getMonth() + 1}`;
      }),
      datasets: [
        {
          label: 'Próximos Pagamentos',
          data: upcomingBills.map(bill => bill.value),
          borderColor: 'rgb(37, 99, 235)',
          backgroundColor: 'rgba(37, 99, 235, 0.5)',
          tension: 0.3,
          pointBackgroundColor: 'rgb(37, 99, 235)',
          pointRadius: 5,
          pointHoverRadius: 7,
        },
      ],
    };
    
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Proximos Pagamentos</h3>
        <div className="h-64">
          <Line 
            data={data} 
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                tooltip: {
                  callbacks: {
                    title: function(tooltipItems) {
                      const index = tooltipItems[0].dataIndex;
                      return upcomingBills[index].name;
                    },
                    label: function(context) {
                      const value = context.raw;
                      return `${formatCurrency(value)}`;
                    }
                  }
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: function(value) {
                      return `R$ ${value}`;
                    }
                  }
                }
              }
            }}
          />
        </div>
      </div>
    );
  };

  switch (type) {
    case 'category':
      return renderCategoryChart();
    case 'monthly':
      return renderMonthlyChart();
    case 'timeline':
      return renderTimelineChart();
    default:
      return null;
  }
};

export default ChartComponent;