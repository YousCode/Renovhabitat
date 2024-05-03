import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import venteData from '../screens/dashboard/Renovhanbitat.vente.json';

const DateDetails = () => {
    const { date } = useParams();
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const MIN_ROWS = 15;

    useEffect(() => {
        // Convert the date parameter from YYYY-MM-DD to DD/MM/YYYY
        const [year, month, day] = date.split("-");
        const formattedDate = `${day}/${month}/${year}`;

        console.log("Formatted date:", formattedDate);

        // Extract only the sales matching the given date
        const filteredSales = venteData.filter(sale => {
            // Extract the date part only for comparison
            const saleDate = sale["DATE DE VENTE"].split(" ")[0];
            return saleDate === formattedDate;
        });

        console.log("Filtered sales:", filteredSales);
        setSales(filteredSales);
        setLoading(false);
    }, [date]);

    const emptyRowsCount = Math.max(0, MIN_ROWS - sales.length);
    const emptyRows = Array.from({ length: emptyRowsCount });

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Details for {date}</h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Heure
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nom
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tel
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ville
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    VTC
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Travaux
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Résultat
                                </th>
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
                                    <td class="px-6 py-4 whitespace-nowrap">{sale["DESIGNATION"]}</td>
                                    <td class="px-6 py-4 whitespace-nowrap">{sale["ETAT"]}</td>
                                </tr>
                            ))}
                            {emptyRows.map((_, index) => (
                                <tr key={`empty-${index}`}>
                                    <td className="px-6 py-4 whitespace-nowrap">-</td>
                                    <td className="px-6 py-4 whitespace-nowrap">-</td>
                                    <td className="px-6 py-4 whitespace-nowrap">-</td>
                                    <td className="px-6 py-4 whitespace-nowrap">-</td>
                                    <td className="px-6 py-4 whitespace-nowrap">-</td>
                                    <td class="px-6 py-4 whitespace-nowrap">-</td>
                                    <td class="px-6 py-4 whitespace-nowrap">-</td>
                                    {/* <td className="px-6 py-4 whitespace-nowrap">&nbsp;</td> */}
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
