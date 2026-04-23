(function () {
  function safeParse(value) {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }

  const user = safeParse(localStorage.getItem("user"));
  if (!user || !user.role || !user.name) {
    window.location.href = "index.html";
    return;
  }

  const nameEl = document.getElementById("userName");
  if (nameEl) nameEl.textContent = user.name;

  const logoutEl = document.getElementById("logout");
  if (logoutEl) {
    logoutEl.addEventListener("click", function (e) {
      e.preventDefault();
      localStorage.removeItem("user");
      window.location.href = "index.html";
    });
  }
})();

