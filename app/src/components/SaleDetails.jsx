import React, { useState, useEffect } from "react";

export const SalesList = () => {
    const [sales, setSales] = useState([]);

    useEffect(() => {
        async function fetchSales() {
            try {
                const response = await fetch("/ventes/all");
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const result = await response.json();
                setSales(result.data);
            } catch (error) {
                console.error("Error fetching sales data", error);
            }
        }

        fetchSales();
    }, []);

    return (
        <div>
            <h1>Liste des ventes</h1>
            <ul>
                {sales.map((sale) => (
                    <li key={sale._id}>
                        <strong>ID :</strong> {sale._id}
                        <br />
                        <strong>Nom du client :</strong> {sale["NOM DU CLIENT"]}
                        <br />
                        <strong>Designation :</strong> {sale["DESIGNATION"]}
                        <br />
                        <strong>Date de vente :</strong> {sale["DATE DE VENTE"]}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SalesList;
