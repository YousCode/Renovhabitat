import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
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
import { ClipLoader } from "react-spinners";  // Import the spinner

// Enregistrer les composants nécessaires
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Colors
);

const StatisticsDashboard = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('clients');

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await fetch("http://localhost:8080/ventes/all");
        if (!response.ok) {
          throw new Error(`Failed to fetch sales: ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Fetched sales data:", data.data);
        setSales(data.data);
      } catch (error) {
        console.error("Error fetching sales:", error);
        setError(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  const topClients = sales.reduce((acc, sale) => {
    const client = sale["NOM DU CLIENT"];
    const montantTTC = parseFloat(sale["MONTANT TTC"]);
    if (client && !isNaN(montantTTC)) {
      acc[client] = acc[client] ? acc[client] + montantTTC : montantTTC;
    }
    return acc;
  }, {});

  const bestSellers = sales.reduce((acc, sale) => {
    const seller = sale["VENDEUR"];
    const montantTTC = parseFloat(sale["MONTANT TTC"]);
    if (seller && !isNaN(montantTTC)) {
      acc[seller] = acc[seller] ? acc[seller] + montantTTC : montantTTC;
    }
    return acc;
  }, {});

  console.log("Top Clients:", topClients);
  console.log("Best Sellers:", bestSellers);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ClipLoader color={"#36D7B7"} loading={loading} size={150} />
      </div>
    );
  }

  if (error) return <p className="text-center text-red-500">{error}</p>;

  const topClientsData = {
    labels: Object.keys(topClients),
    datasets: [
      {
        label: 'Top Clients',
        data: Object.values(topClients),
        backgroundColor: Object.keys(topClients).map(
          (_, index) => `rgba(${index * 30 % 255}, ${index * 60 % 255}, ${index * 90 % 255}, 0.6)`
        ),
        borderColor: Object.keys(topClients).map(
          (_, index) => `rgba(${index * 30 % 255}, ${index * 60 % 255}, ${index * 90 % 255}, 1)`
        ),
        borderWidth: 1
      }
    ]
  };

  const bestSellersData = {
    labels: Object.keys(bestSellers),
    datasets: [
      {
        label: 'Meilleurs Vendeurs',
        data: Object.values(bestSellers),
        backgroundColor: Object.keys(bestSellers).map(
          (_, index) => `rgba(${index * 30 % 255}, ${index * 60 % 255}, ${index * 90 % 255}, 0.6)`
        ),
        borderColor: Object.keys(bestSellers).map(
          (_, index) => `rgba(${index * 30 % 255}, ${index * 60 % 255}, ${index * 90 % 255}, 1)`
        ),
        borderWidth: 1,
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Statistiques des ventes',
      },
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutBounce',
    },
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-800 p-4">
      <div className="flex mb-4">
        <button onClick={() => setView('clients')} className={`px-4 py-2 mr-2 ${view === 'clients' ? 'bg-blue-600' : 'bg-gray-700'} text-white rounded-lg`}>Clients</button>
        <button onClick={() => setView('vendeurs')} className={`px-4 py-2 ${view === 'vendeurs' ? 'bg-blue-600' : 'bg-gray-700'} text-white rounded-lg`}>Vendeurs</button>
      </div>
      {view === 'clients' && (
        <div className="w-full mb-8">
          <h2 className="text-white text-2xl mb-4">Top Clients</h2>
          <Doughnut data={topClientsData} options={options} />
        </div>
      )}
      {view === 'vendeurs' && (
        <div className="w-full mb-8">
          <h2 className="text-white text-2xl mb-4">Meilleurs Vendeurs</h2>
          <Doughnut data={bestSellersData} options={options} />
        </div>
      )}
    </div>
  );
};

export default StatisticsDashboard;