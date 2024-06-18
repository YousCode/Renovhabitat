import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { ClipLoader } from "react-spinners";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
import ChartDataLabels from "chartjs-plugin-datalabels";

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
  const [filter, setFilter] = useState("mois"); // Définir le filtre par défaut sur 'mois'
  const [selectedDate, setSelectedDate] = useState(new Date()); // Date sélectionnée

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await fetch("http://localhost:8080/ventes/all");
        if (!response.ok) {
          throw new Error(
            `Échec de la récupération des ventes: ${response.statusText}`
          );
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
    return str
      ? str
          .trim()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
      : "";
  };

  const groupByKey = (acc, key, montantTTC, montantHT, count) => {
    if (!acc[key]) {
      acc[key] = { montantTTC: 0, montantHT: 0, count: 0 };
    }
    acc[key].montantTTC += isNaN(montantTTC) ? 0 : montantTTC;
    acc[key].montantHT += isNaN(montantHT) ? 0 : montantHT;
    acc[key].count += isNaN(count) ? 0 : count;
  };

  const filterSalesByDate = (sales, filter, selectedDate) => {
    const now = new Date(selectedDate);
    return sales.filter((sale) => {
      const saleDate = new Date(sale["DATE DE VENTE"]);
      switch (filter) {
        case "jour":
          return (
            saleDate >=
            new Date(now.getFullYear(), now.getMonth(), now.getDate())
          );
        case "semaine":
          const weekAgo = new Date(now);
          weekAgo.setDate(now.getDate() - 7);
          return saleDate >= weekAgo;
        case "mois":
          const monthAgo = new Date(now);
          monthAgo.setMonth(now.getMonth() - 1);
          return saleDate >= monthAgo;
        case "3mois":
          const threeMonthsAgo = new Date(now);
          threeMonthsAgo.setMonth(now.getMonth() - 3);
          return saleDate >= threeMonthsAgo;
        case "annee":
          const yearAgo = new Date(now);
          yearAgo.setFullYear(now.getFullYear() - 1);
          return saleDate >= yearAgo;
        default:
          return true;
      }
    });
  };

  const filteredSales = filterSalesByDate(sales, filter, selectedDate);

  const bestSellers = filteredSales.reduce((acc, sale) => {
    if (normalizeString(sale["ETAT"]) === "annule") {
      return acc; // Exclure les ventes annulées
    }
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

  const totalSales = Object.values(bestSellers).reduce(
    (acc, { montantTTC }) => acc + montantTTC,
    0
  );

  const sortedSellers = Object.entries(bestSellers).sort(
    (a, b) => b[1].montantTTC - a[1].montantTTC
  );

  const bestSellersData = {
    labels: sortedSellers.map(([seller]) => seller),
    datasets: [
      {
        label: "Meilleurs Vendeurs",
        data: sortedSellers.map(([, { montantTTC }]) => montantTTC),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#F77825",
          "#9966FF",
          "#FF9F40",
          "#B21FDE",
          "#2FDE00",
          "#00A6B4",
          "#6800B4",
          "#4BC0C0",
          "#F77825",
          "#9966FF",
          "#FF9F40",
          "#B21FDE",
        ],
        borderColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#F77825",
          "#9966FF",
          "#FF9F40",
          "#B21FDE",
          "#2FDE00",
          "#00A6B4",
          "#6800B4",
          "#4BC0C0",
          "#F77825",
          "#9966FF",
          "#FF9F40",
          "#B21FDE",
        ],
        borderWidth: 1,
        hoverOffset: 10,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Masquer la légende du graphique
      },
      title: {
        display: false, // Masquer le titre intégré dans le graphique
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const seller = tooltipItem.label;
            const montantHT = bestSellers[seller].montantHT;
            return `Montant HT: ${new Intl.NumberFormat("fr-FR", {
              style: "currency",
              currency: "EUR",
            }).format(montantHT)}`;
          },
        },
      },
      datalabels: {
        display: false,
      },
    },
    cutout: "70%",
    animation: {
      animateScale: true,
      animateRotate: true,
      duration: 2000,
      easing: "easeInOutBounce",
    },
  };

  return (
    <div className="min-h-screen flex bg-gray-900 p-4">
      <div className="w-1/4 flex flex-col items-center space-y-4">
        <h2 className="text-white text-3xl mb-4">Filtres</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 rounded-lg bg-gray-700 text-white mb-4"
        >
          {["jour", "semaine", "mois", "3mois", "annee"].map((period) => (
            <option key={period} value={period}>
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </option>
          ))}
        </select>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="dd/MM/yyyy"
          className="px-4 py-2 rounded-lg bg-gray-700 text-white"
        />
      </div>
      <div className="w-3/4 flex space-x-4  bg-gray-800 shadow-lg rounded-lg">
        <div className="w-1/3 flex flex-col  p-4">
          <h2 className="text-white text-3xl mb-4">Meilleurs Vendeurs</h2>
          <ul className="space-y-2">
            {sortedSellers.map(([seller, { montantTTC }], index) => (
              <li key={seller} className="flex items-center space-x-2">
                <span
                  className="inline-block w-4 h-4 rounded-full"
                  style={{
                    backgroundColor: bestSellersData.datasets[0].backgroundColor[index],
                  }}
                ></span>
                <span className="text-white">{seller}</span>
                <span className="text-gray-400">
                  {new Intl.NumberFormat("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                  }).format(montantTTC)}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="w-1/3 flex flex-col  p-4 items-center justify-center">
          <h2 className="text-white text-3xl mb-4">Statistiques des ventes</h2>
          <div className="relative w-full h-full flex items-center justify-center">
            <Doughnut
              data={bestSellersData}
              options={options}
              className="h-full w-full"
            />
          </div>
        </div>
        <div className="w-1/3 flex flex-col  p-4 justify-between items-center ">
          <h2 className="text-white text-3xl mb-4">Total</h2>
          <div className="bg-green-500 text-white rounded-full p-4 shadow-lg flex items-center justify-center">
            <span className="text-xl font-bold">
              Total&nbsp;
              {new Intl.NumberFormat("fr-FR", {
                style: "currency",
                currency: "EUR",
              }).format(totalSales)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsDashboard;
