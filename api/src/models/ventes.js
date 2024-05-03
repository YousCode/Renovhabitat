const mongoose = require('mongoose');
const venteSchema = new mongoose.Schema({
  "DATE DE VENTE": { type: Date, required: true },
  "CIVILITE": { type: String },
  "NOM DU CLIENT": { type: String, required: true },
  "prenom": { type: String, required: true },
  "NUMERO BC": { type: String, required: true },
  "TE": { type: String },
  "ADRESSE DU CLIENT": { type: String },
  "CODE INTERP etage": { type: String },
  "VILLE": { type: String },
  "CP": { type: String },
  "TELEPHONE": { type: String },
  "VENDEUR": { type: String },
  "DESIGNATION": { type: String },
  "TAUX TVA": { type: Number },
  "COMISSION SOLO": { type: Number },
  "MONTANT TTC ": { type: Number },
  "MONTANT HT": { type: Number },
  "MONTANT ANNULE": { type: Number },
  "CA MENSUEL": { type: Number },
  "ETAT": {
    type: String,
    enum: ['En attente', 'Confirmé', 'Annulé'],
    default: 'En attente'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

venteSchema.pre('save', function(next) {
  if (this.isModified('NUMERO BC')) {
    const numeroBC = this['NUMERO BC'].toString();
    this['NUMERO BC'] = numeroBC.replace(/\s/g, '').padStart(6, '0');
    if (!/^\d{6}$/.test(this['NUMERO BC'])) {
      return next(new Error('NUMERO BC doit être au format numérique à 6 chiffres'));
    }
  }
  next();
});

const Vente = mongoose.model('Vente', venteSchema);
module.exports = Vente;