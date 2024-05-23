import React, { useState } from "react";

const normalizeString = (str) => {
  return str
    ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    : "";
};

const SearchClient = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [ventes, setVentes] = useState([]);
  const [message, setMessage] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const handleInputChange = async (e) => {
    setSearchTerm(e.target.value);
    setMessage("");  // Réinitialiser le message d'erreur
    if (e.target.value) {
      setIsSearching(true);
      try {
        const response = await fetch(`http://localhost:8080/ventes/search?searchTerm=${encodeURIComponent(e.target.value)}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }
        const data = await response.json();
        if (data.success) {
          setVentes(data.data);
          const uniqueNames = Array.from(new Set(data.data.map(sale => sale["NOM DU CLIENT"])));
          setSearchResults(uniqueNames.map(name => ({
            name,
            sales: data.data.filter(sale => sale["NOM DU CLIENT"] === name)
          })));
          setMessage("");  // Réinitialiser le message d'erreur si la recherche réussit
        } else {
          setVentes([]);
          setSearchResults([]);
          setMessage("Aucune vente correspondante trouvée");
        }
      } catch (error) {
        console.error("Search error:", error);
        setMessage("Erreur lors de la recherche des ventes");
      } finally {
        setIsSearching(false);
      }
    } else {
      setVentes([]);
      setSearchResults([]);
    }
  };

  const handleSelectSale = (sales) => {
    setSearchTerm(sales[0]["NOM DU CLIENT"]);
    setSearchResults([]);
    setVentes(sales);
  };

  return (
    <div style={{ backgroundColor: '#071013' }} className="bg-gray-100 p-6 min-h-screen flex">
      <div className="w-1/3 mr-6">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg search-input"
            placeholder="Rechercher par nom du client, numéro de téléphone"
          />
          {isSearching && <div>Recherche en cours...</div>}
          {searchResults.length > 0 && (
            <ul className="absolute bg-white shadow-lg mt-1 max-h-60 overflow-auto z-10 w-full border border-gray-300 rounded-lg left-0">
              {searchResults.map((result, index) => (
                <li
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-200"
                  onClick={() => handleSelectSale(result.sales)}
                >
                  {result.name} - {result.sales[0]["TELEPHONE"]}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="flex-1 mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {message && <p className="text-red-500 col-span-full">{message}</p>}
        {ventes.map((vente) => (
          <div
            key={vente._id}
            style={{
              backgroundColor: normalizeString(vente.ETAT) === "annule" ? '#ff334e' : '#61D1B7',
              animation: normalizeString(vente.ETAT) === "annule" ? 'blink 1s infinite' : 'none',
            }}
            className="bg-white p-6 rounded-lg shadow-lg height "
          >
            <p><strong>Date de Vente:</strong> {new Date(vente["DATE DE VENTE"]).toLocaleDateString()}</p>
            <p><strong>Civilité:</strong> {vente.CIVILITE}</p>
            <p><strong>Nom du Client:</strong> {vente["NOM DU CLIENT"]}</p>
            <p><strong>Prénom:</strong> {vente.prenom}</p>
            <p><strong>Numéro BC:</strong> {vente["NUMERO BC"]}</p>
            <p><strong>Adresse du Client:</strong> {vente["ADRESSE DU CLIENT"]}</p>
            <p><strong>Ville:</strong> {vente.VILLE}</p>
            <p><strong>Code Postal:</strong> {vente.CP}</p>
            <p><strong>Téléphone:</strong> {vente.TELEPHONE}</p>
            <p><strong>Vendeur:</strong> {vente.VENDEUR}</p>
            <p><strong>Désignation:</strong> {vente.DESIGNATION}</p>
            <p><strong>Taux TVA:</strong> {vente["TAUX TVA"]}</p>
            <p><strong>Commission Solo:</strong> {vente["COMISSION SOLO"]}</p>
            <p><strong>Montant TTC:</strong> {vente["MONTANT TTC "]}</p>
            <p><strong>Montant HT:</strong> {vente["MONTANT HT"]}</p>
            <p><strong>Montant Annulé:</strong> {vente["MONTANT ANNULE"]}</p>
            <p><strong>CA Mensuel:</strong> {vente["CA MENSUEL"]}</p>
            <p><strong>État:</strong> {vente.ETAT}</p>
          </div>
        ))}
      </div>

      {/* Add the CSS for the blinking effect */}
      <style jsx>{`
        @keyframes blink {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
        .height {
          height: fit-content;
        }
      `}</style>
    </div>
  );
};

export default SearchClient;
