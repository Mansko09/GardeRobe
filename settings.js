document.addEventListener("DOMContentLoaded", () => {
    // 👤 Gestion du Nom d’utilisateur et du Pseudo
  const displayNameInput = document.getElementById("displayName");
  const pseudoInput      = document.getElementById("pseudo");

  // Charge les valeurs existantes
  if (displayNameInput) {
    displayNameInput.value = localStorage.getItem("displayName") || "";
    displayNameInput.addEventListener("input", e => {
      localStorage.setItem("displayName", e.target.value);
    });
  }

  if (pseudoInput) {
    pseudoInput.value = localStorage.getItem("pseudo") || "";
    pseudoInput.addEventListener("input", e => {
      localStorage.setItem("pseudo", e.target.value);
    });
  }
  // — Gestion du compte public / privé —
  const accountPublicCheckbox = document.getElementById("accountPublic");
  // Charger la valeur (true par défaut)
  const isPublic = localStorage.getItem("accountPublic");
  accountPublicCheckbox.checked = isPublic === null ? true : isPublic === "true";
  accountPublicCheckbox.addEventListener("change", e => {
    localStorage.setItem("accountPublic", e.target.checked);
     });
  // 👤 Fin de la gestion du compte
  
  const lightBtn = document.getElementById("lightMode");
  const darkBtn = document.getElementById("darkMode");
  const fontSizeSelect = document.getElementById("fontSize");
  const mainColorInput = document.getElementById("mainColor");

  // 🌙 Thème
  if (lightBtn) {
    lightBtn.addEventListener("click", () => {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    });
  }

  if (darkBtn) {
    darkBtn.addEventListener("click", () => {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    });
  }

  // 🌓 Appliquer le thème au chargement
  if (localStorage.getItem("theme") === "dark") {
    document.documentElement.classList.add("dark");
  }

  // 🔠 Taille de police
  if (fontSizeSelect) {
    fontSizeSelect.addEventListener("change", (e) => {
      const size = e.target.value;
      document.body.classList.remove("text-sm", "text-base", "text-lg");
      document.body.classList.add(size);
      localStorage.setItem("fontSize", size);
    });

    // Appliquer au chargement
    const savedSize = localStorage.getItem("fontSize");
    if (savedSize) {
      document.body.classList.add(savedSize);
      fontSizeSelect.value = savedSize;
    }
  }

  // 🎨 Couleur principale
  if (mainColorInput) {
    mainColorInput.addEventListener("input", (e) => {
      const color = e.target.value;
      document.documentElement.style.setProperty("--main-color", color);
      localStorage.setItem("mainColor", color);
    });

    // Appliquer au chargement
    const savedColor = localStorage.getItem("mainColor");
    if (savedColor) {
      document.documentElement.style.setProperty("--main-color", savedColor);
      mainColorInput.value = savedColor;
    }
  }
});
