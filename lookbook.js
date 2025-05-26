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
});