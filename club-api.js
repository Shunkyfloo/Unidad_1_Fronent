(function (global) {
  const API_BASE = "http://localhost:3000";
  const STORAGE_KEY = "clubdeportivo_auth";

  function getSession() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || !parsed.token || !parsed.user) return null;
      return parsed;
    } catch {
      return null;
    }
  }

  function setSession(token, user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user }));
    localStorage.removeItem("user");
  }

  function clearSession() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem("user");
  }

  async function apiJson(path, options) {
    options = options || {};
    const skipAuth = options.skipAuth === true;
    const explicitToken = Object.prototype.hasOwnProperty.call(options, "token") ? options.token : undefined;

    const headers = Object.assign({ "Content-Type": "application/json" }, options.headers || {});
    if (!skipAuth) {
      const tok = explicitToken !== undefined ? explicitToken : getSession() && getSession().token;
      if (tok) headers.Authorization = "Bearer " + tok;
    }

    const init = Object.assign({}, options, { headers: headers });
    delete init.skipAuth;
    delete init.token;
    if (init.body && typeof init.body === "object" && !(init.body instanceof FormData)) {
      init.body = JSON.stringify(init.body);
    }
    const res = await fetch(API_BASE + path, init);
    const data = await res.json().catch(function () {
      return {};
    });
    if (!res.ok) {
      const err = new Error(data.message || "Error en la solicitud");
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return data;
  }

  global.ClubAPI = {
    API_BASE: API_BASE,
    getSession: getSession,
    setSession: setSession,
    clearSession: clearSession,
    apiJson: apiJson,
  };
})(typeof window !== "undefined" ? window : globalThis);
