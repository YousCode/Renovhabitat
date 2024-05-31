import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

const normalizeString = (str) => {
  return str
    ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    : "";
};

const ITEMS_PER_PAGE = 200;

const AllSales = () => {
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const history = useHistory();

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await fetch("http://localhost:8080/ventes/all");
        if (!response.ok) {
          throw new Error(`Failed to fetch sales: ${response.statusText}`);
        }
        const data = await response.json();
        setSales(data.data);
        setFilteredSales(data.data);
      } catch (error) {
        console.error("Error fetching sales:", error);
        setError(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  const totalPages = Math.ceil(filteredSales.length / ITEMS_PER_PAGE);

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = sales.filter((sale) =>
      normalizeString(sale["NOM DU CLIENT"]).includes(term)
    );
    setFilteredSales(filtered);
    setCurrentPage(1);
  };

  const displayedSales = filteredSales.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (loading) return <p className="text-center text-gray-700">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-800 p-4">
      <div className="flex justify-between items-center w-full mb-4">
        <button
          onClick={() => history.goBack()}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg"
        >
          Retour
        </button>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Rechercher par nom du client"
          className="w-1/3 p-2 border border-gray-300 rounded-lg"
        />
        <div>
          <button
            onClick={handlePreviousPage}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg mr-2"
            disabled={currentPage === 1}
          >
            Précédent
          </button>
          <button
            onClick={handleNextPage}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg"
            disabled={currentPage === totalPages}
          >
            Suivant
          </button>
        </div>
      </div>
      <div className="w-full overflow-x-auto">
        <table className="min-w-full bg-white text-gray-800">
          <thead className="bg-gray-700 text-white">
            <tr>
              <th className="w-1/12 px-4 py-2">Date de Vente</th>
              <th className="w-1/12 px-4 py-2">Civilité</th>
              <th className="w-1/12 px-4 py-2">Nom du Client</th>
              <th className="w-1/12 px-4 py-2">Prénom</th>
              <th className="w-1/12 px-4 py-2">Numéro BC</th>
              <th className="w-2/12 px-4 py-2">Adresse du Client</th>
              <th className="w-1/12 px-4 py-2">Ville</th>
              <th className="w-1/12 px-4 py-2">Code Postal</th>
              <th className="w-1/12 px-4 py-2">Téléphone</th>
              <th className="w-1/12 px-4 py-2">Vendeur</th>
              <th className="w-1/12 px-4 py-2">Désignation</th>
              <th className="w-1/12 px-4 py-2">Taux TVA</th>
              <th className="w-1/12 px-4 py-2">Commission Solo</th>
              <th className="w-1/12 px-4 py-2">Montant TTC</th>
              <th className="w-1/12 px-4 py-2">Montant HT</th>
              <th className="w-1/12 px-4 py-2">Montant Annulé</th>
              <th className="w-1/12 px-4 py-2">CA Mensuel</th>
              <th className="w-1/12 px-4 py-2">État</th>
            </tr>
          </thead>
          <tbody>
            {displayedSales.map((sale, index) => (
              <tr
                key={index}
                className={`${
                  normalizeString(sale.ETAT) === "annule"
                    ? "bg-red-200 animate-blink"
                    : index % 2 === 0
                    ? "bg-gray-100"
                    : "bg-white"
                }`}
              >
                <td className="border px-4 py-2">
                  {new Date(sale["DATE DE VENTE"]).toLocaleDateString()}
                </td>
                <td className="border px-4 py-2">{sale.CIVILITE}</td>
                <td className="border px-4 py-2">{sale["NOM DU CLIENT"]}</td>
                <td className="border px-4 py-2">{sale.prenom}</td>
                <td className="border px-4 py-2">{sale["NUMERO BC"]}</td>
                <td className="border px-4 py-2">{sale["ADRESSE DU CLIENT"]}</td>
                <td className="border px-4 py-2">{sale.VILLE}</td>
                <td className="border px-4 py-2">{sale.CP}</td>
                <td className="border px-4 py-2">{sale.TELEPHONE}</td>
                <td className="border px-4 py-2">{sale.VENDEUR}</td>
                <td className="border px-4 py-2">{sale.DESIGNATION}</td>
                <td className="border px-4 py-2">{sale["TAUX TVA"]}</td>
                <td className="border px-4 py-2">{sale["COMISSION SOLO"]}</td>
                <td className="border px-4 py-2">{sale["MONTANT TTC "]}</td>
                <td className="border px-4 py-2">{sale["MONTANT HT"]}</td>
                <td className="border px-4 py-2">{sale["MONTANT ANNULE"]}</td>
                <td className="border px-4 py-2">{sale["CA MENSUEL"]}</td>
                <td className="border px-4 py-2">{sale.ETAT}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4 w-full">
        <button
          onClick={handlePreviousPage}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg"
          disabled={currentPage === 1}
        >
          Précédent
        </button>
        <span className="text-white">Page {currentPage} sur {totalPages}</span>
        <button
          onClick={handleNextPage}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg"
          disabled={currentPage === totalPages}
        >
          Suivant
        </button>
      </div>
      <style jsx>{`
        @keyframes blink {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            opacity: 1;
          }
        }
        .animate-blink {
          animation: blink 1s infinite;
        }
      `}</style>
    </div>
  );
};

export default AllSales;
