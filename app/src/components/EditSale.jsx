import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';

const EditSale = () => {
    const { saleId } = useParams();
    const [sale, setSale] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const history = useHistory();

    useEffect(() => {
        const fetchSale = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:8080/ventes/${saleId}`, {
                    credentials: 'include', // Include credentials (cookies)
                });
                if (!response.ok) {
                    throw new Error(`Failed to fetch sale with status ${response.status}`);
                }
                const data = await response.json();
                setSale(data.data);
            } catch (error) {
                console.error("Error fetching sale data:", error);
                setError(`Error: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };
        fetchSale();
    }, [saleId]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setSale(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`http://localhost:8080/ventes/${saleId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include', // Include credentials (cookies)
                body: JSON.stringify(sale)
            });

            if (response.ok) {
                // Redirect to the sales list for the specific date
                const saleDate = new Date(sale["DATE DE VENTE"]).toISOString().split('T')[0]; // Get date in 'YYYY-MM-DD' format
                history.push(`/projects/${saleDate}`);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || `Error: ${response.status}`);
            }
        } catch (error) {
            console.error("Error saving sale:", error.message);
        }
    };

    if (loading) return <p className="text-center text-gray-700">Loading...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div style={{ backgroundColor: '#005C47' }} className="max-w-4xl  mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-2xl text-[#B0FFE9] font-bold mb-6 text-center">Modifier la vente</h2>
            <form onSubmit={handleSave}>
                {Object.entries(sale).map(([key, value]) => (
                    key !== "_id" && (
                        <div className="mb-4" key={key}>
                            <label className="block text-[#B0FFE9] capitalize">{key.replace(/_/g, ' ')}</label>
                            <input
                                className="border p-2 rounded-md w-full"
                                type={key === "DATE DE VENTE" ? "date" : "text"}
                                name={key}
                                value={value}
                                onChange={handleInputChange}
                                required={["NOM DU CLIENT", "DATE DE VENTE", "NUMERO BC"].includes(key)}
                            />
                        </div>
                    )
                ))}
                <div className="mb-4">
                    <label className="block text-gray-700">Status</label>
                    <select
                        className="border p-2 rounded-md w-full"
                        name="ETAT"
                        value={sale["ETAT"]}
                        onChange={handleInputChange}
                    >
                        <option value="En attente">En attente</option>
                        <option value="Confirmé">Confirmé</option>
                        <option value="Annulé">Annulé</option>
                    </select>
                </div>
                <button className="bg-blue-500 text-white py-2 px-4 rounded-md mt-4 hover:bg-blue-600 transition duration-300" type="submit">Save</button>
            </form>
        </div>
    );
};

export default EditSale;
