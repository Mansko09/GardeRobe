document.addEventListener("DOMContentLoaded", () => {
  const lookGrid = document.getElementById("lookGrid");
  const vetements = JSON.parse(localStorage.getItem("vetements")) || [];
  let looks = JSON.parse(localStorage.getItem("looks")) || [];
  let currentIndex = 0;

  // Render les looks
  function renderLooks() {
    lookGrid.innerHTML = "";
    if (looks.length === 0) {
      lookGrid.innerHTML = `<p class="col-span-full text-center text-gray-500">Aucune tenue créée.</p>`;
      return;
    }
    looks.forEach((look, idx) => {
      const card = document.createElement("div");
      card.className = "relative bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer";
      card.innerHTML = `
        <div class="grid grid-cols-2 grid-rows-2 gap-1">
          ${look.items.slice(0,4).map(id => {
            const v = vetements.find(x=>x.id===id) || {};
            return `<img src="${v.image}" alt="${v.reference||''}" class="w-full h-full object-cover aspect-[3/4]"/>`;
          }).join("")}
        </div>
        <div class="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-40 transition flex items-end">
          <div class="w-full p-2 opacity-0 hover:opacity-100 transition text-white">
            <h3 class="font-semibold">${look.name}</h3>
            <div class="mt-1 flex justify-between text-sm">
              <button data-action="view" data-idx="${idx}">👁️ Voir</button>
              <button data-action="edit" data-id="${look.id}" data-idx="${idx}">✏️ Éditer</button>
              <button data-action="delete" data-id="${look.id}">🗑️</button>
            </div>
          </div>
        </div>
      `;
      // Événements
      card.querySelector("[data-action=view]").addEventListener("click", e => {
        e.stopPropagation(); openLightbox(idx);
      });
      card.querySelector("[data-action=edit]").addEventListener("click", e => {
        e.stopPropagation(); openAddEditModal(looks[idx]);
      });
      card.querySelector("[data-action=delete]").addEventListener("click", e => {
        e.stopPropagation();
        if (!confirm("Supprimer cette tenue ?")) return;
        looks = looks.filter(l=>l.id !== +e.currentTarget.dataset.id);
        localStorage.setItem("looks", JSON.stringify(looks));
        renderLooks();
      });
      lookGrid.appendChild(card);
    });
  }

  // Lightbox identique
  const viewModal = document.getElementById("viewLookModal");
  const viewGrid  = document.getElementById("viewLookGrid");
  document.getElementById("closeViewLook").onclick = () => viewModal.classList.add("hidden");
  document.getElementById("prevLook").onclick  = () => openLightbox((currentIndex-1+looks.length)%looks.length);
  document.getElementById("nextLook").onclick  = () => openLightbox((currentIndex+1)%looks.length);
  function openLightbox(idx) {
    currentIndex = idx;
    const look = looks[idx];
    viewGrid.innerHTML = look.items.map(id => {
      const v = vetements.find(x=>x.id===id) || {};
      return `<img src="${v.image}" alt="${v.reference||''}" class="w-full h-auto object-contain"/>`;
    }).join("");
    viewModal.classList.remove("hidden");
  }

  // Modal création/édition
  const openBtn = document.getElementById("openAddLookModal");
  const closeBtn = document.getElementById("closeAddEditModal");
  const modal    = document.getElementById("addEditLookModal");
  const form     = document.getElementById("addEditLookForm");
  const list     = document.getElementById("lookItemList");
  const titleEl  = document.getElementById("modalTitle");
  const editIdEl = document.getElementById("editLookId");

  function openAddEditModal(look) {
    // si look passé, on est en édition
    const isEdit = !!look;
    titleEl.textContent = isEdit ? "Édition tenue" : "Nouvelle tenue";
    editIdEl.value = isEdit ? look.id : '';
    form.lookName.value = isEdit ? look.name : '';
    list.innerHTML = '';
    vetements.forEach(v => {
      const lbl = document.createElement("label");
      lbl.className = "relative cursor-pointer";
      const checked = isEdit && look.items.includes(v.id) ? 'checked' : '';
      lbl.innerHTML = `
        <input type="checkbox" value="${v.id}" class="sr-only peer" ${checked}/>
        <img src="${v.image}" alt="" class="w-full h-24 object-cover rounded peer-checked:ring-4 peer-checked:ring-green-400"/>
        <span class="absolute top-1 right-1 text-white bg-green-500 rounded-full p-1 opacity-0 peer-checked:opacity-100">✓</span>
      `;
      list.append(lbl);
    });
    modal.classList.remove("hidden");
  }

  openBtn.addEventListener("click", () => openAddEditModal());
  closeBtn.addEventListener("click", () => modal.classList.add("hidden"));

  form.addEventListener("submit", e => {
    e.preventDefault();
    const name = form.lookName.value.trim();
    const checked = Array.from(list.querySelectorAll("input:checked")).map(i=>+i.value);
    if (!name || !checked.length) {
      return alert("Donnez un nom et sélectionnez au moins un vêtement.");
    }
    const existingId = editIdEl.value;
    if (existingId) {
      // mise à jour
      looks = looks.map(l => l.id === +existingId ? { ...l, name, items: checked } : l);
    } else {
      // création
      looks.push({ id: Date.now(), name, items: checked });
    }
    localStorage.setItem("looks", JSON.stringify(looks));
    modal.classList.add("hidden");
    form.reset();
    renderLooks();
  });

  renderLooks();


  /* ------------------------------------------------------------ */
  /* ----------- DÉBUT DE LA PARTIE Mix & Match ----------------- */
  /* ------------------------------------------------------------ */

  // 1) Références aux éléments du modal Mix & Match
  const openMixBtn   = document.getElementById("openMixModal");
  const mixModal     = document.getElementById("mixMatchModal");
  const closeMixBtn  = document.getElementById("closeMixModal");
  const mixContainer = document.getElementById("mixContainer");
  const fullBodyImg  = document.getElementById("mixFullBody");

  // 2) Définir, pour chaque groupe, les catégories correspondantes
  //    et initialiser un index pour le carousel
  const groups = {
    bas:       { categories: ["Pantalon","Short","Jupe"],       index: 0, carouselEl: document.getElementById("basCarousel") },
    haut:      { categories: ["Haut","Robe"],                   index: 0, carouselEl: document.getElementById("hautCarousel") },
    epaules:   { categories: ["Veste","Manteau"],               index: 0, carouselEl: document.getElementById("epaulesCarousel") },
    chapeau:   { categories: ["Chapeau"],                       index: 0, carouselEl: document.getElementById("chapeauCarousel") },
    lunettes:  { categories: ["Lunettes"],                      index: 0, carouselEl: document.getElementById("lunettesCarousel") },
    chaussures:{ categories: ["Chaussures"],                    index: 0, carouselEl: document.getElementById("chaussuresCarousel") }
  };

  // 3) Extraire, pour chaque groupe, la liste filtrée de vêtements
  const itemsByGroup = {};
  for (let grp in groups) {
    itemsByGroup[grp] = vetements.filter(v => groups[grp].categories.includes(v.categorie));
  }

  // 4) Fonction pour afficher l’item courant dans chaque carousel
  function renderCarouselItem(groupKey) {
    const grpObj = groups[groupKey];
    const listItems = itemsByGroup[groupKey];
    if (!listItems || listItems.length === 0) {
      // Si pas d'items dans ce groupe, on affiche une image "vide" (ou on cache)
      grpObj.carouselEl.src = "";
      grpObj.carouselEl.alt = "Aucun élément";
      return;
    }
    // On s'assure que l'index boucle sur la longueur
    grpObj.index = ((grpObj.index % listItems.length) + listItems.length) % listItems.length;
    const current = listItems[grpObj.index];
    grpObj.carouselEl.src = current.image;
    grpObj.carouselEl.alt = current.reference || "";
    // On ajoute un attribut data-id pour récupérer facilement l'ID au clic
    grpObj.carouselEl.setAttribute("data-id", current.id);
  }

  // 5) Initialisation de tous les carousels au chargement
  for (let key in groups) {
    renderCarouselItem(key);
  }

  // 6) Ouvrir / Fermer le modal Mix & Match
  openMixBtn.addEventListener("click", () => {
    // 1) Lire le tableau profilePhotos
    const storedPhotos = JSON.parse(localStorage.getItem("profilePhotos")) || [];
    // 2) Trouver l’objet { type:"full", data:… }
    const fullObj = storedPhotos.find(p => p.type === "full");
    // 3) Mettre à jour la source
    if (fullObj && fullObj.data) {
      fullBodyImg.src = fullObj.data;
    } else {
      fullBodyImg.src = ""; // ou placeholder si aucune full body n'a encore été uploadée
    }
    // 4) Nettoyer d’éventuels overlays précédents
    document.querySelectorAll("#mixContainer img[class^='overlay-']").forEach(el => el.remove());
    // 5) Afficher le modal
    mixModal.classList.remove("hidden");
  });

  closeMixBtn.addEventListener("click", () => {
    mixModal.classList.add("hidden");
  });

  // 7) Gestion des flèches “Précédent” / “Suivant”
  document.querySelectorAll(".prev-btn, .next-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      const grpKey = e.currentTarget.getAttribute("data-group");
      if (!grpKey) return;
      // Si clic sur “prev-btn”, on décrémente, sinon on incrémente
      if (e.currentTarget.classList.contains("prev-btn")) {
        groups[grpKey].index--;
      } else {
        groups[grpKey].index++;
      }
      renderCarouselItem(grpKey);
    });
  });

  // 8) Lorsque l’utilisateur clique sur une image de carousel : on ajoute l’overlay
  //    sur la zone “mixContainer” et on remplace l’existant pour ce groupe.
  Object.keys(groups).forEach(grpKey => {
    const imgEl = groups[grpKey].carouselEl;
    imgEl.addEventListener("click", () => {
      const selectedId = +imgEl.getAttribute("data-id");
      const selectedV = vetements.find(v => v.id === selectedId);
      if (!selectedV) return;

      // Si un overlay pour ce groupe existe déjà, on le supprime
      const existingOverlay = mixContainer.querySelector(`.overlay-${grpKey}`);
      if (existingOverlay) existingOverlay.remove();

      // On crée un nouvel <img> overlay
      const overlay = document.createElement("img");
      overlay.src = selectedV.image;
      overlay.classList.add(`overlay-${grpKey}`, "absolute");
      overlay.alt = selectedV.reference || "";

      // On applique une position selon le groupe
      switch (grpKey) {
        case "bas":
          // Positionné au niveau des jambes
          overlay.classList.add("w-1/2", "left-1/2", "transform", "-translate-x-1/2", "bottom-0");
          break;
        case "haut":
          // Positionné au niveau du torse
          overlay.classList.add("w-1/2", "left-1/2", "transform", "-translate-x-1/2", "top-1/3");
          break;
        case "epaules":
          // Positionné au niveau des épaules
          overlay.classList.add("w-1/2", "left-1/2", "transform", "-translate-x-1/2", "top-[28%]");
          break;
        case "chapeau":
          // Positionné sur la tête
          overlay.classList.add("w-1/4", "left-1/2", "transform", "-translate-x-1/2", "top-0");
          break;
        case "lunettes":
          // Positionné au niveau des yeux
          overlay.classList.add("w-1/4", "left-1/2", "transform", "-translate-x-1/2", "top-[22%]");
          break;
        case "chaussures":
          // Positionné au niveau des pieds
          overlay.classList.add("w-1/3", "left-1/2", "transform", "-translate-x-1/2", "bottom-0");
          break;
        default:
          break;
      }

      // On ajoute l'overlay au container principal
      mixContainer.appendChild(overlay);
    });
  });

  /* ------------------------------------------------------------ */
  /* ------------ FIN DE LA PARTIE Mix & Match ----------------- */
  /* ------------------------------------------------------------ */
});
