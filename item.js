document.addEventListener("DOMContentLoaded", () => {
  const params   = new URLSearchParams(window.location.search);
  const id       = Number(params.get("id"));
  const detailEl = document.getElementById("itemDetail");
  let vetements  = JSON.parse(localStorage.getItem("vetements")) || [];

  // Trouve l'item à afficher
  const item = vetements.find(v => v.id === id);
  if (!item) {
    detailEl.innerHTML = "<p class='text-center text-red-500'>Élément introuvable.</p>";
    return;
  }

  // Rend le détail complet
  function renderDetail(v) {
    detailEl.innerHTML = `
      <img src="${v.image}" alt="${v.reference}"
           class="w-full rounded shadow mb-4 object-contain max-h-96" />
      <h2 class="text-2xl font-bold">${v.reference}</h2>
      <p class="text-sm text-gray-600 dark:text-gray-300">
        Marque     : <strong>${v.marque}</strong>
      </p>
      <p class="text-sm text-gray-600 dark:text-gray-300">
        Catégorie  : <strong>${v.categorie}</strong>
      </p>
      <p class="text-sm text-gray-600 dark:text-gray-300">
        Saison     : <strong>${v.saison}</strong>
      </p>
      <p class="text-sm text-gray-600 dark:text-gray-300">
        Couleur    : 
        <span class="inline-block w-4 h-4 rounded-full mr-1"
              style="background-color:${v.color}"></span>
        <strong>${v.color}</strong>
      </p>
      <p class="text-sm text-gray-600 dark:text-gray-300">
        Matériau   : <strong>${v.material}</strong>
      </p>
      <p class="text-sm text-gray-600 dark:text-gray-300">
        Lavage     : <strong>${v.washType}</strong>
      </p>
      <p class="text-sm text-gray-600 dark:text-gray-300">
        Séchage    : <strong>${v.dryType}</strong>
      </p>
      <div class="flex gap-2 mt-6">
        <button id="editBtn"
          class="flex-1 bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600 transition">
          ✏️ Modifier
        </button>
        <button id="deleteBtn"
          class="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition">
          🗑️ Supprimer
        </button>
      </div>
    `;

    // Supprimer
    document.getElementById("deleteBtn").addEventListener("click", () => {
      if (confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
        vetements = vetements.filter(x => x.id !== id);
        localStorage.setItem("vetements", JSON.stringify(vetements));
        window.location.href = "index.html";
      }
    });

    // Modifier
    document.getElementById("editBtn").addEventListener("click", () => {
      showEditForm(v);
    });
  }

  // Affiche le formulaire d'édition
  function showEditForm(v) {
    detailEl.innerHTML = `
      <form id="editForm" class="space-y-4">

        <!-- Référence -->
        <div>
          <label class="block text-sm font-medium">Référence</label>
          <input type="text" id="editReference" value="${v.reference}"
            class="w-full p-2 border rounded dark:bg-gray-800 dark:text-white" required>
        </div>

        <!-- Marque -->
        <div>
          <label class="block text-sm font-medium">Marque</label>
          <input type="text" id="editMarque" value="${v.marque}"
            class="w-full p-2 border rounded dark:bg-gray-800 dark:text-white">
        </div>

        <!-- Catégorie & Saison -->
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-sm font-medium">Catégorie</label>
            <select id="editCategorie"
              class="w-full p-2 border rounded dark:bg-gray-800 dark:text-white">
              <option ${v.categorie==="Haut"       ? "selected":""}>Haut</option>
              <option ${v.categorie==="Pantalon"        ? "selected":""}>Pantalon</option>
              <option ${v.categorie==="Short"        ? "selected":""}>Short</option>
              <option ${v.categorie==="Jupe"        ? "selected":""}>Jupe</option>
              <option ${v.categorie==="Robe"       ? "selected":""}>Robe</option>
              <option ${v.categorie==="Veste"        ? "selected":""}>Veste</option>
              <option ${v.categorie==="Manteau"        ? "selected":""}>Manteau</option>
              <option ${v.categorie==="Chaussures" ? "selected":""}>Chaussures</option>
              <option ${v.categorie==="Chapeau" ? "selected":""}>Chapeau</option>
              <option ${v.categorie==="Lunettes"        ? "selected":""}>Lunettes</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium">Saison</label>
            <select id="editSaison"
              class="w-full p-2 border rounded dark:bg-gray-800 dark:text-white">
              <option ${v.saison==="Été"          ? "selected":""}>Été</option>
              <option ${v.saison==="Automne"      ? "selected":""}>Automne</option>
              <option ${v.saison==="Hiver"        ? "selected":""}>Hiver</option>
              <option ${v.saison==="Printemps"    ? "selected":""}>Printemps</option>
              <option ${v.saison==="Inter-saison" ? "selected":""}>Inter-saison</option>
            </select>
          </div>
        </div>

        <!-- Couleur -->
        <div>
          <label class="block text-sm font-medium">Couleur</label>
          <input type="color" id="editColor" value="${v.color}"
            class="w-full h-10 p-0 border-0 rounded">
        </div>

        <!-- Matériau -->
        <div>
          <label class="block text-sm font-medium">Matériau</label>
          <select id="editMaterial"
            class="w-full p-2 border rounded dark:bg-gray-800 dark:text-white">
            <option ${v.material==="Coton"     ? "selected":""}>Coton</option>
            <option ${v.material==="Polyester" ? "selected":""}>Polyester</option>
            <option ${v.material==="Nylon"     ? "selected":""}>Nylon</option>
            <option ${v.material==="Laine"     ? "selected":""}>Laine</option>
            <option ${v.material==="Denim"     ? "selected":""}>Denim</option>
            <option ${v.material==="Autre"     ? "selected":""}>Autre</option>
          </select>
        </div>

        <!-- Lavage & Séchage -->
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-sm font-medium">Lavage</label>
            <select id="editWashType"
              class="w-full p-2 border rounded dark:bg-gray-800 dark:text-white">
              <option ${v.washType==="Cycle doux à froid (30°)"   ? "selected":""}>
                Cycle doux à froid (30°)
              </option>
              <option ${v.washType==="Cycle normal à froid (30°)" ? "selected":""}>
                Cycle normal à froid (30°)
              </option>
              <option ${v.washType==="Cycle doux à chaud (40°)"   ? "selected":""}>
                Cycle doux à chaud (40°)
              </option>
              <option ${v.washType==="Cycle normal à chaud (40°)" ? "selected":""}>
                Cycle normal à chaud (40°)
              </option>
              <option ${v.washType==="Nettoyage à sec"            ? "selected":""}>
                Nettoyage à sec
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium">Séchage</label>
            <select id="editDryType"
              class="w-full p-2 border rounded dark:bg-gray-800 dark:text-white">
              <option ${v.dryType==="Séchage à l'air"     ? "selected":""}>Séchage à l'air</option>
              <option ${v.dryType==="Sèche-linge doux"    ? "selected":""}>Sèche-linge doux</option>
              <option ${v.dryType==="Sèche-linge normal"  ? "selected":""}>Sèche-linge normal</option>
            </select>
          </div>
        </div>

        <!-- Changer l'image -->
        <div>
          <label class="block text-sm font-medium">Changer l’image</label>
          <input type="file" id="editImage" accept="image/*"
            class="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"/>
        </div>

        <!-- Boutons -->
        <div class="flex gap-2">
          <button type="submit"
            class="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600 transition">
            💾 Enregistrer
          </button>
          <button type="button" id="cancelBtn"
            class="flex-1 bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400 transition">
            ❌ Annuler
          </button>
        </div>
      </form>
    `;

    // Annuler l'édition
    document.getElementById("cancelBtn").addEventListener("click", () => {
      renderDetail(v);
    });

    // Soumettre l'édition
    document.getElementById("editForm").addEventListener("submit", e => {
      e.preventDefault();

      // Récupère les nouvelles valeurs
      const newReference = document.getElementById("editReference").value.trim();
      const newMarque    = document.getElementById("editMarque").value.trim();
      const newCategorie = document.getElementById("editCategorie").value;
      const newSaison    = document.getElementById("editSaison").value;
      const newColor     = document.getElementById("editColor").value;
      const newMaterial  = document.getElementById("editMaterial").value;
      const newWashType  = document.getElementById("editWashType").value;
      const newDryType   = document.getElementById("editDryType").value;
      const fileInput    = document.getElementById("editImage");

      // Applique les changements (avec ou sans nouvelle image)
      function applyChanges(imageData) {
        v.reference = newReference;
        v.marque    = newMarque;
        v.categorie = newCategorie;
        v.saison    = newSaison;
        v.color     = newColor;
        v.material  = newMaterial;
        v.washType  = newWashType;
        v.dryType   = newDryType;
        v.image     = imageData;
        localStorage.setItem("vetements", JSON.stringify(vetements));
        renderDetail(v);
      }

      if (fileInput.files.length) {
        const reader = new FileReader();
        reader.onload = evt => applyChanges(evt.target.result);
        reader.readAsDataURL(fileInput.files[0]);
      } else {
        applyChanges(v.image);
      }
    });
  }

  // Affiche initialement le détail
  renderDetail(item);
});
