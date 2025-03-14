import bcrypt from "bcryptjs";
import { db } from "../_helpers/db"; 
import { User } from "../users/user.model"; 

// Service methods
export const userService = {
  getAll,
  getById,
  create,
  update,
  delete: deleteUser, // Renamed to avoid conflict
};

// Get all users
async function getAll(): Promise<User[]> {
  return await db.User.findAll();
}

// Get user by ID
async function getById(id: number): Promise<User> {
  return await getUser(id);
}

// Create a new user
async function create(params: Partial<User>): Promise<void> {
  // Validate if email is already registered
  if (await db.User.findOne({ where: { email: params.email } })) {
    throw new Error(`Email "${params.email}" is already registered`);
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(params.passwordHash!, 10);

  // Create the user
  await db.User.create({
    ...params,
    passwordHash: hashedPassword, // Match model's field
  });
}

// Update an existing user
async function update(id: number, params: Partial<User>): Promise<void> {
  const user = await getUser(id);

  // Validate if email is already taken (if email is being updated)
  if (params.email && user.email !== params.email) {
    if (await db.User.findOne({ where: { email: params.email } })) {
      throw new Error(`Email "${params.email}" is already registered`);
    }
  }

  // Hash the password if it's being updated
  if (params.passwordHash) {
    params.passwordHash = await bcrypt.hash(params.passwordHash, 10);
  }

  // Update user
  await user.update(params);
}

// ✅ Fixed deleteUser function
async function deleteUser(id: number): Promise<void> {
  const user = await getUser(id);
  if (!user) {
    throw new Error(`User with ID ${id} not found`); // Avoid calling destroy() on null
  }
  await user.destroy();
}

// ✅ Fixed getUser function
async function getUser(id: number): Promise<User> {
  const user = await db.User.findByPk(id);
  if (!user) throw new Error(`User with ID ${id} not found`); // Explicit error handling
  return user;
}
