import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useHistory } from "react-router-dom";

const EditSale = () => {
    const { saleId } = useParams();
    const [sale, setSale] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const history = useHistory();

    // useEffect(() => {
    //     const fetchSale = async () => {
    //         setLoading(true);
    //         try {
    //             const response = await fetch(`http://localhost:8080/ventes/${saleId}`);
    //             if (!response.ok) {
    //                 throw new Error(`Failed to fetch sale with status ${response.status}`);
    //             }
    //             const data = await response.json();
    //             setSale(data);
    //         } catch (error) {
    //             console.error("Error fetching sale data:", error);
    //             setError(`Error: ${error.message}`);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };
    //     fetchSale();
    // }, [saleId]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setSale(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`http://localhost:8080/ventes/${saleId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(sale)
            });

            if (response.ok) {
                history.push('/sales');
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
                {/* Add other form fields similarly */}
                <button className="bg-blue-500 text-white py-2 px-4 rounded-md mt-4" type="submit">Save</button>
            </form>
        </div>
    );
};

export default EditSale;
