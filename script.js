const form = document.getElementById("addForm");
const gardeRobe = document.getElementById("gardeRobe");

let vetements = JSON.parse(localStorage.getItem("vetements")) || [];

// 🔁 Affiche les vêtements au chargement
vetements.forEach(v => afficherVetement(v));

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const nom = document.getElementById("nom").value.trim();
  const categorie = document.getElementById("categorie").value;
  const saison = document.getElementById("Saison").value;
  const imageInput = document.getElementById("image");
  const marque = document.getElementById("marque").value.trim();
  if (!imageInput.files.length) return;

  const reader = new FileReader();
  reader.onload = function (event) {
  const vetement = {
    id: Date.now(),
    nom,
    marque,
    categorie,
    saison,
    image: event.target.result
  };

    vetements.push(vetement);
    localStorage.setItem("vetements", JSON.stringify(vetements));
    afficherVetement(vetement);
    form.reset();
  };

  reader.readAsDataURL(imageInput.files[0]);
});

function afficherVetement(vetement) {
  const card = document.createElement("div");
  card.className = "break-inside-avoid mb-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg shadow overflow-hidden p-2";

  card.innerHTML = `
    <img src="${vetement.image}" alt="${vetement.nom}" class="w-full rounded mb-2 object-cover transition-transform duration-300 hover:scale-105" />
    <h3 class="font-semibold text-lg">${vetement.nom}</h3>
    <p class="text-sm text-gray-600 dark:text-gray-300">${vetement.categorie} – ${vetement.saison}</p>
    <button onclick="supprimerVetement(${vetement.id})" class="mt-2 text-sm text-red-500 hover:underline">🗑️ Supprimer</button>
  `;

  gardeRobe.prepend(card);
}

function supprimerVetement(id) {
  vetements = vetements.filter(v => v.id !== id);
  localStorage.setItem("vetements", JSON.stringify(vetements));
  gardeRobe.innerHTML = "";
  vetements.forEach(v => afficherVetement(v));
}

// 🌙 Mode sombre persistant
const toggle = document.getElementById('toggleDark');
toggle.addEventListener('click', () => {
  document.documentElement.classList.toggle('dark');
  const isDark = document.documentElement.classList.contains('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

if (localStorage.getItem('theme') === 'dark') {
  document.documentElement.classList.add('dark');
}



