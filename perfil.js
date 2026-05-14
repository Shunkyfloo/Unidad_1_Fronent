(function () {
  if (!window.ClubAPI) return;

  var fullNameEl = document.getElementById("pfFullName");
  var emailEl = document.getElementById("pfEmail");
  var birthEl = document.getElementById("pfBirthDate");
  var passEl = document.getElementById("pfPassword");
  var msgEl = document.getElementById("pfMsg");
  var saveBtn = document.getElementById("pfSave");
  var linkVolver = document.getElementById("linkVolverPanel");

  var dashByRole = {
    user: "user-dashboard.html",
    coach: "coach-dashboard.html",
    admin: "admin-dashboard.html",
  };

  var s0 = ClubAPI.getSession();
  if (linkVolver && s0 && s0.user && s0.user.role && dashByRole[s0.user.role]) {
    linkVolver.href = dashByRole[s0.user.role];
  }

  function showMsg(text, isError) {
    if (!msgEl) return;
    msgEl.textContent = text || "";
    msgEl.className = "msg " + (isError ? "err" : "ok");
  }

  function fillForm(u) {
    if (fullNameEl) fullNameEl.value = (u && u.full_name) || "";
    if (emailEl) emailEl.value = (u && u.email) || "";
    if (birthEl) birthEl.value = (u && u.birth_date) || "";
    if (passEl) passEl.value = "";
  }

  async function initForm() {
    var s = ClubAPI.getSession();
    if (!s || !s.token) return;
    try {
      var res = await ClubAPI.apiJson("/api/auth/me", { method: "GET", token: s.token });
      if (res && res.ok && res.data) {
        ClubAPI.setSession(s.token, res.data);
        fillForm(res.data);
        var nameH = document.getElementById("userName");
        if (nameH) nameH.textContent = res.data.full_name || res.data.email || "Usuario";
        if (linkVolver && res.data.role) {
          linkVolver.href = dashByRole[res.data.role] || "index.html";
        }
      }
    } catch (e) {
      showMsg((e && e.data && e.data.message) || e.message || "No se pudo cargar el perfil.", true);
    }
  }

  if (linkVolver && !linkVolver.getAttribute("href")) {
    linkVolver.href = "index.html";
  }

  if (saveBtn) {
    saveBtn.addEventListener("click", async function () {
      var s = ClubAPI.getSession();
      if (!s || !s.token || !s.user) return;

      var body = {};
      if (fullNameEl && fullNameEl.value.trim()) body.full_name = fullNameEl.value.trim();
      if (emailEl && emailEl.value.trim()) body.email = emailEl.value.trim().toLowerCase();
      if (birthEl && birthEl.value) body.birth_date = birthEl.value;
      else if (birthEl) body.birth_date = null;
      if (passEl && passEl.value) {
        if (passEl.value.length < 8) {
          showMsg("La contraseña debe tener al menos 8 caracteres.", true);
          return;
        }
        if (!/[a-zA-Z]/.test(passEl.value) || !/\d/.test(passEl.value)) {
          showMsg("La contraseña debe incluir letras y números.", true);
          return;
        }
        body.password = passEl.value;
      }

      saveBtn.disabled = true;
      showMsg("Guardando…", false);
      try {
        var res = await ClubAPI.apiJson("/api/users/" + encodeURIComponent(s.user.id), {
          method: "PUT",
          token: s.token,
          body: body,
        });
        if (res && res.ok && res.data) {
          ClubAPI.setSession(s.token, res.data);
          fillForm(res.data);
          showMsg("Perfil actualizado correctamente.", false);
        }
      } catch (err) {
        showMsg((err && err.data && err.data.message) || err.message || "No se pudo guardar.", true);
      } finally {
        saveBtn.disabled = false;
      }
    });
  }

  initForm();
})();
