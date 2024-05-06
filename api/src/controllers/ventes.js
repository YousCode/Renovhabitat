const express = require("express");
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Vente = require("../models/ventes");

// Ajouter une nouvelle vente avec validation
router.post("/", [
  body('NOM DU CLIENT').not().isEmpty().trim().escape(),
  body('NUMERO BC').isNumeric().isLength({ min: 6, max: 6 }),
  body('DATE DE VENTE').isISO8601(),
  // Ajoutez ici d'autres validations si nécessaire
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const nouvelleVente = new Vente(req.body);
    await nouvelleVente.save();
    res.status(201).json({ success: true, message: "Vente créée avec succès", data: nouvelleVente });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Récupérer une vente par ID
router.get("/:id", async (req, res) => {
  try {
    const vente = await Vente.findById(req.params.id);
    if (!vente) {
      return res.status(404).json({ success: false, message: "Vente non trouvée" });
    }
    res.status(200).json({ success: true, data: vente });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Mettre à jour une vente
router.put("/:id", async (req, res) => {
  try {
    const vente = await Vente.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!vente) {
      return res.status(404).json({ success: false, message: "Vente non trouvée" });
    }
    res.status(200).json({ success: true, message: "Vente mise à jour avec succès", data: vente });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Supprimer une vente
router.delete("/:id", async (req, res) => {
  try {
    const vente = await Vente.findByIdAndDelete(req.params.id);
    if (!vente) {
      return res.status(404).json({ success: false, message: "Vente non trouvée" });
    }
    res.status(200).json({ success: true, message: "Vente supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Rechercher des ventes par nom du client ou numéro BC
router.get("/search", async (req, res) => {
  const { searchTerm } = req.query;
  try {
    const ventes = await Vente.find({
      $or: [
        { "NOM DU CLIENT": { $regex: searchTerm, $options: "i" } },
        { "NUMERO BC": searchTerm }
      ]
    });
    if (ventes.length === 0) {
      return res.status(404).json({ success: false, message: "Aucune vente correspondante trouvée" });
    }
    res.status(200).json({ success: true, data: ventes });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erreur lors de la recherche des ventes", error });
  }
});

// Obtenir toutes les ventes avec pagination
router.get("/all", async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const ventes = await Vente.find()
                              .limit(limit * 1)
                              .skip((page - 1) * limit)
                              .exec();
    const count = await Vente.countDocuments();
    res.status(200).json({
      success: true,
      data: ventes,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching sales", error });
  }
});

module.exports = router;
