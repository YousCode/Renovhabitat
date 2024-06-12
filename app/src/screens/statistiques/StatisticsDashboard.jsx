import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { ClipLoader } from "react-spinners";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Colors,
} from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Enregistrer les composants nécessaires
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Colors,
  ChartDataLabels
);

const StatisticsDashboard = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await fetch("http://localhost:8080/ventes/all");
        if (!response.ok) {
          throw new Error(`Échec de la récupération des ventes: ${response.statusText}`);
        }
        const data = await response.json();
        setSales(data.data);
      } catch (error) {
        setError(`Erreur: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  const normalizeString = (str) => {
    return str ? str.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : "";
  };

  const groupByKey = (acc, key, montantTTC, montantHT, count) => {
    if (!acc[key]) {
      acc[key] = { montantTTC: 0, montantHT: 0, count: 0 };
    }
    acc[key].montantTTC += isNaN(montantTTC) ? 0 : montantTTC;
    acc[key].montantHT += isNaN(montantHT) ? 0 : montantHT;
    acc[key].count += isNaN(count) ? 0 : count;
  };

  const bestSellers = sales.reduce((acc, sale) => {
    const sellerField = sale["VENDEUR"];
    if (sellerField) {
      const sellers = sellerField.split("/").map(normalizeString);
      const montantTTC = parseFloat(sale["MONTANT TTC "]);
      const montantHT = parseFloat(sale["MONTANT HT"]);
      const shareTTC = montantTTC / sellers.length;
      const shareHT = montantHT / sellers.length;
      const shareCount = 1 / sellers.length;

      sellers.forEach((seller) => {
        if (seller) {
          groupByKey(acc, seller, shareTTC, shareHT, shareCount);
        }
      });
    }

    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ClipLoader color={"#36D7B7"} loading={loading} size={150} />
      </div>
    );
  }

  if (error) return <p className="text-center text-red-500">{error}</p>;

  const totalSales = Object.values(bestSellers).reduce((acc, { montantTTC }) => acc + montantTTC, 0);

  const sortedSellers = Object.entries(bestSellers).sort((a, b) => b[1].montantTTC - a[1].montantTTC);

  const bestSellersData = {
    labels: sortedSellers.map(([seller]) => seller),
    datasets: [
      {
        label: 'Meilleurs Vendeurs',
        data: sortedSellers.map(([, { montantTTC }]) => montantTTC),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
          '#F77825', '#9966FF', '#FF9F40', '#B21FDE',
          '#2FDE00', '#00A6B4', '#6800B4', '#4BC0C0',
          '#F77825', '#9966FF', '#FF9F40', '#B21FDE',
        ],
        borderColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
          '#F77825', '#9966FF', '#FF9F40', '#B21FDE',
          '#2FDE00', '#00A6B4', '#6800B4', '#4BC0C0',
          '#F77825', '#9966FF', '#FF9F40', '#B21FDE',
        ],
        borderWidth: 1,
        hoverOffset: 10
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14
          },
          color: '#ffffff',
          generateLabels: function (chart) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => {
                const dataset = data.datasets[0];
                const value = dataset.data[i];
                return {
                  text: `${label}: ${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value)}`,
                  fillStyle: dataset.backgroundColor[i],
                  strokeStyle: dataset.borderColor[i],
                  lineWidth: dataset.borderWidth,
                  hidden: isNaN(dataset.data[i]),
                  index: i
                };
              });
            }
            return [];
          }
        }
      },
      title: {
        display: true,
        text: 'Statistiques des ventes',
        color: '#ffffff'
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const seller = tooltipItem.label;
            const montantHT = bestSellers[seller].montantHT;
            return `Montant HT: ${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(montantHT)}`;
          }
        }
      },
      datalabels: {
        display: false
      }
    },
    cutout: '70%',
    animation: {
      animateScale: true,
      animateRotate: true,
      duration: 2000,
      easing: 'easeInOutBounce'
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-900 p-4">
      <div className="w-full mb-8 max-w-2xl">
        <h2 className="text-white text-3xl mb-4 text-center">Meilleurs Vendeurs</h2>
        <div className="relative bg-gray-800 p-4 rounded-lg shadow-lg">
          <Doughnut data={bestSellersData} options={options} className="h-96 w-96 mx-auto" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-green-500 text-white rounded-full p-4 shadow-lg flex items-center justify-center">
              <span className="text-xl font-bold">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(totalSales)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsDashboard;