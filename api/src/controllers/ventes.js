const express = require("express");
const Vente = require("../models/ventes");
const router = express.Router();

// Ajouter une nouvelle vente
router.post("/", async (req, res) => {
  try {
    const nouvelleVente = new Vente(req.body);
    await nouvelleVente.save();
    res.status(201).send({ success: true, message: "Vente créée avec succès", data: nouvelleVente });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
});

// Récupérer une vente par ID
router.get("/:id", async (req, res) => {
  try {
    const vente = await Vente.findById(req.params.id);
    if (!vente) {
      return res.status(404).send({ success: false, message: "Vente non trouvée" });
    }
    res.status(200).send({ success: true, data: vente });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

// Mettre à jour une vente
router.put("/:id", async (req, res) => {
  try {
    const vente = await Vente.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!vente) {
      return res.status(404).send({ success: false, message: "Vente non trouvée" });
    }
    res.status(200).send({ success: true, message: "Vente mise à jour avec succès", data: vente });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
});

// Supprimer une vente
router.delete("/:id", async (req, res) => {
  try {
    const vente = await Vente.findByIdAndDelete(req.params.id);
    if (!vente) {
      return res.status(404).send({ success: false, message: "Vente non trouvée" });
    }
    res.status(200).send({ success: true, message: "Vente supprimée avec succès" });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

// Rechercher des ventes
router.get("/search", async (req, res) => {
  try {
    const { searchTerm } = req.query;
    const ventes = await Vente.find({
      "NOM DU CLIENT": { $regex: searchTerm, $options: "i" }
    });
    if (ventes.length === 0) {
      return res.status(404).send({ success: false, message: "Aucune vente correspondante trouvée" });
    }
    res.status(200).send({ success: true, data: ventes });
  } catch (error) {
    res.status(500).send({ success: false, message: "Erreur lors de la recherche des ventes", error });
  }
});

module.exports = router;