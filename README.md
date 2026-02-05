# 🔧 µsini XCS Reader

**Lecteur de fichiers xTool Creative Space (.xcs)**
# https://usini.github.io/xcsReader/
Une application web statique permettant de visualiser et analyser le contenu des fichiers de projet xTool Creative Space.   
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)    
<img width="587" height="643.5" alt="image" src="https://github.com/user-attachments/assets/f9b019fb-66e2-457a-953a-e8dccc1427e3" />



## 📋 Description

Les fichiers `.xcs` sont des fichiers de projet utilisés par le logiciel **xTool Creative Space** pour les machines de découpe/gravure laser xTool. Ce reader permet de :

- Visualiser les informations générales du projet
- Voir les paramètres de l'appareil configuré
- Afficher l'aperçu du projet
- Lister les calques (layers) avec leurs couleurs
- Voir les paramètres de traitement laser (puissance, vitesse, passes, etc.)
- Afficher les éléments graphiques (BITMAP, PATH/SVG)
- Calculer les distances entre les éléments
- Exporter les données JSON brutes

## ✨ Fonctionnalités

### 📋 Informations générales
- Version du fichier
- Dates de création et modification
- Identifiants du projet et du canvas

### 🖨️ Appareil
- Modèle de machine xTool
- Paramètres de puissance laser
- Accessoires configurés

### 🖼️ Aperçu
- Image de couverture du projet (si disponible)

### 🎨 Canvas
- Dimensions de la zone de travail
- Paramètres de grille et règle

### 📚 Calques
- Liste des calques avec couleurs
- Visibilité et verrouillage
- Nombre d'éléments par calque

### ⚙️ Paramètres de traitement
- Type de traitement (Gravure, Découpe, Relief 3D...)
- Puissance laser (%)
- Vitesse (mm/s)
- Nombre de passes
- DPI, Fréquence, Densité
- Source laser (rouge, bleu, infrarouge)
- **Lien direct vers l'élément correspondant**

### 🔲 Éléments graphiques
- Aperçu des images BITMAP
- Aperçu SVG des éléments PATH
- Dimensions et position
- Couleur du calque et visibilité
- **Paramètres laser associés**
- **Lien vers les détails de traitement**

### 📏 Distances
- Calcul des distances entre chaque paire d'éléments
- Distance totale, ΔX et ΔY
- Filtrage par calque
- Tri par distance ou nom
- Coordonnées des centres

### 📄 JSON
- Visualisation des données brutes
- Copie dans le presse-papier
- Téléchargement en fichier JSON

## 🚀 Utilisation

### Option 1 : Ouvrir directement
Ouvrez simplement le fichier `index.html` dans votre navigateur web.

### Option 2 : Serveur local
```bash
# Avec Python
python -m http.server 8080

# Avec Node.js
npx serve

# Avec PHP
php -S localhost:8080
```
Puis ouvrez `http://localhost:8080` dans votre navigateur.

### Charger un fichier XCS
1. **Glisser-déposer** un fichier `.xcs` dans la zone de dépôt
2. Ou cliquer sur **"Parcourir les fichiers"** pour sélectionner un fichier

## 📁 Structure du projet

```
XCSREADER/
├── index.html      # Page principale
├── styles.css      # Styles CSS (thème sombre)
├── app.js          # Logique JavaScript
├── README.md       # Ce fichier
└── XCS/            # Dossier d'exemples (optionnel)
    └── *.xcs       # Fichiers de test
```

## 🔧 Format de fichier XCS

Les fichiers XCS sont des fichiers JSON contenant :

```json
{
  "version": "...",
  "canvasId": "...",
  "canvas": [{
    "displays": [...],    // Éléments graphiques
    "layerData": [...]    // Calques
  }],
  "device": {
    "type": "...",        // Modèle xTool
    "data": {...}         // Paramètres laser par élément
  },
  "cover": "data:image/...",  // Aperçu base64
  "meta": {...}
}
```

## 🎨 Thème

L'interface utilise un thème sombre moderne avec :
- Couleurs principales : Indigo (#4f46e5)
- Arrière-plan : Slate foncé (#0f172a)
- Cartes : Slate (#1e293b)

## 🌐 Compatibilité

- Chrome / Edge (recommandé)
- Firefox
- Safari
- Tout navigateur moderne supportant ES6+

## 📝 License

MIT License - Libre d'utilisation, modification et distribution.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
1. Fork le projet
2. Créer une branche (`git checkout -b feature/amelioration`)
3. Commit vos changements (`git commit -m 'Ajout d'une fonctionnalité'`)
4. Push sur la branche (`git push origin feature/amelioration`)
5. Ouvrir une Pull Request

## ⚠️ Avertissement

Ce projet n'est pas affilié à xTool. Il s'agit d'un outil communautaire pour visualiser les fichiers de projet.    
Le projet a été programmé à l'aide de Visual Studio Code + Copilot + Claude Opus 4.5
---

Fait avec ❤️ pour la communauté xTool

