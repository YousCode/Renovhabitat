import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const normalizeString = (str) => {
  return str
    ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    : "";
};

const SearchClient = () => {
  const location = useLocation();
  const [ventes, setVentes] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (location.state && location.state.sales) {
      setVentes(location.state.sales);
    } else {
      setMessage("Aucune vente correspondante trouvée");
    }
  }, [location.state]);

  return (
    <div style={{ backgroundColor: '#071013' }} className="bg-gray-100 p-6 min-h-screen flex">
      <div className="flex-1 mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {message && <p className="text-red-500 col-span-full">{message}</p>}
        {ventes.map((vente) => (
          <div
            key={vente._id}
            style={{
              backgroundColor: normalizeString(vente.ETAT) === "annule" ? '#ff334e' : '#61D1B7',
              animation: normalizeString(vente.ETAT) === "annule" ? 'blink 1s infinite' : 'none',
            }}
            className="bg-white p-6 rounded-lg shadow-lg height"
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
