(function () {
  var tbody = document.getElementById("usersTableBody");
  if (!tbody || !window.ClubAPI) return;

  var statusEl = document.getElementById("adminUsersStatus");
  var filterRole = document.getElementById("filterRole");

  function setStatus(text, isError) {
    if (!statusEl) return;
    statusEl.textContent = text || "";
    statusEl.style.color = isError ? "#fca5a5" : "#94a3b8";
  }

  async function loadUsers() {
    var s = ClubAPI.getSession();
    if (!s || !s.token) return;
    setStatus("Cargando usuarios…", false);
    tbody.innerHTML = "";
    try {
      var q = filterRole && filterRole.value ? "?role=" + encodeURIComponent(filterRole.value) : "";
      var res = await ClubAPI.apiJson("/api/users" + q, { method: "GET", token: s.token });
      var list = (res && res.data) || [];
      var statEl = document.getElementById("statTotalUsers");
      if (statEl) statEl.textContent = String(list.length);
      if (!list.length) {
        var tr = document.createElement("tr");
        var td = document.createElement("td");
        td.colSpan = 5;
        td.textContent = "No hay usuarios para mostrar.";
        tr.appendChild(td);
        tbody.appendChild(tr);
        setStatus("", false);
        return;
      }
      list.forEach(function (u) {
        var row = document.createElement("tr");
        row.innerHTML =
          "<td>" +
          u.id +
          "</td><td>" +
          escapeHtml(u.full_name) +
          "</td><td>" +
          escapeHtml(u.email) +
          "</td><td>" +
          escapeHtml(u.role) +
          '</td><td><button type="button" class="mini-btn js-edit" data-id="' +
          u.id +
          '">Editar</button> <button type="button" class="mini-btn danger js-del" data-id="' +
          u.id +
          '">Eliminar</button></td>';
        tbody.appendChild(row);
      });
      setStatus(list.length + " usuarios.", false);
    } catch (e) {
      setStatus((e && e.data && e.data.message) || e.message || "Error al cargar.", true);
    }
  }

  function escapeHtml(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  var dlg = document.getElementById("adminUserDialog");
  var dlgTitle = document.getElementById("adminDlgTitle");
  var fId = document.getElementById("admUserId");
  var fName = document.getElementById("admFullName");
  var fEmail = document.getElementById("admEmail");
  var fRole = document.getElementById("admRole");
  var fPass = document.getElementById("admPassword");
  var dlgMsg = document.getElementById("admDlgMsg");

  function openCreate() {
    dlgTitle.textContent = "Nuevo usuario";
    fId.value = "";
    fName.value = "";
    fEmail.value = "";
    fRole.value = "user";
    fPass.value = "";
    dlgMsg.textContent = "";
    if (dlg.showModal) dlg.showModal();
  }

  function openEdit(u) {
    dlgTitle.textContent = "Editar usuario";
    fId.value = u.id;
    fName.value = u.full_name || "";
    fEmail.value = u.email || "";
    fRole.value = u.role || "user";
    fPass.value = "";
    dlgMsg.textContent = "";
    if (dlg.showModal) dlg.showModal();
  }

  var newBtn = document.getElementById("btnNewUser");
  if (newBtn) {
    newBtn.addEventListener("click", function () {
      openCreate();
    });
  }

  if (filterRole) {
    filterRole.addEventListener("change", loadUsers);
  }

  tbody.addEventListener("click", async function (ev) {
    var t = ev.target;
    if (!t || !t.getAttribute) return;
    var id = t.getAttribute("data-id");
    if (!id) return;
    var s = ClubAPI.getSession();
    if (!s || !s.token) return;

    if (t.classList.contains("js-del")) {
      if (!confirm("¿Eliminar este usuario? Esta acción no se puede deshacer.")) return;
      try {
        await ClubAPI.apiJson("/api/users/" + encodeURIComponent(id), {
          method: "DELETE",
          token: s.token,
        });
        await loadUsers();
      } catch (e) {
        setStatus((e && e.data && e.data.message) || e.message || "Error al eliminar.", true);
      }
      return;
    }

    if (t.classList.contains("js-edit")) {
      try {
        var res = await ClubAPI.apiJson("/api/users/" + encodeURIComponent(id), {
          method: "GET",
          token: s.token,
        });
        if (res && res.data) openEdit(res.data);
      } catch (e) {
        setStatus((e && e.data && e.data.message) || e.message || "Error al obtener usuario.", true);
      }
    }
  });

  document.getElementById("admDlgCancel").addEventListener("click", function () {
    if (dlg.close) dlg.close();
  });

  document.getElementById("admDlgSave").addEventListener("click", async function () {
    var s = ClubAPI.getSession();
    if (!s || !s.token) return;
    dlgMsg.textContent = "";
    var id = fId.value;
    var body = {
      full_name: fName.value.trim(),
      email: fEmail.value.trim().toLowerCase(),
      role: fRole.value,
    };
    if (fPass.value) body.password = fPass.value;

    var btn = document.getElementById("admDlgSave");
    btn.disabled = true;
    try {
      if (!id) {
        if (!body.password || body.password.length < 8) {
          dlgMsg.textContent = "La contraseña es obligatoria para usuarios nuevos (mín. 8 caracteres).";
          btn.disabled = false;
          return;
        }
        await ClubAPI.apiJson("/api/users", {
          method: "POST",
          token: s.token,
          headers: { "Content-Type": "application/json" },
          body: body,
        });
      } else {
        var partial = {
          full_name: body.full_name,
          email: body.email,
          role: body.role,
        };
        if (body.password) partial.password = body.password;
        await ClubAPI.apiJson("/api/users/" + encodeURIComponent(id), {
          method: "PUT",
          token: s.token,
          headers: { "Content-Type": "application/json" },
          body: partial,
        });
      }
      if (dlg.close) dlg.close();
      await loadUsers();
    } catch (e) {
      var m = (e && e.data && e.data.message) || e.message || "Error al guardar.";
      if (e && e.status === 0) {
        m = e.message || m;
      }
      if (e && e.data && e.data.errors && typeof e.data.errors === "object") {
        var parts = Object.values(e.data.errors).filter(Boolean);
        if (parts.length) m = parts.join(" ");
      }
      dlgMsg.textContent = m;
    } finally {
      btn.disabled = false;
    }
  });

  loadUsers();
})();
