// import React, { useState } from "react";

// const NewSaleModal = ({ onClose, onAdd }) => {
//   const [newSale, setNewSale] = useState({
//     "DATE DE VENTE": "",
//     "CIVILITE": "",
//     "NOM DU CLIENT": "",
//     "prenom": "",
//     "NUMERO BC": "",
//     "ADRESSE DU CLIENT": "",
//     "VILLE": "",
//     "CP": "",
//     "TELEPHONE": "",
//     "VENDEUR": "",
//     "DESIGNATION": "",
//     "TAUX TVA": "",
//     "COMISSION SOLO": "",
//     "MONTANT TTC ": "",
//     "MONTANT HT": "",
//     "MONTANT ANNULE": "",
//     "ETAT": ""
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setNewSale((prevSale) => ({
//       ...prevSale,
//       [name]: value
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onAdd(newSale);
//     onClose();
//   };

//   return (
//     <div className="modal">
//       <div className="modal-content">
//         <span className="close" onClick={onClose}>&times;</span>
//         <h2>Ajouter une nouvelle vente</h2>
//         <form onSubmit={handleSubmit} className="flex  ">
//           <div className="mb-4">
//             <label>Date de vente:</label>
//             <input className="bg-slate-950" type="text" name="DATE DE VENTE" value={newSale["DATE DE VENTE"]} onChange={handleChange} />
//           </div>

//           <div className="mb-4">
//             <label>TELEPHONE:</label>
//             <input className="bg-slate-950" type="text" name="TELEPHONE" value={newSale["TELEPHONE"]} onChange={handleChange} />
//           </div>

//           <div className="mb-4">
//             <label>VENDEUR:</label>
//             <input className="bg-slate-950" type="text" name="VENDEUR" value={newSale["VENDEUR"]} onChange={handleChange} />
//           </div>

//           <div className="mb-4">
//             <label>Nom du client:</label>
//             <input className="bg-slate-950" type="text" name="NOM DU CLIENT" value={newSale["NOM DU CLIENT"]} onChange={handleChange} />
//           </div>

//           <div className="mb-4 ">
//             <label>VILLE:</label>
//             <input className="bg-slate-950" type="text" name="VILLE" value={newSale["VILLE"]} onChange={handleChange} />
//           </div>

//           {/* Ajouter d'autres champs de saisie pour les autres propriétés de vente */}
//           {/* ... */}

//           <button type="submit" className="py-2 px-4 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors">Ajouter</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default NewSaleModal;

import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

const NewSaleModal = ({ onClose, onAdd }) => {
  const [newSale, setNewSale] = useState({
    "DATE DE VENTE": "",
    CIVILITE: "",
    "NOM DU CLIENT": "",
    prenom: "",
    "NUMERO BC": "",
    "ADRESSE DU CLIENT": "",
    VILLE: "",
    CP: "",
    TELEPHONE: "",
    VENDEUR: "",
    DESIGNATION: "",
    "TAUX TVA": "",
    "COMISSION SOLO": "",
    "MONTANT TTC ": "",
    "MONTANT HT": "",
    "MONTANT ANNULE": "",
    ETAT: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSale((prevSale) => ({
      ...prevSale,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Assuming `newSale` is already up to date with all input changes handled by `handleChange`
    const formData = {
      "DATE DE VENTE": newSale["DATE DE VENTE"],
      CIVILITE: newSale["CIVILITE"],
      "NOM DU CLIENT": newSale["NOM DU CLIENT"],
      prenom: newSale["prenom"],
      "NUMERO BC": newSale["NUMERO BC"],
      "ADRESSE DU CLIENT": newSale["ADRESSE DU CLIENT"],
      VILLE: newSale["VILLE"],
      CP: newSale["CP"],
      TELEPHONE: newSale["TELEPHONE"],
      VENDEUR: newSale["VENDEUR"],
      DESIGNATION: newSale["DESIGNATION"],
      "TAUX TVA": newSale["TAUX TVA"],
      "COMISSION SOLO": newSale["COMISSION SOLO"],
      "MONTANT TTC ": newSale["MONTANT TTC "],
      "MONTANT HT": newSale["MONTANT HT"],
      "MONTANT ANNULE": newSale["MONTANT ANNULE"],
      ETAT: newSale["ETAT"],
    };

    // Call the onAdd function passed from the parent component with the new sale data
    onAdd(formData);

    // Close the modal
    onClose();
  };
  // initialView="dayGridDay"
  // initialView="dayGridMonth"

  return (
    <Transition.Root show={true} as={Fragment}>
      <Dialog onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        </Transition.Child>

        <Transition.Child
          as={Fragment}
          enter="transition ease-in-out duration-300"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in-out duration-300"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <div className="fixed z-50 inset-0 flex items-center justify-center overflow-y-auto">
            <div className="absolute inset-0 bg-black opacity-50" />

            <div className="relative bg-white p-8 max-w-md mx-auto rounded-lg shadow-lg">
              <button
                onClick={onClose}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <h2 className="text-2xl font-bold mb-4">
                Ajouter une nouvelle vente
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <label className="block">
                  Date de vente:
                  <input
                    type="text"
                    name="DATE DE VENTE"
                    value={newSale["DATE DE VENTE"]}
                    onChange={handleChange}
                    className="block w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
                  />
                </label>

                <label className="block">
                  Civilité:
                  <input
                    type="text"
                    name="CIVILITE"
                    value={newSale["CIVILITE"]}
                    onChange={handleChange}
                    className="block w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
                  />
                </label>

                <label className="block">
                  Téléphone:
                  <input
                    type="text"
                    name="TELEPHONE"
                    value={newSale["TELEPHONE"]}
                    onChange={handleChange}
                    className="block w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
                  />
                </label>

                <label className="block">
                  Nom du client:
                  <input
                    type="text"
                    name="NOM DU CLIENT"
                    value={newSale["NOM DU CLIENT"]}
                    onChange={handleChange}
                    className="block w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
                  />
                </label>

                <label className="block">
                  Vendeur:
                  <select
                    name="VENDEUR"
                    value={newSale["VENDEUR"]}
                    onChange={handleChange}
                    className="block w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select un vendeur</option>{" "}
                    {/* Optional: add a default "empty" option */}
                    <option value="Payet">Payet</option>
                    <option value="Rivet">Rivet</option>
                    <option value="Deberre">Deberre</option>
                    <option value="Masson">Masson</option>
                  </select>
                </label>

                <lable className="block">
                  Désignation:
                  <input
                    type="text"
                    name="DESIGNATION"
                    value={newSale["DESIGNATION"]}
                    onChange={handleChange}
                    className="block w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
                  />
                </lable>

                <button
                  type="submit"
                  className="block w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
                >
                  Ajouter
                </button>
              </form>
            </div>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  );
};

export default NewSaleModal;
