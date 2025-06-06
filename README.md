# GR Web App

Bienvenue dans **GR**, une application web conçue pour gérer votre collection de vêtements, créer et organiser des tenues, et bientôt partager vos looks avec vos amis !

---

## Table des matières

1. [Fonctionnalités actuelles](#fonctionnalités-actuelles)  
2. [Installation](#installation)  
3. [Configuration et utilisation](#configuration-et-utilisation)  
   - [Page d’accueil : Gérer vos vêtements](#page-daccueil--gérer-vos-vêtements)  
   - [Lookbook : Créer et enregistrer vos outfits](#lookbook--créer-et-enregistrer-vos-outfits)  
   - [Mix & Match (en cours)](#mix--match-en-cours)  
4. [Structure du projet](#structure-du-projet)  
5. [Technologies utilisées](#technologies-utilisées)  
6. [Étapes de développement et futures évolutions](#étapes-de-développement-et-futures-évolutions)  
7. [Contribution](#contribution)  
8. [Licence](#licence)

---

## Fonctionnalités actuelles

1. **Accueil : Gestion des vêtements**  
   - Affichage de tous les habits enregistrés dans la garde-robe (nom, image, catégorie).  
   - Ajout d’un nouvel habit via un formulaire (titre, catégorie, image, etc.).  
   - Édition et suppression de chaque vêtement.

2. **Lookbook : Création et parcours d’outfits**  
   - Affichage d’une grille de toutes les tenues créées.  
   - Possibilité de créer une tenue en sélectionnant plusieurs vêtements dans la garde-robe.  
   - Affichage détaillé d’un outfit : images des habits composant la tenue.  
   - Modification et suppression d’une tenue existante.  

3. **Mix & Match (en cours de développement)**  
   - Interface modale “Mix & Match” permettant, à partir d’une photo full-body de l’utilisateur, de tester différentes combinaisons de vêtements superposés en temps réel.  
   - Carrousels par catégorie (bas, haut/robe, épaules, chapeau, lunettes, chaussures) pour parcourir les articles présents et les superposer sur la photo.

---

## Installation

1. **Pré-requis**  
   - Node.js (version 14+ recommandée)  
   - npm (ou yarn)  
   - Un navigateur moderne (Chrome, Firefox, Safari, etc.)  
   - (Optionnel) Serveur local pour le développement (Live Server, VS Code Live Share, etc.)

2. **Cloner le dépôt**  
   ```bash
   git clone https://github.com/Mansko09/GardeRobe.git
   cd "nom du dossier"

3. **Installer les dépendences**  
    L'application est une simple app front-end (HTML/CSS/JS), mais si vous utilisez un bundler ou un gestionnaire de paquets, lancez :
    npm install

    
## Configuration et utilisation

### Page d’accueil : Gérer vos vêtements

**Accéder à l’accueil :**  
Ouvrez `index.html` dans votre navigateur ou lancez le serveur local et rendez-vous à `http://localhost:xxxx`.

**Ajouter un vêtement :**  
Cliquez sur le bouton “＋” en bas à gauche.

**Remplissez le formulaire :**
- Nom du vêtement  
- Catégorie (Haut, Pantalon, Short, Jupe, Robe, Chaussures, Manteau, Veste, Chapeau, Lunettes)  
- Image (upload ou coller une URL)

**Validez le formulaire** pour enregistrer l’article dans `localStorage`.

**Modifier / Supprimer un vêtement :**  
Sur la fiche du vêtement, utilisez les icônes :
- ✏️ pour éditer  
- 🗑️ pour supprimer

Les modifications sont automatiquement synchronisées avec `localStorage`.

---

### Lookbook : Créer et enregistrer vos outfits

**Accéder au Lookbook :**  
Depuis l’accueil, cliquez sur le lien ou l’onglet “Lookbook” (ou ouvrez `lookbook.html` directement).

**Créer une nouvelle tenue :**  
Cliquez sur le bouton “＋” en bas à gauche.

1. Donnez un nom à la tenue.  
2. Sélectionnez, parmi la liste des vêtements (images affichées en grille), ceux que vous souhaitez inclure.  
3. Validez pour sauvegarder la tenue dans `localStorage`.

Chaque tenue contient :
- Un identifiant unique généré via `Date.now()`  
- Un nom (chaîne de caractères)  
- Un tableau d’IDs de vêtements (`items: [id1, id2, …]`)

**Voir / Modifier / Supprimer une tenue :**  
Dans la grille des tenues, passez la souris sur une carte pour faire apparaître les icônes :
- 👁️ **Voir** : ouvre la lightbox affichant chaque vêtement en grand  
- ✏️ **Éditer** : recharge le modal de création pour changer le nom ou la sélection  
- 🗑️ **Supprimer** : supprime définitivement la tenue de `localStorage`

**Navigation dans la lightbox :**  
Lorsque vous ouvrez un outfit en mode “Voir”, utilisez les boutons **← Précédent** et **Suivant →** pour parcourir les tenues enregistrées.

---

### Mix & Match (en cours)

**Ouvrir le modal Mix & Match :**  
Depuis le Lookbook (ou la page principale), cliquez sur le bouton “🎲” fixé en bas à gauche.

**Chargement de la photo full-body :**  
L’application récupère automatiquement la photo “full body” stockée dans `localStorage` (objet `profilePhotos` où `type === "full"`).  
Si aucune photo n’est présente, une zone vide ou un placeholder apparaît.

**Parcourir les carrousels :**  
Cadrans séparés pour :
- **Bas** (Pantalon, Short, Jupe)  
- **Haut & Robe**  
- **Épaules** (Veste, Manteau)  
- **Chapeau**  
- **Lunettes**  
- **Chaussures**

Utilisez les flèches **←** et **→** pour faire défiler les vêtements disponibles.  
Cliquez sur l’image d’un vêtement pour l’ajouter en **overlay** sur votre photo.  
Le vêtement se superpose automatiquement à la zone appropriée (torse, jambes, pieds, etc.).

**Terminer / Fermer :**  
Les habits sélectionnés restent positionnés tant que le modal est ouvert (pas de sauvegarde automatique pour l’instant).  
Cliquez sur “×” en haut à droite pour fermer le modal.

## Structure du projet

ma-garde-robe/
    ├─ index.html              # Page d’accueil : gestion des vêtements
    ├─ lookbook.html           # Page Lookbook : création de tenues + Mix & Match
    ├─ profil.html             # Page Profil : upload des photos (full body, visage, etc.)
    ├─ styles/                 # (Optionnel) Dossier pour vos fichiers CSS personnalisés
    │   └─ main.css
    ├─ scripts/
    │   ├─ profil.js           # Logique profil + stockage des photos (profilePhotos)
    │   ├─ lookbook.js         # Logique lookbook + Mix & Match
    │   └─ main.js             # (Optionnel) Code JavaScript pour la page d’accueil
    ├─ assets/
    │   └─ images/             # (Optionnel) Icônes, placeholders, etc.
    └─ README.md               # Ce fichier


### Détail des fichiers

- **`index.html`** : Affiche la liste des vêtements, formulaire d’ajout/édition.  
- **`profil.html`** : Permet à l’utilisateur d’upload ses photos (“full body”, “upper body”, “face”, etc.), stockées dans `localStorage` via `profilePhotos`.  
- **`lookbook.html`** : Contient :
  - La grille des tenues existantes  
  - Le modal de création/édition de tenue  
  - Le modal Mix & Match

---

## Technologies utilisées

- **HTML5 / CSS3** (avec [Tailwind CSS](https://tailwindcss.com) pour le style)  
- **JavaScript (ES6+)**  
- **localStorage** pour la persistance des données (vêtements, tenues, photos de profil)  
- *(À venir)* : API back-end pour la gestion des utilisateurs, l'essayage virtuel et le partage social

---

## Étapes de développement et futures évolutions

### 🔗 Réseau social (à venir)

- Système d’authentification / comptes utilisateurs  
- Fonctionnalités de “follow” : suivre d’autres utilisateurs  
- Envoi de messages privés entre utilisateurs  
- Partage de looks publics (flux d’actualité, “likes”, commentaires)  
- Possibilité de créer ou suggérer des tenues pour des amis à partir de leur propre garde-robe

### 🔍 Recherche intelligente (à venir)

- Moteur de recherche pour retrouver des tenues qui utilisent un article spécifique  
- Algorithme de suggestion de looks similaires (couleurs, styles, saisons)  
- Filtres par catégories, mots-clés, occasions (casual, travail, soirée, etc.)

### ⚙️ Optimisations / Améliorations

- Ajout d’un back-end (Node.js / Express, etc.) + base de données (MongoDB, SQLite…)  
- Meilleure gestion des images (compression, stockage cloud, CDN)  
- Responsive design avancé (mobile, tablette)  
- Notifications en temps réel (ex : lorsqu’un ami partage un look)  
- Intégration d’API externes pour enrichir les données (ex : recherche par image)

---

## Contribution

Toute contribution est la bienvenue ! Pour contribuer :

1. **Forkez ce dépôt**
2. **Créez votre branche**
   ```bash
   git checkout -b feature/ma-fonctionnalite


## Licence
Ce projet est distribué sous la licence MIT.
