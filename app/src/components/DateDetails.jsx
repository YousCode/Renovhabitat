import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const DateDetails = () => {
    const { date } = useParams(); // Extract the date parameter from the URL
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [allSales, setAllSales] = useState([]);
    const MIN_ROWS = 15;

    // Function to format the date for display
    const formatDate = (dateStr) => {
        const days = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
        const dateObj = new Date(dateStr);
        const dayName = days[dateObj.getDay()];
        const day = dateObj.getDate().toString().padStart(2, '0');
        const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
        const year = dateObj.getFullYear();
        return `Planning du ${dayName} ${day}/${month}/${year}`;
    };

    // Function to fetch all sales data once
    useEffect(() => {
        const fetchAllSalesData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`http://localhost:8080/ventes/all`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch data with status ${response.status}`);
                }
                const data = await response.json();
                setAllSales(data.data || []);
            } catch (error) {
                console.error("Error fetching all sales data:", error);
                setError(`Error: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };
        fetchAllSalesData();
    }, []);

    // Function to filter sales data by the selected date
    useEffect(() => {
        if (!date || !allSales.length) return;

        const inputDate = new Date(date);
        inputDate.setUTCHours(0, 0, 0, 0);
        const nextDay = new Date(inputDate);
        nextDay.setUTCDate(inputDate.getUTCDate() + 1);

        const filteredSales = allSales.filter(sale => {
            const saleDate = new Date(sale["DATE DE VENTE"]);
            return saleDate >= inputDate && saleDate < nextDay;
        });

        setSales(filteredSales);
    }, [date, allSales]);

    // Function to handle adding new sales through the modal
    const handleAddSale = (newSale) => {
        setSales(prev => [...prev, newSale]);
    };

    // Create empty rows to keep the table structure consistent
    const emptyRowsCount = Math.max(0, MIN_ROWS - sales.length);
    const emptyRows = Array.from({ length: emptyRowsCount });
    const formattedDate = formatDate(date);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">{formattedDate}</h2>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Heure</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tel</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ville</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">VTC</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Travaux</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Résultat</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {sales.map((sale, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap">{new Date(sale["DATE DE VENTE"]).toLocaleTimeString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{`${sale["CIVILITE"]} ${sale["NOM DU CLIENT"]}`}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{sale["TELEPHONE"]}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{sale["VILLE"]}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{sale["NUMERO BC"]}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{sale["DESIGNATION"]}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{sale["ETAT"]}</td>
                                </tr>
                            ))}
                            {emptyRows.map((_, index) => (
                                <tr key={`empty-${index}`}>
                                    <td className="px-6 py-4 whitespace-nowrap">-</td>
                                    <td className="px-6 py-4 whitespace-nowrap">-</td>
                                    <td className="px-6 py-4 whitespace-nowrap">-</td>
                                    <td className="px-6 py-4 whitespace-nowrap">-</td>
                                    <td className="px-6 py-4 whitespace-nowrap">-</td>
                                    <td className="px-6 py-4 whitespace-nowrap">-</td>
                                    <td className="px-6 py-4 whitespace-nowrap">-</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default DateDetails;
