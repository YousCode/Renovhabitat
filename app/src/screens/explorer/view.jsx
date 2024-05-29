import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useHistory } from "react-router-dom";

export const ExplorerView = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const history = useHistory();

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
    history.push({
      pathname: "/ventes",
      state: { sales }
    });
  };

  return (
    <>
      <section className="lg:h-[calc(100vh-82px)] h-[calc(100vh-68px)] absolute lg:top-20 top-[68px] left-0 w-full z-20 flex items-center justify-center">
        <div className="sm:max-w-xl mx-5 lg:mx-auto w-full space-y-5">
          <h1 className="text-white text-4xl font-bold">
            Sans aucun doute, <br />
            <span className="text-gradient">
            le meilleur de
              <br /> la rénovation
            </span>{" "}
            est ici.
          </h1>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              className="w-full p-3 pl-10 border text-black border-gray-300 rounded-lg search-input"
              placeholder="Rechercher par nom du client, numéro de téléphone"
            />
            {isSearching && <div>Recherche en cours...</div>}
            {searchResults.length > 0 && (
              <ul className="absolute bg-white shadow-lg mt-1 max-h-60  text-black overflow-auto z-10 w-full border border-gray-300 rounded-lg left-0">
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
          {/* <Link
            to="/ventes"
            className="text-white py-2 text-center w-full bg-green-500 font-semibold rounded-lg cursor-pointer block"
          >
            Chercher un client
          </Link> */}
        </div>
      </section>
      <div className="lg:h-[calc(100vh-82px)] h-[calc(100vh-68px)] absolute lg:top-20 top-[68px] left-0 w-full">
        <div className="w-full h-[100%] bg-explore-gradient absolute bottom-0" />
        <img
          src={require("src/assets/explore-bg.png")}
          className="w-full h-full object-cover"
        />
      </div>
    </>
  );
};
