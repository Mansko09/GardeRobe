document.addEventListener("DOMContentLoaded", () => {
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
