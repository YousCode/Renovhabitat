const express = require("express");
const passport = require("passport");
const router = express.Router();
const Vente = require("../models/ventes"); // Assurez-vous que le modèle est correctement défini
const { capture } = require("../sentry"); // Gestion centralisée des erreurs
const SERVER_ERROR = "SERVER_ERROR";

// Créer une nouvelle vente
router.post("/", passport.authenticate("user", { session: false }), async (req, res) => {
  try {
    const obj = {
      name: req.body.name,
      leadId: req.body.leadId,
    };

    const vente = await Vente.create(obj);
    res.status(201).json({ success: true, message: "Vente créée avec succès", data: vente });
  } catch (error) {
    capture(error);
    res.status(500).json({ success: false, message: SERVER_ERROR, error });
  }
});

// Récupérer toutes les ventes avec filtres optionnels
router.get("/", passport.authenticate("user", { session: false }), async (req, res) => {
  try {
    const { status = "En cours" } = req.query; 
    const ventes = await Vente.find({ status: status });
    res.status(200).json({ success: true, data: ventes });
  } catch (error) {
    capture(error);
    res.status(500).json({ success: false, message: SERVER_ERROR, error });
  }
});

// Mise à jour d'une vente
router.put("/:id", passport.authenticate("user", { session: false }), async (req, res) => {
  try {
    const { id } = req.params;
    const updatedVente = await Vente.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedVente) {
      return res.status(404).json({ success: false, message: "Vente non trouvée" });
    }
    res.status(200).json({ success: true, message: "Vente mise à jour avec succès", data: updatedVente });
  } catch (error) {
    capture(error);
    res.status(500).json({ success: false, message: SERVER_ERROR, error });
  }
});

// Supprimer une vente
router.delete("/:id", passport.authenticate("user", { session: false }), async (req, res) => {
  try {
    const { id } = req.params;
    await Vente.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Vente supprimée avec succès" });
  } catch (error) {
    capture(error);
    res.status(500).json({ success: false, message: SERVER_ERROR, error });
  }
});

module.exports = router;
