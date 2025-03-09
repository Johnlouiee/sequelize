const bcrypt = require('bcryptjs');
const db = require('_helpers/db');

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: _delete
};

// Get all users
async function getAll() {
  return await db.User.findAll();
}

// Get user by ID
async function getById(id) {
  return await getUser(id);
}

// Create a new user
async function create(params) {
  // Validate if email is already registered
  if (await db.User.findOne({ where: { email: params.email } })) {
    throw 'Email "' + params.email + '" is already registered';
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(params.password, 10);

  // Create the user
  const user = new db.User({
    ...params,
    passwordHash: hashedPassword
  });

  // Save the user to the database
  await user.save();
}

// Update an existing user
async function update(id, params) {
  const user = await getUser(id);

  // Validate if email is already taken (if email is being updated)
  if (params.email && user.email !== params.email) {
    if (await db.User.findOne({ where: { email: params.email } })) {
      throw 'Email "' + params.email + '" is already registered';
    }
  }

  // Hash the password if it's being updated
  if (params.password) {
    params.passwordHash = await bcrypt.hash(params.password, 10);
  }

  // Copy params to user and save
  Object.assign(user, params);
  await user.save();
}

// Delete a user
async function _delete(id) {
  const user = await getUser(id);
  await user.destroy();
}

// Helper function to get a user by ID
async function getUser(id) {
  const user = await db.User.findByPk(id);
  if (!user) throw 'User not found';
  return user;
}