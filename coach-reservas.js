(function () {
  var KEY_R = "club_coach_reservas";
  var KEY_O = "club_coach_roster";

  function load(key) {
    try {
      var r = localStorage.getItem(key);
      return r ? JSON.parse(r) : [];
    } catch (e) {
      return [];
    }
  }

  function save(key, arr) {
    localStorage.setItem(key, JSON.stringify(arr));
  }

  function uid() {
    return String(Date.now());
  }

  function renderReservas() {
    var rows = load(KEY_R);
    var tb = document.getElementById("tblReservas");
    if (!tb) return;
    tb.innerHTML = "";
    if (!rows.length) {
      var tr = document.createElement("tr");
      var td = document.createElement("td");
      td.colSpan = 5;
      td.textContent = "No hay reservas. Pulsa «Nueva reserva».";
      tr.appendChild(td);
      tb.appendChild(tr);
      return;
    }
    rows.forEach(function (r) {
      var tr = document.createElement("tr");
      tr.innerHTML =
        "<td>" +
        esc(r.titulo) +
        "</td><td>" +
        esc(r.fecha) +
        "</td><td>" +
        esc(r.cupo) +
        "</td><td>" +
        esc(r.estado) +
        '</td><td><button type="button" class="mini-btn js-ed-r" data-id="' +
        esc(r.id) +
        '">Editar</button> <button type="button" class="mini-btn danger js-del-r" data-id="' +
        esc(r.id) +
        '">Eliminar</button></td>';
      tb.appendChild(tr);
    });
  }

  function renderRoster() {
    var rows = load(KEY_O);
    var tb = document.getElementById("tblRoster");
    if (!tb) return;
    tb.innerHTML = "";
    if (!rows.length) {
      var tr = document.createElement("tr");
      var td = document.createElement("td");
      td.colSpan = 4;
      td.textContent = "Sin registros. Pulsa «Nuevo registro».";
      tr.appendChild(td);
      tb.appendChild(tr);
      return;
    }
    rows.forEach(function (r) {
      var tr = document.createElement("tr");
      tr.innerHTML =
        "<td>" +
        esc(r.nombre) +
        "</td><td>" +
        esc(r.email) +
        "</td><td>" +
        esc(r.nota) +
        '</td><td><button type="button" class="mini-btn js-ed-o" data-id="' +
        esc(r.id) +
        '">Editar</button> <button type="button" class="mini-btn danger js-del-o" data-id="' +
        esc(r.id) +
        '">Eliminar</button></td>';
      tb.appendChild(tr);
    });
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/"/g, "&quot;");
  }

  var formR = document.getElementById("formReserva");
  document.getElementById("btnNuevaReserva").addEventListener("click", function () {
    document.getElementById("frId").value = "";
    document.getElementById("frTitulo").value = "";
    document.getElementById("frFecha").value = "";
    document.getElementById("frCupo").value = "";
    document.getElementById("frEstado").value = "";
    formR.style.display = "grid";
  });

  document.getElementById("frCancel").addEventListener("click", function () {
    formR.style.display = "none";
  });

  document.getElementById("frSave").addEventListener("click", function () {
    var rows = load(KEY_R);
    var id = document.getElementById("frId").value;
    var row = {
      id: id || uid(),
      titulo: document.getElementById("frTitulo").value.trim(),
      fecha: document.getElementById("frFecha").value,
      cupo: document.getElementById("frCupo").value.trim(),
      estado: document.getElementById("frEstado").value.trim(),
    };
    if (!row.titulo) return;
    if (id) {
      rows = rows.map(function (x) {
        return x.id === id ? row : x;
      });
    } else {
      rows.push(row);
    }
    save(KEY_R, rows);
    formR.style.display = "none";
    renderReservas();
  });

  document.getElementById("tblReservas").addEventListener("click", function (ev) {
    var t = ev.target;
    if (!t.getAttribute) return;
    var id = t.getAttribute("data-id");
    if (!id) return;
    var rows = load(KEY_R);
    if (t.classList.contains("js-del-r")) {
      save(
        KEY_R,
        rows.filter(function (x) {
          return x.id !== id;
        })
      );
      renderReservas();
      return;
    }
    if (t.classList.contains("js-ed-r")) {
      var r = rows.find(function (x) {
        return x.id === id;
      });
      if (!r) return;
      document.getElementById("frId").value = r.id;
      document.getElementById("frTitulo").value = r.titulo || "";
      document.getElementById("frFecha").value = r.fecha || "";
      document.getElementById("frCupo").value = r.cupo || "";
      document.getElementById("frEstado").value = r.estado || "";
      formR.style.display = "grid";
    }
  });

  var formO = document.getElementById("formRoster");
  document.getElementById("btnNuevoParticipante").addEventListener("click", function () {
    document.getElementById("roId").value = "";
    document.getElementById("roNombre").value = "";
    document.getElementById("roEmail").value = "";
    document.getElementById("roNota").value = "";
    formO.style.display = "grid";
  });

  document.getElementById("roCancel").addEventListener("click", function () {
    formO.style.display = "none";
  });

  document.getElementById("roSave").addEventListener("click", function () {
    var rows = load(KEY_O);
    var id = document.getElementById("roId").value;
    var row = {
      id: id || uid(),
      nombre: document.getElementById("roNombre").value.trim(),
      email: document.getElementById("roEmail").value.trim(),
      nota: document.getElementById("roNota").value.trim(),
    };
    if (!row.nombre) return;
    if (id) {
      rows = rows.map(function (x) {
        return x.id === id ? row : x;
      });
    } else {
      rows.push(row);
    }
    save(KEY_O, rows);
    formO.style.display = "none";
    renderRoster();
  });

  document.getElementById("tblRoster").addEventListener("click", function (ev) {
    var t = ev.target;
    if (!t.getAttribute) return;
    var id = t.getAttribute("data-id");
    if (!id) return;
    var rows = load(KEY_O);
    if (t.classList.contains("js-del-o")) {
      save(
        KEY_O,
        rows.filter(function (x) {
          return x.id !== id;
        })
      );
      renderRoster();
      return;
    }
    if (t.classList.contains("js-ed-o")) {
      var r = rows.find(function (x) {
        return x.id === id;
      });
      if (!r) return;
      document.getElementById("roId").value = r.id;
      document.getElementById("roNombre").value = r.nombre || "";
      document.getElementById("roEmail").value = r.email || "";
      document.getElementById("roNota").value = r.nota || "";
      formO.style.display = "grid";
    }
  });

  if (!localStorage.getItem(KEY_R)) {
    save(KEY_R, [
      { id: "seed-r-1", titulo: "Funcional — martes 19:00", fecha: "2026-05-20", cupo: "12/15", estado: "Activa" },
    ]);
  }
  if (!localStorage.getItem(KEY_O)) {
    save(KEY_O, [
      { id: "seed-o-1", nombre: "Grupo mañana", email: "grupo1@ejemplo.cl", nota: "Técnica" },
    ]);
  }
  renderReservas();
  renderRoster();
})();
