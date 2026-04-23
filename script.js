(function () {
  const form = document.querySelector("form");
  if (!form) return;

  const emailInput = form.querySelector('input[type="email"]');
  const passwordInput = form.querySelector('input[type="password"]');
  const ingresoMensaje = document.getElementById("ingresoMensaje");
  const submitButton = form.querySelector('button[type="submit"]');

  const users = [
    { user: "user1@sportclub.cl", password: "1234", role: "user", name: "Usuario 1" },
    { user: "user2@sportclub.cl", password: "1234", role: "user", name: "Usuario 2" },
    { user: "coach1@sportclub.cl", password: "1234", role: "coach", name: "Coach 1" },
    { user: "coach2@sportclub.cl", password: "1234", role: "coach", name: "Coach 2" },
    { user: "admin1@sportclub.cl", password: "1234", role: "admin", name: "Admin 1" },
    { user: "admin2@sportclub.cl", password: "1234", role: "admin", name: "Admin 2" },
  ];

  const roleToDashboard = {
    user: "user-dashboard.html",
    coach: "coach-dashboard.html",
    admin: "admin-dashboard.html",
  };

  function showMessage(text, type) {
    if (!ingresoMensaje) return;
    ingresoMensaje.textContent = text;
    ingresoMensaje.classList.add("visible");

    // Reutilizamos el mismo contenedor cambiando el estilo en línea.
    if (type === "error") {
      ingresoMensaje.style.borderColor = "rgba(239, 68, 68, 0.45)";
      ingresoMensaje.style.background = "rgba(239, 68, 68, 0.12)";
      ingresoMensaje.style.color = "#fca5a5";
    } else {
      ingresoMensaje.style.borderColor = "rgba(52, 211, 153, 0.35)";
      ingresoMensaje.style.background = "rgba(16, 185, 129, 0.12)";
      ingresoMensaje.style.color = "#34d399";
    }
  }

  function normalizeEmail(value) {
    return String(value || "").trim().toLowerCase();
  }

  // Si ya hay usuario logueado, redirige a su dashboard.
  const stored = localStorage.getItem("user");
  if (stored) {
    try {
      const existingUser = JSON.parse(stored);
      const next = existingUser?.role ? roleToDashboard[existingUser.role] : null;
      if (next) window.location.href = next;
    } catch {
      localStorage.removeItem("user");
    }
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = normalizeEmail(emailInput?.value);
    const password = String(passwordInput?.value || "");

    if (!email || !password) {
      showMessage("No se pudo acceder al sitio", "error");
      return;
    }

    const match = users.find((u) => normalizeEmail(u.user) === email && u.password === password);
    if (!match) {
      showMessage("No se pudo acceder al sitio", "error");
      return;
    }

    const sessionUser = { user: match.user.trim(), role: match.role, name: match.name };
    localStorage.setItem("user", JSON.stringify(sessionUser));

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Ingresando...";
    }

    const next = roleToDashboard[match.role] || "index.html";
    window.location.href = next;
  });
})();
