(function () {
  const roleToDashboard = {
    user: "user-dashboard.html",
    coach: "coach-dashboard.html",
    admin: "admin-dashboard.html",
  };

  const pathToRequiredRole = {
    "user-dashboard.html": "user",
    "coach-dashboard.html": "coach",
    "admin-dashboard.html": "admin",
    "admin-perfiles.html": "admin",
    "coach-reservas.html": "coach",
  };

  function pageFile() {
    const parts = String(window.location.pathname || "").split("/");
    return parts[parts.length - 1] || "";
  }

  function requiredRoleForPage() {
    return pathToRequiredRole[pageFile()] || null;
  }

  function redirectToRoleDashboard(role) {
    const target = roleToDashboard[role];
    if (target) window.location.replace(target);
    else window.location.replace("index.html");
  }

  async function refreshMe() {
    const session = ClubAPI.getSession();
    if (!session || !session.token) return null;
    const res = await ClubAPI.apiJson("/api/auth/me", { method: "GET", token: session.token });
    if (res && res.ok && res.data) {
      ClubAPI.setSession(session.token, res.data);
      return res.data;
    }
    return null;
  }

  function bindLogout() {
    const logoutEl = document.getElementById("logout");
    if (logoutEl) {
      logoutEl.addEventListener("click", function (e) {
        e.preventDefault();
        ClubAPI.clearSession();
        window.location.href = "index.html";
      });
    }
  }

  function setUserName(user) {
    const nameEl = document.getElementById("userName");
    if (nameEl) nameEl.textContent = user.full_name || user.name || user.email || "Usuario";
  }

  function fillProfileSummary(user) {
    var n = document.getElementById("profileFullName");
    var em = document.getElementById("profileEmail");
    var bd = document.getElementById("profileBirthDate");
    if (n) n.textContent = user.full_name || "—";
    if (em) em.textContent = user.email || "—";
    if (bd) bd.textContent = user.birth_date || "—";
  }

  async function init() {
    var session = ClubAPI.getSession();
    if (!session || !session.token) {
      ClubAPI.clearSession();
      window.location.href = "index.html";
      return;
    }

    var user = session.user;
    try {
      user = await refreshMe();
    } catch (e) {
      ClubAPI.clearSession();
      window.location.href = "index.html";
      return;
    }

    if (!user || !user.role) {
      ClubAPI.clearSession();
      window.location.href = "index.html";
      return;
    }

    var page = pageFile();
    if (page === "perfil.html") {
      setUserName(user);
      bindLogout();
      return;
    }

    var required = requiredRoleForPage();
    if (required && user.role !== required) {
      redirectToRoleDashboard(user.role);
      return;
    }

    setUserName(user);
    fillProfileSummary(user);
    bindLogout();
  }

  init();
})();
