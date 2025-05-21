const total = document.getElementById("total");

const vetements = JSON.parse(localStorage.getItem("vetements")) || [];

total.textContent = `👕 Tu as ${vetements.length} vêtement(s) enregistré(s).`;
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