import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NewSaleModal from '../components/modal/NewSaleModal';  // Adjust the import path as necessary

const DateDetails = () => {
    const { date } = useParams();
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const MIN_ROWS = 15;

    const formatDate = (dateStr) => {
        const days = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
        const date = new Date(dateStr);
        const dayName = days[date.getDay()];
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `Planning du ${dayName} ${day}/${month}/${year}`;
      };
      

    useEffect(() => {
      const fetchSalesData = async () => {
          try {
              const response = await fetch(`/ventes/date?date=${date}`);
              const data = await response.json();
              setSales(data.data);  // Assuming the response structure has a 'data' field
          } catch (error) {
              console.error("Error fetching sales data:", error);
          } finally {
              setLoading(false);
          }
      };
  
      fetchSalesData();
    }, [date]);

    const handleAddSale = (newSale) => {
        // Implementation to add a new sale to the server/database
        setSales(prev => [...prev, newSale]); // Update local state
        setIsModalOpen(false); // Close the modal
    };

    const emptyRowsCount = Math.max(0, MIN_ROWS - sales.length);
    const emptyRows = Array.from({ length: emptyRowsCount });
    const formattedDate = formatDate(date);
    
    return (
        <div className="p-6">
            {/* <h2 className="text-2xl font-bold mb-4">Details for {date}</h2> */}
            <h2 className="text-2xl font-bold mb-4">{formattedDate}</h2>
            <button 
                className="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => setIsModalOpen(true)}
            >
                Add New Sale
            </button>
            {loading ? (
                <p>Loading...</p>
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
            {isModalOpen && (
                <NewSaleModal 
                    onClose={() => setIsModalOpen(false)} 
                    onAdd={handleAddSale} 
                />
            )}
        </div>
    );
};

export default DateDetails;
