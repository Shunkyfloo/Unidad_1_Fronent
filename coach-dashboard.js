(function () {
  var KEY_R = "club_coach_reservas";
  var KEY_O = "club_coach_roster";

  function load(key, fallback) {
    try {
      var r = localStorage.getItem(key);
      if (!r) return fallback;
      return JSON.parse(r);
    } catch (e) {
      return fallback;
    }
  }

  function seedIfEmpty() {
    var r = load(KEY_R, null);
    if (!r || !r.length) {
      r = [
        { id: "1", titulo: "Funcional — martes 19:00", fecha: "2026-05-20", cupo: "12/15", estado: "Activa" },
        { id: "2", titulo: "Spinning — sábado 09:00", fecha: "2026-05-17", cupo: "8/10", estado: "Activa" },
      ];
      localStorage.setItem(KEY_R, JSON.stringify(r));
    }
    var o = load(KEY_O, null);
    if (!o || !o.length) {
      o = [
        { id: "1", nombre: "Grupo mañana", email: "grupo1@ejemplo.cl", nota: "Enfasis en técnica" },
      ];
      localStorage.setItem(KEY_O, JSON.stringify(o));
    }
  }

  function render() {
    seedIfEmpty();
    var r = load(KEY_R, []);
    var ul = document.getElementById("coachResumenReservas");
    if (ul) {
      ul.innerHTML = "";
      r.slice(0, 4).forEach(function (row) {
        var li = document.createElement("li");
        li.textContent = row.titulo + " — " + (row.fecha || "") + " (" + (row.estado || "") + ")";
        ul.appendChild(li);
      });
    }
    var o = load(KEY_O, []);
    var wrap = document.getElementById("coachResumenAvance");
    if (wrap) {
      var n = Math.min(5, o.length);
      var pct = o.length ? Math.round((n / Math.max(o.length, 1)) * 100) : 50;
      wrap.innerHTML =
        '<div class="progress-wrap"><label>Participantes registrados en listas</label><div class="progress-bar"><span style="width:' +
        pct +
        '%"></span></div></div><p style="font-size:13px;color:#94a3b8;margin-top:8px;">' +
        o.length +
        " grupo(s) en organización local (demo).</p>";
    }
  }

  if (window.ClubAPI) render();
})();
