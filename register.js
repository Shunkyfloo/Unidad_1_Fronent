(function () {
  const form = document.getElementById("registerForm");
  const msgEl = document.getElementById("registerMensaje");
  const submitBtn = form && form.querySelector('button[type="submit"]');

  if (!form) return;

  function showMessage(text, type) {
    if (!msgEl) return;
    msgEl.textContent = text;
    msgEl.classList.add("visible");
    if (type === "error") {
      msgEl.style.borderColor = "rgba(239, 68, 68, 0.45)";
      msgEl.style.background = "rgba(239, 68, 68, 0.12)";
      msgEl.style.color = "#fca5a5";
    } else {
      msgEl.style.borderColor = "rgba(52, 211, 153, 0.35)";
      msgEl.style.background = "rgba(16, 185, 129, 0.12)";
      msgEl.style.color = "#34d399";
    }
  }

  function clearFieldErrors() {
    form.querySelectorAll(".field-error").forEach(function (el) {
      el.textContent = "";
    });
  }

  function setFieldError(id, text) {
    var el = document.getElementById(id);
    if (el) el.textContent = text || "";
  }

  function normalizeEmail(v) {
    return String(v || "").trim().toLowerCase();
  }

  function hasLetterAndDigit(pw) {
    return /[a-zA-Z]/.test(pw) && /\d/.test(pw);
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    clearFieldErrors();
    if (msgEl) {
      msgEl.textContent = "";
      msgEl.classList.remove("visible");
    }

    var fullName = String((document.getElementById("fullName") || {}).value || "").trim();
    var email = normalizeEmail((document.getElementById("email") || {}).value);
    var password = String((document.getElementById("password") || {}).value || "");
    var password2 = String((document.getElementById("password2") || {}).value || "");
    var birthInput = document.getElementById("birthDate");
    var birthRaw = birthInput && birthInput.value ? String(birthInput.value).trim() : "";

    var ok = true;
    if (!fullName) {
      setFieldError("errFullName", "El nombre completo es obligatorio.");
      ok = false;
    } else if (fullName.length < 3) {
      setFieldError("errFullName", "Mínimo 3 caracteres.");
      ok = false;
    }

    if (!email) {
      setFieldError("errEmail", "El correo es obligatorio.");
      ok = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFieldError("errEmail", "Correo no válido.");
      ok = false;
    }

    if (!password) {
      setFieldError("errPassword", "La contraseña es obligatoria.");
      ok = false;
    } else if (password.length < 8) {
      setFieldError("errPassword", "Mínimo 8 caracteres.");
      ok = false;
    } else if (!hasLetterAndDigit(password)) {
      setFieldError("errPassword", "Debe incluir letras y números.");
      ok = false;
    }

    if (password !== password2) {
      setFieldError("errPassword2", "Las contraseñas no coinciden.");
      ok = false;
    }

    if (!ok) {
      showMessage("Revisa los campos marcados.", "error");
      return;
    }

    var payload = {
      full_name: fullName,
      email: email,
      password: password,
    };
    if (birthRaw) payload.birth_date = birthRaw;

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Registrando...";
    }

    try {
      await ClubAPI.apiJson("/api/auth/register", {
        method: "POST",
        skipAuth: true,
        body: payload,
      });
      showMessage("Cuenta creada. Serás redirigido al inicio de sesión.", "success");
      setTimeout(function () {
        window.location.href = "index.html";
      }, 1200);
    } catch (err) {
      var msg = "No fue posible completar el registro.";
      if (err && err.message && err.status === 0) {
        msg = err.message;
      }
      if (err && err.data) {
        if (err.data.errors && typeof err.data.errors === "object") {
          var errs = err.data.errors;
          if (errs.full_name) setFieldError("errFullName", errs.full_name);
          if (errs.email) setFieldError("errEmail", errs.email);
          if (errs.password) setFieldError("errPassword", errs.password);
          if (errs.birth_date) setFieldError("errBirthDate", errs.birth_date);
        }
        if (err.data.message) msg = err.data.message;
      }
      if (err && err.status === 409) {
        msg = err.data && err.data.message ? err.data.message : "Ese correo ya está registrado. Usa otro email o inicia sesión.";
        setFieldError("errEmail", "Correo ya registrado.");
      }
      showMessage(msg, "error");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Registrarse";
      }
    }
  });
})();
