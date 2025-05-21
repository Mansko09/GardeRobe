const searchInput = document.getElementById("searchInput");
const resultats = document.getElementById("resultats");

const vetements = JSON.parse(localStorage.getItem("vetements")) || [];

function afficherResultats(query) {
  resultats.innerHTML = "";

  vetements
    .filter(v =>
      v.nom.toLowerCase().includes(query.toLowerCase()) ||
      v.categorie.toLowerCase().includes(query.toLowerCase())
    )
    .forEach(v => {
      const card = document.createElement("div");
      card.className = "vetement";
      card.innerHTML = `
        <img src="${v.image}" alt="${v.nom}">
        <h3>${v.nom}</h3>
        <p>${v.categorie}</p>
      `;
      resultats.appendChild(card);
    });
}


afficherResultats("");

searchInput.addEventListener("input", () => {
  afficherResultats(searchInput.value);
});

  const toggle = document.getElementById('toggleDark');
  toggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    // Sauvegarde le thème
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });

  // Au chargement, on applique le thème stocké
  if (localStorage.getItem('theme') === 'dark') {
    document.documentElement.classList.add('dark');
  }