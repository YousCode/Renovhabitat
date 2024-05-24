import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { FaCalendarAlt } from 'react-icons/fa'; // Importing FontAwesome icons

export const Equipe = () => {
    const [salesData, setSalesData] = useState([]);
    const [filteredSalesData, setFilteredSalesData] = useState([]);
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [{
            label: 'Total des ventes',
            data: [],
            backgroundColor: [],
            borderColor: [],
            borderWidth: 1
        }]
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMetric, setSelectedMetric] = useState('MONTANT TTC '); // State to toggle between MONTANT TTC and MONTANT HT
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        fetchSalesData();
    }, [selectedMetric, startDate, endDate]);

    useEffect(() => {
        filterSalesData();
    }, [salesData, searchQuery, selectedMetric, startDate, endDate]);

    const fetchSalesData = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8080/ventes/all');
            if (!response.ok) throw new Error('Impossible de récupérer les données des ventes');
            const data = await response.json();
            const sales = data.data || [];
            setSalesData(sales);
            setLoading(false);
        } catch (error) {
            console.error('Erreur:', error);
            setError(error.message);
            setLoading(false);
        }
    };

    const filterSalesData = () => {
        let filtered = salesData;

        if (searchQuery.trim() !== '') {
            filtered = filtered.filter(sale =>
                sale.VENDEUR && sale.VENDEUR.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            filtered = filtered.filter(sale => {
                const saleDate = new Date(sale["DATE DE VENTE"]);
                return saleDate >= start && saleDate <= end;
            });
        }

        setFilteredSalesData(filtered);
        updateChartData(filtered);
    };

    const updateChartData = (filteredData) => {
        const vendorTotals = filteredData.reduce((acc, sale) => {
            const vendor = sale["VENDEUR"];
            const amount = sale[selectedMetric];
            if (!acc[vendor]) {
                acc[vendor] = 0;
            }
            if (!isNaN(amount)) {
                acc[vendor] += amount;
            }
            return acc;
        }, {});

        const sortedVendors = Object.entries(vendorTotals).sort((a, b) => b[1] - a[1]).slice(0, 10);

        const newData = {
            labels: sortedVendors.map(([vendor]) => vendor),
            datasets: [{
                label: selectedMetric,
                data: sortedVendors.map(([, total]) => total),
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#F77825',
                    '#9966FF',
                    '#FF9F40',
                    '#B21FDE',
                    '#2FDE00',
                    '#00A6B4',
                    '#6800B4'
                ],
                borderColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#F77825',
                    '#9966FF',
                    '#FF9F40',
                    '#B21FDE',
                    '#2FDE00',
                    '#00A6B4',
                    '#6800B4'
                ],
                borderWidth: 1,
                hoverOffset: 10 // Adding 3D effect
            }]
        };
        setChartData(newData);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleShowAll = () => {
        setSearchQuery('');
        setStartDate('');
        setEndDate('');
        setFilteredSalesData(salesData);
        updateChartData(salesData);
    };

    const handleMetricChange = (event) => {
        setSelectedMetric(event.target.value);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
    };

    const handleStartDateChange = (event) => {
        setStartDate(event.target.value);
    };

    const handleEndDateChange = (event) => {
        setEndDate(event.target.value);
    };

    const getTopVendors = (sales) => {
        const vendorTotals = sales.reduce((acc, sale) => {
            const vendor = sale["VENDEUR"];
            const montantTTC = sale["MONTANT TTC "];
            const montantHT = sale["MONTANT HT"];
            if (!acc[vendor]) {
                acc[vendor] = {
                    MONTANT_TTC: 0,
                    MONTANT_HT: 0
                };
            }
            if (!isNaN(montantTTC)) {
                acc[vendor].MONTANT_TTC += montantTTC;
            }
            if (!isNaN(montantHT)) {
                acc[vendor].MONTANT_HT += montantHT;
            }
            return acc;
        }, {});

        const sortedVendors = Object.entries(vendorTotals).sort((a, b) => b[1].MONTANT_TTC - a[1].MONTANT_TTC);
        return sortedVendors.slice(0, 5); // Top 5 vendors
    };

    const topVendors = getTopVendors(filteredSalesData);

    const totalSales = filteredSalesData.reduce((acc, sale) => acc + (isNaN(sale[selectedMetric]) ? 0 : sale[selectedMetric]), 0);

    return (
        <div className="p-6 min-h-screen bg-gray-900 text-white">
            <h1 className="text-3xl font-bold text-center mb-6">Statistiques des ventes de l'équipe</h1>
            <div className="flex justify-center mb-6">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Rechercher par nom de vendeur"
                    className="border border-gray-300 p-2 rounded-md mr-4 text-black"
                />
                <button 
                    onClick={handleShowAll} 
                    className="bg-blue-500 text-white p-2 rounded-md"
                >
                    Afficher tout
                </button>
            </div>
            <div className="flex justify-center mb-6 gap-4">
                <select 
                    onChange={handleMetricChange} 
                    value={selectedMetric}
                    className="border border-gray-300 p-2 rounded-md text-black"
                >
                    <option value="MONTANT TTC ">MONTANT TTC</option>
                    <option value="MONTANT HT">MONTANT HT</option>
                </select>
                <div className="flex items-center gap-2">
                    <FaCalendarAlt />
                    <input
                        type="date"
                        value={startDate}
                        onChange={handleStartDateChange}
                        className="border border-gray-300 p-2 rounded-md text-black"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <FaCalendarAlt />
                    <input
                        type="date"
                        value={endDate}
                        onChange={handleEndDateChange}
                        className="border border-gray-300 p-2 rounded-md text-black"
                    />
                </div>
            </div>
            {loading && <p className="text-center">Chargement...</p>}
            {error && <p className="text-center text-red-500">Erreur : {error}</p>}
            {!loading && !error && filteredSalesData.length > 0 && (
                <>
                    <div className="relative bg-white p-4 rounded-lg shadow mb-6 max-w-xl mx-auto">
                        <Doughnut 
                            data={chartData} 
                            options={{ 
                                responsive: true, 
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        labels: {
                                            font: {
                                                size: 14
                                            },
                                            color: '#000000'
                                        }
                                    },
                                    datalabels: {
                                        display: true,
                                        color: '#000000',
                                        formatter: (value) => {
                                            return formatCurrency(value) + ' €';
                                        },
                                        font: {
                                            size: 14,
                                            weight: 'bold'
                                        },
                                        anchor: 'end',
                                        align: 'end'
                                    }
                                },
                                cutout: '70%'
                            }} 
                            className="h-96"
                        />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="bg-green text-black rounded-full p-6 shadow">
                                <span className="text-2xl font-bold">{formatCurrency(totalSales)}</span>
                            </div>
                        </div>
                    </div>
                   
                </>
            )}
            {!loading && !error && filteredSalesData.length === 0 && (
                <p className="text-center">Aucune donnée de vente disponible pour le vendeur sélectionné.</p>
            )}
        </div>
    );
};
