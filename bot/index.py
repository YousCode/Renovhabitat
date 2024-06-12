import pandas as pd
from datetime import datetime

def parse_dates(val):
    if pd.isnull(val) or val.strip() == "":
        return None
    for fmt in ("%d/%m/%Y", "%m/%d/%Y"):
        try:
            return datetime.strptime(val, fmt).strftime('%d/%m/%Y')
        except ValueError:
            continue
    print(f"Unable to parse date: {val}")
    return None

try:
    # Chemin d'accès au fichier Excel
    file_path = './database.xlsx'  # Assurez-vous que ce chemin est correct

    # Charger les données
    data = pd.read_excel(file_path, engine='openpyxl')

    # Colonnes à inclure
    columns_to_include = [
        'DATE DE VENTE', 'CIVILITE', 'NOM DU CLIENT', 'prenom', 'NUMERO BC', 'TE', 
        'ADRESSE DU CLIENT', 'CODE INTERP etage', 'VILLE', 'CP', 'TELEPHONE', 'VENDEUR',
        'DESIGNATION', 'TAUX TVA', 'COMISSION SOLO', 'MONTANT TTC ', 'MONTANT HT', 
        'MONTANT ANNULE', 'CA MENSUEL', 'ETAT'
    ]

    # Trouver les colonnes manquantes
    missing_columns = [col for col in columns_to_include if col not in data.columns]

    # Vérifiez si toutes les colonnes nécessaires sont présentes dans le DataFrame
    if missing_columns:
        print("Certaines des colonnes nécessaires sont manquantes dans le fichier Excel:", missing_columns)
    else:
        # Appliquer la fonction de parsing aux dates
        if 'DATE DE VENTE' in data.columns:
            data['DATE DE VENTE'] = data['DATE DE VENTE'].astype(str).apply(parse_dates)
            data = data[data['DATE DE VENTE'].notna()]  # Exclure les lignes où la date n'a pas pu être parsée

        # Sélection des données requises
        selected_data = data[columns_to_include]

        # Conversion des données sélectionnées en format JSON
        json_data = selected_data.to_json(orient='records', force_ascii=False)

        # Afficher le JSON dans la console
        print(json_data)

        # Sauvegarder dans un fichier JSON
        output_file_path = 'output_data.json'
        with open(output_file_path, 'w', encoding='utf-8') as file:
            file.write(json_data)
        print(f"Les données ont été exportées en JSON dans le fichier {output_file_path}")

except FileNotFoundError:
    print("Le fichier spécifié n'a pas été trouvé.")
except Exception as e:
    print(f"Une erreur est survenue: {e}")