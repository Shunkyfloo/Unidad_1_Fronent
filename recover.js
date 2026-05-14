(function () {
  var stepEmail = document.getElementById("stepEmail");
  var stepPassword = document.getElementById("stepPassword");
  var stepDone = document.getElementById("stepDone");
  var recoverMsg = document.getElementById("recoverMsg");
  var hiddenEmail = document.getElementById("hiddenEmail");

  function showGlobalMsg(text, kind) {
    if (!recoverMsg) return;
    recoverMsg.textContent = text || "";
    recoverMsg.className = "visible " + (kind === "error" ? "error" : kind === "success" ? "success" : "");
    if (!text) recoverMsg.classList.remove("visible");
  }

  function clearFieldErrors() {
    ["errEmailStep", "errPassword", "errPassword2"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.textContent = "";
    });
  }

  function normalizeEmail(v) {
    return String(v || "").trim().toLowerCase();
  }

  document.getElementById("formEmail").addEventListener("submit", async function (e) {
    e.preventDefault();
    clearFieldErrors();
    showGlobalMsg("", "");

    var email = normalizeEmail(document.getElementById("recoverEmail").value);
    if (!email) {
      document.getElementById("errEmailStep").textContent = "Ingresá un correo.";
      return;
    }

    var btn = document.getElementById("btnCheckEmail");
    btn.disabled = true;
    try {
      await ClubAPI.apiJson("/api/auth/recover/check-email", {
        method: "POST",
        skipAuth: true,
        body: { email: email },
      });
      hiddenEmail.value = email;
      stepEmail.hidden = true;
      stepPassword.hidden = false;
      showGlobalMsg("", "");
    } catch (err) {
      var msg =
        (err && err.data && err.data.message) ||
        err.message ||
        "No se pudo verificar el correo.";
      if (err && err.status === 404) {
        msg = "No se pudo encontrar una cuenta con ese correo electrónico.";
      }
      showGlobalMsg(msg, "error");
    } finally {
      btn.disabled = false;
    }
  });

  function hasLetterAndDigit(pw) {
    return /[a-zA-Z]/.test(pw) && /\d/.test(pw);
  }

  document.getElementById("formPassword").addEventListener("submit", async function (e) {
    e.preventDefault();
    clearFieldErrors();
    showGlobalMsg("", "");

    var email = normalizeEmail(hiddenEmail.value);
    var pw = String(document.getElementById("newPassword").value || "");
    var pw2 = String(document.getElementById("newPassword2").value || "");

    var ok = true;
    if (pw.length < 8) {
      document.getElementById("errPassword").textContent = "Mínimo 8 caracteres.";
      ok = false;
    } else if (!hasLetterAndDigit(pw)) {
      document.getElementById("errPassword").textContent = "Debe incluir letras y números.";
      ok = false;
    }
    if (pw !== pw2) {
      document.getElementById("errPassword2").textContent = "Las contraseñas no coinciden.";
      ok = false;
    }
    if (!ok) return;

    var btn = document.getElementById("btnSetPassword");
    btn.disabled = true;
    try {
      await ClubAPI.apiJson("/api/auth/recover/set-password", {
        method: "POST",
        skipAuth: true,
        body: { email: email, password: pw },
      });
      stepPassword.hidden = true;
      stepDone.hidden = false;
      showGlobalMsg("", "");
    } catch (err) {
      var msg =
        (err && err.data && err.data.message) ||
        err.message ||
        "No se pudo actualizar la contraseña.";
      if (err && err.data && err.data.errors) {
        var er = err.data.errors;
        if (er.password) document.getElementById("errPassword").textContent = er.password;
        if (er.email) document.getElementById("errEmailStep").textContent = er.email;
      }
      showGlobalMsg(msg, "error");
    } finally {
      btn.disabled = false;
    }
  });
})();
