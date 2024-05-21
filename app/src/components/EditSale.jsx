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

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="p-6">
            <h2 className="text-2xl text-white font-bold mb-4">Edit Sale</h2>
            <form onSubmit={handleSave}>
                <div className="mb-4">
                    <label className="block text-white">Client Name</label>
                    <input
                        className="border p-2 rounded-md w-full"
                        type="text"
                        name="NOM DU CLIENT"
                        value={sale["NOM DU CLIENT"]}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-white">Sale Date</label>
                    <input
                        className="border p-2 rounded-md w-full"
                        type="date"
                        name="DATE DE VENTE"
                        value={sale["DATE DE VENTE"]}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-white">Civility</label>
                    <input
                        className="border p-2 rounded-md w-full"
                        type="text"
                        name="CIVILITE"
                        value={sale["CIVILITE"]}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-white">First Name</label>
                    <input
                        className="border p-2 rounded-md w-full"
                        type="text"
                        name="prenom"
                        value={sale["prenom"]}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-white">Order Number</label>
                    <input
                        className="border p-2 rounded-md w-full"
                        type="text"
                        name="NUMERO BC"
                        value={sale["NUMERO BC"]}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-white">Client Address</label>
                    <input
                        className="border p-2 rounded-md w-full"
                        type="text"
                        name="ADRESSE DU CLIENT"
                        value={sale["ADRESSE DU CLIENT"]}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-white">City</label>
                    <input
                        className="border p-2 rounded-md w-full"
                        type="text"
                        name="VILLE"
                        value={sale["VILLE"]}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-white">Postal Code</label>
                    <input
                        className="border p-2 rounded-md w-full"
                        type="text"
                        name="CP"
                        value={sale["CP"]}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-white">Phone Number</label>
                    <input
                        className="border p-2 rounded-md w-full"
                        type="text"
                        name="TELEPHONE"
                        value={sale["TELEPHONE"]}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-white">Seller</label>
                    <input
                        className="border p-2 rounded-md w-full"
                        type="text"
                        name="VENDEUR"
                        value={sale["VENDEUR"]}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-white">Designation</label>
                    <input
                        className="border p-2 rounded-md w-full"
                        type="text"
                        name="DESIGNATION"
                        value={sale["DESIGNATION"]}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-white">VAT Rate</label>
                    <input
                        className="border p-2 rounded-md w-full"
                        type="number"
                        name="TAUX TVA"
                        value={sale["TAUX TVA"]}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-white">Commission Solo</label>
                    <input
                        className="border p-2 rounded-md w-full"
                        type="number"
                        name="COMISSION SOLO"
                        value={sale["COMISSION SOLO"]}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-white">Total Amount (TTC)</label>
                    <input
                        className="border p-2 rounded-md w-full"
                        type="number"
                        name="MONTANT TTC"
                        value={sale["MONTANT TTC"]}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-white">Total Amount (HT)</label>
                    <input
                        className="border p-2 rounded-md w-full"
                        type="number"
                        name="MONTANT HT"
                        value={sale["MONTANT HT"]}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-white">Cancelled Amount</label>
                    <input
                        className="border p-2 rounded-md w-full"
                        type="number"
                        name="MONTANT ANNULE"
                        value={sale["MONTANT ANNULE"]}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-white">Monthly Revenue</label>
                    <input
                        className="border p-2 rounded-md w-full"
                        type="number"
                        name="CA MENSUEL"
                        value={sale["CA MENSUEL"]}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-white">Status</label>
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
                <button className="bg-blue-500 text-white py-2 px-4 rounded-md mt-4" type="submit">Save</button>
            </form>
        </div>
    );
};

export default EditSale;
