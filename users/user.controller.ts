import express, { Request, Response, NextFunction } from "express";
import Joi, { Schema } from "joi";
import validateRequest from "../_middleware/validate-request";
import { Role } from "../_helpers/role";
import { userService } from "../users/user.service";

const router = express.Router();

// Routes
router.get("/", getAll);
router.get("/:id", getById);
router.post("/", createSchema, create);
router.put("/:id", updateSchema, update);
router.delete("/:id", _delete);

export default router;

// Route functions
async function getAll(req: Request, res: Response, next: NextFunction) {
  try {
    const users = await userService.getAll();
    res.json(users);
  } catch (err) {
    next(err);
  }
}

async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await userService.getById(Number(req.params.id)); // Ensure ID is a number
    res.json(user);
  } catch (err) {
    next(err);
  }
}

async function create(req: Request, res: Response, next: NextFunction) {
  try {
    await userService.create(req.body);
    res.status(201).json({ message: "User created" });
  } catch (err) {
    next(err);
  }
}

async function update(req: Request, res: Response, next: NextFunction) {
  try {
    await userService.update(Number(req.params.id), req.body);
    res.json({ message: "User updated" });
  } catch (err) {
    next(err);
  }
}

async function _delete(req: Request, res: Response, next: NextFunction) {
  try {
    await userService.delete(Number(req.params.id));
    res.json({ message: "User deleted" });
  } catch (err) {
    next(err);
  }
}

// Schema functions
function createSchema(req: Request, res: Response, next: NextFunction) {
  const schema: Schema = Joi.object({
    title: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    role: Joi.string().valid(Role.Admin, Role.User).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
  });

  validateRequest(req, next, schema);
}

function updateSchema(req: Request, res: Response, next: NextFunction) {
  const schema: Schema = Joi.object({
    title: Joi.string().allow(""),
    firstName: Joi.string().allow(""),
    lastName: Joi.string().allow(""),
    role: Joi.string().valid(Role.Admin, Role.User).allow(""),
    email: Joi.string().email().allow(""),
    password: Joi.string().min(6).allow(""),
    confirmPassword: Joi.string().valid(Joi.ref("password")).allow(""),
  }).with("password", "confirmPassword");

  validateRequest(req, next, schema);
}
