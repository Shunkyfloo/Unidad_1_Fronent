(function () {
  var dialog = document.getElementById("profileDialog");
  if (!dialog || !window.ClubAPI) return;

  var fullNameEl = document.getElementById("pfFullName");
  var emailEl = document.getElementById("pfEmail");
  var birthEl = document.getElementById("pfBirthDate");
  var passEl = document.getElementById("pfPassword");
  var msgEl = document.getElementById("pfMsg");

  function showPfMsg(text, isError) {
    if (!msgEl) return;
    msgEl.textContent = text || "";
    msgEl.style.color = isError ? "#fca5a5" : "#86efac";
  }

  function openDialog() {
    var s = ClubAPI.getSession();
    if (!s || !s.user) return;
    var u = s.user;
    if (fullNameEl) fullNameEl.value = u.full_name || "";
    if (emailEl) emailEl.value = u.email || "";
    if (birthEl) birthEl.value = u.birth_date || "";
    if (passEl) passEl.value = "";
    showPfMsg("", false);
    if (dialog.showModal) dialog.showModal();
    else dialog.setAttribute("open", "open");
  }

  document.querySelectorAll(".js-open-profile").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      openDialog();
    });
  });

  var cancelBtn = document.getElementById("pfCancel");
  if (cancelBtn) {
    cancelBtn.addEventListener("click", function () {
      if (dialog.close) dialog.close();
      else dialog.removeAttribute("open");
    });
  }

  var saveBtn = document.getElementById("pfSave");
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
          showPfMsg("La contraseña debe tener al menos 8 caracteres.", true);
          return;
        }
        if (!/[a-zA-Z]/.test(passEl.value) || !/\d/.test(passEl.value)) {
          showPfMsg("La contraseña debe incluir letras y números.", true);
          return;
        }
        body.password = passEl.value;
      }

      saveBtn.disabled = true;
      try {
        var res = await ClubAPI.apiJson("/api/users/" + encodeURIComponent(s.user.id), {
          method: "PUT",
          token: s.token,
          headers: { "Content-Type": "application/json" },
          body: body,
        });
        if (res && res.ok && res.data) {
          ClubAPI.setSession(s.token, res.data);
          showPfMsg("Perfil actualizado.", false);
          var nameHeader = document.getElementById("userName");
          if (nameHeader) nameHeader.textContent = res.data.full_name || res.data.email;
          var pfN = document.getElementById("profileFullName");
          var pfE = document.getElementById("profileEmail");
          var pfB = document.getElementById("profileBirthDate");
          if (pfN) pfN.textContent = res.data.full_name || "—";
          if (pfE) pfE.textContent = res.data.email || "—";
          if (pfB) pfB.textContent = res.data.birth_date || "—";
          setTimeout(function () {
            if (dialog.close) dialog.close();
          }, 600);
        }
      } catch (err) {
        var m = (err && err.data && err.data.message) || err.message || "No se pudo guardar.";
        showPfMsg(m, true);
      } finally {
        saveBtn.disabled = false;
      }
    });
  }
})();
