document.addEventListener("DOMContentLoaded", () => {
  const lookGrid = document.getElementById("lookGrid");
  const vetements = JSON.parse(localStorage.getItem("vetements")) || [];
  let looks = JSON.parse(localStorage.getItem("looks")) || [];

  // Render des tenues
  function renderLooks() {
    lookGrid.innerHTML = "";
    if (looks.length === 0) {
      lookGrid.innerHTML = 
        `<p class="text-center text-gray-500">Aucune tenue créée.</p>`;
      return;
    }
    looks.forEach(look => {
      const wrapper = document.createElement("div");
      wrapper.className = "inline-block w-full mb-4";

      const card = document.createElement("div");
      card.className = [
        "relative break-inside-avoid",
        "bg-white dark:bg-gray-800 text-gray-800 dark:text-white",
        "rounded-lg shadow-sm overflow-hidden p-2"
      ].join(" ");

      // Miniatures cliquables – on enveloppe chaque img dans un <a>
        const thumbs = look.items.map(id => {
            const v = vetements.find(x => x.id === id);
            return `
            <a href="item.html?id=${v.id}" class="block mb-1">
                <img src="${v.image}" 
                    alt="${v.reference}" 
                    class="w-full h-24 object-cover rounded"/>
            </a>`;
        }).join("");
      card.innerHTML = `
        <h3 class="font-semibold mb-2">${look.name}</h3>
        ${thumbs}
        <button data-id="${look.id}"
                class="mt-2 text-sm text-red-500 hover:underline">
          🗑️ Supprimer
        </button>
      `;

      // Supprimer la tenue
      card.querySelector("button[data-id]").addEventListener("click", () => {
        if (!confirm("Supprimer cette tenue ?")) return;
        looks = looks.filter(l => l.id !== look.id);
        localStorage.setItem("looks", JSON.stringify(looks));
        renderLooks();
      });

      wrapper.appendChild(card);
      lookGrid.appendChild(wrapper);
    });
  }

  // Modal création
  const openBtn = document.getElementById("openAddLookModal");
  const closeBtn = document.getElementById("closeAddLookModal");
  const modal = document.getElementById("addLookModal");
  const form = document.getElementById("addLookForm");
  const list = document.getElementById("lookItemList");

  function openModal() {
    modal.classList.remove("hidden");
    list.innerHTML = "";
    vetements.forEach(v => {
      const label = document.createElement("label");
      label.className = "flex items-center space-x-2";
      label.innerHTML = `
        <input type="checkbox" value="${v.id}" class="form-checkbox text-blue-500"/>
        <img src="${v.image}" class="w-10 h-10 object-cover rounded"/>
        <span class="text-xs">${v.reference}</span>
      `;
      list.appendChild(label);
    });
  }
  function closeModal() {
    modal.classList.add("hidden");
    form.reset();
  }

  openBtn.addEventListener("click", openModal);
  closeBtn.addEventListener("click", closeModal);

  form.addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("lookName").value.trim();
    const checked = [...list.querySelectorAll("input[type=checkbox]:checked")]
                    .map(cb => Number(cb.value));
    if (!name || checked.length === 0) {
      return alert("Donnez un nom et sélectionnez au moins un vêtement.");
    }
    looks.push({ id: Date.now(), name, items: checked });
    localStorage.setItem("looks", JSON.stringify(looks));
    closeModal();
    renderLooks();
  });

  // Initial render
  renderLooks();
});
