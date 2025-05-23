document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("searchInput");
  const results = document.getElementById("searchResults");

  const data = [
    { type: "utilisateur", name: "emma.style" },
    { type: "utilisateur", name: "lucas.fit" },
    { type: "marque", name: "Zara" },
    { type: "marque", name: "Nike" },
    { type: "vêtement", name: "Robe d'été fleurie" },
    { type: "vêtement", name: "Blouson en cuir" },
  ];

  input.addEventListener("input", () => {
    const q = input.value.toLowerCase();
    results.innerHTML = "";

    const filtered = data.filter(item => item.name.toLowerCase().includes(q));
    if (filtered.length === 0) {
      results.innerHTML = `<p class="text-center text-sm text-gray-500">Aucun résultat</p>`;
      return;
    }

    filtered.forEach(item => {
      const div = document.createElement("div");
      div.className = "p-3 bg-white dark:bg-gray-800 rounded shadow flex justify-between";
      div.innerHTML = `
        <span class="capitalize">${item.name}</span>
        <span class="text-xs text-gray-500">${item.type}</span>
      `;
      results.appendChild(div);
    });
  });

  // thème si défini
  if (localStorage.getItem("theme") === "dark") {
    document.documentElement.classList.add("dark");
  }
});
