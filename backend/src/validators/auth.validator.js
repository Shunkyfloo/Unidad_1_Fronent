function validateLoginPayload(payload = {}) {
  const errors = {};

  if (!payload.email || !String(payload.email).trim()) {
    errors.email = 'El correo es obligatorio.';
  }

  if (!payload.password || !String(payload.password).trim()) {
    errors.password = 'La contraseña es obligatoria.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

function validateRecoverEmailPayload(payload = {}) {
  const errors = {};
  const email = String(payload.email || '').trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    errors.email = 'El correo es obligatorio.';
  } else if (!emailRegex.test(email)) {
    errors.email = 'El correo no tiene un formato válido.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    data: { email }
  };
}

function validateRecoverPasswordPayload(payload = {}) {
  const errors = {};
  const email = String(payload.email || '').trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    errors.email = 'El correo es obligatorio.';
  } else if (!emailRegex.test(email)) {
    errors.email = 'El correo no tiene un formato válido.';
  }

  const password = String(payload.password || '');
  if (!password) {
    errors.password = 'La contraseña es obligatoria.';
  } else if (password.length < 8) {
    errors.password = 'La contraseña debe tener mínimo 8 caracteres.';
  } else if (!/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
    errors.password = 'La contraseña debe incluir letras y números.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    data: { email, password }
  };
}

module.exports = {
  validateLoginPayload,
  validateRecoverEmailPayload,
  validateRecoverPasswordPayload
};
