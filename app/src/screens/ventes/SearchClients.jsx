import React, { useState } from "react";

const SearchClient = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [ventes, setVentes] = useState([]);
  const [message, setMessage] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const searchVentes = async () => {
    setIsSearching(true);
    setMessage("");
    try {
      const response = await fetch(`http://localhost:8080/ventes/search?searchTerm=${encodeURIComponent(searchTerm)}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }
      const data = await response.json();
      if (data.success) {
        setVentes(data.data);
        if (data.data.length === 0) {
          setMessage("Aucune vente correspondante trouvée");
        }
      } else {
        setVentes([]);
        setMessage("Aucune vente correspondante trouvée");
      }
    } catch (error) {
      console.error("Search error:", error);
      setMessage("Erreur lors de la recherche des ventes");
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = async (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value) {
      setIsSearching(true);
      try {
        const response = await fetch(`http://localhost:8080/ventes/search?searchTerm=${encodeURIComponent(e.target.value)}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }
        const data = await response.json();
        if (data.success) {
          const uniqueNames = Array.from(new Set(data.data.map(sale => sale["NOM DU CLIENT"])));
          setSearchResults(uniqueNames.map(name => ({
            name,
            sales: data.data.filter(sale => sale["NOM DU CLIENT"] === name)
          })));
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectSale = (sales) => {
    setSearchTerm(sales[0]["NOM DU CLIENT"]);
    setSearchResults([]);
    setVentes(sales);
  };

  return (
    <div className="bg-gray-100 p-6 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg relative">
        <div className="mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Rechercher par nom du client"
          />
          {isSearching && <div>Recherche en cours...</div>}
          {searchResults.length > 0 && (
            <ul className="absolute bg-white shadow-lg mt-1 max-h-60 overflow-auto z-10 w-full border border-gray-300 rounded-lg">
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
        <button
          className={`w-full p-3 rounded-lg ${isSearching ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
          onClick={searchVentes}
          disabled={isSearching}
        >
          {isSearching ? 'Recherche en cours...' : 'Rechercher'}
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {message && <p className="text-red-500 col-span-full">{message}</p>}
        {ventes.map((vente) => (
          <div key={vente._id} className="bg-white p-6 rounded-lg shadow-lg">
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
    </div>
  );
};

export default SearchClient;
