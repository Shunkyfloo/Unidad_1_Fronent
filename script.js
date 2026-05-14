(function () {
  const form = document.querySelector("form");
  if (!form) return;

  const emailInput = form.querySelector('input[type="email"]');
  const passwordInput = form.querySelector('input[type="password"]');
  const ingresoMensaje = document.getElementById("ingresoMensaje");
  const submitButton = form.querySelector('button[type="submit"]');

  const roleToDashboard = {
    user: "user-dashboard.html",
    coach: "coach-dashboard.html",
    admin: "admin-dashboard.html",
  };

  function showMessage(text, type) {
    if (!ingresoMensaje) return;
    ingresoMensaje.textContent = text;
    ingresoMensaje.classList.add("visible");

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

  var existing = ClubAPI.getSession();
  if (existing && existing.token && existing.user && existing.user.role) {
    var nextDash = roleToDashboard[existing.user.role];
    if (nextDash) window.location.href = nextDash;
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = normalizeEmail(emailInput && emailInput.value);
    const password = String((passwordInput && passwordInput.value) || "");

    if (!email || !password) {
      showMessage("Ingresa correo y contraseña.", "error");
      return;
    }

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Ingresando...";
    }

    try {
      const res = await ClubAPI.apiJson("/api/auth/login", {
        method: "POST",
        skipAuth: true,
        body: { email: email, password: password },
      });

      if (!res.ok || !res.data || !res.data.token || !res.data.user) {
        showMessage("No se pudo acceder al sitio", "error");
        return;
      }

      ClubAPI.setSession(res.data.token, res.data.user);
      showMessage("Ingreso correcto. Redirigiendo…", "success");

      const role = res.data.user.role;
      const next = roleToDashboard[role] || "index.html";
      window.location.href = next;
    } catch (err) {
      var msg = "No se pudo acceder al sitio";
      if (err && err.data && err.data.errors) {
        var parts = Object.values(err.data.errors).filter(Boolean);
        if (parts.length) msg = parts.join(" ");
      } else if (err && err.message) {
        msg = err.message;
      }
      showMessage(msg, "error");
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Ingresar";
      }
    }
  });
})();
