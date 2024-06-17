const express = require("express");
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Vente = require("../models/ventes");
const passport = require('passport');

// Fonction pour normaliser les numéros de téléphone en enlevant les espaces
const normalizePhoneNumber = (phoneNumber) => phoneNumber.replace(/\s+/g, "");

// Ajouter une nouvelle vente avec validation
router.post("/", [
  body('NOM DU CLIENT').not().isEmpty().trim().escape(),
  body('NUMERO BC').isNumeric().isLength({ min: 1, max: 6 }),
  body('DATE DE VENTE').isISO8601().toDate(),
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

// Route GET pour récupérer toutes les ventes
router.get("/all", async (req, res) => {
  try {
    const ventes = await Vente.find().exec();
    const count = await Vente.countDocuments();
    res.status(200).json({
      success: true,
      data: ventes,
      totalItems: count
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erreur lors de la récupération des ventes", error: error.message });
  }
});
929664811
// Rechercher des ventes par nom du client ou numéro BC ou numéro de téléphone (avec ou sans espaces)
router.get("/search", async (req, res) => {
  const { searchTerm } = req.query;
  const normalizedSearchTerm = normalizePhoneNumber(searchTerm);

  try {
    const ventes = await Vente.find({
      $or: [
        { "NOM DU CLIENT": { $regex: searchTerm, $options: "i" } },
        { "TELEPHONE": { $regex: normalizedSearchTerm, $options: "i" } },
        { "NUMERO BC": searchTerm }
      ]
    });
    if (ventes.length === 0) {
      return res.status(404).json({ success: false, message: "Aucune vente correspondante trouvée" });
    }
    res.status(200).json({ success: true, data: ventes });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erreur lors de la recherche des ventes", error: error.message });
  }
});

// Route GET pour récupérer une vente par ID avec authentification
router.get("/:id", passport.authenticate("user", { session: false }),  async (req, res) => {
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

// Mise à jour d'une vente avec authentification
router.put("/:id", passport.authenticate("user", { session: false }), async (req, res) => {
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

// Supprimer une vente avec authentification
router.delete("/:id", passport.authenticate("user", { session: false }), async (req, res) => {
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

module.exports = router;