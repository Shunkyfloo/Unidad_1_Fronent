const userRepository = require('../repositories/user.repository');

async function listUsers(filters = {}) {
  return userRepository.findAll(filters);
}

async function getUserById(id) {
  const user = await userRepository.findById(id);
  if (!user) {
    const error = new Error('Usuario no encontrado.');
    error.statusCode = 404;
    throw error;
  }
  return user;
}

async function createUser(payload) {
  const existingUser = await userRepository.findByEmail(payload.email);
  if (existingUser) {
    const error = new Error('Ya existe un usuario con ese correo.');
    error.statusCode = 409;
    throw error;
  }

  return userRepository.create(payload);
}

async function updateUser(id, payload) {
  const currentUser = await userRepository.findById(id);
  if (!currentUser) {
    const error = new Error('Usuario no encontrado.');
    error.statusCode = 404;
    throw error;
  }

  if (payload.email && payload.email !== currentUser.email) {
    const existingUser = await userRepository.findByEmail(payload.email);
    if (existingUser) {
      const error = new Error('Ya existe un usuario con ese correo.');
      error.statusCode = 409;
      throw error;
    }
  }

  return userRepository.updateById(id, payload);
}

async function deleteUser(id) {
  const currentUser = await userRepository.findById(id);
  if (!currentUser) {
    const error = new Error('Usuario no encontrado.');
    error.statusCode = 404;
    throw error;
  }
  await userRepository.deleteById(id);
  return true;
}

async function checkEmailRegistered(email) {
  const normalized = String(email || '').trim().toLowerCase();
  const user = await userRepository.findByEmail(normalized);
  return !!user;
}

async function setPasswordByEmail(email, plainPassword) {
  const normalized = String(email || '').trim().toLowerCase();
  const user = await userRepository.findByEmail(normalized);
  if (!user) {
    const error = new Error('No se pudo encontrar una cuenta con ese correo electrónico.');
    error.statusCode = 404;
    throw error;
  }
  return userRepository.updateById(user.id, { password: plainPassword });
}

module.exports = {
  listUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  checkEmailRegistered,
  setPasswordByEmail
};
