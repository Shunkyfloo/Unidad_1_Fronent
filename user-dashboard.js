(function () {
  function storageKeyRes(userId) {
    return "club_user_reservas_" + String(userId);
  }

  function storageKeyProg(userId) {
    return "club_user_avance_" + String(userId);
  }

  function defaultReservas() {
    return [
      "Yoga — miércoles 10:00 (pendiente)",
      "Funcional — viernes 18:00 (confirmada)",
    ];
  }

  function defaultAvance() {
    return [
      { label: "Asistencia mensual", pct: 65 },
      { label: "Plan de entrenamiento", pct: 40 },
      { label: "Objetivos de la unidad", pct: 80 },
    ];
  }

  function loadJson(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }

  function saveJson(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  }

  function render() {
    var s = ClubAPI.getSession();
    if (!s || !s.user || !s.user.id) return;
    var uid = s.user.id;

    var reservas = loadJson(storageKeyRes(uid), null);
    if (!reservas || !reservas.length) {
      reservas = defaultReservas();
      saveJson(storageKeyRes(uid), reservas);
    }

    var list = document.getElementById("userReservasList");
    if (list) {
      list.innerHTML = "";
      reservas.forEach(function (text) {
        var li = document.createElement("li");
        li.textContent = text;
        list.appendChild(li);
      });
    }

    var avance = loadJson(storageKeyProg(uid), null);
    if (!avance || !avance.length) {
      avance = defaultAvance();
      saveJson(storageKeyProg(uid), avance);
    }

    var wrap = document.getElementById("userAvanceWrap");
    if (wrap) {
      wrap.innerHTML = "";
      avance.forEach(function (item) {
        var pct = Math.max(0, Math.min(100, Number(item.pct) || 0));
        var div = document.createElement("div");
        div.className = "progress-wrap";
        div.innerHTML =
          "<label>" +
          escapeHtml(item.label) +
          "</label><div class=\"progress-bar\"><span style=\"width:" +
          pct +
          '%"></span></div>';
        wrap.appendChild(div);
      });
    }
  }

  function escapeHtml(str) {
    return String(str || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  if (window.ClubAPI) {
    render();
  }
})();
