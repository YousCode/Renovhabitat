import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useHistory } from "react-router-dom";

const DateDetails = () => {
    const { date } = useParams(); // Extract the date parameter from the URL
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [allSales, setAllSales] = useState([]);
    const MIN_ROWS = 15;
    const history = useHistory();

    const [selectedRowIndex, setSelectedRowIndex] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    // Form state variables for the new sale
    const [newSale, setNewSale] = useState({
        clientName: '',
        phoneNumber: '',
        city: '',
        orderNumber: '',
        workDescription: '',
        status: 'En attente',
        numeroBC: ''
    });

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

    // Fetch all sales data once
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

    // Filter sales data by the selected date
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

    const performSearch = async (searchTerm) => {
        setIsSearching(true);
        try {
            const response = await fetch(`http://localhost:8080/ventes/search?searchTerm=${encodeURIComponent(searchTerm)}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch: ${response.statusText}`);
            }
            const data = await response.json();
            if (data.success) {
                setSearchResults(data.data);
            } else {
                setSearchResults([]);
            }
        } catch (error) {
            console.error("Search error:", error);
        } finally {
            setIsSearching(false);
        }
    };

    // Handle new sale form input changes
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewSale(prev => ({ ...prev, [name]: value }));

        if (name === "clientName") {
            if (value.length > 2) { // Only search if the input length is greater than 2 characters to reduce unnecessary requests.
                performSearch(value);
            } else {
                setSearchResults([]); // Clear results if the input is cleared or too short.
            }
        }
    };

    const handleSelectSale = (sale) => {
        setNewSale(prev => ({
            ...prev,
            clientName: sale["NOM DU CLIENT"],
            phoneNumber: sale["TELEPHONE"],
            numeroBC: sale["NUMERO BC"],
            orderNumber: sale["VENDEUR"]
        }));
        setSearchResults([]); // Optionally clear the search results after selection
    };

    const handleAddSale = async (event) => {
        event.preventDefault();

        const newSaleEntry = {
            "DATE DE VENTE": new Date(date).toISOString(), // Ensure the date is correctly formatted as an ISO string
            "NOM DU CLIENT": newSale.clientName,
            "TELEPHONE": newSale.phoneNumber,
            "VILLE": newSale.city,
            "NUMERO BC": newSale.numeroBC,
            "VENDEUR": newSale.orderNumber,
            "DESIGNATION": newSale.workDescription,
            "ETAT": newSale.status,
        };

        console.log("Sending new sale entry:", newSaleEntry); // Log the new sale entry

        try {
            const response = await fetch('http://localhost:8080/ventes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newSaleEntry)
            });

            if (response.ok) {
                const savedSale = await response.json();
                setSales(prev => [...prev, savedSale.data]);
                setNewSale({ clientName: '', phoneNumber: '', city: '', orderNumber: '', workDescription: '', status: '', numeroBC: '' });
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || `Error: ${response.status}`);
            }
        } catch (error) {
            console.error("Error saving new sale:", error.message);
        }
    };

    const handleEditSale = (saleId) => {
        history.push(`/sales/edit/${saleId}`);
        console.log("edit sale with ID:", saleId);
    };

    const handleDeleteSale = (saleId) => {
        console.log("Deleting sale with ID:", saleId);
        // Add logic to delete sale
    };

    // Create empty rows to ensure there are at least 15 rows in the table
    const emptyRowsCount = Math.max(0, MIN_ROWS - sales.length);
    const formattedDate = formatDate(date);

    return (
        <div className="p-6">
            <h2 className="text-2xl text-white font-bold mb-4">{formattedDate}</h2>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
                <>
                    <div className="overflow-x-auto" style={{ backgroundColor: '#FFFACD' }}>
                        <table className="min-w-full divide-y divide-gray-200" style={{ backgroundColor: '#FFFACD' }}>
                            <thead style={{ backgroundColor: '#FFFACD' }}>
                                <tr >
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Heure</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tel</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ville</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N° BC</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendeur</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Travaux</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Résultat</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody  style={{ backgroundColor: '#00D7A8' }} className="bg-white divide-y divide-gray-200">
                                {/* Existing Sales Rows */}
                                {sales.map((sale, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap">{new Date(sale["DATE DE VENTE"]).toLocaleTimeString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{`${sale["NOM DU CLIENT"]}`}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{sale["TELEPHONE"]}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{sale["VILLE"]}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{sale["NUMERO BC"]}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{sale["VENDEUR"]}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{sale["DESIGNATION"]}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{sale["ETAT"]}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleEditSale(sale["_id"])}
                                                className="bg-indigo-500 text-white py-2 px-4 rounded-md mr-2">
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteSale(sale["_id"])}
                                                className="bg-red-500 text-white py-2 px-4 rounded-md">
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {/* First Empty Row with Input Fields */}
                                {emptyRowsCount > 0 && (
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap"><input className="border p-2 rounded-md w-full" type="time" name="saleTime" /></td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input className="border p-2 rounded-md w-full" type="text" name="clientName" value={newSale.clientName}
                                                onChange={handleInputChange}
                                                required
                                            />
                                            {isSearching && <div>Searching...</div>}
                                            {searchResults.length > 0 && (
                                                <ul className="absolute bg-white shadow-lg mt-1 max-h-60 overflow-auto z-10">
                                                    {searchResults.map((sale, index) => (
                                                        <li key={index}
                                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-200"
                                                            onClick={() => handleSelectSale(sale)}>
                                                            {sale["NOM DU CLIENT"]} - {sale["TELEPHONE"]}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap"><input className="border p-2 rounded-md w-full" type="text" name="phoneNumber" value={newSale.phoneNumber} onChange={handleInputChange} required /></td>
                                        <td className="px-6 py-4 whitespace-nowrap"><input className="border p-2 rounded-md w-full" type="text" name="city" value={newSale.city} onChange={handleInputChange} required /></td>
                                        <td className="px-6 py-4 whitespace-nowrap"><input className="border p-2 rounded-md w-full" type="text" name="numeroBC" value={newSale.numeroBC} onChange={handleInputChange} required /></td>
                                        <td className="px-6 py-4 whitespace-nowrap"><input className="border p-2 rounded-md w-full" type="text" name="orderNumber" value={newSale.orderNumber} onChange={handleInputChange} required /></td>
                                        <td className="px-6 py-4 whitespace-nowrap"><input className="border p-2 rounded-md w-full" type="text" name="workDescription" value={newSale.workDescription} onChange={handleInputChange} required /></td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <select className="border p-2 rounded-md w-full" type="text" name="status" value={newSale.status} onChange={handleInputChange} required >
                                                <option value="En attente">En attente</option>
                                                <option value="Confirmé">Confirmé</option>
                                                <option value="Annulé">Annulé</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">-</td>
                                    </tr>
                                )}
                                {/* Remaining Empty Rows with Placeholders */}
                                {Array.from({ length: emptyRowsCount - 1 }).map((_, index) => (
                                    <tr key={`empty-${index}`}>
                                        <td className="px-6 py-4 whitespace-nowrap">-</td>
                                        <td className="px-6 py-4 whitespace-nowrap">-</td>
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
                    <button onClick={handleAddSale} className="bg-blue-500 text-white py-2 px-4 rounded-md mt-4">Ajouter la vente</button>
                </>
            )}
        </div>
    );
};

export default DateDetails;
