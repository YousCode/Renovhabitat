import React, { useEffect, useState, useRef } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { EditIcon, CloseIcon } from './icons';
import useClickOutside from '../hooks/useClickOutside';

const DateDetails = () => {
    const { date } = useParams();
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [allSales, setAllSales] = useState([]);
    const MIN_ROWS = 15;
    const history = useHistory();

    const formRef = useRef(null);
    const [selectedRowIndex, setSelectedRowIndex] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const defaultNewSale = {
        clientName: '',
        phoneNumber: '',
        address: '',
        orderNumber: '',
        workDescription: '',
        status: 'En attente',
        numeroBC: '',
        saleTime: ''
    };

    const [newSale, setNewSale] = useState(defaultNewSale);

    const formatDate = (dateStr) => {
        const days = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
        const dateObj = new Date(dateStr);
        const dayName = days[dateObj.getDay()];
        const day = dateObj.getDate().toString().padStart(2, '0');
        const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
        const year = dateObj.getFullYear();
        return `Planning du ${dayName} ${day}/${month}/${year}`;
    };

    useClickOutside(formRef, () => {
        history.goBack();
    });

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

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewSale(prev => ({ ...prev, [name]: value }));

        if (name === "clientName") {
            if (value.length > 2) {
                performSearch(value);
            } else {
                setSearchResults([]);
            }
        }
    };

    const handleSelectSale = (sale, event) => {
        event.stopPropagation();
        setNewSale(prev => ({
            ...prev,
            clientName: sale["NOM DU CLIENT"],
            phoneNumber: sale["TELEPHONE"],
            numeroBC: sale["NUMERO BC"],
            orderNumber: sale["VENDEUR"]
        }));
        setSearchResults([]);
    };

    const handleAddSale = async (event) => {
        event.preventDefault();

        const saleDate = new Date(date);
        const [hours, minutes] = newSale.saleTime.split(':');
        saleDate.setHours(hours, minutes);

        const newSaleEntry = {
            "DATE DE VENTE": saleDate.toISOString(),
            "NOM DU CLIENT": newSale.clientName,
            "TELEPHONE": newSale.phoneNumber,
            "ADRESSE DU CLIENT": newSale.address,
            "NUMERO BC": newSale.numeroBC,
            "VENDEUR": newSale.orderNumber,
            "DESIGNATION": newSale.workDescription,
            "ETAT": newSale.status,
        };

        console.log("Sending new sale entry:", newSaleEntry);

        try {
            const response = await fetch('http://localhost:8080/ventes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newSaleEntry)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error response from server:", errorData);
                throw new Error(errorData.message || `Error: ${response.status}`);
            }

            const savedSale = await response.json();
            setSales(prev => [...prev, savedSale.data]);
            setNewSale(defaultNewSale);
        } catch (error) {
            console.error("Error saving new sale:", error.message);
        }
    };

    const handleEditSale = (saleId, saleDate) => {
        history.push(`/sales/edit/${saleId}`, { saleDate });
    };

    const handleDeleteSale = async (saleId) => {
        try {
            const response = await fetch(`http://localhost:8080/ventes/${saleId}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to delete sale');
            }
            setSales(prevSales => prevSales.filter(sale => sale._id !== saleId));
        } catch (error) {
            console.error("Error deleting sale:", error.message);
        }
    };

    const emptyRowsCount = Math.max(0, MIN_ROWS - sales.length);
    const formattedDate = formatDate(date);

    return (
        <div ref={formRef} className="p-6">
            <h2 className="text-2xl text-white font-bold mb-4">{formattedDate}</h2>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
                <>
                    <div className="overflow-x-auto" style={{ backgroundColor: '#00D7A8' }}>
                        <table className="min-w-full divide-y divide-gray-200" style={{ backgroundColor: '#00D7A8' }}>
                            <thead style={{ backgroundColor: '#00D7A8' }}>
                                <tr >
                                    <th className="px-2 py-1 md:px-4 md:py-2 lg:px-6 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Heure</th>
                                    <th className="px-2 py-1 md:px-4 md:py-2 lg:px-6 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                                    <th className="px-2 py-1 md:px-4 md:py-2 lg:px-6 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tel</th>
                                    <th className="px-2 py-1 md:px-4 md:py-2 lg:px-6 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ADRESSE DU CLIENT</th>
                                    <th className="px-2 py-1 md:px-4 md:py-2 lg:px-6 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N° BC</th>
                                    <th className="px-2 py-1 md:px-4 md:py-2 lg:px-6 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendeur</th>
                                    <th className="px-2 py-1 md:px-4 md:py-2 lg:px-6 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Travaux</th>
                                    <th className="px-2 py-1 md:px-4 md:py-2 lg:px-6 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Résultat</th>
                                    <th className="px-2 py-1 md:px-4 md:py-2 lg:px-6 lg:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody style={{ backgroundColor: '#FFFACD' }} className="bg-white divide-y divide-gray-200">
                                {sales.map((sale, index) => (
                                    <tr key={index}>
                                        <td className="px-2 py-1 md:px-4 md:py-2 lg:px-6 lg:py-3 whitespace-nowrap">{new Date(sale["DATE DE VENTE"]).toLocaleTimeString()}</td>
                                        <td className="px-2 py-1 md:px-4 md:py-2 lg:px-6 lg:py-3 whitespace-nowrap">{`${sale["NOM DU CLIENT"]}`}</td>
                                        <td className="px-2 py-1 md:px-4 md:py-2 lg:px-6 lg:py-3 whitespace-nowrap">{sale["TELEPHONE"]}</td>
                                        <td className="px-2 py-1 md:px-4 md:py-2 lg:px-6 lg:py-3 whitespace-nowrap">{sale["ADRESSE DU CLIENT"]}</td>
                                        <td className="px-2 py-1 md:px-4 md:py-2 lg:px-6 lg:py-3 whitespace-nowrap">{sale["NUMERO BC"]}</td>
                                        <td className="px-2 py-1 md:px-4 md:py-2 lg:px-6 lg:py-3 whitespace-nowrap">{sale["VENDEUR"]}</td>
                                        <td className="px-2 py-1 md:px-4 md:py-2 lg:px-6 lg:py-3 whitespace-nowrap">{sale["DESIGNATION"]}</td>
                                        <td className="px-2 py-1 md:px-4 md:py-2 lg:px-6 lg:py-3 whitespace-nowrap">{sale["ETAT"]}</td>
                                        <td className="px-2 py-1 md:px-4 md:py-2 lg:px-6 lg:py-3 whitespace-nowrap">
                                            <button
                                                onClick={() => handleEditSale(sale["_id"], date)}
                                                className="bg-blue-500 text-white p-2 rounded-md mr-2"
                                                title="Edit"
                                            >
                                                <EditIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteSale(sale["_id"])}
                                                className="bg-red-200 text-red p-2 rounded-md"
                                                title="Delete"
                                            >
                                                <CloseIcon className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {emptyRowsCount > 0 && (
                                    <tr>
                                        <td className="px-2 py-1 md:px-4 md:py-2 lg:px-6 lg:py-3 whitespace-nowrap"><input className="border p-2 rounded-md w-full" type="time" name="saleTime" value={newSale.saleTime} onChange={handleInputChange} /></td>
                                        <td className="px-2 py-1 md:px-4 md:py-2 lg:px-6 lg:py-3 whitespace-nowrap">
                                            <input
                                                className="border p-2 rounded-md w-full"
                                                type="text"
                                                name="clientName"
                                                value={newSale.clientName}
                                                onChange={handleInputChange}
                                                onBlur={() => setSearchResults([])}
                                                onFocus={() => newSale.clientName.length > 2 && setSearchResults(searchResults)}
                                                required
                                            />
                                            {isSearching && <div>Searching...</div>}
                                            {searchResults.length > 0 && (
                                                <ul className="absolute bg-white shadow-lg mt-1 max-h-60 overflow-auto z-10">
                                                    {searchResults.map((sale, index) => (
                                                        <li key={index}
                                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-200"
                                                            onMouseDown={(event) => handleSelectSale(sale, event)}
                                                        >
                                                            {sale["NOM DU CLIENT"]} - {sale["TELEPHONE"]}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </td>
                                        <td className="px-2 py-1 md:px-4 md:py-2 lg:px-6 lg:py-3 whitespace-nowrap"><input className="border p-2 rounded-md w-full" type="text" name="phoneNumber" value={newSale.phoneNumber} onChange={handleInputChange} required /></td>
                                        <td className="px-2 py-1 md:px-4 md:py-2 lg:px-6 lg:py-3 whitespace-nowrap"><input className="border p-2 rounded-md w-full" type="text" name="address" value={newSale.address} onChange={handleInputChange} required /></td>
                                        <td className="px-2 py-1 md:px-4 md:py-2 lg:px-6 lg:py-3 whitespace-nowrap"><input className="border p-2 rounded-md w-full" type="text" name="numeroBC" value={newSale.numeroBC} onChange={handleInputChange} required /></td>
                                        <td className="px-2 py-1 md:px-4 md:py-2 lg:px-6 lg:py-3 whitespace-nowrap"><input className="border p-2 rounded-md w-full" type="text" name="orderNumber" value={newSale.orderNumber} onChange={handleInputChange} required /></td>
                                        <td className="px-2 py-1 md:px-4 md:py-2 lg:px-6 lg:py-3 whitespace-nowrap"><input className="border p-2 rounded-md w-full" type="text" name="workDescription" value={newSale.workDescription} onChange={handleInputChange} required /></td>
                                        <td className="px-2 py-1 md:px-4 md:py-2 lg:px-6 lg:py-3 whitespace-nowrap">
                                            <select className="border p-2 rounded-md w-full" name="status" value={newSale.status} onChange={handleInputChange} required>
                                                <option value="En attente">En attente</option>
                                                <option value="Confirmé">Confirmé</option>
                                                <option value="Annulé">Annulé</option>
                                            </select>
                                        </td>
                                        <td className="px-2 py-1 md:px-4 md:py-2 lg:px-6 lg:py-3 whitespace-nowrap">-</td>
                                    </tr>
                                )}
                                {Array.from({ length: emptyRowsCount - 1 }).map((_, index) => (
                                    <tr key={`empty-${index}`}>
                                        <td className="px-2 py-1 md:px-4 md:py-2 lg:px-6 lg:py-3 whitespace-nowrap">-</td>
                                        <td className="px-2 py-1 md:px-4 md:py-2 lg:px-6 lg:py-3 whitespace-nowrap">-</td>
                                        <td className="px-2 py-1 md:px-4 md:py-2 lg:px-6 lg:py-3 whitespace-nowrap">-</td>
                                        <td className="px-2 py-1 md:px-4 md:py-2 lg:px-6 lg:py-3 whitespace-nowrap">-</td>
                                        <td className="px-2 py-1 md:px-4 md:py-2 lg:px-6 lg:py-3 whitespace-nowrap">-</td>
                                        <td className="px-2 py-1 md:px-4 md:py-2 lg:px-6 lg:py-3 whitespace-nowrap">-</td>
                                        <td className="px-2 py-1 md:px-4 md:py-2 lg:px-6 lg:py-3 whitespace-nowrap">-</td>
                                        <td className="px-2 py-1 md:px-4 md:py-2 lg:px-6 lg:py-3 whitespace-nowrap">-</td>
                                        <td className="px-2 py-1 md:px-4 md:py-2 lg:px-6 lg:py-3 whitespace-nowrap">-</td>
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
